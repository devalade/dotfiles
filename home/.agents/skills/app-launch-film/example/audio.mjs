import { writeFileSync } from 'node:fs'
// Score and sound design for "22:47". 100 BPM: beat 0.6 s, bar 2.4 s. D minor at night, F major from the turn.
const SR = 48000, DUR = 48, N = SR * DUR, BEAT = 0.6, BAR = 2.4
const bus = () => [new Float32Array(N), new Float32Array(N)]
const MUS = bus(), SFX = bus(), DRY = bus()
let seed = 2247; const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 } // mulberry32
const hz = m => 440 * Math.pow(2, (m - 69) / 12)
const S = (f, x) => Math.sin(2 * Math.PI * f * x)
const add = (B, t, dur, fn, pan = 0) => {
  const i0 = Math.round(t * SR), n = Math.round(dur * SR), gl = Math.cos((pan + 1) * Math.PI / 4), gr = Math.sin((pan + 1) * Math.PI / 4)
  for (let i = 0; i < n; i++) { const k = i0 + i; if (k < 0 || k >= N) continue; const v = fn(i / SR, i); B[0][k] += v * gl; B[1][k] += v * gr }
}
const env = (x, a, d) => x < a ? x / a : Math.exp(-(x - a) / d)
// one-pole filtered noise source
const noise = () => { let lp = 0, hp = 0, prev = 0; return (cut = .2, hpc = 0) => { const w = rnd() * 2 - 1; lp += cut * (w - lp); const h = lp - prev; prev = lp; hp = hpc ? h : lp; return hp } }

