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
        top: 300,
        left: 70,
        right: 70,
        textAlign: "center",
        fontFamily: "Montserrat, Arial, sans-serif",
        fontWeight: 800,
        fontSize: 56,
        lineHeight: 1.2,
        color: "#fff",
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [-24, 0])}px)`,
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
