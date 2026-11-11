"use client";

import { NODE_CATEGORIES, NODE_TYPES } from "@/lib/visualizer/constants";
import { useVisualizerStore } from "@/lib/visualizer/store";
import type { NodeType } from "@/lib/visualizer/types";
import { NodeIcon } from "./icons";

let clickAddCount = 0;

/** The line key: each category is a transit line, each component a stop on it. */
export function Palette() {
  const addNode = useVisualizerStore((s) => s.addNode);

  function onClickAdd(type: NodeType) {
    const offset = (clickAddCount++ % 6) * 28;
    addNode(type, 120 + offset, 120 + offset);
  }

  return (
    <>
      <nav
        aria-label="Components"
        className="thin-scroll flex shrink-0 gap-2 overflow-x-auto border-t border-line bg-panel p-2 md:hidden"
      >
        {NODE_CATEGORIES.flatMap((c) => c.types).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onClickAdd(type)}
            className="flex h-10 shrink-0 items-center gap-2 rounded-ui border border-line px-3 text-[13px] font-medium"
            style={{ borderBottomColor: NODE_TYPES[type].color, borderBottomWidth: 3 }}
          >
            <NodeIcon type={type} color={NODE_TYPES[type].color} />
            {NODE_TYPES[type].label}
          </button>
        ))}
      </nav>
    <aside
      aria-label="Components"
      className="thin-scroll hidden w-52 shrink-0 overflow-y-auto border-r border-line bg-panel pb-6 md:order-first md:block lg:w-60"
    >
      {NODE_CATEGORIES.map((cat) => {
        const lineColor = NODE_TYPES[cat.types[0]].color;
        return (
          <section key={cat.label} className="px-3 pt-5">
            <h2 className="mb-2 px-2 font-display text-[15px] font-semibold capitalize tracking-tight text-ink">
              {cat.label}
            </h2>
            <ul className="relative">
              <span
                aria-hidden
                className="absolute bottom-4 left-[15px] top-4 w-1 rounded-full"
                style={{ background: lineColor }}
              />
              {cat.types.map((type) => {
                const meta = NODE_TYPES[type];
                return (
                  <li key={type}>
                    <div
                      draggable
                      role="button"
                      tabIndex={0}
                      aria-label={`Add ${meta.label}`}
                      onDragStart={(e) => e.dataTransfer.setData("text/node-type", type)}
                      onClick={() => onClickAdd(type)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onClickAdd(type);
                        }
                      }}
                      className="relative flex cursor-grab items-center gap-3 rounded-ui px-2 py-1.5 text-[14px] font-medium text-muted transition-colors hover:bg-panel-2 hover:text-ink active:cursor-grabbing"
                    >
                      <span
                        className="relative flex size-4 shrink-0 items-center justify-center rounded-full ring-[3px] ring-panel"
                        style={{ background: meta.color }}
                      />
                      <span className="flex size-6 shrink-0 items-center justify-center">
                        <NodeIcon type={type} color={meta.color} />
                      </span>
                      <span className="truncate">{meta.label}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
      <p className="px-5 pt-5 text-[13px] leading-relaxed text-muted">Drag onto the canvas, or click to place.</p>
    </aside>
    </>
  );
}
