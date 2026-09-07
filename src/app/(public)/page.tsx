import { getHomeContent, HOME_DEFAULTS } from "@/lib/page-content-db";
import { buildHomeSectionMap } from "@/components/sections/home";
import { getLatestJournalEntries } from "@/lib/journal";
import { getLatestVideos } from "@/lib/youtube";

export const revalidate = 60;

export default async function HomePage() {
  const [content, featuredPosts, videos] = await Promise.all([
    getHomeContent().catch(() => null),
    getLatestJournalEntries(3).catch(() => []),
    getLatestVideos(3).catch(() => []),
  ]);
  const c = content ?? HOME_DEFAULTS;
  // The hero's letter card always mirrors the latest entry from The Edit —
  // the same feed (local letters + synced Substack posts) that backs
  // /journal and the "From the Journal" preview below, so it's already
  // sorted newest first.
  const latestEntry = featuredPosts[0] ?? null;
  const newsTitle = latestEntry
    ? latestEntry.title.length > 40 ? latestEntry.title.slice(0, 40).trimEnd() + "…" : latestEntry.title
    : (c.hero.letterCardTitle ?? "The week in fashion news.");
  const newsHref = latestEntry?.href ?? null;
  const newsExternal = latestEntry?.external ?? false;
  const newsImage = latestEntry?.heroImage || null;

  const hidden = new Set(c.hiddenSections ?? []);
  const order = c.sectionOrder ?? HOME_DEFAULTS.sectionOrder;
  const sectionMap = buildHomeSectionMap(c, { featuredPosts, newsTitle, newsHref, newsExternal, newsImage, videos });

  return (
    <>
      {order.filter((id) => !hidden.has(id)).map((id) => (
        <div key={id} data-section-id={id}>{sectionMap[id] ?? null}</div>
      ))}
    </>
  );
}
