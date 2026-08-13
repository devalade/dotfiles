---
name: dependency-migration
description: Discipline for major-version dependency upgrades, ERESOLVE/peer conflicts, and latest-version checks.
---

# Dependency migration

For major-version upgrades of a framework or a package that other packages depend on.
Minor and patch bumps do not need this.

The failure mode this prevents: treating "upgrade package X" as one decision, when it is
actually a constraint-satisfaction problem across a graph you have not looked at yet.

## Phase 1 — Map the graph before promising anything

Never answer "can we upgrade X" from the changelog. Answer it from the peer graph.

```sh
npm view <pkg> version                    # latest
npm view <pkg>@<target> peerDependencies  # what the target demands
npm view <pkg>@<current> peerDependencies # what pins you TODAY
```

**Read the current version's peers too.** That is what is holding you back, and it is the
half people skip. A package pinning `vite: ^7` is why you cannot "just bump vite".

Walk the graph transitively until it closes. For each required companion, ask the same two
questions. Write the chain down as a table: package, installed, target, and *which peer
forces it*.

### Two things to look for specifically

**Majors that drop out.** Before assuming a companion must move, check whether the version
you already have supports the new range. Packages often widen peer ranges ahead of time:

```sh
npm view <companion>@<installed-version> peerDependencies
```

Finding one of these removes a major from the plan and is worth the thirty seconds.

**Whether the set is stageable or atomic.** If A@new needs B@new, and B@old pins A@old, the
set is a closed cycle — it moves together or not at all. Say so explicitly. A staged plan
that cannot actually be staged is worse than no plan, because it will be discovered
halfway through.

## Phase 2 — Verify against the shipped artifact, not the release notes

Changelogs are written by humans and omit things. The tarball cannot.

```sh
mkdir -p /tmp/pkgcheck && cd /tmp/pkgcheck
npm pack <pkg>@<target> && tar -xzf *.tgz

node -e "console.log(JSON.stringify(require('./package/package.json').exports,null,2))"
```

Check, in order of how often they silently break things:

- **`exports` map** — an entry you import that no longer exists is an instant hard failure.
- **`.d.ts` for the APIs you call** — signatures, renamed option keys, narrowed types.
- **`peerDependenciesMeta`** — which peers are optional. Prevents "will npm try to install
  Vue?" panic.
- **stubs / templates** — how the package now scaffolds itself is how it expects to be used.

Renamed option keys are the classic silent break and are almost never in release notes.
Diff the options interface against what your config actually passes.

## Phase 3 — Grep your own code for every breaking change

A breaking change that touches nothing you wrote is not your problem. Establish that per
item rather than carrying the whole changelog as anxiety.

For each change, produce a verdict and a location:

| Verdict | Meaning |
|---|---|
| **BREAKS** | Found in our code at `file:line`. Must fix. |
| **VERIFY** | Might apply; could not settle from source. Must test. |
| **SAFE** | Grepped, genuinely absent. |

Report SAFE items too — knowing a scary-sounding change does not apply is a result, and it
is what keeps the plan honest.

Be precise about *which form* of an API broke. "Arrow functions in `.layout` broke" and
"assigning an arrow-function component to `.layout` broke" are different claims, and only
one of them may touch you. Read the actual upgrade note, not the summary of it.

## Phase 4 — Upgrade atomically

Work on a branch, separate from feature work. If the repo has uncommitted feature work,
commit it on its own branch first and branch the migration off that, so the migration stays
a reviewable diff and a revert stays cheap.

**When peers interlock, npm's incremental resolver fails.** `npm install a@new b@new` can
ERESOLVE because it solves against the tree already on disk. Do not reach for
`--force` or `--legacy-peer-deps` — that accepts a resolution you know is wrong. Instead
give it the whole problem at once:

```sh
# edit package.json to the target versions, then
rm -rf node_modules package-lock.json && npm install
```

Confirm the result rather than assuming it:

```sh
npm ls <pkg-a> <pkg-b> <pkg-c>   # expect "deduped", no unmet peers
```

## Phase 5 — Treat new type errors as findings

Stricter types in the new version will surface defects that predate the upgrade. These are
not migration noise; they are the upgrade paying for itself.

When a new error points at your own sloppiness — an unvalidated request body, an `any` that
was hiding a real shape — fix the underlying problem rather than casting it away. Flag it
separately in the report, because fixing it is a **behaviour change** the user did not ask
for and must know about.

Reserve casts for genuine upstream typing gaps, and comment them with *why* the type is
wrong, so the next reader does not "clean up" a load-bearing cast.

## Phase 6 — Verify at the layer that actually moved

Match verification to what changed. Typecheck alone is not evidence for a build-pipeline
upgrade.

- Dependency/type changes → `typecheck` + `lint`
- **Build tooling changed** → run the real **production build**, and confirm expected
  artifacts are emitted (server bundles, manifests). A dev server that boots proves nothing
  about the bundler.
- Runtime/client library changed → drive a **real browser**. Assert on rendered content and
  on `console.error` / `pageerror`, not just HTTP 200. A page that returns 200 and renders
  an empty div is the exact failure a curl-based check misses.
- Router/navigation changed → exercise **client-side navigation**, not just hard loads.

## Phase 7 — Record what the generated docs will not tell you

If the project has generated agent docs, a harness, or vendored guidance, re-run its
generator and then **read the diff** — do not assume it worked.

Generators commonly read versions from `package.json` while shipping guidance written for
the previous major. The result claims the new version and describes the old one, which is
worse than being absent, because it reads as authoritative.

When that happens, write the deltas yourself, and place them **outside** any generated
markers so regeneration does not eat them. Then prove it by re-running the generator and
confirming your section survived.

Keep generator inputs scoped to what is actually installed. Passing a wildcard
(`--package="*"` and friends) pulls in guidance for packages the project does not use, and
now the agent has instructions for a mail library you never installed.

## Reporting

Lead with what it costs, not what it enables. Specifically:

- the chain, and which peer forces each link
- what breaks in *our* code, with `file:line`
- anything you predicted that turned out wrong — say so plainly
- behaviour changes the user did not ask for
- what you verified, and **what you could not** (auth-gated screens, paid APIs, prod-only
  paths). Never let "typecheck passed" imply the app was exercised.
