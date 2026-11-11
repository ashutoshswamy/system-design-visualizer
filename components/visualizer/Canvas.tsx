"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { NODE_H, NODE_TYPES, NODE_W } from "@/lib/visualizer/constants";
import { borderPoint, clientToCanvasPoint } from "@/lib/visualizer/geometry";
import { useVisualizerStore } from "@/lib/visualizer/store";
import { THEMES } from "@/lib/visualizer/theme";
import type { NodeType } from "@/lib/visualizer/types";
import { Edge } from "./Edge";
import { Node } from "./Node";

export interface CanvasHandle {
  getSvg: () => SVGSVGElement | null;
}

const GROUP_PADDING = 16;
const MARQUEE_THRESHOLD = 4;

export const Canvas = forwardRef<CanvasHandle>(function Canvas(_props, ref) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [edgeDraft, setEdgeDraft] = useState<{ fromId: string; x: number; y: number } | null>(null);
  const marquee = useRef<{ startX: number; startY: number; x: number; y: number; active: boolean } | null>(null);
  const [marqueeRect, setMarqueeRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const groupDrag = useRef<{ memberId: string; lastX: number; lastY: number } | null>(null);
  const panDrag = useRef<{ lastX: number; lastY: number } | null>(null);
  const { nodes, edges, selectedId, shiftSelectedIds, viewBox, theme, addNode, select, selectMany, connectNodes, moveNode, panBy } =
    useVisualizerStore();
  const colors = THEMES[theme];

  useImperativeHandle(ref, () => ({ getSvg: () => svgRef.current }));

  // native listener: React's onWheel is passive, so preventDefault (needed to stop the
  // browser's own page-zoom on trackpad pinch) has no effect there.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const rect = svg!.getBoundingClientRect();
      const vb = useVisualizerStore.getState().viewBox;
      if (e.ctrlKey) {
        // trackpad pinch is reported as wheel + ctrlKey in Chrome/Firefox
        const { x, y } = clientToCanvasPoint(rect, vb, e.clientX, e.clientY);
        const factor = Math.exp(-e.deltaY * 0.001);
        useVisualizerStore.getState().zoomAt(x, y, factor);
      } else {
        const scale = vb.w / rect.width;
        useVisualizerStore.getState().panBy(e.deltaX * scale, e.deltaY * scale);
      }
    }
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, []);

  const toCanvasPoint = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    return clientToCanvasPoint(svg.getBoundingClientRect(), viewBox, clientX, clientY);
  };

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const type = e.dataTransfer.getData("text/node-type") as NodeType;
    if (!type) return;
    const { x, y } = toCanvasPoint(e.clientX, e.clientY);
    addNode(type, x - NODE_W / 2, y - NODE_H / 2);
  }

  function nodeAt(x: number, y: number, excludeId: string) {
    return nodes.find(
      (n) => n.id !== excludeId && x >= n.x && x <= n.x + NODE_W && y >= n.y && y <= n.y + NODE_H,
    );
  }

  function onSvgPointerDown(e: React.PointerEvent) {
    if (e.button === 1) {
      // middle-mouse drag pans regardless of what's under the cursor
      e.preventDefault();
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
      panDrag.current = { lastX: e.clientX, lastY: e.clientY };
      return;
    }
    if (e.target !== svgRef.current) return; // only start marquee on empty canvas
    (e.target as Element).setPointerCapture(e.pointerId);
    const { x, y } = toCanvasPoint(e.clientX, e.clientY);
    marquee.current = { startX: x, startY: y, x, y, active: false };
  }

  function onGroupBoxPointerDown(memberId: string, e: React.PointerEvent) {
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    const { x, y } = toCanvasPoint(e.clientX, e.clientY);
    groupDrag.current = { memberId, lastX: x, lastY: y };
  }

  function onSvgPointerMove(e: React.PointerEvent) {
    if (panDrag.current) {
      const svg = svgRef.current;
      if (!svg) return;
      const scale = viewBox.w / svg.getBoundingClientRect().width;
      panBy(-(e.clientX - panDrag.current.lastX) * scale, -(e.clientY - panDrag.current.lastY) * scale);
      panDrag.current = { lastX: e.clientX, lastY: e.clientY };
      return;
    }
    if (groupDrag.current) {
      const { x, y } = toCanvasPoint(e.clientX, e.clientY);
      moveNode(groupDrag.current.memberId, x - groupDrag.current.lastX, y - groupDrag.current.lastY);
      groupDrag.current.lastX = x;
      groupDrag.current.lastY = y;
      return;
    }
    if (edgeDraft) {
      const { x, y } = toCanvasPoint(e.clientX, e.clientY);
      setEdgeDraft((d) => (d ? { ...d, x, y } : d));
      return;
    }
    if (marquee.current) {
      const { x, y } = toCanvasPoint(e.clientX, e.clientY);
      const m = marquee.current;
      if (!m.active && Math.hypot(x - m.startX, y - m.startY) < MARQUEE_THRESHOLD) return;
      m.active = true;
      m.x = x;
      m.y = y;
      setMarqueeRect({
        x: Math.min(m.startX, m.x),
        y: Math.min(m.startY, m.y),
        w: Math.abs(m.x - m.startX),
        h: Math.abs(m.y - m.startY),
      });
    }
  }

  function onSvgPointerUp(e: React.PointerEvent) {
    if (panDrag.current) {
      panDrag.current = null;
      return;
    }
    if (groupDrag.current) {
      groupDrag.current = null;
      return;
    }
    if (edgeDraft) {
      const { x, y } = toCanvasPoint(e.clientX, e.clientY);
      const target = nodeAt(x, y, edgeDraft.fromId);
      if (target) connectNodes(edgeDraft.fromId, target.id);
      setEdgeDraft(null);
      return;
    }
    if (marquee.current) {
      if (marquee.current.active && marqueeRect) {
        const { x, y, w, h } = marqueeRect;
        const ids = nodes
          .filter((n) => n.x < x + w && n.x + NODE_W > x && n.y < y + h && n.y + NODE_H > y)
          .map((n) => n.id);
        selectMany(ids);
      } else {
        select(null);
      }
      marquee.current = null;
      setMarqueeRect(null);
    }
  }

  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  const fromNode = edgeDraft ? nodeById.get(edgeDraft.fromId) : undefined;
  const draftStart = fromNode && edgeDraft ? borderPoint(fromNode, edgeDraft.x, edgeDraft.y) : null;

  const groupBoxes = new Map<string, { x: number; y: number; w: number; h: number; memberId: string }>();
  for (const n of nodes) {
    if (!n.groupId) continue;
    const box = groupBoxes.get(n.groupId);
    const x0 = n.x, y0 = n.y, x1 = n.x + NODE_W, y1 = n.y + NODE_H;
    if (!box) groupBoxes.set(n.groupId, { x: x0, y: y0, w: x1 - x0, h: y1 - y0, memberId: n.id });
    else {
      const nx = Math.min(box.x, x0);
      const ny = Math.min(box.y, y0);
      const nx1 = Math.max(box.x + box.w, x1);
      const ny1 = Math.max(box.y + box.h, y1);
      groupBoxes.set(n.groupId, { x: nx, y: ny, w: nx1 - nx, h: ny1 - ny, memberId: box.memberId });
    }
  }

  return (
    <svg
      ref={svgRef}
      aria-label="Diagram canvas"
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
      style={{ background: colors.bg }}
      className="w-full h-full"
      onDragOver={onDragOver}
      onDrop={onDrop}
      onPointerDown={onSvgPointerDown}
      onPointerMove={onSvgPointerMove}
      onPointerUp={onSvgPointerUp}
    >
      <defs>
        {[...Object.entries(NODE_TYPES).map(([k, v]) => [k, v.color]), ["sel", colors.ink]].map(([id, fill]) => (
          <marker
            key={id}
            id={`arrow-${id}`}
            markerUnits="userSpaceOnUse"
            markerWidth="14"
            markerHeight="14"
            refX="11"
            refY="7"
            orient="auto"
          >
            <path d="M1 1 L12 7 L1 13 Z" fill={fill} stroke={fill} strokeWidth="1.5" strokeLinejoin="round" />
          </marker>
        ))}
        <pattern id="grid-dots" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.5" fill={colors.grid} />
        </pattern>
      </defs>

      <rect
        x={viewBox.x - viewBox.w}
        y={viewBox.y - viewBox.h}
        width={viewBox.w * 3}
        height={viewBox.h * 3}
        fill="url(#grid-dots)"
        pointerEvents="none"
      />

      {[...groupBoxes.values()].map((box, i) => (
        <rect
          key={i}
          x={box.x - GROUP_PADDING}
          y={box.y - GROUP_PADDING}
          width={box.w + GROUP_PADDING * 2}
          height={box.h + GROUP_PADDING * 2}
          fill="none"
          stroke={colors.muted}
          strokeWidth="1.5"
          strokeDasharray="2 6"
          strokeLinecap="round"
          rx="22"
          pointerEvents="all"
          onPointerDown={(e) => onGroupBoxPointerDown(box.memberId, e)}
          style={{ cursor: "grab" }}
        />
      ))}

      {edges.map((edge) => {
        const from = nodeById.get(edge.from);
        const to = nodeById.get(edge.to);
        if (!from || !to) return null;
        return <Edge key={edge.id} edge={edge} from={from} to={to} selected={selectedId === edge.id} />;
      })}

      {draftStart && edgeDraft && (
        <path
          d={`M ${draftStart.x} ${draftStart.y} L ${edgeDraft.x} ${edgeDraft.y}`}
          className="no-export"
          stroke={colors.ink}
          strokeWidth="3"
          strokeDasharray="2 7"
          strokeLinecap="round"
          fill="none"
        />
      )}

      {nodes.map((node) => (
        <Node
          key={node.id}
          node={node}
          selected={selectedId === node.id}
          shiftSelected={shiftSelectedIds.includes(node.id)}
          toCanvasPoint={toCanvasPoint}
          onStartConnect={(id) => setEdgeDraft({ fromId: id, x: node.x, y: node.y })}
        />
      ))}

      {marqueeRect && (
        <rect
          x={marqueeRect.x}
          y={marqueeRect.y}
          width={marqueeRect.w}
          height={marqueeRect.h}
          className="no-export"
          fill={colors.ink}
          fillOpacity="0.08"
          stroke={colors.ink}
          strokeWidth="1.5"
          rx="6"
        />
      )}
    </svg>
  );
});
