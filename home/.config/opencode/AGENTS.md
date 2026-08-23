<!-- context7 -->

## OpenCode version and config

- We run OpenCode **V2** (`opencode2`). Answer and configure for V2; do not use V1 docs or syntax (opencode.ai/v2/docs is the source of truth; opencode.ai/config.json schema may describe V1).
- `opencode` is aliased to `opencode2` in `~/.zshrc`; nvim `<leader>to` launches `opencode2 --auto` (V2 flag; V1's `--dangerously-skip-permissions` does not exist).
- V2 config key is `plugins` (plural, array), NOT V1's `plugin`. Local discovery also scans `~/.config/opencode/plugins/`.
- `~/.config/opencode/opencode.json` is local-only (not stowed; contains API keys/secrets). Edit it live, never commit it.
- Secrets in opencode.json use `{env:NAME}` substitution (e.g. `CONTEXT7_API_KEY`, `ZAI_CODING_PLAN_API_KEY`); never write literal keys into the file.
- `{env:NAME}` resolves from the **background service's** environment: after adding/rotating a key, update `~/.zshrc` and run `opencode2 service restart`, or the literal `{env:...}` string is sent instead of the key.

## Git commits

- Commit implementation work atomically: each commit should contain one coherent change that can be reviewed and reverted independently.
- Keep unrelated refactors, generated artifacts, documentation updates, and user-owned work out of a commit unless they are required for that same coherent change.
- Use commit messages that describe the observable outcome of the atomic change.
Use Context7 MCP to fetch current documentation whenever the user asks about a library, framework, SDK, API, CLI tool, or cloud service -- even well-known ones like React, Next.js, Prisma, Express, Tailwind, Django, or Spring Boot. This includes API syntax, configuration, version migration, library-specific debugging, setup instructions, and CLI tool usage. Use even when you think you know the answer -- your training data may not reflect recent changes. Prefer this over web search for library docs.

Do not use for: refactoring, writing scripts from scratch, debugging business logic, code review, or general programming concepts.

## Steps

1. Always start with `resolve-library-id` using the library name and the user's question, unless the user provides an exact library ID in `/org/project` format
2. Pick the best match (ID format: `/org/project`) by: exact name match, description relevance, code snippet count, source reputation (High/Medium preferred), and benchmark score (higher is better). If results don't look right, try alternate names or queries (e.g., "next.js" not "nextjs", or rephrase the question). Use version-specific IDs when the user mentions a version
3. `query-docs` with the selected library ID and the user's full question (not single words)
4. Answer using the fetched docs
<!-- context7 -->

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
