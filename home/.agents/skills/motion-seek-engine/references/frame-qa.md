# Frame QA

The renderer can look at its own output. That single habit separates the clips people watch from the ones posted with *"it's a bit mid"*.

**Generating the sheets is not the step. Looking at them is.** An unwatched contact sheet is a file, not a review.

```bash
bash scripts/qa.sh out/final.mp4 out/qa 4.2 7.5
#                                  │      │    └─ probe time for the determinism check
#                                  │      └────── 12-frame strip centred here
#                                  └───────────── output directory
```

## The four sheets

| Sheet | What it is | The question it answers |
| --- | --- | --- |
| `contact.png` | 2 fps, 6 across | Does anything happen? Repeated tiles are dead time. |
| `strip.png` | 12 consecutive frames at one moment | Does the motion hold up frame to frame, or only in playback? |
| `phone.png` | 1 fps at 360px wide | Does it read at the size anyone will actually see it? |
| `loop_check.mp4` | the file played twice back to back | Is the seam invisible? |

The strip is the one people skip and the one that finds defects. Playback interpolates; contact sheets don't. A cursor that teleports, a box that slides, a flash that lasts two frames — invisible at 60fps in motion, obvious across 12 tiles.

## Score it

Read the sheets and score **1–10** on each:

| | |
| --- | --- |
| Hook in the first 2s | does it work muted, before any context |
| Readability at phone size | is the type still type at 360px |
| Motion quality | springs, no dead frames, nothing sliding |
| Variety | something new every 2–4 seconds |
| Composition | is the focus obvious in any single frame |
| Brand accuracy | real product, real assets, real colours |
| Sound sync | do hits land on the beats they were placed on |

Then, and only then, **list the 3 biggest problems with timestamps.** Three, not seven — a list of seven gets fixed badly. Fix those three, re-render only the seconds you touched, and look again.

## Hunt for these specifically

- text overlapping during a state swap → `M.swapAlpha`
- anything sliding rather than easing → `M.track`, not a fixed curve
- corner labels, frame borders, caption bars → the tells of AI-generated video; cut them
- a centered title on a gradient → the model's default when given no reference
- blurry scaled text → `will-change` on a camera-scaled layer, or a bitmap scaled up
- a dead beat with nothing happening → a repeated tile in `contact.png`
- a stutter at the loop seam → a value still moving at `DUR`
- a hard cut that reads as a jump → compare the last frame of shot N with the first of N+1

## The determinism check

```bash
node scripts/render.mjs --at 7.5 --out out/qa/probe-a.png
node scripts/render.mjs --at 7.5 --out out/qa/probe-b.png
cmp out/qa/probe-a.png out/qa/probe-b.png && echo identical
```

Two separate browser loads, byte-identical frames. `--probe` does the same thing across a whole render (a dozen probe frames, re-seeked in reverse order in a fresh page, exit 2 on any difference) and is worth running after any change to the page.

This is not pedantry. It is what makes a fix a fix: with a pure `seek(t)`, the frame you approved at 4.2s is still that frame after you edit the scene at 9s, and a diff in behaviour means something in the contract broke rather than the film shifting underneath you.

## Loop until green

The gate is red until every score is 8+. Minimum three rounds. Re-render only the affected seconds — the point of a deterministic engine is that a fix is one line plus a re-render of one scene, not a full re-animation.

Iteration is the method, not a failure. The honest counterweight to "one prompt" is a 163-call, seven-hour render with visible cleanup rounds — and it beat the one-shot.

## Before it ships

- [ ] Every score 8+ on a fresh render, not a remembered one
- [ ] Watch it muted. The type alone has to carry it.
- [ ] Watch the loop seam.
- [ ] `determinism OK` from `qa.sh`
- [ ] Frame 0 is a real frame
- [ ] Poster frame pulled: `node scripts/render.mjs --at <hero time> --out out/poster.png`
- [ ] Loudness -14 LUFS integrated, true peak under -1 dBTP
- [ ] Audio keys deleted from the repo; nothing real pasted into a prompt you screenshotted