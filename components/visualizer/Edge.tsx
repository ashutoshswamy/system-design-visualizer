"use client";

import { NODE_TYPES } from "@/lib/visualizer/constants";
import { edgePath } from "@/lib/visualizer/geometry";
import { useVisualizerStore } from "@/lib/visualizer/store";
import { THEMES } from "@/lib/visualizer/theme";
import { TrafficDot } from "./TrafficDot";
import type { DesignEdge, DesignNode } from "@/lib/visualizer/types";

/** A connection drawn as a transit line: line-colored (from the source's category), with a
 * ground-colored casing underneath so crossings read as one line passing over another. */
export function Edge({
  edge,
  from,
  to,
  selected,
}: {
  edge: DesignEdge;
  from: DesignNode;
  to: DesignNode;
  selected: boolean;
}) {
  const select = useVisualizerStore((s) => s.select);
  const theme = useVisualizerStore((s) => s.theme);
  const colors = THEMES[theme];
  const { d } = edgePath(from, to);
  const pathId = `edge-${edge.id}`;
  const begin = ((edge.id.charCodeAt(0) + edge.id.charCodeAt(1)) % 30) / 10; // desync edges

  return (
    <g
      onClick={(e) => {
        e.stopPropagation();
        select(edge.id);
      }}
      style={{ cursor: "pointer" }}
    >
      <path d={d} stroke="transparent" strokeWidth="16" fill="none" />
      <path d={d} stroke={colors.bg} strokeWidth={selected ? 11 : 8} fill="none" strokeLinecap="round" />
      {selected && <path d={d} stroke={colors.ink} strokeWidth="8" fill="none" strokeLinecap="round" />}
      <path
        d={d}
        id={pathId}
        stroke={NODE_TYPES[from.type].color}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        markerEnd={`url(#arrow-${selected ? "sel" : from.type})`}
      />
      <TrafficDot pathId={pathId} begin={begin} from={from.status} to={to.status} colors={colors} />
    </g>
  );
}
