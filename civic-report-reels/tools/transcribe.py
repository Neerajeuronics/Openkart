"""Transcribe every clip in public/clips to library/<id>.json (word timestamps)."""
import json, subprocess, pathlib
import numpy as np
from faster_whisper import WhisperModel

root = pathlib.Path(__file__).resolve().parent.parent
clips = sorted((root / "public" / "clips").glob("*.mp4"))
def load_audio(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32)


model = WhisperModel("small", device="cpu", compute_type="int8")
PROMPT = "Yeh ek Hinglish business podcast hai. Roman script mein likho: business, paisa, crore, startup, brand."
for c in clips:
    out = root / "library" / f"{c.stem}.json"
    if out.exists():
        continue
    segs, info = model.transcribe(load_audio(c), word_timestamps=True, vad_filter=True,
                                  language=None, initial_prompt=PROMPT)
    words, text = [], []
    for s in segs:
        text.append(s.text.strip())
        for w in s.words or []:
            words.append({"text": w.word.strip(), "start": round(w.start, 2), "end": round(w.end, 2)})
    out.write_text(json.dumps({"id": c.stem, "language": info.language, "duration": round(info.duration, 2),
                               "text": " ".join(text), "words": words}, ensure_ascii=False, indent=1))
    print("done", c.stem, info.language, len(words), flush=True)
