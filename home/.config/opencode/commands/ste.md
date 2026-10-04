---
description: Write, rewrite, or check text in Simplified Technical English (ASD-STE100)
---

Write or rewrite text in Simplified Technical English using the `simplified-technical-english` skill. Load it first with the skill tool, then follow it.

Scope options via $ARGUMENTS:

- A file path or glob (for example `manuals/install.md`) — rewrite that text.
- `--check <file>` — do not rewrite. Report the errors only.
- `--mode <procedural|descriptive>` — override the text type. Default: infer from the text, and ask if it is genuinely ambiguous.
- `--words <file>` — check a word list or glossary against the approved words instead of prose.

Steps:

1. Load the `simplified-technical-english` skill and read `references/substitutions.md`. Read `references/writing-rules.md` too when rewriting a whole document or when a rule is unclear.
2. Classify the text as procedural or descriptive, per the skill.
3. Rewrite the text in STE, or, for `--check`, leave it untouched.
4. Run the checker on the result:

   ```
   python3 ~/.agents/skills/simplified-technical-english/scripts/ste_check.py --mode <procedural|descriptive> <file>
   ```

5. Fix every error it reports, then run it again. Stop when it is clean.
6. Do the manual scan from the skill's checklist. The checker cannot judge approved meaning, so compare suspect words against `references/word-list.md` yourself.
7. Report the result. For a rewrite, give a short summary of the classes of change you made, with at most three before/after examples. For `--check`, list the errors by rule number.

Do not apply STE to code, identifiers, commands, file paths, quoted error messages, marketing text, or official product names. If the user asks for a different style in $ARGUMENTS, the request of the user wins.