import type { MetadataRoute } from "next";
import { EXAMPLES } from "@/lib/examples";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-11-12");
  return [
    { url: SITE_URL, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/editor`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/examples`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    ...EXAMPLES.map((e) => ({ url: `${SITE_URL}/examples/${e.slug}`, lastModified, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
