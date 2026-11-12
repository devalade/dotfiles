#!/usr/bin/env bash
# Quality loop. One JSON line per run in docs/quality.log, non-zero exit on a
# regression against the last green baseline.
#
#   scripts/quality.sh                 # fast loop: lint, typecheck, unit, matrix
#   scripts/quality.sh --full          # adds Playwright smoke and screenshots
#   scripts/quality.sh --watch         # same, for cron or launchd
#
# Install the schedule with launchd (macOS) or `cf` cron for the deployed checks.
set -uo pipefail

FULL=0
[[ "${1:-}" == "--full" || "${1:-}" == "--watch" ]] && FULL=1

command -v pnpm >/dev/null || { echo "pnpm missing" >&2; exit 2; }
LOG=docs/quality.log
mkdir -p docs
SHA=$(git rev-parse --short HEAD 2>/dev/null || echo local)

start=$(date +%s)
fail=""

run() {
  local name=$1
  shift
  if "$@" >/tmp/quality-$name.log 2>&1; then
    echo "ok   $name"
  else
    echo "FAIL $name  (/tmp/quality-$name.log)"
    fail="${fail}${fail:+,}$name"
  fi
}

run lint pnpm lint
run typecheck pnpm typecheck
run unit pnpm test --run
run matrix pnpm tsx scripts/scenarios.ts

if [[ $FULL -eq 1 ]]; then
  run smoke pnpm exec playwright test --grep @smoke
  run shots node scripts/shot.mjs / design after
fi

ms=$(( ($(date +%s) - start) * 1000 ))
line="{\"at\":\"$(date -u +%FT%TZ)\",\"commit\":\"$SHA\",\"ms\":$ms,\"full\":$FULL,\"failed\":\"$fail\"}"
echo "$line" >> "$LOG"

# Regression rule: a green run after a red run is fine, a red run fails, and a
# wall-clock blowup on the fast loop is a failure too (a slow gate stops running).
if [[ -n "$fail" ]]; then
  echo "quality: red ($fail)" >&2
  exit 1
fi

if [[ $ms -gt 90000 && $FULL -eq 0 ]]; then
  echo "quality: fast loop took ${ms}ms, budget is 90000ms" >&2
  exit 1
fi

echo "quality: green in ${ms}ms"
