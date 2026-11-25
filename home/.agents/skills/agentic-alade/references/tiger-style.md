# Tiger Style (mandatory)

Source: `https://github.com/tigerbeetle/tigerbeetle/blob/main/docs/TIGER_STYLE.md`.
This is law, not inspiration. Three goals in order: safety, performance,
developer experience. Every rule carries its why, because a rule with a why
lets an agent generalize it to cases the rule did not name; a bare rule only
covers its exact wording.

## TypeScript, React, Workers (this stack)

### Code rules

1. **Assert both sides of the boundary.** Every handler parses valid input AND
   rejects invalid input with a typed error. Why: where data crosses the
   valid/invalid boundary is where the interesting bugs live. Enforcement:
   the scenarios harness fails any boundary row that lacks a rejected-input
   twin.
2. **Put a limit on everything.** Every loop terminates, every list is
   cursor-bounded, every fetch passes `{ signal, timeout }`, every queue
   consumer sets `maxRetries`, every batch is capped. Why: on Workers,
   unbounded work is a billing event, and a tail-latency spike is a customer
   pain.
3. **Paired checks on critical invariants.** Money and session state are
   checked before the write and re-checked when read back. Why: screens lie;
   the invariant does not. Same spirit as asserting before and after disk I/O.
4. **Positive-space conditions.** Write `if (index < count)`, never
   `if (!(index >= count))`. Split compound `a && b && c` branches into nested
   ifs. Why: the reader must verify every case is handled at a glance.
5. **70-line functions, push ifs up and fors down.** One function owns control
   flow; helpers are branchless and pure. Why: there is a sharp discontinuity
   between a function that fits on a screen and one that does not; art is born
   of the constraint.
6. **No recursion in application code.** Explicit iteration, bounded depth.
   Why: recursion is how elegant unbounded code gets written.
7. **Explicit options at every call site.** Never trust library defaults:
   pass `timeout`, `signal`, and retry options visibly. Why: a dependency
   changing its default silently changes your behavior.
8. **Comments say why, in prose.** Capital, full stop, the reason attached.
   No narration of what the code already says. Why: comments are how criteria
   are shared with the next reader, human or agent.
9. **Naming: units and qualifiers last, nouns over participles, no
   abbreviations.** `amountMinor`, `retryCountMax`, `PostCount` not
   `PostCounter`. Related names take equal length so columns align. Why: the
   name is the mental model; alignment makes code checkable by eye.

### Design rules

10. **Back-of-envelope sketch before code.** Phase 0 records rows scanned,
    subrequests, bytes moved, and KV ops per feature. Why: performance is
    cheapest to design, and on Cloudflare it is a cost line, not an
    abstraction.
11. **Batch and run at your own pace.** External events enqueue; workers
    process in batches; no fire-and-forget in a handler. Why: keeping the
    control flow of the program in your own hands is both safety and
    performance.
12. **Zero technical debt.** A found showstopper is fixed before merge, not
    ticketed. The pain ledger records what absorbing it cost. Why: the second
    time may not transpire.
13. **Zero runtime deps beyond the floor.** React, TanStack, Hono, zod,
    Better Auth, Drizzle, Base UI plus the UI SDK lane, and nothing else:
    hand-rolled `cn`, no icon, date, form, animation, or state package. Why:
    dependencies are supply-chain risk and slow installs; foundational
    dependencies amplify their cost through the whole stack.

### Lint hook

Add the function-length cap as a project rule on top of the preset, never
replacing it:

```ts
// oxlint.config.ts: spread ...cloudflare.rules first, then add
'max-lines-per-function': ['error', { max: 70, skipBlankLines: true, skipComments: true }],
```

If the installed Oxlint version does not support the rule, keep the cap in
review, note it in `AGENTS.md`, and probe again after each Oxlint upgrade.

### Scenarios hook

The harness gains one rule: **a boundary with no rejected-input twin fails.**
Every covered handler row carries a passing rejection case with a typed
error, or the report is red.

## Systems work (a language, interpreter, VM, or protocol)

When the work drops below the web stack (compilers, runtimes, storage
engines, wire protocols), the original document applies verbatim. Read it in
full before the first commit. The additions that only exist there:

- **Static allocation.** All memory is allocated at startup; nothing is
  dynamically allocated or freed after initialization. Why: predictable
  behavior, no use-after-free, and simpler designs as a second-order effect.
- **Explicitly sized integers.** `u32` over architecture-specific `usize` for
  everything that crosses a boundary.
- **Explicit control flow.** No recursion; assert the bound when a loop cannot
  terminate (an event loop). Centralize control flow in the parent function.
- **Compile-time assertions.** Assert relationships of constants and type
  sizes so design integrity is checked before the program runs.
- **100-column hard limit.** Two copies of the code fit side by side on a
  screen.
- **One toolbox.** Scripts in the language itself, not bash. Why: the right
  tool is the one already in hand; adding tools costs more than they look.

## Checklist

- [ ] No function over 70 lines (lint cap green)
- [ ] Every boundary rejects invalid input with a typed error (scenarios row)
- [ ] Every loop, list, queue, and fetch bounded
- [ ] Every non-obvious decision carries a why comment
- [ ] Every call site passes its options explicitly
- [ ] Naming: units last, nouns, no abbreviations
- [ ] Runtime deps match the floor; nothing new without a written reason
