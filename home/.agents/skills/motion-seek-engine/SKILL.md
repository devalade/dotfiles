---
name: motion-seek-engine
description: Render a video from code with a deterministic seek(t) engine — one index.html paints any frame on demand, Playwright walks time, ffmpeg encodes. Use when asked to render, generate, build or make a video/showreel/launch film/animated explainer/loop in code, when a "one prompt video" render needs to be reproducible or an edit must be one line, when motion needs to be re-rendered non-destructively, or when a render has to loop seamlessly. Also the source of the closed-form spring library, the beat-grid + synthesized-SFX pipeline, and the contact-sheet critique loop that scores a render's own frames. Triggers on seek(t), render.mjs, canvas video, code-rendered motion, motion reel, deterministic render, subframe motion blur, beats.json, "AI video looks mid", render loop.
metadata:
  short-description: Deterministic seek(t) renderer, closed-form springs, beat-locked audio, frame-score QA loop
---

# Motion seek engine

The model cannot emit an MP4. It writes **a program that paints any moment on demand**, and something else turns that program into frames. That is the whole trick, and the program is 10% of the work — the harness around it is the other 90%.

The harness here is four pieces: a **render contract** (`seek(t)` is the only truth), **closed-form springs** (motion that stays a pure function of time), a **beat grid** (sound that lands where the picture lands), and a **critique loop** (the model looks at the frames it rendered and fixes the three worst).

## Route A or route B

| | Route A — this skill | Route B — HyperFrames / Remotion |
| --- | --- | --- |
| Shape | one `index.html`, `window.seek(t)`, Playwright, ffmpeg | framework timeline, `npx` toolchain |
| Deps | none at runtime | npm packages, workers, build |
| Edit cycle | change one line, re-render | sometimes rebuild, studio preview |
| Best for | 15–120s reels, loops, morph chains, one-off films | series, templates, data-driven video |

Reach for route A by default — an agent writing an animation picks this shape unprompted, and it is the cheapest to iterate. Use route B when there is a real reason (a series sharing components, data-driven frames, a team already on Remotion). For the brand-film process — customer research, script, voiceover, world, gates — use `no-slop-motion`; it drives either route and this engine is its renderer.

## The render contract

Every film is a pure function of time. These are the lines that make it one:

- `window.seek(t)` paints frame `t`. Nothing else may drive time.
- **No** CSS transitions, `setTimeout`, `requestAnimationFrame`, or `Date.now` in render mode, and no state carried between frames.
- **No `Math.random`.** Seeded noise only (`M.rng(seed)`), so frame 812 is identical on every run.
- Scene code takes **local** time (`M.shotAt` hands it over), so scenes never know when they started.
- Animate with **closed-form springs** from `scripts/motion.js`, not CSS easing or tween libraries — a simulated spring needs the previous frame, and `seek(t)` must render any frame alone.
- The last frame equals the first for anything that loops (`M.loopT`).

`templates/HOUSE_RULES.md` is this contract as a drop-in project file, so every later run in that directory complies without being told.

## The steps

### 1. Scaffold and prove the loop

```bash
mkdir film && cd film && npm init -y
npm i -D playwright && npx playwright install chromium
mkdir -p docs out refs scripts
cp -R /path/to/motion-seek-engine/scripts/. scripts/   # render.mjs finds motion.js beside itself
# then copy the index.html template out of references/renderer.md
node scripts/render.mjs --dur 2 --out out/smoke.mp4 --probe
```

`--probe` re-seeks a dozen frames in a second browser load and fails if any byte differs. That is the proof the contract holds, and it costs seconds.

**Done when:** a 2-second render exists, plays, and `--probe` reports `seek(t) pure`.

### 2. Fix the look before writing scenes

Without a reference, the default is centered text on a gradient fading in — the signature of every AI video. Take a frame, a video or an image folder and write `docs/style_guide.md` from it: palette hex, type family/weight/tracking, shot lengths, transition types, camera moves, grain, and how text enters and exits. Then write `docs/shotlist.md` as a **state list on the beat grid**, not a vibe.

Details and the copy-paste prompt: [references/reference-and-spec.md](references/reference-and-spec.md).

**Done when:** `style_guide.md` and `shotlist.md` exist, name real hex values and font names, and the shot list has a timestamp on every beat with something new on it every 2–4 seconds.

### 3. Beat grid and sound

```bash
python scripts/beats.py ./audio/track.wav docs/beats.json   # or: ... beats.json 120
```

