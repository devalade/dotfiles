# Stack reference

Verified against Void docs (including the quickstart), Cloudflare docs, and
TanStack Start docs (October 2026). Re-check `https://void.cloud/llms.txt`,
`https://developers.cloudflare.com/cf/llms.txt`, and
`https://tanstack.com/start/latest` before a fresh scaffold; the SDK is young
and pages move. Inside an initialized app, prefer the version-matched docs at
`node_modules/void/docs/` (`guide/quickstart.md`, `reference/cli.md`).

## Setup path (monorepo: TanStack Start web + native Void API)

```bash
# 0. Monorepo shell
mkdir my-app && cd my-app && pnpm init

# 1. Web app: TanStack Start in framework mode
pnpm dlx @tanstack/cli@latest create apps/web
cd apps/web

# 2. Void: package first, then init. Void adds voidPlugin() to the Vite config
#    and creates the remaining project files.
pnpm add -D void
pnpm void init          # or: pnpm exec void init

# 3. API app: native Void app. Its handlers run on Hono.
cd ../..
pnpm create void apps/api          # creates the dir; choose the Cloudflare target
cd apps/api
pnpm add hono zod

# 4. Shared packages: contracts (zod + client), domain (services), db (schema)
cd ../..
mkdir -p packages/contracts packages/domain packages/db

# 5. shadcn components on Base UI, never Radix (inside apps/web)
cd apps/web && pnpm dlx shadcn@latest init --base base

# 6. Code-quality floor: Oxlint + the Cloudflare preset, at the repo root
cd ../..
pnpm add -D oxlint@^1.94.0 tsrs@0.25.0-ts7.1.0-beta @cloudflare/oxlint-config
# write oxlint.config.ts spreading ...cloudflare; see references/lint.md

# 7. Tell each app the account and target once
(cd apps/web && pnpm void connect --platform cloudflare)
(cd apps/api && pnpm void connect --platform cloudflare)
```

- Void's quickstart: `https://void.cloud/guide/quickstart`.
- Framework guide: `https://void.cloud/integrations/frameworks/tanstack-start`.
- Hono in Void: `https://void.cloud/integrations/hono`.
- `void init` writes an `AGENTS.md` section, links Void's `void` skill into the
  detected agent config, and can be re-run; it asks before editing existing
  instructions.
- Dev server: `pnpm dev`, `http://localhost:5173`.
- pnpm only: approve build scripts for `esbuild`, `sharp`, `workerd`, and set
  `better-sqlite3: false` in `pnpm-workspace.yaml` `allowBuilds`.
- Package manager is pnpm everywhere: `pnpm <script>`, `pnpm <bin>` or
  `pnpm exec <bin>` for local binaries, `pnpm dlx` for one-off CLIs. No bun
  commands in scripts, docs, CI, or `AGENTS.md`.

## Decisions

| Concern | Choice | Why |
|---|---|---|
| Shape | pnpm monorepo | `apps/web`, `apps/api`, `packages/{domain,db,contracts}` |
| Web framework | TanStack Start | File routes, typed search params, streaming SSR, Vite; rendering only |
| API | Hono in a native Void app | Real REST for web, mobile, webhooks; full Void surfaces; versioned `/api/v1` |
| Platform SDK | Void, both apps | Binding inference, migrations, deploy, no adapter glue |
| Database | Postgres via Hyperdrive | One connection string shares across both apps; D1 only single-app |
| ORM | Drizzle via `void/db`, one version | Types from schema; the version Void ships, never mixed |
| Auth | Better Auth, served from `apps/api` | One auth server; cookies for web, bearer for mobile |
| Styling | Tailwind v4, hand-authored `@theme` | CSS-first tokens in OKLCH, no config file, no token generator |
| Variants | `cva` + `cn` | Static, lintable class strings |
| Code lint | Oxlint + `@cloudflare/oxlint-config` | Errors only, type-aware via `tsrs`, nkzw base |
| Design gate | `@shadcn/lint` | Six rules at `error`, agent-readable messages |
| Components | shadcn/ui on Base UI; UI SDK for the long tail | Base UI standard set; `@ui-sdk` behaviors for interactions Base UI lacks |
| Coordination | Durable Objects | Per-entity state, alarms, WebSockets |
| Deploy | `cf`, fallback Void | `cf` owns the account; Void owns the app upload when `cf build` cannot |

## File tree

