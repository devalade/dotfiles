# The verification loop

Happy paths are what demos show. Error states, roles, and concurrency are what
customers hit. This file is the proof surface that runs from phase 0 to
production, and it is not optional.

Six moves, in order. Each one leaves an artifact in the repo.

| Move | Artifact | When |
|---|---|---|
| Interrogate the idea | `docs/spec.md` answers | before code |
| Model scenarios as state machines | `docs/scenarios.md` | before code, updated per flow |
| Adversarial pass | `docs/findings.md` | phase 5, again before ship |
| Before/after screenshots | `docs/shots/<feature>/` | every visual change |
| Variants of the UI piece | `/design` variant switcher | phase 2 and 3 |
| Quality loops | `docs/quality.log` | from first deploy onward |

## 1. Interrogate before building

Run `grill-me` against the spec until the questions run out. One question at a
time, with a recommended answer, and prefer reading the codebase over asking
the human. Then answer this floor in writing, in `docs/spec.md`:

- Who pays, and what do they do the first 60 seconds after signing up?
- What breaks if the network dies halfway through the flow?
- What happens if the same form is submitted twice, in two tabs, at once?
- Which two roles can both do this, and who wins the write?
- What does the error say when the email already exists? Quote it.
- What is the undo? If there is none, say why.
- What is the limit on the free plan, and what happens at the limit?
- What is the recovery path when the job that fails is a customer's data import?
- What is the rollback command?

Rule: an unanswered question becomes a written TODO in the spec, never a silent
assumption. Product and money calls go to the human. Anything measurable
(latency, payload size, whether an eval separates) gets measured instead of
asked.

Second interrogation after the build, before ship: "what would you bet is
broken?" Answer it with a probe, not with reassurance.

## 2. Scenario state machines, not a test list

A list of tests grows by accident. A state machine makes the missing case
visible before it becomes a bug report.

Write the matrix in `docs/scenarios.md` first, as a table:

| actor | precondition | action | expected state | expected UI | expected side effect |
|---|---|---|---|---|---|
| owner | signed in, 1 workspace | rename | renamed | header shows new name | `workspaces.name` updated, audit row |
| member | signed in, read only | rename | unchanged | disabled control | no write, no 403 page |
| stranger | signed in, other workspace | open URL | unchanged | 404, not 403 | no row fetched |
| anonymous | signed out | open URL | unchanged | redirect to sign in | none |

Encode it with `templates/scenarios.ts` (no dependencies, run with `tsx`). The
harness fails when a state has no covering transition, so coverage is enforced
mechanically instead of by memory.

Fixed floor per flow, every time:

- success
- validation error, field level
- server error (500) with a retry that works
- network failure midway
- signed out
- wrong role
- expired session mid-action
- duplicate submit, idempotent or blocked
- second tab concurrent write
- empty state and first-run state
- slow load, skeleton then content
- rate limited

Roles floor: owner, member, stranger, service or admin. Every route is checked
against all four and asserts either the action or a specific denial. A generic
403 page for a stranger is a data leak waiting to happen.

Assert the side effect, not only the pixels. Read the row back from D1, or the
webhook delivery log, or the audit table. A screen that lies is the expensive
failure.

## 3. Try to break it

Load `dogfood` and run an adversarial pass with a written scope. Per surface:

- Tamper with every query param and body field, including types and nulls.
- Change every id in a URL to another tenant's id. That is IDOR until proven
  otherwise.
- Replay a signed webhook, twice, out of order.
- Submit negative quantities, zero, 10k characters, emoji, and RTL text.
- Expire the session, then act. Expire the token, then replay it.
- Hit the rate limit and read the message.
- Kill the response after the write, then reload. Check for a duplicate.
- Set the clock forward on a cached page.

Each finding gets a repro, severity, evidence, and either a fix commit or a
guard that makes it impossible. "Won't happen" is only acceptable with a
guard. Findings live in `docs/findings.md`, with the fix linked. The pain it
would have caused goes to `docs/pain-ledger.md` when it is customer visible.

The adversarial pass is a subagent job. Give it the repo, the deployed URL, and
the scope, and require screenshots or curl transcripts as evidence. Verify the
evidence yourself, because a subagent's "confirmed" is a claim.

## 4. Before/after screenshots

Capture the before at the moment work starts. A screenshot taken only after the
change proves that something renders, not that anything improved.

- Deterministic capture: fixed viewport (1280x900 desktop, 390x844 mobile),
  seeded data, animations off, fonts and images awaited, dark and light both.
- Naming: `docs/shots/<feature>/<step>-{before,after}.png`.
- Pair the shots with the state label (`empty`, `error`, `loading`) and the
  scenario row id they belong to.
- Use `templates/shot.mjs`: `node scripts/shot.mjs <route> <label> <before|after>`.
- In a review, show the pair and one sentence on what changed. A shot with no
  label and no pair is decoration.

The `/design` gallery is the second screenshot surface: every primitive in
default, hover, focus, active, disabled, loading, error, empty, success, and
dark before the primitive is called done.

## 5. Variants you can try

Ship two or three variants of the piece under review, not one opinion and an
argument.

- Live behind a variant switcher on `/design`, or a `?variant=b` flag on the
  route. Never three branches, never three PRs.
- Same tokens. Variation is layout, density, hierarchy, and copy. If a variant
  needs a new token or a new primitive, it is a different component, and that is
  a design decision, not a variant.
- Pick by using them on real data, at real density, in both themes. Then delete
  the losers in the same PR. A switcher that outlives the decision is debt, and
  shipped variant flags leak into support tickets.

`prototype` and `principle-exhaust-the-design-space` cover the exploration.
`arena` is the code bakeoff equivalent when the question is architecture, not
looks.

## 6. Quality loops

Three loops, three cadences. A loop counts as a quality bar only when it has a
threshold and a named owner of the failure. Otherwise it is a dashboard.

| Loop | Cadence | Runs | Fails when |
|---|---|---|---|
| Fast | pre-commit, on save | lint, typecheck, unit, scenario harness | anything non-zero |
| Smoke | every deploy, after `cf deploy` | matrix happy plus one error and one role row per route, screenshots | any red row |
| Watch | nightly and weekly | full matrix, link crawl, log error rate, a11y, dependency drift | regression against the recorded baseline |

Budgets, written in `AGENTS.md` so they are reviewable:

- `pnpm lint` and `pnpm typecheck` at zero, forever.
- Smoke under 90 seconds, or it stops being run.
- LCP under 2.5s at p75, error rate under 0.5% of requests.
- No scenario row regresses from green to red between runs.

`templates/quality.sh` appends one JSON line per run to `docs/quality.log` and
exits non-zero on a drop against the last green baseline, so a regression fails
a loop instead of waiting for a customer. Trend needs a baseline: the first run
records one, later runs compare.

Alerting: the loop must report somewhere the human actually reads. Local cron or
launchd writing to a file nobody opens is not monitoring. Nightly results go to
the same place the work lives, with the failing row id in the subject.

## Anti-patterns

- A happy-path demo offered as proof.
- Screenshots after only, or on a seeded page that hides the empty state.
- A test list with no matrix, so role and failure cases are whatever came to
  mind that day.
- Passing tests that assert the UI copy instead of the data.
- A monitor with no threshold, no baseline, and no owner.
- Variants left in production because choosing felt harder than shipping.
- An adversarial pass that closes findings as "unlikely" with no guard.
