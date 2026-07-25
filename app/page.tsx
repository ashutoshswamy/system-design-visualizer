import Link from "next/link";
import { NODE_CATEGORIES, NODE_TYPES, STATUS_COLOR } from "@/lib/visualizer/constants";
import { NodeIcon } from "@/components/visualizer/icons";
import type { NodeStatus, NodeType } from "@/lib/visualizer/types";

const DEV_LINKS = [
  { label: "GitHub", href: "https://github.com/ashutoshswamy" },
  { label: "LinkedIn", href: "https://linkedin.com/in/ashutoshswamy" },
  { label: "X", href: "https://x.com/ashutoshswamy_" },
];

const FEATURES: { label: string; accent: string; items: string[] }[] = [
  {
    label: "sketch",
    accent: NODE_TYPES.client.color,
    items: ["21 component types", "drag or click to place", "double-click to rename + set status"],
  },
  {
    label: "connect",
    accent: NODE_TYPES.loadbalancer.color,
    items: ["drag an arrow out of any node", "bends only when the layout needs it", "click-to-select, delete removes cleanly"],
  },
  {
    label: "organize",
    accent: NODE_TYPES.queue.color,
    items: ["marquee-select a region", "group components, drag as one", "pan + zoom an infinite canvas"],
  },
  {
    label: "ship",
    accent: NODE_TYPES.database.color,
    items: ["export a tight-cropped PNG", "name the design, it names the file", "light / dark, your call"],
  },
];

const HERO_NODES: { type: NodeType; label: string; status: NodeStatus; x: number; y: number; w: number; h: number; live?: boolean }[] = [
  { type: "client", label: "client", status: "healthy", x: 10, y: 87, w: 108, h: 46 },
  { type: "loadbalancer", label: "load balancer", status: "healthy", x: 208, y: 87, w: 140, h: 46, live: true },
  { type: "server", label: "server", status: "healthy", x: 448, y: 24, w: 132, h: 46 },
  { type: "server", label: "server", status: "warning", x: 448, y: 150, w: 132, h: 46 },
  { type: "cache", label: "cache", status: "healthy", x: 660, y: 42, w: 100, h: 46 },
  { type: "database", label: "database", status: "healthy", x: 660, y: 132, w: 100, h: 46 },
];

const HERO_ARROWS = [
  "M118 110 C 160 110, 168 110, 208 110",
  "M348 100 C 390 72, 402 58, 448 47",
  "M348 120 C 390 148, 402 162, 448 173",
  "M580 47 C 618 55, 622 55, 660 63",
  "M580 173 C 618 165, 622 165, 660 157",
];

