import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllBlogPosts, getFeaturedBlogPosts } from "@/lib/blog-db";
import type { BlogPost, BlogCategory } from "@/lib/blog-db";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Journal — Karen Alexandra",
  description:
    "A global citizen's guide to well living — fashion, travel, wellness and the life that happens in between.",
};

const CATEGORIES = ["All entries", "Fashion", "Travel", "Wellness", "Lifestyle"];

// Asymmetric collage layout config (12-column grid)
const COLLAGE_POSITIONS = [
  { col: "1 / 6", row: "1", aspect: "5/6", mt: 0 },
  { col: "6 / 10", row: "1", aspect: "4/5", mt: 0 },
  { col: "10 / 13", row: "1 / 3", aspect: "3/4", mt: 0 },
  { col: "2 / 6", row: "2 / 4", aspect: "5/6", mt: -60 },
  { col: "6 / 10", row: "2", aspect: "5/4", mt: 0 },
  { col: "1 / 4", row: "3", aspect: "4/5", mt: 0 },
  { col: "7 / 11", row: "3", aspect: "4/5", mt: 0 },
  { col: "10 / 13", row: "3", aspect: "3/4", mt: 0 },
];

function PostCard({
  post,
  position,
}: {
  post: BlogPost;
  position: (typeof COLLAGE_POSITIONS)[number];
}) {
  return (
    <Link
      href={`/journal/${post.slug}`}
      style={{
        gridColumn: position.col,
        gridRow: position.row,
        marginTop: position.mt ? `${position.mt}px` : undefined,
        display: "block",
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
        {post.heroImage ? (
          <Image
            src={post.heroImage}
            alt={post.heroAlt}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "var(--ka-sand)" }} />
        )}
      </div>
      <div style={{ padding: "14px 0 0" }}>
        <span className="ka-eyebrow">{post.category}</span>
        <p
          style={{
            fontFamily: "var(--ka-display)",
            fontSize: "22px",
            fontStyle: "italic",
            marginTop: "6px",
            lineHeight: 1.2,
          }}
        >
          {post.title}
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
          {new Date(post.date).toLocaleDateString("en-US", {
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

  const [allPosts, featuredArr] = await Promise.all([
    getAllBlogPosts(categoryFilter).catch(() => []),
    getFeaturedBlogPosts(1).catch(() => []),
  ]);

  const featured = featuredArr[0] ?? null;
  // Remaining posts (excluding featured) for collage
  const collapsePosts = allPosts.filter((p) => p.slug !== featured?.slug).slice(0, 8);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "96px 64px 64px",
          borderBottom: "1px solid var(--ka-line)",
        }}
      >
        <span className="ka-eyebrow" style={{ display: "block", marginBottom: "20px" }}>
          The Journal
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
          The Art of Well
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
          A global citizen&apos;s guide to well living — fashion, travel, wellness and the
          life that happens in between.
        </p>
      </section>

      {/* ── Filters ──────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "28px 64px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
          borderBottom: "1px solid var(--ka-line)",
        }}
      >
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

      {/* ── Featured Letter ──────────────────────────────────────────── */}
      {featured && (
        <section
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
              Featured letter
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
            <Link href={`/journal/${featured.slug}`} className="ka-arrow-link">
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
              />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "var(--ka-sand)" }} />
            )}
          </div>
        </section>
      )}

      {/* ── Collage Grid ─────────────────────────────────────────────── */}
      {collapsePosts.length > 0 && (
        <section style={{ padding: "80px 64px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gap: "24px",
            }}
          >
            {collapsePosts.map((post, i) => (
              <PostCard
                key={post.slug}
                post={post}
                position={COLLAGE_POSITIONS[i % COLLAGE_POSITIONS.length]}
              />
            ))}
          </div>
        </section>
      )}

      {allPosts.length === 0 && (
        <section style={{ padding: "96px 64px", textAlign: "center" }}>
          <p style={{ color: "var(--ka-muted)", fontFamily: "var(--ka-display)", fontSize: "24px", fontStyle: "italic" }}>
            No entries yet — check back soon.
          </p>
        </section>
      )}

      {/* ── Pull Quote ───────────────────────────────────────────────── */}
      <section
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
          &ldquo;To dress well is to live well — both require intention.&rdquo;
        </p>
      </section>

      {/* ── Load More ────────────────────────────────────────────────── */}
      <div style={{ padding: "56px 64px", textAlign: "center" }}>
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
          Showing {allPosts.length} entries
        </p>
      </div>
    </>
  );
}
