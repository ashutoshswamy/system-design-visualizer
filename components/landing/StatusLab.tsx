"use client";

import { useState } from "react";
import { NODE_TYPES, STATUS_COLOR, STATUS_ORDER } from "@/lib/visualizer/constants";
import { edgePath } from "@/lib/visualizer/geometry";
import { CSS_THEME } from "@/lib/visualizer/theme";
import type { NodeStatus } from "@/lib/visualizer/types";
import { Station } from "@/components/visualizer/Station";
import { TrafficDot } from "@/components/visualizer/TrafficDot";

const COPY: Record<NodeStatus, { title: string; meaning: string; effect: string }> = {
  idle: {
    title: "Idle",
    meaning: "Placed on the map, not yet checked.",
    effect: "Nothing is sent to it or from it. It is a plan, not a running service.",
  },
  healthy: {
    title: "Healthy",
    meaning: "Serving traffic as expected.",
    effect: "Requests flow through the API to the database, end to end.",
  },
  warning: {
    title: "Warning",
    meaning: "Degraded, slow, or close to a limit.",
    effect: "Requests still get through, but every hop slows down.",
  },
  down: {
    title: "Down",
    meaning: "Unreachable. Everything downstream feels it.",
    effect: "Requests die at the API. The database never hears about them.",
  },
};

const NODES = {
  client: { x: 20, y: 70 },
  api: { x: 270, y: 70 },
  db: { x: 520, y: 70 },
};
const A = edgePath(NODES.client, NODES.api).d;
const B = edgePath(NODES.api, NODES.db).d;
const ink = { ink: "var(--ink)", bg: "var(--panel)" };

/** Pick a status for the API server; its neighbours' traffic reacts by the same rules the editor uses. */
export function StatusLab() {
  const [status, setStatus] = useState<NodeStatus>("healthy");
  const cycle = () => setStatus((s) => STATUS_ORDER[(STATUS_ORDER.indexOf(s) + 1) % STATUS_ORDER.length]);

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-12">
      <div role="radiogroup" aria-label="Status of the API server" className="flex flex-col gap-2 lg:col-span-5">
        {STATUS_ORDER.map((s) => {
          const on = status === s;
          return (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setStatus(s)}
              className={`flex items-center gap-4 rounded-ui border px-4 py-3.5 text-left transition-colors ${
                on ? "border-ink bg-panel" : "border-line hover:border-muted"
              }`}
            >
              <span
                aria-hidden
                className="size-6 shrink-0 rounded-full border-4 transition-transform duration-300 motion-reduce:transition-none"
                style={{
                  background: STATUS_COLOR[s],
                  borderColor: on ? "var(--ink)" : "var(--ground)",
                  transform: on ? "scale(1.15)" : "scale(1)",
                }}
              />
              <span>
                <span className="block font-display text-xl font-bold tracking-tight">{COPY[s].title}</span>
                <span className="block text-[15px] leading-snug text-muted">{COPY[s].meaning}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="rounded-panel border border-line bg-panel p-3 sm:p-5 lg:col-span-7">
        <svg viewBox="0 0 700 204" className="w-full" role="group" aria-label="A client calls an API server, which calls a database.">
          <defs>
            <pattern id="sl-dots" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.5" style={{ fill: "var(--line)" }} />
            </pattern>
            <marker id="sl-a" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="14" refX="11" refY="7" orient="auto">
              <path d="M1 1 L12 7 L1 13 Z" fill={NODE_TYPES.client.color} stroke={NODE_TYPES.client.color} strokeWidth="1.5" strokeLinejoin="round" />
            </marker>
            <marker id="sl-b" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="14" refX="11" refY="7" orient="auto">
              <path d="M1 1 L12 7 L1 13 Z" fill={NODE_TYPES.server.color} stroke={NODE_TYPES.server.color} strokeWidth="1.5" strokeLinejoin="round" />
            </marker>
          </defs>
          <rect width="700" height="204" fill="url(#sl-dots)" />

          <path id="sl-ab" d={A} stroke={NODE_TYPES.client.color} strokeWidth="4" fill="none" strokeLinecap="round" markerEnd="url(#sl-a)" />
          <path id="sl-bc" d={B} stroke={NODE_TYPES.server.color} strokeWidth="4" fill="none" strokeLinecap="round" markerEnd="url(#sl-b)" />
          <TrafficDot pathId="sl-ab" begin={0.4} from="healthy" to={status} colors={ink} exportable />
          <TrafficDot pathId="sl-bc" begin={0.4} from={status} to="healthy" colors={ink} exportable />

          <g transform={`translate(${NODES.client.x}, ${NODES.client.y})`}>
            <Station type="client" label="web client" status="healthy" colors={CSS_THEME} />
          </g>
          <g transform={`translate(${NODES.api.x}, ${NODES.api.y})`}>
            <Station type="server" label="api server" status={status} colors={CSS_THEME} onStatusClick={cycle} />
          </g>
          <g transform={`translate(${NODES.db.x}, ${NODES.db.y})`}>
            <Station type="database" label="postgres" status="healthy" colors={CSS_THEME} />
          </g>
        </svg>
        <p aria-live="polite" className="mt-4 border-t border-line pt-4 text-[17px] leading-snug">
          <span className="font-semibold">{COPY[status].title}.</span>{" "}
          <span className="text-muted">{COPY[status].effect}</span>
        </p>
      </div>
    </div>
  );
}
