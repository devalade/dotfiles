# Springs

Cheap motion eases from A to B on a fixed curve. Expensive motion has mass: it accelerates, overshoots a hair, settles. The difference is a **closed-form spring** — and it has to be closed form, because a simulated spring needs the previous frame and `seek(t)` must render frame 812 without frames 0 to 811.

## The library

```js
M.spring(t, k, d)                    // 0 -> 1, the step response of one change
M.step(t, t0, from, to, k, d)        // one value, one change, any endpoints
M.track(t, [[t, v], ...], k, d)      // ONE value, MANY changes
M.trackVec(t, [[t, [x, y]], ...])    // the same for a cursor
M.stagger(t, i, delay, k, d)         // grid reveal: item i starts delay later
M.indicator(t, stops)                // tab underline that stretches between stops
M.swapAlpha(t, tIn, tOut)            // text in/out windows inside a morphing box
M.loopT(t, dur)                      // wrap time so the last frame equals the first
M.shotAt(t, scenes)                  // active scene + local time
M.rng(seed)                          // seeded noise; Math.random is banned
```

`k` is stiffness (higher = faster), `d` is damping (higher = less overshoot). Settling time ≈ `4 / (ζ·ω₀)` where `ω₀ = √k` and `ζ = d / (2√k)`.

## Tuning by element

| Element | k | d | Reads as |
| --- | --- | --- | --- |
| Buttons, toggles, leading edges | 320–400 | 28–34 | snappy, a hair of overshoot |
| Cards, containers, camera | 170 | 26 | default; arrives, does not bounce |
| Big type, 3D objects, logo lockups | 120–170 | 26–30 | heavy, no visible wobble |
| Mascots, stickers, playful props | 200–260 | 14–18 | visible overshoot |

Rule of thumb: **tiny overshoot on UI, none on type.** Premium product films do not overshoot their interface. A `d` under about 18 on anything that represents a control reads as bouncy and cheap.

## The trick most people miss

When a value changes target several times — a cursor, a container's width, a chart's value — **you do not restart the spring.** You add one spring per change, each starting at its own time, and let the responses sum:

```js
// the cursor's x as a fraction of width
const xs = [[0, 0.5], [1.2, 0.2], [2.4, 0.8], [4.0, 0.3]];
ctx.fillRect(M.track(t, xs, 200, 24) * W, y, 12, 12);
```

The motion stays continuous when the target changes mid-flight — no snap, no restart — and you can still evaluate it at any `t` in isolation. A cursor that re-springs on every retarget reads as a machine teleporting; this reads as a hand.

## Two composites worth keeping

**An indicator that stretches.** Leading and trailing edges on different springs, so the bar smears between stops instead of jumping:

```js
export function indicator(t, stops) {
  const lead  = M.track(t, stops, 320, 30);   // stiff leading edge
  const trail = M.track(t, stops, 140, 22);   // soft trailing edge
  return { left: Math.min(lead, trail), right: Math.max(lead, trail) + 120 };
}
```

**Text inside a morphing container.** Type enters *after* the morph starts and leaves *before* the next one. Overlapping text during a swap is the single most common defect in AI-generated UI motion, and this removes the whole class of it:

```js
g.globalAlpha = M.swapAlpha(t, tIn, tOut);   // fade = 0.12s by default
```

## Seamless loops

The last frame must equal the first — cursor position and velocity included:

```js
window.seek = (t) => { draw(M.loopT(t, DUR)); return true; };
```

Velocity matters as much as position. If a value's spring is still moving at `t = DUR`, the seam shows a jump; ease every looping value back to its start state by `DUR - 0.3`.

## What not to do

- **Don't reach for a tween library here.** GSAP and friends track time by mutating state over a timeline; that is exactly the thing `seek(t)` forbids. Use them in route B, not route A.
- **Don't use `transition` or `animation` in CSS** for anything the film shows — the renderer screenshots the element as it happens to be at capture time, so a mid-transition element renders as a half-faded frame at an arbitrary point.
- **Don't use `will-change` on anything the camera scales.** It promotes the layer and the scaled text goes soft.
- **Don't animate a value a camera zooms into without the camera.** Scale is not motion; the overshoot has to be visible.

## The felt result

| Fault | Cause | Fix |
| --- | --- | --- |
| "Sliding instead of easing" | a linear move or a fixed bezier | `M.step` / `M.track` with a spring |
| Everything arrives at once | no stagger | `M.stagger(t, i, 0.03)` |
| Dead frame mid-transition | nothing scheduled on that beat | check the contact sheet for repeated tiles |
| Cursor jumps | spring restarted per retarget | `M.track` with one keyframe per target |
| Type collides with a morph | independent alpha curves | `M.swapAlpha` |
| Visible seam on a loop | value still moving at `DUR` | ease back to start state by `DUR - 0.3`, `M.loopT` |