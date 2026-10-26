# Operating loop (poteto pack)

The build doctrine delegates style and rigor to the installed poteto skill pack
in `~/.agents/skills/`. Load the leaf skill when its trigger fires; do not
paraphrase it from memory.

## Base mode

`poteto-mode` is the default for every non-trivial task. It enforces a
todolist first, named principles behind decisions, deliberate subagents,
unslopped prose, simple code, and verified work. Casual one-line exchanges are
exempt.

## Phase routing

| Phase | Load | Use it for |
|---|---|---|
| 0 Spec | `to-prd`, `tech-spec`, `product-thinking`, `understand-customers` | Job, flow, data shape, pain audit |
| 1 Tokens | `prototype`, `principle-exhaust-the-design-space` | Two or three visual directions compared before committing |
| 2 Primitives | `pick-ui-library`, `control-ui`, `high-end-visual-design`, `design-taste-frontend` | Component shape, states, density |
| 3 Patterns | `architect`, `implement`, `code-like-alade` | Composition, interfaces, ownership |
| 4 Data | `domain-modeling`, `typescript-best-practices`, `principle-model-the-domain` | Types, schema, invariants |
| 5 Flows | `implement`, `tdd`, `unslop` | Wiring, copy, empty states |
| 6 Ship | `review-and-ship`, `principle-prove-it-works`, `verify-this`, `run-smoke-tests`, `dogfood` | Proof, regressions, outside-in check |
| Any Cloudflare work | `cloudflare`, `workers-best-practices`, `durable-objects`, `wrangler` | Product choice, rules, gotchas |

Hard gates that come from the pack:

- `principle-prove-it-works` before declaring anything done.
- `principle-fix-root-causes` before patching a symptom.
- `principle-laziness-protocol` before adding an abstraction, layer, or prop.
- `principle-subtract-before-you-add` before a refactor.
- `technical-writing` for READMEs, RFCs, PR bodies, commit messages.
- `deslop` and `unslop` before commit and on any prose surface.

## Subagent policy

Use subagents for:

- Exploration of an unfamiliar subsystem (`how`, `zoom-out`).
- Independent verification of a claim (`verify-this`, `dogfood`).
- Parallel, bounded, non-overlapping work with one owner per file.
- Adversarial review of a design (`interrogate`) or a code bakeoff (`arena`).

Never delegate:

- Taste calls, naming, product scope, or anything the user must decide.
- Work that needs a running browser session and a human eye, unless the subagent
  can attach evidence.
- A task whose output you cannot verify from its summary.

Each delegation names the deliverable, the acceptance check, and the files it
owns. A subagent claiming success is a claim; verify the artifact.

## Decision discipline

- If a question can be answered by running something (timing, layout, output,
  whether an eval separates), run it instead of asking. Bring back a result,
  not a decision.
- Ask the human only for product calls, preference, money, or destructive
  actions.
- When you change your mind, say which evidence changed it.

## Proof discipline

Every "done" carries one of:

- a command and its output,
- a URL and its status,
- a screenshot,
- a failing-then-passing test.

For this stack specifically: `pnpm lint`, `pnpm typecheck`, a real
request against the deployed URL, and one log read after that request.

## Reply style

Short. Yes/no first, then detail. Lists over prose. No em dashes. One idea per
line in the terminal. Name the file and line when discussing code. No process
narration, no filler, no restating the request.

## Repo hygiene

- `AGENTS.md` at the root: stack, deploy owner, commands, design rules, and the
  lint instruction.
- `docs/spec.md`, `docs/pain-ledger.md`, `docs/design-system.md`, `docs/build.md`.
- A decision log only when stakes justify it; link it from `AGENTS.md`.
- Commit the lock files that make a deploy reproducible (`void.lock.json`);
  ignore generated Cloudflare config.
