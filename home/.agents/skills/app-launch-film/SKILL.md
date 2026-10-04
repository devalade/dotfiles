---
name: app-launch-film
description: Make a vertical launch or explainer film for an app from its own repo, rendered with the HTML seek(t) engine (Playwright + ffmpeg), with a score and sound design synthesized in code. Two variants. V1 is a wordless phone-UI story driven by on-screen type (problem at night, the turn, the product answering, the CTA). V2 adds a mascot that explains a feature with an ElevenLabs voiceover. Use when asked for a launch video, waitlist or early-access video, feature explainer, "a video like the 22:47 one", or a mascot video for an app, in any repo. Builds on motion-seek-engine (engine and springs) and no-slop-motion (gates and banned list).
metadata:
  short-description: Phone-UI launch film or mascot explainer, seek(t) engine, synthesized score
---

# App launch film

A 40 to 60 s vertical film (1080x1920, 30 fps) that sells one before-and-after. Every word on screen comes from the app's own copy, every colour and font from its own tokens. The working reference is `example/` (the ZeAssistant "22:47" waitlist film): copy it, then replace the story.

Read with this skill:
- `motion-seek-engine` for the render contract and spring math. This skill follows it exactly.
- `no-slop-motion` for the banned list and the gate order. Here the user may ask you to decide the gates yourself. If so, write every decision into `FILM.md` and run the self-review loop below instead of asking.
- `references/pitfalls.md` before writing any code. Every item there cost a render.
- `references/mascot-voice.md` for V2.

## 1. Inputs from the repo (15 minutes, no writing yet)

