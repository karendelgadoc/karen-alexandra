import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/posts-db";
import type { Post } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Case Studies — Karen Alexandra",
  description:
    "Brand marketing and digital merchandising case studies — luxury fashion, travel content, and e-commerce.",
};

const FILTERS = ["All", "E-commerce", "Brand", "Growth", "Editorial"];

const LAYOUT_CYCLE: Array<"wide" | "left" | "right"> = [
  "wide",
  "left",
  "right",
  "wide",
  "left",
  "right",
];

function CaseCard({
  post,
  layout,
}: {
  post: Post;
  layout: "wide" | "left" | "right";
}) {
  const isWide = layout === "wide";
  const isRight = layout === "right";

  return (
    <Link
      href={`/case-studies/${post.slug}`}
      style={{
        gridColumn: isWide ? "1 / -1" : isRight ? "7 / 13" : "1 / 7",
        display: "block",
      }}
    >
      <div
        style={{
          aspectRatio: isWide ? "16/7" : "4/3",
          position: "relative",
          overflow: "hidden",
          background: "var(--ka-sand)",
        }}
      >
        {post.heroImage && (
          <Image
            src={post.heroImage}
            alt={post.heroAlt}
            fill
            style={{ objectFit: "cover" }}
            sizes={isWide ? "100vw" : "50vw"}
          />
        )}
      </div>
      <div style={{ padding: "20px 0 0" }}>
        <span className="ka-eyebrow">{post.category}</span>
        <h2
          style={{
            fontFamily: "var(--ka-display)",
            fontSize: isWide ? "40px" : "28px",
            fontStyle: "italic",
            fontWeight: 400,
            marginTop: "8px",
            marginBottom: "10px",
            lineHeight: 1.1,
          }}
        >
          {post.title}
        </h2>
        <p
          style={{
            fontSize: "14px",
            color: "var(--ka-ink-soft)",
            lineHeight: 1.65,
            fontWeight: 300,
            maxWidth: isWide ? "640px" : "100%",
            marginBottom: "20px",
          }}
        >
          {post.excerpt}
        </p>
        <span className="ka-arrow-link">
          Read case study <span className="ka-arrow">→</span>
        </span>
      </div>
    </Link>
  );
}

export default async function CaseStudiesPage() {
  const posts = await getAllPosts();

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "120px 64px 80px",
          borderBottom: "1px solid var(--ka-line)",
        }}
      >
        <span className="ka-eyebrow" style={{ display: "block", marginBottom: "20px" }}>
          Selected Work
        </span>
        <h1
          style={{
            fontFamily: "var(--ka-display)",
            fontSize: "clamp(56px, 7vw, 96px)",
            fontWeight: 400,
            fontStyle: "italic",
            lineHeight: 1.0,
            letterSpacing: "-0.02em",
          }}
        >
          The work, in depth.
        </h1>
      </section>

      {/* ── Filters ──────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "28px 64px",
          display: "flex",
          gap: "10px",
          borderBottom: "1px solid var(--ka-line)",
        }}
      >
        {FILTERS.map((f, i) => (
          <span key={f} className={`ka-tag${i === 0 ? " ka-tag-active" : ""}`}>
            {f}
          </span>
        ))}
      </div>

      {/* ── Case Grid ────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 64px" }}>
        {posts.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              fontFamily: "var(--ka-display)",
              fontSize: "24px",
              fontStyle: "italic",
              color: "var(--ka-muted)",
              padding: "64px 0",
            }}
          >
            Case studies coming soon.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gap: "64px 24px",
            }}
          >
            {posts.map((post, i) => (
              <CaseCard
                key={post.slug}
                post={post}
                layout={LAYOUT_CYCLE[i % LAYOUT_CYCLE.length]}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
