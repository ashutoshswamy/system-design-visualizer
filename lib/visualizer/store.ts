import { create } from "zustand";
import { CANVAS_H, CANVAS_W, STATUS_ORDER } from "./constants";
import { load, save } from "./persistence";
import type { DesignEdge, DesignNode, NodeStatus, NodeType } from "./types";

export type Theme = "dark" | "light";
const THEME_KEY = "system-design-visualizer:theme";

export interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 1.2;

let saveTimer: ReturnType<typeof setTimeout> | null = null;

interface VisualizerState {
  nodes: DesignNode[];
  edges: DesignEdge[];
  designName: string;
  selectedId: string | null;
  shiftSelectedIds: string[];
  editingId: string | null;
  viewBox: ViewBox;
  theme: Theme;
  hydrated: boolean;
  hydrate: () => void;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  addNode: (type: NodeType, x: number, y: number) => void;
  moveNode: (id: string, dx: number, dy: number) => void;
  renameNode: (id: string, label: string) => void;
  setStatus: (id: string, status: NodeStatus) => void;
  cycleStatus: (id: string) => void;
  setDesignName: (name: string) => void;
  select: (id: string | null) => void;
  toggleShiftSelect: (id: string) => void;
  selectMany: (ids: string[]) => void;
  groupSelected: () => void;
  ungroup: (id: string) => void;
  connectNodes: (from: string, to: string) => void;
  setEditing: (id: string | null) => void;
  deleteSelected: () => void;
  clear: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomReset: () => void;
  zoomAt: (cx: number, cy: number, factor: number) => void;
  panBy: (dx: number, dy: number) => void;
}

const DEFAULT_VIEWBOX: ViewBox = { x: 0, y: 0, w: CANVAS_W, h: CANVAS_H };

function clampWidth(w: number) {
  return Math.min(CANVAS_W / MIN_ZOOM, Math.max(CANVAS_W / MAX_ZOOM, w));
}

function zoomBy(viewBox: ViewBox, factor: number): ViewBox {
  const cx = viewBox.x + viewBox.w / 2;
  const cy = viewBox.y + viewBox.h / 2;
  const w = clampWidth(viewBox.w / factor);
  const h = (w * CANVAS_H) / CANVAS_W;
  return { x: cx - w / 2, y: cy - h / 2, w, h };
}

/** Zoom around a fixed canvas point (cx, cy) — keeps that point under the cursor. */
function zoomAtPoint(viewBox: ViewBox, cx: number, cy: number, factor: number): ViewBox {
  const w = clampWidth(viewBox.w / factor);
  const h = (w * CANVAS_H) / CANVAS_W;
  const ratio = w / viewBox.w;
  return { x: cx - (cx - viewBox.x) * ratio, y: cy - (cy - viewBox.y) * ratio, w, h };
}

