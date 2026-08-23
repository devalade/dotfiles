# Handy Captions — local auto-captions for DaVinci Resolve (free)

One click inside free DaVinci Resolve (**Workspace → Scripts → Utility → Handy Captions**) renders your timeline's audio to a local QuickTime/MP4 file, transcribes it **locally** with the
[Handy](https://handy.app) desktop app (Parakeet Unified EN 0.6B via Metal) and drops
captions on the timeline. No Resolve Studio, no cloud, no ffmpeg.

- **Media pipeline** — [MediaBunny](https://mediabunny.dev) (decode, resample to
  16 kHz mono, silence-VAD chunking, WAV chunk writing)
- **Transcription** — Handy's headless CLI (`handy --transcribe-file`), fully offline
- **Caption delivery** — generated SRT cues imported directly into a dedicated
  `Handy Captions` subtitle track on the active timeline; re-runs replace that track.
  The `.srt` is always exported to
  `~/Movies/HandyCaptions/<timeline>.srt` for drag-and-drop or upload

## Install

```bash
dot captions install
```

This:
1. Installs the npm deps (`mediabunny`, `@mediabunny/server`) into this folder
2. Copies `captions-handy.py` into Resolve's `Fusion/Scripts/Utility/` folder
   (the `Utility` subfolder is scanned for the Workspace → Scripts menu on all pages;
   a real copy — Resolve's script menu does not reliably show symlinks on macOS)
3. Verifies Handy is installed and the Parakeet model is downloaded

Then restart Resolve (it scans script folders at launch) and run the script.

## Usage

1. Open your project, select the timeline with speech
2. **Workspace → Scripts → Utility → Handy Captions**
3. Watch the Console and the `Handy Captions` marker at the timeline start:
   render → transcribe (≈ 10–20× real-time on Apple Silicon) → direct timeline injection
4. Result: captions on the `Handy Captions` subtitle track +
   `~/Movies/HandyCaptions/<timeline>.srt`

Quick sanity check without Resolve: `dot captions test` (synthesizes a speech clip
and runs the exact pipeline) or `dot captions test /path/to/video.mp4`.

Caption timing comes from silence analysis (phrases up to 8 s), because Handy's batch
CLI returns text without per-segment timestamps.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Script missing from the menu | Quit + relaunch Resolve after `dot captions install`; check the file in `~/Library/Application Support/Blackmagic Design/DaVinci Resolve/Fusion/Scripts/Utility/` |
| No "Scripts" entry under Workspace | Resolve 20 (macOS) needs the **python.org** framework at `/Library/Frameworks/Python.framework` — Homebrew Python is ignored. Install Python 3.13.x from python.org, restart Resolve |
| `Py3 is not installed` in Console | Same as above — install the python.org framework |
| `node/bun not found` | Install Node or Bun, or set `DAVINCI_CAPTIONS_NODE=/path/to/node` in your shell before launching Resolve |
| Empty captions | The timeline audio has no speech detected (threshold: −38 dBFS, 0.15 s) |
| Text+ captions on the timeline | This is the normal, direct-injection path. Edit the `Handy Captions` clips in the Inspector, or drag the saved `.srt` onto a subtitle track manually |
| Wrong model | `export HANDY_MODEL=<id>` (list ids: `handy --list-models --json`) |

## Files

- `captions-handy.py` — Resolve script (stdlib only; runs in
  Resolve's bundled Python)
- `captions-node.mjs` — MediaBunny + Handy pipeline (Node ≥ 20, or Bun)
- `package.json` — pinned deps (`node_modules/` is gitignored)

## Manual (non-dotfiles) install

```bash
cp captions-handy.py "$HOME/Library/Application Support/Blackmagic Design/DaVinci Resolve/Fusion/Scripts/Utility/"
npm install   # in this folder
```
