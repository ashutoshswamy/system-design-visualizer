import type { NodeStatus, NodeType } from "./types";

export const CANVAS_W = 2000;
export const CANVAS_H = 1200;
export const NODE_W = 160;
export const NODE_H = 64;

export const STATUS_ORDER: NodeStatus[] = ["idle", "healthy", "warning", "down"];

export const STATUS_COLOR: Record<NodeStatus, string> = {
  idle: "#6b7280",
  healthy: "#22c55e",
  warning: "#eab308",
  down: "#ef4444",
};

/** Accent hue signals tier: blue = client/edge, indigo/violet = compute, orange/pink = data, teal = messaging, slate = integration & ops. */
export const NODE_TYPES: Record<NodeType, { label: string; color: string }> = {
  client: { label: "Client", color: "#60a5fa" },
  mobile: { label: "Mobile Client", color: "#7dd3fc" },
  cdn: { label: "CDN", color: "#38bdf8" },
  dns: { label: "DNS", color: "#0ea5e9" },
  iot: { label: "IoT Device", color: "#67e8f9" },

  loadbalancer: { label: "Load Balancer", color: "#818cf8" },
  gateway: { label: "API Gateway", color: "#6366f1" },
  server: { label: "Server", color: "#a78bfa" },
  microservice: { label: "Microservice", color: "#c084fc" },
  worker: { label: "Worker", color: "#8b5cf6" },
  scheduler: { label: "Scheduler", color: "#a855f7" },
  proxy: { label: "Reverse Proxy", color: "#5b6cf0" },
  mesh: { label: "Service Mesh", color: "#7c3aed" },
  cluster: { label: "Container Cluster", color: "#9f7aea" },
  serverless: { label: "Serverless Function", color: "#c4a6f7" },

  database: { label: "Database", color: "#f97316" },
  nosql: { label: "NoSQL Store", color: "#fb923c" },
  cache: { label: "Cache", color: "#f472b6" },
  storage: { label: "Object Storage", color: "#fdba74" },
  search: { label: "Search Index", color: "#e879f9" },
  warehouse: { label: "Data Warehouse", color: "#c2410c" },
  timeseries: { label: "Time-Series DB", color: "#f9a8d4" },
  graphdb: { label: "Graph DB", color: "#be185d" },

  queue: { label: "Message Queue", color: "#2dd4bf" },
  pubsub: { label: "Pub/Sub", color: "#5eead4" },
  stream: { label: "Event Stream", color: "#0d9488" },

  thirdparty: { label: "Third-Party API", color: "#94a3b8" },
  auth: { label: "Auth Service", color: "#c4b5fd" },
  firewall: { label: "Firewall / WAF", color: "#78716c" },
  monitoring: { label: "Monitoring", color: "#a3a3a3" },
  logging: { label: "Log Store", color: "#cbd5e1" },
  notification: { label: "Notifications", color: "#64748b" },
  vault: { label: "Secrets Vault", color: "#a8a29e" },
};

export const COMPONENT_COUNT = Object.keys(NODE_TYPES).length;

export const NODE_CATEGORIES: { label: string; types: NodeType[] }[] = [
  { label: "client & edge", types: ["client", "mobile", "iot", "cdn", "dns"] },
  { label: "compute", types: ["loadbalancer", "gateway", "server", "microservice", "worker", "scheduler", "proxy", "mesh", "cluster", "serverless"] },
  { label: "data", types: ["database", "nosql", "cache", "storage", "search", "warehouse", "timeseries", "graphdb"] },
  { label: "messaging", types: ["queue", "pubsub", "stream"] },
  { label: "integration & ops", types: ["thirdparty", "auth", "firewall", "monitoring", "logging", "notification", "vault"] },
];
