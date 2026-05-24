import { getFeaturedBlogPosts, getLatestFashionNewsPost } from "@/lib/blog-db";
import { getHomeContent, HOME_DEFAULTS } from "@/lib/page-content-db";
import { buildHomeSectionMap } from "@/components/sections/home";

export const revalidate = 60;

export default async function HomePage() {
  const [content, featuredPosts, latestNews] = await Promise.all([
    getHomeContent().catch(() => null),
    getFeaturedBlogPosts(3).catch(() => []),
    getLatestFashionNewsPost().catch(() => null),
  ]);
  const c = content ?? HOME_DEFAULTS;
  const newsTitle = latestNews
    ? latestNews.title.length > 40 ? latestNews.title.slice(0, 40).trimEnd() + "…" : latestNews.title
    : (c.hero.letterCardTitle ?? "The week in fashion news.");
  const newsSlug = latestNews?.slug ?? null;
  const newsImage = latestNews?.heroImage ?? null;

  const hidden = new Set(c.hiddenSections ?? []);
  const order = c.sectionOrder ?? HOME_DEFAULTS.sectionOrder;
  const sectionMap = buildHomeSectionMap(c, { featuredPosts, newsTitle, newsSlug, newsImage });

  return (
    <>
      {order.filter((id) => !hidden.has(id)).map((id) => (
        <div key={id} data-section-id={id}>{sectionMap[id] ?? null}</div>
      ))}
    </>
  );
}
