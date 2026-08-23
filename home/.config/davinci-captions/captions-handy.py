#!/usr/bin/env python3
"""
Handy Captions — automatic captions for DaVinci Resolve (free edition).

Run from:   Workspace -> Scripts -> Utility -> Handy Captions
Pipeline:   Resolve renders the timeline audio (audio-only QuickTime/MP4) -> the bundled
            Node script (MediaBunny) resamples to 16 kHz mono, finds speech
            chunks via silence analysis, transcribes each chunk with the local
            Handy.app CLI (Parakeet Unified EN 0.6B) -> captions are added to
            the active timeline as styled Text+ titles, and the .srt is saved
            for optional native subtitle-track use (drag onto a subtitle track).

No cloud services, no ffmpeg, no Resolve Studio required.
"""

import json
import os
import select
import shutil
import subprocess
import sys
import tempfile
import time
import traceback

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
# Resolve runs menu scripts with exec(), where Python's __file__ is not defined.
# dot captions install writes the source resource directory next to the copied
# script so its Node pipeline and node_modules remain discoverable.
SCRIPT_PATH = globals().get("__file__")
RESOLVE_UTILITY_DIR = os.path.join(
    os.path.expanduser("~"), "Library", "Application Support",
    "Blackmagic Design", "DaVinci Resolve", "Fusion", "Scripts", "Utility",
)
RESOURCE_PATH_FILE = os.path.join(RESOLVE_UTILITY_DIR, "Handy Captions.resources")


def caption_resource_dir():
    if SCRIPT_PATH:
        return os.path.dirname(os.path.realpath(SCRIPT_PATH))
    try:
        with open(RESOURCE_PATH_FILE) as resource_file:
            path = resource_file.read().strip()
        if path:
            return path
    except OSError:
        pass
    return os.path.expanduser("~/.config/davinci-captions")


CAPTIONS_DIR = caption_resource_dir()
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
RUN_LOG_PATH = os.path.join(SRT_EXPORT_DIR, "handy-captions.log")
AUDIO_NAME = "handy_captions_audio"
CAPTION_TRACK_NAME = "Handy Captions"
STATUS_MARKER_DATA = "handy-captions-status"


def write_run_log(message):
    """Persist progress outside Resolve so a silent UI failure remains diagnosable."""
    try:
        os.makedirs(SRT_EXPORT_DIR, exist_ok=True)
        with open(RUN_LOG_PATH, "a", encoding="utf-8", errors="backslashreplace") as log:
            log.write("[%s] %s\n" % (time.strftime("%Y-%m-%d %H:%M:%S"), message))
    except Exception:
        pass


def notify(message):
    """Show an immediate macOS-level signal that Resolve launched the script."""
    try:
        escaped = message.replace("\\", "\\\\").replace('"', '\\"')
        subprocess.Popen([
            "/usr/bin/osascript", "-e",
            'display notification "%s" with title "Handy Captions"' % escaped,
        ])
    except Exception:
        pass


def get_resolve():
    """Connect in both Resolve's in-app exec() and normal Python contexts."""
    # Workspace > Scripts executes with Resolve/Fusion globals on supported builds.
    in_app_resolve = globals().get("resolve")
    if in_app_resolve is not None:
        write_run_log("Connected through Resolve's in-app resolve global.")
        return in_app_resolve
    in_app_fusion = globals().get("fusion")
    if in_app_fusion is not None:
        try:
            in_app_resolve = in_app_fusion.GetResolve()
            if in_app_resolve is not None:
                write_run_log("Connected through Resolve's in-app fusion global.")
                return in_app_resolve
        except Exception:
            pass

    try:
        import DaVinciResolveScript as dvr
        connected = dvr.scriptapp("Resolve")
        if connected is not None:
            write_run_log("Connected through DaVinciResolveScript import.")
            return connected
    except Exception:
        pass

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
                connected = dvr.scriptapp("Resolve")
                if connected is not None:
                    write_run_log("Connected through Resolve scripting module.")
                    return connected
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


class RunStatus:
    """Persist progress without touching Resolve UI while it is rendering."""

    def __init__(self, timeline):
        self.timeline = timeline
        self.frame = timeline.GetStartFrame()

    def update(self, message, color="Blue"):
        write_run_log(message)

    def complete(self, message):
        self.update(message, "Green")
        notify(message)

    def fail(self, message):
        self.update(message, "Red")
        notify(message)


