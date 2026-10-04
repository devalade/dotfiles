# V2: mascot explainer with voiceover

A mascot walks the viewer through one feature (for example how a team works inside the app). The voice sets the clock: record first, time the picture to the words, and bring the music in last.

## Order of work

1. **Feature truth.** Find the feature in the code (routes, models, pages, translation strings). Write down the 3 to 5 steps a user really takes, with the UI copy for each. If the feature isn't built yet, stop and ask what to show. Never animate an invented UI.
2. **Script per act** in `FILM.md`, written for the ear, in the app's default locale. About 2.5 words per second of film. Acts: hook (the pain of doing it without the feature), the mascot arrives, the steps (one per act, each with one UI object), the result, the CTA. Mark the intended reading of each act ("warm, a little amused").
3. **Voice.** `node scripts/tts-elevenlabs.mjs --help`. Record each act as one continuous take, in 2 or 3 readings with different `stability` and `style` settings. Pick by listening (ask the user, since you cannot hear). The script saves `vo/<act>-<n>.mp3` and `vo/<act>-<n>.json` with word start and end times.
4. **VO timeline.** Lay the chosen takes end to end with 0.4 to 0.8 s of air between acts, and write `vo/timeline.json` (`[{ act, file, start, words: [{ w, t0, t1 }] }]`). From now on every scene starts at a voice time, not a bar time. Captions, if used, come from the word times.
5. **Mouth curve.** `node scripts/mouth.mjs vo/mix-vo.wav vo/mouth.json` writes one mouth-open value (0 to 1) per frame from the voice envelope. The rig reads `MOUTH[Math.round(t * FPS)]`. That keeps it a pure function of time.
6. **Rig.** The mascot is inline SVG built from the brand's shapes (for ZeAssistant: the speech-bubble logo with eyes, not a new character). Parts: body, eyes, lids, mouth, two simple arms. Motion:
   - Idle: a slow breathing scale (0.98 to 1.02, 3 s period).
   - Blinks at seeded times (`mulberry32`), 120 ms closed.
   - Mouth: lerp between closed and open paths with the mouth curve.
   - Gestures (point, wave, nod) are keyed to word times, built with `sp()`. Squash and stretch and slight overshoot are allowed on the character only, never on UI.
   - The mascot looks at whatever the voice is talking about (eye offset towards the UI object).
7. **Expression sheet.** Render one still per state (neutral, pointing, happy, thinking) with `render.mjs frames` and check it before animating any scene.
8. **Scenes.** Same engine and rules as V1: one idea per shot, real UI rebuilt in HTML from the app's CSS, the mascot beside the UI object, never covering it.
9. **Music last.** Synthesize the score on a tempo whose bar lines fall near the act starts. Duck it about 5 dB under speech with 0.3 s ramps (multiply the music bus by a gain curve built from the word times). Keep SFX few and tuned to the key.
10. **Mix.** Voice around -16 dBFS RMS, master -14 LUFS / -1 dBTP with `mux.sh` (add the voice as a third input before loudnorm).

## Banned for the mascot

Generic 3D blobs, a mascot that talks to the camera with nothing else on screen for more than 3 s, lip flaps that ignore the audio, idle bouncing on every beat, a mascot pointing at nothing.
