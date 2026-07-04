"use client";

import { edgePath } from "@/lib/visualizer/geometry";
import { useVisualizerStore } from "@/lib/visualizer/store";
import { THEMES } from "@/lib/visualizer/theme";
import type { DesignEdge, DesignNode } from "@/lib/visualizer/types";

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

  return (
    <g
      onClick={(e) => {
        e.stopPropagation();
        select(edge.id);
      }}
      style={{ cursor: "pointer" }}
    >
      <path d={d} stroke="transparent" strokeWidth="12" fill="none" />
      <path
        d={d}
        stroke={selected ? "#f0b429" : colors.muted}
        strokeWidth={selected ? 2 : 1.5}
        fill="none"
        markerEnd="url(#arrowhead)"
      />
    </g>
  );
}
