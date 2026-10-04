#!/bin/zsh
for r in "0 9.6" "9.6 12" "12 14.4" "14.4 26.4" "27 36" "36 40.8" "40.8 45.6" "45.6 48"; do
  a=${r% *}; b=${r#* }
  v=$(ffmpeg -nostdin -hide_banner -nostats -ss $a -to $b -i ${1:-score.wav} -af ebur128 -f null - 2>&1 | grep -E '^ +I: ' | tail -1)
  echo "$a-$b $v"
done
