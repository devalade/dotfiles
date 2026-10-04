# Motion studio rules

<!-- Copy this file to the project root as CLAUDE.md or AGENTS.md.
     Every later run in this directory inherits it. -->

## Render contract

- Every film is a pure function of time: `window.seek(t)` paints frame `t`.
- No CSS transitions, no `setTimeout`, no `requestAnimationFrame` in render mode,
  no state carried between frames. Seeded noise only (`M.rng`), never `Math.random`.
- Animate with the closed-form springs in `scripts/motion.js`. No tween library here —
  a simulated spring needs the previous frame, and `seek(t)` renders frames alone.
- Scene code takes local time (`M.shotAt` hands it over). Set every scene's frame-0 state.
- Paint the background at the top of `seek`. Any frame must be safe to render alone.
- Render with `node scripts/render.mjs`, encode H.264 yuv420p, CRF 16, 4 subframes per frame.
- After any change to the page, `node scripts/render.mjs --probe` must still pass.

## Look

- Banned defaults: centered title on a gradient, everything fading in,
  corner labels and frame borders, glow on UI chrome, generic particle bursts.
- One display face, one UI face. One accent color unless the brief says otherwise.
- Real product UI only. Crop and animate real screenshots; never invent screens.
- Every 2 to 4 seconds something new must happen on screen.
- Tiny overshoot on UI, none on type.

## Sound

- Score and SFX are synthesized in code unless a track is supplied.
- Place hits on the measured beat grid (`docs/beats.json`). Start big moments on downbeats.
- Loudness -14 LUFS integrated, true peak under -1 dBTP.
- API keys live in `.env`. Never paste a real key into a prompt or a committed file.

## Loop before you show me anything

1. Render one frame per beat as a contact sheet and LOOK at it.
2. Score it 1-10 on: hook in first 2s, readability at phone size,
   motion quality, variety, brand accuracy, sound sync.
3. Fix the 3 worst problems, with timestamps. Repeat until every score is 8+.
4. Then, and only then, the full render.