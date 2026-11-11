import type { NodeType } from "@/lib/visualizer/types";

/** Authored stroke glyphs, monochrome, so they survive PNG export without fonts or assets. */
const PATHS: Record<NodeType, string> = {
  client: "M4 3h16v12H4z M9 19h6 M12 15v4",
  mobile: "M8 2h8v20H8z M11 19h2",
  cdn: "M4 8a8 8 0 0 1 16 0 M4 8v4a8 8 0 0 0 16 0V8 M4 8h16 M12 8v9",
  dns: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M3 12h18 M12 3c2.3 2.1 3.6 5.2 3.6 9s-1.3 6.9-3.6 9 M12 3c-2.3 2.1-3.6 5.2-3.6 9s1.3 6.9 3.6 9",

  loadbalancer: "M12 3v6 M4 15l8-6 8 6 M4 15v6h16v-6",
  gateway: "M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0 M4 12h16 M12 4a12 12 0 0 1 0 16 12 12 0 0 1 0-16",
  server: "M4 4h16v6H4z M4 14h16v6H4z M7 7h.01 M7 17h.01",
  microservice: "M6 6h4v4H6z M14 6h4v4h-4z M6 14h4v4H6z M14 14h4v4h-4z M10 8h4 M8 10v4 M16 10v4 M10 16h4",
  worker: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M12 2v3 M12 19v3 M4.9 4.9l2.1 2.1 M17 17l2.1 2.1 M2 12h3 M19 12h3 M4.9 19.1l2.1-2.1 M17 7l2.1-2.1",
  scheduler: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l4 2",

  database: "M12 5c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3z M4 8v8c0 1.7 3.6 3 8 3s8-1.3 8-3V8 M4 13c0 1.7 3.6 3 8 3s8-1.3 8-3",
  nosql: "M5 4h9l4 4v12H5z M14 4v4h4 M8 12h8 M8 16h8",
  cache: "M4 6h16v4H4z M4 14h16v4H4z M7 8h.01 M7 16h.01",
  storage: "M4 6h6l2 3h8v9H4z",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M16 16l5 5",

  queue: "M4 12h4 M10 12h4 M16 12h4 M6 8v8 M12 8v8 M18 8v8",
  pubsub: "M12 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4z M8.5 9.5a6 6 0 0 0 0 9 M15.5 9.5a6 6 0 0 1 0 9 M5.5 6.5a10 10 0 0 0 0 15 M18.5 6.5a10 10 0 0 1 0 15",

  thirdparty: "M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z",
  auth: "M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6z M9.5 12.5l1.8 1.8L15 10.5",
  firewall: "M4 5h16v14H4z M4 9.5h16 M4 14h16 M9.5 5v4.5 M15 9.5v4.5 M9.5 14v5",
  monitoring: "M4 12h3l2-6 3 12 3-9 2 5h3",

  iot: "M8 8h8v8H8z M10 4v4 M14 4v4 M10 16v4 M14 16v4 M4 10h4 M4 14h4 M16 10h4 M16 14h4",
  proxy: "M4 8h13 M14 5l3 3-3 3 M20 16H7 M10 13l-3 3 3 3",
  mesh: "M4 8h16 M4 16h16 M8 4v16 M16 4v16",
  cluster: "M12 3l8 4.5v9L12 21l-8-4.5v-9z M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z",
  serverless: "M13 3L5 13h6l-1 8 8-10h-6z",
  warehouse: "M3 9l9-5 9 5 M5 9v10h14V9 M9 19v-6h6v6",
  timeseries: "M4 4v16h16 M7 15l3-4 3 2 5-6",
  graphdb: "M10 4a2 2 0 1 0 4 0 2 2 0 0 0-4 0z M4 16a2 2 0 1 0 4 0 2 2 0 0 0-4 0z M16 16a2 2 0 1 0 4 0 2 2 0 0 0-4 0z M11 6l-4 8 M13 6l4 8 M8 17h8",
  stream: "M3 8c3-3 6 3 9 0s6 3 9 0 M3 16c3-3 6 3 9 0s6 3 9 0",
  notification: "M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z M10 21h4",
  vault: "M6 11h12v9H6z M8 11V8a4 4 0 0 1 8 0v3 M12 15v2",
  logging: "M5 4h14v16H5z M8 9h8 M8 13h8 M8 17h5",
};

/** Same glyph as raw SVG children (24x24 box) so it can sit inside any <svg> without a foreignObject. */
export function NodeGlyph({ type, color, strokeWidth = 1.75 }: { type: NodeType; color: string; strokeWidth?: number }) {
  return (
    <path
      d={PATHS[type]}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

export function NodeIcon({ type, color }: { type: NodeType; color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <path d={PATHS[type]} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
