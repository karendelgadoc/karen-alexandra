import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAllBlogSlugs, getBlogPostBySlug } from "@/lib/blog-db";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Karen Alexandra`,
    description: post.excerpt,
  };
}

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const paragraphs = post.body.split(/\n\n+/).filter(Boolean);

  return (
    <>
      {/* ── Hero image ───────────────────────────────────────────────── */}
      {post.heroImage && (
        <section
          style={{
            aspectRatio: "16/7",
            position: "relative",
            overflow: "hidden",
            background: "var(--ka-sand)",
          }}
        >
          <Image
            src={post.heroImage}
            alt={post.heroAlt}
            fill
            style={{ objectFit: "cover" }}
            priority
            sizes="100vw"
          />
        </section>
      )}

      {/* ── Article ──────────────────────────────────────────────────── */}
      <article style={{ maxWidth: "720px", margin: "0 auto", padding: "80px 32px" }}>
        {/* Meta */}
        <div style={{ marginBottom: "40px" }}>
          <span
            className="ka-eyebrow"
            style={{ display: "block", marginBottom: "12px" }}
          >
            {post.category}&nbsp;&nbsp;·&nbsp;&nbsp;
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <h1
            style={{
              fontFamily: "var(--ka-display)",
              fontSize: "clamp(40px, 5vw, 64px)",
              fontWeight: 400,
              fontStyle: "italic",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              marginBottom: "28px",
            }}
          >
            {post.title}
          </h1>
          <p
            style={{
              fontSize: "17px",
              lineHeight: 1.7,
              color: "var(--ka-ink-soft)",
              borderLeft: "3px solid var(--ka-accent-deep)",
              paddingLeft: "24px",
              fontStyle: "italic",
              fontFamily: "var(--ka-display)",
            }}
          >
            {post.excerpt}
          </p>
        </div>

        <div className="ka-rule" style={{ marginBottom: "48px" }} />

        {/* Body */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            fontSize: "17px",
            lineHeight: 1.75,
            color: "var(--ka-ink-soft)",
            fontWeight: 300,
          }}
        >
          {paragraphs.map((para, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: para }} />
          ))}
        </div>
      </article>

      {/* ── Back link ────────────────────────────────────────────────── */}
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 32px 80px" }}>
        <div className="ka-rule" style={{ marginBottom: "32px" }} />
        <Link href="/journal" className="ka-arrow-link" style={{ flexDirection: "row-reverse", gap: "10px" }}>
          <span className="ka-arrow" style={{ transform: "rotate(180deg)" }}>→</span>
          Back to Journal
        </Link>
      </div>
    </>
  );
}
