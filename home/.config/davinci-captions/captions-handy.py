#!/usr/bin/env python3
"""
Handy Captions — automatic captions for DaVinci Resolve (free edition).

Run from:   Workspace -> Scripts -> Workflow Integrations -> Handy Captions
Pipeline:   Resolve renders the timeline audio (audio-only WAV) -> the bundled
            Node script (MediaBunny) resamples to 16 kHz mono, finds speech
            chunks via silence analysis, transcribes each chunk with the local
            Handy.app CLI (Parakeet Unified EN 0.6B) -> captions are added to
            the timeline as Text+ titles (styled), and the .srt is saved for
            native subtitle-track use (drag onto a subtitle track).

No cloud services, no ffmpeg, no Resolve Studio required.
"""

import glob
import json
import os
import shutil
import subprocess
import sys
import tempfile
import time

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
CAPTIONS_DIR = os.path.dirname(os.path.realpath(__file__))     # repo package dir
NODE_SCRIPT = os.path.join(CAPTIONS_DIR, "captions-node.mjs")

# Resolve apps launched from the GUI have a minimal PATH; probe known locations.
NODE_CANDIDATES = [
    os.environ.get("DAVINCI_CAPTIONS_NODE", ""),
    shutil.which("node") or "",
    shutil.which("bun") or "",
    os.path.expanduser("~/.bun/bin/bun"),
    "/opt/homebrew/bin/node",
    "/usr/local/bin/node",
]

SRT_EXPORT_DIR = os.path.join(os.path.expanduser("~"), "Movies", "HandyCaptions")
AUDIO_NAME = "handy_captions_audio"


def get_resolve():
    """Standard bootstrap for scripts launched from within Resolve."""
    try:
        import DaVinciResolveScript as dvr
        return dvr.scriptapp("Resolve")
    except ImportError:
        try:
            import importlib.util
            for base in (
                "/Library/Application Support/Blackmagic Design/DaVinci Resolve/Developer/Scripting/Modules",
                os.path.expanduser("~/Library/Application Support/Blackmagic Design/DaVinci Resolve/Developer/Scripting/Modules"),
            ):
                p = os.path.join(base, "DaVinciResolveScript.py")
                if os.path.exists(p):
                    spec = importlib.util.spec_from_file_location("DaVinciResolveScript", p)
                    dvr = importlib.util.module_from_spec(spec)
                    spec.loader.exec_module(dvr)
                    return dvr.scriptapp("Resolve")
        except Exception:
            pass
    print("Could not connect to DaVinci Resolve. Run this from Workspace -> Scripts.")
    return None


def find_node():
    for cand in NODE_CANDIDATES:
        if cand and os.path.isfile(cand) and os.access(cand, os.X_OK):
            return cand
    print("ERROR: node/bun not found. Install node or bun, or set DAVINCI_CAPTIONS_NODE.")
    return None


def render_timeline_audio(project, target_dir, fps):
    """Export timeline audio to a WAV via the render API. Returns wav path or None."""
    settings = {
        "SelectAllFrames": True,
        "TargetDir": target_dir,
        "CustomName": AUDIO_NAME,
        "Format": "wav",
        "ExportVideo": False,
        "ExportAudio": True,
        "AudioCodec": "pcm_s16le",
        "AudioSampleRate": 48000,
    }
    # Attempt the full settings; fall back to defaults if the codec key is rejected.
    attempts = [settings, {k: v for k, v in settings.items() if k != "AudioCodec"}]
    job_id = None
    for attempt in attempts:
        try:
            if project.SetRenderSettings(attempt):
                job_id = project.AddRenderJob()
                if job_id:
                    break
        except Exception:
            continue
    if not job_id:
        print("ERROR: could not create the audio render job.")
        return None

    if not project.StartRendering(job_id):
        print("ERROR: render did not start.")
        return None

    waited = 0
    while project.IsRenderingInProgress():
        time.sleep(0.5)
        waited += 0.5
        if waited > 60 * 60:
            print("ERROR: render timed out after 60 minutes.")
            return None

    matches = glob.glob(os.path.join(target_dir, "*%s*.wav" % AUDIO_NAME)) or \
              glob.glob(os.path.join(target_dir, "*.wav"))
    if not matches:
        print("ERROR: render finished but no WAV was found in", target_dir)
        return None
    return matches[0]


def add_native_subtitles(project, timeline, srt_path):
    """Probe: import the SRT and append it to a subtitle track (true, or None)."""
    try:
        mp = project.GetMediaPool()
        items = mp.ImportMedia([srt_path]) or []
        if not items:
            return None
        if timeline.GetTrackCount("subtitle") == 0:
            timeline.AddTrack("subtitle")
        index = timeline.GetTrackCount("subtitle")
        placed = mp.AppendToTimeline([{
            "mediaPoolItem": items[0],
            "trackIndex": index,
            "recordFrame": timeline.GetStartFrame(),
        }])
        return placed if placed else None
    except Exception as exc:
        print("native subtitle import failed, falling back to Text+:", exc)
        return None


