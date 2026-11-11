import { NODE_H, NODE_TYPES, NODE_W } from "@/lib/visualizer/constants";
import type { Example } from "@/lib/examples";
import { edgePath } from "@/lib/visualizer/geometry";
import { CSS_THEME } from "@/lib/visualizer/theme";
import { Station } from "@/components/visualizer/Station";

/** Static, server-rendered diagram of an example, drawn with the same station and line shapes as the editor. */
export function ExampleDiagram({ example }: { example: Example }) {
  const pad = 24;
  const w = Math.max(...example.nodes.map((n) => n.x)) + NODE_W + pad * 2;
  const h = Math.max(...example.nodes.map((n) => n.y)) + NODE_H + pad * 2;
  const byId = new Map(example.nodes.map((n) => [n.id, n]));
  const types = [...new Set(example.links.map(([a]) => byId.get(a)!.type))];

  return (
    <svg viewBox={`${-pad} ${-pad} ${w} ${h}`} className="w-full min-w-[720px]" role="img" aria-label={`${example.title}: ${example.nodes.map((n) => n.label).join(", ")}`}>
      <defs>
        {types.map((t) => (
          <marker key={t} id={`ex-${t}`} markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="14" refX="11" refY="7" orient="auto">
            <path d="M1 1 L12 7 L1 13 Z" fill={NODE_TYPES[t].color} stroke={NODE_TYPES[t].color} strokeWidth="1.5" strokeLinejoin="round" />
          </marker>
        ))}
      </defs>
      {example.links.map(([a, b]) => {
        const from = byId.get(a)!;
        const d = edgePath(from, byId.get(b)!).d;
        return (
          <g key={`${a}-${b}`}>
            <path d={d} style={{ stroke: "var(--panel)" }} strokeWidth="9" fill="none" strokeLinecap="round" />
            <path d={d} stroke={NODE_TYPES[from.type].color} strokeWidth="4" fill="none" strokeLinecap="round" markerEnd={`url(#ex-${from.type})`} />
          </g>
        );
      })}
      {example.nodes.map((n) => (
        <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
          <Station type={n.type} label={n.label} status={n.status ?? "healthy"} colors={CSS_THEME} />
        </g>
      ))}
    </svg>
  );
}
