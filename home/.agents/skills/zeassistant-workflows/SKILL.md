---
name: zeassistant-workflows
description: Workflows and dispatch contracts for the zeassistant repo (AdonisJS 7 + Inertia React + WhatsApp/Genuka). Use when working in /Users/macuser/Works/personal/zeassistant — focused test commands, read-only dispatch rules, secrets discipline, run-once side effects, resume-after-interruption.
---

# zeassistant workflows

Learned from session traces of this repo (2026-07-24 → 2026-08-18, 86 sessions).
None of this is documented in AGENTS.md or .flow/docs — it lives only in the user's repeated behaviors.

## Focused verification loop

- After touching files, run the narrowest checks first: `npm run typecheck` (or `npx tsc --noEmit`), `npm run lint`, then `node ace test --files=<pattern>`.
- `--files=` takes a test name substring or a specific path (e.g. `--files="genuka_template_service"`, `--files='tests/unit/services/escalation/service.spec.ts'`). Never run the full suite unless asked.

## Read-only dispatch contract

- When a prompt opens with "READ-ONLY, NO SUBAGENTS, NO FILE CHANGES" (any variant): direct inspection only, answer with **exact excerpts** — never summaries. No edits, no subagents, no file changes of any kind.
- "READ-ONLY TECHNICAL PLANNING" = inspect and plan only; still zero changes.

## Secrets discipline

- Never read, grep, cat, print, or inspect `.env` files, process environment values, API keys, tokens, or credentials — especially in WhatsApp/Genuka work.
- Use existing config modules at runtime; never log credentials.

## Side-effect commands run exactly once

- `node ace whatsapp:test-message <number> <text>` and template creation run **exactly once** — no retries, no surrounding edits.
- Report exit code + message id or the exact error.
- Template flow: PENDING → stop; APPROVED → send once; already exists → report status.

## Resume-after-interruption

- When resuming an interrupted build-agent run: read the current filesystem state + existing `.flow/changes/*` artifacts first, then continue the started implementation — never re-plan or restart.
- If the user mentions fallback-model authorization ("GPT Lune", "user authorizes GPT"), acknowledge it and proceed.
