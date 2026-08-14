---
name: code-smell
description: Hunt code smells (stinky code) — god objects, magic numbers, feature envy, switch abuse, primitive obsession, null handling, getter/setter abuse, dead code, and 270+ more cataloged smells. Use when the user asks to find stinky/bad-smelling code, audit a codebase for code smells, refactor toward cleaner code, or review code for maintainability issues.
---

# Code Smell

Smells are **hints**, not verdicts. A smell means something *might* be wrong here — verify it against the code before reporting it. The catalog is the compiled Code Smells series (Maximiliano Contieri) covering 280 smells across ~30 languages.

## 1. Load the catalog

Read `catalog/INDEX.md` — one line per smell (`NNN Name — essence`). For any smell you plan to report, open `catalog/NNN_*.md` for the full entry: problems, solutions, wrong/right sample code, and detection method. Never report from the index line alone.

Completion criterion: for every smell you report, you have read its full catalog entry.

## 2. Hunt by symptom

Work through the code with these high-signal mappings, then the full index:

| Symptom in the code | Smell numbers to check |
|---|---|
| class does too much, too many methods/attributes | 14, 147, 34, 154, 200 |
| method/function too long | 03, 119, 236 |
| magic numbers / literals / unexplained constants | 02, 44, 71, 133, 160, 186, 194, 202, 249, 262 |
| too many arguments, args doing double duty | 10, 87, 172, 214, 220, 270 |
| switch / if-else chains on a type or value | 36, 110, 193, 221 |
| booleans as flags, params, or comparisons | 07, 24, 62, 101, 115, 118, 199, 212, 270 |
| getters/setters everywhere, mutable access | 28, 68, 109, 146, 256 |
| null checks, null-as-flag, null defaults | 12, 126, 131, 208, 252, 260 |
| string parsing, validation, concatenation | 04, 121, 122, 218, 243 |
| duplicated code, copy-paste | 46, 231, 248 |
| dead code, unused params/stores | 09, 240, 175, 179 |
| boilerplate wrappers, do-nothing layers, basic methods | 59, 217, 229 |
| names that lie: abbreviations, types in names, unreadable | 33, 65, 113, 128, 141, 153, 159, 163, 171, 174, 197, 223, 265, 277, 278 |
| comments explaining what, commented-out code | 05, 75, 151, 152, 183, 224 |
| exceptions misused: expected cases, broad try, empty catch | 26, 73, 80, 132, 165, 184 |
| global/static state, singletons | 17, 18, 32, 60, 209 |
| feature envy, data clumps, misplaced logic | 63, 89, 143, 191 |
| long call chains, middleware-ish chains | 08, 272 |
| premature optimization, caching, memoization | 20, 49, 129, 250, 279, 180 |
| dates, time, sequential IDs, magic IDs | 39, 77, 120, 157, 204, 246 |
| collections in names, collection misuse, aliasing | 111, 163, 233, 251, 257, 266, 267 |
| callbacks, promises, nesting, arrow code | 21, 78, 90, 102, 155, 184, 234 |
| fragile/misleading tests | 52, 76, 82, 91, 104, 108, 203, 204, 259, 275 |
| inheritance misuse, IS-A abuse, deep hierarchies | 11, 43, 58, 92, 125, 136, 137, 181, 255 |
| empty: methods, classes, constructors, implementations | 13, 114, 131, 165, 217 |
| security: eval, secrets, unsanitized input, deserialization | 189, 215, 245, 258, 185, 276 |
| process: TODOs, big PRs, feature flags, cowboy changes | 148, 239, 242, 227, 229 |
| any smell from the classic list: primitive obsession, shotgun surgery, middle man, poltergeist, lazy initialization | 122, 66, 67, 200, 88 |

Read the code as a reader, not the author: the smells that cost you time understanding *are* the ones to report.

Completion criterion: every file in the review target has been screened against the mappings above and the relevant INDEX lines, not just the ones you already know.

## 3. Verify before reporting

For each candidate smell:

- Re-read the `catalog/NNN_*.md` entry and match its **Problems** and **Detection** against the actual code.
- Decide if it is a genuine hint here — smells are contextual. A smell that the codebase deliberately embraces (documented, consistent, tested) is usually not worth reporting.
- Prefer smells with observable cost: coupling, mutation, dead branches, hidden state, breakage risk on change — over stylistic preferences.
- If the candidate fails verification, drop it silently.

Completion criterion: every reported smell has a concrete location and a verified symptom, and dropped candidates were dropped for an identifiable reason.

## 4. Report

Group findings by severity, most impactful first:

- **Blocker** — the smell hides a likely bug, data-loss, security, or boundary issue.
- **Should Fix** — meaningful maintainability or design cost that will bite the next change.
- **Simplification** — clearer/smaller code with no behavior change.
- **Nit** — local cosmetic issue; name it only when cheap to fix.

Per finding, include:

```
### <Severity>: <Smell NNN — name> at <file>:<line>

- **Evidence:** <the code that stinks, quoted>
- **Why it stinks:** <the cost, from the catalog's Problems or Detection>
- **Fix direction:** <from the catalog's Solutions / Right sample code>
```

Keep the total list short — the highest-signal 3–5 findings beat an exhaustive 30.

Completion criterion: every finding includes evidence, cost, and fix direction; the list is short enough that the user can act on all of it.

## Source

Catalog extracted from [Maximiliano Contieri's Code Smells series](https://maximilianocontieri.com/series/code-smells), compiled from the r/cleancode post ["How to Find the Stinky Parts of your Code"](https://www.reddit.com/r/cleancode/comments/1j13tqr/how_to_find_the_stinky_parts_of_your_code/). To refresh: fetch each article page, split on the section headings (`problems`, `solutions`, `sample-code`, `detection`, `tags`), keep one file per smell.
