#!/bin/zsh
# Usage: ./mux.sh [fr|en]. Loudness-normalise the score to -14 LUFS / -1 dBTP (two-pass) and mux it onto the picture.
set -e
cd "${0:A:h}"
lang=${1:-fr}
node audio.mjs
stats=$(ffmpeg -nostdin -hide_banner -i score.wav -af loudnorm=I=-14:TP=-1:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
get() { echo "$stats" | grep "\"$1\"" | sed -E 's/.*: "([^"]+)".*/\1/' }
ffmpeg -nostdin -y -v error -i score.wav -af "loudnorm=I=-14:TP=-1:LRA=11:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true,aresample=48000" -c:a pcm_s16le mix.wav
ffmpeg -nostdin -y -v error -i silent-$lang.mp4 -i mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -shortest -movflags +faststart zeassistant-launch-$lang.mp4
ffmpeg -nostdin -hide_banner -i zeassistant-launch-$lang.mp4 -af ebur128=peak=true -f null - 2>&1 | grep -A8 'Integrated loudness' | grep -E 'I:|Peak:'
