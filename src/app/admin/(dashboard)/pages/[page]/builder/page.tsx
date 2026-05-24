import { notFound } from "next/navigation";
import Link from "next/link";
import {
  PAGE_KEYS,
  PAGE_LABELS,
  PAGE_SECTIONS,
  getHomeContent,
  getPortfolioContent,
  getContactContent,
  getWatchContent,
  getAboutContent,
  HOME_DEFAULTS,
  PORTFOLIO_DEFAULTS,
  CONTACT_DEFAULTS,
  WATCH_DEFAULTS,
  ABOUT_DEFAULTS,
  type PageKey,
} from "@/lib/page-content-db";
import { buildHomeSectionMap }      from "@/components/sections/home";
import { buildPortfolioSectionMap } from "@/components/sections/portfolio";
import { buildContactSectionMap }   from "@/components/sections/contact";
import { buildWatchSectionMap }     from "@/components/sections/watch";
import { buildAboutSectionMap }     from "@/components/sections/about";
import { getFeaturedBlogPosts } from "@/lib/blog-db";
import { getAllPosts } from "@/lib/posts-db";
import { getLatestVideos } from "@/lib/youtube";
import PageBuilder from "./PageBuilder";

export const dynamic = "force-dynamic";

async function buildSections(page: PageKey) {
  switch (page) {
    case "home": {
      const [content, featuredPosts] = await Promise.all([
        getHomeContent().catch(() => null),
        getFeaturedBlogPosts(3).catch(() => []),
      ]);
      const c = content ?? HOME_DEFAULTS;
      const newsTitle = c.hero.letterCardTitle ?? "The week in fashion news.";
      return { c, sectionMap: buildHomeSectionMap(c, { featuredPosts, newsTitle, newsSlug: null, newsImage: null }), defaults: HOME_DEFAULTS };
    }
    case "portfolio": {
      const [posts, content] = await Promise.all([getAllPosts(), getPortfolioContent().catch(() => null)]);
      const c = content ?? PORTFOLIO_DEFAULTS;
      return { c, sectionMap: buildPortfolioSectionMap(c, { posts }), defaults: PORTFOLIO_DEFAULTS };
    }
    case "about": {
      const [posts, content] = await Promise.all([getAllPosts(), getAboutContent().catch(() => null)]);
      const c = content ?? ABOUT_DEFAULTS;
      return { c, sectionMap: buildAboutSectionMap(c, { posts }), defaults: ABOUT_DEFAULTS };
    }
    case "contact": {
      const content = await getContactContent().catch(() => null);
      const c = content ?? CONTACT_DEFAULTS;
      return { c, sectionMap: buildContactSectionMap(c), defaults: CONTACT_DEFAULTS };
    }
    case "watch": {
      const [content, videos] = await Promise.all([
        getWatchContent().catch(() => null),
        getLatestVideos(12),
      ]);
      const c = content ?? WATCH_DEFAULTS;
      return { c, sectionMap: buildWatchSectionMap(c, { videos }), defaults: WATCH_DEFAULTS };
    }
  }
}

export default async function BuilderPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  if (!PAGE_KEYS.includes(page as PageKey)) notFound();
  const pageKey = page as PageKey;

  const { c, sectionMap, defaults } = await buildSections(pageKey);

  const labelMap = Object.fromEntries(
    PAGE_SECTIONS[pageKey].map((s) => [s.id, s.label]),
  ) as Record<string, string>;

  const order: string[] = (c.sectionOrder as string[] | undefined) ?? defaults.sectionOrder;
  const hidden: string[] = (c.hiddenSections as string[] | undefined) ?? [];

  // Build full ordered list including hidden sections, so the user can unhide them.
  const allIds = Array.from(new Set([...order, ...PAGE_SECTIONS[pageKey].map((s) => s.id)]));

  const sectionItems = allIds.map((id) => ({
    id,
    label: labelMap[id] ?? id,
    isHidden: hidden.includes(id),
    node: sectionMap[id] ?? null,
  }));

  return (
    <div style={{ height: "calc(100vh - 60px)", display: "flex", flexDirection: "column", margin: "-24px -32px -32px" }}>
      <div
        style={{
          padding: "0 20px", height: 48, display: "flex", alignItems: "center", gap: 12,
          borderBottom: "1px solid var(--ka-line)", background: "var(--ka-bg)", flexShrink: 0,
        }}
      >
        <Link href="/admin/pages" style={{ color: "var(--ka-muted)", fontSize: 13, textDecoration: "none", fontFamily: "var(--ka-body)" }}>← Pages</Link>
        <span style={{ color: "var(--ka-line)", fontSize: 18 }}>|</span>
        <span style={{ fontFamily: "var(--ka-body)", fontSize: 14, color: "var(--ka-ink)", fontWeight: 500 }}>{PAGE_LABELS[pageKey]}</span>
        <span style={{ fontFamily: "var(--ka-body)", fontSize: 11, color: "var(--ka-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>— Visual Builder</span>
        <Link href={`/admin/pages/${page}`} style={{ marginLeft: "auto", fontSize: 12, color: "var(--ka-muted)", textDecoration: "none", fontFamily: "var(--ka-body)" }}>Content Editor →</Link>
      </div>

      <div style={{ flex: 1, overflow: "hidden" }}>
        <PageBuilder
          page={page}
          sectionItems={sectionItems}
          initialOrder={order}
          initialHidden={hidden}
          currentContent={c as unknown as Record<string, unknown>}
        />
      </div>
    </div>
  );
}
