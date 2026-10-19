import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;
  const now = new Date();

  return [
    { url: `${base}/`, lastModified: now, priority: 1 },
    { url: `${base}/services`, lastModified: now, priority: 0.9 },
    { url: `${base}/prices`, lastModified: now, priority: 0.9 },
    { url: `${base}/quote`, lastModified: now, priority: 0.9 },
    { url: `${base}/about`, lastModified: now, priority: 0.5 },
    { url: `${base}/contact`, lastModified: now, priority: 0.7 },
    { url: `${base}/privacy`, lastModified: now, priority: 0.2 },
  ];
}
