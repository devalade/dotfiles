---
name: agentic-alade
description: "Start a product: design system first, Oxlint preset, Void + cf deploy."
version: 1.4.0
author: Alade C. Yessoufou, Hermes Agent
license: MIT
platforms: [macos, linux]
metadata:
  hermes:
    tags: [build, product, design-system, tanstack-start, hono, monorepo, void, cloudflare, cf, oxlint, lint, verification, scenarios]
    related_skills: [poteto-mode, code-like-alade, coding-standards, install-anti-slop, shadcn-lint, cloudflare, durable-objects, implement, grill-me, verify-this, dogfood]
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
9. **Direction before page.** Load `premium-ui` at the design phase. Every new
   screen or redesign goes through its direction gate: three directions in the
   real route, the human picks one, and the picked shell's numbers go into
   `AGENTS.md`. A rebranded registry block is a starting point, not a result.
10. **The lint preset is the floor.** Every TypeScript or JavaScript project
    extends `@cloudflare/oxlint-config` and keeps Oxlint at zero. A rule turned
    off without a scoped reason is a defect, not a preference.
11. **One backend, one style.** Every HTTP surface is a Hono-style Void handler
    in `apps/api`, versioned at `/api/v1`. TanStack Start server functions do
    not exist in this stack; web and mobile call the same REST contract.

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
Tailwind v4 CSS-first `@theme`, hand-authored in `src/styles.css`: the
primitive palette in OKLCH, then the semantic layer and the dark values. No
token generator. Gate: every color, radius, shadow, duration, and type step
used by the product exists as a semantic token; `grep` finds no raw value in
`src/components`.

**2. Primitives.**
`src/components/ui/`: one file per component, CVA variants, documented
contract, `data-slot`. Interactive primitives come from `shadcn add` on Base
UI and are restyled to semantic tokens before they land here. Base UI uses
`render` instead of `asChild`. Gate: `/design` gallery renders every primitive
in every state, and `pnpm lint` is clean under the Cloudflare preset.

**3. Patterns.**
`src/components/patterns/`: PageHeader, DataTable, EmptyState, FormField,
ConfirmDialog, StatCard, SettingsSection, AuthCard. Built from primitives only.
Gate: gallery covers them; a page can be written with zero raw classes.

**4. Domain and data.**
Pick the dialect before the schema (Postgres via Hyperdrive by default in the
two-app shape; D1 only for a single app). Types first, then
`packages/db/schema.ts`, then Hono handlers in `apps/api` with boundary
validation. Decide every backend surface the product uses and probe the ones
the docs do not guarantee. Gate: `void db generate` produces a migration you
have read; a typed query round-trips locally through the API; each surface has
a recorded verdict.

**5. Flows.**
Routes assembled from patterns. A route file should read as composition and
data wiring, not styling. Gate: every screen has empty, loading, and error
states; premium-ui's direction gate ran for each new screen with three
directions, 390 and 1440 screenshots and the pick recorded in `docs/spec.md`;
the picked shell's numbers are in `AGENTS.md`; the scenario harness
(`templates/scenarios.ts`) reports zero problems;
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
| Project shape | pnpm monorepo: `apps/web`, `apps/api`, `packages/{domain,db,contracts}` |
| Web framework | TanStack Start (Vite, file routes, rendering only) |
| API | Hono handlers in a native Void app (`apps/api`), versioned `/api/v1` |
| SDK and build | Void on both apps: `voidPlugin()` in web; the native app owns the API |
| Database | Postgres via Hyperdrive by default (one connection string shares across apps); D1 for a single app only |
| Type flow | zod contracts in `packages/contracts`; typed `hc` client; no server functions |
| Auth | Better Auth served from `apps/api`; cookies for web, bearer for mobile |
| Styling | Tailwind v4 CSS-first, hand-authored `@theme` tokens, CVA variants |
| Components | shadcn/ui on Base UI; UI SDK for what Base UI lacks | Base UI standard set; `@ui-sdk` behaviors for the long tail, never Radix |
| Code lint | Oxlint 1.94+ with `@cloudflare/oxlint-config`, type-aware via `tsrs`, errors only |
| Design gate | `@shadcn/lint` at `error` on all six rules |
| React health | react-doctor CLI + PR CI + agent skill |
| Cloudflare CLI | `cf` (never Wrangler) |
| Package manager | `pnpm` for app work; `cf` runs on Node 22.18+ only |
| Coordination | WebSockets via `routes/*.ws.ts` + `defineRoom` in `apps/api`; DOs via `defineDurableState` |

