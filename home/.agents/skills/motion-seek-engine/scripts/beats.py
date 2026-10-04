#!/usr/bin/env python3
"""beats.py — measure a track and emit the grid the animation reads.

    python beats.py song.wav > beats.json
    python beats.py song.wav beats.json 120   # optional: force the BPM

Emits:
    bpm        tempo estimate
    beats      every beat, in seconds     -> state changes happen here
    downbeats  every 4th beat (assumes 4/4) -> big moments start here
    hits       onset peaks                -> SFX and accents go here

Requires: pip install librosa soundfile numpy
(librosa 1.x returns tempo and beats in FRAMES; this script converts once, here.)
"""

import json
import sys

import librosa
import numpy as np

FORCED_BPM = float(sys.argv[3]) if len(sys.argv) > 3 else None

path = sys.argv[1]
y, sr = librosa.load(path, sr=None, mono=True)

duration = len(y) / sr

if FORCED_BPM:
    # Trust a stated tempo more than the estimate: re-derive the grid from it.
    tempo = FORCED_BPM
    beats = np.arange(0.0, duration, 60.0 / tempo)
else:
    tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
    tempo = float(np.atleast_1d(tempo)[0])
    beats = librosa.frames_to_time(beat_frames, sr=sr)

beats = sorted(float(b) for b in beats if 0 <= b < duration)

# librosa often misses the beat at t=0, which shifts every downbeat by a beat
# and leaves the film starting off the grid. Extrapolate the grid back to zero.
interval = 60.0 / tempo
if len(beats) > 2:
    diffs = [b - a for a, b in zip(beats, beats[1:]) if b - a > 0.2 * interval]
    if diffs:
        interval = float(np.median(diffs))  # robust against a dropped beat
while beats and beats[0] - interval >= -interval / 2:
    beats.insert(0, beats[0] - interval)
beats = [round(max(0.0, b), 3) for b in beats]

# Downbeats are phase-locked to the grid (round(t/interval) % 4), not to
# beats[::4], which inherits whatever phase the detector happened to start on.
downbeats = [b for b in beats if round(b / interval) % 4 == 0]

onset = librosa.onset.onset_strength(y=y, sr=sr)
peaks = librosa.util.peak_pick(
    onset, pre_max=3, post_max=3, pre_avg=3, post_avg=5, delta=0.5, wait=10
)
hits = [round(float(h), 3) for h in librosa.frames_to_time(peaks, sr=sr)]

grid = {
    "bpm": round(60.0 / interval, 2),
    "beats": beats,
    "downbeats": downbeats,
    "hits": hits,
    "duration": round(duration, 3),
}

dest = sys.argv[2] if len(sys.argv) > 2 else None
text = json.dumps(grid, indent=1)
if dest and dest != "-":
    with open(dest, "w") as f:
        f.write(text)
    print(
        f"  {dest}  {grid['bpm']} BPM, {len(beats)} beats, {len(hits)} hits, {grid['duration']}s",
        file=sys.stderr,
    )
else:
    print(text)