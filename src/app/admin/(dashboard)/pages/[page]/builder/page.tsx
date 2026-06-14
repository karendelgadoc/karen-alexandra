import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  PAGE_KEYS,
  PAGE_LABELS,
  PAGE_SECTIONS,
  getHomeContent,
  getPortfolioContent,
  getJournalContent,
  getContactContent,
  getWatchContent,
  getAboutContent,
  getServicesContent,
  getMediaKitContent,
  HOME_DEFAULTS,
  PORTFOLIO_DEFAULTS,
  JOURNAL_DEFAULTS,
  CONTACT_DEFAULTS,
  WATCH_DEFAULTS,
  ABOUT_DEFAULTS,
  SERVICES_DEFAULTS,
  MEDIA_KIT_DEFAULTS,
  type PageKey,
} from "@/lib/page-content-db";
import { buildHomeSectionMap }      from "@/components/sections/home";
import { buildPortfolioSectionMap } from "@/components/sections/portfolio";
import { buildContactSectionMap }   from "@/components/sections/contact";
import { buildWatchSectionMap }     from "@/components/sections/watch";
import { buildAboutSectionMap }     from "@/components/sections/about";
import { buildServicesSectionMap }  from "@/components/sections/services";
import { buildMediaKitSectionMap }  from "@/components/sections/media-kit";
import { getFeaturedBlogPosts, getAllBlogPosts } from "@/lib/blog-db";
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
    case "journal": {
      const content = await getJournalContent().catch(() => null);
      const c = content ?? JOURNAL_DEFAULTS;
      const sectionMap: Record<string, React.ReactNode> = {
        "hero": <section style={{ padding: "80px 64px 48px", borderBottom: "1px solid var(--ka-line)" }}>
          <div style={{ fontFamily: "var(--ka-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>{c.hero.eyebrow}</div>
          <h1 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(56px,7vw,96px)", fontStyle: "italic", fontWeight: 400, lineHeight: 1, marginBottom: 20 }}>{c.hero.headline}</h1>
          <p style={{ fontSize: 15, color: "var(--ka-muted)", maxWidth: 440, lineHeight: 1.7 }}>{c.hero.subhead}</p>
        </section>,
        "pull-quote": <section style={{ padding: "64px", textAlign: "center", borderTop: "1px solid var(--ka-line)" }}>
          <div style={{ width: 48, height: 2, background: "var(--ka-accent-deep)", margin: "0 auto 32px" }} />
          <p style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(28px,4vw,44px)", fontStyle: "italic", maxWidth: 680, margin: "0 auto", lineHeight: 1.2 }}>&ldquo;{c.pullQuote}&rdquo;</p>
        </section>,
      };
      return { c, sectionMap, defaults: JOURNAL_DEFAULTS };
    }
    case "about": {
      const content = await getAboutContent().catch(() => null);
      const c = content ?? ABOUT_DEFAULTS;
      return { c, sectionMap: buildAboutSectionMap(c), defaults: ABOUT_DEFAULTS };
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
    case "services": {
      const [content, allPosts] = await Promise.all([
        getServicesContent().catch(() => null),
        getAllPosts().catch(() => []),
      ]);
      const c = content ?? SERVICES_DEFAULTS;
      return { c, sectionMap: buildServicesSectionMap(c, { posts: allPosts.slice(0, 3) }), defaults: SERVICES_DEFAULTS };
    }
    case "media-kit": {
      const [content, blogPosts, videos] = await Promise.all([
        getMediaKitContent().catch(() => null),
        getAllBlogPosts().catch(() => []),
        getLatestVideos(2).catch(() => []),
      ]);
      const c = content ?? MEDIA_KIT_DEFAULTS;
      return { c, sectionMap: buildMediaKitSectionMap(c, { recentPosts: blogPosts.slice(0, 2), recentVideos: videos.slice(0, 2) }), defaults: MEDIA_KIT_DEFAULTS };
    }
    default:
      throw new Error(`Unknown page: ${page}`);
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
          page={pageKey}
          sectionItems={sectionItems}
          initialOrder={order}
          initialHidden={hidden}
          currentContent={c as unknown as Record<string, unknown>}
        />
      </div>
    </div>
  );
}