Details, file tree, and exact configs: `references/stack.md`. Data layer,
dialects, type pipeline, typed fetch, KV, R2, durable state, and env:
`references/data.md`. Every Cloudflare product, by job:
`references/cloudflare-services.md`.

## Backend surface

The backend lives in `apps/api`, a native Void app: every surface in
`references/backend.md` is supported there as documented, including
WebSockets, inbound email, and local queue auto-invoke. `apps/web` hosts no
backend surfaces; it renders and calls the API. Email counts as one surface
with three parts.

Rule: any surface marked "verify" or undocumented still gets a 30 minute probe
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
- Base UI is the floor; UI SDK is the extension lane. Standard interactions
  come from Base UI. When Base UI does not ship one (command palette,
  typeahead, drag and drop), build the primitive from `@ui-sdk/core`
  behaviors with `@ui-sdk/react`. Native HTML first for the simple case, and
  never two libraries for the same job.
- Every primitive carries a contract comment and a gallery entry. The gallery
  is the review surface; the designer reviews states, not diffs.
- Rules live in `oxlint.config.ts`, not in prose nobody runs. Extend
  `@cloudflare/oxlint-config` for code quality and layer `@shadcn/lint` for the
  design system. The linter is the enforcement arm for both.
- Install UI from the `premium-ui` registry (`@premium/*` items), never rebuild
  a lookalike. A rebranded direction is the starting point, not the result;
  `premium-ui` step 2b is the gate for every new screen.

Tokens, skeletons, lint config, and the gallery: `references/design-system.md`.
The preset, rule-by-rule fixes, React exceptions, and migration:
`references/lint.md`.

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
| Monitor | "Loop the bar: fast on commit, smoke on deploy, watch nightly, react-doctor on every PR. Fail on regression." | `docs/quality.log` |

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
- **react-doctor runs where the code is written.** Install its agent skill at
  phase 0, run it in the fast loop with `--blocking error`, and install the PR
  workflow with `react-doctor ci install`. Telemetry off by default here.

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
| Design system | `premium-ui`, `premium-react`, `prototype`, `principle-exhaust-the-design-space`, `pick-ui-library`, `control-ui`, `unslop` |
| Build | `architect`, `implement`, `code-like-alade`, `domain-modeling`, `typescript-best-practices` |
| Verify | `principle-prove-it-works`, `verify-this`, `run-smoke-tests`, `dogfood`, `interrogate`, `arena` |
| Adversarial | `dogfood`, `verify-this`, plus `templates/scenarios.spec.ts` as the harness |
| Ship | `review-and-ship`, `make-pr-easy-to-review`, `technical-writing`, `show-me-your-work` |
| Cloudflare | `cloudflare`, `workers-best-practices`, `durable-objects`, `shadcn-lint` |

Delegation policy, entry/exit criteria, and the reality checks:
`references/poteto-loop.md`.

## Bootstrap

```bash
# 0. Monorepo shell
mkdir <app> && cd <app> && pnpm init

# 1. Web app: TanStack Start in framework mode (rendering only)
pnpm dlx @tanstack/cli@latest create apps/web
cd apps/web
pnpm add -D void && pnpm void init             # voidPlugin() first, docs, agent skill
pnpm dlx shadcn@latest init --base base           # Base UI, never Radix
# tokens: hand-author @theme in src/styles.css (primitive palette + semantic layer)

# 2. API app: native Void app; its handlers run on Hono
cd ../..
pnpm create void apps/api                          # creates the dir; pick the Cloudflare target
cd apps/api
pnpm add hono zod

# 3. Shared packages
cd ../..
mkdir -p packages/contracts packages/domain packages/db

# 4. Code-quality floor: Oxlint + the Cloudflare preset, at the repo root
node ~/.agents/skills/agentic-alade/scripts/setup-lint.mjs --shadcn --baseline
# writes oxlint.config.ts, installs the preset, adds lint/typecheck scripts

# 5. React health
pnpm dlx react-doctor@latest install -y            # agent skill + optional hooks
pnpm dlx react-doctor@latest ci install            # PR scan workflow

# 6. Cloudflare, once per machine
cf auth whoami || cf auth login
```

