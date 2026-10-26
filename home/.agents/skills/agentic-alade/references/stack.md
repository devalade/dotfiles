# Stack reference

Verified against Void docs (including the quickstart), Cloudflare docs, and
TanStack Start docs (October 2026). Re-check `https://void.cloud/llms.txt`,
`https://developers.cloudflare.com/cf/llms.txt`, and
`https://tanstack.com/start/latest` before a fresh scaffold; the SDK is young
and pages move. Inside an initialized app, prefer the version-matched docs at
`node_modules/void/docs/` (`guide/quickstart.md`, `reference/cli.md`).

## Setup path (TanStack Start + Void)

```bash
# 1. Framework
pnpm dlx @tanstack/cli@latest create my-app
cd my-app

# 2. Void: package first, then init. Void adds voidPlugin() to the Vite config
#    and creates the remaining project files.
pnpm add -D void
pnpm void init          # or: pnpm exec void init

# 3. Tell it the account and target once
pnpm void connect --platform cloudflare
```

- Void's quickstart: `https://void.cloud/guide/quickstart`.
- Framework guide: `https://void.cloud/integrations/frameworks/tanstack-start`.
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
| Framework | TanStack Start | File routes, typed search params, server functions, streaming SSR, Vite |
| Platform SDK | Void | Binding inference, typed D1, migrations, deploy, no adapter glue |
| Database | D1 (SQLite) | Zero-ops, per-app, free-tier friendly; Postgres only when write-heavy or joins get real |
| ORM | Drizzle via `void/db` | Types from schema; no extra install |
| Auth | Better Auth | Void auth unsupported in framework mode |
| Styling | Tailwind v4 + AlignUI tokens | CSS-first `@theme`, OKLCH, no config file |
| Variants | `cva` + `cn` | Static, lintable class strings |
| Design gate | `@shadcn/lint` | Six rules at `error`, agent-readable messages |
| Coordination | Durable Objects | Per-entity state, alarms, WebSockets |
| Deploy | `cf`, fallback Void | `cf` owns the account; Void owns the app upload when `cf build` cannot |

## File tree

```
src/
  routes/
    __root.tsx
    index.tsx
    design.tsx              # dev-only gallery
  router.tsx
  styles.css                # @theme primitives + semantic layer
  components/
    ui/                     # primitives, contract comments, CVA
    patterns/               # composed, app-aware, reuse-first
  lib/
    format.ts               # money, dates, numbers
    errors.ts               # typed error union
db/
  schema.ts                 # Drizzle tables via void/schema-d1
  migrations/               # generated SQL, committed
durable-objects/            # defineDurableState, hand-rolled DOs
crons/                      # scheduled handlers
queues/                     # producers + consumers
email/                      # inbound handlers, Void apps only
src/
  live.ts                   # defineLiveStream, if used
public/
vite.config.ts
void.config.ts
cloudflare.config.ts
package.json
AGENTS.md
docs/
  spec.md
  pain-ledger.md
  design-system.md
  build.md
```

## Vite configuration

`voidPlugin()` must come first. Do not also add `@cloudflare/vite-plugin`; Void
supplies it.

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
install when CI typechecks before deploy, so `.void/` types exist.

## Data

Dialects: D1 by default, Postgres or MySQL via Hyperdrive (`database: "pg"`
or `"mysql"`). Dialect choice, type pipeline, KV, R2, durable state, and env
vars live in `data.md`.

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

## Server functions

```ts
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from 'void/db'
import { invoices } from '@schema'

const CreateInvoice = z.object({
  workspaceId: z.number().int().positive(),
  amountMinor: z.number().int().positive(),
  currency: z.string().length(3),
})

export const createInvoice = createServerFn({ method: 'POST' })
  .validator((input: unknown) => CreateInvoice.parse(input))
  .handler(async ({ data }) => {
    const [row] = await db.insert(invoices).values(data).returning()
    return row
  })
```

- Parse at the boundary, trust inside. No `any` crossing the wire.
- Business rules live in `src/lib/<domain>.ts` as pure functions; the handler
  orchestrates.
- Server-only modules must not be imported by route components except through
  server functions or loaders.

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

Void-managed auth is not supported in framework mode. Use Better Auth's
TanStack Start integration:

- One `auth.ts` server module, cookie-based sessions, D1 adapter.
- Session read in `__root.tsx` loader; route guards via `beforeLoad`.
- Never trust a user id from the client; resolve it from the session on the
  server for every mutation.

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
pnpm dev                 # Vite dev server with the Void plugin, :5173
pnpm void init              # once: voidPlugin(), project files, docs, agent skill
pnpm void db generate       # generate a migration from the schema
pnpm void prepare           # generate .void types for CI typecheck
pnpm void info              # resource names, durable state map
pnpm void deploy            # build, migrate, upload
pnpm void project status    # also: logs, rollback
```

Void's version-matched docs ship in the package: `node_modules/void/docs/`.
Read `guide/quickstart.md` and `reference/cli.md` when a command's flags are in
doubt.

`fetch` from `void/client` gives typed calls to Void app routes. In framework
mode TanStack owns routing: call the server with `createServerFn`, not
`void/client`.

## Version discipline

- Keep the `void` package and the global CLI on the same version.
- Upgrade deliberately: read the changelog, run `void info` before and after,
  deploy once to staging before production.
- One machine performs the first deploy; every other machine pulls the lock
  file before deploying.
