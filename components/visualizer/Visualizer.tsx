"use client";

import { useEffect, useRef } from "react";
import { exportPNG, slugify } from "@/lib/visualizer/export";
import { useVisualizerStore } from "@/lib/visualizer/store";
import { THEMES } from "@/lib/visualizer/theme";
import { Canvas, type CanvasHandle } from "./Canvas";
import { NodeEditModal } from "./NodeEditModal";
import { Palette } from "./Palette";
import { Toolbar } from "./Toolbar";

export function Visualizer() {
  const canvasRef = useRef<CanvasHandle>(null);
  const { hydrate, hydrated } = useVisualizerStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const inInput = (e.target as HTMLElement)?.tagName === "INPUT";
      const mod = e.metaKey || e.ctrlKey;
      const {
        deleteSelected,
        groupSelected,
        ungroup,
        selectedId,
        nodes,
        designName,
        clear,
        zoomIn,
        zoomOut,
        zoomReset,
        theme,
      } = useVisualizerStore.getState();

      if ((e.key === "Delete" || e.key === "Backspace") && !inInput && !mod) {
        deleteSelected();
        return;
      }
      if (mod && e.key === "Backspace") {
        e.preventDefault();
        if (window.confirm("Clear the entire diagram?")) clear();
        return;
      }
      if (mod && e.shiftKey && e.key.toLowerCase() === "g") {
        e.preventDefault();
        const node = nodes.find((n) => n.id === selectedId);
        if (node) ungroup(node.id);
        return;
      }
      if (mod && e.key.toLowerCase() === "g") {
        e.preventDefault();
        groupSelected();
        return;
      }
      if (mod && e.shiftKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        const svg = canvasRef.current?.getSvg();
        if (svg) exportPNG(svg, nodes, `${slugify(designName)}.png`, THEMES[theme].bg);
        return;
      }
      if (mod && (e.key === "=" || e.key === "+")) {
        e.preventDefault();
        zoomIn();
        return;
      }
      if (mod && e.key === "-") {
        e.preventDefault();
        zoomOut();
        return;
      }
      if (mod && e.key === "0") {
        e.preventDefault();
        zoomReset();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!hydrated) return null;

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Toolbar canvasRef={canvasRef} />
      <div className="flex flex-1 min-h-0">
        <Palette />
        <div className="flex-1 min-w-0">
          <Canvas ref={canvasRef} />
        </div>
      </div>
      <NodeEditModal />
    </div>
  );
}
