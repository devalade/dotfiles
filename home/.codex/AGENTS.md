## Git branch naming

- Never create branches with the `codex/` prefix.
- For implementation PRs, use descriptive prefixes such as `feature/`, `fix/`, `chore/`, or the repository's established convention.

## Git commits

- Commit implementation work atomically: each commit should contain one coherent change that can be reviewed and reverted independently.
- Keep unrelated refactors, generated artifacts, documentation updates, and user-owned work out of a commit unless they are required for that same coherent change.
- Use commit messages that describe the observable outcome of the atomic change.

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

## Pain before features (all posts and videos)

- Every feature post, launch post, caption, video script and film starts from the pain, not the features. Read the
  `pain-first-pitch` skill (`~/.agents/skills/pain-first-pitch/SKILL.md`) before writing one.
- Before any feature is named, say who it is for (organization type, size, role), which workflow hurts today, what kind
  of tool it is (support, dev team or whole company), what it replaces and what it is not for.
- Films: the hook shows that pain in the viewer's own world, and "pain clarity" (after 5 s, can a stranger say who it is
  for and what hurts?) is a review score that must reach 8+.
- Origin: a viewer asked about the Kora launch video, "You explain features while we still don't know what pain your tool
  is clearly solving for who?"
