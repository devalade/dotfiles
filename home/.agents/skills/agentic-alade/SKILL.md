---
name: agentic-alade
description: "Start a new product: design system first, Void + cf deploy."
version: 1.0.0
author: Alade C. Yessoufou, Hermes Agent
license: MIT
platforms: [macos, linux]
metadata:
  hermes:
    tags: [build, product, design-system, tanstack-start, void, cloudflare, cf]
    related_skills: [poteto-mode, code-like-alade, shadcn-lint, cloudflare, durable-objects, implement]
---

# Agentic Alade

The build doctrine for every new product: the order of work, the stack, the
operating loop, and the decision rule. It is opinionated on purpose. When a
project's own `AGENTS.md` says something different, the project wins for
project-specific facts and this skill wins for process.

Read this file fully before scaffolding. Depth lives in `references/`.

## The contract

1. **Design system before features.** Tokens, primitives, patterns, and a live
   gallery exist before the first product screen. No page ships against raw
   Tailwind.
2. **No raw values, ever.** No hex, no `rgb()`, no `p-[13px]`, no
   `bg-blue-500`, no inline `style`. App code speaks semantic tokens only.
3. **Reuse beats invention.** A second use is a signal to promote, not copy.
   New one-off components need a written reason in the PR.
4. **One deploy owner per project.** `cf` or Void, decided in phase 0 and
   written into `AGENTS.md`. Never both, never Wrangler.
5. **`cf` is the Cloudflare CLI.** Wrangler commands do not appear in scripts,
   docs, or CI. If a `wrangler.jsonc` exists, migrate it with `cf migrate`.
6. **Proof over prose.** A task is done when a command, URL, screenshot, or
   test says so. "Should work" is not a status.
7. **Pain ledger.** Every customer pain absorbed goes into
   `docs/pain-ledger.md` with the machinery that absorbs it.
8. **Write it down in the repo.** Decisions, contracts, and gotchas live in
   `AGENTS.md`, `docs/`, and code comments that explain *why*. Not in chat.

## The mantra

> The more pain you can eat on behalf of your customers, the bigger your moat.

Operational reading:

- At spec time, list every step the customer would have to do. Each step is a
  candidate for deletion. Deleting one is a feature.
- Absorb pain in durable machinery: importers, backfills, reconciliation,
  defaults, retries, idempotency, sync, admin tooling, recovery paths. If a
  competitor can copy the screen in a week but not the machinery in a quarter,
  you are on the right work.
- Prefer the hard correct path over the easy partial one when the difference is
  invisible to the customer. That invisibility is the product.
- Log it: pain, who feels it, what now absorbs it, what it costs us, how it is
  verified. An absorbed pain you cannot describe is a bug you have not met yet.

## Phase pipeline

Each phase ends at a gate. Do not start the next phase until the gate passes.

**0. Spec and pain ledger.**
Write `docs/spec.md`: who the user is, the job, the flow, and the data shape in
plain language. Write `docs/pain-ledger.md`. Decide the deploy owner.
Gate: one page, no open questions about who does what, and a named entity list.

**1. Tokens.**
Tailwind v4 CSS-first theme via `@alignui/cli`, then the semantic layer and the
dark values. Gate: every color, radius, shadow, duration, and type step used by
the product exists as a semantic token; `grep` finds no raw value in
`src/components`.

**2. Primitives.**
`src/components/ui/`: one file per component, CVA variants, documented
contract, `data-slot`. Gate: `/design` gallery renders every primitive in every
state, and `pnpm lint` is clean.

**3. Patterns.**
`src/components/patterns/`: PageHeader, DataTable, EmptyState, FormField,
ConfirmDialog, StatCard, SettingsSection, AuthCard. Built from primitives only.
Gate: gallery covers them; a page can be written with zero raw classes.

**4. Domain and data.**
Pick the dialect before the schema (D1 default, Postgres for write-heavy or
join-heavy work). Types first, then `db/schema.ts`, then server functions with
boundary validation. Decide every backend surface the product uses and probe
the ones the docs do not guarantee. Gate: `void db generate` produces a
migration you have read; a typed query round-trips locally; each surface has a
recorded verdict.

**5. Flows.**
Routes assembled from patterns. A route file should read as composition and
data wiring, not styling. Gate: happy path plus empty, loading, and error
states exist for every screen; smoke test passes against the deployed URL.