def render_timeline_audio(project, target_dir, fps, status):
    """Export timeline audio in a MediaBunny-readable container. Returns path or None."""
    try:
        formats = project.GetRenderFormats() or {}
        write_run_log("Resolve render formats: %s" % formats)
        selected = None
        # Resolve 20.3 free exposes Wave but rejects it via this API. Use a
        # standard video container with video disabled; MediaBunny reads both.
        for container in ("QuickTime", "MP4"):
            if container not in formats:
                continue
            codecs = project.GetRenderCodecs(container) or {}
            write_run_log("Resolve codecs for %s: %s" % (container, codecs))
            preferred_codecs = [
                codec for description, codec in codecs.items()
                if "h.264" in str(description).lower() or "h264" in str(codec).lower()
            ]
            for codec in preferred_codecs + list(codecs.values()):
                write_run_log("Trying audio render format: %s / %s" % (container, codec))
                if project.SetCurrentRenderFormatAndCodec(container, codec):
                    selected = (container, codec)
                    break
            if selected:
                break
        if selected is None:
            status.fail("Resolve has no usable QuickTime/MP4 render setting; details are in the run log.")
            return None
        project.SetCurrentRenderMode(1)  # single clip, rather than one file per edit
        write_run_log("Audio render container: %s / %s" % selected)
    except Exception as exc:
        status.fail("Could not configure the audio render: %s" % exc)
        return None

    settings = {
        "SelectAllFrames": True,
        "TargetDir": target_dir,
        "CustomName": AUDIO_NAME,
        "ExportVideo": False,
        "ExportAudio": True,
        "AudioBitDepth": 16,
        "AudioSampleRate": 48000,
    }
    job_id = None
    try:
        if project.SetRenderSettings(settings):
            job_id = project.AddRenderJob()
    except Exception as exc:
        write_run_log("Could not add WAV render job: %s" % exc)
    if not job_id:
        status.fail("Could not create the audio render job.")
        return None

    if not project.StartRendering(job_id):
        status.fail("Audio render did not start.")
        return None

    status.update("Rendering timeline audio…")
    waited = 0
    while project.IsRenderingInProgress():
        time.sleep(0.5)
        waited += 0.5
        if int(waited) and int(waited) % 5 == 0 and waited == int(waited):
            try:
                job_status = project.GetRenderJobStatus(job_id) or {}
                write_run_log("Audio render status (%ss): %s" % (int(waited), job_status))
                status.update("Rendering timeline audio… %ss" % int(waited))
                if str(job_status.get("JobStatus", "")).lower() == "failed":
                    status.fail("Resolve audio render job failed.")
                    return None
            except Exception as exc:
                write_run_log("Could not read audio render status: %s" % exc)
        if waited > 60 * 60:
            status.fail("Audio render timed out after 60 minutes.")
            return None

    try:
        write_run_log("Completed audio render job: %s" % project.GetRenderJobStatus(job_id))
    except Exception as exc:
        write_run_log("Could not read completed audio render job: %s" % exc)
    write_run_log("Audio render ended; scanning output directory: %s" % target_dir)
    try:
        output_names = os.listdir(target_dir)
    except OSError as exc:
        status.fail("Could not read Resolve audio output directory: %s" % exc)
        return None
    matches = [
        os.path.join(target_dir, name) for name in output_names
        if name.lower().endswith((".wav", ".mov", ".mp4"))
    ]
    write_run_log("Audio render output candidates: %s" % matches)
    if not matches:
        try:
            write_run_log("Render output files: %s" % output_names)
        except Exception:
            pass
        status.fail("Audio render finished but no readable audio file was found.")
        return None
    status.update("Audio render complete; starting local transcription…")
    return matches[0]


def add_subtitle_captions(project, timeline, srt_path, status):
    """Inject the generated SRT into a dedicated subtitle track without touching video."""
    try:
        # Remove only the dedicated video track from earlier failed Text+ runs.
        for index in range(timeline.GetTrackCount("video"), 0, -1):
            if timeline.GetTrackName("video", index) == CAPTION_TRACK_NAME:
                timeline.DeleteTrack("video", index)
        for index in range(timeline.GetTrackCount("subtitle"), 0, -1):
            if timeline.GetTrackName("subtitle", index) == CAPTION_TRACK_NAME:
                timeline.DeleteTrack("subtitle", index)

        if not timeline.AddTrack("subtitle"):
            raise RuntimeError("Resolve could not add a subtitle track")
        index = timeline.GetTrackCount("subtitle")
        timeline.SetTrackName("subtitle", index, CAPTION_TRACK_NAME)

        mp = project.GetMediaPool()
        items = mp.ImportMedia([srt_path]) or []
        if not items:
            raise RuntimeError("Resolve could not import the generated SRT")
        placed = mp.AppendToTimeline([{
            "mediaPoolItem": items[0],
            "trackIndex": index,
            "recordFrame": timeline.GetStartFrame(),
        }])
        if not placed:
            raise RuntimeError("Resolve returned no subtitle timeline items")
        status.update("Injected %d subtitle item(s) into '%s'." % (
            len(placed), CAPTION_TRACK_NAME))
        return len(placed)
    except Exception as exc:
        write_run_log("Subtitle injection failed: %s" % exc)
        return 0


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
            tool.SetInput("Center", {1: 0.5, 2: 0.88})            # bottom-center
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


def get_or_create_caption_track(timeline):
    """Return the dedicated caption track, clearing clips from a prior run."""
    for index in range(1, timeline.GetTrackCount("video") + 1):
        try:
            if timeline.GetTrackName("video", index) != CAPTION_TRACK_NAME:
                continue
            items = timeline.GetItemListInTrack("video", index) or []
            if items:
                timeline.DeleteClips(items, False)
            return index
        except Exception as exc:
            print("Handy Captions: could not reuse track %d: %s" % (index, exc))

    timeline.AddTrack("video")
    index = timeline.GetTrackCount("video")
    try:
        timeline.SetTrackName("video", index, CAPTION_TRACK_NAME)
    except Exception as exc:
        print("Handy Captions: could not name caption track: %s" % exc)
    return index


