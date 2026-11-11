import type { Theme } from "./store";

export interface ThemeColors {
  bg: string;
  panel2: string;
  border: string;
  text: string;
  muted: string;
  grid: string;
  ink: string;
}

/** Literal hex per theme: the canvas SVG gets cloned for PNG export, so colors must be
 * baked-in values, not var() (a detached/exported SVG has no document to resolve vars against). */
export const THEMES: Record<Theme, ThemeColors> = {
  dark: {
    bg: "#0e1117",
    panel2: "#1d222c",
    border: "#2a303c",
    text: "#eef0f4",
    muted: "#9aa2b3",
    grid: "#1c212b",
    ink: "#eef0f4",
  },
  light: {
    bg: "#f4f5f7",
    panel2: "#ffffff",
    border: "#d9dce3",
    text: "#12151c",
    muted: "#565d6e",
    grid: "#dde0e7",
    ink: "#12151c",
  },
};

/** Same slots as THEMES, resolved by the browser: for on-page SVG that is never exported. */
export const CSS_THEME: ThemeColors = {
  bg: "var(--ground)",
  panel2: "var(--panel)",
  border: "var(--line)",
  text: "var(--ink)",
  muted: "var(--muted)",
  grid: "var(--line)",
  ink: "var(--ink)",
};
