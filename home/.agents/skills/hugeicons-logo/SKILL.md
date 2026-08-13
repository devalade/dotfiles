---
name: hugeicons-logo
description: Create minimal geometric SVG logos in the style of Hugeicons' free logo set — rounded-square (squircle) icon marks with opacity-layered depth, flat or single-color gradient finishes, and a clean geometric wordmark. Use when the user wants a logo, brand mark, app icon, favicon, monogram, or placeholder logo inspired by Hugeicons logos.
---

# HUGEICONS-STYLE LOGO SKILL

You are a logo designer working in the exact style of the Hugeicons free logo set.

The signature look is one simple geometric mark inside a **squircle**, drawn as clean flat vector shapes with a subtle **depth** trick (offset duplicate shapes at lower opacity), in **black or a single brand color**, paired with a **geometric sans-serif wordmark**.

Everything must look like it was drawn on a grid, reduced to the minimum, and scalable down to 44px.

---

## STYLE DNA (non-negotiable)

Every logo you produce must obey these rules. They are the reason the Hugeicons set reads the way it does.

1. **Squircle container.** The icon sits in a rounded square whose corner radius is ~21.6% of the side (44px square → `rx="9.5"`; a 24px inner square → `rx="4.7"`). Never a circle, never a sharp square, never a pill.
2. **One mark, one idea.** A single reduced geometric symbol. No multi-element icon collages, no gradients inside the mark, no photos, no mascots.
3. **Opacity-layered depth.** The mark (or a container element) is duplicated and offset diagonally, with the back copies at `opacity="0.4"` and `opacity="0.2"` and the front copy at full opacity. This offset-stack is the signature move.
4. **Monochrome or single brand color.** Black marks on light; white marks on a dark/colored squircle. At most one accent color per logo.
5. **Geometric wordmark.** A clean geometric sans-serif (Inter / Poppins / Cera Round weight) set next to the mark on the same baseline, roughly 2.5× the mark height, tight tracking. Never a serif, never a script, never a stencil.
6. **Grid discipline.** Every coordinate is a clean number; shapes align to a 44×44 grid, centered with generous padding (~25% of the container).

---

## CONSTRUCTION SYSTEM

### The squircle

`44 × 44` canvas, `rx ≈ 9.5` (21.6% corner radius). Inner bevel stroke sits ~1.8px inset. Full copy-paste SVG recipes — flat, gradient, bevel, and inner-glow finishes — live in [`references/svg-recipes.md`](references/svg-recipes.md). Use them verbatim; do not hand-retype the filter/gradient boilerplate.

### The depth trick (works for any shape)

Draw the mark, then draw two back copies offset diagonally (e.g. `-3.6, +3.6` and `-7.2, +7.2` on a 44 grid), front copy last:

```svg
<rect opacity="0.4" x="14" y="14" width="20.7" height="20.7" rx="4.1" fill="white"/>
<rect opacity="0.2" x="10.4" y="17.6" width="20.7" height="20.7" rx="4.1" fill="white"/>
<rect x="17.6" y="10.4" width="20.7" height="20.7" rx="4.1" fill="white"/>
```

Use two back copies (0.4 then 0.2, farthest to nearest), never one, never three.

### Mark library

Build the symbol from one of these families, chosen by the brand meaning (see Workflow step 2):

| Family | Visual | Good for |
|---|---|---|
| **Stacked squares** | 3 offset rounded squares | layers, systems, data, stacks |
| **Offset twin** | one shape + its 0.4/0.2 offset copies | motion, copies, sync, reflections |
| **Geometric glyph** | arrow, link, hex, chevron, abstract path (even-odd fill) | action, direction, connection |
| **Geometric monogram** | a letter built from strokes/negative space | named brands |

Keep the mark abstract, not literal. An arrow, not a whole cursor. A link, not a chain with links.

---

## WORKFLOW

Follow these steps in order. Each ends on a checkable condition.

### 1. Extract the brief

Pull out: brand name, category, one-word personality, and the single metaphor the logo must carry.

**Done when** you can state in one sentence what the brand is and what its mark should mean.

### 2. Choose the mark

Map the metaphor to one mark family from the library above. Pick one. If you can't justify the shape in one line, it's the wrong shape.

**Done when** the mark has a one-line rationale tying it to the brand.

### 3. Choose the finish

Pick one finish for the squircle container:
- **Flat** — solid black or solid brand color.
- **Gradient** — vertical gradient, lighter at top, darker at bottom, with a 1.8px gradient bevel stroke.
- **Inner glow** — gradient + a soft inner shadow offset upward (adds a subtle top highlight).

**Done when** the finish is a single named choice, not a pile-up of effects.

### 4. Build the SVG

Use the recipes in [`references/svg-recipes.md`](references/svg-recipes.md). Substitute the brand color and the mark shape. Keep all coordinates as clean integers on the 44 grid.

**Done when** the SVG validates (well-formed, no missing `</tag>`, unique gradient/filter `id`s) and renders the mark centered with ~25% padding.

### 5. Deliver the lockup

Produce the variants, in this order, as separate clean SVGs:
1. **Icon-only** — the squircle + mark.
2. **Icon + wordmark** — mark left, wordmark on the same baseline (~2.5× mark height, tight tracking).
3. **Mark-only** (optional) — just the symbol, no container, for favicons.

**Done when** every variant shares identical mark geometry and identical color.

---

## OUTPUT STANDARD

The result must read as:
- reduced to the minimum number of shapes
- grid-aligned and perfectly centered
- monochrome or single-color
- consistent geometry across all variants
- ready to drop into a 44px UI slot or a mockup

## ANTI-PATTERNS

Never produce:
- circles, sharp squares, or pills instead of squircles
- multi-color palettes or rainbow gradients
- gradients inside the mark
- more than two depth layers
- literal/clipart symbols (full cursors, full chains, faces)
- serif, script, or stencil wordmarks
- inconsistent mark geometry between icon and wordmark variants
