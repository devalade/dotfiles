# Handy Captions — local auto-captions for DaVinci Resolve (free)

One click inside free DaVinci Resolve (**Workspace → Scripts → Utility → Handy Captions**) renders your timeline's audio, transcribes it **locally** with the
[Handy](https://handy.app) desktop app (Parakeet Unified EN 0.6B via Metal) and drops
captions on the timeline. No Resolve Studio, no cloud, no ffmpeg.

- **Media pipeline** — [MediaBunny](https://mediabunny.dev) (decode, resample to
  16 kHz mono, silence-VAD chunking, WAV chunk writing)
- **Transcription** — Handy's headless CLI (`handy --transcribe-file`), fully offline
- **Caption delivery** — native subtitle track when the SRT import probe succeeds,
  otherwise styled Text+ titles on a new video track; the `.srt` is always exported
  to `~/Movies/HandyCaptions/<timeline>.srt` for drag-and-drop or upload

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
3. Watch the Console: render → transcribe (≈ 10–20× real-time on Apple Silicon) → captions
4. Result: captions on the subtitle track (or Text+ titles on a new video track) +
   `~/Movies/HandyCaptions/<timeline>.srt`

Caption timing comes from silence analysis (phrases up to 8 s), because Handy's batch
CLI returns text without per-segment timestamps.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Script missing from the menu | Quit + relaunch Resolve after `dot captions install`; check the file in `~/Library/Application Support/Blackmagic Design/DaVinci Resolve/Fusion/Scripts/Utility/` |
| `node/bun not found` | Install Node or Bun, or set `DAVINCI_CAPTIONS_NODE=/path/to/node` in your shell before launching Resolve |
| Empty captions | The timeline audio has no speech detected (threshold: −38 dBFS, 0.15 s) |
| Text+ titles instead of subtitle track | The SRT auto-import probe is version-dependent; drag the saved `.srt` onto a subtitle track manually, or edit the Text+ clips in the Inspector |
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