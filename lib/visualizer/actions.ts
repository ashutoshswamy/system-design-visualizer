import { sileo } from "sileo";
import type { CanvasHandle } from "@/components/visualizer/Canvas";
import { exportPNG, slugify } from "./export";
import { useVisualizerStore } from "./store";
import { THEMES } from "./theme";

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

/** User-facing commands shared by the toolbar and the keyboard shortcuts, each with its toast. */
export async function doExport(handle: CanvasHandle | null) {
  const { nodes, designName, theme } = useVisualizerStore.getState();
  const svg = handle?.getSvg();
  if (!svg) return;
  if (nodes.length === 0) {
    sileo.warning({ title: "Nothing to export", description: "Add a component to the canvas first." });
    return;
  }
  const filename = `${slugify(designName)}.png`;
  try {
    await exportPNG(svg, nodes, filename, THEMES[theme].bg);
    sileo.success({ title: "PNG exported", description: filename });
  } catch {
    sileo.error({ title: "Export failed", description: "The browser could not render the image. Try again." });
  }
}

export function doDelete() {
  const { selectedId, nodes, edges, deleteSelected } = useVisualizerStore.getState();
  if (!selectedId) return;
  const isNode = nodes.some((n) => n.id === selectedId);
  const dropped = isNode ? edges.filter((e) => e.from === selectedId || e.to === selectedId).length : 0;
  deleteSelected();
  sileo.info({
    title: isNode ? "Component deleted" : "Connection deleted",
    description: dropped ? `${plural(dropped, "connection")} removed with it.` : undefined,
  });
}

export function doGroup() {
  const { shiftSelectedIds, groupSelected } = useVisualizerStore.getState();
  if (shiftSelectedIds.length < 2) {
    sileo.warning({ title: "Select two or more", description: "Shift-click or drag a box around components to group them." });
    return;
  }
  groupSelected();
  sileo.success({ title: "Grouped", description: `${plural(shiftSelectedIds.length, "component")} now move together.` });
}

export function doUngroup() {
  const { nodes, selectedId, ungroup } = useVisualizerStore.getState();
  const node = nodes.find((n) => n.id === selectedId);
  if (!node?.groupId) return;
  ungroup(node.id);
  sileo.info({ title: "Ungrouped" });
}

/** Two-step clear: the toast carries the confirm button, so no browser dialog. */
export function askClear() {
  const { nodes, edges, clear } = useVisualizerStore.getState();
  if (nodes.length === 0) {
    sileo.info({ title: "Already empty" });
    return;
  }
  sileo.action({
    title: "Clear the whole diagram?",
    description: `${plural(nodes.length, "component")} and ${plural(edges.length, "connection")} will be removed.`,
    duration: 7000,
    button: {
      title: "Clear",
      onClick: () => {
        clear();
        sileo.success({ title: "Diagram cleared" });
      },
    },
  });
}
