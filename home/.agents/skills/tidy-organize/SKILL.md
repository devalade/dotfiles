---
name: tidy-organize
description: Organize ~/Downloads and ~/Documents as a daily cleanup. Use when the user asks to tidy, clean, sort, or organize downloaded files or documents, or for the scheduled morning cleanup session.
---

# Tidy Organize

Daily agent-driven cleanup of `~/Downloads` and `~/Documents`. You act as the
user's file organizer: you have context about what they work on, you decide
where ambiguous files belong, and you improve the rules as patterns repeat.

## Context: the user

- Student + engineer: ESGIS school (French-speaking), Yoruba language pipeline project.
- Work: Qualiextra (invoices, contracts, KBIS, social/video assets), BeniLoc (cahier des charges), Front Desk (plaquette), Mistral/Cambon/Campanile/AV0 invoices.
- Files are French or English; accented names are common (é, è, à).

## Folder structure

`~/Downloads`:
```
Archives/            dmg, zip, pkg, aab, iso, tar, gz, 7z
Audio/               mp3, wav, m4a, flac
Code/                html, js, ts, py, sh
Data/                csv, ics, json, sql, tldr
Documents/
  CV/                cv, resume, résumé
  Finance/           facture, invoice, contrat, kbis, devis, reçu, taxe, paie
  School/            examen, mémoire, chapitre, guide, modèle, ESGIS, master, TD/TP
  Social/            whatsapp, telegram, meta screenshots
  Work/              beniloc, qualiextra, front desk, YCER, sanny, jobs, pipeline
  (root)             generic pdf, docx, md that match no keyword
Images/              jpg, jpeg, png, webp, gif, svg, heic, tiff, avif, bmp
Videos/              mp4, mov, mkv, avi, webm
```

`~/Documents` loose files go to: `CV/`, `School/`, `Work/`, `Projects/`
(recordly, codex, kimi), `Images/`, `Videos/`. Existing folders
(`Blackmagic Design`, `Codex`, `Recordly`, `kimi`, `qualiextra-invoices`) are
never restructured.

## Workflow

1. Run `tidy --check` (deterministic plan: keyword rules then extension buckets;
   rules in `~/.config/tidy/rules.sh`). Exit 1 means files would move.
2. Review the plan with your context. Correct obvious misrouting **before** moving:
   - a PDF named "Facture - ..." belongs in `Documents/Finance` even if a
     keyword rule missed it — apply the move yourself;
   - screenshots of chats/calls → `Social` only when clearly social;
   - project assets (logos, mockups, videos for Qualiextra/BeniLoc) → `Work`;
   - installers/updaters (dmg from known apps) → `Archives`;
   - anything genuinely ambiguous → leave it in place and note it.
3. Apply: `tidy --apply`, then handle any corrections you decided (mv).
4. Verify: `tidy --check` must exit 0. Confirm nothing was moved that is a
   directory, hidden file, or inside an existing project folder.
5. Report: summary grouped by target folder + list of unclassified files.

## Safety rules (never break these)

- Never delete or trash files. Moving only.
- Never move directories, hidden files (`.DS_Store`, `.localized`, dotfiles), or files already inside a managed subfolder (e.g. `~/Downloads/Documents/*`).
- Never restructure existing folders (`Claude`, `Course Hunter`, `Lockedin VIDEOS FROM ALADE`, `Master Esgis`, `Évolution`, `qualiextra-invoices`, `Blackmagic Design`, `Codex`, `Recordly`, `kimi`).
- Files modified in the last 6 hours stay put (still in use).
- Duplicates: never overwrite; use "name (2).ext" style or leave both and note them.
- Only edit `~/.config/tidy/rules.sh` to add a rule when the same pattern has appeared at least twice; ask the user first unless this is the scheduled run and the pattern is unambiguous.

## When scheduled (morning run)

This skill runs every morning via launchd → `opencode2 run --agent organizer --auto`.
The run is unattended: finish in one pass, be conservative, and write a clear
one-paragraph summary ending with "Nothing to tidy." when there is nothing to do.
