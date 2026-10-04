#!/usr/bin/env node
// render.mjs — walk time, paint frame by frame, pipe straight into ffmpeg.
//
//   node render.mjs                          # index.html, 15s, 60fps, 4 subframes
//   node render.mjs --dur 30 --out out/x.mp4
//   node render.mjs --at 4.2 --at out/f.png  # ONE frame (cheap QA + determinism check)
//   node render.mjs --probe                  # re-seek probe frames, prove seek(t) is pure
//
// The page must expose window.seek(t) -> paints the exact frame at time t.
// Requires: npm i -D playwright && npx playwright install chromium

import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// playwright must come from the PROJECT, not from wherever this script lives, so
// `npm i -D playwright` in the film directory is all the setup there is.
function loadPlaywright() {
  for (const from of [pathToFileURL(process.cwd() + '/'), import.meta.url]) {
    try {
      return createRequire(from)('playwright');
    } catch {}
  }
  console.error(
    'playwright not found. In this project run:\n  npm i -D playwright && npx playwright install chromium'
  );
  process.exit(1);
}

const argv = process.argv.slice(2);
const arg = (k, d) => {
  const i = argv.indexOf('--' + k);
  return i > -1 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d;
};
const flag = (k) => argv.includes('--' + k);
const num = (k, d) => (arg(k, undefined) === undefined ? d : Number(arg(k)));

// The arguments are parsed before playwright loads, so a bad flag fails fast.
const PAGE = resolve(arg('page', 'index.html'));
const FPS = num('fps', 60);
const SUB = num('sub', 4); // subframes per frame, averaged for motion blur
const DUR = num('dur', 15);
const W = num('w', 1080);
const H = num('h', 1920);
const OUT = resolve(arg('out', 'out/final.mp4'));
const AT = arg('at', undefined); // single-frame mode: seconds, or a png path
const VERIFY = flag('probe');
const selector = arg('sel', '#c');

const sha = (buf) => createHash('sha1').update(buf).digest('hex');
const { chromium } = loadPlaywright();

/**
 * Inject the spring library as a global `M`.
 *
 * Chrome refuses ES-module imports over file://, and this engine deliberately
 * has no build step, so the library is loaded as a classic script instead. The
 * export list is parsed out of motion.js, so motion.js stays the one source of
 * truth for what exists — no list to maintain here.
 */
function libSource() {
  const p = arg('lib', 'auto');
  const path = p === 'auto' ? fileURLToPath(new URL('./motion.js', import.meta.url)) : resolve(p);
  if (!existsSync(path)) {
    if (p === 'auto') return null;
    throw new Error(`--lib not found: ${path}`);
  }
  const src = readFileSync(path, 'utf8');
  const names = [
    ...new Set([...src.matchAll(/^export\s+(?:function|const)\s+([A-Za-z0-9_$]+)/gm)].map((m) => m[1])),
  ];
  return `${src.replace(/^export\s+/gm, '')}\nwindow.M = { ${names.join(', ')} };`;
}
const LIB = libSource();

const open = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  if (LIB) await page.addInitScript(LIB);
  await page.goto('file://' + PAGE);
  await page.evaluate(() => document.fonts.ready); // canvas text needs its fonts loaded
  return { browser, page };
};

const { browser, page } = await open();
const shoot = () => page.locator(selector).screenshot({ type: 'png' });
const hasSeek = await page.evaluate(() => typeof window.seek === 'function');
const seekTo = async (t) => {
  if (!hasSeek) return false;
  await page.evaluate((time) => window.seek(time), t);
  return true;
};

// --- one frame: QA still, or the cheap determinism check -------------------
if (AT !== undefined) {
  const t = Number(AT);
  if (Number.isNaN(t)) {
    console.error(`--at wants a time in seconds, got "${AT}"`);
    await browser.close();
    process.exit(1);
  }
  const sought = await seekTo(t);
  if (!sought) console.warn('  (no window.seek on the page — captured whatever it painted first)');
  const png = await shoot();
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, png);
  console.log(`  ${OUT}  t=${t}  ${sha(png).slice(0, 12)}`);
  await browser.close();
  process.exit(0);
}

if (!hasSeek) {
  console.error(`window.seek is not defined on ${PAGE}. The page must expose window.seek(t).`);
  await browser.close();
  process.exit(1);
}

// --- probe: is seek(t) actually pure? --------------------------------------
const probes = new Map();
const PROBE_EVERY = Math.max(1, Math.round(FPS / 2)); // twice a second

// --- render ---------------------------------------------------------------
mkdirSync(dirname(OUT), { recursive: true });
// tmix averages SUB consecutive subframes into one frame (motion blur);
// select keeps the last of each group. Quoting is ffmpeg's own parser.
const vf =
  SUB > 1
    ? `tmix=frames=${SUB},select='eq(mod(n\\,${SUB})\\,${SUB - 1})',setpts=N/${FPS}/TB`
    : null;

const ffArgs = ['-y', '-f', 'image2pipe', '-framerate', String(FPS * SUB), '-i', '-'];
if (vf) ffArgs.push('-vf', vf);
ffArgs.push('-r', String(FPS), '-c:v', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', OUT);

const ff = spawn('ffmpeg', ffArgs, { stdio: ['pipe', 'inherit', 'inherit'] });
const done = new Promise((r) => ff.on('close', r));

const total = Math.round(DUR * FPS * SUB);
let lastLog = -1;

for (let i = 0; i < total; i++) {
  const t = i / (FPS * SUB);

  await seekTo(t);
  const png = await shoot();
  if (VERIFY && i % (PROBE_EVERY * SUB) === 0) probes.set(t, sha(png));
  if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once('drain', r));

  const sec = Math.floor(t);
  if (sec !== lastLog) {
    lastLog = sec;
    process.stdout.write(`\r  ${sec}s / ${DUR}s   `);
  }
}

ff.stdin.end();
await done;
await browser.close();

if (VERIFY) {
  // Seek the same moments again, in a different order. Identical hashes mean
  // nothing in the page depends on the order frames arrive (no Math.random,
  // no Date, no carried state). This is the check that makes renders
  // reproducible and edits one-line.
  const { browser: b2, page: p2 } = await open();
  let bad = 0;
  for (const [t, before] of [...probes].reverse()) {
    await p2.evaluate((time) => window.seek(time), t);
    const after = sha(await p2.locator(selector).screenshot({ type: 'png' }));
    if (after !== before) {
      bad++;
      console.error(`\n  NON-DETERMINISTIC at t=${t.toFixed(2)}  ${before.slice(0, 8)} != ${after.slice(0, 8)}`);
    }
  }
  await b2.close();
  console.log(bad === 0 ? `\n  seek(t) pure: ${probes.size} probe frames identical on re-seek` : `\n  ${bad} probe frames differ`);
  if (bad) process.exit(2);
}

console.log(`\n  ${OUT}  ${DUR}s @ ${FPS}fps, ${SUB}x subframes, CRF 16`);