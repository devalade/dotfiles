# Data and type safety reference

The data layer is where a product's shape lives. Get the types and the dialect
right before the first feature; migrations after launch are the expensive kind.

## What works where

| Concern | Void API | TanStack Start |
|---|---|---|
| Type pipeline | Drizzle → `RouteMap` → typed fetch | Drizzle → `createServerFn` → props |
| D1 (SQLite) | `database` default | Yes |
| PostgreSQL | `database: "pg"` via Hyperdrive | Yes |
| MySQL | `database: "mysql"` via Hyperdrive | Yes |
| Typed fetch | `fetch` from `void/client` | No, use server functions |
| KV | `void/kv` | Yes |
| Object storage | `void/storage` | Yes |
| Durable state | `defineDurableState` | Yes, custom `cloudflare.main` |
| Env vars | `env.ts` + `void/env` | Yes |

Void's typed fetch validates paths against `routes/`, which Void owns. In
framework mode TanStack owns routing, so type safety comes from
`createServerFn` and route loaders instead. Do not import `void/client` there.

## Type safety

The pipeline in a Void app:

1. Drizzle schema defines column types.
2. Handler return types and validator schemas produce a `RouteMap`.
3. Typed fetch consumes `RouteMap` for paths, methods, bodies, query, params,
   and response types.
4. Page loaders flow into components via `InferProps`; actions flow into
   `useForm`.

Generated types live in `.void/` and update on change. Run `void prepare` in CI
before typechecking.

The TanStack equivalent:

- Schema is still the source of truth (`db/schema.ts`).
- `createServerFn` with a validator gives the client a typed function, which is
  better than a typed URL: it cannot drift from the route table.
- Route `loader` return types reach components through `Route.useLoaderData()`.
- Types never cross into a client bundle unless the value does.

Rules:

- One schema per boundary, parsed once. No duplicate interfaces beside a
  Drizzle table.
- `strict` and `noUncheckedIndexedAccess` on. `any` at a boundary is a bug.
- Money is an integer with a currency beside it. Never a float.
- Time is UTC in storage, formatted at the edge with the user's timezone.
- IDs are branded types if the product has more than two entity kinds.

## Choosing a database

| Situation | Choose |
|---|---|
| Prototype, read-heavy, single-region is fine | D1 |
| Write-heavy, joins, reporting, existing Postgres | PostgreSQL via Hyperdrive |
| Existing MySQL estate | MySQL via Hyperdrive |
| Per-entity counters, carts, rooms, rate limits | Durable Object state |
| Files, exports, images | R2 |

The cost rule: D1 and Durable Objects are cheap to read and comparatively
expensive to write at volume. If the product is a write-heavy event log or a
metering system, start on Postgres, or keep that table off Cloudflare entirely.
Decide this in phase 0, not after the first invoice.

D1 specifics:

- SQLite dialect. No partial-write transactions across statements unless you
  use `batch`.
- Keep statements short; batch writes rather than looping single inserts.
- Index every foreign key and every list filter before launch.

Postgres and MySQL specifics:

- Void provisions Hyperdrive from a connection string. Local dev connects
  directly with `DATABASE_URL` from `.env`.
- Hyperdrive uses TLS in `require` mode. It ignores `sslmode=verify-ca`,
  `sslmode=verify-full`, and `sslrootcert`. For CA verification, create the
  Hyperdrive in Cloudflare yourself and set `cloudflare.hyperdrive`.
- Migrations are the same workflow; the dialect changes the generated SQL.

## Schema and migrations

```ts
// db/schema.ts, D1
import { sqliteTable, text, integer } from 'void/schema-d1'
import { sql } from 'void/db'

export const invoices = sqliteTable('invoices', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  amountMinor: integer('amount_minor').notNull(),
  currency: text('currency').notNull().default('XOF'),
  status: text('status').notNull().default('draft'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
})
```

```ts
// db/schema.ts, Postgres
import { pgTable, serial, text, integer, timestamp } from 'void/schema-pg'
```

```ts
// db/schema.ts, MySQL
import { int, mysqlTable, text, timestamp } from 'void/schema-mysql'
```

Commands:

```bash
pnpm void db generate      # diff schema to SQL
pnpm void db migrate       # apply pending migrations
pnpm void db status        # what is applied, what is pending
pnpm void db push          # dev-only shortcut, never in production
pnpm void db seed
pnpm void db studio        # browse data
pnpm void db execute       # run SQL
pnpm void db reset         # local only
```

Rules:

- Read every generated migration before committing it. Review the SQL, not the
  TypeScript.
- Migrations are forward-only in production. To undo, write a new one.
- Deploy stops on schema drift, which is correct. Generate, read, commit,
  deploy.
- A migration that drops or narrows a column ships in two steps: stop writing
  it, deploy, then remove it.
- Seed with realistic volume and shapes. Three rows hide pagination bugs.

## Querying

