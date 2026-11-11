"use client";

import { useEffect, useState } from "react";
import { sileo } from "sileo";
import { NODE_TYPES, STATUS_COLOR, STATUS_ORDER } from "@/lib/visualizer/constants";
import { useVisualizerStore } from "@/lib/visualizer/store";
import type { NodeStatus } from "@/lib/visualizer/types";

const STATUS_HINT: Record<NodeStatus, string> = {
  idle: "Placed, not checked",
  healthy: "Serving traffic",
  warning: "Degraded or slow",
  down: "Unreachable",
};

export function NodeEditModal() {
  const { editingId } = useVisualizerStore();
  if (!editingId) return null;
  return <NodeEditModalInner key={editingId} id={editingId} />;
}

function NodeEditModalInner({ id }: { id: string }) {
  const { nodes, setEditing, renameNode, setStatus } = useVisualizerStore();
  const node = nodes.find((n) => n.id === id);
  const [label, setLabel] = useState(node?.label ?? "");
  const [status, setStatusLocal] = useState<NodeStatus>(node?.status ?? "idle");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setEditing(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setEditing]);

  if (!node) return null;
  const meta = NODE_TYPES[node.type];

  function save() {
    const name = label.trim() || node!.label;
    renameNode(node!.id, name);
    setStatus(node!.id, status);
    setEditing(null);
    sileo.success({ title: "Component updated", description: `${name} is ${status}.` });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
      onClick={() => setEditing(null)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Edit ${meta.label}`}
        className="w-full max-w-sm rounded-panel border border-line bg-panel p-5 text-ink shadow-[0_24px_60px_-20px_rgb(var(--shadow)/0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center gap-3">
          <span className="size-3.5 rounded-full" style={{ background: meta.color }} />
          <h2 className="font-display text-xl font-bold tracking-tight">Edit {meta.label}</h2>
        </div>

        <label htmlFor="node-name" className="mb-1.5 block text-[13px] font-medium text-muted">
          Name
        </label>
        <input
          id="node-name"
          autoFocus
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && save()}
          className="mb-5 h-10 w-full rounded-ui border border-line bg-ground px-3 text-[15px] text-ink outline-none transition-colors focus:border-ink"
        />

        <div className="mb-1.5 text-[13px] font-medium text-muted" id="status-label">
          Status
        </div>
        <div role="radiogroup" aria-labelledby="status-label" className="mb-6 grid grid-cols-2 gap-2">
          {STATUS_ORDER.map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={status === s}
              onClick={() => setStatusLocal(s)}
              className={`flex flex-col items-start gap-0.5 rounded-ui border px-3 py-2 text-left transition-colors ${
                status === s ? "border-ink bg-panel-2" : "border-line hover:border-muted"
              }`}
            >
              <span className="flex items-center gap-2 text-[14px] font-semibold capitalize">
                <span className="size-2.5 rounded-full" style={{ background: STATUS_COLOR[s] }} />
                {s}
              </span>
              <span className="text-[12px] text-muted">{STATUS_HINT[s]}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="h-10 rounded-ui border border-line px-4 text-[14px] font-medium transition-colors hover:border-muted"
            onClick={() => setEditing(null)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="h-10 rounded-ui bg-ink px-5 text-[14px] font-semibold text-on-ink transition-transform active:scale-[0.98]"
            onClick={save}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
