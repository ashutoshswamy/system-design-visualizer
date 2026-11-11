"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useVisualizerStore } from "@/lib/visualizer/store";

/** Mirrors the <html data-theme> set by the boot script into the store, follows the OS when the
 * preference is "system", and keeps the favicon in step with the site's theme (not just the OS's). */
export function ThemeSync() {
  const theme = useVisualizerStore((s) => s.theme);
  const pathname = usePathname(); // Next re-emits its own icon links on navigation

  useEffect(() => {
    const { syncTheme, setThemePref } = useVisualizerStore.getState();
    syncTheme();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (useVisualizerStore.getState().themePref === "system") setThemePref("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    document.querySelectorAll('link[rel~="icon"]').forEach((l) => l.remove());
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/svg+xml";
    link.href = `/icon-${theme}.svg`;
    document.head.appendChild(link);
  }, [theme, pathname]);

  return null;
}
