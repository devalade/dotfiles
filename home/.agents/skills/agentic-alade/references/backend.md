# Backend reference: the nine surfaces

Void covers most of the backend. Three surfaces are Void-app only, and the
framework-mode answers differ. Verify each one you need with a 30 minute probe
before designing around it, and write the result in `AGENTS.md`.

## Support matrix

| Surface | Void API | TanStack Start | Notes |
|---|---|---|---|
| Authentication | `void/auth`, `void/client` | No, use Better Auth | Void-managed auth is Void-app only |
| AI | `void/ai` | Yes | Binding inferred from import; no local simulator |
| Email, sending | `void/email` | Yes | Needs `email.from` and a verified sender |
| Email, receiving | `email/` handlers | No | Native Void app only |
| Email, domains | `void email domain`, `void email status` | Yes, for direct Cloudflare | Apex-only catch-all |
| Sandboxes | `void/sandbox` | Verify | Workers Paid + Containers + Docker locally |
| Cron jobs | `crons/` | Yes | Schedules do not fire locally |
| Queues | `queues/` | Yes | Local auto-invoke is Void-app only |
| WebSockets | `routes/*.ws.ts` | No | Void-app only; use a Durable Object |
| SSE | `void/sse` | Yes, plain `Response` | One producer per request |
| Live event streams | `void/live` | Verify | DO-backed fanout, at-most-once |

"Verify" means: build the smallest working call, run it in dev and once in
production, then record the answer. Do not design a feature on an assumption
about framework support.

## Authentication

Void apps: importing `void/client` or `void/auth` turns auth on. Email and
password by default; social providers via `void.config.ts` or a root `auth.ts`.

```ts
import { auth } from 'void/client'
await auth.signUp.email({ email, password, name })
await auth.signIn.email({ email, password })
```

```ts
// routes/api/profile.ts
import { requireAuth } from 'void/auth'
export const GET = defineHandler((c) => ({ email: requireAuth(c).email }))
```

TanStack Start: Better Auth's own integration. One server module, D1 adapter,
cookie sessions, session read in the root loader, guards in `beforeLoad`.
Resolve the user from the session on the server for every mutation.

## AI

```ts
import { ai } from 'void/ai'

const result = await ai.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
  messages: [{ role: 'user', content: prompt }],
})
```

- `ai.stream()` for token streaming; return the stream from the handler.
- `ai.models({ task: 'Text Generation' })` lists available models.
- `ai.image(model, { prompt })`, `ai.toMarkdown([{ name, blob }])` for
  documents.
- `ai.provider('openai').fetch('/chat/completions', { body })` for
  provider-native APIs through AI Gateway. Keys are project secrets
  (`OPENAI_API_KEY`) via `void secret put`, or `.env` locally.
- Gateway options go third: `ai.run(model, input, { gateway: { skipCache: true } })`.
- Development uses a remote binding: `void connect` plus
  `void cloudflare login`, or `CLOUDFLARE_API_TOKEN`. There is no local
  simulator.
- `UsageLimit` from `void/limits` is a normal rejection in jobs and queues, and
  an automatic 429 in handlers and page actions.

First AI feature to build: one prompt with a typed input, a token budget, a
timeout, and a visible failure state. Then caching and cost accounting.

## Email

### Sending

```ts
import { sendEmail } from 'void/email'

const result = await sendEmail({
  to: 'user@example.com',
  subject: 'Welcome',
  text: 'Thanks for signing up.',
})
```

- `from` defaults to `email.from` in `void.config.ts`.
- At most 50 recipients across `to`, `cc`, `bcc`. Encoded message limit 5 MiB.
- Attachments take `string | Uint8Array | ArrayBuffer | Blob`; inline images
  need `contentId` and `disposition: 'inline'`.
- Check both failure shapes: request-level `error` and per-recipient
  `deliveries`. A successful result means the provider accepted the send, not
  that it landed.
- `idempotencyKey` (Void platform only) makes retries safe for 30 days with the
  same payload; reuse with a different payload returns `IDEMPOTENCY_CONFLICT`.
- `OUTCOME_UNKNOWN` means the message may have been accepted. Inspect before
  retrying.
