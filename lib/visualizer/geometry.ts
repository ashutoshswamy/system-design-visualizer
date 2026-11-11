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

type Pt = { x: number; y: number };

/** Polyline through `pts` with each inner corner rounded by up to `r`. */
function rounded(pts: Pt[], r: number) {
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [a, b, c] = [pts[i - 1], pts[i], pts[i + 1]];
    const la = Math.hypot(b.x - a.x, b.y - a.y);
    const lc = Math.hypot(c.x - b.x, c.y - b.y);
    const k = Math.min(r, la / 2, lc / 2);
    if (k < 0.5) continue;
    d += ` L ${b.x + ((a.x - b.x) / la) * k} ${b.y + ((a.y - b.y) / la) * k}`;
    d += ` Q ${b.x} ${b.y} ${b.x + ((c.x - b.x) / lc) * k} ${b.y + ((c.y - b.y) / lc) * k}`;
  }
  const last = pts[pts.length - 1];
  return `${d} L ${last.x} ${last.y}`;
}

/**
 * Transit-map route between two nodes: leaves from the side facing the target, runs straight,
 * takes one 45° diagonal to change lanes, runs straight again. Never freehand curves.
 */
export function edgePath(from: Pick<DesignNode, "x" | "y">, to: Pick<DesignNode, "x" | "y">) {
  const fc = { x: from.x + NODE_W / 2, y: from.y + NODE_H / 2 };
  const tc = { x: to.x + NODE_W / 2, y: to.y + NODE_H / 2 };
  const dx = tc.x - fc.x;
  const dy = tc.y - fc.y;
  const horizontal = Math.abs(dx) - NODE_W >= Math.abs(dy) - NODE_H; // compare the free gaps, not centers

  let start: Pt;
  let end: Pt;
  let pts: Pt[];
  if (horizontal) {
    const sx = Math.sign(dx) || 1;
    start = { x: fc.x + (sx * NODE_W) / 2, y: fc.y };
    end = { x: tc.x - (sx * NODE_W) / 2, y: tc.y };
    const run = Math.abs(end.x - start.x) - Math.abs(end.y - start.y);
    const h = Math.max(run, 0) / 2;
    pts =
      run > 0
        ? [start, { x: start.x + sx * h, y: start.y }, { x: end.x - sx * h, y: end.y }, end]
        : [start, end];
  } else {
    const sy = Math.sign(dy) || 1;
    start = { x: fc.x, y: fc.y + (sy * NODE_H) / 2 };
    end = { x: tc.x, y: tc.y - (sy * NODE_H) / 2 };
    const run = Math.abs(end.y - start.y) - Math.abs(end.x - start.x);
    const h = Math.max(run, 0) / 2;
    pts =
      run > 0
        ? [start, { x: start.x, y: start.y + sy * h }, { x: end.x, y: end.y - sy * h }, end]
        : [start, end];
  }
  return { start, end, d: rounded(pts, 16) };
}