```
<repo>/
  apps/
    web/                      # TanStack Start + voidPlugin(): rendering only
      src/
        routes/
          __root.tsx
          _marketing/         # pathless layout group, the Next `(group)` feel
            route.tsx
            index.tsx
            -components/      # `-` prefix: colocated, ignored by the router
          _app/               # authed shell group
            route.tsx
            dashboard.tsx
          design.tsx          # dev-only gallery
        router.tsx
        styles.css            # @theme primitives + semantic layer
        components/
          ui/                 # primitives, contract comments, CVA
          patterns/           # composed, app-aware, reuse-first
        lib/
          format.ts           # money, dates, numbers
          errors.ts           # typed error union
      vite.config.ts          # voidPlugin() first, then tanstackStart()
      components.json         # shadcn config, base library
      cloudflare.config.ts    # only if cf owns the web deploy
    api/                      # native Void app: the whole backend
      routes/api/v1/          # URL = file path; versioned REST
      middleware/             # cors, bearer-auth, rate limit (Hono middleware)
      crons/                  # scheduled handlers
      queues/                 # producers + consumers, auto-invoked locally
      email/                  # inbound handlers
      durable-objects/        # defineDurableState; rooms via routes/*.ws.ts
      void.config.ts
  packages/
    contracts/                # zod schemas, OpenAPI spec, typed hc client
    domain/                   # services: pure TS, deps as params, no framework imports
    db/                       # drizzle schema.ts + migrations/ (committed)
  docs/
    spec.md
    pain-ledger.md
    design-system.md
    build.md
  AGENTS.md
  pnpm-workspace.yaml
```

## Routing (apps/web)

Next-style organization, TanStack syntax:

| Next.js | TanStack | Effect |
|---|---|---|
| `(marketing)/` | `_marketing/` | Shared layout, no URL segment |
| `layout.tsx` | `route.tsx` | Wraps child routes |
| `[id]/` | `$id` | Dynamic segment |
| colocated components | `-` prefixed files | Ignored by route generation |

```
routes/
  _app/
    route.tsx              # authed shell
    posts/
      route.tsx            # optional posts-only layout
      index.tsx            # /posts
      $postId.tsx          # /posts/42
      $postId.edit.tsx     # /posts/42/edit
      -components/         # colocated, ignored by the router
```

Params are typed at the boundary: validate `params` in the route's
`beforeLoad` with a zod schema and hand a branded id (`PostId`) to the domain.
A raw string from the URL never enters `packages/domain`.

## Vite configuration

`voidPlugin()` must come first in `apps/web`. Do not also add
`@cloudflare/vite-plugin`; Void supplies it. `apps/api` has no Vite config: as
a native Void app, Void's own build handles it.

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { voidPlugin } from 'void'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [voidPlugin(), tanstackStart(), react()],
})
```

## Void configuration

```ts
// void.config.ts
import { defineConfig } from 'void/config'

