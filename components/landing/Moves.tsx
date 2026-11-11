"use client";

import { useEffect, useRef, useState } from "react";
import { NODE_H, NODE_TYPES, NODE_W } from "@/lib/visualizer/constants";
import { edgePath } from "@/lib/visualizer/geometry";
import { CSS_THEME } from "@/lib/visualizer/theme";
import type { NodeStatus, NodeType } from "@/lib/visualizer/types";
import { BODY_FONT, Station } from "@/components/visualizer/Station";

const STEPS: { title: string; type: NodeType; items: string[] }[] = [
  {
    title: "Sketch",
    type: "client",
    items: ["Drag a component in, or click to place it", "Double-click to rename it and set its status"],
  },
  {
    title: "Connect",
    type: "loadbalancer",
    items: ["Pull a line out of any component", "Lines turn only at 45 degrees, and cross cleanly"],
  },
  {
    title: "Organize",
    type: "queue",
    items: ["Marquee-select a region", "Group components and drag them as one"],
  },
  {
    title: "Ship",
    type: "database",
    items: ["Export a tight-cropped PNG at 2x", "The design name becomes the filename"],
  },
];

const NODES: { id: string; type: NodeType; label: string; x: number; y: number; status: NodeStatus }[] = [
  { id: "client", type: "client", label: "web client", x: 20, y: 168, status: "healthy" },
  { id: "lb", type: "loadbalancer", label: "load balancer", x: 280, y: 168, status: "healthy" },
  { id: "api", type: "server", label: "api server", x: 540, y: 100, status: "healthy" },
  { id: "db", type: "database", label: "postgres", x: 540, y: 236, status: "warning" },
];
const LINKS: [string, string][] = [
  ["client", "lb"],
  ["lb", "api"],
  ["lb", "db"],
];
const byId = new Map(NODES.map((n) => [n.id, n]));
const ROUTES = LINKS.map(([a, b]) => ({ from: byId.get(a)!, d: edgePath(byId.get(a)!, byId.get(b)!).d }));

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const T = `600ms ${EASE}`;

/** One diagram that builds itself as you scroll the four steps: each step adds a layer of the real product. */
export function Moves() {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    // stations place themselves the first time the stage scrolls into view
    const once = new IntersectionObserver(([e]) => e.isIntersecting && (setShown(true), once.disconnect()), { threshold: 0.35 });
    if (stage.current) once.observe(stage.current);
    return () => (io.disconnect(), once.disconnect());
  }, []);

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="sticky top-16 z-10 -mx-5 self-start border-y border-line bg-ground px-5 py-3 sm:-mx-8 sm:px-8 lg:top-24 lg:col-span-7 lg:order-last lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0">
        <div ref={stage} className="rounded-panel border border-line bg-panel p-3 sm:p-5">
          <svg viewBox="0 0 730 390" className="w-full" role="img" aria-label={`Step ${active + 1} of 4: ${STEPS[active].title}`}>
            <defs>
              <pattern id="mv-dots" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="1.5" style={{ fill: "var(--line)" }} />
              </pattern>
              {Object.entries(NODE_TYPES).map(([type, m]) => (
                <marker key={type} id={`mv-${type}`} markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="14" refX="11" refY="7" orient="auto">
                  <path d="M1 1 L12 7 L1 13 Z" fill={m.color} stroke={m.color} strokeWidth="1.5" strokeLinejoin="round" />
                </marker>
              ))}
            </defs>
            <rect width="730" height="390" fill="url(#mv-dots)" />

            {ROUTES.map((r, i) => (
              <g key={i}>
                <path d={r.d} style={{ stroke: "var(--panel)" }} strokeWidth="9" fill="none" strokeLinecap="round" />
                <path
                  d={r.d}
                  pathLength={100}
                  stroke={NODE_TYPES[r.from.type].color}
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  markerEnd={`url(#mv-${r.from.type})`}
                  strokeDasharray="100"
                  style={{
                    strokeDashoffset: active >= 1 ? 0 : 100,
                    opacity: active >= 1 ? 1 : 0,
                    transition: `stroke-dashoffset 700ms ${EASE} ${i * 120}ms, opacity 200ms linear ${i * 120}ms`,
                  }}
                />
              </g>
            ))}

            {NODES.map((n, i) => (
              <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
                <g
                  style={{
                    opacity: shown ? 1 : 0,
                    transform: shown ? "translateY(0)" : "translateY(10px)",
                    transition: `opacity ${T} ${i * 90}ms, transform ${T} ${i * 90}ms`,
                  }}
                >
                  <Station type={n.type} label={n.label} status={n.status} colors={CSS_THEME} />
                </g>
              </g>
            ))}

            {/* organize: a group box around the two backends */}
            <rect
              x={540 - 18}
              y={100 - 18}
              width={NODE_W + 36}
              height={236 + NODE_H - 100 + 36}
              rx="22"
              fill="none"
              strokeWidth="1.5"
              strokeDasharray="2 6"
              strokeLinecap="round"
              style={{
                stroke: "var(--muted)",
                opacity: active >= 2 ? 1 : 0,
                transition: `opacity ${T}`,
              }}
            />
            <rect
              x={540 - 18}
              y={100 - 18}
              width={NODE_W + 36}
              height={236 + NODE_H - 100 + 36}
              rx="22"
              style={{ fill: "var(--ink)", opacity: active === 2 ? 0.07 : 0, transition: `opacity ${T}` }}
            />

            {/* ship: the tight export crop and the file it makes */}
            <g style={{ opacity: active >= 3 ? 1 : 0, transition: `opacity ${T}` }}>
              <rect x="6" y="78" width="718" height="250" rx="6" fill="none" strokeWidth="2" strokeDasharray="10 6" style={{ stroke: "var(--ink)" }} />
              <rect x="388" y="344" width="336" height="36" rx="8" style={{ fill: "var(--ink)" }} />
              <text x="406" y="362" dominantBaseline="central" fontSize="15" fontWeight="600" style={{ fill: "var(--on-ink)", fontFamily: BODY_FONT }}>
                checkout-flow.png
              </text>
              <text x="708" y="362" dominantBaseline="central" textAnchor="end" fontSize="14" fontWeight="500" style={{ fill: "var(--on-ink)", fontFamily: BODY_FONT, opacity: 0.7 }}>
                2x
              </text>
            </g>
          </svg>
        </div>
      </div>

      <ol className="lg:col-span-5">
        {STEPS.map((s, i) => {
          const color = NODE_TYPES[s.type].color;
          const on = active === i;
          return (
            <li
              key={s.title}
              data-step={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className="relative flex min-h-[42vh] flex-col justify-center pl-14 transition-opacity duration-500 motion-reduce:transition-none lg:min-h-[58vh]"
              style={{ opacity: on ? 1 : 0.4 }}
            >
              {i < STEPS.length - 1 && (
                <span aria-hidden className="absolute left-[13px] top-1/2 h-full w-1" style={{ background: color }} />
              )}
              <span
                aria-hidden
                className="absolute left-0 top-1/2 size-[30px] -translate-y-1/2 rounded-full border-[5px] transition-colors duration-500 motion-reduce:transition-none"
                style={{ borderColor: color, background: on ? color : "var(--ground)" }}
              />
              <h3 className="text-4xl font-bold tracking-[-0.03em] sm:text-5xl">{s.title}</h3>
              <ul className="mt-4 space-y-2 text-[17px] leading-snug text-muted">
                {s.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
