import type { MetadataRoute } from "next";
import { PROJECTS, SITE_URL } from "./data";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    ...PROJECTS.filter((p) => p.caseStudy).map((p) => ({
      url: `${SITE_URL}/work/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/os`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
