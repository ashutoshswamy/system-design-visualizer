import type { DesignEdge, DesignNode, NodeStatus, NodeType } from "./visualizer/types";

export interface Example {
  slug: string;
  title: string; // h1
  metaTitle: string;
  description: string;
  summary: string;
  requirements: string[];
  flow: string[];
  components: { type: NodeType; why: string }[];
  tradeoffs: string[];
  nodes: { id: string; type: NodeType; label: string; x: number; y: number; status?: NodeStatus }[];
  links: [string, string][];
}

export const EXAMPLES: Example[] = [
  {
    slug: "url-shortener",
    title: "URL shortener system design",
    metaTitle: "URL Shortener System Design Diagram",
    description:
      "A URL shortener architecture diagram: load balancer, API, cache, database and a click-event queue. See how each component fits and open it in the editor.",
    summary:
      "A URL shortener turns a long link into a short code and redirects visitors back to it. Reads vastly outnumber writes, so the design is built around fast, cacheable lookups.",
    requirements: [
      "Create a short code for a long URL and store the mapping",
      "Redirect a short code to its URL with very low latency",
      "Record clicks without slowing the redirect",
      "Handle far more reads than writes",
    ],
    flow: [
      "The client sends a request for a short code to the load balancer.",
      "The load balancer spreads requests across stateless API servers.",
      "The API checks the cache first; on a miss it reads the database and fills the cache.",
      "The API returns a redirect and drops a click event on a queue.",
      "A worker drains the queue and writes analytics, off the redirect path.",
    ],
    components: [
      { type: "loadbalancer", why: "Spreads traffic across API servers and removes a failed one from rotation." },
      { type: "server", why: "Stateless API that creates codes and resolves them, so it scales by adding instances." },
      { type: "cache", why: "Hot codes are served from memory, which keeps the common redirect fast." },
      { type: "database", why: "Durable source of truth for code to URL mappings, indexed on the code." },
      { type: "queue", why: "Decouples click tracking from the redirect so analytics can lag without hurting users." },
      { type: "worker", why: "Consumes click events and aggregates them in batches." },
    ],
    tradeoffs: [
      "Random codes avoid guessable URLs but need a collision check; a counter is simpler but predictable.",
      "A longer cache TTL cuts database load but delays edits and deletions.",
      "Counting clicks asynchronously means totals are eventually consistent.",
    ],
    nodes: [
      { id: "c", type: "client", label: "web client", x: 40, y: 120, status: "healthy" },
      { id: "lb", type: "loadbalancer", label: "load balancer", x: 300, y: 120, status: "healthy" },
      { id: "api", type: "server", label: "shortener api", x: 560, y: 120, status: "healthy" },
      { id: "cache", type: "cache", label: "redis cache", x: 820, y: 20, status: "healthy" },
      { id: "db", type: "database", label: "url store", x: 820, y: 120, status: "healthy" },
      { id: "q", type: "queue", label: "click events", x: 820, y: 220, status: "healthy" },
      { id: "w", type: "worker", label: "analytics worker", x: 1080, y: 220, status: "healthy" },
    ],
    links: [["c", "lb"], ["lb", "api"], ["api", "cache"], ["api", "db"], ["api", "q"], ["q", "w"]],
  },
  {
    slug: "chat-app",
    title: "Chat app system design",
    metaTitle: "Chat App System Design Diagram",
    description:
      "A real-time chat architecture diagram: gateway, chat service, message store, pub/sub bus, presence cache and push notifications. Open it in the editor.",
    summary:
      "A chat app delivers messages between users in real time and keeps history. The hard parts are holding many open connections and routing a message to whichever server a recipient is connected to.",
    requirements: [
      "Deliver messages in real time over persistent connections",
      "Store message history durably and load it quickly",
      "Show who is online",
      "Notify offline users",
    ],
    flow: [
      "A mobile client opens a long-lived connection through the API gateway.",
      "The gateway authenticates the user and hands messages to the chat service.",
      "The chat service writes the message to the message store.",
      "It publishes the message on the bus so the server holding the recipient's connection can push it.",
      "If the recipient is offline, the notification service sends a push message instead.",
    ],
    components: [
      { type: "gateway", why: "Terminates connections, authenticates users and rate-limits clients." },
      { type: "microservice", why: "Owns chat logic and scales independently from connection handling." },
      { type: "nosql", why: "Wide-column or document store partitioned by conversation for fast history reads." },
      { type: "pubsub", why: "Routes a message to the right server without each server knowing the others." },
      { type: "cache", why: "Holds presence and last-seen state with short expiries." },
      { type: "notification", why: "Sends push notifications to users with no live connection." },
    ],
    tradeoffs: [
      "Writing to the store before publishing is safer but adds latency to delivery.",
      "Presence in a cache is cheap but approximate; a crashed server leaves stale entries until they expire.",
      "Per-conversation ordering is simple; global ordering is expensive and rarely needed.",
    ],
    nodes: [
      { id: "m", type: "mobile", label: "mobile client", x: 40, y: 120, status: "healthy" },
      { id: "gw", type: "gateway", label: "api gateway", x: 300, y: 120, status: "healthy" },
      { id: "chat", type: "microservice", label: "chat service", x: 560, y: 120, status: "healthy" },
      { id: "store", type: "nosql", label: "message store", x: 820, y: 20, status: "healthy" },
      { id: "bus", type: "pubsub", label: "message bus", x: 820, y: 120, status: "healthy" },
      { id: "presence", type: "cache", label: "presence cache", x: 820, y: 220, status: "healthy" },
      { id: "push", type: "notification", label: "push notifications", x: 1080, y: 120, status: "healthy" },
    ],
    links: [["m", "gw"], ["gw", "chat"], ["chat", "store"], ["chat", "bus"], ["chat", "presence"], ["bus", "push"]],
  },
  {
    slug: "news-feed",
    title: "News feed system design",
    metaTitle: "News Feed System Design Diagram",
    description:
      "A social news feed architecture diagram: feed API, feed cache, posts database and a fan-out queue with workers. See the flow and open it in the editor.",
    summary:
      "A news feed shows each user a ranked list of recent posts from people they follow. The central choice is when to build the feed: when someone posts (fan-out on write) or when someone reads.",
    requirements: [
      "Show a user the latest posts from the accounts they follow",
      "Load the feed in well under a second",
      "Publish a post without waiting for every follower's feed to update",
      "Cope with accounts that have millions of followers",
    ],
    flow: [
      "A user publishes a post through the load balancer to the feed API.",
      "The API stores the post in the posts database and enqueues a fan-out job.",
      "Fan-out workers prepend the post id to each follower's feed in the cache.",
      "When a follower opens the app, the API reads the precomputed feed from the cache.",
      "Missing entries are filled from the database and the feed is ranked before it is returned.",
    ],
    components: [
      { type: "loadbalancer", why: "Distributes read-heavy feed requests across API servers." },
      { type: "server", why: "Handles publishing and feed reads; stateless so it scales horizontally." },
      { type: "database", why: "Stores posts and the follow graph as the durable record." },
      { type: "cache", why: "Holds each user's precomputed feed so reads avoid expensive queries." },
      { type: "queue", why: "Buffers fan-out work so publishing returns immediately." },
      { type: "worker", why: "Writes new posts into follower feeds in the background." },
    ],
    tradeoffs: [
      "Fan-out on write makes reads fast but is costly for accounts with huge follower counts.",
      "Many systems mix both: fan-out on write for ordinary users, fan-out on read for celebrities.",
      "Precomputed feeds can be slightly stale; that is usually acceptable for a feed.",
    ],
    nodes: [
      { id: "c", type: "client", label: "web client", x: 40, y: 120, status: "healthy" },
      { id: "lb", type: "loadbalancer", label: "load balancer", x: 300, y: 120, status: "healthy" },
      { id: "api", type: "server", label: "feed api", x: 560, y: 120, status: "healthy" },
      { id: "cache", type: "cache", label: "feed cache", x: 820, y: 20, status: "healthy" },
      { id: "db", type: "database", label: "posts database", x: 820, y: 120, status: "healthy" },
      { id: "q", type: "queue", label: "fan-out queue", x: 820, y: 220, status: "healthy" },
      { id: "w", type: "worker", label: "fan-out worker", x: 1080, y: 220, status: "healthy" },
    ],
    links: [["c", "lb"], ["lb", "api"], ["api", "cache"], ["api", "db"], ["api", "q"], ["q", "w"]],
  },
];

export const getExample = (slug: string) => EXAMPLES.find((e) => e.slug === slug);

export function exampleDesign(e: Example): { name: string; nodes: DesignNode[]; edges: DesignEdge[] } {
  return {
    name: e.metaTitle.replace(" Diagram", ""),
    nodes: e.nodes.map((n) => ({ id: n.id, type: n.type, label: n.label, x: n.x, y: n.y, status: n.status ?? "healthy" })),
    edges: e.links.map(([from, to], i) => ({ id: `${e.slug}-${i}`, from, to })),
  };
}
