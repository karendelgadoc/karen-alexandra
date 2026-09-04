import { getLatestFashionNewsPost } from "@/lib/blog-db";
import { getHomeContent, HOME_DEFAULTS } from "@/lib/page-content-db";
import { buildHomeSectionMap } from "@/components/sections/home";
import { getLatestJournalEntries } from "@/lib/journal";
import { getLatestVideos } from "@/lib/youtube";

export const revalidate = 60;

export default async function HomePage() {
  const [content, featuredPosts, latestNews, videos] = await Promise.all([
    getHomeContent().catch(() => null),
    getLatestJournalEntries(3).catch(() => []),
    getLatestFashionNewsPost().catch(() => null),
    getLatestVideos(3).catch(() => []),
  ]);
  const c = content ?? HOME_DEFAULTS;
  const newsTitle = latestNews
    ? latestNews.title.length > 40 ? latestNews.title.slice(0, 40).trimEnd() + "…" : latestNews.title
    : (c.hero.letterCardTitle ?? "The week in fashion news.");
  const newsSlug = latestNews?.slug ?? null;
  const newsImage = latestNews?.heroImage ?? null;

  const hidden = new Set(c.hiddenSections ?? []);
  const order = c.sectionOrder ?? HOME_DEFAULTS.sectionOrder;
  const sectionMap = buildHomeSectionMap(c, { featuredPosts, newsTitle, newsSlug, newsImage, videos });

  return (
    <>
      {order.filter((id) => !hidden.has(id)).map((id) => (
        <div key={id} data-section-id={id}>{sectionMap[id] ?? null}</div>
      ))}
    </>
  );
}
