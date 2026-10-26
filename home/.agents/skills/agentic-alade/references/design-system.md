# Design system reference

The design system is the product's contract with itself. Build it before
features, make it small, and let a linter hold the line.

## Layers

| Layer | Location | May contain | May not contain |
|---|---|---|---|
| Tokens | `src/styles.css` | primitive palette, semantic vars, radius, shadow, motion, type scale | component markup |
| Primitives | `src/components/ui/` | own color, type, radius, internal spacing, states | page layout, data fetching, business rules |
| Patterns | `src/components/patterns/` | composition, layout, empty/loading/error states | new colors, new type steps |
| Routes | `src/routes/` | composition, loaders, params | styling beyond layout |

A route file that contains `p-4`, `text-lg`, or `bg-white` is a refactor ticket.

## Tokens

Three tiers, one direction of dependency. App code may only use tier 2.

```css
/* src/styles.css */
@import "tailwindcss";

/* Tier 1: primitives. Written by @alignui/cli tailwind. Never used in app code. */
@theme {
  --color-gray-50: oklch(0.985 0.002 250);
  --color-gray-900: oklch(0.24 0.01 250);
  --color-blue-600: oklch(0.55 0.19 258);
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --shadow-xs: 0 1px 2px oklch(0 0 0 / 0.06);
  --shadow-sm: 0 1px 3px oklch(0 0 0 / 0.08), 0 1px 2px oklch(0 0 0 / 0.04);
  --duration-fast: 120ms;
  --duration-base: 180ms;
  --duration-slow: 280ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-emphasis: cubic-bezier(0.2, 0, 0, 1.2);
}

/* Tier 2: semantic. The only names app code may use. */
:root {
  --background: oklch(0.99 0.002 250);
  --foreground: oklch(0.22 0.012 250);
  --card: oklch(1 0 0);
  --card-foreground: var(--foreground);
  --popover: oklch(1 0 0);
  --popover-foreground: var(--foreground);
  --primary: var(--color-blue-600);
  --primary-foreground: oklch(0.99 0 0);
  --primary-hover: oklch(0.49 0.19 258);
  --secondary: oklch(0.96 0.004 250);
  --secondary-foreground: var(--foreground);
  --secondary-hover: oklch(0.93 0.006 250);
  --muted: oklch(0.96 0.004 250);
  --muted-foreground: oklch(0.52 0.014 250);
  --accent: oklch(0.95 0.02 258);
  --accent-foreground: var(--foreground);
  --destructive: oklch(0.58 0.2 25);
  --destructive-foreground: oklch(0.99 0 0);
  --destructive-hover: oklch(0.52 0.2 25);
  --success: oklch(0.6 0.13 155);
  --warning: oklch(0.75 0.15 75);
  --border: oklch(0.9 0.006 250);
  --input: oklch(0.9 0.006 250);
  --ring: var(--primary);
}

.dark {
  --background: oklch(0.18 0.01 250);
  --foreground: oklch(0.96 0.004 250);
  --card: oklch(0.22 0.012 250);
  --card-foreground: var(--foreground);
  --popover: oklch(0.22 0.012 250);
  --popover-foreground: var(--foreground);
  --primary: oklch(0.68 0.16 258);
  --primary-foreground: oklch(0.18 0.01 250);
  --primary-hover: oklch(0.74 0.15 258);
  --secondary: oklch(0.27 0.012 250);
  --secondary-foreground: var(--foreground);
  --secondary-hover: oklch(0.31 0.014 250);
  --muted: oklch(0.27 0.012 250);
  --muted-foreground: oklch(0.72 0.012 250);
  --accent: oklch(0.32 0.03 258);
  --accent-foreground: var(--foreground);
  --destructive: oklch(0.66 0.18 25);
  --destructive-foreground: oklch(0.18 0.01 250);
  --destructive-hover: oklch(0.72 0.17 25);
  --success: oklch(0.7 0.12 155);
  --warning: oklch(0.8 0.14 75);
  --border: oklch(0.32 0.012 250);
  --input: oklch(0.32 0.012 250);
  --ring: var(--primary);
}

/* Map semantic vars to utilities. `inline` keeps the var reference live so
   `.dark` overrides work without duplicating utilities. */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary-hover: var(--primary-hover);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary-hover: var(--secondary-hover);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-destructive-hover: var(--destructive-hover);
  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
}
```

Rules:

- If a product needs a color that is not in the semantic layer, add it to the
  semantic layer with a name that says what it means. Never reach for the
  primitive.
- Dark mode is a token swap. `dark:` color utilities in app code are banned.
- Type steps come from the scale (`text-sm`, `text-base`, `text-lg`,
  `text-xl`, `text-2xl`). Headings get components (`PageTitle`,
  `SectionTitle`), not ad-hoc class clusters.
- Motion uses `duration-fast|base|slow` and `ease-standard|emphasis`. Honor
  `prefers-reduced-motion` in the primitive, not per page.

## Banned in app code

