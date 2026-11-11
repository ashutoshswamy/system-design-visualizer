"use client";

import { Toaster } from "sileo";
import { useVisualizerStore } from "@/lib/visualizer/store";

export function AppToaster() {
  const theme = useVisualizerStore((s) => s.theme);
  return <Toaster position="bottom-center" theme={theme} offset={{ bottom: 88 }} options={{ position: "bottom-center" }} />;
}
