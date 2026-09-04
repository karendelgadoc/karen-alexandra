import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllBlogPosts, getExplicitlyFeaturedBlogPost } from "@/lib/blog-db";
import type { BlogCategory } from "@/lib/blog-db";
import { getLatestSubstackPosts } from "@/lib/substack";
import { fromBlogPost, fromSubstackPost } from "@/lib/journal";
import type { JournalEntry } from "@/lib/journal";
import { getJournalContent, JOURNAL_DEFAULTS } from "@/lib/page-content-db";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "The Edit — Karen Alexandra",
  description:
    "A global citizen's guide to well living — fashion, travel, wellness and the life that happens in between.",
};

const CATEGORIES = ["All entries", "Fashion", "Travel", "Wellness", "Lifestyle"];

// Asymmetric collage layout config (12-column grid).
//
// Column spans only — no explicit grid-row. Auto-placement then guarantees
// cards can never occupy the same cell; the previous config pinned explicit
// rows and had two genuine collisions (cards 4↔6 and 7↔8 overlapped on top
// of each other). Each group of spans sums to exactly 12 so every row tiles
// edge to edge, and `mt` staggers cards vertically to keep the collage feel
// without any risk of overlap.
const COLLAGE_POSITIONS = [
  { col: "span 5", aspect: "5/6", mt: 0 },  // ┐
  { col: "span 4", aspect: "4/5", mt: 48 }, // ├ 5 + 4 + 3 = 12
  { col: "span 3", aspect: "3/4", mt: 0 },  // ┘
  { col: "span 4", aspect: "5/6", mt: 0 },  // ┐
  { col: "span 5", aspect: "5/4", mt: 40 }, // ├ 4 + 5 + 3 = 12
  { col: "span 3", aspect: "3/4", mt: 0 },  // ┘
  { col: "span 6", aspect: "5/4", mt: 0 },  // ┐ 6 + 6 = 12
  { col: "span 6", aspect: "4/5", mt: 40 }, // ┘
];

function PostCard({
  entry,
  position,
}: {
  entry: JournalEntry;
  position: (typeof COLLAGE_POSITIONS)[number];
}) {
  return (
    <Link
      href={entry.href}
      {...(entry.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      style={{
        gridColumn: position.col,
        marginTop: position.mt ? `${position.mt}px` : undefined,
        display: "block",
        minWidth: 0,
      }}
    >
      <div
        style={{
          aspectRatio: position.aspect,
          position: "relative",
          overflow: "hidden",
          background: "var(--ka-sand)",
        }}
      >
        {entry.heroImage ? (
          <Image
            src={entry.heroImage}
            alt={entry.heroAlt}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 40vw"
            unoptimized={entry.heroImage.includes("substackcdn.com")}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "var(--ka-sand)" }} />
        )}
      </div>
      <div style={{ padding: "14px 0 0" }}>
        <span className="ka-eyebrow">
          {entry.category}
          {entry.external ? "  ·  Substack" : ""}
        </span>
        <p
          style={{
            fontFamily: "var(--ka-display)",
            fontSize: "22px",
            fontStyle: "italic",
            marginTop: "6px",
            lineHeight: 1.2,
          }}
        >
          {entry.title}
        </p>
        <p
          style={{
            fontSize: "12px",
            fontFamily: "var(--ka-mono)",
            color: "var(--ka-muted)",
            marginTop: "6px",
            letterSpacing: "0.08em",
          }}
        >
          {new Date(entry.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>
    </Link>
  );
}

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
  // Remaining entries (excluding whichever is featured) for the collage
  const collageEntries = entries.filter((e) => e.key !== featured?.key).slice(0, 8);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        className="ka-rp"
        style={{
          padding: "96px 64px 64px",
          borderBottom: "1px solid var(--ka-line)",
        }}
      >
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
          Auto-sync · New letters appear automatically
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
              <Image
                src={featured.heroImage}
                alt={featured.heroAlt}
                fill
                style={{ objectFit: "cover" }}
                sizes="50vw"
                unoptimized={featured.heroImage.includes("substackcdn.com")}
              />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "var(--ka-sand)" }} />
            )}
          </div>
        </section>
      )}

      {/* ── Collage Grid ─────────────────────────────────────────────── */}
      {collageEntries.length > 0 && (
        <section className="ka-rp" style={{ padding: "80px 64px" }}>
          <div
            className="ka-r-collage"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gap: "24px",
              alignItems: "start",
            }}
          >
            {collageEntries.map((entry, i) => (
              <PostCard
                key={entry.key}
                entry={entry}
                position={COLLAGE_POSITIONS[i % COLLAGE_POSITIONS.length]}
              />
            ))}
          </div>
        </section>
      )}

      {entries.length === 0 && (
        <section className="ka-rp" style={{ padding: "96px 64px", textAlign: "center" }}>
          <p style={{ color: "var(--ka-muted)", fontFamily: "var(--ka-display)", fontSize: "24px", fontStyle: "italic" }}>
            No entries yet — check back soon.
          </p>
        </section>
      )}

      {/* ── Pull Quote ───────────────────────────────────────────────── */}
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

      {/* ── Load More ────────────────────────────────────────────────── */}
      <div className="ka-rp" style={{ padding: "56px 64px", textAlign: "center" }}>
        <button className="ka-btn" disabled>
          Load older entries
        </button>
        <p
          style={{
            marginTop: "16px",
            fontSize: "11px",
            fontFamily: "var(--ka-mono)",
            color: "var(--ka-muted)",
            letterSpacing: "0.08em",
          }}
        >
          Showing {entries.length} entries
        </p>
      </div>
    </>
  );
}
