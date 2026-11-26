import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { Captions } from "./components/Captions";
import { Headline } from "./components/Headline";
import { Overlays } from "./components/Overlays";
import type { ReelProps } from "./types";

export const Reel: React.FC<ReelProps> = ({
  videoSrc,
  headline,
  words,
  overlays,
  credit,
  brandName,
  accentColor,
  highlightColor,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* video band sits between headline and footer, like the reference reels */}
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, height: 1260, overflow: "hidden", background: "#111" }}>
        {videoSrc ? (
          <OffthreadVideo
            src={staticFile(videoSrc)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : null}
      </div>

      <Headline segments={headline} highlightColor={highlightColor} />
      <Overlays overlays={overlays} highlightColor={highlightColor} accentColor={accentColor} />
      <Captions words={words} highlightColor={highlightColor} />

      {/* footer: credit + brand mark */}
      <div
        style={{
          position: "absolute",
          bottom: 90,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
          fontSize: 34,
          color: "rgba(255,255,255,0.8)",
        }}
      >
        credit :- {credit}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 30,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "Arial Black, Impact, sans-serif",
          fontSize: 38,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: accentColor,
        }}
      >
        ✦ {brandName}
      </div>
    </AbsoluteFill>
  );
};
