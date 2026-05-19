import { getFeaturedBlogPosts, getAllBlogPosts } from "@/lib/blog-db";
import { getHomeContent, HOME_DEFAULTS } from "@/lib/page-content-db";
import { buildHomeSectionMap } from "@/components/sections/home";

export const revalidate = 60;

export default async function HomePage() {
  const [content, featuredPosts, allPosts] = await Promise.all([
    getHomeContent().catch(() => null),
    getFeaturedBlogPosts(3).catch(() => []),
    getAllBlogPosts().catch(() => []),
  ]);
  const c = content ?? HOME_DEFAULTS;
  const latestPost = allPosts[0] ?? null;
  const letterTitle = latestPost
    ? latestPost.title.length > 40 ? latestPost.title.slice(0, 40).trimEnd() + "…" : latestPost.title
    : (c.hero.letterCardTitle ?? "On dressing for the life you want.");
  const letterSlug = latestPost?.slug ?? null;

  const hidden = new Set(c.hiddenSections ?? []);
  const order = c.sectionOrder ?? HOME_DEFAULTS.sectionOrder;
  const sectionMap = buildHomeSectionMap(c, { featuredPosts, letterTitle, letterSlug });

  return (
    <>
      {order.filter((id) => !hidden.has(id)).map((id) => (
        <div key={id} data-section-id={id}>{sectionMap[id] ?? null}</div>
      ))}
    </>
  );
}
