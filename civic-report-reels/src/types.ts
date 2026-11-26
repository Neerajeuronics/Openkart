export type HeadlineSegment = { text: string; highlight?: boolean };

export type CaptionWord = {
  text: string;
  /** seconds on the OUTPUT timeline */
  start: number;
  end: number;
  highlight?: boolean;
};

/** One cut of source footage, played back-to-back. Times in seconds. */
export type Crop = { w: number; h: number; x: number; y: number };
export type ClipSegment = {
  src: string;
  from: number;
  to: number;
  /** source pixel size, needed together with crop */
  srcW?: number;
  srcH?: number;
  /** real picture area inside baked-in black bars */
  crop?: Crop;
};

export type Overlay =
  | { type: "stat"; label?: string; value: string; start: number; end: number }
  | { type: "badge"; text: string; start: number; end: number }
  | { type: "money"; start: number; end: number };

export type ReelProps = {
  segments: ClipSegment[];
  headline: HeadlineSegment[];
  words: CaptionWord[];
  overlays: Overlay[];
  /** e.g. "@visionaryindians" - shown as credit under the card */
  credit: string;
  brandName: string;
  accentColor: string;
  highlightColor: string;
};
