"use client";

import { useEffect, useRef } from "react";
import { sileo } from "sileo";
import { exampleDesign, getExample } from "@/lib/examples";
import { askClear, doDelete, doExport, doGroup, doUngroup } from "@/lib/visualizer/actions";
import { useVisualizerStore } from "@/lib/visualizer/store";
import { Canvas, type CanvasHandle } from "./Canvas";
import { Dock } from "./Dock";
import { NodeEditModal } from "./NodeEditModal";
import { Palette } from "./Palette";
import { TopBar } from "./TopBar";

export function Visualizer() {
  const canvasRef = useRef<CanvasHandle>(null);
  const hydrate = useVisualizerStore((s) => s.hydrate);
  const hydrated = useVisualizerStore((s) => s.hydrated);
  const empty = useVisualizerStore((s) => s.nodes.length === 0);

  useEffect(() => {
    hydrate();
    // /editor?example=slug opens a worked example; never overwrite existing work without asking
    const ex = getExample(new URLSearchParams(window.location.search).get("example") ?? "");
    if (!ex) return;
    window.history.replaceState(null, "", "/editor");
    const { nodes, loadDesign } = useVisualizerStore.getState();
    const d = exampleDesign(ex);
    if (nodes.length === 0) {
      loadDesign(d.name, d.nodes, d.edges);
      sileo.success({ title: "Example loaded", description: d.name });
    } else {
      sileo.action({
        title: `Replace your diagram with the ${d.name} example?`,
        description: "Your current diagram will be overwritten.",
        duration: 8000,
        button: { title: "Replace", onClick: () => (loadDesign(d.name, d.nodes, d.edges), sileo.success({ title: "Example loaded" })) },
      });
    }
  }, [hydrate]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      const inField = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      const mod = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();
      const { zoomIn, zoomOut, zoomReset } = useVisualizerStore.getState();

      if ((e.key === "Delete" || e.key === "Backspace") && !inField && !mod) return doDelete();
      if (mod && e.key === "Backspace") {
        e.preventDefault();
        return askClear();
      }
      if (mod && e.shiftKey && key === "g") {
        e.preventDefault();
        return doUngroup();
      }
      if (mod && key === "g") {
        e.preventDefault();
        return doGroup();
      }
      if (mod && e.shiftKey && key === "e") {
        e.preventDefault();
        return void doExport(canvasRef.current);
      }
      if (mod && (e.key === "=" || e.key === "+")) {
        e.preventDefault();
        return zoomIn();
      }
      if (mod && e.key === "-") {
        e.preventDefault();
        return zoomOut();
      }
      if (mod && e.key === "0") {
        e.preventDefault();
        zoomReset();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!hydrated)
    return (
      <div className="h-dvh bg-ground p-6" aria-busy>
        <h1 className="font-display text-2xl font-bold">System design diagram editor</h1>
        <noscript>
          <p className="mt-2 text-muted">This editor needs JavaScript to draw and export diagrams.</p>
        </noscript>
      </div>
    );

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <h1 className="sr-only">System design diagram editor</h1>
      <TopBar canvasRef={canvasRef} />
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <main className="relative min-h-0 min-w-0 flex-1">
          <Canvas ref={canvasRef} />
          {empty && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
              <div className="max-w-sm rounded-panel border border-line bg-panel p-6 shadow-[0_8px_24px_-8px_rgb(var(--shadow)/0.2)]">
                <h2 className="font-display text-2xl font-bold tracking-tight text-ink">An empty map</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">
                  Drag a component in from the left, then pull from the dot on its right edge to draw a line to the next
                  one. Double-click any component to rename it or set its status.
                </p>
              </div>
            </div>
          )}
          <Dock />
        </main>
        <Palette />
      </div>
      <NodeEditModal />
    </div>
  );
}
