# New project runbook

Copy this list into the project's first commit message or `docs/build.md` and
check items off in order. Every step has an acceptance check. If a check fails,
fix it before moving on; later phases assume earlier ones are true.

## 1. Scaffold

```bash
mkdir <app> && cd <app> && pnpm init

# web app: TanStack Start in framework mode
pnpm dlx @tanstack/cli@latest create apps/web
cd apps/web
pnpm install
pnpm add -D void
pnpm void init        # or: pnpm exec void init
cd ../..

# api app: native Void app, Hono handlers
pnpm create void apps/api
cd apps/api
pnpm add hono zod
cd ../..

mkdir -p packages/contracts packages/domain packages/db
```

`void init` adds `voidPlugin()` to the Vite config, creates `void.config.ts` and
the project files, appends an `AGENTS.md` section, links Void's own `void` skill
into the agent config, and installs the version-matched docs at
`node_modules/void/docs/`. Re-check `vite.config.ts`: `voidPlugin()` must be
first, and there must be no separate Cloudflare adapter. `apps/api` is native:
no Vite config, Void's own build, full surfaces.

Acceptance: both dev servers run (`apps/web` on `http://localhost:5173`),
`node_modules/void/docs/guide/quickstart.md` exists in both apps, and
`git status` is clean after the first commit.

Notes:

- Pick Tailwind when prompted, or add it next.
- No Rsbuild. Cloudflare does not support TanStack Start on Rsbuild.
- pnpm only: approve `esbuild`, `sharp`, `workerd` build scripts and set
  `better-sqlite3: false` in `pnpm-workspace.yaml` `allowBuilds`.

## 2. Design tokens

```bash
pnpm dlx @alignui/cli tailwind
```

The CLI asks for primary, neutral, color format (OKLCH), and an optional class
prefix. It writes a CSS-first `@theme` block and installs Tailwind v4.1.

Then, in the generated stylesheet:

1. Keep the primitive palette it wrote. Never reference those names outside
   this file.
2. Add the semantic layer (`:root` + `.dark`) from `design-system.md`.
3. Map it with `@theme inline` so utilities resolve to CSS variables.
4. Delete or rename anything you will not use; an unused token is a future
   wrong choice.

Acceptance: `<div className="bg-background text-foreground">` renders, switches
correctly in dark mode, and `grep -rn "#[0-9a-fA-F]\{3,8\}" src/` returns
nothing.

## 3. Lint gate

```bash
node ~/.agents/skills/agentic-alade/scripts/setup-lint.mjs --shadcn --baseline
```

The script installs the preset, writes `oxlint.config.ts` from the template in
`design-system.md`, and adds `lint`, `lint:fix`, and `typecheck` scripts when
they are missing. It refuses to overwrite an existing config; migrate that one
with `lint.md`.

Acceptance: `pnpm lint` exits 0 on the scaffold, exits non-zero when you
temporarily add `bg-blue-500` to a component, and `pnpm typecheck` is clean.
The config still contains `...cloudflare`, `...cloudflare.rules`, and
`...(cloudflare.jsPlugins ?? [])`; a shallow merge is the failure mode to check
for. Run `node ~/.agents/skills/agentic-alade/scripts/verify-lint-fixture.mjs`
once to prove the preset still catches its rules.

## 4. Primitives and gallery

Build in this order, smallest first: `Button`, `Input`, `Textarea`, `Label`,
`Select`, `Checkbox`, `Switch`, `Badge`, `Card`, `Alert`, `Dialog`, `Tabs`,
`Table`, `Tooltip`, `Skeleton`, `EmptyState` (pattern).

Each primitive: contract comment at the top, CVA variants, `data-slot`, one
named export, no color literals, no arbitrary values.

Then create `src/routes/design.tsx` rendering every primitive in every state,
grouped by layer. Guard it:

```tsx
export const Route = createFileRoute('/design')({
  beforeLoad: () => {
    if (import.meta.env.PROD) throw notFound()
  },
  component: DesignGallery,
})
```

Acceptance: gallery loads in dev, 404s in a production build, and a screenshot
of it is attached to the PR that adds the design system.

## 5. Patterns

`src/components/patterns/`: `PageHeader`, `Section`, `DataTable`, `FormField`,
`ConfirmDialog`, `StatCard`, `SettingsSection`, `AuthCard`, `Toast`.

Patterns may use layout classes freely and primitives only for styled surfaces.
They must not introduce colors or typography of their own.

Acceptance: a throwaway page can render a header, a table with empty state, and
a form using patterns alone, with no raw classes in the page file.

## 6. Data

Choose the dialect before the schema: Postgres via Hyperdrive by default in
the two-app shape (one connection string shares across both apps), D1 only for
a single app. Declare `env.ts` and a root `.env` before writing queries, then
generate.

```bash
pnpm void db generate     # after writing db/schema.ts
pnpm void env check
```

Schema rules:

- `packages/db/schema.ts` is the only place table definitions live.
- Money as integer minor units, timestamps in UTC ISO text (D1) or `timestamp`
  (Postgres), soft delete only when the product needs recovery.
- Add indexes for every foreign key and every filtered list query before the
  first real user, not after the first slow page.

Acceptance: `void db generate` writes SQL you have read, local dev serves a
query, and the migration is committed.

