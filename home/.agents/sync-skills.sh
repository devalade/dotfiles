#!/usr/bin/env bash
set -euo pipefail

# Sync the canonical agent-skills pool from the dotfiles repo out to the
# machine-wide ~/.agents/skills/ directory, then wire up every installed
# agent that supports global skills.
#
# Usage:
#   ~/.agents/sync-skills.sh [--force]
#
# Safety: skills that exist in ~/.agents/skills but are not vendored in the
# dotfiles pool are never deleted. When run interactively it offers to back
# them up into the dotfiles pool first.
#
# --force   Never prompt (agent dirs are still replaced without asking, and
#           un-vendored skills are still preserved, just not offered a backup).

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_SKILLS="${SCRIPT_DIR}/skills"
TARGET_SKILLS="${HOME}/.agents/skills"
FORCE=false

if [[ "${1:-}" == "--force" ]]; then
  FORCE=true
fi

if [[ ! -d "$SOURCE_SKILLS" ]]; then
  echo "error: source skills directory not found: $SOURCE_SKILLS" >&2
  exit 1
fi

backup_existing() {
  local target="$1"
  if [[ -e "$target" && ! -L "$target" ]]; then
    local backup="${target}.backup.$(date +%s)"
    echo "Backing up existing $target -> $backup"
    mv "$target" "$backup"
  elif [[ -L "$target" ]]; then
    rm "$target"
  fi
}

ensure_symlink() {
  local link_path="$1"
  local link_target="$2"
  local parent_dir
  parent_dir="$(dirname "$link_path")"

  mkdir -p "$parent_dir"

  if [[ -L "$link_path" ]]; then
    local current
    current="$(readlink "$link_path")"
    if [[ "$current" != "$link_target" ]]; then
      rm "$link_path"
      ln -s "$link_target" "$link_path"
      echo "Updated symlink: $link_path -> $link_target"
    else
      echo "OK: $link_path"
    fi
  else
    backup_existing "$link_path"
    ln -s "$link_target" "$link_path"
    echo "Created symlink: $link_path -> $link_target"
  fi
}

prompt_before_replace() {
  local target="$1"
  if [[ "$FORCE" == true ]]; then
    return 0
  fi
  if [[ -e "$target" && ! -L "$target" ]]; then
    read -r -p "Replace existing $target with a symlink? [y/N] " response
    case "$response" in
      [yY][eE][sS]|[yY]) return 0 ;;
      *) echo "Skipped $target"; return 1 ;;
    esac
  fi
  return 0
}

# 1. Sync canonical skills to ~/.agents/skills/
echo ""
echo "==> Syncing canonical skills pool to $TARGET_SKILLS"
mkdir -p "$TARGET_SKILLS"

# Safety invariant: never delete live-pool skills that aren't vendored in the
# dotfiles pool. When interactive, offer to back them up first.
if [[ -f "${SCRIPT_DIR}/skills-lib.sh" ]]; then
  source "${SCRIPT_DIR}/skills-lib.sh"

  UNVENDORED=()
  while IFS= read -r skill_name; do
    UNVENDORED+=("$skill_name")
  done < <(unvendored_skills "$SOURCE_SKILLS" "$TARGET_SKILLS")

  if [[ ${#UNVENDORED[@]} -gt 0 ]]; then
    echo ""
    echo "NOTE: skills exist in ~/.agents/skills that are NOT in the dotfiles pool:"
    printf '  - %s\n' "${UNVENDORED[@]}"
    echo "They will be preserved and never deleted by this sync."
    if [[ -t 0 && "$FORCE" != true ]]; then
      echo ""
      read -r -p "Back them up into your dotfiles ($SOURCE_SKILLS) now? [y/N] " choice
      case "$choice" in
        [yY][eE][sS]|[yY])
          backup_unvendored_skills "$SOURCE_SKILLS" "$TARGET_SKILLS"
          ;;
        *)
          echo "OK, leaving them in place. Run 'dot skills backup' later to vendor them."
          ;;
      esac
      # Recompute: anything just backed up is now vendored and safe to mirror.
      UNVENDORED=()
      while IFS= read -r skill_name; do
        UNVENDORED+=("$skill_name")
      done < <(unvendored_skills "$SOURCE_SKILLS" "$TARGET_SKILLS")
    else
      echo "Non-interactive run: leaving them in place. Use 'dot skills backup' to vendor them."
    fi
  fi

  RSYNC_EXCLUDES=("--exclude=.DS_Store")
  for skill_name in "${UNVENDORED[@]}"; do
    RSYNC_EXCLUDES+=("--exclude=/$skill_name")
  done
  rsync -a --delete "${RSYNC_EXCLUDES[@]}" "$SOURCE_SKILLS/" "$TARGET_SKILLS/"
else
  echo "warning: skills-lib.sh not found next to sync-skills.sh; running legacy mirror"
  echo "  (un-vendored skills in ~/.agents/skills may be deleted) — run 'dot stow' to refresh."
  rsync -a --delete --exclude='.DS_Store' "$SOURCE_SKILLS/" "$TARGET_SKILLS/"
fi

# 2. Claude Code
echo "==> Wiring Claude Code"
if prompt_before_replace "$HOME/.claude/skills"; then
  # ~/.claude/skills is one level deep, so the pool is one ".." up (../.agents/skills),
  # unlike OpenCode and pi which live two levels deep (../../.agents/skills)
  ensure_symlink "$HOME/.claude/skills" "../.agents/skills"
fi

# 3. OpenCode
echo "==> Wiring OpenCode"
if prompt_before_replace "$HOME/.config/opencode/skills"; then
  ensure_symlink "$HOME/.config/opencode/skills" "../../.agents/skills"
fi

# 4. pi
echo "==> Wiring pi"
if prompt_before_replace "$HOME/.pi/agent/skills"; then
  ensure_symlink "$HOME/.pi/agent/skills" "../../.agents/skills"
fi

# 5. Codex (per-skill symlinks to preserve .system/)
echo "==> Syncing Codex skills"
CODEX_SKILLS="${HOME}/.codex/skills"
mkdir -p "$CODEX_SKILLS"

added=0
updated=0
for skill_path in "$TARGET_SKILLS"/*; do
  [[ -e "$skill_path" ]] || continue
  [[ -d "$skill_path" ]] || continue

  skill_name="$(basename "$skill_path")"
  target="$CODEX_SKILLS/$skill_name"
  link_target="../../.agents/skills/$skill_name"

  if [[ -e "$target" && ! -L "$target" ]]; then
    echo "skip: $skill_name (real file/directory exists)"
    continue
  fi

  if [[ -L "$target" ]]; then
    current="$(readlink "$target")"
    if [[ "$current" != "$link_target" ]]; then
      ln -sfn "$link_target" "$target"
      ((updated++)) || true
    fi
  else
    ln -s "$link_target" "$target"
    ((added++)) || true
  fi
done

# Remove stale Codex symlinks
for stale in "$CODEX_SKILLS"/*; do
  [[ -e "$stale" ]] || continue
  [[ -L "$stale" ]] || continue
  skill_name="$(basename "$stale")"
  if [[ ! -d "$TARGET_SKILLS/$skill_name" ]]; then
    rm "$stale"
    echo "Removed stale Codex symlink: $skill_name"
  fi
done

echo ""
echo "Skills sync complete."
echo "  Canonical pool: $TARGET_SKILLS"
echo "  Total skills: $(find "$TARGET_SKILLS" -maxdepth 1 -type d | wc -l | tr -d ' ')"
echo "  Codex: $added added, $updated updated"
