#!/usr/bin/env bash
# Shared helpers for the agent-skills pool (sourced, not executed).
#
# Used by:
#   - `dot skills add | backup`  (dot CLI)
#   - `~/.agents/sync-skills.sh` (pool sync + agent wiring)
#
# A skill is "un-vendored" when it exists in the live pool (~/.agents/skills)
# but not in the dotfiles canonical pool (home/.agents/skills). Un-vendored
# skills are never deleted by a sync; they are offered for a one-time backup
# into dotfiles so they survive machine-wide syncs.

# unvendored_skills <src> <tgt>
#   Print the names of entries under <tgt> that have no counterpart in <src>.
unvendored_skills() {
  local src="$1" tgt="$2" path name
  [[ -d "$tgt" ]] || return 0
  for path in "$tgt"/*; do
    [[ -e "$path" ]] || continue
    name="$(basename "$path")"
    [[ -e "$src/$name" ]] && continue
    printf '%s\n' "$name"
  done
  return 0
}

# backup_unvendored_skills <src> <tgt> [names...]
#   Copy real-directory skills that exist only under <tgt> into the <src>
#   pool. When names are given, only those are considered (they are still
#   validated against the un-vendored list). Symlink entries (e.g.
#   ego-browser -> external dir) are reported but not copied.
# Sets $_skills_backed_up to the number of skills actually copied.
_skills_backed_up=0
backup_unvendored_skills() {
  local src="$1" tgt="$2"
  shift 2
  local -a want=("$@")
  local name path matched
  _skills_backed_up=0
  while IFS= read -r name; do
    if [[ ${#want[@]} -gt 0 ]]; then
      matched=false
      for candidate in "${want[@]}"; do
        if [[ "$candidate" == "$name" ]]; then
          matched=true
          break
        fi
      done
      [[ "$matched" == true ]] || continue
    fi

    path="$tgt/$name"
    if [[ -L "$path" ]]; then
      echo "  skip (symlink) $name -> $(readlink "$path")"
      continue
    fi
    if [[ -d "$path" ]]; then
      mkdir -p "$src/$name"
      cp -R "$path"/. "$src/$name"/
      rm -f "$src/$name/.DS_Store"
      echo "  backed up: $name"
      ((_skills_backed_up++)) || true
    fi
  done < <(unvendored_skills "$src" "$tgt")
}
