---
description: Organize loose files in ~/Downloads and ~/Documents
---

Organize loose files in ~/Downloads and ~/Documents using the `tidy` script (rules in ~/.config/tidy/rules.sh). Scope options via $ARGUMENTS: `--downloads`, `--documents`, `--check`.

Current dry-run plan:

!`tidy`

Steps:
1. Review the plan above. If it is correct, run `tidy --apply` with the shell tool.
2. If recurring filename patterns are missing from the rules (files you would expect to move are absent from the plan), propose a new rule for ~/.config/tidy/rules.sh — do not add it without user approval.
3. Report a short summary of what moved, grouped by target folder.
