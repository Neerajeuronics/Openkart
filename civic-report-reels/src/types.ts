export type HeadlineSegment = { text: string; highlight?: boolean };

export type CaptionWord = {
  text: string;
  /** seconds from clip start */
  start: number;
  end: number;
  /** render this word in the highlight colour */
  highlight?: boolean;
};

export type Overlay =
  | { type: "stat"; label?: string; value: string; start: number; end: number }
  | { type: "badge"; text: string; start: number; end: number }
  | { type: "money"; start: number; end: number };

export type ReelProps = {
  /** file inside public/, e.g. "clips/sample.mp4"; empty string = placeholder background */
  videoSrc: string;
  durationSeconds: number;
  headline: HeadlineSegment[];
  words: CaptionWord[];
  overlays: Overlay[];
  /** e.g. "@podcastwithme3" */
  credit: string;
  brandName: string;
  accentColor: string;
  highlightColor: string;
};
