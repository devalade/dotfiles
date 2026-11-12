#!/usr/bin/env node
/**
 * Deterministic before/after capture.
 *
 *   node scripts/shot.mjs <path> <label> <before|after> [--mobile] [--dark]
 *   node scripts/shot.mjs /settings rename before
 *
 * Output: docs/shots/<feature>/<label>-<phase>.png, plus a json sidecar with the
 * viewport, theme, commit sha, and URL that produced it.
 *
 * Needs: pnpm add -D playwright && pnpm exec playwright install chromium
 */
import { chromium } from 'playwright';
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [path = '/', label = 'screen', phase = 'before'] = process.argv.slice(2);
const flags = new Set(process.argv.slice(2).filter((arg) => arg.startsWith('--')));
const mobile = flags.has('--mobile');
const dark = flags.has('--dark');
const base = process.env.BASE_URL ?? 'http://localhost:3000';

const shotDir = join('docs', 'shots', path.replace(/^\//, '').replace(/\//g, '-') || 'root');
mkdirSync(shotDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: mobile ? { width: 390, height: 844 } : { width: 1280, height: 900 },
  deviceScaleFactor: 2,
  colorScheme: dark ? 'dark' : 'light',
  reducedMotion: 'reduce',
});
const page = await context.newPage();

// Seed and auth: replace with the project's own helper (cookie, storageState, or
// a fixture route). Never screenshot a signed-out page by accident.
const cookies = process.env.SHOT_COOKIES;
if (cookies) await context.addCookies(JSON.parse(cookies));

const url = new URL(path, base).toString();
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.addStyleTag({
  content: '*,*::before,*::after{animation:none !important;transition:none !important;caret-color:transparent !important}',
});
await page.waitForTimeout(150);

const file = join(shotDir, `${label}-${phase}.png`);
await page.screenshot({ path: file, fullPage: !mobile });

let sha = 'unknown';
try {
  sha = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
} catch {}

writeFileSync(
  file.replace(/\.png$/, '.json'),
  JSON.stringify(
    {
      url,
      phase,
      label,
      viewport: page.viewportSize(),
      theme: dark ? 'dark' : 'light',
      commit: sha,
      capturedAt: new Date().toISOString(),
      // Fill these in the spec run so the shot carries its scenario row.
      scenarioId: process.env.SCENARIO_ID ?? null,
    },
    null,
    2,
  ),
);

await browser.close();
console.log(`wrote ${file} from ${url} at ${sha}`);
