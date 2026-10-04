# Reference and spec

Two decisions do most of the work in a film this cheap to make: **what it looks like**, and **what happens on each beat**. Get them from something real, not from the model.

## Why a reference is not optional

Left alone, the model reaches for the same defaults every time — centered text on a gradient, everything fading in, a logo at the end. Those defaults are recognisable, and viewers read them as machine-made within a second. Naming a style beats describing one: "the transitions in this Wes Anderson opening" carries more information than any adjective you can type.

Three kinds of reference, in increasing order of usefulness:

| Kind | How to use it |
| --- | --- |
| **One frame** | Screenshot a frame you love. Say what to take (palette, type, grain) and what not to take (the subject). |
| **A video** | Give the file. Have it extract frames with ffmpeg and describe pacing shot by shot **before** any code is written. |
| **Your own library** | A folder of your past work or images. Nobody else has it, so nobody else ships the same film. Have it write `style_guide.md` from that folder first. |

## The extraction pass

```
Reference: ./refs/launch.mp4 (and ./refs/frames/*.png)

1. Extract one frame every 0.5s with ffmpeg. Study them.
2. Write ./docs/style_guide.md: palette (hex), type (family, weight, tracking),
   shot lengths, transition types, camera moves, texture/grain, how text enters and exits.
3. Write ./docs/shotlist.md for a [DURATION]s video about [SUBJECT] in THAT style.
   Take the grammar of the reference, never its content, logos or characters.
4. Show me both files. Wait for my OK before any code.
```

**Take the grammar, never the content.** Grammar is how it moves: cut length, easing, how type arrives, where the eye goes. Content is the subject, the logo, the characters — copying those makes it a derivative.

When you give a reference, **let the model pick the technique.** Point it at a p5.js-style reference and it may well write its own paper renderer instead — that instinct is usually better than the library you named. Specify the look and the constraints; name a library only when you need that framework for reuse.

## The spec: a state list, not a vibe

The most-bookmarked prompts in this genre were not one-liners. They were XML specs with an inputs block, a direction block, a beat-by-beat state list, build rules and gotchas. [`templates/SPEC.md`](../templates/SPEC.md) is that structure, filled in per film.

The core idea underneath it: **one shape, never cuts.** A single element morphs size, radius and fill from state to state — button, loader, player, slider, chart, command palette — a cursor drives each change with real clicks, and the last frame equals the first so it loops. Nothing is swapped out; things reshape. That is why those films read as designed rather than assembled.

The same spec applies to a story film: a fake UI is a set where every element has a known state, so the narrative is a sequence of states.

## Prompt patterns that shipped

**The one-liner** — worth understanding, because it tests the engine rather than the idea:

```
make a dynamic 15-second motion graphics video that shows what an
incredible motion designer you are, like it's your showreel for a résumé.
go all out.
```

Why it works: *"showreel for a résumé"* sets a genre with known rules (fast cuts, a new technique per shot, best work first); *"what an incredible motion designer you are"* makes the model the subject, so it shows technique instead of explaining a product, and there is no content to get wrong; *15 seconds* is one pass long but holds 6–8 shots; *"go all out"* is an effort multiplier on top of a high reasoning effort.

Its weakness: hundreds of identical prompts produced reels that rhyme with each other. Variants that escaped it:

```
# Longer, with a sound bar
make a dynamic 16:9, 60-second motion graphics showreel that shows your real creative limits.
S-tier sound design, no generic synth pads. Compose an original piano score and sync every
cut to it. Export 1080p MP4.

# Anti-slop guardrail
make a dynamic 10-second motion graphics video that introduces who you are.
Avoid frames and text in the corners, the usual giveaways of AI-made video.

# Story instead of techniques
use your showreel energy, but tell a story: the history of [TOPIC] from [START] to today,
surprise me with the storyboard. 45 seconds, vertical 9:16.

# Agency persona
make a 30-second showreel as if you were a niche branding studio for startup founders.
Create every graphic from scratch. One accent color. Every shot is a different technique.
```

**Brand** — the version that sells something. Three extra lines over the one-liner do it: the product URL, *"use actual product screenshot, logo, assets"*, and *"must have music"*. Full template:

```
Make a dynamic 20-second motion graphics video for [PRODUCT] ([URL]), with the energy
of a motion designer's showreel. Go all out.

Assets
- Visit the site. Use real screenshots (Playwright), the real logo, real colors and fonts.
  Save everything to ./assets and list what you found before you animate.
- Never redraw the product UI from imagination. Crop and animate the real thing.

Story (one beat each, 2 to 4 seconds)
1. Hook: the problem in 5 words of huge kinetic type.
2. The product appears, the UI assembles itself piece by piece.
3. Three features, each as a UI moment with a cursor doing a real action.
4. One number that proves it works: [METRIC].
5. Logo lockup + [CTA].

Sound
- Original music, 120 BPM, synthesized in code. UI clicks and whooshes on the beat.

Format: 1080x1920 (9:16) first, then 1:1 and 16:9 from the same timeline.
Before the full render, show me a contact sheet of one frame per beat.
```

A talking character is the upgrade on top of this: pass a voice key and ask for a character who explains the product. Voice plus mascot is what turns a clip into a service.

## Never paste a real key

Put keys in `.env` and name the variable in the prompt — *"the ElevenLabs key is `ELEVENLABS_API_KEY` in `.env`"*. Public prompts that leaked a key used a joke placeholder for exactly this reason, and you will screenshot your prompt.

## One timeline, every format

Write scenes against a **layout function**, not fixed pixels:

```js
const L = (x, y, w, h, F) => ({ ... });   // F = '9:16' | '1:1' | '16:9'
```

Then render all three from the same timeline, in parallel. Reframe type and UI per format — a caption band, a UI inset, a different type size. **Never crop a 16:9 render to vertical**; the result always looks like a crop, because it is one.

## Banned by default

These are the defaults that make a video read as machine-made. They are banned unless the brief asks for them:

- centered title on a gradient
- everything fading in
- corner labels and frame borders
- glow on UI chrome
- generic particle bursts
- bouncy easing on UI
- a logo lockup doing a slow zoom as the ending