// ---------- instruments ----------
const pad = (B, t, dur, notes, amp, att = .8, rel = 1.2, pan = .3) => notes.forEach((m, k) => {
  const f = hz(m), p = k % 2 ? pan : -pan
  add(B, t, dur + rel, x => { const a = Math.min(1, x / att), r = x > dur ? Math.max(0, 1 - (x - dur) / rel) : 1; return amp * a * a * r * (S(f * .997, x) + S(f * 1.003, x) + .18 * S(f * 2, x) + .05 * S(f * 3, x)) }, p)
})
const kalimba = (B, t, m, amp = .1, pan = 0) => { const f = hz(m); add(B, t, 1.6, x => amp * env(x, .002, .42) * (S(f, x) + .32 * S(f * 5.4, x) * Math.exp(-x / .05) + .12 * S(f * 2, x) * Math.exp(-x / .2)) + amp * .5 * Math.exp(-x / .003) * (rnd() * 2 - 1), pan) }
const bell = (B, t, m, amp = .07, pan = 0) => { const f = hz(m); add(B, t, 2.6, x => amp * env(x, .003, .7) * (S(f, x) + .35 * S(f * 2.76, x) * Math.exp(-x / .2) + .18 * S(f * 5.4, x) * Math.exp(-x / .07)), pan) }
const kick = (t, amp = .5) => add(MUS, t, .5, x => amp * Math.exp(-x / .2) * Math.sin(2 * Math.PI * (48 * x + 110 * .03 * (1 - Math.exp(-x / .03)))))
const rim = (t, amp = .09) => { const nz = noise(); add(MUS, t, .12, x => amp * (Math.exp(-x / .018) * nz(.6, 1) * 1.6 + .6 * Math.exp(-x / .012) * S(420, x)), .15) }
const shaker = (t, amp = .03, pan = .35) => { const nz = noise(); add(MUS, t, .09, x => amp * (x < .008 ? x / .008 : Math.exp(-(x - .008) / .025)) * nz(.9, 1) * 2, pan) }
const bass = (t, m, dur, amp = .11) => { const f = hz(m); add(MUS, t, dur + .08, x => { const r = x > dur ? Math.max(0, 1 - (x - dur) / .08) : 1; return amp * Math.min(1, x / .006) * r * Math.tanh(1.6 * (S(f, x) + .35 * S(f * 2, x))) * (.75 + .25 * Math.exp(-x / .15)) }) }
const buzz = (t, amp = .2) => { // the phone vibrating on the counter, tuned to D
  const f = hz(50); const nz = noise()
  for (const [o, d] of [[0, .2], [.3, .2]]) add(DRY, t + o, d, x => { const e = Math.min(1, x / .015) * Math.min(1, (d - x) / .02); const sq = S(f, x) + .33 * S(f * 3, x) + .2 * S(f * 5, x) + .14 * S(f * 7, x); return amp * e * (sq * (.75 + .25 * S(31, x)) + .5 * nz(.35) * (.5 + .5 * S(f, x))) })
}
const tick = (t, f = 2000, amp = .05) => { const nz = noise(); add(SFX, t, .05, x => amp * Math.exp(-x / .006) * (S(f, x) + .5 * nz(.7, 1)), .1) }
const rtick = (t, f = 1800, amp = .045) => { const nz = noise(); add(SFX, t - .06, .06, x => { const u = x / .06; return amp * Math.pow(u, 3) * (S(f, x) + .5 * nz(.7, 1)) }, -.1) }
const whoosh = (t, dur = .7, amp = .05, up = true) => { const nz = noise(); add(SFX, t - dur * .5, dur, x => { const u = x / dur, c = up ? .03 + .25 * u : .28 - .25 * u; return amp * 4 * nz(c) * Math.sin(Math.PI * u) ** 2 }) }
const swell = (t, dur, amp) => { const nz = noise(); add(MUS, t - dur, dur, x => { const u = x / dur; return amp * u ** 3 * nz(.5 + .4 * u, 1) * 2 }) }
const crash = (t, amp = .06) => { const nz = noise(); add(MUS, t, 3, x => amp * Math.exp(-x / .9) * nz(.85, 1) * 2, 0) }
const boom = (t, amp = .4) => add(MUS, t, 2.4, x => amp * Math.exp(-x / .7) * Math.sin(2 * Math.PI * (hz(29) * x + 30 * .05 * (1 - Math.exp(-x / .05)))))
const key = (t, amp = .03) => { const nz = noise(); add(SFX, t, .04, x => amp * Math.exp(-x / .007) * (nz(.8, 1) * 1.4 + .4 * S(1200 + 300 * rnd(), x)), (rnd() - .5) * .3) }
const voice = (t, dur, amp = .03) => { // a muffled voice note: formant-shaped pulse train with a speech contour
  let ph = 0; const vow = [[700, 1200], [400, 2000], [500, 900], [300, 2300], [600, 1000]]
  add(SFX, t, dur, x => {
    const syl = Math.floor(x / .17), sx = (x % .17) / .17, [f1, f2] = vow[syl % 5]
    const f0 = 190 + 40 * Math.sin(x * 3.1) + 25 * Math.sin(x * 11 + syl)
    ph += f0 / SR; const p = ph % 1, src = Math.exp(-p * 9) - .11
    const e = Math.sin(Math.PI * Math.min(1, sx * 1.15)) ** .6 * (syl % 7 === 6 ? .2 : 1)
    return amp * e * Math.min(1, x / .05) * Math.min(1, (dur - x) / .08) * src * (.9 * S(f1, x) + .5 * S(f2, x))
  }, -.05)
}

// ---------- night: 0 to 12 ----------
add(MUS, 0, 11.6, x => { const a = Math.min(1, x / 1.2) * Math.min(1, (10.5 - x) / .4 + 0); const bend = x > 9.65 ? Math.pow(2, -1.2 * Math.min(1, (x - 9.65) / .8) / 12) : 1; return Math.max(0, a) * .035 * (S(hz(38) * bend, x) + .6 * S(hz(45) * bend, x) + .25 * S(hz(50) * bend, x) * (.6 + .4 * S(.3, x))) })
pad(MUS, 0.3, 4.2, [62, 65, 69], .012, 1.6, 1.4, .4)                 // Dm, very low
pad(MUS, 4.8, 4.6, [58, 62, 65, 69], .012, 1.2, .6, .4)              // Bbmaj7 under the culprit
;[0.3, 2.4, 3.0, 3.6, 4.2].forEach(t => buzz(t, .16))
buzz(7.2, .18); add(MUS, 7.2, 2.2, x => .12 * Math.exp(-x / .8) * S(hz(34), x)) // Bb low under "elle part"
for (let b = 8; b < 16; b++) { const t = b * BEAT; b % 2 ? tick(t, 1600, .035) : tick(t, 2000, .045) }
whoosh(5.65, .6, .03)
// rewind: ticks run backwards and speed up, the room pulls down
for (let i = 0, t = 9.65; i < 22; i++) { rtick(t, 1800 - i * 40, .04); t += .11 * Math.pow(.86, i) }
whoosh(10.0, .8, .045, false)
for (const t of [10.9, 11.05, 11.2]) tick(t, 900, .022)              // typing, someone is answering
swell(12.0, 1.4, .05)

