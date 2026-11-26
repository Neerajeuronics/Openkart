import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CaptionWord } from "../types";

const MAX_WORDS = 3;

/** Groups words into short phrases; shows the phrase active now, with already-spoken words lit. */
export const Captions: React.FC<{
  words: CaptionWord[];
  highlightColor: string;
}> = ({ words, highlightColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const groups: CaptionWord[][] = [];
  for (const w of words) {
    const last = groups[groups.length - 1];
    const gap = last ? w.start - last[last.length - 1].end : 99;
    if (last && last.length < MAX_WORDS && gap < 0.4) last.push(w);
    else groups.push([w]);
  }
  const g = groups.find(
    (grp, i) =>
      t >= grp[0].start &&
      t < (groups[i + 1] ? groups[i + 1][0].start : grp[grp.length - 1].end + 0.3),
  );
  if (!g) return null;
  const pop = spring({
    frame: frame - Math.round(g[0].start * fps),
    fps,
    config: { damping: 14, stiffness: 220 },
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        right: 90,
        top: 1330,
        textAlign: "center",
        fontFamily: "Montserrat, Arial, sans-serif",
        fontWeight: 800,
        fontSize: 78,
        lineHeight: 1.1,
        transform: `scale(${0.85 + 0.15 * pop})`,
        textShadow: "0 4px 14px rgba(0,0,0,0.85), 0 0 4px rgba(0,0,0,0.9)",
      }}
    >
      {g.map((w, i) => (
        <span
          key={i}
          style={{
            color: w.highlight ? highlightColor : "#fff",
            opacity: t >= w.start ? 1 : 0.45,
          }}
        >
          {w.text}{" "}
        </span>
      ))}
    </div>
  );
};
