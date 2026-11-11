"use client";

import { useRef } from "react";
import { NODE_H, NODE_W } from "@/lib/visualizer/constants";
import { useVisualizerStore } from "@/lib/visualizer/store";
import { THEMES } from "@/lib/visualizer/theme";
import type { DesignNode } from "@/lib/visualizer/types";
import { Station } from "./Station";

const DRAG_THRESHOLD = 4;

export function Node({
  node,
  selected,
  shiftSelected,
  toCanvasPoint,
  onStartConnect,
}: {
  node: DesignNode;
  selected: boolean;
  shiftSelected: boolean;
  toCanvasPoint: (clientX: number, clientY: number) => { x: number; y: number };
  onStartConnect: (id: string) => void;
}) {
  const { moveNode, cycleStatus, select, toggleShiftSelect, setEditing, theme } = useVisualizerStore();
  const drag = useRef<{ startX: number; startY: number; lastX: number; lastY: number; dragging: boolean } | null>(null);
  const handleDrag = useRef(false);
  const colors = THEMES[theme];

  function onPointerDown(e: React.PointerEvent) {
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    const start = toCanvasPoint(e.clientX, e.clientY);
    drag.current = { startX: e.clientX, startY: e.clientY, lastX: start.x, lastY: start.y, dragging: false };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;
    if (!drag.current.dragging && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    drag.current.dragging = true;
    const cur = toCanvasPoint(e.clientX, e.clientY);
    moveNode(node.id, cur.x - drag.current.lastX, cur.y - drag.current.lastY);
    drag.current.lastX = cur.x;
    drag.current.lastY = cur.y;
  }

  function onPointerUp(e: React.PointerEvent) {
    if (handleDrag.current) {
      handleDrag.current = false;
      return;
    }
    const wasDragging = drag.current?.dragging;
    drag.current = null;
    if (!wasDragging) {
      e.stopPropagation();
      if (e.shiftKey) toggleShiftSelect(node.id);
      else select(node.id);
    }
  }

  function onHandlePointerDown(e: React.PointerEvent) {
    e.stopPropagation();
    handleDrag.current = true;
    (e.target as Element).setPointerCapture(e.pointerId);
    onStartConnect(node.id);
  }

  return (
    <g
      className="station"
      data-selected={selected}
      transform={`translate(${node.x}, ${node.y})`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setEditing(node.id);
      }}
      style={{ cursor: "grab" }}
    >
      <Station
        type={node.type}
        label={node.label}
        status={node.status}
        colors={colors}
        selected={selected}
        multi={shiftSelected}
        onStatusClick={() => cycleStatus(node.id)}
      >
        <circle
          className="station-handle no-export"
          cx={NODE_W}
          cy={NODE_H / 2}
          r="8"
          style={{ fill: colors.bg, stroke: colors.ink, strokeWidth: 2.5, cursor: "crosshair" }}
          onPointerDown={onHandlePointerDown}
        >
          <title>Drag to connect</title>
        </circle>
      </Station>
    </g>
  );
}
