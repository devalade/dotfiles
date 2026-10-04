<!-- Fill this in per film, then hand it to the renderer as the brief.
     A state list beats a vibe: every state is a beat you can check. -->

<inputs>
Ask me for: my product + URL, 8 to 12 UI states that tell its story, the real data shown in
each state, brand colors + fonts + one accent, a royalty-free track near 120 BPM, formats.
</inputs>

<direction>
Product-film UI motion. One container never cuts: every state is the same element changing
size, radius and fill while its content swaps behind a short blur. A cursor drives every change.
Warm neutral canvas, one accent. Springs with at most a tiny overshoot.
Banned: bouncy easing, glows, gradients on UI chrome, particle bursts, dead time.
</direction>

<structure>
120 BPM, 8 bars, something happens on every beat.
logo → CTA button → email field (typed) → loader → success check → dashboard card
→ chart draws itself → tooltip on hover → ⌘K palette → toast → logo.
</structure>

<build>
1. One HTML file, one canvas, window.seek(t). No CSS transitions, no timers, no carried state.
2. Closed-form springs from scripts/motion.js. A value with many targets = track(), one
   spring per change, not a restarted spring.
3. Text inside a morphing container enters after the morph starts and leaves before the next
   one: M.swapAlpha(t, tIn, tOut).
4. Tab indicators: leading and trailing edges on different springs so they stretch.
5. Beat grid from the track (scripts/beats.py -> docs/beats.json). Start on a downbeat.
   UI sounds on measured peaks.
6. Render in headless Chrome at 60 fps, 4 subframes per frame, blended for motion blur.
7. Scenes take a layout function, not fixed pixels, so 9:16, 1:1 and 16:9 render from
   this one timeline.
</build>

<state-list>
<!-- The deliverable of this spec, on the beat grid. One row per beat. -->

| beat | time | state | what moves | type on screen | sfx |
| ---- | ---- | ----- | ---------- | -------------- | --- |
| 1 | 0.00 | logo | mark scales in on a spring | — | click |
| 2 | 0.50 | CTA button | container grows from the logo | "Start free" | pop |
| 3 | 1.00 | email field | container morphs, caret blinks, text types | you@ | tick |
<!-- fill every beat; nothing empty -->
</state-list>

<gotchas>
Never use will-change on anything the camera scales (blurry text).
The last frame must equal the first, cursor position and velocity included.
No Math.random, no timers, no state carried between frames.
Text never overlaps a container mid-morph.
</gotchas>

<start>
Ask for the inputs, then show me the state list on the beat grid before writing code.
</start>