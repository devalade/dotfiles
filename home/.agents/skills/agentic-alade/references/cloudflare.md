# Cloudflare reference: `cf` first, Void for the app upload

`cf` is Cloudflare's CLI for the whole public API (2,900+ operations), built for
agents: JSON on stdout, `cf cli search` for discovery, and
`cloudflare.config.ts` for typed configuration. Wrangler is legacy for new work.

Verified locally: `cf v1.0.0-beta.5`. Beta means commands can change; when a
command fails, run `cf cli search "<task>"` and `cf schema <command>` instead of
guessing.

## Requirements and gotchas

- Node.js **22.18+**. `cf` does not work on Bun: loading `cloudflare.config.ts`
  under Bun fails. Run the installed binary or `pnpm exec cf`; never `bunx cf`.
- `package.json` must have `"type": "module"`, or loading the config fails with
  `Cannot use import statement outside a module`.
- `cf` keeps its own credentials. It does not reuse a Wrangler login.
- Install: `npm install --global cf` (also exposes `cloudflare` if `cf` is
  taken). A project that needs a pinned version adds `cf` as a dev dependency;
  the global command then runs the project copy.
- `.env` is read for `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`,
  `CLOUDFLARE_ZONE_ID`. Only `.env`, not `.env.local` or mode files.
- Never run `cf init`, `cf dev`, `cf build`, or `cf deploy` in a project that
  has `wrangler.jsonc`, `wrangler.json`, or `wrangler.toml`. Use `cf migrate`
  first, then delete the Wrangler file.

## Auth and accounts

```bash
cf auth login            # browser + one-time code
cf auth login --no-browser   # remote/SSH
cf auth whoami
cf auth list
cf auth create work      # named profile
cf auth activate work    # bind profile to this directory
cf auth deactivate
```

Account selection order: `CLOUDFLARE_ACCOUNT_ID` → `accountId` in
`cloudflare.config.ts` → cached project choice → the only account available.
With several accounts and no choice saved, non-interactive commands fail.

Zone-scoped commands take `--zone <id|domain>`:

```bash
cf zones list
cf dns records list --zone example.com
```

## Project commands

```bash
cf init my-app               # scaffold; includes cf + Cloudflare Vite plugin
cf init .                    # adopt an existing Vite app (writes config, edits package.json)
cf dev                       # local Workers runtime + Vite
cf build                     # build to .cloudflare/output/v0/
cf deploy --dry-run          # build only, no API calls, no login needed
cf deploy                    # build, upload, deploy
cf previews deploy           # preview deployment
```

`cf build` and `cf deploy` run the framework build command (for example
`vite build`), not the `build` script in `package.json`. Extra build steps
belong in the framework config.

`cloudflare.config.ts` is the typed source of truth:

```ts
import { bindings, defineConfig } from 'cf/config'
import * as entrypoint from './src/worker.ts' with { type: 'cf-worker' }

export default defineConfig({
  accountId: 'optional',
  worker: {
    name: 'my-app',
    compatibilityDate: '2026-10-01',
    compatibilityFlags: ['nodejs_compat'],
    entrypoint,
    env: { CACHE: bindings.kv('CACHE') },
  },
})
```

## Deploy ownership

One owner per project. Decide at phase 0, write it in `AGENTS.md`.

| Owner | When | Commands |
|---|---|---|
| `cf` (default) | `cf build` succeeds, or the app is a plain Vite/static Worker | `cf dev`, `cf build`, `cf deploy` |
| Void | Framework needs Void's SDK, binding inference, migrations, or `cf build` cannot build it | `void deploy --platform cloudflare` |
| Neither | Static site with no server code | `cf deploy` against the assets build |

Do not mix them. Mixing produces two config files describing one Worker, and
whichever ran last wins silently.

## Secrets

```bash
cf workers secrets update <script> --name API_KEY --value ...   # add or update
cf workers secrets bulk <script> --file secrets.json            # patch many
cf workers secrets get <script> --name API_KEY                 # metadata only
cf workers secrets delete <script> --name API_KEY
```

Secrets are per Worker, per environment. Local development uses `.dev.vars`
(kept out of git); never put a production secret in `.env` that ships with the
app.

## D1

```bash
cf d1 create --name my-app-db            # note the returned database ID
cf d1 query <DATABASE_ID> --sql "select count(*) from users"
cf d1 migrations create --dir db/migrations --name add_invoices
cf d1 migrations apply <DATABASE_ID> --dir db/migrations
```

- `cf` identifies D1 by **ID**, not by name or binding.
- `cf d1 migrations apply` is wire-compatible with Wrangler's migration table;
  keep the same `--dir` and numbering if you migrate an existing database.
- With Void, use `void db generate` and let `void deploy` apply migrations.
  Use `cf d1 query` for inspection and incident work.

## R2

```bash
cf r2 buckets create my-bucket
cf r2 objects put my-bucket --key path/file.json --file ./file.json
cf r2 buckets domains custom create ...
```

With Void, upload through `void/storage`; use `cf r2` for audits, backfills,
and lifecycle rules.

## Durable Objects

```bash
cf durable-objects namespaces list
cf durable-objects namespaces objects list <namespace-id>
```

Class lifecycle changes (add, rename, remove) are migrations. With Void, never
edit the generated migration entries in `void.lock.json`; use
`void deploy --platform cloudflare --atomic` when a class change must publish
atomically.

## Cache, DNS, and edge

```bash
cf cache purge --zone example.com --everything
cf cache purge --zone example.com --files /,/pricing
cf dns records list --zone example.com
cf dns records import ...
```

Purge only after a deploy that changes HTML or assets users already fetched.
Hashed assets under `/assets/` never need purging; fix the caching header
instead.

## Logs and verification

```bash
cf workers deployments list <script>
cf workers deployments get <script> <deployment-id>
```

`cf` cannot stream live logs yet. Use:

```bash
npx wrangler tail <worker-name>
```

(That is the one Wrangler command allowed in a `cf` project, and it does not
read the project config.)

After every deploy, verify from outside the machine:

```bash
curl -sS -o /dev/null -w '%{http_code}\n' https://<app>.workers.dev/
curl -sS https://<app>.workers.dev/health
```

Then check the log tail for exceptions during one real request. A 200 on the
root proves the Worker bound; it does not prove the database, auth, or queues.

## CI

```bash
export CLOUDFLARE_API_TOKEN=...
export CLOUDFLARE_ACCOUNT_ID=...
cf build
cf deploy
```

- Give the token only the permissions the job uses.
- Build once, deploy the same artifact: `cf build` then `cf deploy` reuses the
  Build Output in `.cloudflare/output/v0/`.
- Run `cf init .` locally and commit the result; in CI, automatic configuration
  rewrites `package.json` and `vite.config.ts` without asking.
- Add `.cloudflare/` to `.gitignore` yourself.

## Void deploy path

```bash
pnpm void connect --platform cloudflare   # once
pnpm void deploy --platform cloudflare    # build, provision, migrate, upload
pnpm void secret put API_KEY              # production secret
pnpm void project status | logs | rollback
```

- First deploy from a single machine; commit `void.lock.json` before any other
  machine or CI deploys.
- Keep `.void-wrangler.jsonc` in `.gitignore`.
- `void deploy` saves a D1 Time Travel restore point before applying
  migrations and prints the restore command. Keep it in the incident notes.
- Cloudflare's own account work (DNS, zones, cache, WAF, Access) still goes
  through `cf`; Void does not replace the account layer.
