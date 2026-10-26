# Cloudflare catalogue: what to reach for

Every product here is reachable from `cf`. The namespace in each row is the CLI
family, not the full command: run `cf <namespace> --help`, or
`cf cli search "<task>"` when you do not know the family. `cf --help` lists the
public namespaces, and a few (`turnstile`, `vectorize`, `pages`, `custom-hostnames`)
exist without appearing in that list, so search is the live index.

## The default kit

Start with this and add nothing until a requirement demands it.

| Need | Product | Void |
|---|---|---|
| Serve the app | Workers + Static Assets | Built in |
| Relational data | D1 | `void/db` |
| Files | R2 | `void/storage` |
| Config, cache, sessions | KV | `void/kv` |
| Per-entity state, coordination | Durable Objects | `void/durable` |
| Background work | Queues | `queues/` |
| Multi-step durable work | Workflows | Binding only |
| Scheduled work | Cron Triggers | `crons/` |
| Model calls | Workers AI, AI Gateway | `void/ai` |
| Transactional mail | Email Sending | `void/email` |
| Abuse protection on forms | Turnstile | Binding only |
| Admin surfaces | Access | Account level |
| DNS and TLS | Zones, Registrar | Account level |
| Logs and errors | Workers Logs, Logpush | Account level |

## Compute and runtime

| Product | Use when | Namespace | Trap |
|---|---|---|---|
| Workers | Any app, API, or scheduled code | `workers` | CPU and subrequest limits per plan |
| Static Assets | Files shipped with a Worker | `workers` | Hashed assets, do not purge per deploy |
| Pages | Only for an existing Pages project | `pages` | Workers is the recommendation for new work |
| Containers | You need a full Linux process, custom image | `containers` | Workers Paid, image build and cold start |
| Sandbox SDK | Untrusted code, shell, document tooling | `containers` | Not persistent, no local simulator for AI |
| Dynamic Workers | Load customer or generated code at runtime | `workers` | Egress and binding controls are your job |
| Workers for Platforms | Each customer gets their own Worker | `workers-for-platforms` | Dispatch namespaces, per-tenant limits |
| Browser Rendering | Screenshots, PDFs, scraping JS pages | `browser-run` | Session cost, concurrency caps |
| Durable Objects | Shared state, WebSockets, rate limits | `durable-objects` | Single-threaded per object, write cost |
| Workflows | Multi-step process with retries and state | `workflows` | Different mental model from a queue |
| Queues | Decouple producers from slow work | `queues` | At-least-once, no DLQ in Void |
| Cron Triggers | Recurring job | `workers` | Never fires locally in framework mode |
| Workers VPC | Reach a private network from a Worker | `workers-vpc` | Needs a tunnel or connector |
| Cloud Connector | Reach AWS, Azure, or GCP without an origin | `cloud-connector` | Account configuration, not app code |

## Data and storage

| Product | Use when | Namespace | Trap |
|---|---|---|---|
| D1 | App records, read-heavy, SQL | `d1` | SQLite dialect, writes cost more than reads |
| Hyperdrive | Existing Postgres or MySQL | `hyperdrive` | Ignores sslmode verify settings |
| KV | Config, feature flags, cached reads | `kv` | Eventual consistency, no locks |
| R2 | Uploads, exports, media originals | `r2` | Zero egress, operations still cost |
| R2 Data Catalog | Iceberg tables for analytics | `r2` | Warehouse, not app data |
| R2 SQL | Query the data lake | `r2` | Not for transactional reads |
| Vectorize | Embeddings, semantic search | `vectorize` | Index limits, needs an embedding step |
| AI Search | Managed crawl, index, and answer | `ai-search` | Beta surface, check pricing |
| Pipelines | Stream events into R2 or analytics | `pipelines` | Meant for logs and events, not app writes |
| Artifacts | Versioned file trees, agent checkpoints | `r2` | Closed beta, confirm access |
| Secrets Store | One secret shared across Workers | `secrets-store` | Account-level; per-Worker secrets are simpler |
| DO storage | Structured state inside one object | `durable-objects` | Rollback semantics differ from state |

## AI

