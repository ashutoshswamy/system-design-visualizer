"use client";

import { useRef } from "react";
import { NODE_H, NODE_TYPES, NODE_W, STATUS_COLOR } from "@/lib/visualizer/constants";
import { useVisualizerStore } from "@/lib/visualizer/store";
import { THEMES } from "@/lib/visualizer/theme";
import type { DesignNode } from "@/lib/visualizer/types";
import { NodeIcon } from "./icons";

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
  const meta = NODE_TYPES[node.type];
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

  function onDoubleClick(e: React.MouseEvent) {
    e.stopPropagation();
    setEditing(node.id);
  }

  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onDoubleClick={onDoubleClick}
      style={{ cursor: "grab" }}
    >
      <rect
        width={NODE_W}
        height={NODE_H}
        rx="3"
        fill={colors.panel2}
        stroke={selected || shiftSelected ? "#f0b429" : colors.border}
        strokeWidth={selected ? 2 : 1}
        strokeDasharray={shiftSelected ? "4 3" : undefined}
      />
      <rect width="4" height={NODE_H} fill={meta.color} />
      <foreignObject x="12" y="0" width="24" height={NODE_H}>
        <div style={{ display: "flex", alignItems: "center", height: NODE_H }}>
          <NodeIcon type={node.type} color={meta.color} />
        </div>
      </foreignObject>
      <text x="44" y={NODE_H / 2} dominantBaseline="middle" fill={colors.text} fontSize="13" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
        {node.label}
      </text>
      <circle
        cx={NODE_W - 14}
        cy="14"
        r="5"
        fill={STATUS_COLOR[node.status]}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          cycleStatus(node.id);
        }}
        style={{ cursor: "pointer" }}
      />
      <circle
        cx={NODE_W}
        cy={NODE_H / 2}
        r="6"
        fill={colors.bg}
        stroke="#f0b429"
        strokeWidth="1.5"
        onPointerDown={onHandlePointerDown}
        style={{ cursor: "crosshair" }}
      />
    </g>
  );
}
