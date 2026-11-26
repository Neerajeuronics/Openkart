import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { OffthreadVideo } from "remotion";
import "@fontsource/montserrat/800.css";
import "@fontsource/montserrat/600.css";
import { Captions } from "./components/Captions";
import { Headline } from "./components/Headline";
import { Overlays } from "./components/Overlays";
import type { ClipSegment, ReelProps } from "./types";

const FPS = 30;
const CARD_TOP = 470;
const CARD_H = 1020;
const CARD_W = 960;

/** Style that shows only `crop` of the source, scaled to cover the card. */
const coverStyle = (seg: ClipSegment): React.CSSProperties => {
  if (!seg.crop || !seg.srcW || !seg.srcH) {
    return { width: "100%", height: "100%", objectFit: "cover" };
  }
  const { crop } = seg;
  const k = Math.max(CARD_W / crop.w, CARD_H / crop.h);
  return {
    position: "absolute",
    width: seg.srcW * k,
    height: seg.srcH * k,
    left: -crop.x * k - (crop.w * k - CARD_W) / 2,
    top: -crop.y * k - (crop.h * k - CARD_H) / 2,
    maxWidth: "none",
  };
};

export const Reel: React.FC<ReelProps> = ({
  segments,
  headline,
  words,
  overlays,
  credit,
  brandName,
  accentColor,
  highlightColor,
}) => {
  let cursor = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* rounded video card, like the reference reels */}
      <div
        style={{
          position: "absolute",
          top: CARD_TOP,
          left: 60,
          right: 60,
          height: CARD_H,
          borderRadius: 56,
          overflow: "hidden",
          background: "#111",
        }}
      >
        {segments.map((seg, i) => {
          const dur = Math.max(1, Math.round((seg.to - seg.from) * FPS));
          const from = cursor;
          cursor += dur;
          return (
            <Sequence key={i} from={from} durationInFrames={dur} layout="none">
              <OffthreadVideo
                src={staticFile(seg.src)}
                startFrom={Math.round(seg.from * FPS)}
                style={coverStyle(seg)}
              />
            </Sequence>
          );
        })}
        {/* soft gradient so captions stay readable */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(transparent 55%, rgba(0,0,0,0.65))",
          }}
        />
      </div>

      <Headline segments={headline} highlightColor={highlightColor} />
      <Overlays overlays={overlays} highlightColor={highlightColor} accentColor={accentColor} />
      <Captions words={words} highlightColor={highlightColor} />

      <div
        style={{
          position: "absolute",
          top: CARD_TOP + CARD_H + 40,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "Montserrat, Arial, sans-serif",
          fontWeight: 600,
          fontSize: 32,
          color: "rgba(255,255,255,0.7)",
        }}
      >
        {credit}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 150,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "Montserrat, Arial, sans-serif",
          fontWeight: 800,
          fontSize: 40,
          letterSpacing: 6,
          textTransform: "uppercase",
          color: accentColor,
        }}
      >
        ✦ {brandName}
      </div>
    </AbsoluteFill>
  );
};