### Backend surfaces

Tick only the ones the product needs, then probe the risky ones before they
enter the plan. Details and API shapes: `backend.md`.

- Auth: Better Auth served from `apps/api`. Verify sign-up, sign-in, session
  read from web over the shared domain, one protected route, one mutation that
  trusts the session.
- AI: `void/ai` run plus stream. Verify a real model call in dev, a timeout, a
  `UsageLimit` path, and one production call.
- Email sending: `void/email`. Verify the sender domain, a verified recipient,
  and the failure shape for an unverified one.
- Email receiving: `email/` handlers in `apps/api` (native, so it works).
  Never in `apps/web`.
- Email domains: `void email domain add`, `void email status`, `void email setup`.
- Sandboxes: `void/sandbox`. Verify Workers Paid, Containers, a command run, and
  a file round-trip.
- Cron: `crons/`. Verify the job locally via `POST /__void/scheduled`, and that
  a second run is harmless.
- Queues: `queues/`. Verify send, consume, `retry`, and a poison message.
- WebSockets: `apps/api` `routes/*.ws.ts` with `defineRoom`. Never in
  `apps/web`.
- SSE: one stream, abort respected, client reconnect handled.
- Live event streams: `void/live`. Probe connect, subscribe on two tabs,
  publish, and reconnect before designing on it.

Acceptance: each chosen surface has one working call, a recorded verdict in
`AGENTS.md`, and a named cost or limit (quota, cold start, delivery semantic).

## 7. API handlers

Any handler crossing the network: validate at the boundary with the contract
from `packages/contracts`, return typed results, throw typed errors
(`HTTPException` from Hono). Business logic lives in `packages/domain`, pure
and testable; the handler is a thin shell. No `any` at the boundary. Web calls
the API through the `hc` client; TanStack server functions do not exist.

Acceptance: one test per handler for the happy path and one rejected input;
the `hc` client typechecks against the contracts; `pnpm typecheck` clean.

## 8. Deploy

Before deploy, pick any infrastructure the product needs (DNS, cache, WAF,
Access, mail domains) from `cloudflare-services.md`, and record each one in
`AGENTS.md` with its limit.

```bash
cf auth whoami || cf auth login
cf init .
cf build
cf deploy --dry-run
cf deploy
```

If `cf build` cannot build TanStack Start, switch the owner to Void:

```bash
pnpm void connect --platform cloudflare
pnpm void deploy --platform cloudflare
```

The API app deploys with Void (native app):

```bash
cd apps/api
pnpm void connect --platform cloudflare
pnpm void deploy --platform cloudflare
```

Record both apps in `AGENTS.md`:

```markdown
## Deploy
web owner: cf          # or: void
web command: cf deploy # or: void deploy --platform cloudflare
api owner: void
api command: void deploy   # run in apps/api
Cloudflare account: <name>
```

Acceptance: the web URL returns 200, one `/api/v1` call works in production,
and `cf workers deployments list` (or `void project status`) shows both deploys.

## 9. AGENTS.md template

```markdown
# <Project>

<One paragraph: who it is for, the job it does, the pain it absorbs.>

## Stack
Monorepo: apps/web (TanStack Start, rendering only), apps/api (native Void
app, Hono handlers at /api/v1), packages/{domain,db,contracts}. Void on both
apps; Postgres via Hyperdrive; Tailwind v4 + AlignUI tokens; Better Auth in
apps/api. Package manager: pnpm.

## Structure
- packages/domain: pure services. Deps as params. No hono/void/tanstack imports.
- packages/contracts: zod schemas, the single API contract, hc client.
- packages/db: drizzle schema + migrations. The only place tables are defined.
- void/* imports stay inside each app. Banned in packages/*.
- Route groups: `_` prefix = pathless layout (the Next `(group)` feel); `-`
  prefix = colocated files the router ignores.
- Params are branded at the boundary: web validates in `beforeLoad`, api in
  `withValidator`; raw URL strings never reach packages/domain.
- Server functions are banned. Every data change goes through apps/api
  handlers; `grep createServerFn apps/web` must stay empty.

## Design system
- Tokens: docs/design-system.md. Semantic tokens only. No raw values.
- Primitives: apps/web/src/components/ui. Patterns: apps/web/src/components/patterns.
- Gallery: /design (dev only). Every component has a contract comment.
- Run `pnpm lint` and `pnpm typecheck` after every UI change and fix all errors.

## Deploy
web owner: cf | void. web command: <command>.
api owner: void. api command: void deploy (in apps/api).
Account: <account>.

## Commands
web dev: cd apps/web && pnpm dev
api dev: cd apps/api && pnpm dev
lint: pnpm lint
typecheck: pnpm typecheck
db: cd apps/api && pnpm void db generate   # deploy applies migrations
deploy web: <command>
deploy api: cd apps/api && pnpm void deploy

## Rules
- Read docs/spec.md and docs/pain-ledger.md before proposing features.
- After making changes, run `pnpm lint` and `pnpm typecheck` and fix all errors.
- New backend capability lands in apps/api behind /api/v1, never in the web app.
```

## 10. First week

- Write the smoke test that proves the money path end to end.
- Add `/health` returning build SHA and dependency checks.
- Seed a realistic dataset, not three rows named "test".
- Run the product on a phone before calling the UI done.