- Development captures mail in a local inbox.

Setup on your own Cloudflare account:

1. `email: { from: 'Acme <support@mail.acme.com>' }` in `void.config.ts`. Use a
   mail subdomain so existing mail keeps its provider.
2. Token needs Email Routing Edit and Email Sending Edit, plus deploy
   permissions. Global API keys are not supported.
3. `void deploy --platform cloudflare` configures routing, sending, DNS, and
   handler addresses; accept once.
4. `void email status --platform cloudflare` after DNS changes.
5. Recipients must be verified on Workers Free: `void email allow <address>`,
   then `void email destinations`. Unverified recipients fail in `deliveries`.
6. Arbitrary recipients require Workers Paid and `void email setup`.
   SPF, DKIM, and DMARC must pass before deliverability is real.

### Receiving (Void apps only)

`email/<local-part>.ts` with `defineEmail`. Patterns:
`support.ts`, `support+[ticket].ts`, `[user].ts`, `[user]+[tag].ts`,
`_default.ts`. Most specific wins, literal tag beats captured tag.

- `parseEmail(message)` once per message; returns from, to, subject, text, html,
  attachments, headers.
- `message.setReject(reason)`, `message.forward(to)`, `replyEmail(message, options)`.
- Returning without an action accepts the message.
- Catch-all only works on a zone apex; a mail subdomain cannot receive arbitrary
  local parts.

TanStack Start has no inbound email. Options: a separate small native Void app,
or a dedicated Cloudflare Worker with an `email()` export.

## Sandboxes

```ts
import { getSandbox } from 'void/sandbox'
const sandbox = await getSandbox(`user-${userId}`, { inactivityTimeoutMs: 600_000 })
const result = await sandbox.run(['node', '--version'])
```

- Requires Workers Paid and Containers; Docker for local work and image builds.
- `run()` takes `[executable, ...args]`; use `['sh', '-c', cmd]` for shell.
  Options: `cwd` (default `/workspace`), `env`, `user`, `signal`, `pty`,
  `stdin`, `stdout`, `stderr`.
- `exec()` returns a process: `process.output()`, `process.exitCode`.
- Files: `readFile`, `writeFile`, `list`, `remove`. Servers: `fetch(port, Request)`.
- `enableInternet` defaults to `false`. Turn it on deliberately.
- Nothing persists beyond the container: save results to D1, KV, or R2.
- `SandboxLimitError` (concurrency, runtime budget) is a `UsageLimit`.
- Custom images need the `sandbox-shim` binary from the matching SDK image.

Use it for user-supplied code, document conversion, or long shell work. Do not
use it as a database or a queue.

## Cron jobs

```ts
// crons/hourly-heartbeat.ts
import { defineScheduled } from 'void'

export const cron = '0 * * * *'

export default defineScheduled(async (controller, env) => {
  await env.KV.put('jobs:last-heartbeat', controller.scheduledTime.toString())
})
```

- `cron` may be a single expression or an array. Files and directories starting
  with `_` are ignored.
- Jobs sharing an expression each run once per invocation; Void waits for all
  and reports failures.
- Schedules do not fire locally. Trigger one:
  `POST /__void/scheduled` with `x-void-dev-trigger` (Void prints the curl
  command at dev start).
- Assume at-least-once. Make the job idempotent and cheap when there is nothing
  to do.
- Long work belongs in a queue; the cron should enqueue, not process.

## Queues

```ts
// queues/emails.ts
import { defineQueue } from 'void'

interface Message { to: string; subject: string }

export default defineQueue<Message>(async (batch) => {
  for (const msg of batch.messages) {
    await send(msg.body)
    msg.ack()
  }
})
```

- Queue name comes from the path: `queues/order/notifications.ts` becomes
  `order/notifications`. Send with the typed proxy from `void/queues`.
- `msg.ack()`, `msg.retry({ delaySeconds })`, `batch.ackAll()`,
  `batch.retryAll()`. No explicit decision: ack on success, retry on throw.
- Consumer options as named exports: `maxBatchSize` (10), `maxBatchTimeout`
  (5s), `maxRetries` (3), `retryDelay` (0s).
- Void configures no dead-letter queue; exhausted messages are deleted by
  Cloudflare.
