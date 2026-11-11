export type NodeType =
  | "client"
  | "mobile"
  | "cdn"
  | "dns"
  | "loadbalancer"
  | "gateway"
  | "server"
  | "microservice"
  | "worker"
  | "scheduler"
  | "database"
  | "nosql"
  | "cache"
  | "storage"
  | "search"
  | "queue"
  | "pubsub"
  | "thirdparty"
  | "auth"
  | "firewall"
  | "monitoring"
  | "iot"
  | "proxy"
  | "mesh"
  | "cluster"
  | "serverless"
  | "warehouse"
  | "timeseries"
  | "graphdb"
  | "stream"
  | "notification"
  | "vault"
  | "logging";

export type NodeStatus = "idle" | "healthy" | "warning" | "down";

export interface DesignNode {
  id: string;
  type: NodeType;
  label: string;
  x: number;
  y: number;
  status: NodeStatus;
  groupId?: string;
}

export interface DesignEdge {
  id: string;
  from: string;
  to: string;
}

export interface DesignState {
  nodes: DesignNode[];
  edges: DesignEdge[];
  name?: string;
}
