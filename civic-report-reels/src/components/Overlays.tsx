import {
  AbsoluteFill,
  Sequence,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Overlay } from "../types";

const Stat: React.FC<{ label?: string; value: string; color: string }> = ({
  label,
  value,
  color,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 10, stiffness: 150 } });
  return (
    <div
      style={{
        position: "absolute",
        top: 560,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: "Arial Black, Impact, sans-serif",
        transform: `scale(${s})`,
      }}
    >
      {label ? (
        <div style={{ fontSize: 64, color: "#fff", textTransform: "uppercase", WebkitTextStroke: "4px #000", paintOrder: "stroke fill" }}>
          {label}
        </div>
      ) : null}
      <div style={{ fontSize: 190, color, WebkitTextStroke: "8px #000", paintOrder: "stroke fill" }}>
        {value}
      </div>
    </div>
  );
};

const Badge: React.FC<{ text: string; color: string }> = ({ text, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 200 } });
  return (
    <div
      style={{
        position: "absolute",
        top: 700,
        right: 60,
        padding: "18px 36px",
        borderRadius: 24,
        background: color,
        color: "#000",
        fontFamily: "Arial Black, Impact, sans-serif",
        fontSize: 54,
        textTransform: "uppercase",
        transform: `translateX(${interpolate(s, [0, 1], [300, 0])}px)`,
        opacity: s,
      }}
    >
      {text}
    </div>
  );
};

const MoneyRain: React.FC = () => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(28).fill(0).map((_, i) => {
        const x = random(`x${i}`) * 1000;
        const speed = 10 + random(`s${i}`) * 14;
        const delay = random(`d${i}`) * 20;
        const y = ((frame + delay) * speed) % (height + 200) - 100;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              fontSize: 70,
              transform: `rotate(${frame * 4 + i * 40}deg)`,
            }}
          >
            💸
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const Overlays: React.FC<{
  overlays: Overlay[];
  highlightColor: string;
  accentColor: string;
}> = ({ overlays, highlightColor, accentColor }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {overlays.map((o, i) => (
        <Sequence
          key={i}
          from={Math.round(o.start * fps)}
          durationInFrames={Math.max(1, Math.round((o.end - o.start) * fps))}
          layout="none"
        >
          {o.type === "stat" ? (
            <Stat label={o.label} value={o.value} color={highlightColor} />
          ) : o.type === "badge" ? (
            <Badge text={o.text} color={accentColor} />
          ) : (
            <MoneyRain />
          )}
        </Sequence>
      ))}
    </>
  );
};