// ---------- product: 12 to 48 ----------
const CH = [ // F, Am, Dm, Bb
  { r: 41, p: [60, 64, 67, 69], k: [65, 69, 72, 77] },
  { r: 45, p: [60, 64, 67, 69], k: [64, 69, 72, 76] },
  { r: 38, p: [57, 60, 65, 69], k: [62, 65, 69, 74] },
  { r: 46, p: [58, 62, 65, 69], k: [65, 70, 74, 77] },
]
const bar = t => CH[Math.floor((t - 12) / BAR + 1e-6) % 4]
const groove = (t0, t1, o = {}) => {
  for (let t = t0; t < t1 - 1e-6; t += BAR) {
    const c = bar(t)
    pad(MUS, t, BAR - .1, c.p, o.padAmp ?? .011, .3, 1.0)
    if (o.bass !== false) { bass(t, c.r, .45); bass(t + .9, c.r, .22, .085); bass(t + 1.5, c.r + 7, .3, .085); bass(t + 2.1, c.r + 12, .2, .07) }
    if (o.drums !== false) {
      for (const k of [0, .9, 1.5]) if (!(o.gap && t + k >= o.gap[0] && t + k < o.gap[1])) kick(t + k, .27)
      for (const r of [.6, 1.8]) if (!(o.gap && t + r >= o.gap[0] && t + r < o.gap[1])) rim(t + r)
    }
    if (o.shaker !== false) for (let j = 0; j < 16; j++) shaker(t + j * .15 + (j % 2 ? .025 : 0), j % 4 === 2 ? .05 : .03)
    if (o.kal) [0, .9, 1.5, 1.8].forEach((k, j) => kalimba(MUS, t + k, c.k[(j + Math.floor((t - 12) / BAR)) % 4] + 12 * (j === 3), .045, j % 2 ? .35 : -.35))
  }
}
// 12.0: the turn lands
boom(12.0, .24); crash(12.0, .035)
pad(MUS, 12.0, 2.3, [53, 57, 60, 64, 67], .016, .05, 1.4)
kalimba(MUS, 12.0, 77, .11); kalimba(MUS, 12.15, 81, .08, .3); kalimba(MUS, 12.3, 84, .07, -.3); bell(MUS, 12.0, 89, .045)
groove(12.0, 14.4, { drums: false, bass: false, shaker: false })
bass(12.0, 29 + 12, 2.2, .14)
groove(14.4, 36.0, { kal: true, gap: [26.4, 27.0] })
// mechanism and menu
kalimba(SFX, 15.85, 81, .07, .2); kalimba(SFX, 16.0, 84, .06, .3)
whoosh(19.6, .7, .035)
whoosh(21.6, 1.2, .025)
kalimba(SFX, 22.35, 84, .07)
whoosh(24.1, .8, .04)
// fallback: one beat of air, then the hand-over
kalimba(SFX, 25.8, 79, .05)
bell(SFX, 27.0, 84, .08, -.1); bell(SFX, 27.18, 89, .07, .1)
for (let i = 0; i < 54; i += 2) key(28.4 + i / 54 * 1.0, .022)
tick(29.42, 700, .06); whoosh(29.7, .5, .03)
kalimba(SFX, 29.75, 77, .07); kalimba(SFX, 29.9, 81, .06)
kalimba(SFX, 30.3, 84, .07); bell(SFX, 30.3, 89, .035)
// platform
whoosh(31.6, .8, .035)
kalimba(SFX, 32.3, 81, .06)
voice(34.0, 1.6, .05)
// payoff: drums out, the night drone comes back under F, every message gets a note
add(MUS, 36.0, 5.2, x => .035 * Math.min(1, x / 1) * Math.min(1, (5.2 - x) / .6) * (S(hz(38), x) + .5 * S(hz(45), x)))
pad(MUS, 36.0, 4.6, [57, 60, 65, 69], .012, 1.0, .8); groove(36.0, 40.8, { drums: false, bass: false, padAmp: .008 })
whoosh(36.2, .8, .035)
;[36.9, 37.5, 38.1, 38.7, 39.3].forEach((t, i) => { kalimba(SFX, t + .35, [77, 79, 81, 84, 86][i], .08, (i - 2) * .15) })
// CTA: groove back, a build, the hit, ring out
whoosh(41.0, .9, .045)
groove(40.8, 45.6, { kal: false })
for (let i = 0; i < 21; i++) key(43.55 + i / 21 * .9, .02)
for (let t = 43.8, i = 0; t < 45.6; i++) { rim(t, .03 + .06 * (t - 43.8) / 1.8); t += t < 44.9 ? .15 : .075 }
swell(45.6, 2.2, .06)
tick(45.05, 650, .06)
boom(45.6, .26); crash(45.6, .05); kick(45.6, .32)
pad(MUS, 45.6, 1.8, [53, 57, 60, 64, 67, 72], .016, .03, 1.6)
bell(SFX, 45.6, 89, .06); bell(SFX, 45.6, 93, .045, .2); bell(SFX, 45.6, 96, .035, -.2)
bass(45.6, 29 + 12, 2.0, .15)
;[77, 84, 89].forEach((m, i) => kalimba(MUS, 46.2 + i * .15, m, .07, (i - 1) * .3))