export default defineConfig({
  cloudflare: {
    name: 'my-app',
    compatibility_date: '2026-02-24',
    compatibility_flags: ['nodejs_compat'],
  },
  routing: {
    prerender: ['/', '/pricing'],
    revalidate: 60,
  },
})
```

- `routing.prerender` for marketing pages that never change per request.
- `routing.revalidate` caches public HTML; responses with `Set-Cookie` or
  `Cache-Control: private/no-store/no-cache` are never shared.
- Bindings are inferred from imports. Override only when inference is wrong:
  `inference.bindings: { db: 'MY_DB' }`.
- A Durable Object or Workflow needs its own entry module:
  `cloudflare: { main: './server.ts' }`, plus `cloudflare.durable_objects`.
- Commit `void.config.ts` and `void.lock.json`. Gitignore
  `.void-wrangler.jsonc`.

## TypeScript

```json
{
  "compilerOptions": {
    "types": ["void/env"],
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

`void/env` supplies binding and Workers runtime types. Run `void prepare` after
install when CI typechecks before deploy, so `.void/` types exist. The lint
preset holds the behavioral side of these types: no `any`, no unchecked `!`,
strict equality, owned promises. See `references/lint.md`.

## Data

Dialects: Postgres via Hyperdrive by default in the two-app shape
(`database: "pg"`; one connection string shares cleanly across both apps), D1
only for a single app. Dialect choice, type pipeline, KV, R2, durable state,
and env vars live in `data.md`.

```ts
// db/schema.ts
import { sqliteTable, text, integer } from 'void/schema-d1'
import { sql } from 'void/db'

export const invoices = sqliteTable('invoices', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  workspaceId: integer('workspace_id').notNull(),
  amountMinor: integer('amount_minor').notNull(),
  currency: text('currency').notNull().default('XOF'),
  status: text('status').notNull().default('draft'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
})
```

```ts
import { db, eq } from 'void/db'
import { invoices } from '@schema'

const open = await db.select().from(invoices).where(eq(invoices.status, 'open'))
```

Conventions:

- `amountMinor` integers, never floats. Currency stored beside the amount.
- UTC text timestamps; format at the edge with the user's timezone.
- Foreign keys indexed from day one; list queries get a composite index that
  matches their `where` + `order by`.
- Migrations are generated (`void db generate`), read, and committed. Deploy
  stops on schema drift, which is the correct failure.
- Seed with realistic volume; three rows hide every pagination bug.

## API handlers (apps/api)

Void route handlers run on Hono: use Hono middleware, helpers, and any
`hono/*` package directly inside `defineHandler`. Paths under `routes/` define
URLs; version everything under `routes/api/v1/`.

```ts
// apps/api/routes/api/v1/invoices.ts
import { defineHandler } from 'void'
import { db } from 'void/db'
import { CreateInvoice } from '@contracts/invoices'
import { createInvoice } from '@domain/invoices'

export const POST = defineHandler(async (c) => {
  const data = CreateInvoice.parse(await c.req.json())
  const row = await createInvoice(db, data)
  return c.json(row, 201)
})
```

- Parse at the boundary with the contract from `packages/contracts`. The
  domain service in `packages/domain` takes `db` as a parameter and imports
  nothing from hono, void, or tanstack.
- Cross-cutting middleware (cors, bearer-auth, rate limit) lives in
  `middleware/*.ts`, ordered by filename.
- Business rules stay pure and testable; the handler is a thin shell. No
  `any` at the boundary.
- `apps/web` never imports from `apps/api` internals; it calls `/api/v1`
  through the typed `hc` client built from the contracts.

The same domain on the API side. `[id]` is Void's dynamic segment, and
`defineHandler.withValidator` types `body`, `query`, and `params` in one
place, which also powers Void's typed fetch:

```
apps/api/routes/api/v1/
  posts/
    index.ts               # GET list, POST create → /api/v1/posts
    [postId].ts            # GET, PATCH, DELETE → /api/v1/posts/42
```

```ts
// apps/api/routes/api/v1/posts/[postId].ts
import { z } from 'zod'
import { defineHandler } from 'void'
import { db } from 'void/db'
import { PostId } from '@contracts/posts'
import { getPost } from '@domain/posts'

export const GET = defineHandler.withValidator({
  params: z.object({ postId: PostId }),   // branded zod schema from contracts
})(async (_c, { params }) => getPost(db, params.postId))
```

The API app has the same grouping tricks as the web: `(admin)` route groups
do not change the URL, `_` or `.` prefixes exclude files, and `[...slug]`
catches what nothing else matches.

## Bindings

```ts
import { env } from 'cloudflare:workers'

const object = await env.STORAGE.get(key)
```

| Binding | Resource | Preferred access |
|---|---|---|
| `DB` | D1 | `void/db` |
| `KV` | KV | `void/kv` |
| `STORAGE` | R2 | `void/storage` |
| `AI` | Workers AI | `void/ai` |
| `ASSETS` | static | `env.ASSETS.fetch(request)` |

Use raw `env` only where the typed helper does not cover the call.

## Auth

One auth server: Better Auth is served from `apps/api`.

- One `auth.ts` server module in `apps/api`, cookie-based sessions, D1 or pg
  adapter.
- Web: cookie session on the shared domain. Read the session in `__root.tsx`
  loader via the API; guard routes with `beforeLoad`.
- Mobile: `@better-auth/expo` client, SecureStore sessions, app scheme in
  `trustedOrigins`.
- Never trust a user id from the client; resolve it from the session on the
  server for every mutation.

## Components

shadcn/ui components are generated on Base UI with `shadcn init --base base`.
Radix is not used. Base UI conventions that differ from Radix-era examples:

- `render` replaces `asChild`; use `nativeButton={false}` for non-button targets.
- Anchored popups use `Portal > Positioner > Popup`; overlays use `Backdrop`,
  not `Overlay`.
- Select values are nullable (`null` for placeholder), not empty strings.
- Generated files land in `src/components/ui/` with the project's semantic
  tokens. Restyle registry raw utility values before commit.

## Coordination

- `durable-objects/<name>.ts` with `defineDurableState`, default-exported.
- `Counter.get('global')` picks the object by name; the same name is the same
  object forever. Renaming a file requires copying the suggested `name` from
  `void info` first.
- Methods run one at a time and state is restored on failure. Do not write
  through `context.storage` for state you expect to roll back.
- Use DOs for carts, rooms, rate limits, per-tenant counters, and WebSockets.
  Use D1 for records you query with SQL.

## Commands

```bash
# run inside apps/web
pnpm dev                   # Vite dev server with the Void plugin, :5173
pnpm void init             # once: voidPlugin(), project files, docs, agent skill

# run inside apps/api
pnpm dev                   # native Void dev server; queues auto-invoke locally
pnpm void init             # once
pnpm void db generate      # generate a migration from packages/db/schema.ts
pnpm void prepare          # generate .void types for CI typecheck
pnpm void info             # resource names, durable state map
pnpm void deploy           # build, migrate, upload

# either app
pnpm void project status   # also: logs, rollback
```

Void's version-matched docs ship in the package: `node_modules/void/docs/`.
Read `guide/quickstart.md` and `reference/cli.md` when a command's flags are in
doubt.

`fetch` from `void/client` gives typed calls to Void routes, usable inside the
API app. `apps/web` calls `/api/v1` with the `hc` client built from
`packages/contracts`. TanStack server functions do not exist in this stack.

## Version discipline

- Keep the `void` package and the global CLI on the same version.
- One drizzle version: whatever `void/db` ships, never a second `drizzle-orm`
  or `drizzle-kit` at the root. As of Nov 2026 the stable line is 0.45 and 1.0
  is release-candidate only (`@rc` tag, breaking changes in every RC). Move
  to 1.0 when it is stable and Void adopts it, upgrading `void` and drizzle
  together in one commit.
- Upgrade deliberately: read the changelog, run `void info` before and after,
  deploy once to staging before production.
- One machine performs the first deploy; every other machine pulls the lock
  file before deploying.
