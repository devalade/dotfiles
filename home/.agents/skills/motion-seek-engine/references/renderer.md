# The renderer

## index.html

One canvas, one `seek`. `M` (the spring library) is injected by `render.mjs` before the first frame — there is no import statement, no build step, no server.

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>html,body{margin:0;background:#141413}canvas{display:block}</style>
  </head>
  <body>
    <canvas id="c" width="1080" height="1920"></canvas>
    <script>
      const W = 1080, H = 1920, DUR = 15;
      const g = document.getElementById('c').getContext('2d');

      const SCENES = [
        { from: 0, to: 3, draw(t) {                    // t is LOCAL: seconds into this shot
          const s = M.spring(t - 0.1, 220, 22);
          g.save(); g.translate(W / 2, H / 2); g.scale(0.6 + 0.4 * s, 0.6 + 0.4 * s);
          g.globalAlpha = M.clamp(t * 4);
          g.fillStyle = '#F0EEE6'; g.font = '700 190px "Source Serif 4", serif';
          g.textAlign = 'center'; g.fillText('MOTION', 0, 0);
          g.restore();
        }},
        { from: 3, to: 6, draw(t) {                    // a stagger: one spring per item
          const r = M.rng(7);
          for (let i = 0; i < 48; i++) {
            const x = (i % 6) * 170 + 115, y = Math.floor(i / 6) * 170 + 360;
            const s = M.stagger(t, i, 0.03, 260, 20);
            g.fillStyle = i % 7 ? '#F0EEE6' : '#D97757';
            g.fillRect(x - 60 * s, y - 60 * s, 120 * s, 120 * s);
          }
        }},
        // one object per shot, appended as the film grows
      ];

      function draw(t) {
        g.fillStyle = '#141413'; g.fillRect(0, 0, W, H);   // paint the background every frame
        const { scene, local } = M.shotAt(t, SCENES);
        scene.draw(local);
      }
      window.seek = (t) => { draw(t); return true; };

      // Live preview in a normal browser; navigator.webdriver is true under render,
      // so the render never advances on its own clock.
      if (!navigator.webdriver) {
        const t0 = performance.now();
        (function loop() { draw(((performance.now() - t0) / 1000) % DUR); requestAnimationFrame(loop); })();
      }
    </script>
  </body>
</html>
```

Three rules in that file that are easy to lose:

- **Paint the background every frame.** A `fillRect` in `seek` makes any frame safe to render alone, in any order.
- **Set frame-0 state explicitly.** If a value only exists because a tween ran, frame 0 is empty.
- **`navigator.webdriver`** is the clean switch between preview and render — no flag to pass, no way to get them out of sync.

## render.mjs

```bash
node scripts/render.mjs                                  # 15s, 60fps, 4 subframes, out/final.mp4
node scripts/render.mjs --dur 30 --sub 8 --out out/x.mp4
node scripts/render.mjs --w 1920 --h 1080 --out out/wide.mp4
node scripts/render.mjs --at 4.2 --out out/poster.png    # one frame — poster, or a QA still
node scripts/render.mjs --probe                          # verify seek(t) is pure
node scripts/render.mjs --page scenes/film.html --sel '#stage'
```

| Flag | Default | Notes |
| --- | --- | --- |
| `--dur` | 15 | seconds |
| `--fps` | 60 | |
| `--sub` | 4 | subframes per frame, averaged by `tmix` for motion blur. `1` disables the filter |
| `--w` `--h` | 1080 × 1920 | viewport and canvas must match |
| `--page` `--sel` | `index.html`, `#c` | which file, which element to shoot |
| `--out` | `out/final.mp4` | in `--at` mode, the PNG path |
| `--at` | — | render a single frame at time `t` |
| `--probe` | off | re-seek probe frames in a second browser load; exit 2 if any differ |

Subframes exist because a still frame of anything moving fast looks like a slide. `--sub 4` renders 240 frames a second and averages each group of four into one 60fps frame, so a fast cursor smears instead of stepping.

Encoding is H.264 `yuv420p` CRF 16 — the quality floor for a film that gets scaled, re-encoded and re-encoded again.

## What breaks, and why

| Symptom | Cause | Fix |
| --- | --- | --- |
| `--probe` fails | `Math.random`, `Date`, a counter that survives a frame | `M.rng(seed)`; derive jitter from `t` or the index |
| Text renders in a fallback font, or not at all | fonts not loaded when the frame was shot | the renderer already awaits `document.fonts.ready`; also embed the font as base64 or install it locally |
| Frame 0 (or any single `--at` frame) is blank | state established by a tween instead of set at 0 | set every scene's frame-0 state explicitly |
| Canvas blank but DOM text visible | a capture path dropped the live canvas | `canvas.toDataURL()` into an `<img>`, or draw DOM to canvas yourself |
| Two renders differ | something outside the page: seed, worker count, a font that loaded late | same command, same page, same bytes — probe after every change |
| Render is slow | one frame at a time through CDP | raise `/dev/shm` (`--shm-size=4g` in Docker); keep `--sub` at 4 or lower |
| `seek` is not a function | page defines `draw` but never exposes it | `window.seek = (t) => { draw(t); return true; }` |

## One session per brand

Keep the renderer, the audio synth and the export path alive in a single session per brand or product. The second film in that session is dramatically faster than the first, because the harness already exists — the expensive part is never the prompt, it's building the pipeline once.

## Route B, briefly

```bash
npx create-video@latest launch-film && cd launch-film   # Remotion: series, templates, data-driven
npx hyperframes init my-video && cd my-video            # HTML + GSAP: think in web pages
```

Ask for route B **explicitly**. Left to itself an agent writing a video picks zero dependencies — one HTML file, a seek function, Playwright, ffmpeg — and skips the framework even when it is installed. That default is usually right.