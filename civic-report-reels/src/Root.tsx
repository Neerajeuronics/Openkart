import { Composition } from "remotion";
import { Reel } from "./Reel";
import type { ReelProps } from "./types";

const defaultProps: ReelProps = {
  segments: [{ src: "clips/c01.mp4", from: 0, to: 8 }],
  headline: [{ text: "Success is" }, { text: "personal", highlight: true }, { text: "💸" }],
  words: [
    { text: "You", start: 0.3, end: 0.6 },
    { text: "can", start: 0.6, end: 0.9 },
    { text: "do", start: 0.9, end: 1.2 },
    { text: "so big", start: 1.2, end: 2.0, highlight: true },
  ],
  overlays: [],
  credit: "@source_creator",
  brandName: "Civic Report",
  accentColor: "#ffd400",
  highlightColor: "#ffd400",
};

const FPS = 30;
const total = (p: ReelProps) =>
  Math.max(1, p.segments.reduce((a, s) => a + Math.round((s.to - s.from) * FPS), 0));

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Reel"
    component={Reel}
    width={1080}
    height={1920}
    fps={FPS}
    durationInFrames={total(defaultProps)}
    defaultProps={defaultProps}
    calculateMetadata={({ props }) => ({ durationInFrames: total(props) })}
  />
);