export default function LandingPage() {
  return (
    <main className="flex flex-1 flex-col items-center bg-[#0a0a0b] font-mono text-[#e7e7ea]">
      <div className="w-full max-w-5xl px-4 pt-14 pb-16 sm:px-6 sm:pt-20">
        <div className="mb-3 flex items-center gap-2 text-[11px] text-[#5a5a5f]">
          <span className="text-[#f0b429]">$</span>
          system-design-visualizer
          <span className="cursor-blink -ml-1 inline-block h-3 w-[6px] bg-[#f0b429]" aria-hidden />
        </div>

        <h1 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-[#e7e7ea] sm:text-4xl md:text-5xl">
          Sketch the architecture.
          <br />
          <span className="text-[#86868c]">Not the slide deck.</span>
        </h1>

        <p className="mt-5 max-w-lg text-[14px] leading-relaxed text-[#86868c] sm:text-[15px]">
          A canvas for system-design diagrams — components, arrows, live status, one PNG export.
          No accounts, no sync setup, no learning curve.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
          <Link
            href="/editor"
            className="rounded-sm border border-[#f0b429] bg-[#f0b429] px-5 py-2.5 text-[13px] font-semibold text-[#0a0a0b] transition-transform hover:-translate-y-0.5 hover:opacity-90"
          >
            Open the editor →
          </Link>
          <span className="text-[11px] text-[#5a5a5f]">saves to your browser, nothing leaves it</span>
        </div>

        {/* terminal-chrome card wrapping a self-assembling example diagram */}
        <div className="mt-12 overflow-hidden rounded-sm border border-[#262629] bg-[#0d0d0e] sm:mt-16">
          <div className="flex items-center gap-2 border-b border-[#262629] px-4 py-2.5">
            <span className="h-2 w-2 rounded-full border border-[#3a3a3e]" />
            <span className="h-2 w-2 rounded-full border border-[#3a3a3e]" />
            <span className="h-2 w-2 rounded-full border border-[#3a3a3e]" />
            <span className="ml-2 text-[11px] text-[#5a5a5f]">example.svg</span>
            <span className="ml-auto text-[10px] text-[#5a5a5f]">live preview</span>
          </div>
          <div className="thin-scroll overflow-x-auto p-4 sm:p-6">
            <svg viewBox="0 0 780 220" className="w-full min-w-[640px]" role="img" aria-label="Example diagram: client through load balancer to two servers, a cache, and a database">
              <defs>
                <marker id="hero-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0 0 L8 4 L0 8 Z" fill="#86868c" />
                </marker>
              </defs>

              {HERO_ARROWS.map((d, i) => (
                <path
                  key={d}
                  d={d}
                  stroke="#86868c"
                  strokeWidth="1.5"
                  fill="none"
                  markerEnd="url(#hero-arrow)"
                  className="hero-arrow"
                  style={{ animationDelay: `${420 + i * 110}ms` }}
                  pathLength={100}
                  strokeDasharray={100}
                  strokeDashoffset={100}
                />
              ))}

              {HERO_NODES.map((n, i) => {
                const meta = NODE_TYPES[n.type];
                return (
                  <g key={n.label + n.x} className="hero-node" style={{ animationDelay: `${i * 90}ms` }}>
                    <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="3" fill="#1a1a1d" stroke="#262629" />
                    <rect x={n.x} y={n.y} width="3" height={n.h} fill={meta.color} />
                    <foreignObject x={n.x + 10} y={n.y + (n.h - 20) / 2} width="20" height="20">
                      <NodeIcon type={n.type} color={meta.color} />
                    </foreignObject>
                    <text x={n.x + 38} y={n.y + n.h / 2} dominantBaseline="middle" fill="#c9c9cd" fontSize="11" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
                      {n.label}
                    </text>
                    <circle
                      cx={n.x + n.w - 13}
                      cy={n.y + 13}
                      r="4"
                      fill={STATUS_COLOR[n.status]}
                      className={n.live ? "status-live" : undefined}
                    />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* category legend — the real taxonomy behind the palette above */}
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-[#1a1a1d] pt-5">
          {NODE_CATEGORIES.map((c) => (
            <div key={c.label} className="flex items-center gap-2 text-[11px] text-[#5a5a5f]">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: NODE_TYPES[c.types[0]].color }} />
              {c.label}
              <span className="text-[#3a3a3e]">· {c.types.length}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-5xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.label} className="border-t-2 pt-3" style={{ borderColor: f.accent }}>
              <div className="mb-3 text-[11px] text-[#5a5a5f]">
                <span style={{ color: f.accent }}>// </span>
                {f.label}
              </div>
              <ul className="space-y-2">
                {f.items.map((item) => (
                  <li key={item} className="text-[13px] leading-relaxed text-[#86868c]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full max-w-5xl flex-col gap-3 border-t border-[#262629] px-4 py-6 text-[11px] text-[#5a5a5f] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <span>
          built with plain SVG, no canvas library —{" "}
          <Link href="/editor" className="text-[#86868c] underline underline-offset-2 hover:text-[#e7e7ea]">
            open the editor
          </Link>
        </span>
        <div className="flex items-center gap-4">
          <span className="text-[#5a5a5f]">Ashutosh Swamy</span>
          {DEV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#86868c] underline underline-offset-2 hover:text-[#e7e7ea]"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
