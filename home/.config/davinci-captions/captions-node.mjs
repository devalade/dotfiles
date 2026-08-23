#!/usr/bin/env node
/**
 * Handy Captions — local transcription pipeline for DaVinci Resolve (free).
 *
 * Media layer:      MediaBunny (mediabunny + @mediabunny/server) — decodes the
 *                   WAV exported by Resolve, resamples to 16 kHz mono, detects
 *                   silence, slices caption-sized chunks and writes chunk WAVs.
 * Transcription:    Handy.app headless CLI (`handy --transcribe-file`) with the
 *                   locally-installed Whisper/Parakeet GGUF model. No cloud, no
 *                   ffmpeg, no network.
 *
 * Why chunking?     Handy's batch CLI returns full text without segment
 *                   timestamps, so cue boundaries come from silence analysis
 *                   (phrases ≤ CUE_MAX_S). Chunks are transcribed individually.
 *
 * Usage:
 *   node captions-node.mjs <in.wav> <out.srt> <out.json>
 *
 * Env overrides:
 *   HANDY_BIN   path to the Handy binary (default: /Applications/Handy.app/...)
 *   HANDY_MODEL model id (default: Parakeet Unified EN 0.6B Q8_0)
 *
 * Output JSON shape: { "audio_secs": n, "cues": [ {start, end, text}, ... ] }
 */
