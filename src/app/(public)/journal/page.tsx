import type { Metadata } from "next";
import Link from "next/link";
import FallbackImage from "@/components/FallbackImage";
import { getAllBlogPosts, getExplicitlyFeaturedBlogPost } from "@/lib/blog-db";
import type { BlogCategory } from "@/lib/blog-db";
import { getLatestSubstackPosts, SUBSTACK_PUBLICATION_URL } from "@/lib/substack";
import { fromBlogPost, fromSubstackPost } from "@/lib/journal";
import type { JournalEntry } from "@/lib/journal";
import { getJournalContent, JOURNAL_DEFAULTS } from "@/lib/page-content-db";
import { KaArrowUpRight } from "@/components/KaComponents";
import JournalGrid from "@/components/sections/journal-grid";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "The Edit — Karen Alexandra",
  description:
    "A global citizen's guide to well living — fashion, travel, wellness and the life that happens in between.",
};

const CATEGORIES = ["All entries", "Fashion", "Travel", "Wellness", "Lifestyle"];

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const categoryFilter = category as BlogCategory | undefined;

  const [allPosts, explicitFeatured, substackPosts, pageContent] = await Promise.all([
    getAllBlogPosts(categoryFilter).catch(() => []),
    getExplicitlyFeaturedBlogPost().catch(() => null),
    getLatestSubstackPosts(12).catch(() => []),
    getJournalContent().catch(() => JOURNAL_DEFAULTS),
  ]);
  const pc = pageContent ?? JOURNAL_DEFAULTS;

  // Merge local letters with the live Substack sync, filter by category (the
  // DB query already filtered allPosts server-side; Substack posts are
  // filtered here to match), and sort newest first.
  const entries: JournalEntry[] = [
    ...allPosts.map(fromBlogPost),
    ...substackPosts
      .filter((p) => !categoryFilter || p.category === categoryFilter)
      .map(fromSubstackPost),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // An editor-pinned local letter (`featured: true` in admin) wins the hero
  // slot; otherwise the newest entry overall — local or synced — takes it.
  const featured = explicitFeatured ? fromBlogPost(explicitFeatured) : entries[0] ?? null;
  // Remaining entries (excluding whichever is featured) for the collage —
  // all of them; JournalGrid paginates client-side behind "Load older entries".
  const collageEntries = entries.filter((e) => e.key !== featured?.key);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        className="ka-rp ka-r-stack"
        style={{
          padding: "96px 64px 64px",
          borderBottom: "1px solid var(--ka-line)",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "48px",
        }}
      >
        <div>
          <span className="ka-eyebrow" style={{ display: "block", marginBottom: "20px" }}>
            {pc.hero.eyebrow}
          </span>
          <h1
            style={{
              fontFamily: "var(--ka-display)",
              fontSize: "clamp(56px, 7vw, 96px)",
              fontStyle: "italic",
              fontWeight: 400,
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              marginBottom: "20px",
            }}
          >
            {pc.hero.headline}
          </h1>
          <p
            style={{
              fontFamily: "var(--ka-body)",
              fontSize: "15px",
              color: "var(--ka-ink-soft)",
              maxWidth: "440px",
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            {pc.hero.subhead}
          </p>
        </div>
        <a href={SUBSTACK_PUBLICATION_URL} target="_blank" rel="noopener noreferrer" className="ka-btn" style={{ flexShrink: 0 }}>
          Read on Substack <KaArrowUpRight />
        </a>
      </section>

      {/* ── Filters ──────────────────────────────────────────────────── */}
      <div
        className="ka-rp ka-r-wrap"
        style={{
          padding: "28px 64px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          borderBottom: "1px solid var(--ka-line)",
        }}
      >
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {CATEGORIES.map((cat) => {
            const slug = cat === "All entries" ? undefined : cat.toLowerCase();
            const isActive = slug ? category === slug : !category;
            return (
              <Link
                key={cat}
                href={slug ? `/journal?category=${slug}` : "/journal"}
                className={`ka-tag${isActive ? " ka-tag-active" : ""}`}
              >
                {cat}
              </Link>
            );
          })}
        </div>
        <span style={{ fontFamily: "var(--ka-mono)", fontSize: "10px", color: "var(--ka-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Auto-sync · New publications pull from Substack
        </span>
      </div>

      {/* ── Featured Letter ──────────────────────────────────────────── */}
      {featured && (
        <section
          className="ka-rp ka-r-stack"
          style={{
            background: "var(--ka-bg-soft)",
            padding: "64px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "64px",
            alignItems: "center",
            borderBottom: "1px solid var(--ka-line)",
          }}
        >
          <div>
            <span className="ka-eyebrow" style={{ display: "block", marginBottom: "16px" }}>
              Featured letter{featured.external ? "  ·  Substack" : ""}
            </span>
            <h2
              style={{
                fontFamily: "var(--ka-display)",
                fontSize: "48px",
                fontStyle: "italic",
                fontWeight: 400,
                marginBottom: "16px",
                lineHeight: 1.1,
              }}
            >
              {featured.title}
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "var(--ka-ink-soft)",
                lineHeight: 1.7,
                fontWeight: 300,
                marginBottom: "32px",
              }}
            >
              {featured.excerpt}
            </p>
            <p
              style={{
                fontFamily: "var(--ka-mono)",
                fontSize: "11px",
                color: "var(--ka-muted)",
                letterSpacing: "0.1em",
                marginBottom: "24px",
              }}
            >
              {new Date(featured.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <Link
              href={featured.href}
              {...(featured.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="ka-arrow-link"
            >
              Read the letter <span className="ka-arrow">→</span>
            </Link>
          </div>
          <div
            style={{
              aspectRatio: "4/5",
              position: "relative",
              overflow: "hidden",
              background: "var(--ka-sand)",
            }}
          >
            {featured.heroImage ? (
              <FallbackImage
                src={featured.heroImage}
                alt={featured.heroAlt}
                fill
                style={{ objectFit: "cover" }}
                sizes="50vw"
                unoptimized={featured.external}
              />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "var(--ka-sand)" }} />
            )}
          </div>
        </section>
      )}

      {/* ── Collage Grid ─────────────────────────────────────────────── */}
      <JournalGrid
        entries={collageEntries}
        totalCount={entries.length}
        afterGrid={
          <>
            {entries.length === 0 && (
              <section className="ka-rp" style={{ padding: "96px 64px", textAlign: "center" }}>
                <p style={{ color: "var(--ka-muted)", fontFamily: "var(--ka-display)", fontSize: "24px", fontStyle: "italic" }}>
                  No entries yet — check back soon.
                </p>
              </section>
            )}

            {/* ── Pull Quote ───────────────────────────────────────────── */}
            <section
              className="ka-rp"
              style={{
                padding: "80px 64px",
                textAlign: "center",
                borderTop: "1px solid var(--ka-line)",
                borderBottom: "1px solid var(--ka-line)",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "2px",
                  background: "var(--ka-accent-deep)",
                  margin: "0 auto 32px",
                }}
              />
              <p
                style={{
                  fontFamily: "var(--ka-display)",
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontStyle: "italic",
                  maxWidth: "680px",
                  margin: "0 auto",
                  lineHeight: 1.2,
                }}
              >
                &ldquo;{pc.pullQuote}&rdquo;
              </p>
            </section>
          </>
        }
      />
    </>
  );
}
