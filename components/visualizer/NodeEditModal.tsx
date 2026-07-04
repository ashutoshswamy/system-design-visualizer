"use client";

import { useState } from "react";
import { STATUS_ORDER } from "@/lib/visualizer/constants";
import { useVisualizerStore } from "@/lib/visualizer/store";
import type { NodeStatus } from "@/lib/visualizer/types";

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

  if (!node) return null;

  function close() {
    setEditing(null);
  }

  function save() {
    renameNode(node!.id, label.trim() || node!.label);
    setStatus(node!.id, status);
    close();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={close}
    >
      <div
        className="w-full max-w-80 rounded-sm border border-[var(--border-c)] bg-[var(--panel)] p-4 font-mono text-sm text-[var(--foreground)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-3">Edit component</div>

        <label className="block text-xs text-[var(--muted)] mb-1">Name</label>
        <input
          autoFocus
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && save()}
          className="w-full mb-3 rounded-sm border border-[var(--border-c)] bg-[var(--panel-2)] px-2 py-1.5 text-[var(--foreground)] outline-none focus:border-[#f0b429]"
        />

        <label className="block text-xs text-[var(--muted)] mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatusLocal(e.target.value as NodeStatus)}
          className="w-full mb-4 rounded-sm border border-[var(--border-c)] bg-[var(--panel-2)] px-2 py-1.5 text-[var(--foreground)] outline-none focus:border-[#f0b429]"
        >
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1.5 rounded-sm border border-[var(--border-c)] hover:border-[#f0b429]"
            onClick={close}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1.5 rounded-sm border border-[#f0b429] bg-[#f0b429] text-[#0a0a0b]"
            onClick={save}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
