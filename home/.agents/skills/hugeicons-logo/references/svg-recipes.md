# HUGEICONS-STYLE SVG RECIPES

Copy-paste templates for the Hugeicons logo construction. Replace `{PLACEHOLDERS}` and the `<!-- MARK -->` slot, keep everything else identical.

## 1. Flat squircle (solid color)

```svg
<svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="44" height="44" rx="9.5" fill="{COLOR}"/>
  <!-- MARK -->
</svg>
```

`{COLOR}` is `#1F2123` (near-black) or the single brand color. White mark on dark; black/`{COLOR}` mark on a light/white background (omit the rect fill).

## 2. Gradient + bevel squircle

```svg
<svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="22" y1="0" x2="22" y2="44" gradientUnits="userSpaceOnUse">
      <stop stop-color="{LIGHT}"/>
      <stop offset="1" stop-color="{DARK}"/>
    </linearGradient>
  </defs>
  <rect width="44" height="44" rx="9.5" fill="url(#g)"/>
  <rect x="0.9" y="0.9" width="42.2" height="42.2" rx="8.6" stroke="url(#g)" stroke-width="1.8"/>
  <!-- MARK -->
</svg>
```

`{LIGHT}`/`{DARK}` are two shades of the same brand color (e.g. `#535BF3` → `#3B43DB`, or `#2B2D2F` → `#131517`). Light always at top.

## 3. Inner glow (soft top highlight)

Add this `<filter>` to the gradient recipe and put `filter="url(#glow)"` on the **outer** rect.

```svg
  <defs>
    <filter id="glow" x="0" y="-18" width="44" height="62" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="bg"/>
      <feBlend mode="normal" in="SourceGraphic" in2="bg" result="shape"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="-18"/>
      <feGaussianBlur stdDeviation="11"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 {R}  0 0 0 0 {G}  0 0 0 0 {B}  0 0 0 0.3 0"/>
      <feBlend mode="normal" in2="shape" result="glow"/>
    </filter>
  </defs>
```

`{R} {G} {B}` is the brand color normalized to 0–1 (e.g. `#474FE7` → `0.278431 0.309804 0.905882`). Use only **one** of gradient, bevel, and glow unless the brief asks for depth; never all three.

## 4. Depth trick (offset back copies)

Two back copies, farthest first, at `opacity="0.4"` then `0.2`, front copy last. Offset diagonally by `-3.6, +3.6` and `-7.2, +7.2` on a 44 grid.

```svg
<g>
  <rect opacity="0.4" x="12.6" y="12" width="20.7" height="20.7" rx="4.1" fill="{MARK_COLOR}"/>
  <rect opacity="0.2" x="9"    y="15.6" width="20.7" height="20.7" rx="4.1" fill="{MARK_COLOR}"/>
  <rect x="16.3" y="8.4" width="20.7" height="20.7" rx="4.1" fill="{MARK_COLOR}"/>
</g>
```

For a non-rect mark, wrap the shape in `<g transform="translate(...)">` instead of offsetting coordinates:

```svg
<g>
  <path opacity="0.4" transform="translate(-3.6 3.6)" d="{PATH}"/>
  <path opacity="0.2" transform="translate(-7.2 7.2)" d="{PATH}"/>
  <path d="{PATH}"/>
</g>
```

`{MARK_COLOR}` is `white` on a dark/colored squircle, `black` or `{COLOR}` on light.

## 5. Icon + wordmark lockup

Icon block occupies `0–44` on x; wordmark starts at `x="56"`. Match baselines.

```svg
<svg width="180" height="44" viewBox="0 0 180 44" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- icon (44x44 squircle + mark) here -->
  <text x="56" y="30" font-family="Inter, -apple-system, 'Helvetica Neue', sans-serif"
        font-size="20" font-weight="600" letter-spacing="-0.02em" fill="{WORDMARK_COLOR}">Brandname</text>
</svg>
```

`{WORDMARK_COLOR}` matches the mark color. In final production delivery, convert the wordmark to outlined paths so it renders identically everywhere; keep the geometric sans-serif weight and tight tracking.

## Reference geometry (44 grid)

- Container: `0 0 44 44`, `rx="9.5"`.
- Mark padding: keep the mark inside a centered ~32×32 box (≈25% breathing room).
- Corner radius of nested elements scales with size — `rx ≈ size × 0.2`.