The authoritative setup paths: Void's quickstart,
`https://void.cloud/guide/quickstart`, the framework guide for the web app,
`https://void.cloud/integrations/frameworks/tanstack-start`, and the Hono
guide for the API app, `https://void.cloud/integrations/hono`: install `void`,
run `void init`, keep `voidPlugin()` before the TanStack plugin, and add no
separate Cloudflare adapter. The API app is native: no Vite config, Void's own
build, full surfaces.

`void init` also writes an `AGENTS.md` section, links Void's own `void` skill
into the agent config it detects, and ships version-matched Markdown docs at
`node_modules/void/docs/`. Read those docs for the installed version; the
website may be ahead of your app.

Deploy owner is decided per app in phase 0: the API app deploys with Void
(native app, `void deploy`); the web app tries `cf build` first and falls back
to `void deploy --platform cloudflare`. Record both decisions and reasons in
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
- **Hand-authored tokens drift without the gate.** The primitive palette in
  `src/styles.css` is the only place raw OKLCH values exist. `grep` for hex,
  `rgb(`, and `p-[` in `src/` on every PR; one leak is a refactor ticket.
- **`skill tanstack-start` is Vinxi-era.** Trust `tanstack.com/start` and the
  Cloudflare/Void pages over it; the API surface moved to
  `@tanstack/react-start/plugin/vite`.
- **Auth lives once, in `apps/api`.** Better Auth is served from the API app;
  web gets cookie sessions on the shared domain, mobile uses bearer via
  `@better-auth/expo`. Never mount a second auth in `apps/web`.
- **WebSockets and inbound email belong in `apps/api`.** The native app gives
  both for free. A hand-rolled Durable Object inside the web app is the smell
  of a feature that belongs behind the API.
- **Cron and queue dev triggers are manual only in framework-mode apps.**
  `apps/api` auto-invokes locally. If the web app ever needs one: `POST
  /__void/scheduled` or `POST /__void/queue` with the dev trigger token.
- **Void docs live in the package.** `node_modules/void/docs/` matches the
  installed version, and `void init` links a `void` skill plus an `AGENTS.md`
  section. Read the local docs before the website.
- **Commit `void.lock.json`, gitignore `.void-wrangler.jsonc`.** First deploy
  from one machine only, then commit the lock file.
- **Schema drift stops deploys.** Run `void db generate`, read the SQL, commit
  it, deploy again.
- **Drizzle version drift breaks `void db generate`.** Void pins drizzle; a
  second `drizzle-orm` or `drizzle-kit` at the root, or upgrading one side
  alone, produces migrations Void cannot apply. One version, the one Void
  ships. The 1.0 line is release-candidate only for now; adopt it when Void
  does, together in one commit.
- **Void typed fetch exists only inside the API app.** `apps/web` calls
  `/api/v1` with the `hc` client built from `packages/contracts`; it never
  imports `void/client` and never mounts Void routes.
- **KV is eventually consistent.** Never hold balances, locks, or revoked
  sessions there. Use D1 or a Durable Object.
- **Two apps must not infer the same resource twice.** Void provisions per
  app. Share state through Postgres via Hyperdrive (a connection string)
  unless a probe has proven one D1 binds into both apps.
- **`hc` needs an exportable app type.** If the API app does not export a
  chained Hono app type, generate the client from the contracts' OpenAPI spec
  (`openapi-typescript`) instead. Probe which mechanism works on first
  wire-up; record it in `AGENTS.md`.
- **URL strings do not enter the domain.** The web validates `params` in
  `beforeLoad` and the API validates them in `withValidator`; both hand a
  branded id to `packages/domain`. A raw `postId: string` in a service is a
  bug.
- **`.env.local` and `.dev.vars` are ignored.** One root `.env` for local
  values, `void secret put` for production, and anything `VITE_*` is public.
