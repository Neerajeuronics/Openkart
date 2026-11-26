# Civic Report reels

9:16 (1080x1920) reel template: top hook headline, word-by-word captions with
highlighted keywords, timed overlays (stat / badge / money rain), credit line
and brand footer.

## Make a reel
1. Put the clip in `public/clips/` (e.g. `public/clips/ep1.mp4`).
2. Copy `props.example.json` to `props/ep1.json`; set `videoSrc`, `durationSeconds`,
   `headline`, `words` (text + start/end seconds, `highlight: true` for key words),
   `overlays` and `credit`.
3. Preview: `npm run dev`, then pick the `Reel` composition.
4. Render: `npx remotion render Reel out/ep1.mp4 --props=props/ep1.json`

In a sandbox without internet, add
`--browser-executable=/opt/pw-browsers/chromium --chrome-mode=chrome-for-testing`.

Always credit the original creator in `credit`, and only use clips you have
the rights to repost.
