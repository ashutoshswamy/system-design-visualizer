import type { NodeStatus } from "./types";

export type Flow = { kind: "flow" | "drop"; dur: number } | null;

/**
 * What traffic on a connection looks like, from the two components' statuses:
 * - idle or down source, or idle target: nothing is sent, no dots
 * - down target: requests go out and die before arriving ("drop")
 * - warning at either end: traffic still arrives, but slowly
 * - healthy both ends: steady flow
 */
export function flowFor(from: NodeStatus, to: NodeStatus): Flow {
  if (from === "idle" || from === "down" || to === "idle") return null;
  if (to === "down") return { kind: "drop", dur: from === "warning" ? 6 : 3.4 };
  return { kind: "flow", dur: from === "warning" || to === "warning" ? 6 : 3.4 };
}
