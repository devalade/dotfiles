import { chromium } from 'playwright'
import { spawn, execFileSync } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'

// node render.mjs contact [offset] | frame <t> [out.png] | frames <t1,t2,...> | video
// FILM_LANG=en renders the English version (default fr)
const DUR = 48, BEAT = 0.6
const mode = process.argv[2] || 'contact'
const LANG = process.env.FILM_LANG === 'en' ? 'en' : 'fr'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 })
page.on('pageerror', e => console.log('PAGEERR', e.message))
page.on('console', m => m.type() === 'error' && console.log('CONSOLE', m.text()))
await page.goto('file://' + path.resolve('index.html') + '?lang=' + LANG)
await page.evaluate(() => document.fonts.ready)
await page.evaluate(() => Promise.all([...document.images].map(i => i.decode())))
const at = t => page.evaluate(t => window.seek(t), t)

const sheet = (files, out, cols) => {
  const list = files.map(f => ['-i', f]).flat()
  const n = files.length, rows = Math.ceil(n / cols)
  const inputs = files.map((_, i) => `[${i}:v]scale=216:384[v${i}]`).join(';')
  const layout = files.map((_, i) => `${(i % cols) * 216}_${Math.floor(i / cols) * 384}`).join('|')
  execFileSync('ffmpeg', ['-y', '-v', 'error', ...list, '-filter_complex', `${inputs};${files.map((_, i) => `[v${i}]`).join('')}xstack=inputs=${n}:layout=${layout}:fill=black`, out])
  console.log('sheet', out, rows + 'x' + cols)
}

if (mode === 'contact') {
  const off = parseFloat(process.argv[3] ?? '0.3')
  rmSync('sheet', { recursive: true, force: true }); mkdirSync('sheet', { recursive: true })
  const files = []
  for (let b = 0; b * BEAT + off < DUR; b++) {
    const t = +(b * BEAT + off).toFixed(2); await at(t)
    const f = `sheet/t${t.toFixed(2)}.png`; await page.screenshot({ path: f }); files.push(f)
  }
  for (let i = 0; i < files.length; i += 40) sheet(files.slice(i, i + 40), `contact${i / 40 + 1}${LANG === 'en' ? '-en' : ''}.png`, 8)
} else if (mode === 'frame') {
  await at(parseFloat(process.argv[3])); await page.screenshot({ path: process.argv[4] || 'frame.png' })
} else if (mode === 'frames') {
  mkdirSync('chk', { recursive: true })
  const ts = process.argv[3].split(',').map(Number), files = []
  for (const t of ts) { await at(t); const f = `chk/t${t.toFixed(2)}.png`; await page.screenshot({ path: f }); files.push(f) }
  sheet(files, process.argv[4] || 'frames.png', Math.min(8, files.length))
} else {
  // 30 fps, a 0.6-frame shutter: 12 sub-frames inside fast moves so blur stays smooth, 3 elsewhere
  const fps = 30, total = DUR * fps
  const FAST = [[5.5, 6.5], [11.3, 12.7], [14.3, 15.6], [19.1, 21.0], [23.6, 24.8], [31.1, 32.2], [35.9, 37.1], [40.7, 42.0]]
  const subAt = k => FAST.some(([a, b]) => k >= a * fps && k < b * fps) ? 12 : 3
  const segs = []
  for (let k = 0; k < total; k++) { const s = subAt(k); if (!segs.length || segs.at(-1).sub !== s) segs.push({ sub: s, from: k, to: k }); segs.at(-1).to = k + 1 }
  const SEG = `seg-${LANG}`; mkdirSync(SEG, { recursive: true })
  for (const [i, sg] of segs.entries()) {
    const { sub } = sg
    const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps * sub), '-c:v', 'mjpeg', '-i', '-',
      '-vf', `tmix=frames=${sub},select='eq(mod(n\\,${sub})\\,${sub - 1})',setpts=N/${fps}/TB,scale=in_range=pc:out_range=tv,format=yuv420p`,
      '-r', String(fps), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '16', '-preset', 'slow', `${SEG}/s${i}.mp4`], { stdio: ['pipe', 'inherit', 'inherit'] })
    for (let k = sg.from; k < sg.to; k++) {
      for (let j = 0; j < sub; j++) {
        await at((k + (j - (sub - 1) / 2) * 0.6 / (sub - 1)) / fps)
        const buf = await page.screenshot({ type: 'jpeg', quality: 95 })
        if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r))
      }
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r))
    console.log('segment', i + 1, '/', segs.length, `frames ${sg.from}-${sg.to} x${sub}`)
  }
  writeFileSync(`${SEG}/list.txt`, segs.map((_, i) => `file 's${i}.mp4'`).join('\n'))
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', `${SEG}/list.txt`, '-c', 'copy', `silent-${LANG}.mp4`])
}
await browser.close()
