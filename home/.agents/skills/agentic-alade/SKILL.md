---
name: agentic-alade
description: "Start a product: design system first, Void + cf deploy."
version: 1.1.0
author: Alade C. Yessoufou, Hermes Agent
license: MIT
platforms: [macos, linux]
metadata:
  hermes:
    tags: [build, product, design-system, tanstack-start, void, cloudflare, cf, verification, scenarios]
    related_skills: [poteto-mode, code-like-alade, shadcn-lint, cloudflare, durable-objects, implement, grill-me, verify-this, dogfood]
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
6. **Proof over prose.** A task is done when a command, URL, a screenshot pair,
   or a test says so, and the scenario row it proves is named. "Should work" is
   not a status.
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
plain language. Interrogate it with `grill-me` until the questions run out, and
answer the floor in `references/verification-loop.md` in writing. Write
`docs/pain-ledger.md` and `docs/scenarios.md`. Decide the deploy owner.
Gate: one page, no open questions about who does what, a named entity list, and
every failure, role, and repeat-action case from the floor has a matrix row.

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
data wiring, not styling. Gate: every screen has empty, loading, and error
states; the scenario harness (`templates/scenarios.ts`) reports zero problems;
each covered row has a passing Playwright handler that asserts the side effect;
the adversarial pass ran and its findings are fixed or guarded; smoke test
passes against the deployed URL.

**6. Ship.**
Deploy, verify from the outside, write the runbook. Gate: production URL
serves, `/health` (or equivalent) is green, logs are clean, the before/after
screenshot pairs are committed, the quality loop is scheduled and has printed
one green JSON line to `docs/quality.log`, and rollback is a command you have
run once.

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
`references/data.md`. Every Cloudflare product, by job:
`references/cloudflare-services.md`.

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

## Verification law

The build is not the deliverable. The proof surface is. Six moves, each leaving
an artifact in the repo, run from phase 0 and never stop:

| Move | Ask the agent | Artifact |
|---|---|---|
| Interrogate | "Grill me on this until the questions run out. One at a time, with your recommendation." | answers in `docs/spec.md` |
| Model scenarios | "Build a state machine of actors and states, then generate the cases: success, error, each role, duplicate, concurrent." | `docs/scenarios.md` + `scripts/scenarios.ts` |
| Break it | "Try to break what you just built. Evidence or it did not happen." | `docs/findings.md` |
| Screenshot | "Before/after pair per changed screen, seeded, both themes." | `docs/shots/<feature>/` |
| Variants | "Give me three variants of this piece I can switch between and try." | `/design` switcher |
| Monitor | "Loop the bar: fast on commit, smoke on deploy, watch nightly. Fail on regression." | `docs/quality.log` |

Rules that make each move real:

- **Interrogation** goes to the human for product and money calls, and to the
  machine for anything measurable. Answers land in the spec. A question that
  cannot be answered becomes a written TODO, never a silent assumption.
- **Scenarios are a machine, not a list.** Actors are one axis, states another.
  A state with no entering or leaving transition fails the harness. Every role
  gets an explicit allow or denial, and every write is asserted from the
  database, not the screen.
- **Adversarial passes are delegated.** Give a subagent the repo, the deployed
  URL, the scope, and the demand for evidence. Check the evidence yourself.
- **Screenshots are pairs with labels and a scenario id.** After-only is
  decoration. Fixed viewport, seeded data, animations off, both themes.
- **Variants live behind a switcher, never a branch.** Two or three, same
  tokens, judged on real data, losers deleted in the same PR.
- **A loop without a threshold is a dashboard.** Lint and types at zero, smoke
  under 90s, LCP under 2.5s at p75, error rate under 0.5%, no row green to red.
  The failing row id is named in whatever channel the human reads.

Templates: `templates/scenarios.ts` (matrix plus coverage gate),
`templates/scenarios.spec.ts` (Playwright view, fails on a row with no handler),
`templates/shot.mjs` (deterministic capture), `templates/quality.sh` (three
cadences, JSONL log, regression exit). Full procedure and the failure floor:
`references/verification-loop.md`.

Copy them in once per project, at phase 0:

```bash
cp ~/.agents/skills/agentic-alade/templates/scenarios*.{ts} scripts/
cp ~/.agents/skills/agentic-alade/templates/shot.mjs scripts/
cp ~/.agents/skills/agentic-alade/templates/quality.sh scripts/ && chmod +x scripts/quality.sh
```

## How work gets done

Default mode is `poteto-mode`. The skill pack is already installed under
`~/.agents/skills/`; load the leaf skill, do not paraphrase it.

| Phase | Load |
|---|---|
| Spec | `to-prd`, `tech-spec`, `product-thinking`, `understand-customers`, `grill-me` |
| Design system | `prototype`, `principle-exhaust-the-design-space`, `pick-ui-library`, `control-ui`, `unslop` |
| Build | `architect`, `implement`, `code-like-alade`, `domain-modeling`, `typescript-best-practices` |
| Verify | `principle-prove-it-works`, `verify-this`, `run-smoke-tests`, `dogfood`, `interrogate`, `arena` |
| Adversarial | `dogfood`, `verify-this`, plus `templates/scenarios.spec.ts` as the harness |
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
- **After-only screenshots are decoration.** Capture the baseline before the
  work starts, with the same seed, viewport, and theme, or the pair proves
  nothing.
- **A test list is not a state machine.** If no artifact says which actor,
  state, and failure case is covered, coverage is whatever was top of mind.
- **Roles are not a UI concern.** Hiding a button is not authorization. Every
  route needs a server-side allow or denial for owner, member, stranger, and
  service.
- **Screens lie.** Read the side effect back from D1, the audit table, or the
  webhook log. Tests that assert copy pass while the write never happened.
- **Adversarial work delegated without evidence returns optimism.** Require a
  repro, a severity, and a transcript, then check it yourself.
- **A monitor with no threshold, baseline, or owner is a dashboard.** Nightly
  green files nobody opens do not hold a bar.
- **Variant switches outlive decisions.** Pick within the PR and delete the
  losers, or the flag ships into support tickets.

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
- [ ] `docs/scenarios.md` covers the failure floor; `scripts/scenarios.ts`
      reports zero problems
- [ ] Each covered scenario row has a passing handler that asserts the side
      effect, not the screen
- [ ] Adversarial pass recorded in `docs/findings.md`; every finding fixed or
      guarded
- [ ] Before/after screenshot pairs committed for every changed screen, both
      themes, with scenario ids
- [ ] Quality loop scheduled, `docs/quality.log` has a green line, budgets in
      `AGENTS.md`
- [ ] Production URL verified from outside; logs clean after a request
- [ ] Rollback command documented and exercised once
