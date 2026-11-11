"use client";

import { useState } from "react";
import { NODE_H, NODE_TYPES, NODE_W, STATUS_ORDER } from "@/lib/visualizer/constants";
import { edgePath } from "@/lib/visualizer/geometry";
import { CSS_THEME } from "@/lib/visualizer/theme";
import type { NodeStatus, NodeType } from "@/lib/visualizer/types";
import { TrafficDot } from "@/components/visualizer/TrafficDot";
import { Station } from "@/components/visualizer/Station";

interface MapNode {
  id: string;
  type: NodeType;
  label: string;
  x: number;
  y: number;
  status: NodeStatus;
}

const NODES: MapNode[] = [
  { id: "cdn", type: "cdn", label: "edge cdn", x: 10, y: 8, status: "healthy" },
  { id: "client", type: "client", label: "web client", x: 10, y: 130, status: "healthy" },
  { id: "lb", type: "loadbalancer", label: "load balancer", x: 310, y: 130, status: "healthy" },
  { id: "api", type: "server", label: "api server", x: 610, y: 69, status: "healthy" },
  { id: "billing", type: "microservice", label: "billing service", x: 610, y: 191, status: "warning" },
  { id: "cache", type: "cache", label: "session cache", x: 910, y: 8, status: "healthy" },
  { id: "db", type: "database", label: "postgres", x: 910, y: 130, status: "healthy" },
  { id: "queue", type: "queue", label: "job queue", x: 910, y: 252, status: "healthy" },
];

const LINKS: [string, string][] = [
  ["client", "cdn"],
  ["client", "lb"],
  ["lb", "api"],
  ["lb", "billing"],
  ["api", "cache"],
  ["api", "db"],
  ["billing", "db"],
  ["billing", "queue"],
];

const byId = new Map(NODES.map((n) => [n.id, n]));
const ROUTES = LINKS.map(([a, b]) => ({
  key: `${a}-${b}`,
  from: byId.get(a)!,
  to: byId.get(b)!,
  d: edgePath(byId.get(a)!, byId.get(b)!).d,
}));

/** The product's own diagram, as a transit map. Status lamps are live: click one. */
export function HeroMap() {
  const [status, setStatus] = useState<Record<string, NodeStatus>>(() =>
    Object.fromEntries(NODES.map((n) => [n.id, n.status])),
  );

  const cycle = (id: string) =>
    setStatus((s) => ({ ...s, [id]: STATUS_ORDER[(STATUS_ORDER.indexOf(s[id]) + 1) % STATUS_ORDER.length] }));

  return (
    <div className="thin-scroll overflow-x-auto">
      <svg
        viewBox={`0 0 ${910 + NODE_W + 10} ${252 + NODE_H + 8}`}
        className="w-full min-w-[640px]"
        role="group"
        aria-label="Example diagram: a client reaches a load balancer through a CDN, which fans out to an API server and a billing service backed by a cache, a database and a job queue."
      >
        <defs>
          {Object.entries(NODE_TYPES).map(([type, m]) => (
            <marker
              key={type}
              id={`hm-${type}`}
              markerUnits="userSpaceOnUse"
              markerWidth="14"
              markerHeight="14"
              refX="11"
              refY="7"
              orient="auto"
            >
              <path d="M1 1 L12 7 L1 13 Z" fill={m.color} stroke={m.color} strokeWidth="1.5" strokeLinejoin="round" />
            </marker>
          ))}
        </defs>

        {ROUTES.map((r, i) => (
          <g key={r.key}>
            <path d={r.d} style={{ stroke: "var(--ground)" }} strokeWidth="9" fill="none" strokeLinecap="round" />
            <path
              id={`hm-${r.key}`}
              d={r.d}
              pathLength={100}
              stroke={NODE_TYPES[r.from.type].color}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              markerEnd={`url(#hm-${r.from.type})`}
              className="map-line"
              style={{ animationDelay: `${500 + i * 120}ms` }}
            />
          </g>
        ))}

        {ROUTES.map((r, i) => (
          <TrafficDot
            key={r.key}
            pathId={`hm-${r.key}`}
            begin={2 + (i % 4) * 0.8}
            from={status[r.from.id]}
            to={status[r.to.id]}
            colors={{ ink: "var(--ink)", bg: "var(--panel)" }}
            exportable
          />
        ))}

        {NODES.map((n, i) => (
          // outer g positions, inner g animates: a CSS transform would otherwise replace the transform attribute
          <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
            <g className="map-station" style={{ animationDelay: `${i * 80}ms` }}>
              <Station
                type={n.type}
                label={n.label}
                status={status[n.id]}
                colors={CSS_THEME}
                onStatusClick={() => cycle(n.id)}
              />
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
