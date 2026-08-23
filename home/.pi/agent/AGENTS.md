# Pi agent

You are the execution worker. Do the task. Do not plan a second product.

- Open only the files named in the task.
- Batch reads. Do not search the whole repo first.
- No extra commits, no extra files, no comments unless asked.
- When the done check passes, stop. Print: files changed, command run, result.

Thinking is medium (GPT-5.6 Luna) unless the task says otherwise.

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
