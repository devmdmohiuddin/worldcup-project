import type { MetadataRoute } from "next";
import { getGroupStageMatches } from "@/lib/fixtures";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://footballclean.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/standings`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/bracket`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/highlights`, lastModified: now, changeFrequency: "hourly", priority: 0.8 },
    {
      url: `${SITE_URL}/notifications`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  const matchRoutes: MetadataRoute.Sitemap = getGroupStageMatches().map((m) => ({
    url: `${SITE_URL}/match/${m.id}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [...staticRoutes, ...matchRoutes];
}
