import type { DesignState } from "./types";

const KEY = "system-design-visualizer:design";

export function load(): DesignState | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DesignState;
  } catch {
    return null;
  }
}

export function save(state: DesignState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
}
