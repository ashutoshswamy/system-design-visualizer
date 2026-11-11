import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Design Visualizer",
    description: SITE_DESCRIPTION,
    start_url: "/editor",
    display: "standalone",
    background_color: "#f4f5f7",
    theme_color: "#12151c",
    icons: [{ src: "/icon-light.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
