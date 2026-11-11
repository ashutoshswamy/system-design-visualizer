"use client";

import type { RefObject } from "react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { doExport } from "@/lib/visualizer/actions";
import { useVisualizerStore } from "@/lib/visualizer/store";
import type { CanvasHandle } from "./Canvas";

export function TopBar({ canvasRef }: { canvasRef: RefObject<CanvasHandle | null> }) {
  const { designName, setDesignName, nodes, edges } = useVisualizerStore();

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 sm:gap-4 [@media(max-height:500px)]:h-12 border-b border-line bg-panel px-4 sm:px-5">
      <div className="shrink-0">
        <Logo labelClass="hidden sm:inline" />
      </div>
      <label className="sr-only" htmlFor="design-name">
        Design name
      </label>
      <input
        id="design-name"
        value={designName}
        onChange={(e) => setDesignName(e.target.value)}
        placeholder="Name this design"
        className="h-10 min-w-0 flex-1 rounded-ui border border-line bg-ground px-3 font-display text-[15px] font-semibold text-ink outline-none transition-colors placeholder:text-muted focus:border-ink sm:w-48 sm:flex-none lg:w-64"
      />
      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-4">
        <span className="hidden text-[13px] tabular-nums text-muted xl:inline" aria-live="polite">
          {nodes.length} {nodes.length === 1 ? "component" : "components"}, {edges.length}{" "}
          {edges.length === 1 ? "connection" : "connections"}
        </span>
        <ThemeToggle />
        <button
          type="button"
          onClick={() => doExport(canvasRef.current)}
          className="h-10 shrink-0 rounded-ui bg-ink px-4 text-[14px] font-semibold text-on-ink transition-transform hover:-translate-y-px active:translate-y-0 active:scale-[0.98]"
        >
          Export PNG
        </button>
      </div>
    </header>
  );
}