Find and note, with file paths:
- **Copy**: landing page and translation files (hero line, how-it-works steps, the fallback or USP section, FAQ, waitlist strings). These are the only claims allowed.
- **Tokens**: paper, ink, accent, night palette, chat or bubble colours, radii, the button's depth style.
- **Fonts**: display and UI faces. Download them as local `.woff2` into `fonts/` (Google Fonts CSS with a desktop user agent, then `curl` each latin file). Never depend on the network at render time.
- **Logo** as SVG, and any device mock CSS (the landing's iPhone frame is the reference for the phone).
- **Domain** for the end card, and the CTA wording (waitlist vs live sign-up).
- Project rules: locale, banned characters (em-dashes), tone, design dislikes from memory.

## 2. Brief and story (write `FILM.md`)

Use `example/FILM.md` as the template: brief, script table, world, banned list, sound plan, build commands.

The V1 story shape that worked, on a 100 BPM grid (beat 0.6 s, bar 2.4 s, so every change lands on the grid):

| Act | Bars | Job |
| --- | --- | --- |
| Hook | 0 to 2 | The pain moving in 0.3 s: lock screen, messages piling up, the phone buzzing. Camera starts close and pulls back as the pile grows. |
| Culprit | 2 to 4 | Push into one message (the villain). It morphs into its chat. A felt number ("22:47") and the consequence ("she didn't wait"). |
| Turn | 4 to 5 | Rewind to the villain's time, held breath, then the brand colour appears for the first time (a typing bubble) and morphs into the logo. The light world spreads out from it. Crescendo 1. |
| Title | 5 to 6 | The landing's hero line, two lines, accent line in the display italic. |
| Mechanism | 6 to 8 | The same villain message answered at once, with the user's real prices. |
| Source | 8 to 10 | Match cut from a value in the answer to where it came from (bubble price to menu line, same pixels). |
| USP | 10 to 13 | The thing only this product does (here: asks the owner instead of inventing, then remembers). Crescendo 2, with one beat of musical air before it. |
| Platform | 13 to 15 | Two objections, one card each, one card morphing into the next. |
| Payoff | 15 to 17 | The opening image again, now resolved (every notification marked answered). |
| CTA | 17 to 20 | Offer line, form filled, keycap button pressed, success state on the last hit (crescendo 3), logo and domain, 1.5 s or more of hold. |

Rules: one idea per shot, something new every 2 to 4 s, type lives below the object (never parked at the top), brand colour held back until the turn, depth only on the button.

## 3. Build (`index.html`)

Start from `example/index.html`. Keep these blocks, replace the scenes:
- **Helpers**: `clamp`, `sm`, `eo`, `io`, `ei`, `sp` (critically damped spring, no overshoot on UI), `keys` (keyframes with power3.inOut), `mix`, `tf`, `mulberry32`.
- **Captions**: the `CAPS` table, `[t0, t1, y, size, lines, opts]`. Words enter blur to sharp, 75 ms apart, and exit blurred. `{ move: 1 }` lets a line start big and settle.
- **Chat threads**: messages laid out once in `measure()`, bottom-anchored by `threadY(t, rows, events)`. An event is `{ id, a }` (arrival), `{ r }` (removal, for a rewind) or `{ m, hd }` (typing dots that grow into the full bubble). Pre-fill the thread with a short history so the screen isn't empty.
- **Camera**: one `camera(t)` returning `[scale, cx, cy]`. `camMap` and `phoneMap` turn a point inside the phone into frame coordinates, so an actor (the logo) can fly exactly onto a bubble.
- **Scene toggles**: every scene container is switched with `style.display`, never `visibility` (see pitfalls).
- **Grain**: a 360x640 canvas seeded by frame number, overlay blend, stronger at night.

**Languages**: write the film in the app's default locale, then add a string table (`EN` in the example) keyed by the source string, filled from the app's other translation file. `?lang=en` swaps every text node and every string built in JS, while timing and score stay shared. Render each language with `FILM_LANG=<code> node render.mjs video && ./mux.sh <code>`. Captions shrink to fit in `measure()` when a translation runs long. Re-check the contact sheet per language, because bubble heights change.

Measure anything a match cut or flight lands on with `getBoundingClientRect()` inside `measure()`, which runs on the first `seek` before any transform is applied.

## 4. Self-review loop (before any full render)

1. `node render.mjs contact`: one frame per beat, tiled 8 per row (a row is 4.8 s), into `contact1.png` and `contact2.png`. Read them.
2. Score 1 to 10: hook in the first 2 s, readability at phone size, motion quality, variety, brand accuracy, sound sync.
3. Fix the 3 worst problems. Inspect transitions with `node render.mjs frames 11.4,11.7,12.0 out.png`.
4. Repeat until every score is 8 or more. Then render. Report the real scores to the user, including any below 8.

## 5. Sound (`audio.mjs`)

Synthesized, 48 kHz stereo, seeded noise only. Start from `example/audio.mjs`, which has the instrument kit: pad, kalimba, bell, kick, rim, swung shaker, bass, phone buzz (tuned to the key), tick, reversed tick, whoosh, swell, crash, sub boom, key click, voice-note babble, and a small reverb.
- The problem act sits in the relative minor, about 5 LU under the groove, and its only rhythm is diegetic (the buzz, a clock tick). The turn resolves to the relative major and the groove enters with the product's first action.
- One sonic motif for the product (here a kalimba note on every answered message). Every SFX is tuned to the key. Cut half of the first pass.
- Write every cue at the same constant as its picture event. Check by eye: `./lufs.sh` for loudness per act, plus a spectrogram (`showspectrumpic`). You cannot hear, so say so and ask the user to listen.
- `./mux.sh` runs two-pass loudnorm to -14 LUFS / -1 dBTP and muxes AAC 320k.

## 6. Render and hand over

- `node render.mjs video`: 30 fps, H.264 yuv420p CRF 16, adaptive motion blur. Edit the `FAST` windows in `render.mjs` to cover every fast move (12 sub-frames there, 3 elsewhere, 0.6-frame shutter). About 20 minutes for 48 s.
- Run the scene scan (`ffmpeg ... select='gt(scene,0.18)'`). Every hit must be a planned transition.
- Check the pixel format is `yuv420p` and loudness is -14 LUFS.
- Open the file only after the render and mux have finished, and quit the player before re-rendering over a file it has open.
- Hand over: what was decided, the scores, what you could not check (audio by ear), and the re-render command.

## V2: mascot explainer with voiceover

Same engine, different clock: the voice sets the timing. Follow `references/mascot-voice.md`: script per act, `scripts/tts-elevenlabs.mjs` for takes with character timestamps, `scripts/mouth.mjs` for the mouth-open curve, a mascot rig in inline SVG driven by closed-form springs, and music ducked under speech. Needs `ELEVENLABS_API_KEY` in the environment. Ask for it before recording anything.
