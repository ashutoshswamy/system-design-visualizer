import type { Theme } from "./store";

export interface ThemeColors {
  bg: string;
  panel2: string;
  border: string;
  text: string;
  muted: string;
  grid: string;
}

/** Literal hex per theme — the canvas SVG gets cloned for PNG export, so colors must be
 * baked-in attributes, not CSS var() (a detached/exported SVG has no document to resolve vars against). */
export const THEMES: Record<Theme, ThemeColors> = {
  dark: {
    bg: "#0a0a0b",
    panel2: "#1a1a1d",
    border: "#262629",
    text: "#e7e7ea",
    muted: "#86868c",
    grid: "#1c1c1f",
  },
  light: {
    bg: "#f4f4f3",
    panel2: "#ffffff",
    border: "#d8d8d5",
    text: "#1a1a1d",
    muted: "#8a8a8f",
    grid: "#e2e2df",
  },
};
