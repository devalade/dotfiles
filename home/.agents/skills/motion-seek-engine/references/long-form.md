# Long-form and autonomous runs

A 15-second reel is one sitting. A two-minute music video or a five-minute history film is a **production**: a brief, gates, parallel subagents, and a critique loop that runs whether or not anyone is watching.

## The brief

Five minutes of dictation, then twelve hours of work. The prompt behind a viral autonomous run runs about 9,500 characters, and another 19,000-character version exists. Both have the same skeleton — they don't describe a video, they **hire a crew**:

```
You are the director, animator, sound designer and render engineer for a [DURATION] film
made in code. Treat this as a multi-session production. Don't rush to a final render.

## The film in one line
[LOGLINE. What the viewer should feel at the end.]

## References and inputs
- ./refs/ : [video / frames / image library]. Take the grammar, never the content.
- ./audio/track.wav : use it unchanged. Measure beats with beats.py first.
- Skills available: [/remotion-best-practices | /hyperframes | /claude-animation].
- APIs in .env: [ELEVENLABS_API_KEY, FAL_KEY]. Budget: [$X]. Be economical.

## Look
[3-5 lines: palette, type, texture, camera language. Banned looks.]

## Beat sheet
0:00-0:02  hook: [the single most striking image]
0:02-0:10  [act 1]
...        a new visual payoff every 3-5 seconds
[END]      the last frame sets up the first frame (loop)

## Workflow, with gates
1. Write docs/style_guide.md and docs/shotlist.md (every shot: frames, camera, text, SFX).
   Show me the shot list. Then continue without waiting if I don't answer in 10 minutes.
2. Build stills for every shot. Contact sheet. Critique.
3. Animatic at 960x540 with placeholder audio. Fix pacing before polish.
4. Full animation, polish pass, sound pass, final render.
5. Split work across subagents per chapter. Write docs/ANIMATION_GUIDE.md first
   so every subagent codes in the same style.

## Critique loop (every shot, at least 3 rounds)
Render 3-5 stills, score 1-10 on: hook, readability at 360px wide, motion, composition,
depth, sound sync, polish. Log scores + 3 biggest problems in docs/review_log.md. Fix. Repeat
until all are 8+.

## Deliverables
out/final.mp4 · out/loop_check.mp4 · out/poster.png · out/contact.png · README.md
```

What that skeleton buys you, block by block:

| Block | What it prevents |
| --- | --- |
| Logline | every later decision can be checked against one sentence |
| References | the model's default look |
| Tools, keys, budget | invented UI, invented assets, runaway API spend |
| Character bible | a mascot or figure that changes identity between shots |
| Beat sheet with a payoff every 3–5s | a film that plateaus after the intro |
| Text-on-screen rules | captions colliding with the composition |
| Workflow gates | polishing a film whose story does not work |
| Critique loop | shipping the first render |
| Deliverables | a render with no poster, no loop check, no source |

## Generate, then trace

The move that makes a long film tractable: let a **video model** render the base shots — it gives you motion and physics that are genuinely hard to hand-code — then **redraw the whole thing in JavaScript on top**, so the viewer only ever sees the code-drawn layer.

Video models for the physics. Code for the look. The two together are what an autonomous run actually did, and re-running the same brief against a different image library produced a completely different film from the same instructions.

## Subagents that stay in one style

Split by chapter — one subagent per `src/ch/NN-*.js` — but write `docs/ANIMATION_GUIDE.md` **first**: the shared palette, the spring table, the helper signatures, the naming, the rule that everything is a pure function of `t`. Without it, six subagents produce six different visual languages and the seams are worse than doing it sequentially.

`STORYBOARD.md` goes out after the first generation pass, when there is something concrete to point at.

## Gates

Each gate locks before the next layer is built:

1. **Style** — `style_guide.md`, five still frames, contact sheet.
2. **Story** — `shotlist.md` and beat sheet, approved or corrected.
3. **Stills** — one real frame per shot, contact sheet, scored.
4. **Animatic** — 960×540 with placeholder audio. Pacing is fixed here, cheaply.
5. **Full pass** — animation, then polish, then sound, then final render.
6. **Critique** — `docs/review_log.md`, minimum three rounds, all scores 8+.

The one non-negotiable: **render stills before rendering time.** A still costs milliseconds; a two-minute film costs minutes. Every pacing and composition decision is cheaper as a still.

## Cost reality

Long autonomous runs are measured in hours and hundreds of calls, not minutes. The honest numbers from the trend: a 142-second music video at 2.1M views from a 9,500-character brief and a 12-hour run; a watercolor short at 163 calls and about seven hours. Both shipped. Both looked better than the one-shots they were posted against, because they were reviewed.

Budget in the brief, measure the spend, and don't let a "final render" happen before the animatic has been watched by a human.