- On a direct Cloudflare account, queue names are prefixed with the Worker name.
  Keep them under 63 characters and unique per Worker.
- Local: `POST /__void/queue` with `x-void-dev-trigger`. Auto-invoke on send
  only happens in native Void apps.

## WebSockets

Void apps: `.ws.ts` routes under `routes/`, compiled to a Durable Object.
`defineRoom()` for shared rooms (`ctx.room.broadcast`, `getConnections`,
`connection.send/close/setState`, `onBeforeConnect`, `onConnect`, `onMessage`),
`defineWebSocket()` for independent connections, with valibot schemas for
client and server messages.

TanStack Start: hand-rolled Durable Object.

1. `durable-objects/<name>.ts` exporting the DO class with
   `webSocketMessage`, `webSocketClose`, and `webSocketError` handlers, plus
   `ctx.acceptWebSocket(server)` in `fetch` (hibernation API).
2. `cloudflare: { main: './server.ts', durable_objects: [...] }` in
   `void.config.ts`; import the DO class from the entry module.
3. Route the upgrade from a server route or a dedicated Worker entry, and
   authenticate before upgrading.

## SSE

```ts
import { eventStream } from 'void/sse'

export const GET = defineHandler((c) =>
  eventStream(
    async (stream) => {
      await stream.comment('connected')
      await stream.send({ event: 'ready', data: { now: Date.now() } })
      await stream.closed
    },
    { signal: c.req.raw.signal },
  ),
)
```

- Handles formatting, headers, keepalives, closure, and aborts.
- Use when one request owns the producer: AI tokens, progress, command output,
  deploy logs.
- In TanStack Start, return a `Response` with
  `Content-Type: text/event-stream` and a `ReadableStream`, or reuse
  `eventStream` if the import resolves in framework mode. Probe it.
- Always respect `request.signal` and close the stream on abort.

## Live event streams

```ts
// src/live.ts
import { defineLiveStream } from 'void/live'

export const live = defineLiveStream({
  id: 'app',
  async identifyConnection(ctx) {
    const session = await getSession(ctx.request)
    return session ? `user:${session.userId}` : null
  },
})
```

```ts
// routes/live.ts
export const GET = defineHandler((c) => live.connect(c))
export const POST = defineHandler((c) => live.control(c))
```

- One SSE connection, many topic subscriptions; the browser changes
  subscriptions as it navigates.
- Client: `connectLiveStream('/live', { withCredentials: true, retryDelay, onError })`,
  then `stream.subscribe({ id, topic, onEvent })`.
- Publish from routes, crons, or queue consumers:
  `live.publish('post:12', { title })`; outside a request context use
  `live.withEnv(env).publish(...)`.
- Authorization: `identifyConnection`, `onSubscribe`, or explicit `owner` passed
  to both `connect()` and `control()`. Never publish private data on an
  anonymous stream.
- At-most-once, ordered per topic, no replay. Deploys and reconnects drop state.
  Durable replay is your job: store events, expose `eventId`/`lastEventId`.
- Limits: 256 subscriptions per connection, 256 per topic (not raisable),
  100 control ops per request, 100 queued events per connection, 64 KiB per
  event. Shard topics or move to a dedicated realtime service beyond that.
- Framework support is not documented. Probe before designing on it; the
  fallback is your own Durable Object with the same protocol.

## Choosing between them

| Need | Use |
|---|---|
| Defer slow work, absorb bursts | Queue |
| Recurring work on a clock | Cron (enqueue, do not process) |
| Per-entity state, chat, presence, rate limits | Durable Object / WebSockets |
| One stream for one response | SSE |
| Many subscribers across topics on one connection | Live event streams |
| Untrusted code or long shell work | Sandbox |
| Transactional mail | `sendEmail` |
| Money-moving or record-changing work | D1 write + queue, never fire-and-forget in a handler |

## Local development triggers

| Surface | Endpoint |
|---|---|
| Cron | `POST /__void/scheduled` with `{"cron","scheduledTime"}` |
| Queue | `POST /__void/queue` with `{"queue","messages":[...]}` |

Both need the `x-void-dev-trigger` token printed when the dev server starts.