**6. Ship.**
Deploy, verify from the outside, write the runbook. Gate: production URL
serves, `/health` (or equivalent) is green, logs are clean, and rollback is a
command you have run once.

## Stack

| Concern | Choice |
|---|---|
| Framework | TanStack Start (Vite, file routes, server functions) |
| SDK and build | Void (`voidPlugin()`, `void/db`, `void/kv`, `void/storage`) |
| Database | D1 by default; Postgres or MySQL via Hyperdrive |
| Type flow | Drizzle schema to server functions; typed fetch only in Void apps |
| Auth | Better Auth, TanStack Start integration |
| Styling | Tailwind v4 CSS-first, AlignUI tokens, CVA variants |
| Design gate | `@shadcn/lint` at `error` on all six rules |
| Cloudflare CLI | `cf` (never Wrangler) |
| Package manager | `pnpm` for app work; `cf` runs on Node 22.18+ only |
| Coordination | Durable Objects via `defineDurableState` / `defineRoom` |

Details, file tree, and exact configs: `references/stack.md`. Data layer,
dialects, type pipeline, typed fetch, KV, R2, durable state, and env:
`references/data.md`.

## Backend surface

Nine backend surfaces, three of which do not exist in framework mode. Email
counts as one surface with three parts. Read `references/backend.md` before
designing a feature that touches one.

| Surface | In TanStack Start |
|---|---|
| Authentication | Better Auth, not Void auth |
| AI | `void/ai`, no local simulator |
| Email sending | `void/email`, verified sender required |
| Email receiving | not supported, needs a native Void app |
| Email domains | `void email domain` on your Cloudflare zone |
| Sandboxes | `void/sandbox`, Workers Paid + Containers |
| Cron jobs | `crons/`, schedules do not fire locally |
| Queues | `queues/`, local auto-invoke unsupported |
| WebSockets | not supported, hand-roll a Durable Object |
| SSE | plain `Response` with `text/event-stream` |
| Live event streams | `void/live`, probe first |

Rule: any surface marked unsupported or undocumented gets a 30 minute probe
before it enters a plan. Record the result in `AGENTS.md`.

## Design system law

- Three tiers: primitives (raw palette, generated) → semantic (the only names
  app code may use) → component tokens (rare, local).
- A component owns its color, type, radius, elevation, and internal spacing. A
  caller owns placement: margin, width constraints, alignment, order, parent
  gap.
- No wrappers that exist to restyle something (`BigButton`, `BlueCard`). Add a
  size or variant to the primitive, or use the token.
- One component per file, named exports, `cva` for variants, `cn` for
  conditionals. Two sizes and two variants beat five.
- Every primitive carries a contract comment and a gallery entry. The gallery
  is the review surface; the designer reviews states, not diffs.
- Rules live in `.oxlintrc.json`, not in prose nobody runs. The linter is the
  design system's enforcement arm.

Tokens, skeletons, lint config, and the gallery: `references/design-system.md`.

## How work gets done

Default mode is `poteto-mode`. The skill pack is already installed under
`~/.agents/skills/`; load the leaf skill, do not paraphrase it.

| Phase | Load |
|---|---|
| Spec | `to-prd`, `tech-spec`, `product-thinking`, `understand-customers` |
| Design system | `prototype`, `principle-exhaust-the-design-space`, `pick-ui-library`, `control-ui`, `unslop` |
| Build | `architect`, `implement`, `code-like-alade`, `domain-modeling`, `typescript-best-practices` |
| Verify | `principle-prove-it-works`, `verify-this`, `run-smoke-tests`, `dogfood` |
| Ship | `review-and-ship`, `make-pr-easy-to-review`, `technical-writing`, `show-me-your-work` |
| Cloudflare | `cloudflare`, `workers-best-practices`, `durable-objects`, `shadcn-lint` |

Delegation policy, entry/exit criteria, and the reality checks:
`references/poteto-loop.md`.

## Bootstrap

```bash
pnpm dlx @tanstack/cli@latest create <app>        # Vite + TanStack Start
cd <app>
pnpm add -D void && pnpm void init             # voidPlugin(), docs, agent skill
pnpm dlx @alignui/cli tailwind                     # tokens; run before any custom CSS
pnpm add -D @shadcn/lint oxlint
cf auth whoami || cf auth login               # Cloudflare, once per machine
cf init .                                     # writes cloudflare.config.ts
cf build                                      # gate: can cf own the build?
```