| Product | Use when | Namespace | Trap |
|---|---|---|---|
| Workers AI | Model inference on the platform | `ai` | No local simulator, remote binding in dev |
| AI Gateway | Cache, rate limit, observe provider calls | `ai-gateway` | Provider key lives as a secret |
| Vectorize | Retrieval for RAG | `vectorize` | Chunking and embeddings are your design |
| AI Search | Search-as-a-service over your content | `ai-search` | Less control than Vectorize plus your own store |
| AI Audit | Track AI crawlers on your zone | `ai-audit` | Zone-level reporting |
| Pay Per Crawl | Charge crawlers for content | `pay-per-crawl` | Product and legal decision, not a toggle |

Prompt caching, budgets, and timeouts belong in your code even with AI Gateway.
A model call without a timeout and a cost cap is an outage waiting for a spike.

## Email

| Product | Use when | Namespace | Trap |
|---|---|---|---|
| Email Sending | Transactional mail | `email-sending` | Verified destinations, DNS auth |
| Email Routing | Inbound mail to a Worker or address | `email-routing` | Catch-all only on a zone apex |
| Email Workers | Inbound handling in a native Void app | `email-routing` | Not available in framework mode |
| Email Security | Inbound phishing and threat controls | `email-security` | Separate product from routing |

Use a mail subdomain so existing mail keeps its provider. SPF, DKIM, and DMARC
must pass before deliverability claims are honest.

## Media and realtime

| Product | Use when | Namespace | Trap |
|---|---|---|---|
| Images | Resize, optimize, signed delivery | `images` | Per-image and delivery costs |
| Stream | Upload, encode, deliver video | `stream` | Encoding time, storage tiers |
| Realtime | Audio, video, data channels | `realtime` | Plan-specific concurrency |
| Calls | WebRTC voice and video | `realtime` | Needs TURN and client SDK work |

For a marketing video or a landing page clip, R2 plus a player is cheaper than
Stream. Stream earns its cost when you need transcoding and adaptive bitrate.

## Network and delivery

| Product | Use when | Namespace | Trap |
|---|---|---|---|
| DNS | Records for the domain | `dns` | Apex CNAME flattening rules |
| Registrar | Buy or transfer a domain | `registrar` | Renewal and transfer lock |
| Cache | CDN caching and purge | `cache` | Purge after HTML changes, not assets |
| Cache Reserve | Keep hot content in persistent cache | `cache` | Cost, best for large static sets |
| Rulesets | Rewrites, redirects, headers, WAF rules | `rulesets` | Rule order decides behavior |
| Load Balancing | Multiple origins, failover, geo steering | `load-balancers` | Health checks need a real endpoint |
| Waiting Room | Protect an origin during a launch | `waiting-rooms` | Queue fairness is configurable |
| Speed | Scheduled Lighthouse tests | `speed` | Reports, not runtime |
| Analytics | Zone traffic and Argo latency | `analytics` | Zone-scoped, not app-level |
| Reporting | Account-level reports | `reporting` | Different from app telemetry |

## Security and access

| Product | Use when | Namespace | Trap |
|---|---|---|---|
| WAF | Block or challenge bad traffic | `firewall`, `rulesets` | Managed rules need tuning before launch |
| Rate limiting | Per-IP or per-token limits | `rulesets` | Edge limits do not replace app limits |
| Bot Management | Distinguish bots from users | `firewall` | Plan-dependent scoring |
| Turnstile | Protect forms and sign-up | `turnstile` | Verify server-side, never trust the widget alone |
| Access | Put admin and internal tools behind SSO | `access` | Policy per app, not per route by default |
| Gateway | Egress policy, DNS and HTTP filtering | `zero-trust` | Device posture needs clients |
| Tunnel | Expose a private service without a public IP | `zero-trust` | Run `cloudflared`, not a Worker |
| DLP | Prevent sensitive data leaving | `zero-trust` | Plan and configuration heavy |
| Custom Hostnames | Customer domains for your SaaS | `custom-hostnames` | Apex and validation rules |
| Security Center | Posture and misconfiguration review | `security-center` | Read-only insight |
| Intel | IP, domain, WHOIS reputation | `intel` | Enrichment, not enforcement |

Minimum for any public app with accounts: Turnstile on sign-up and contact
forms, rate limits on auth and expensive endpoints, Access on every internal
tool. Those three prevent most of the incidents that cost a weekend.

## Platform and multi-tenant

