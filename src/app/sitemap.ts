import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { seedProjects } from "@/lib/seed";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    ...seedProjects.map((p) => ({
      url: `${base}/projects/${p.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