import { registerMediabunnyServer } from '@mediabunny/server';
import {
  Input, WAVE, MP4, QTFF, MP3, WavOutputFormat, FilePathSource, FilePathTarget,
  Output, AudioSampleSink, AudioSampleSource, AudioSample,
} from 'mediabunny';
import { spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

registerMediabunnyServer();

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const HANDY = process.env.HANDY_BIN ?? '/Applications/Handy.app/Contents/MacOS/handy';
const MODEL = process.env.HANDY_MODEL
  ?? 'handy-computer/parakeet-unified-en-0.6b-gguf/parakeet-unified-en-0.6b-Q8_0.gguf';

const TARGET_RATE = 16000;      // Handy requires 16 kHz mono WAV
const VAD_DB = -38;             // silence RMS threshold (dBFS)
const VAD_MIN_S = 0.15;         // min silence length to split on
const CUE_MAX_S = 8.0;          // longest single caption
const RMS_FRAME_S = 0.02;       // VAD analysis window

const log = (...a) => console.error('[captions]', ...a);

// ---------------------------------------------------------------------------
// MediaBunny helpers (validated against mediabunny 0.1.x)
// ---------------------------------------------------------------------------

/** Decode a WAV into interleaved float32 samples. Returns {data, rate, channels}. */
async function decodeWav(wavPath) {
  const input = new Input({ source: new FilePathSource(wavPath), formats: [WAVE, MP4, QTFF, MP3] });
  if (!(await input.canRead())) throw new Error(`Cannot read WAV: ${wavPath}`);
  const track = await input.getPrimaryAudioTrack();
  if (!track) throw new Error(`No audio track in ${wavPath}`);
  const sink = new AudioSampleSink(track);
  const chunks = [];
  let rate = 0, channels = 0;
  for await (const s of sink.samples()) {
    try {
      rate = s.sampleRate; channels = s.numberOfChannels;
      const buf = new Float32Array(s.numberOfFrames * s.numberOfChannels);
      s.copyTo(buf, { format: 'f32', planeIndex: 0 }); // interleaved (stereo-safe)
      chunks.push(buf);
    } finally {
      s.close();
    }
  }
  await input.dispose?.();
  const data = new Float32Array(chunks.reduce((n, c) => n + c.length, 0));
  let off = 0;
  for (const c of chunks) { data.set(c, off); off += c.length; }
  return { data, rate, channels };
}

/** Write f32 samples as a WAV via MediaBunny (no resampling applied). */
async function writeWav(samples, rate, channels, outPath) {
  const out = new Output({ format: new WavOutputFormat(), target: new FilePathTarget(outPath) });
  const src = new AudioSampleSource({ codec: 'pcm-s16', numberOfChannels: channels, sampleRate: rate });
  out.addAudioTrack(src);
  await out.start();
  const sample = new AudioSample({
    data: new Uint8Array(samples.buffer), format: 'f32',
    numberOfChannels: channels, sampleRate: rate, timestamp: 0,
  });
  try {
    await src.add(sample);
  } finally {
    sample.close();
  }
  await out.finalize();
}

/** Transcribe one 16 kHz mono chunk WAV with Handy; returns text or '' on failure. */
function transcribeChunk(chunkWav) {
  const r = spawnSync(HANDY, ['-f', chunkWav, '--json', '--model', MODEL], { encoding: 'utf8' });
  if (r.status !== 0) {
    log(`handy failed on ${chunkWav} (exit ${r.status}):`, (r.stderr || '').slice(-300));
    return '';
  }
  try { return JSON.parse(r.stdout).text?.trim() ?? ''; } catch { return ''; }
}

// ---------------------------------------------------------------------------
// Pass 1: resample / downmix any input WAV to 16 kHz mono via `transform`
// ---------------------------------------------------------------------------
async function to16kMono(inWav, mixWav) {
  const input = new Input({ source: new FilePathSource(inWav), formats: [WAVE, MP4, QTFF, MP3] });
  const track = await input.getPrimaryAudioTrack();
  const sink = new AudioSampleSink(track);
  const out = new Output({ format: new WavOutputFormat(), target: new FilePathTarget(mixWav) });
  const src = new AudioSampleSource({
    codec: 'pcm-s16', numberOfChannels: 1, sampleRate: TARGET_RATE,
    transform: { sampleRate: TARGET_RATE, numberOfChannels: 1 },
  });
  out.addAudioTrack(src);
  await out.start();
  let frames = 0;
  let firstTimestamp = null;
  for await (const s of sink.samples()) {
    try {
      frames += s.numberOfFrames;
      // Resolve's H.264/MP4 audio starts slightly before zero (e.g. -44 ms).
      // MediaBunny's WAV muxer requires non-negative timestamps.
      if (firstTimestamp === null) firstTimestamp = s.timestamp;
      s.setTimestamp(Math.max(0, s.timestamp - firstTimestamp));
      await src.add(s);
    } finally {
      s.close();
    }
  }
  await out.finalize();
  await input.dispose?.();
  return frames / track.sampleRate; // input duration seconds
}

// ---------------------------------------------------------------------------
// Pass 2: silence VAD -> chunks -> Handy -> SRT + cues
// ---------------------------------------------------------------------------
function detectSilences(data, rate) {
  const frame = Math.round(rate * RMS_FRAME_S);
  const nFrames = Math.floor(data.length / frame);
  const threshold = 10 ** (VAD_DB / 20);
  const rmsOf = (w) => {
    let sum = 0;
    for (let i = w * frame; i < (w + 1) * frame; i++) sum += data[i] * data[i];
    return Math.sqrt(sum / frame);
  };
  const silences = [];
  let qStart = -1;
  for (let w = 0; w <= nFrames; w++) {
    const quiet = w < nFrames ? rmsOf(w) < threshold : true;
    if (quiet && qStart < 0) qStart = w;
    else if (!quiet && qStart >= 0) {
      const dur = ((w - qStart) * frame) / rate;
      if (dur >= VAD_MIN_S) silences.push([(qStart * frame) / rate, (w * frame) / rate]);
      qStart = -1;
    }
  }
  return silences;
}

function chunkSpans(spans, totalDur) {
  const out = [];
  let cs = null, ce = null;
  for (const [s, e] of spans) {
    if (cs === null) { cs = s; ce = e; continue; }
    if (e - cs <= CUE_MAX_S) ce = e;
    else { if (ce - cs > 0.2) out.push([cs, ce]); cs = s; ce = e; }
  }
  if (cs !== null && ce - cs > 0.2) out.push([cs, Math.min(ce, totalDur)]);
  return out;
}

function srtTime(t) {
  const ms = Math.round(t * 1000);
  const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60, r = ms % 1000;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(r).padStart(3, '0')}`;
}

/** Split one transcription span into fast, readable captions of at most two words. */
function splitIntoWordCues(start, end, text) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const groups = [];
  let group = [];
  let groupStart = 0;
  const flush = (endWord) => {
    if (group.length) {
      groups.push({ startWord: groupStart, endWord, text: group.join(' ') });
      group = [];
      groupStart = endWord;
    }
  };
  for (let index = 0; index < words.length; index++) {
    const rawWord = words[index];
    const hasComma = /,["')\]]*$/.test(rawWord);
    const endsSentence = /[.!?]["')\]]*$/.test(rawWord);
    // The word immediately before a comma is always shown by itself.
    if (hasComma && group.length) flush(index);
    const displayedWord = rawWord.replace(/[.,!?;:…]/g, '');
    if (displayedWord) group.push(displayedWord);
    if (hasComma || endsSentence || group.length === 2 || index === words.length - 1) {
      flush(index + 1);
    }
  }
  const duration = Math.max(0.01, end - start);
  return groups.map((group) => ({
    start: start + duration * (group.startWord / words.length),
    end: start + duration * (group.endWord / words.length),
    text: group.text,
  }));
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const [inWav, outSrt, outJson] = process.argv.slice(2);
if (!inWav || !outSrt || !outJson) {
  console.error('usage: node captions-node.mjs <in.wav> <out.srt> <out.json>');
  process.exit(2);
}
const workDir = path.dirname(outJson);
mkdirSync(workDir, { recursive: true });

const started = Date.now();
try {
  // Pass 1: 16 kHz mono mix
  const mixWav = path.join(workDir, 'mix-16k.wav');
  log('resampling to 16 kHz mono …');
  const audioSecs = await to16kMono(inWav, mixWav);

  // Pass 2: decode mix, VAD, chunk
  const { data, rate } = await decodeWav(mixWav);
  const silences = detectSilences(data, rate);
  const spans = [];
  let cursor = 0;
  for (const [s, e] of silences) {
    if (s - cursor > 0.05) spans.push([cursor, s]);
    cursor = e;
  }
  if (data.length / rate - cursor > 0.05) spans.push([cursor, data.length / rate]);
  const chunks = chunkSpans(spans, data.length / rate);
  log(`silence runs: ${silences.length}, speech spans: ${spans.length}, chunks: ${chunks.length}`);

  if (chunks.length === 0) {
    log('no speech detected — nothing to transcribe');
    writeFileSync(outSrt, '');
    writeFileSync(outJson, JSON.stringify({ audio_secs: audioSecs, cues: [] }, null, 2));
    process.exit(0);
  }

  // Transcribe each chunk sequentially (Handy already runs 10x+ real-time on Metal)
  const cues = [];
  for (let i = 0; i < chunks.length; i++) {
    const [s, e] = chunks[i];
    const chunkWav = path.join(workDir, `chunk-${String(i).padStart(3, '0')}.wav`);
    const f32 = data.slice(Math.round(s * rate), Math.round(e * rate));
    await writeWav(f32, rate, 1, chunkWav);
    const text = transcribeChunk(chunkWav);
    rmSync(chunkWav, { force: true });
    if (text) cues.push(...splitIntoWordCues(s, Math.min(e, data.length / rate), text));
    log(`[${i + 1}/${chunks.length}] ${s.toFixed(2)}–${e.toFixed(2)}s → ${text ? `${text.length} chars` : 'skipped (empty)'}`);
  }

  // SRT
  const srt = cues.map((c, i) => `${i + 1}\n${srtTime(c.start)} --> ${srtTime(c.end)}\n${c.text}\n`).join('\n');
  writeFileSync(outSrt, srt);
  writeFileSync(outJson, JSON.stringify({ audio_secs: audioSecs, cues }, null, 2));
  rmSync(mixWav, { force: true });

  log(`done: ${cues.length} cues, ${((Date.now() - started) / 1000).toFixed(1)}s total`);
} catch (err) {
  console.error('[captions] failed:', err?.stack ?? err);
  process.exit(1);
}
