# Motion studio rules

Apply these rules whenever generating or editing a motion video, in any project.

## Render contract
- Every film is a pure function of time: `window.seek(t)` paints frame t.
- No CSS transitions, no setTimeout, no requestAnimationFrame in render mode,
  no state carried between frames. Seeded noise only (mulberry32), never Math.random.
- Render with `node render.mjs`, encode H.264 yuv420p, CRF 16.

## Story
- Pain before features, in every video (pain-first-pitch skill). Before any
  feature appears, the film says who it is for (organization type, size, role),
  which workflow hurts, what kind of tool it is, and what it is not for.
- The hook shows that pain in the viewer's own world. Each feature shown must
  answer it.

## Look
- Banned defaults: centered title on gradient, everything fading in,
  corner labels and frame borders, glow on UI chrome, generic particle bursts.
- One display face, one UI face. One accent color unless the brief says otherwise.
- Every 2 to 4 seconds something new must happen on screen.

## Sound
- Score and SFX are synthesized in code unless a track is supplied.
- Place hits on the measured beat grid (beats.json). Loudness -14 LUFS.

## Loop before you show me anything
1. Render one frame per beat as a contact sheet and LOOK at it.
2. Score it 1-10 on: hook in first 2s, pain clarity (after 5s, can a
   stranger say who it is for and what hurts?), readability at phone size,
   motion quality, variety, brand accuracy, sound sync.
3. Fix the 3 worst problems. Repeat until every score is 8+.
4. Only then do the full render.

# terminal-browser

A real browser runs inside a terminal pane on this machine, so pages do not
need to be described in chat.

- Open a page with `terminal-browser open <url> --split left --size 0.5`. The
  browser takes the left pane and the conversation stays in the right one.
- Use it for anything visual: a built site, a localhost port, or an HTML file
  you just wrote (`terminal-browser open ./plan.html --split left --size 0.5`).
- Drive an open tab with `terminal-browser action -- <cmd>` (snapshot, click,
  fill, eval), then clear the indicator with `terminal-browser action done`.
- `terminal-browser ls` lists the browsers open in this tab.

# How I work

- Ship loop: after a verified change in a project with a Deploy section, commit on the
  current main/dev branch, deploy, and end with the live URL. This is a standing
  authorization to commit and deploy without asking. Don't create feature branches
  unless I ask. I'll say "don't deploy" when I mean it.
- When I state a product decision ("owner answers from the app", "no live mode"),
  write it to the project's docs (ADR or AGENTS.md) right away, not only to memory,
  so it survives compaction.
- Quote my verdicts exactly. "Not bad" is not "love".
- After any UI change: seed realistic and messy data, print the login, open the page
  in terminal-browser at 390 and 1440, and look at it before telling me it's done.
- Smallest test that answers the question. No benchmark suites unless I ask.
- Plain words and short replies by default.
- My prompts are often dictated: "airport" = AirPods, "laundry page" = landing page,
  "download format" = dropdown. Read for intent; don't ask me to fix wording.