// ---------- reverb on the music and sfx sends, then mix ----------
function reverb(B, wet) {
  const out = bus(), combs = [1687, 1601, 2053, 2251], ap = [556, 441]
  for (let ch = 0; ch < 2; ch++) {
    const x = B[ch], y = new Float32Array(N)
    combs.forEach(L0 => { const L = L0 + ch * 23, buf = new Float32Array(L); let idx = 0, lp = 0; for (let i = 0; i < N; i++) { const o = buf[idx]; lp = o * .7 + lp * .3; buf[idx] = x[i] + lp * .8; y[i] += o / 4; idx = (idx + 1) % L } })
    ap.forEach(L => { const buf = new Float32Array(L); let idx = 0; for (let i = 0; i < N; i++) { const o = buf[idx], v = y[i] + o * .5; buf[idx] = v; y[i] = o - v * .5; idx = (idx + 1) % L } })
    for (let i = 0; i < N; i++) out[ch][i] = x[i] + wet * y[i]
  }
  return out
}
const m = reverb(MUS, .35), s = reverb(SFX, .25)
const L = new Float32Array(N), R = new Float32Array(N)
for (let i = 0; i < N; i++) {
  const fade = Math.min(1, (DUR - i / SR) / .8)
  L[i] = (m[0][i] + s[0][i] + DRY[0][i]) * fade; R[i] = (m[1][i] + s[1][i] + DRY[1][i]) * fade
}
let pk = 0; for (let i = 0; i < N; i++) pk = Math.max(pk, Math.abs(L[i]), Math.abs(R[i]))
const g = .9 / pk, pcm = Buffer.alloc(44 + N * 4)
pcm.write('RIFF', 0); pcm.writeUInt32LE(36 + N * 4, 4); pcm.write('WAVEfmt ', 8); pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(2, 22)
pcm.writeUInt32LE(SR, 24); pcm.writeUInt32LE(SR * 4, 28); pcm.writeUInt16LE(4, 32); pcm.writeUInt16LE(16, 34); pcm.write('data', 36); pcm.writeUInt32LE(N * 4, 40)
for (let i = 0; i < N; i++) { pcm.writeInt16LE(Math.round(L[i] * g * 32767), 44 + i * 4); pcm.writeInt16LE(Math.round(R[i] * g * 32767), 46 + i * 4) }
writeFileSync('score.wav', pcm); console.log('peak', pk.toFixed(3))
writeFileSync('beats.json', JSON.stringify({ bpm: 100, beat: BEAT, bar: BAR, beats: DUR / BEAT, peaks: Array.from({ length: DUR / BEAT }, (_, i) => +(i * BEAT).toFixed(2)), hits: [12.0, 27.0, 45.6], note: 'score is synthesized on the exact grid' }))