`beats` for state changes, `downbeats` for big moments (start there), `hits` for SFX. Synthesize UI sound in code so it lands on the grid — no sample library:

```bash
node scripts/sfx.mjs docs/cues.json out/sfx.wav   # [{t, type: click|pop|thump|whoosh|tick|riser, gain}]
```

Mix to **-14 LUFS** integrated, true peak under -1 dBTP.

**Done when:** every state change in the shot list has a beat or a hit to land on, and no cue is eyeballed.

### 4. Build scenes

One scene object per shot: `{ from, to, draw(t) }`, `t` local. Copy the tuning table before picking stiffness — `k=170, d=26` is a container, not a cursor ([references/springs.md](references/springs.md)). Text inside a morphing box goes through `M.swapAlpha` so type never overlaps the shape mid-flight.

**Done when:** every scene draws from `t=0` local with correct frame-0 state, and nothing in the file can be reached only by playing in order.

### 5. Render, look, fix — the red gate

```bash
node scripts/render.mjs --dur 15 --out out/final.mp4
bash scripts/qa.sh out/final.mp4 out/qa 4.2 7.5
```

Then **open the four PNGs and look at them**. Be a harsh director, not a proud author. Score 1–10: hook in first 2s, readability at 360px, motion quality, variety, composition, brand accuracy, sound sync. Name the 3 worst problems with timestamps, fix those, re-render only the seconds you touched, score again.

Repeat until every score is 8+. The gate is red until it passes; iteration is the method, not a failure — the honest counterexample to "one prompt" took 163 calls and seven hours.

What each sheet catches, and the specific bugs to hunt for: [references/frame-qa.md](references/frame-qa.md).

**Done when:** all seven scores are 8+ on a fresh render, and `qa.sh` reports `determinism OK`.

### 6. Formats and hand-off

Write scenes against a **layout function** (`L(x, y, w, h, format)`), not fixed pixels, then render 9:16, 1:1 and 16:9 from the same timeline. Reframe type and UI per format — never crop a 16:9 render to vertical.

Deliver `out/final.mp4` (all formats), `out/contact.png`, `out/poster.png` (a poster is `--at <hero time> --out out/poster.png`), `out/loop_check.mp4`, and the source with a README. Say what you'd improve next.

**Done when:** every format plays, the poster frame is a real frame, and the source re-renders identically.

## Long autonomous runs

A five-minute film is a different job: one session, gates, subagents. The director's brief, the workflow gates, the critique log format and the `ANIMATION_GUIDE.md` handoff that keeps parallel subagents in one style are in [references/long-form.md](references/long-form.md).

## Effort

Reasoning effort changes the output more than the prompt does. Small fixes and re-renders: default. New films: high. When the first 3 seconds carry a launch: top effort — and plan for a review loop either way.

## Files

| Path | What it is |
| --- | --- |
| `scripts/motion.js` | closed-form springs, `track`, `indicator`, `swapAlpha`, `loopT`, `shotAt`, seeded rng. Injected as global `M` by the renderer |
| `scripts/render.mjs` | `--dur --fps --sub --w --h --page --out --at --probe`. Walks time, pipes frames to ffmpeg, verifies purity |
| `scripts/beats.py` | librosa beat grid → `beats.json` (beats / downbeats / hits) |
| `scripts/sfx.mjs` | synthesized clicks, pops, thumps, whooshes from a cue list |
| `scripts/qa.sh` | contact sheet, action strip, phone-size sheet, loop seam, determinism |
| `templates/HOUSE_RULES.md` | drop-in project rules so later runs comply |
| `templates/SPEC.md` | the state-list spec, filled in per film |

## Where this came from

Extracted from Movez's *How to build a motion design studio with Opus 5.5* (Sep 2026) and cross-checked against the projects it names: [PDoomVideoStarter](https://github.com/JohnHeibel/PDoomVideoStarter) (subagent-per-chapter), [claude-animation-skill](https://github.com/buildwithhanif/claude-animation-skill) (canvas rigs), [hyperframes](https://github.com/heygen-com/hyperframes) and [Remotion](https://www.remotion.dev/docs/ai/skills) (route B), [awesome-ai-motion](https://github.com/guanmo-ai/awesome-ai-motion) and [awesome-opus-5-5-videos](https://github.com/athemeroy/awesome-opus-5-5-videos) (prompt library). The renderer, spring library, beat script, SFX synth and QA sheets here were written for this skill and tested end to end.