import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CaptionWord } from "../types";

/** Shows 1-2 words at a time: the words whose window contains the current time. */
export const Captions: React.FC<{
  words: CaptionWord[];
  highlightColor: string;
}> = ({ words, highlightColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const idx = words.findIndex((w) => t >= w.start && t < w.end);
  if (idx === -1) return null;
  const w = words[idx];
  const pop = spring({
    frame: frame - Math.round(w.start * fps),
    fps,
    config: { damping: 12, stiffness: 200 },
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: 1180,
        textAlign: "center",
        fontFamily: "Arial Black, Impact, sans-serif",
        fontWeight: 900,
        fontSize: 110,
        textTransform: "uppercase",
        color: w.highlight ? highlightColor : "#fff",
        WebkitTextStroke: "6px #000",
        paintOrder: "stroke fill",
        transform: `scale(${0.7 + 0.3 * pop})`,
        textShadow: "0 6px 16px rgba(0,0,0,0.7)",
      }}
    >
      {w.text}
    </div>
  );
};