| Product | Use when | Namespace | Trap |
|---|---|---|---|
| Workers for Platforms | Customers deploy code | `workers-for-platforms` | Per-tenant isolation is your design |
| Cloudflare for SaaS | Customers bring their own domains | `custom-hostnames` | Apex and validation per plan |
| Organizations | Group accounts under one entity | `organizations` | Billing and members move with it |
| Resource Sharing | Share zones or accounts across orgs | `resource-sharing` | Access is granular and easy to over-grant |

## Observability and operations

| Product | Use when | Namespace | Trap |
|---|---|---|---|
| Workers Logs | Request logs and errors | `observability` | Retention is short, ship what matters |
| Logpush | Export logs to R2 or a provider | `logpush` | Destination and schema per job |
| Logs | Ray ID lookups, raw log access | `logs` | Account and zone scoping |
| AI Audit | Crawler and AI traffic insight | `ai-audit` | Reporting only |
| Rate limit analytics | Which limits fire and why | `rate-limit-analytics` | Zone-scoped |

`cf` cannot stream live logs. Use `npx wrangler tail <worker>` for that one
task, and Logpush for anything you need to keep.

## Account plumbing

| Product | Use when | Namespace |
|---|---|---|
| API tokens | Automation and CI | `accounts` |
| Members and roles | Team access | `accounts`, `organization` |
| Billing and usage | Cost review | `billing` |
| Subscriptions | Plan and add-on checks | `accounts` |
| Audit | Who changed what | `accounts` |

## Long tail

Smaller namespaces. Most projects never touch them; know they exist so you do
not rebuild them badly.

| Product | Use when | Namespace |
|---|---|---|
| Builds | Cloudflare builds Workers from a connected repo | `builds` |
| Previews | Per-branch Worker previews | `previews` |
| Snippets | Small code fragments injected at the edge, no Worker deploy | `snippets` |
| Addressing | Bring your own IP ranges | `addressing` |
| Custom CSRs | Certificates from your own CSR | `custom-csrs` |
| Custom nameservers | Vanity nameservers on your zone | `custom-nameservers` |
| Custom pages | Branded error and challenge pages | `custom-pages` |
| Cloudforce One | Threat intel platform for security teams | `cloudforce-one` |
| Managed Defense | Managed detection and response | `managed-defense` |
| Magic network monitoring | Flow-based network telemetry and alerts | `magic-network-monitoring` |
| MCP servers | Give agents a Cloudflare API surface | `mcp` |
| Agent Memory | Persisted memory service for agents | `agent-memory` |
| Pay per use | Metered billing for your own product | `pay-per-use` |
| Tenant | Tenant-level configuration | `tenant` |
| Account tags | Tag and filter accounts | `account-tags` |
| User profile | Your own account, tokens, invitations | `user` |

MCP is worth a look if you want an agent to manage Cloudflare directly: it is a
smaller surface than the whole CLI and scoped per task. It does not replace `cf`
for deploys.

## Void coverage

| Level | Meaning | Products |
|---|---|---|
| First-class | `void/*` module, inferred resources | D1, KV, R2, AI, Queues, Cron, DO, Email sending, Sandboxes, Live streams, SSE |
| Binding | Configure in `void.config.ts`, use `env` directly | Workflows, Vectorize, Images, Stream, Browser Rendering, Turnstile, Hyperdrive, Containers |
| Account only | Configure with `cf` or the dashboard, no app binding | DNS, Cache, WAF, Access, Logpush, Waiting Room, Registrar, Email Routing domains |

Anything in the third row is infrastructure, not application code. Set it up
once, document it in `AGENTS.md`, and keep the settings in the repo when the CLI
supports export.

## Adding a product

1. Name the requirement in the spec, not the product. "Users upload receipts",
   not "we need R2".
2. Pick the smallest product that satisfies it. Check the default kit first.
3. `cf cli search "<task>"` for the command family, then `cf schema <command>`
   for the exact request.
4. Build the smallest working call. Run it in dev and once against production.
5. Write down the limit that will bite first: quota, cold start, delivery
   semantic, size cap, or unit cost. If you cannot name one, you have not read
   enough.
6. Record the choice and the limit in `AGENTS.md`. A product nobody documented
   becomes a mystery bill.

## When not to use Cloudflare

- Long-running CPU work: Containers or another host, not a Worker.
- Heavy write throughput on records: Postgres outside D1, or a queue plus a
  batched writer.
- Authoritative relational work with heavy joins and reporting: a real Postgres
  beats D1.
- Anything the free plan cannot legally or practically serve: decide before
  launch, not after the invoice.
