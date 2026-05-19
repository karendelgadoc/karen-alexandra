import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog-db";
import { getAllSlugs } from "@/lib/posts-db";

const SITE = "https://karenalexandra.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`,            lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE}/portfolio`,   lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/journal`,     lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE}/case-studies`,lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/watch`,       lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE}/about`,       lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/contact`,     lastModified: now, changeFrequency: "yearly",  priority: 0.6 },
    { url: `${SITE}/privacy`,     lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];

  const [blogPosts, caseSlugs] = await Promise.all([
    getAllBlogPosts().catch(() => []),
    getAllSlugs().catch(() => []),
  ]);

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${SITE}/journal/${p.slug}`,
    lastModified: p.date ? new Date(p.date) : now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const caseRoutes: MetadataRoute.Sitemap = caseSlugs.map((slug) => ({
    url: `${SITE}/case-studies/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes, ...caseRoutes];
}
