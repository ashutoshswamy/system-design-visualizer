import { NODE_H, NODE_W } from "./constants";
import type { ViewBox } from "./store";
import type { DesignNode } from "./types";

/**
 * Client (mouse) coords -> canvas coords, accounting for SVG letterboxing.
 * The svg's viewBox aspect ratio rarely matches its container's, so the default
 * `preserveAspectRatio="xMidYMid meet"` centers and scales the content within
 * the box, leaving blank margins — using the raw bounding rect for the mapping
 * (ignoring those margins) throws every click off by the margin size.
 */
export function clientToCanvasPoint(rect: DOMRect, viewBox: ViewBox, clientX: number, clientY: number) {
  const scale = Math.min(rect.width / viewBox.w, rect.height / viewBox.h);
  const offsetX = (rect.width - viewBox.w * scale) / 2;
  const offsetY = (rect.height - viewBox.h * scale) / 2;
  return {
    x: viewBox.x + (clientX - rect.left - offsetX) / scale,
    y: viewBox.y + (clientY - rect.top - offsetY) / scale,
  };
}

/** Point on a node's rectangle border closest to (tx, ty), for connector endpoints. */
export function borderPoint(node: DesignNode, tx: number, ty: number) {
  const cx = node.x + NODE_W / 2;
  const cy = node.y + NODE_H / 2;
  const dx = tx - cx;
  const dy = ty - cy;
  if (dx === 0 && dy === 0) return { x: cx, y: cy };

  const halfW = NODE_W / 2;
  const halfH = NODE_H / 2;
  const scale = Math.min(
    dx !== 0 ? Math.abs(halfW / dx) : Infinity,
    dy !== 0 ? Math.abs(halfH / dy) : Infinity,
  );
  return { x: cx + dx * scale, y: cy + dy * scale };
}

/**
 * SVG cubic-bezier between two nodes' borders. Straight when the nodes are roughly
 * aligned (horizontal/vertical) — bend only grows as the connection turns diagonal.
 */
export function edgePath(from: DesignNode, to: DesignNode) {
  const fromCenter = { x: from.x + NODE_W / 2, y: from.y + NODE_H / 2 };
  const toCenter = { x: to.x + NODE_W / 2, y: to.y + NODE_H / 2 };
  const start = borderPoint(from, toCenter.x, toCenter.y);
  const end = borderPoint(to, fromCenter.x, fromCenter.y);

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dist = Math.hypot(dx, dy) || 1;
  const nx = -dy / dist;
  const ny = dx / dist;

  const skew = Math.min(Math.abs(dx), Math.abs(dy)) / dist; // 0 = axis-aligned, ~0.71 = 45°
  const bulge = Math.min(dist * 0.25, 60) * Math.min(1, skew / 0.5);

  const c1x = start.x + dx * 0.33 + nx * bulge;
  const c1y = start.y + dy * 0.33 + ny * bulge;
  const c2x = start.x + dx * 0.66 - nx * bulge;
  const c2y = start.y + dy * 0.66 - ny * bulge;

  return {
    start,
    end,
    d: `M ${start.x} ${start.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${end.x} ${end.y}`,
  };
}
