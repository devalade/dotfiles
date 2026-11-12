#!/usr/bin/env bash
# Tidy organization rules — sourced by `tidy`.
#
# Keyword rules: "<regex>" "<target>" — matched against the filename (case-insensitive),
# first match wins. Target is relative to the folder root (Downloads or Documents).
#   e.g. "facture|invoice" "Documents/Finance"  (in Downloads, moves to ~/Downloads/Documents/Finance)
#
# Extension buckets: "<ext list>" "<target>" — applied when no keyword rule matched.
# Files with no matching rule stay in place.

# --- Downloads: keyword rules (PDFs and office docs first) ---
DOWNLOADS_KEYWORDS=(
  "(cv|resume|r[ée]sum[ée])"                 "Documents/CV"
  "(facture|invoice|contrat|kbis|devis|re[çc]u|taxe|paie|smic)"  "Documents/Finance"
  "(examen|m[ée]moire|chapter|chapitre|cours|guide|mod[èe]le|esgis|master|l3|td[ _-]|tp[ _-]|syllabus)" "Documents/School"
  "(beniloc|qualiextra|front desk|ycer|sanny|openhub|jobs|pipeline)" "Documents/Work"
  "(whatsapp|telegram|meta|notion)"   "Documents/Social"
)

# --- Downloads: extension buckets ---
DOWNLOADS_EXT=(
  "jpg jpeg jpe png webp gif svg heic heif bmp tiff avif ico jfif" "Images"
  "mp4 mov mkv avi webm m4v wmv flv" "Videos"
  "mp3 wav m4a aac flac ogg opus" "Audio"
  "pdf" "Documents"
  "doc docx ppt pptx xls xlsx odt ods rtf" "Documents"
  "zip tar gz bz2 xz 7z rar dmg pkg aab apk iso" "Archives"
  "csv ics json sql xml tldr" "Data"
  "html htm js jsx ts tsx py sh bash" "Code"
  "md txt rst log" "Documents"
)

# --- Documents: keyword rules (loose files only) ---
DOCUMENTS_KEYWORDS=(
  "(cv|resume|r[ée]sum[ée])"    "CV"
  "(examen|m[ée]moire|chapter|chapitre|cours|guide|mod[èe]le|esgis|master|yoruba|syst[èe]me)" "School"
  "(contrat|droit|facture|kbis|prestation|devis)" "Work"
  "(recordly|codex|kimi|blackmagic)" "Projects"
)

# --- Documents: extension buckets ---
DOCUMENTS_EXT=(
  "jpg jpeg jpe png webp gif svg heic heif bmp tiff avif ico jfif" "Images"
  "mp4 mov mkv avi webm m4v wmv flv" "Videos"
  "mp3 wav m4a aac flac ogg opus" "Audio"
)

# Files that must never be moved (matched case-insensitively against the name)
IGNORE_PATTERNS=(
  "^\.DS_Store$"
  "^\.localized$"
  "^\._"
  "\.part$"
  "\.crdownload$"
  "\.tmp$"
)
