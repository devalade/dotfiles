#!/usr/bin/env bash
# qa.sh — frame forensics for a render. One command, every still you need to
# judge motion on paper instead of scrubbing a timeline.
#
#   ./qa.sh out/final.mp4 [outdir] [action-time] [probe-time]
#
#   action-time  12-frame strip around one fast action (default 4.0) — the place
#                pops, overlaps and bad easing actually show up
#   probe-time   frame to render twice in separate browser loads to prove
#                seek(t) is pure (needs render.mjs beside this script)
#
# Then LOOK at the four PNGs. Reading them is the step; generating them is not.
set -euo pipefail

VID=${1:?usage: qa.sh <video> [outdir] [action-time] [probe-time]}
DIR=${2:-out/qa}
ACTION_T=${3:-4.0}
PROBE_T=${4:-}
HERE=$(cd "$(dirname "$0")" && pwd)
mkdir -p "$DIR"

# 1. contact sheet — 2 frames a second, 6 across. The "does anything happen at
#    all" view. Dead stretches show up as repeated tiles.
ffmpeg -v error -y -i "$VID" -vf "fps=2,scale=270:-1,tile=6x5" -frames:v 1 "$DIR/contact.png"

# 2. strip — 12 consecutive frames across half a second at full frame rate.
#    This is the sheet that catches a cursor teleporting, text overlapping during
#    a swap, a box that slides instead of easing, a flash.
ffmpeg -v error -y -ss "$ACTION_T" -i "$VID" -vf "scale=320:-1,tile=12x1" -frames:v 1 "$DIR/strip.png"

# 3. phone — 360px wide, 1 frame a second. Most of the audience sees this size.
#    If the type only reads here, it dies in the feed.
ffmpeg -v error -y -i "$VID" -vf "fps=1,scale=360:-1,tile=5x3" -frames:v 1 "$DIR/phone.png"

# 4. loop seam — the file played twice back to back. Watch the join.
ffmpeg -v error -y -stream_loop 1 -i "$VID" -c copy "$DIR/loop_check.mp4"

# 5. determinism — one frame, two separate browser loads, compared byte for byte.
#    Catches Math.random / Date / carried state that would make every render
#    differ and every fix a guess.
if [ -n "$PROBE_T" ] && [ -f "$HERE/render.mjs" ]; then
  node "$HERE/render.mjs" --at "$PROBE_T" --out "$DIR/probe-a.png" --page "${PAGE:-index.html}" >/dev/null
  node "$HERE/render.mjs" --at "$PROBE_T" --out "$DIR/probe-b.png" --page "${PAGE:-index.html}" >/dev/null
  if cmp -s "$DIR/probe-a.png" "$DIR/probe-b.png"; then
    echo "  determinism  OK    t=${PROBE_T}s identical across two page loads"
  else
    echo "  determinism  FAIL  t=${PROBE_T}s differs — something in the page is not a function of time"
  fi
else
  echo "  determinism  SKIP  pass a probe time as \$4 to check seek(t) purity"
fi

cat <<EOF

  $DIR/contact.png      2 fps grid     — variety, dead beats, pacing
  $DIR/strip.png       12 frames      — pops, overlaps, easing at t=${ACTION_T}s
  $DIR/phone.png       360px wide     — legibility at real size
  $DIR/loop_check.mp4  played twice   — the seam

  Score 1-10 each: hook in first 2s · readability at phone size · motion quality
  (springs, no dead frames) · variety · composition · brand accuracy · sound sync.
  Fix the 3 worst. Re-render only the seconds you touched.
EOF