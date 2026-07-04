"use client";

import type { RefObject } from "react";
import { CANVAS_W } from "@/lib/visualizer/constants";
import { exportPNG, slugify } from "@/lib/visualizer/export";
import { useVisualizerStore } from "@/lib/visualizer/store";
import { THEMES } from "@/lib/visualizer/theme";
import type { CanvasHandle } from "./Canvas";

export function Toolbar({ canvasRef }: { canvasRef: RefObject<CanvasHandle | null> }) {
  const {
    deleteSelected,
    clear,
    nodes,
    edges,
    selectedId,
    shiftSelectedIds,
    groupSelected,
    ungroup,
    designName,
    setDesignName,
    viewBox,
    zoomIn,
    zoomOut,
    zoomReset,
    theme,
    setTheme,
  } = useVisualizerStore();
  const selectedNode = nodes.find((n) => n.id === selectedId);
  const zoomPct = Math.round((CANVAS_W / viewBox.w) * 100);

  function onExport() {
    const svg = canvasRef.current?.getSvg();
    if (svg) exportPNG(svg, nodes, `${slugify(designName)}.png`, THEMES[theme].bg);
  }

  function onClear() {
    if (window.confirm("Clear the entire diagram?")) clear();
  }

  const btn =
    "px-3 py-1.5 rounded-sm border border-[var(--border-c)] text-sm font-mono text-[var(--foreground)] transition-colors hover:border-[#f0b429] disabled:opacity-35 disabled:hover:border-[var(--border-c)]";
  const zbtn =
    "flex h-7 w-7 items-center justify-center rounded-sm border border-[var(--border-c)] text-sm font-mono text-[var(--foreground)] transition-colors hover:border-[#f0b429]";
  const kbd = "ml-1.5 text-[10px] text-[var(--muted-2)]";
  const themeBtn = (t: "dark" | "light") =>
    `px-2 py-1 rounded-sm border text-[11px] font-mono transition-colors ${
      theme === t
        ? "border-[#f0b429] text-[var(--foreground)]"
        : "border-[var(--border-c)] text-[var(--muted)] hover:text-[var(--foreground)]"
    }`;

  const sep = "h-4 w-px shrink-0 bg-[var(--border-c)]";

  return (
    <div className="thin-scroll flex items-center gap-3 overflow-x-auto whitespace-nowrap border-b border-[var(--border-c)] bg-[var(--panel)] px-4 py-2.5">
      <div className="flex shrink-0 items-center gap-2 pr-3">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#f0b429]" />
        <span className="text-[13px] font-semibold tracking-wide text-[var(--foreground)]">
          system design visualizer
        </span>
      </div>

      <div className={sep} />

      <input
        value={designName}
        onChange={(e) => setDesignName(e.target.value)}
        placeholder="design name"
        className="w-36 shrink-0 rounded-sm border border-[var(--border-c)] bg-[var(--panel-2)] px-2 py-1.5 text-[13px] text-[var(--foreground)] outline-none focus:border-[#f0b429] sm:w-44"
      />

      <div className={sep} />

      <div className="flex shrink-0 items-center gap-2">
        <button className={btn} onClick={deleteSelected} disabled={!selectedId}>
          Delete<span className={kbd}>Del</span>
        </button>
        <button className={btn} onClick={groupSelected} disabled={shiftSelectedIds.length < 2}>
          Group<span className={kbd}>⌘G</span>
        </button>
        <button className={btn} onClick={() => selectedNode && ungroup(selectedNode.id)} disabled={!selectedNode?.groupId}>
          Ungroup<span className={kbd}>⌘⇧G</span>
        </button>
      </div>

      <div className={sep} />

      <button className={`${btn} shrink-0`} onClick={onClear}>
        Clear<span className={kbd}>⌘⇧⌫</span>
      </button>

      <div className={sep} />

      <div className="flex shrink-0 items-center gap-1">
        <button className={zbtn} onClick={zoomOut} title="Zoom out (⌘-)">
          −
        </button>
        <button
          className="w-12 text-center text-[12px] text-[var(--muted)] hover:text-[var(--foreground)]"
          onClick={zoomReset}
          title="Reset zoom (⌘0)"
        >
          {zoomPct}%
        </button>
        <button className={zbtn} onClick={zoomIn} title="Zoom in (⌘+)">
          +
        </button>
      </div>

      <div className={sep} />

      <div className="flex shrink-0 items-center gap-1">
        <button className={themeBtn("dark")} onClick={() => setTheme("dark")}>
          Dark
        </button>
        <button className={themeBtn("light")} onClick={() => setTheme("light")}>
          Light
        </button>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-4 pl-3">
        <span className="hidden text-[11px] text-[var(--muted-2)] sm:inline">
          {nodes.length} node{nodes.length === 1 ? "" : "s"} · {edges.length} edge{edges.length === 1 ? "" : "s"}
        </span>
        <button className={`${btn} shrink-0 border-[#f0b429]/40`} onClick={onExport}>
          Export PNG<span className={kbd}>⌘⇧E</span>
        </button>
      </div>
    </div>
  );
}
