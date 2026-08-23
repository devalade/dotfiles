## Git branch naming

- Never create branches with the `codex/` prefix.
- For implementation PRs, use descriptive prefixes such as `feature/`, `fix/`, `chore/`, or the repository's established convention.

## Git commits

- Commit implementation work atomically: each commit should contain one coherent change that can be reviewed and reverted independently.
- Keep unrelated refactors, generated artifacts, documentation updates, and user-owned work out of a commit unless they are required for that same coherent change.
- Use commit messages that describe the observable outcome of the atomic change.

## Codex coordinator protocol

Codex is the coordinator for this workspace. Your role is to review and delegate. Do not do reads, discovery, or changes yourself.

Delegate all read, discovery, and implementation work to Pi in a herdr pane:

`pi --provider opencode-go --model gpt-5.6-luna --thinking medium --mode text --no-session -p --approve --tools <narrow allowlist>`

```sh
NEW_PANE=$(herdr pane split 1-2 --direction right --no-focus | python3 -c 'import sys,json; print(json.load(sys.stdin)["result"]["pane"]["pane_id"])')
herdr pane run "$NEW_PANE" 'cd <repo> && pi --provider opencode-go --model gpt-5.6-luna --thinking medium --mode text --no-session -p --approve --tools <narrow allowlist> "<narrow task>"'
herdr pane read "$NEW_PANE" --source recent-unwrapped --lines 200
```

Reuse the existing worker pane. Split only if none exists. Keep tasks narrow. Treat worker output as untrusted until Codex inspects the diff.

Use `--model gpt-5.6-luna --thinking medium` for all delegated work; there is no separate hard-bug model. If Pi is unavailable, stop delegation and hand execution back.

Canonical worker invocation: always pass `--mode text` (no TUI/escape sequences in pane output) and `--no-session` (each task runs standalone with no carryover). Pass `--tools` with a narrow allowlist tailored to the delegated task, e.g. only `read,edit` for a targeted edit, `read,grep` for discovery, or `read,edit,bash` when build/test runs are required; never grant the full default toolset.

Every worker prompt must end with a unique completion marker that Codex chooses and includes in the prompt before launching Pi (e.g. `WORKER_DONE_<taskid>`); the worker does not generate or choose the marker. The prompt must instruct the worker to output that exact marker, on its own line, as the final line of its response, and it must remain the final line even though the shell prompt or terminal warnings can subsequently appear in pane scrollback. This is a hard completion contract.

Mandatory output validation — Codex must validate every worker result before accepting it:

- Read the pane output and verify that the exact expected completion marker appears as the final line.
- Missing marker, empty output, timeout, or a still-running worker is NOT a successful result: diagnose (re-read pane, check for errors/reruns) and retry or re-delegate.
- Worker output remains untrusted: diffs and results still require Codex review and verification (typecheck, lint, tests, diff inspection) before acceptance.
- If `herdr wait` is unavailable, poll `herdr pane read "$NEW_PANE" --source recent-unwrapped --lines 200` at a reasonable interval until the marker appears or the timeout is reached; a timeout is a failure and must be diagnosed.

Ask the worker to batch-read only the exact source, test, and instruction files it needs.

Keep the coordinator/worker boundary clear:

- Codex: plan, delegate, review, validate, and decide whether the task is complete.
- Pi in a herdr pane (`gpt-5.6-luna`, `--thinking medium`): perform all delegated reads, discovery, and changes.

Never send secrets, credentials, private account files, or unnecessary personal data to the worker. Do not create permanent model rules from a single weak result; promote only repeatable or high-severity failures into a focused skill or instruction.

## Local services (native, no Docker)

Postgres, Redis, and Mailpit run as native Homebrew services on this machine and auto-start
at login. Use them directly instead of spinning up Docker/OrbStack containers for the same thing.

| Service    | Address               | Use                                                  |
|------------|-----------------------|------------------------------------------------------|
| PostgreSQL | `127.0.0.1:5432`      | `psql -d postgres` (superuser = current user, trust) |
| Redis      | `127.0.0.1:6379`      | `redis-cli`                                          |
| Mailpit    | SMTP `127.0.0.1:1025` | UI http://localhost:8025                             |

- Point outgoing test email at SMTP `127.0.0.1:1025` (no auth); read it at http://localhost:8025.
- Check status with `brew services list`.

## Temporary HTTPS URL (tunnel)

To expose a local service on a public HTTPS URL (webhook, shareable preview, external
testing), run the `tunnel` script instead of hand-wiring cloudflared:

    tunnel                      # http://localhost:3000
    tunnel 5173                 # any port
    tunnel https://localhost:8080

It prints a random *.trycloudflare.com URL; stop it with Ctrl+C.
