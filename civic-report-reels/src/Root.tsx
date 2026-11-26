import { Composition } from "remotion";
import { Reel } from "./Reel";
import type { ReelProps } from "./types";

const defaultProps: ReelProps = {
  videoSrc: "",
  durationSeconds: 8,
  headline: [
    { text: "This is why most" },
    { text: "businesses", highlight: true },
    { text: "fail" },
  ],
  words: [
    { text: "Most", start: 0.3, end: 0.8 },
    { text: "businesses", start: 0.8, end: 1.5, highlight: true },
    { text: "fail", start: 1.5, end: 2.1 },
    { text: "because", start: 2.1, end: 2.7 },
    { text: "of", start: 2.7, end: 3.0 },
    { text: "no", start: 3.0, end: 3.4 },
    { text: "systems", start: 3.4, end: 4.2, highlight: true },
  ],
  overlays: [
    { type: "stat", label: "Annual income", value: "3-4 Lakh+", start: 4.4, end: 6.4 },
    { type: "badge", text: "Civic Report", start: 1.0, end: 3.5 },
    { type: "money", start: 6.4, end: 8 },
  ],
  credit: "@yourhandle",
  brandName: "Civic Report",
  accentColor: "#ffd400",
  highlightColor: "#ffd400",
};

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Reel"
    component={Reel}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={Math.round(defaultProps.durationSeconds * 30)}
    defaultProps={defaultProps}
    calculateMetadata={({ props }) => ({
      durationInFrames: Math.max(1, Math.round(props.durationSeconds * 30)),
    })}
  />
);
