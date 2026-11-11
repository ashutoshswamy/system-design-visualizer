/**
 * The mark: one line leaves a start stop, forks at 45 degrees, and ends in two stations.
 * 32x32 box. Everything strokes/fills with currentColor, so it follows the theme's ink.
 * (public/icon-light.svg and icon-dark.svg are the static tile versions of the same shapes; keep them in sync.)
 */
export const LOGO = {
  start: { cx: 4.5, cy: 16, r: 3 },
  lines: "M7.5 16H11L16 11H22.5 M11 16L16 21H22.5",
  stations: [
    { cx: 25.5, cy: 11, r: 3 },
    { cx: 25.5, cy: 21, r: 3 },
  ],
  lineWidth: 3.2,
  ringWidth: 2.8,
} as const;