def add_text_captions(timeline, cues, fps, status):
    """Directly inject one styled Text+ title per cue into the active timeline."""
    start_frame = timeline.GetStartFrame()
    track = get_or_create_caption_track(timeline)
    status.update("Injecting %d Text+ captions into %s…" % (len(cues), CAPTION_TRACK_NAME))
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
                status.update("Injecting captions: %d/%d…" % (count, len(cues)))
        except Exception as exc:
            print("title %d failed: %s" % (count, exc))
            continue
    print("Added %d/%d captions as Text+ titles on '%s' (video track %d)." % (
        placed, len(cues), CAPTION_TRACK_NAME, track))
    return placed


def main():
    write_run_log("Script invoked from Resolve.")
    notify("Started — connecting to Resolve…")
    resolve = get_resolve()
    if resolve is None:
        write_run_log("Could not connect to Resolve.")
        return
    pm = resolve.GetProjectManager()
    project = pm.GetCurrentProject()
    timeline = project.GetCurrentTimeline() if project else None
    if project is None or timeline is None:
        print("ERROR: open a project with an active timeline first.")
        write_run_log("No active project or timeline.")
        notify("Stopped — open a project and active timeline first.")
        return

    status = RunStatus(timeline)

    node = find_node()
    if node is None:
        status.fail("Node or Bun was not found. Run dot captions install.")
        return
    if not os.path.exists(NODE_SCRIPT):
        status.fail("captions-node.mjs was not found next to this script.")
        return

    try:
        fps = float(timeline.GetSetting("timelineFrameRate") or 24)
    except (TypeError, ValueError):
        fps = 24.0
    print("Timeline: %s | fps: %s | duration: %s frames" % (
        timeline.GetName(), fps, timeline.GetEndFrame() - timeline.GetStartFrame()))

    workdir = tempfile.mkdtemp(prefix="handy-captions-")
    try:
        status.update("Preparing audio render…")
        wav = render_timeline_audio(project, workdir, fps, status)
        if wav is None:
            return

        srt_path = os.path.join(workdir, "captions.srt")
        cues_path = os.path.join(workdir, "cues.json")
        status.update("Transcribing locally with Handy…")
        proc = subprocess.Popen(
            [node, NODE_SCRIPT, wav, srt_path, cues_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            encoding="utf-8",
            errors="replace",
            bufsize=1,
        )
        started = time.time()
        transcript_log = []
        while proc.poll() is None:
            if time.time() - started > 60 * 60:
                proc.kill()
                raise subprocess.TimeoutExpired(proc.args, 60 * 60)
            readable, _, _ = select.select([proc.stdout], [], [], 0.5)
            if not readable:
                continue
            line = proc.stdout.readline().rstrip()
            if not line:
                continue
            print(line)
            write_run_log("Node: %s" % line)
            transcript_log.append(line)
            # The marker stays short while the Console receives detailed progress.
            status.update("Transcribing locally with Handy…")
        for line in proc.stdout:
            line = line.rstrip()
            if line:
                print(line)
                write_run_log("Node: %s" % line)
                transcript_log.append(line)
        returncode = proc.wait()
        if returncode != 0:
            status.fail("Local transcription failed (exit %d)." % returncode)
            if transcript_log:
                print("\n".join(transcript_log[-30:]))
                write_run_log("Node failure output: %s" % " | ".join(transcript_log[-30:]))
            return

        if not os.path.exists(cues_path):
            status.fail("Transcription produced no cues.json.")
            return
        with open(cues_path) as f:
            cues = json.load(f).get("cues", [])

        if not cues:
            status.fail("No speech detected in the timeline — nothing to caption.")
            return

        # Keep the SRT somewhere reachable for drag-and-drop / uploads.
        os.makedirs(SRT_EXPORT_DIR, exist_ok=True)
        dst = os.path.join(SRT_EXPORT_DIR, "%s.srt" % timeline.GetName())
        shutil.copy2(srt_path, dst)
        print("SRT saved to: %s" % dst)
        print("Transcription complete: %d cues." % len(cues))
        placed = add_subtitle_captions(project, timeline, srt_path, status)
        if not placed:
            status.fail("Caption injection failed; SRT was saved to %s." % dst)
            return
        status.complete("Injected %d/%d captions into '%s'." % (
            placed, len(cues), CAPTION_TRACK_NAME))

    except subprocess.TimeoutExpired:
        status.fail("Transcription took longer than 60 minutes and was stopped.")
    except Exception as exc:
        write_run_log("Unhandled error: %s: %s" % (type(exc).__name__, exc))
        write_run_log(traceback.format_exc())
        status.fail("Failed — see Console for details.")
        print("ERROR:", exc)
    finally:
        shutil.rmtree(workdir, ignore_errors=True)
        print("Done.")


if __name__ == "__main__":
    main()
