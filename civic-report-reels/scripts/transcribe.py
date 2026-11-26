#!/usr/bin/env python3
"""Transcribe a clip into a reel props JSON with word-level timings.

Usage:
  python scripts/transcribe.py public/clips/ep1.mp4 props/ep1.json \
      --headline "This is why most *businesses* fail" --credit @creator

Words wrapped in *asterisks* in --headline are highlighted. Spoken words that
match --highlight (comma separated) are highlighted in captions.
Needs: pip install faster-whisper   (model downloads from huggingface.co)
"""
import argparse, json, re, subprocess, sys
from pathlib import Path
from faster_whisper import WhisperModel

# Nudges Whisper to write Hindi in Roman letters (Hinglish) instead of Devanagari.
HINGLISH_PROMPT = "Yeh ek business podcast hai. Hum baat kar rahe hain paisa, business aur success ke baare mein."

def duration(path):
    out = subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path])
    return float(out)

def main():
    p = argparse.ArgumentParser()
    p.add_argument("video"); p.add_argument("out")
    p.add_argument("--model", default="small", help="tiny/base/small/medium/large-v3")
    p.add_argument("--language", default=None, help="en, hi ... (default: auto-detect)")
    p.add_argument("--hinglish", action="store_true", help="prefer Roman-script Hindi")
    p.add_argument("--headline", default="")
    p.add_argument("--highlight", default="", help="comma-separated words to highlight")
    p.add_argument("--credit", default="@original_creator")
    p.add_argument("--brand", default="Civic Report")
    a = p.parse_args()

    model = WhisperModel(a.model, compute_type="int8")
    segs, info = model.transcribe(
        a.video, language=a.language, word_timestamps=True, vad_filter=True,
        initial_prompt=HINGLISH_PROMPT if a.hinglish else None,
    )
    hl = {w.strip().lower() for w in a.highlight.split(",") if w.strip()}
    words = []
    for s in segs:
        for w in s.words:
            t = w.word.strip()
            if not t:
                continue
            clean = re.sub(r"\W", "", t).lower()
            words.append({"text": t, "start": round(w.start, 2), "end": round(w.end, 2),
                          **({"highlight": True} if clean in hl else {})})
    # let each word stay until the next one starts (no flicker in gaps < 0.4s)
    for i in range(len(words) - 1):
        if 0 < words[i + 1]["start"] - words[i]["end"] < 0.4:
            words[i]["end"] = words[i + 1]["start"]

    headline = []
    for part in re.split(r"(\*[^*]+\*)", a.headline):
        if part.strip():
            hi = part.startswith("*")
            headline.append({"text": part.strip("* ").strip(), **({"highlight": True} if hi else {})})

    props = {
        "videoSrc": str(Path(a.video).relative_to("public")) if a.video.startswith("public/") else a.video,
        "durationSeconds": round(duration(a.video), 2),
        "headline": headline, "words": words, "overlays": [],
        "credit": a.credit, "brandName": a.brand,
        "accentColor": "#ffd400", "highlightColor": "#ffd400",
    }
    Path(a.out).parent.mkdir(parents=True, exist_ok=True)
    Path(a.out).write_text(json.dumps(props, indent=2, ensure_ascii=False))
    print(f"language={info.language} words={len(words)} -> {a.out}")

if __name__ == "__main__":
    sys.exit(main())
