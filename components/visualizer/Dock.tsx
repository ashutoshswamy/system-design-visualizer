"use client";

import { askClear, doDelete, doGroup, doUngroup } from "@/lib/visualizer/actions";
import { useVisualizerStore, VIEW_W } from "@/lib/visualizer/store";

const btn =
  "flex h-9 items-center gap-2 rounded-ui px-2 sm:px-3 text-[13px] font-medium text-ink transition-colors hover:bg-panel-2 disabled:pointer-events-none disabled:opacity-40";
const kbd = "hidden rounded-[4px] bg-panel-2 px-1.5 py-0.5 text-[11px] font-medium text-muted lg:inline";

/** Floating tool dock over the canvas: selection actions, clear, zoom. */
export function Dock() {
  const { nodes, selectedId, shiftSelectedIds, viewBox, zoomIn, zoomOut, zoomReset } = useVisualizerStore();
  const selectedNode = nodes.find((n) => n.id === selectedId);
  const zoomPct = Math.round((VIEW_W / viewBox.w) * 100);
  const sep = <span aria-hidden className="mx-1 h-5 w-px shrink-0 bg-line" />;

  return (
    <div
      role="toolbar"
      aria-label="Canvas tools"
      className="thin-scroll absolute bottom-4 left-1/2 flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-0.5 overflow-x-auto rounded-panel border border-line bg-panel p-1.5 shadow-[0_8px_24px_-8px_rgb(var(--shadow)/0.28)]"
    >
      <button className={btn} onClick={doGroup} disabled={shiftSelectedIds.length < 2}>
        Group<span className={kbd}>⌘G</span>
      </button>
      <button className={btn} onClick={doUngroup} disabled={!selectedNode?.groupId}>
        Ungroup<span className={kbd}>⌘⇧G</span>
      </button>
      <button className={btn} onClick={doDelete} disabled={!selectedId}>
        Delete<span className={kbd}>Del</span>
      </button>
      {sep}
      <button className={btn} onClick={askClear} disabled={nodes.length === 0}>
        Clear<span className={kbd}>⌘⇧⌫</span>
      </button>
      {sep}
      <button className={`${btn} w-9 justify-center px-0 text-base`} onClick={zoomOut} aria-label="Zoom out" title="Zoom out (⌘-)">
        −
      </button>
      <button className={`${btn} w-14 justify-center px-0 tabular-nums`} onClick={zoomReset} title="Reset zoom (⌘0)">
        {zoomPct}%
      </button>
      <button className={`${btn} w-9 justify-center px-0 text-base`} onClick={zoomIn} aria-label="Zoom in" title="Zoom in (⌘+)">
        +
      </button>
    </div>
  );
}
