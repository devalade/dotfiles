# Pitfalls (each one cost a render on the first film)

## Picture

- **`visibility: hidden` on a scene container leaks.** A child set to `visibility: visible` (which `tf()` does) shows through a hidden parent. Scenes then bleed into each other, and frames depend on the previous seek, which breaks the render contract. Toggle scenes with `display: none`, including the phone itself.
- **Empty phone screens.** A bottom-anchored chat with one or two bubbles leaves most of the screen blank, and blank reads as dead at phone size. Pre-fill a short history (a day separator, two older messages) and zoom the camera (1.25 to 1.45) onto the bubbles.
- **Bubble type size.** Real-scale chat text is unreadable on a phone watching a 1080-wide video. Use 37 px bubble text in a 680 px wide screen, and notification text at 32 px.
- **Match cuts measured with `offsetLeft` miss** by the padding and offset-parent chain. Measure with `getBoundingClientRect()` in `measure()`, before any transform is set, relative to the thread or layer the point lives in.
- **Start the match-cut dissolve only after the camera arrives**, and keep it at 0.2 s, or two misaligned layers show for several frames.
- **Morph sources inside a zoomed phone** must be scaled by the camera too (`phoneMap` returns `s`). Otherwise the flying logo starts at the wrong size.
- **A morph that passes through a featureless solid square** (logo to bubble) looks like a bug. Keep the logo artwork visible until the last 0.25 s of the flight, then cross to the bubble colour.
- **Fast moves with 4 sub-frames strobe** into stepped copies (a phone moving 80 px per frame). Use adaptive sub-frames per segment (12 in fast windows, 3 elsewhere), then concat the segments with `-c copy`.
- **mjpeg input yields `yuvj420p`** (full range). Add `scale=in_range=pc:out_range=tv,format=yuv420p` to the filter chain.

## Sound

- **A `for` loop whose step shrinks geometrically never reaches its bound** (`t += .11 * 0.86^i` converges below the limit). Bound accelerating loops by count, not by time.
- **The kick and sub dominate the peak**, so normalising by peak makes everything else quiet, and phone speakers drop that energy anyway. Keep the kick around 0.27, the bass around 0.11 and the boom around 0.25, and give the mids (kalimba, shaker) the presence.
- Check the act-by-act loudness shape: the night act about 5 LU under the groove, the held breath quietest, the hits loudest.

## Tooling

- **Homebrew ffmpeg may lack `drawtext`.** Don't depend on it for labels. Contact sheets are in time order instead (8 frames per row, 0.6 s apart).
- **ffmpeg in a shell loop eats stdin**, so the loop runs once silently. Pass `-nostdin`.
- **`cat > file` with no heredoc or input waits on stdin forever.** Never leave one in a command.
- **Opening a video while it's still being written**, then overwriting it, leaves QuickTime showing a broken copy (a black screen, then the first frame). Open only after the mux finishes, and quit QuickTime before re-rendering.
- Python on the machine may lack numpy. Do audio analysis with ffmpeg (`ebur128`, `showspectrumpic`, `showwavespic`) or in Node.
- `node_modules` can be a symlink to a sibling project that already has Playwright.
