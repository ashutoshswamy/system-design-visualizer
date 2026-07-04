"use client";

import { NODE_CATEGORIES, NODE_TYPES } from "@/lib/visualizer/constants";
import { useVisualizerStore } from "@/lib/visualizer/store";
import type { NodeType } from "@/lib/visualizer/types";
import { NodeIcon } from "./icons";

let clickAddCount = 0;

export function Palette() {
  const addNode = useVisualizerStore((s) => s.addNode);

  function onClickAdd(type: NodeType) {
    const offset = (clickAddCount++ % 6) * 24;
    addNode(type, 80 + offset, 80 + offset);
  }

  return (
    <div className="thin-scroll w-40 shrink-0 border-r border-[var(--border-c)] bg-[var(--panel)] overflow-y-auto font-mono text-sm sm:w-60">
      {NODE_CATEGORIES.map((cat) => (
        <div key={cat.label} className="px-3 pt-4 first:pt-3">
          <div className="mb-2 text-[11px] text-[var(--muted-2)] select-none">
            <span className="text-[#f0b429]/70">// </span>
            {cat.label}
          </div>
          <div className="flex flex-col gap-1 pb-1">
            {cat.types.map((type) => {
              const meta = NODE_TYPES[type];
              return (
                <div
                  key={type}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/node-type", type)}
                  onClick={() => onClickAdd(type)}
                  className="group flex items-center gap-2 rounded-sm border border-[var(--border-c)] bg-[var(--panel-2)] py-1.5 pl-2 pr-2.5 text-[var(--muted)] transition-all duration-100 hover:translate-x-0.5 hover:border-[color:var(--hover-color)] hover:text-[var(--foreground)] active:cursor-grabbing"
                  style={{ ["--hover-color" as string]: meta.color, cursor: "grab" }}
                >
                  <span
                    className="h-6 w-0.5 shrink-0 rounded-full opacity-70 group-hover:opacity-100"
                    style={{ backgroundColor: meta.color }}
                  />
                  <NodeIcon type={type} color={meta.color} />
                  <span className="truncate text-[13px]">{meta.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div className="px-3 pb-4 pt-2 text-[11px] leading-relaxed text-[var(--muted-2)]">
        drag onto canvas, or click to place
      </div>
    </div>
  );
}