| Ban | Example | Use |
|---|---|---|
| Raw palette | `bg-blue-500`, `text-gray-700` | `bg-primary`, `text-muted-foreground` |
| Literal colors | `bg-[#fff]`, `text-[rgb(0,0,0)]` | token |
| Arbitrary values | `p-[13px]`, `text-[15px]`, `w-[437px]` | scale step or a token |
| Inline style | `style={{ color: 'red' }}` | variant or token; dynamic values via CSS var |
| Manual dark overrides | `dark:bg-gray-900` | semantic token |
| Restyling a component | `<Button className="p-6">` | `size` prop, or fix the design |
| Conditional template strings | `` `bg-${tone}-500` `` | `cn()` with a map of static classes |

## Component anatomy

```tsx
// src/components/ui/button.tsx
/**
 * Button owns color, height, padding, radius, typography, and states.
 * Caller may set layout only: margin, width constraints, alignment, order.
 */
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ' +
    'transition-colors duration-fast ease-standard ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ' +
    'disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-hover',
        ghost: 'hover:bg-muted',
        danger: 'bg-destructive text-destructive-foreground hover:bg-destructive-hover',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'size-10',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export type ButtonProps = React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
```

Conventions:

- Contract comment at the top of every primitive. One sentence on what it owns,
  one on what a caller may change.
- `data-slot="<name>"` for test and styling hooks.
- `cva` for variants, `cn` for conditionals. No boolean prop soup.
- Variants are a design decision: two sizes, two or three tones. A new size is a
  design review, not a pull request.
- Composition over configuration: `asChild` or a `render` prop beats ten
  optional props.
- React 19: no `forwardRef`.

## Ownership boundary

| Caller owns | Component owns |
|---|---|
| margin, width constraint, alignment, order | height, padding, internal gap |
| parent `gap` and grid placement | color, background, border |
| content and children | typography, radius, elevation |
| semantic intent (`variant="danger"`) | what danger looks like |

## Promotion rule

- Second use of the same *shape and intent*: promote to a pattern.
- Second use with a different intent: leave the duplication.
- Third copy of a block inside one file: extract within the file first.
- Never extract on speculation. A wrong abstraction costs more than duplicated
  markup.

## Gallery

```tsx
// src/routes/design.tsx
import { createFileRoute, notFound } from '@tanstack/react-router'

export const Route = createFileRoute('/design')({
  beforeLoad: () => {
    if (import.meta.env.PROD) throw notFound()
  },
  component: DesignGallery,
})

function DesignGallery() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-12 p-8">
      <Section title="Buttons" note="every variant × size × state">
        {/* default, hover hint, focus, disabled, loading, icon-only */}
      </Section>
      <Section title="Forms" note="label, hint, error, disabled, read-only">
        {/* ... */}
      </Section>
      <Section title="Overlays" note="dialog, popover, tooltip, toast">
        {/* ... */}
      </Section>
      <Section title="Data" note="table with data, empty, loading, error">
        {/* ... */}
      </Section>
    </main>
  )
}
```

The gallery is the review surface. Screenshots of it go in the PR. If a state
is missing from the gallery, it does not exist.

## Lint gate

`.oxlintrc.json`:

```json
{
  "jsPlugins": ["@shadcn/lint"],
  "ignorePatterns": ["src/components/ui/**", "src/routeTree.gen.ts"],
  "settings": {
    "shadcn": {
      "ui": "@/components/ui",
      "componentImports": ["^@/components/patterns(/|$)"],
      "mergeFunctions": ["cn"],
      "variantFunctions": ["cva", "buttonVariants"],
      "note": "docs/design-system.md is the source of truth. Ask before adding a component."
    }
  },
  "rules": {
    "shadcn/no-restyle": [
      "error",
      {
        "allow": ["layout"],
        "contracts": [
          { "pattern": "^Button$", "allow": ["layout"] },
          { "pattern": "^CardTitle$", "allow": ["layout", "typography"], "deny": ["font-*"] },
          { "pattern": "^CardContent$", "allow": ["layout", "spacing"] }
        ]
      }
    ],
    "shadcn/no-raw-colors": "error",
    "shadcn/no-arbitrary-values": "error",
    "shadcn/no-inline-styles": "error",
    "shadcn/no-unknown-classes": "error",
    "shadcn/require-static-classes": "error"
  }
}
```

- Primitives are exempt: they are where styling is allowed to live.
- Patterns and routes are linted. That is the point.
- All six rules at `error`. `warn` is ignored by agents and humans alike.
- Keep `note` short and actionable; agents read it.
- `package.json`: `"lint": "oxlint src"`, `"lint:fix": "oxlint src --fix"`.
- `AGENTS.md`: "After making changes, run `pnpm lint` and fix all errors."

## UI review checklist

- [ ] No raw color, arbitrary value, or inline style in the diff
- [ ] New styling lives in a primitive or token, not a caller
- [ ] Every new component has a contract comment and a gallery entry
- [ ] Empty, loading, and error states exist, not just the happy path
- [ ] Keyboard focus is visible; tab order matches reading order
- [ ] Works at 375px and at 1440px
- [ ] Dark mode checked, not assumed
- [ ] `pnpm lint` and `pnpm typecheck` clean