The authoritative setup path is Void's quickstart,
`https://void.cloud/guide/quickstart`, and for this stack the framework guide,
`https://void.cloud/integrations/frameworks/tanstack-start`: install `void`,
run `void init`, keep `voidPlugin()` before the TanStack plugin, and add no
separate Cloudflare adapter.

`void init` also writes an `AGENTS.md` section, links Void's own `void` skill
into the agent config it detects, and ships version-matched Markdown docs at
`node_modules/void/docs/`. Read those docs for the installed version; the
website may be ahead of your app.

If `cf build` fails on the framework, the deploy owner becomes Void:
`void deploy --platform cloudflare`. Record the decision and its reason in
`AGENTS.md` before writing features. Full runbook and the `AGENTS.md` template:
`references/bootstrap.md`.

## Pitfalls

- **`cf` runs on Node, never Bun.** It needs Node 22.18+ and `"type": "module"`
  to load `cloudflare.config.ts`. Run the installed binary or `pnpm exec cf`,
  never `bunx cf`.
- **Two Cloudflare configs cannot coexist.** `wrangler.jsonc` plus
  `cloudflare.config.ts` produces a Worker that matches neither. Migrate with
  `cf migrate`, then delete the old file.
- **Do not run `cf init`, `cf dev`, `cf build`, or `cf deploy` in a Wrangler
  project.** Automatic configuration rewrites `package.json` and `vite.config`.
- **`@alignui/cli tailwind` overwrites CSS and the Tailwind config.** Run it
  before any custom CSS exists, or move the generated block by hand.
- **`skill tanstack-start` is Vinxi-era.** Trust `tanstack.com/start` and the
  Cloudflare/Void pages over it; the API surface moved to
  `@tanstack/react-start/plugin/vite`.
- **Void auth is unsupported in framework mode.** Use Better Auth's TanStack
  Start integration, not the Void auth helpers.
- **WebSockets and inbound email are Void-app only.** TanStack Start needs a
  hand-rolled Durable Object and a separate inbound Worker.
- **Cron and queue dev endpoints are manual in framework mode.** Schedules do
  not fire locally, and sending to a queue does not invoke the consumer; use
  `POST /__void/scheduled` and `POST /__void/queue` with the dev trigger token.
- **Void docs live in the package.** `node_modules/void/docs/` matches the
  installed version, and `void init` links a `void` skill plus an `AGENTS.md`
  section. Read the local docs before the website.
- **Commit `void.lock.json`, gitignore `.void-wrangler.jsonc`.** First deploy
  from one machine only, then commit the lock file.
- **Schema drift stops deploys.** Run `void db generate`, read the SQL, commit
  it, deploy again.
- **Void typed fetch needs Void routes.** It checks paths under `routes/`. In
  framework mode use `createServerFn`; do not import `void/client`.
- **KV is eventually consistent.** Never hold balances, locks, or revoked
  sessions there. Use D1 or a Durable Object.
- **`.env.local` and `.dev.vars` are ignored.** One root `.env` for local
  values, `void secret put` for production, and anything `VITE_*` is public.
- **Lint at `warn` is decoration.** All six rules are `error` or the design
  system is a suggestion.
- **Gallery in production.** Guard `/design` behind dev or an explicit flag.
- **Deleting a customer pain is not free.** Every absorbed pain needs a cost
  line; unmeasured absorption becomes an outage you did not budget for.

## Verification

Before calling a project buildable:

- [ ] `docs/spec.md` and `docs/pain-ledger.md` exist and are current
- [ ] Deploy owner named in `AGENTS.md`
- [ ] Semantic tokens cover every style used; no raw values in `src/`
- [ ] `/design` gallery renders all primitives and patterns in all states
- [ ] `pnpm lint` clean, all `@shadcn/lint` rules at `error`
- [ ] `pnpm typecheck` clean
- [ ] `void db generate` output committed; local query round-trips
- [ ] `pnpm void env check` clean and every server key exists remotely
- [ ] Every backend surface used is listed in `AGENTS.md` with a probe result
- [ ] Production URL verified from outside; logs clean after a request
- [ ] Rollback command documented and exercised once
