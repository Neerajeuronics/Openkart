import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { HeadlineSegment } from "../types";

export const Headline: React.FC<{
  segments: HeadlineSegment[];
  highlightColor: string;
}> = ({ segments, highlightColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 200 } });
  return (
    <div
      style={{
        position: "absolute",
        top: 150,
        left: 50,
        right: 50,
        textAlign: "center",
        fontFamily: "Arial Black, Impact, sans-serif",
        fontWeight: 900,
        fontSize: 72,
        lineHeight: 1.1,
        textTransform: "uppercase",
        color: "#fff",
        opacity: interpolate(s, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(s, [0, 1], [-30, 0])}px)`,
        textShadow: "0 4px 12px rgba(0,0,0,0.6)",
      }}
    >
      {segments.map((seg, i) => (
        <span key={i} style={{ color: seg.highlight ? highlightColor : "#fff" }}>
          {seg.text}{" "}
        </span>
      ))}
    </div>
  );
};