def style_title(item, text):
    """Set the caption text and a caption-friendly look on a Text+ clip."""
    try:
        comp = item.GetFusionCompByIndex(1)
        if comp is None:
            return False
        tool = None
        for t in comp.GetToolList(False).values():
            if "TextPlus" in (t.GetAttrs().get("TOOLS_Name", "") or ""):
                tool = t
                break
        if tool is None:
            tools = list(comp.GetToolList(False).values())
            tool = tools[0] if tools else None
        if tool is None:
            return False
        tool.SetInput("StyledText", text)
        try:
            tool.SetInput("Size", 0.09)                          # ~9% frame height
            tool.SetInput("Red", 1.0)                            # white fill
            tool.SetInput("Green", 1.0)
            tool.SetInput("Blue", 1.0)
            tool.SetInput("Outline", 0.5)                        # black outline
            tool.SetInput("OutlineRed", 0.0)
            tool.SetInput("OutlineGreen", 0.0)
            tool.SetInput("OutlineBlue", 0.0)
        except Exception:
            pass
        return True
    except Exception:
        return False


def add_text_captions(timeline, cues, fps):
    """Add one styled Text+ title per cue on a fresh video track."""
    start_frame = timeline.GetStartFrame()
    timeline.AddTrack("video")
    count = 0
    placed = 0
    for cue in cues:
        count += 1
        s = start_frame + int(round(cue["start"] * fps))
        e = start_frame + int(round(cue["end"] * fps))
        if e <= s:
            e = s + 1
        try:
            item = timeline.InsertFusionTitleIntoTimeline("Text+")
            if item is None:
                continue
            item.SetStart(s)
            item.SetEnd(e)
            if style_title(item, cue["text"]):
                placed += 1
            if count % 25 == 0:
                print("  ... %d/%d titles" % (count, len(cues)))
        except Exception as exc:
            print("title %d failed: %s" % (count, exc))
            continue
    print("Added %d/%d captions as Text+ titles on a new video track." % (placed, len(cues)))
    print("Tip: select all caption clips -> Inspector to restyle / move them.")


def main():
    resolve = get_resolve()
    if resolve is None:
        return
    pm = resolve.GetProjectManager()
    project = pm.GetCurrentProject()
    timeline = project.GetCurrentTimeline() if project else None
    if project is None or timeline is None:
        print("ERROR: open a project with an active timeline first.")
        return

    node = find_node()
    if node is None:
        return
    if not os.path.exists(NODE_SCRIPT):
        print("ERROR: captions-node.mjs not found next to this script:", NODE_SCRIPT)
        return

    try:
        fps = float(timeline.GetSetting("timelineFrameRate") or 24)
    except (TypeError, ValueError):
        fps = 24.0
    print("Timeline: %s | fps: %s | duration: %s frames" % (
        timeline.GetName(), fps, timeline.GetEndFrame() - timeline.GetStartFrame()))

    workdir = tempfile.mkdtemp(prefix="handy-captions-")
    try:
        print("Rendering timeline audio (audio-only WAV) ...")
        wav = render_timeline_audio(project, workdir, fps)
        if wav is None:
            return

        srt_path = os.path.join(workdir, "captions.srt")
        cues_path = os.path.join(workdir, "cues.json")
        print("Transcribing with Handy (local model, no cloud) ...")
        proc = subprocess.run(
            [node, NODE_SCRIPT, wav, srt_path, cues_path],
            capture_output=True, text=True, timeout=60 * 60,
        )
        sys.stdout.write(proc.stderr)   # progress lines from the node script
        if proc.returncode != 0:
            print("ERROR: transcription pipeline failed (exit %d)." % proc.returncode)
            if proc.stderr:
                print(proc.stderr[-2000:])
            return

        if not os.path.exists(cues_path):
            print("ERROR: no cues.json produced.")
            return
        with open(cues_path) as f:
            cues = json.load(f).get("cues", [])

        if not cues:
            print("No speech detected in the timeline — nothing to caption.")
            return

        print("Transcription complete: %d cues." % len(cues))

        if add_native_subtitles(project, timeline, srt_path):
            print("Captions placed on the native subtitle track (stylable in the Inspector).")
        else:
            add_text_captions(timeline, cues, fps)

        # Keep the SRT somewhere reachable for drag-and-drop / uploads.
        os.makedirs(SRT_EXPORT_DIR, exist_ok=True)
        dst = os.path.join(SRT_EXPORT_DIR, "%s.srt" % timeline.GetName())
        shutil.copy2(srt_path, dst)
        print("SRT saved to: %s" % dst)

    except subprocess.TimeoutExpired:
        print("ERROR: transcription took longer than 60 minutes and was stopped.")
    except Exception as exc:
        print("ERROR:", exc)
    finally:
        shutil.rmtree(workdir, ignore_errors=True)
        print("Done.")


if __name__ == "__main__":
    main()