```ts
import { db, eq, and } from 'void/db'
import { invoices } from '@schema'

const open = await db
  .select()
  .from(invoices)
  .where(and(eq(invoices.status, 'open'), eq(invoices.currency, 'XOF')))
```

- `@schema` is the alias to `db/schema.ts` that Void configures.
- Select only the columns the surface needs; `select()` returns everything and
  leaks new columns into responses.
- Paginate with a stable cursor (id or timestamp + id), not offset, once a list
  can grow.
- Keep queries in `src/lib/<domain>` next to the rule they serve, not scattered
  in components.

## Typed fetch (Void apps only)

```ts
import { fetch } from 'void/client'

const users = await fetch('/api/users')
const user = await fetch('/api/users/:id', { params: { id: '42' } })
```

- Paths are checked against `routes/`; wrong method and wrong body fail at
  compile time.
- Non-2xx throws `FetchError`.
- Query and params are typed from the handler's validator.

TanStack Start equivalent:

```ts
export const listUsers = createServerFn({ method: 'GET' }).handler(async () => {
  return db.select({ id: users.id, name: users.name }).from(users)
})

// in a route loader or component
const users = await listUsers()
```

## KV

```ts
import { kv } from 'void/kv'

const user = await kv.get<User>('user:123')
await kv.put('user:123', user, { ttl: 3600 })
await kv.delete('user:123')
const { keys } = await kv.list({ prefix: 'user:', limit: 100 })
```

- Values are JSON. A stored string comes back as a string; a number stays a
  number.
- `ttl` (seconds) or `expiration` (Unix timestamp) for anything session-like.
- `metadata` for small sidecar data; `getWithMetadata` reads it.
- `kv.map<T>('sessions')` gives a typed, prefixed collection. Prefer it over
  hand-built key strings.
- `list` paginates with `limit` and `cursor`.
- KV is eventually consistent. Never use it for reads-after-write that must be
  correct: sessions that revoke, balances, locks. Use D1 or a Durable Object.

## Object storage

```ts
import { storage } from 'void/storage'

await storage.put('uploads/photo.jpg', file, {
  httpMetadata: { contentType: 'image/jpeg' },
})
const object = await storage.get('uploads/photo.jpg')
const head = await storage.head('uploads/photo.jpg')
await storage.delete('uploads/photo.jpg')
const listed = await storage.list({ prefix: 'uploads/' })
```

- Server picks the key. Never let the client name the object.
- Serve downloads with `Content-Disposition: attachment` and
  `X-Content-Type-Options: nosniff`; uploaded HTML and SVG can execute on your
  origin otherwise.
- Store the metadata row in D1 (`key`, `contentType`, `size`, `ownerId`) and the
  bytes in R2.
- Large uploads go through a presigned URL or a worker stream, not a server
  function body.

## Durable state

```ts
import { defineDurableState } from 'void/durable'

export const Counter = defineDurableState({
  initialState: { count: 0 },
  methods: {
    increment(context, amount: number) {
      context.state.count += amount
      return context.state.count
    },
  },
})

export default Counter
```

- One object per name; methods run one at a time; state rolls back if the
  handler throws. Writes through `context.storage` do not roll back.
- Use for carts, rooms, rate limits, per-tenant counters, coordination.
- Do not use as the primary store for records you query with SQL.
- Renaming a file requires copying the suggested `name` from `void info` first,
  or the state is orphaned.
- In framework mode, a Durable Object class needs its own entry module via
  `cloudflare.main` and a binding under `cloudflare.durable_objects`.

## Environment variables

```ts
// env.ts
import { defineEnv, number, string, url } from 'void/env'

export default defineEnv({
  STRIPE_KEY: string(),
  DATABASE_URL: url(),
  PORT: number().default(3000),
  VITE_API_ORIGIN: url(),
})
```

```ts
import { env } from 'void/env'
const key = env.STRIPE_KEY
```

- Helpers: `string()`, `number()`, `boolean()`, `url()`, `email()`,
  `oneOf([...])`, `json()`, with `.optional()` and `.default()`. Any Standard
  Schema validator also works.
- `.env` only. `.env.local`, `.env.production`, `.env.example`, and
  `.dev.vars*` are not read. Shell values override the file.
- `#` starts a comment when unquoted. Quote values containing `#`.
- Names beginning with `__VOID_` are reserved; Void stops on a collision.
- `pnpm void env check` validates locally.
- Production server values: `pnpm void secret put KEY`, or
  `pnpm void secret sync production-secrets.txt` for bulk.
- `VITE_*` keys are client-visible and rejected by secret commands. Never put a
  secret behind a `VITE_` name.
- `void deploy` requires every non-optional server key to exist remotely. It
  never uploads `.env`.
- Validate at startup, not at use. A missing key should fail the deploy or the
  first request, not a payment three days later.

Env rules for this stack:

- One `env.ts`, no `process.env` reads in app code.
- Secrets in `void secret`, never in `void.config.ts`, never in a default.
- Per-environment values come from the platform or the shell, not from a
  committed file.
- Document every key in `AGENTS.md` with who owns it and what breaks without it.
