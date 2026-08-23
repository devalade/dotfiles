---
name: qualiextra
description: Work in the Qualiextra workspace (NestJS V2-API + quali-front React + mobile apps). Load the AGENTS.md chain first; follow the repository/DI pattern, hotel/user decoupling, Show/Match JSX, and the exact yarn test/build commands.
---

# Qualiextra workspace

Workspace root `/Users/macuser/Works/orgs/qualiextra` — NestJS API in `V2-API/`, React frontend `quali-front/`, native apps `mobile-admin`, `mobile-enterprise`, `mobile-extra`.

## First: read the authoritative docs

The agent has repeatedly violated rules that are already written down. Before touching code, read, in order:

1. `qualiextra/AGENTS.md` — workspace root: task workflow, clean-code expectations, UI copy, form/email conventions
2. `qualiextra/V2-API/AGENTS.md` — build/test commands, NestJS layout, Orval, local ports, hotel/user decoupling
3. `qualiextra/V2-API/CONTEXT.md` — domain vocabulary
4. `qualiextra/V2-API/nestjs/AGENTS.md` — detailed NestJS patterns

Do not rely on memory. The user has repeatedly corrected the repository pattern and hotel/user decoupling violations below.

## Architecture boundaries (non-negotiable)

- `V2-API/nestjs/` is the ONLY active API. `V2-API/src/` is legacy TSOA — do NOT modify it or add feature work there.
- NestJS modules: `nestjs/modules/<feature>/` with `<feature>.{module,controller,service,repository,types}.ts`, `dto/`, optional `notifications/`.

## Repository pattern — repeatedly corrected

- Services and notifications NEVER call `PrismaService` directly. Inject and use the module's `<feature>.repository.ts`.
- A service that injects both `PrismaService` and a repository but calls Prisma directly is a bug — route it through the repository.
- Corrections observed: "Plz, don't replace with direct prisma call"; "Inject the hotel repository plz".
- Notification classes extend `NotificationBase`.

## Hotel / User decoupling — recurring bug source

- `Hotels.id ≠ Users.id`. Never assume `hotelId === userId`.
- Resolve the owner via `hotels.userId`; SQL joins use `Hotels."userId" = Users.id`.
- Enterprise employees resolve their hotel via `req.user.hotelId`.

## Test / build / lint

Yarn v1 (not npm/pnpm), Node 20.

```sh
cd V2-API
yarn nestjs:test              # unit tests (vitest)
yarn nestjs:test:integration  # integration + smoke (resets isolated _test DB)
yarn vitest run --config vitest.integration.config.ts   # direct integration runner (frequently used)
yarn nestjs:dev               # NestJS watch mode (port 4000, NESTJS_PORT)
yarn generate                 # prisma generate
yarn lint:check               # eslint check only
yarn format:check             # prettier check
```

- `nestjs:test:integration` = `integration:db:reset` then `vitest run --config vitest.integration.config.ts`.
- Integration tests: API-first assertions + shared factories under `nestjs/shared/__integration__/factories/`; never bind real HTTP ports.

## Contract changes → regenerate clients

Any HTTP contract change: update NestJS DTOs + Swagger decorators, then `yarn nestjs:generate-client` (Swagger v2 + Orval). Clients must use the generated functions/DTOs — a generated `Promise<void>` means a DTO is missing Swagger decorators; fix the backend, never hand-write client types or bespoke Axios/fetch calls.

## JSX conditionals

Use the project's `Show` (boolean/fallback) and `Match` (mutually exclusive branches) utilities. No inline ternaries or `&&` in JSX.

## Make surgical changes — repeatedly corrected

- Fix the existing controller/route; do NOT create a new service/controller file when a targeted edit suffices.
- Do not replace a repository or flow wholesale; change the smallest piece that fixes the behavior.
- Corrections observed: "Why do you want to create mission.service.ts, just fix the existing controller"; "I don't want to replace. Just fix the route...".

## Commit & PR workflow

- The user triggers commits with a bare "commit" (often "commit and push", sometimes in French). Commit atomically, push, and open the PR.
- Backend PRs target `main` from `development` (no `dev` branch), using the project PR template.
- Keep each commit to one coherent, revertable change.