export const useVisualizerStore = create<VisualizerState>((set, get) => {
  function persistNow() {
    const { nodes, edges, designName } = get();
    save({ nodes, edges, name: designName });
  }
  function persist() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(persistNow, 300);
  }

  return {
    nodes: [],
    edges: [],
    designName: "Untitled Design",
    selectedId: null,
    shiftSelectedIds: [],
    editingId: null,
    viewBox: DEFAULT_VIEWBOX,
    theme: "dark",
    hydrated: false,

    hydrate: () => {
      const loaded = load();
      const theme = (window.localStorage.getItem(THEME_KEY) as Theme | null) ?? "dark";
      document.documentElement.setAttribute("data-theme", theme);
      set({
        nodes: loaded?.nodes ?? [],
        edges: loaded?.edges ?? [],
        designName: loaded?.name ?? "Untitled Design",
        theme,
        hydrated: true,
      });
    },

    toggleTheme: () => get().setTheme(get().theme === "dark" ? "light" : "dark"),

    setTheme: (theme) => {
      window.localStorage.setItem(THEME_KEY, theme);
      document.documentElement.setAttribute("data-theme", theme);
      set({ theme });
    },

    addNode: (type, x, y) => {
      const node: DesignNode = { id: crypto.randomUUID(), type, label: type, x, y, status: "idle" };
      set({ nodes: [...get().nodes, node] });
      persist();
    },

    moveNode: (id, dx, dy) => {
      const target = get().nodes.find((n) => n.id === id);
      const groupId = target?.groupId;
      set({
        nodes: get().nodes.map((n) =>
          n.id === id || (groupId && n.groupId === groupId) ? { ...n, x: n.x + dx, y: n.y + dy } : n,
        ),
      });
      persist();
    },

    renameNode: (id, label) => {
      set({ nodes: get().nodes.map((n) => (n.id === id ? { ...n, label } : n)) });
      persist();
    },

    setStatus: (id, status) => {
      set({ nodes: get().nodes.map((n) => (n.id === id ? { ...n, status } : n)) });
      persist();
    },

    cycleStatus: (id) => {
      set({
        nodes: get().nodes.map((n) => {
          if (n.id !== id) return n;
          const next = STATUS_ORDER[(STATUS_ORDER.indexOf(n.status) + 1) % STATUS_ORDER.length];
          return { ...n, status: next };
        }),
      });
      persist();
    },

    setDesignName: (name) => {
      set({ designName: name });
      persist();
    },

    select: (id) => set({ selectedId: id, shiftSelectedIds: [] }),

    toggleShiftSelect: (id) =>
      set((s) => ({
        selectedId: null,
        shiftSelectedIds: s.shiftSelectedIds.includes(id)
          ? s.shiftSelectedIds.filter((x) => x !== id)
          : [...s.shiftSelectedIds, id],
      })),

    selectMany: (ids) => set({ selectedId: null, shiftSelectedIds: ids }),

    groupSelected: () => {
      const { shiftSelectedIds, nodes } = get();
      if (shiftSelectedIds.length < 2) return;
      const groupId = crypto.randomUUID();
      set({
        nodes: nodes.map((n) => (shiftSelectedIds.includes(n.id) ? { ...n, groupId } : n)),
        shiftSelectedIds: [],
      });
      persist();
    },

    ungroup: (id) => {
      const { nodes } = get();
      const groupId = nodes.find((n) => n.id === id)?.groupId;
      if (!groupId) return;
      set({ nodes: nodes.map((n) => (n.groupId === groupId ? { ...n, groupId: undefined } : n)) });
      persist();
    },

    connectNodes: (from, to) => {
      if (from === to) return;
      const edge: DesignEdge = { id: crypto.randomUUID(), from, to };
      set({ edges: [...get().edges, edge] });
      persist();
    },

    setEditing: (id) => set({ editingId: id }),

    deleteSelected: () => {
      const { selectedId, nodes, edges } = get();
      if (!selectedId) return;
      const nodeExists = nodes.some((n) => n.id === selectedId);
      set({
        nodes: nodeExists ? nodes.filter((n) => n.id !== selectedId) : nodes,
        edges: edges.filter((e) => e.id !== selectedId && e.from !== selectedId && e.to !== selectedId),
        selectedId: null,
      });
      persist();
    },

    clear: () => {
      set({ nodes: [], edges: [], selectedId: null });
      persist();
    },

    zoomIn: () => set((s) => ({ viewBox: zoomBy(s.viewBox, ZOOM_STEP) })),
    zoomOut: () => set((s) => ({ viewBox: zoomBy(s.viewBox, 1 / ZOOM_STEP) })),
    zoomReset: () => set({ viewBox: DEFAULT_VIEWBOX }),
    zoomAt: (cx, cy, factor) => set((s) => ({ viewBox: zoomAtPoint(s.viewBox, cx, cy, factor) })),
    panBy: (dx, dy) =>
      set((s) => ({ viewBox: { ...s.viewBox, x: s.viewBox.x + dx, y: s.viewBox.y + dy } })),
  };
});
