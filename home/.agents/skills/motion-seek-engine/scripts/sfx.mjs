#!/usr/bin/env node
// sfx.mjs — synthesize UI sounds from code, so audio lands on the beat grid
// without a sample library.
//
//   node sfx.mjs cues.json out/sfx.wav
//
// cues.json: [{ "t": 0.5, "type": "click", "gain": 1 }, ...]
// types: click · pop · thump · whoosh · tick · riser
//
// Deterministic noise (LCG, not Math.random) so a re-render is byte-identical.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const SR = 48000;
const cues = JSON.parse(readFileSync(resolve(process.argv[2]), 'utf8'));
const outPath = resolve(process.argv[3] ?? 'out/sfx.wav');

let s = 42;
const noise = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2147483648 - 1);

// [durationSeconds, sampleFn(t) -> sample]
const VOICES = {
  click: [0.05, (t) => Math.sin(2 * Math.PI * 1800 * t) * Math.exp(-t * 90) * 0.5],
  tick: [0.03, (t) => Math.sin(2 * Math.PI * 3200 * t) * Math.exp(-t * 160) * 0.35],
  pop: [0.15, (t) => Math.sin(2 * Math.PI * (600 + 900 * t) * t) * Math.exp(-t * 30) * 0.4],
  thump: [0.5, (t) => Math.sin(2 * Math.PI * (90 - 60 * t) * t) * Math.exp(-t * 9) * 0.9],
  whoosh: [0.35, (t) => noise() * Math.sin(Math.PI * Math.min(1, t / 0.35)) * 0.25],
  riser: [1.2, (t) => noise() * (t / 1.2) ** 2 * 0.3],
};

if (!cues.length) throw new Error('no cues');

const end = Math.max(...cues.map((c) => c.t + (VOICES[c.type]?.[0] ?? 0.2))) + 0.5;
const buf = new Float32Array(Math.ceil(end * SR));

for (const c of cues) {
  const voice = VOICES[c.type];
  if (!voice) throw new Error(`unknown sfx type: ${c.type}`);
  const [len, fn] = voice;
  const gain = c.gain ?? 1;
  const start = Math.floor(c.t * SR);
  for (let i = 0; i < len * SR && start + i < buf.length; i++) buf[start + i] += fn(i / SR) * gain;
}

let peak = 0;
for (const v of buf) peak = Math.max(peak, Math.abs(v));
const norm = peak > 0 ? 0.89 / peak : 1; // leave headroom; the mix stage sets LUFS

// 16-bit mono WAV
const n = buf.length;
const b = Buffer.alloc(44 + n * 2);
b.write('RIFF', 0);
b.writeUInt32LE(36 + n * 2, 4);
b.write('WAVEfmt ', 8);
b.writeUInt32LE(16, 16);
b.writeUInt16LE(1, 20);
b.writeUInt16LE(1, 22);
b.writeUInt32LE(SR, 24);
b.writeUInt32LE(SR * 2, 28);
b.writeUInt16LE(2, 32);
b.writeUInt16LE(16, 34);
b.write('data', 36);
b.writeUInt32LE(n * 2, 40);
for (let i = 0; i < n; i++) b.writeInt16LE(Math.round(clamp(buf[i] * norm) * 32767), 44 + i * 2);

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, b);
console.log(`  ${outPath}  ${n} samples @ ${SR}Hz, ${cues.length} cues, peak ${peak.toFixed(2)}`);

function clamp(x) {
  return Math.min(1, Math.max(-1, x));
}