- **Lint at `warn` is decoration.** All six shadcn rules are `error` or the
  design system is a suggestion.
- **A shallow lint merge deletes the floor.** `rules: { ... }` without
  `...cloudflare.rules` replaces every inherited rule and the gate goes green
  for the wrong reason. Spread `cloudflare`, `cloudflare.rules`,
  `cloudflare.overrides`, `cloudflare.ignorePatterns`, and
  `cloudflare.jsPlugins`.
- **Hand-written lint setup drifts.** Run
  `scripts/setup-lint.mjs --shadcn --baseline` instead of writing the config
  from memory; it refuses to overwrite an existing config.
- **A rule that stops firing looks like progress.** Run
  `scripts/verify-lint-fixture.mjs` after every Oxlint, `tsrs`, or preset
  upgrade. It asserts all 14 expected rules still fire.
- **Type-aware lint has a second binary.** `@cloudflare/oxlint-config` peers on
  `oxlint@^1.94.0` and `tsrs`; without `tsrs` the type-aware rules do not run.
  Node 22.18+ or 24+ is required.
- **`== null` is not the shortcut it looks like.** The preset requires strict
  equality for null too. Write `value === null || value === undefined`.
- **`no-console` covers app code.** Add a scoped file override for the entry
  point; do not sprinkle disable comments through features.
- **Lint is not a typecheck.** Keep `tsc --noEmit`. The preset catches unsafe
  flow; it does not replace compiler diagnostics.
- **Green by suppression is not green.** No `any`, `!`, or global rule-off to
  silence a finding. Fix it or scope the exception with a written reason.
- **react-doctor at advisory level is decoration.** Use `--blocking error` in
  CI and the fast loop; a score nobody acts on is a dashboard.
- **react-doctor telemeters by default.** Pass `--no-telemetry` unless the
  project opts in.
- **Radix is banned.** Init with `shadcn init --base base`. Base UI uses
  `render` instead of `asChild`, `Backdrop` instead of `Overlay`, and nullable
  Select values, so Radix-era examples do not apply.
- **Two primitive sources, one contract.** UI SDK primitives
  (`definePrimitive` + `createParts`) obey the same file, `data-slot`, token,
  and gallery law as Base UI ones. UI SDK is beta: dialog centering and
  `::backdrop` are manual, `CommandEmpty` stays mounted empty, and
  `ComboboxItem` needs `label=` when rows carry secondary text.
- **Generated shadcn components ship raw values.** Restyle them to the
  project's semantic tokens before they enter `src/components/ui/`.
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
- **Agents drift to flat route folders.** Route groups are `_`-prefixed
  pathless layouts (the Next `(group)` feel) and colocated files are
  `-`-prefixed. Both are in the project's `AGENTS.md` tree; hold every new
  screen to it.

## Verification

Before calling a project buildable:

- [ ] `docs/spec.md` and `docs/pain-ledger.md` exist and are current
- [ ] Deploy owner named in `AGENTS.md`
- [ ] Semantic tokens cover every style used; no raw values in `src/`
- [ ] `/design` gallery renders all primitives and patterns in all states
- [ ] `premium-ui` direction gate passed per new screen; three directions, both
      viewport screenshots and the pick in `docs/spec.md`; picked shell in `AGENTS.md`
- [ ] `pnpm lint` clean, all `@shadcn/lint` rules at `error`, and
      `oxlint.config.ts` spreads `@cloudflare/oxlint-config` with no unscoped
      disables
- [ ] `tsrs` installed so type-aware rules actually ran; `pnpm typecheck` runs
      as a separate command and is clean
- [ ] `scripts/verify-lint-fixture.mjs` passed after the last Oxlint or preset
      upgrade
- [ ] `components.json` uses Base UI; no `@radix-ui/*` in `package.json`
- [ ] `pnpm typecheck` clean
- [ ] `void db generate` output committed; an API query round-trips locally
- [ ] `/api/v1` contract lives in `packages/contracts`; web calls it via `hc`;
      `grep createServerFn apps/web` finds nothing
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
- [ ] react-doctor skill installed; fast loop and PR workflow run with `--blocking error`
- [ ] Production URL verified from outside; logs clean after a request
- [ ] Rollback command documented and exercised once
