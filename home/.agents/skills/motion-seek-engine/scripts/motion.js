// motion.js — closed-form springs and seek-safe helpers.
//
// Every function here is a PURE FUNCTION OF TIME. No state, no timers, no
// Math.random, no Date. That is what lets render.mjs jump straight to frame 812
// and get the same pixels as a run that played from 0.
//
// Usage in a page:  import * as M from './motion.js'  (or paste the file's
// contents inline before your scenes if you serve a single index.html).

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));

export const lerp = (a, b, t) => a + (b - a) * t;

/** mulberry32 — seeded noise. Same seed, same numbers, every run. */
export function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Closed-form damped spring, step response 0 -> 1.
 *
 *   spring(t)        one value's whole travel from a single change
 *   step(t, from, to)  one value, one change, arbitrary endpoints
 *   track(t, keys)     ONE value with MANY changes — a sum of springs
 *
 * Why closed form: a simulated spring needs the previous frame. seek(t) needs
 * to render frame 812 without frames 0..811. A spring you can evaluate at t is
 * what keeps a springy film deterministic.
 *
 * k = stiffness (higher = faster), d = damping (higher = less overshoot).
 * Settling time ~ 4 / (z*w0) where z = d / (2*sqrt(k)).
 */
export function spring(t, k = 170, d = 26) {
  if (t <= 0) return 0;
  const w0 = Math.sqrt(k);
  const z = d / (2 * w0);
  if (z < 1) {
    const wd = w0 * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + ((z * w0) / wd) * Math.sin(wd * t));
  }
  return 1 - Math.exp(-w0 * t) * (1 + w0 * t); // critically damped / overdamped
}

/** One value moving from -> to, starting at t0. */
export const step = (t, t0, from, to, k = 170, d = 26) =>
  from + (to - from) * spring(t - t0, k, d);

/**
 * ONE value with MANY target changes — the important one.
 *
 * keys: [[time, value], ...] sorted by time, e.g. a cursor's x:
 *   const xs = [[0, 0.5], [1.2, 0.2], [2.4, 0.8], [4.0, 0.3]];
 *   ctx.fillRect(M.track(t, xs), y, 12, 12);
 *
 * Every keyframe contributes one spring, each starting at its own time, and the
 * responses sum. So the value keeps its momentum when the target changes mid
 * flight — no restart, no snap. You still evaluate it at any t in isolation.
 */
export function track(t, keys, k = 170, d = 26) {
  let v = keys[0][1];
  for (let i = 1; i < keys.length; i++) v += (keys[i][1] - keys[i - 1][1]) * spring(t - keys[i][0], k, d);
  return v;
}

/** Same as track(), for a vector of keyframes: [[t, [x, y]], ...]. */
export function trackVec(t, keys, k = 170, d = 26) {
  const out = [keys[0][1][0], keys[0][1][1]];
  for (let i = 1; i < keys.length; i++) {
    for (let c = 0; c < 2; c++) {
      out[c] += (keys[i][1][c] - keys[i - 1][1][c]) * spring(t - keys[i][0], k, d);
    }
  }
  return out;
}

/** A staggered grid: value i of n starts delay seconds after the first. */
export const stagger = (t, i, delay = 0.03, k = 260, d = 20) => spring(t - i * delay, k, d);

/**
 * A tab / underline indicator that stretches: the leading edge is stiffer than
 * the trailing edge, so the bar smears between stops instead of teleporting.
 * stops: [[time, x], ...]
 */
export function indicator(t, stops) {
  const lead = track(t, stops, 320, 30);
  const trail = track(t, stops, 140, 22);
  return { left: Math.min(lead, trail), right: Math.max(lead, trail) };
}

/**
 * Text living inside a morphing container: it comes in AFTER the morph starts
 * (so type never overlaps the shape mid-flight) and leaves BEFORE the next one.
 * Swap windows are the #1 source of overlapping text — always route them here.
 */
export function swapAlpha(t, tIn, tOut, fade = 0.12) {
  return Math.min(clamp((t - tIn - fade) / fade), clamp((tOut - fade - t) / fade));
}

/** Wrap time so a film loops seamlessly: the last frame equals the first. */
export const loopT = (t, dur) => ((t % dur) + dur) % dur;

/**
 * Scene routing. Scenes are plain objects { from, to, draw } where draw gets
 * LOCAL time (seconds since the scene started), so a scene's code never has to
 * know when it began.
 */
export function shotAt(t, scenes) {
  for (const s of scenes) if (t >= s.from && t < s.to) return { scene: s, local: t - s.from };
  const last = scenes[scenes.length - 1];
  return t >= scenes[scenes.length - 1].to
    ? { scene: last, local: last.to - last.from }
    : { scene: scenes[0], local: t };
}