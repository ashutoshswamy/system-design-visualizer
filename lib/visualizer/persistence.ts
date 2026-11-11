import { sileo } from "sileo";
import type { DesignState } from "./types";

const KEY = "system-design-visualizer:design";
let warned = false;

export function load(): DesignState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as DesignState) : null;
  } catch {
    return null;
  }
}

export function save(state: DesignState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    if (warned) return;
    warned = true;
    sileo.error({
      title: "Autosave is off",
      description: "Browser storage is full or blocked. Export a PNG to keep this diagram.",
    });
  }
}
