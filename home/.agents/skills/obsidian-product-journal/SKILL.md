---
name: obsidian-product-journal
description: Maintain an English Obsidian product journal for decisions, learnings, monetization, distribution.
---

# Obsidian product journal

Keep durable product + engineering memory in Obsidian — **English only**. Works for **any** product; never hardcode a product name.

## Default vault

```
/Users/macuser/Works/personal/obsidian
```

Override if the user names another vault. **All products live under `Products/`:**

```
<vault>/Products/<ProductName>/
```

Also maintain a vault-level index at `Products/MOC.md` listing every product.

Ask for (or infer from context) `<ProductName>` before writing. Do not assume a default product. Never create a product journal at the vault root.

## Folder layout (required)

```
Products/
├── MOC.md                 # index of all products
└── <ProductName>/
    ├── 00 - Index/
    │   ├── MOC.md
    │   ├── Technical decisions.md
    │   ├── What works.md
    │   ├── What doesn't work.md
    │   ├── Monetization.md
    │   └── Distribution.md
    ├── Decisions/          # one note per decision
    ├── Learnings/          # what worked / didn't
    ├── Monetization/
    ├── Distribution/
    └── _templates/
        ├── Technical decision.md
        ├── Learning.md
        ├── Monetization note.md
        └── Distribution note.md
```

If `Products/` or the product folder is missing, create this tree + index stubs + templates before writing notes. When adding a **new** product, also link it from `Products/MOC.md`.

## When to write

| Trigger | Destination |
|---|---|
| Architecture / stack choice locked | `Decisions/` |
| Something validated in build/prod | `Learnings/` (`worked: true`) |
| Trap / dead end / cost surprise | `Learnings/` (`worked: false`) + link from What doesn't work |
| Price, margin, billing model | `Monetization/` |
| Channels, CTAs, funnel, go-to-market | `Distribution/` |

Paths above are relative to `Products/<ProductName>/`. After creating a note, **link it** from the matching `00 - Index/*.md` list.

## Note rules

1. **English only** — titles, bodies, folder names, templates.
2. **One note = one idea.** Prefer dated titles for decisions: `YYYY-MM Short decision title`.
3. **No secrets** — no API keys, tokens, passwords, `.env` values. Link GitHub issues instead.
4. Use wikilinks relative to the product folder: `[[Decisions/YYYY-MM …]]`. From vault root / Welcome, use `[[Products/<ProductName>/…]]`.
5. Link build work to issues when known: `https://github.com/<org>/<repo>/issues/N`.
6. Tags use a **product slug** derived from the folder name (lowercase, hyphenated) — never bake one product into the skill.

## Templates (use verbatim structure)

### Technical decision

```markdown
---
type: decision
status: accepted
date: YYYY-MM-DD
tags:
  - <product-slug>
  - decision
---

# <Title>

## Context

Why did we need to decide?

## Options

1. …
2. …

## Decision

We choose **…** because …

## Consequences

- Upside:
- Downside / debt:
- Revisit if:
```

### Learning

```markdown
---
type: learning
worked: true   # or false
date: YYYY-MM-DD
tags:
  - <product-slug>
  - learning
---

# <Title>

## Attempt

What did we try?

## Result

What happened?

## Lesson

What do we keep / never repeat?
```

### Monetization note

```markdown
---
type: monetization
date: YYYY-MM-DD
tags:
  - <product-slug>
  - monetization
---

# <Title>

## Hypothesis

## Price / structure

| Item | Who pays | Amount / rule |
|---|---|---|
| Product plan | Customer → us | |
| Pass-through / network fees | Customer → third party | when applicable |
| AI / infra COGS | Us | cap / overage |

## Expected margin

## Risks

## Links (issues / docs)
```

### Distribution note

```markdown
---
type: distribution
date: YYYY-MM-DD
tags:
  - <product-slug>
  - distribution
---

# <Title>

## Channel

## Message

## Funnel

1. …
2. …
3. …

## Metrics to watch

-

## What worked / didn't
```

## Workflow

1. Confirm **product folder name** (required — ask if unclear).
2. Ensure `Products/<ProductName>/` layout exists (bootstrap if needed).
3. Link new products from `Products/MOC.md`.
4. Classify the user’s ask → Decisions / Learnings / Monetization / Distribution.
5. Write the note with the matching template.
6. Update the relevant `00 - Index/*.md` and product `MOC.md` if status changed.
7. Tell the user the vault-relative path (wikilink under `Products/`).

## Bootstrap MOC stub

When creating a new product folder, seed `00 - Index/MOC.md` with links to the five index notes + the four templates. Keep current-state bullets short and factual; fill from conversation context for **that** product only. Ensure `Products/MOC.md` lists the product.

## Anti-patterns

- Do not create product journals at the vault root — always under `Products/`.
- Do not hardcode or default to a specific product name.
- Do not write non-English into this journal unless the user explicitly overrides.
- Do not dump raw chat transcripts — distill into Context / Decision / Lesson.
- Do not put deploy secrets or customer PII in notes.
- Do not invent pricing as settled fact; mark hypotheses clearly until a pricing decision is locked.
