# Launch film: "22:47"

Vertical 1080x1920, 30 fps, 48 s, French, no voice (on-screen type carries the story).
Goal: get shop owners to reserve a test place for the new version before the public launch.
Gates were decided by Claude (the user asked for no back-and-forth); every choice below comes
from the landing copy in `apps/web/resources/lang/fr/common.json` or the live brand tokens.

## Brief

- **Viewer**: someone who runs a maquis, a shop or a salon and sells on WhatsApp.
- **Pain, in one sentence**: they write at all hours, and nobody answers in time.
- **Villain**: one message. Kemi, 22:47: "C'est combien la livraison à Yopougon ?"
- **Felt numbers**: 22:47 (the question), 23:31 (she leaves), 22:47 again (answered at once).
- **Longing**: the same message answered the same minute, with the shop's own prices.
- **USP**: when it does not know, it asks you instead of inventing, then remembers.
- **Objection**: "and my number?" Answered: your number stays yours.
- **Claims (whitelist, all from the landing)**: answers with your prices and words; reads a
  photo of your menu; asks you when unsure; you answer once and it remembers; your number
  stays yours; understands voice notes; waitlist is free and without commitment.
- **Do not claim**: dates, prices of the product, numbers of users, "AI".

## Script (on-screen type)

| Act | Time | Type |
| --- | --- | --- |
| Hook | 0 to 4.8 | Ils écrivent à toute heure. |
| Culprit | 4.8 to 9.6 | 22:47. Personne ne répond. / Kemi n'a pas attendu. |
| Turn | 9.6 to 12 | Revenons à 22:47. |
| Title | 12 to 14.4 | Vos clients écrivent. *ZeAssistant répond.* |
| Mechanism | 14.4 to 19.2 | Avec vos prix et vos mots. |
| Menu | 19.2 to 24 | Une photo de votre menu. Il la lit pour vous. |
| Fallback | 24 to 31.2 | Quand il ne sait pas, *il vous demande.* / Vous répondez une fois. Il s'en souvient. |
| Platform | 31.2 to 36 | Votre numéro reste le vôtre. / Il comprend les notes vocales. |
| Payoff | 36 to 40.8 | Même à 22:47. Même le dimanche. |
| CTA | 40.8 to 48 | La nouvelle version arrive. / Testez-la *avant tout le monde.* / zeassistant.com |

Crescendos: the turn (12.0), the hand-over banner (27.0), the place reserved (45.6).

## World

"Le comptoir, la nuit." The problem half lives in the shop's night palette (`--night`
#121a12) on the owner's iPhone lock screen, where messages pile up and the phone buzzes.
The brand green appears first in the typing bubble that answers Kemi, becomes the logo,
and the paper world (`--paper` #f6f2ea) spreads out from it. The payoff returns to the
night, now with every message answered.

- **Faces**: IBM Plex Serif (display, light italic in green for the accent line),
  iA Writer Quattro (all UI). Same as the landing.
- **One accent**: brand green #1f7a3a, held back until 10.8 s.
- **Depth**: containers get a 1px border, no shadow. Only the CTA button has depth (the
  keycap lip from `design.css`).
- **Motifs**: the speech-bubble logo, the chat bubble, the "Lu et ajouté" chip, the keycap button,
  the kalimba (sonic brand: every answered message is a kalimba note).
- **Native transitions**: bubble morph, paper spreading from the brand mark, camera push
  through, match cut on a shared element (1 500 FCFA bubble to menu line).
- **Grain**: seeded per frame, stronger at night, faint on paper.

## Banned (default list plus the user's taste)

Shadows on containers, gradients and glows, vignettes, corner labels, frame borders, particle
bursts, card grids, text parked at the top, hard pops and black dips, linear moves, overshoot on
UI, CSS filters for colour, tweet cards, em-dashes, mono uppercase labels, eyebrow dashes,
01/02/03 numbering, pill CTA buttons, a sound on every landing, Math.random.

## Sound

Synthesized in `audio.mjs`. 100 BPM (beat 0.6 s, bar 2.4 s), so every change sits on the grid.
- Night (0 to 9.6): D minor drone, the phone's buzz is the only rhythm, a clock tick under the culprit.
- Rewind (9.6 to 10.8): ticks running backwards, tape pull-down. Held breath to 12.0.
- 12.0: F major arrives (relative major) with the groove: soft kick, swung shaker, rim,
  bass, kalimba. Progression F, Am, Dm, Bb.
- 36 to 40.8: breakdown, drums out, kalimba answers each notification.
- 40.8 to 45.6: groove back with a build, hit on 45.6, ring out.
- Master -14 LUFS, -1 dBTP.

## Build

```
node render.mjs contact     # one frame per beat, tiled into contact1.png / contact2.png
node render.mjs frame 12.0  # a single frame
node render.mjs video       # silent-fr.mp4, 30 fps, adaptive motion blur, H.264 yuv420p CRF 16
./mux.sh fr                 # synthesize score.wav, normalise to -14 LUFS / -1 dBTP, write zeassistant-launch-fr.mp4
FILM_LANG=en node render.mjs video && ./mux.sh en   # the English version
```

French is the source text in `index.html`. The `EN` table at the top of the script maps each French string to its English line (taken from `apps/web/resources/lang/en/common.json` where the landing has one). Timing and score are shared, and captions shrink to fit when a translation runs long.

`node_modules` is a symlink to `../morph/node_modules` (Playwright).
