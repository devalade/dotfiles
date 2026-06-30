#!/usr/bin/env bash
set -euo pipefail

# Sync the canonical agent-skills pool from the dotfiles repo out to the
# machine-wide ~/.agents/skills/ directory, then wire up every installed
# agent that supports global skills.
#
# Usage:
#   ~/.agents/sync-skills.sh [--force]
#
# --force   Replace existing agent skills directories without prompting.

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
echo "==> Syncing canonical skills pool to $TARGET_SKILLS"
mkdir -p "$TARGET_SKILLS"
rsync -a --delete --exclude='.DS_Store' "$SOURCE_SKILLS/" "$TARGET_SKILLS/"

# 2. Claude Code
echo "==> Wiring Claude Code"
if prompt_before_replace "$HOME/.claude/skills"; then
  ensure_symlink "$HOME/.claude/skills" "../../.agents/skills"
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
