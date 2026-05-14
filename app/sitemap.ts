import type { MetadataRoute } from "next";
import { getCombosFromMarkdown } from "@/data/combos";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://opencombocodex.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const engines = Array.from(new Set(getCombosFromMarkdown().map((combo) => combo.engineId)));

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...engines.map((engineId) => ({
      url: `${siteUrl}/#${engineId}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
