"""plans/<name>.json + library/*.json  ->  props/<name>.json  (input for the Reel composition)

Plan format:
{
  "headline": [{"text": "3 rules to win", "highlight": false}, ...],
  "credit": "@source", "brandName": "Civic Report",
  "captions": true,                 # false when the source clips already have burned-in captions
  "highlight": ["execution", ...],  # caption words to colour (numbers are always coloured)
  "fixes": {"karolo": "karod"},     # corrections for transcription mistakes
  "segments": [{"clip": "c10", "from": 0.9, "to": 5.4}, ...]
}
"""
import json, pathlib, re, subprocess, sys

root = pathlib.Path(__file__).resolve().parent.parent
plan = json.loads(pathlib.Path(sys.argv[1]).read_text())
fixes = {k.lower(): v for k, v in plan.get("fixes", {}).items()}
hl = {h.lower() for h in plan.get("highlight", [])}


def probe(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                          "stream=width,height", "-of", "csv=p=0", str(path)], capture_output=True, text=True).stdout
    w, h = out.strip().split(",")
    return int(w), int(h)


def detect_crop(path, at, dur):
    """Find the real picture area inside baked-in black bars."""
    r = subprocess.run(["ffmpeg", "-v", "info", "-ss", str(at), "-t", str(min(dur, 3)), "-i", str(path),
                        "-vf", "cropdetect=24:2:0", "-f", "null", "-"], capture_output=True, text=True).stderr
    m = re.findall(r"crop=(\d+):(\d+):(\d+):(\d+)", r)
    if not m:
        return None
    w, h, x, y = map(int, m[-1])
    return {"w": w, "h": h, "x": x, "y": y}


segments, words, cursor = [], [], 0.0
for s in plan["segments"]:
    clip = root / "public" / "clips" / f"{s['clip']}.mp4"
    lib = json.loads((root / "library" / f"{s['clip']}.json").read_text())
    sw, sh = probe(clip)
    dur = s["to"] - s["from"]
    seg = {"src": f"clips/{s['clip']}.mp4", "from": s["from"], "to": s["to"], "srcW": sw, "srcH": sh}
    crop = detect_crop(clip, s["from"], dur)
    if crop and crop["w"] * crop["h"] > 0.2 * sw * sh:
        seg["crop"] = crop
    segments.append(seg)
    for w in lib["words"]:
        if w["start"] >= s["from"] - 0.05 and w["end"] <= s["to"] + 0.1:
            raw = w["text"]
            key = re.sub(r"[^\w]", "", raw).lower()
            text = fixes.get(key, raw)
            clean = re.sub(r"[^\w]", "", text).lower()
            words.append({"text": text.rstrip(",.!?"), "start": round(cursor + max(0, w["start"] - s["from"]), 2),
                          "end": round(cursor + min(dur, w["end"] - s["from"]), 2),
                          "highlight": clean in hl or bool(re.search(r"\d", clean))})
    cursor += dur

props = {
    "segments": segments,
    "headline": plan["headline"],
    "words": words if plan.get("captions", True) else [],
    "overlays": plan.get("overlays", []),
    "credit": plan["credit"],
    "brandName": plan.get("brandName", "Civic Report"),
    "accentColor": plan.get("accentColor", "#ffd400"),
    "highlightColor": plan.get("highlightColor", "#ffd400"),
}
out = root / "props" / (pathlib.Path(sys.argv[1]).stem + ".json")
out.write_text(json.dumps(props, ensure_ascii=False, indent=1))
print("wrote", out, f"{cursor:.1f}s", len(words), "words")
