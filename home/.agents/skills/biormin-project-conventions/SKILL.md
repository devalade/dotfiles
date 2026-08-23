---
name: biormin-project-conventions
description: Frontend and dispatch conventions for the biormin repo (ex-tickets, AdonisJS + TanStack Start event ticketing app). Use when implementing, reviewing, or researching work in /Users/macuser/Works/personal/biormin, or when the user dispatches subagent work for it.
---

# Biormin (ex-tickets) project conventions

Project root `/Users/macuser/Works/personal/biormin` — formerly `/Users/macuser/Works/personal/tickets`. AdonisJS backend in `apps/backend/`, TanStack Start frontend in `apps/frontend/`. Root `AGENTS.md` describes the product; read it and the `.flow/docs` harness docs before framework work.

## Frontend conventions (user re-specifies these in every dispatch — follow them without being told)

- Use `Show` and `Match` for conditionals — **no ternary or `&&` in JSX**. `Match` (with `Match.Case` / `Match.Default`) lives in `#/components/ui/match.tsx`.
- `snake_case` for files, `camelCase` for methods, `PascalCase` for classes/components.
- 2-space indentation; named imports for utilities.
- Use existing UI components from `#/components/ui/` (shadcn-style primitives) rather than building new ones.
- Use `t()` from `#/i18n` (Paraglide) for **all** user-facing text. Messages live in `apps/frontend/messages/{en,fr}.json`; the app is bilingual with a manual switcher.
- Utility functions go in separate files under `apps/frontend/src/lib/`, not in the same file as classes/components.

## Dispatch workflow (observed pattern)

The user dispatches work as `@general` subagents with a strict template: "You are implementing Issue/Workstream #X … Follow the AGENTS.md conventions strictly: [block above] … Make ALL these changes:" followed by a file-by-file spec with exact file paths and code. When dispatched this way:

- Implement **all** listed changes — do not pick a subset or ask which ones.
- Create each named file at exactly the path given (e.g. `apps/backend/database/migrations/<ts>_*.ts` with `BaseSchema` from `@adonisjs/lucid/schema`).
- Backend work follows the project's own `.flow` / `flow-*` skill discipline: read the relevant harness doc under `apps/backend/.flow/docs/` before writing framework code.

## Verify commands

- `pnpm` (not npm/yarn) from repo root; app scripts run inside `apps/backend` / `apps/frontend`.
- Frontend tests: `pnpm --filter frontend test` (Vitest). Typecheck via the frontend package script.
- Backend tests: Japa (`node ace test`) per the harness `testing.md`.
