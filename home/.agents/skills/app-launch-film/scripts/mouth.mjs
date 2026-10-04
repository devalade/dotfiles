// Mouth-open curve from a voice track: one value 0..1 per video frame.
// Usage: node mouth.mjs <voice.wav|mp3> <out.json> [--fps 30]
import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'

const [inp, out] = process.argv.slice(2)
if (!inp || !out || inp === '--help') { console.log('node mouth.mjs <voice audio> <out.json> [--fps 30]'); process.exit(inp ? 0 : 1) }
const fi = process.argv.indexOf('--fps'), FPS = fi > 0 ? +process.argv[fi + 1] : 30
const SR = 16000
const raw = execFileSync('ffmpeg', ['-nostdin', '-v', 'error', '-i', inp, '-ac', '1', '-ar', String(SR), '-f', 's16le', '-'], { maxBuffer: 1 << 30 })
const pcm = new Int16Array(raw.buffer, raw.byteOffset, raw.length / 2)
const hop = SR / FPS, n = Math.ceil(pcm.length / hop), rms = new Float32Array(n)
for (let f = 0; f < n; f++) {
  let s = 0, c = 0
  for (let i = Math.floor(f * hop); i < Math.min(pcm.length, (f + 1) * hop); i++) { s += (pcm[i] / 32768) ** 2; c++ }
  rms[f] = Math.sqrt(s / Math.max(1, c))
}
// normalise to the 95th percentile, gate the noise floor, then smooth: fast open, slower close
const sorted = [...rms].sort((a, b) => a - b), p95 = sorted[Math.floor(sorted.length * .95)] || 1
const mouth = []; let v = 0
for (let f = 0; f < n; f++) {
  const target = Math.min(1, Math.max(0, (rms[f] / p95 - .08) / .92))
  v += (target - v) * (target > v ? .7 : .35)
  mouth.push(+v.toFixed(3))
}
writeFileSync(out, JSON.stringify({ fps: FPS, mouth }))
console.log(out, mouth.length, 'frames')
