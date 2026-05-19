import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAllBlogSlugs, getBlogPostBySlug } from "@/lib/blog-db";
import { JsonLd, articleSchema, faqSchema, breadcrumbSchema } from "@/components/JsonLd";
import { sanitizeHtml } from "@/lib/sanitize";

export const revalidate = 60;

const SITE = "https://karenalexandra.com";

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

  const title = post.seoTitle?.trim() || post.title;
  const description = post.seoDescription?.trim() || post.excerpt;
  const ogImage = post.ogImage?.trim() || post.heroImage;
  const canonical = post.canonicalUrl?.trim() || `${SITE}/journal/${post.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    keywords: post.focusKeyword ? [post.focusKeyword, post.category] : undefined,
    authors: post.authorName ? [{ name: post.authorName }] : undefined,
    robots: post.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      siteName: "Karen Alexandra",
      images: ogImage ? [{ url: ogImage, alt: post.heroAlt || post.title }] : undefined,
      publishedTime: post.date,
      authors: post.authorName ? [post.authorName] : undefined,
      tags: post.focusKeyword ? [post.focusKeyword, post.category] : [post.category],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const paragraphs = post.body.split(/\n\n+/).filter(Boolean);
  const url = `${SITE}/journal/${post.slug}`;
  const description = post.seoDescription?.trim() || post.excerpt;
  const ogImage = post.ogImage?.trim() || post.heroImage;

  const faqs = post.faqItems.filter((f) => f.question.trim() && f.answer.trim());
  const fSchema = faqSchema(faqs);

  return (
    <>
      <JsonLd data={articleSchema({
        title: post.title,
        description,
        url,
        image: ogImage,
        datePublished: post.date,
        authorName: post.authorName ?? undefined,
        keywords: post.focusKeyword ? [post.focusKeyword, post.category] : [post.category],
        category: post.category,
      })} />
      {fSchema && <JsonLd data={fSchema} />}
      <JsonLd data={breadcrumbSchema([
        { name: "Home",    url: `${SITE}/` },
        { name: "Journal", url: `${SITE}/journal` },
        { name: post.title, url },
      ])} />

      {/* ── Hero image ───────────────────────────────────────────────── */}
      {post.heroImage && (
        <section style={{ aspectRatio: "16/7", position: "relative", overflow: "hidden", background: "var(--ka-sand)" }}>
          <Image src={post.heroImage} alt={post.heroAlt} fill style={{ objectFit: "cover" }} priority sizes="100vw" />
        </section>
      )}

      {/* ── Article ──────────────────────────────────────────────────── */}
      <article style={{ maxWidth: "720px", margin: "0 auto", padding: "80px 32px" }}>
        <div style={{ marginBottom: "40px" }}>
          <span className="ka-eyebrow" style={{ display: "block", marginBottom: "12px" }}>
            {post.category}&nbsp;&nbsp;·&nbsp;&nbsp;
            {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            {post.authorName && (
              <>&nbsp;&nbsp;·&nbsp;&nbsp;By {post.authorName}</>
            )}
          </span>
          <h1 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 400, fontStyle: "italic", lineHeight: 1.05, letterSpacing: "-0.01em", marginBottom: "28px" }}>
            {post.title}
          </h1>
          <p style={{ fontSize: "17px", lineHeight: 1.7, color: "var(--ka-ink-soft)", borderLeft: "3px solid var(--ka-accent-deep)", paddingLeft: "24px", fontStyle: "italic", fontFamily: "var(--ka-display)" }}>
            {post.excerpt}
          </p>
        </div>

        {/* ── Key takeaway (TL;DR) — GEO ────────────────────────────── */}
        {post.keyTakeaway && (
          <aside
            style={{
              background: "var(--ka-bg-soft)",
              borderLeft: "3px solid var(--ka-accent-deep)",
              padding: "20px 24px",
              marginBottom: 40,
            }}
          >
            <div className="ka-eyebrow" style={{ marginBottom: 8, color: "var(--ka-accent-deep)" }}>
              The short of it
            </div>
            <p style={{ fontFamily: "var(--ka-display)", fontStyle: "italic", fontSize: 20, lineHeight: 1.45, color: "var(--ka-ink)" }}>
              {post.keyTakeaway}
            </p>
          </aside>
        )}

        <div className="ka-rule" style={{ marginBottom: "48px" }} />

        {/* Body */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", fontSize: "17px", lineHeight: 1.75, color: "var(--ka-ink-soft)", fontWeight: 300 }}>
          {paragraphs.map((para, i) => {
            // Render `## Heading` / `### Heading` as h2/h3 for AI parsability
            if (para.startsWith("### ")) {
              return <h3 key={i} style={{ fontFamily: "var(--ka-display)", fontSize: 24, fontStyle: "italic", marginTop: 16, color: "var(--ka-ink)" }}>{para.slice(4)}</h3>;
            }
            if (para.startsWith("## ")) {
              return <h2 key={i} style={{ fontFamily: "var(--ka-display)", fontSize: 32, fontStyle: "italic", marginTop: 24, color: "var(--ka-ink)" }}>{para.slice(3)}</h2>;
            }
            return <p key={i} dangerouslySetInnerHTML={{ __html: sanitizeHtml(para) }} />;
          })}
        </div>

        {/* ── FAQ section — GEO gold ───────────────────────────────── */}
        {faqs.length > 0 && (
          <section style={{ marginTop: 64, paddingTop: 48, borderTop: "1px solid var(--ka-line)" }}>
            <h2 style={{ fontFamily: "var(--ka-display)", fontSize: 32, fontStyle: "italic", marginBottom: 8, color: "var(--ka-ink)" }}>
              Frequently asked
            </h2>
            <p className="ka-eyebrow" style={{ marginBottom: 32 }}>About this piece</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {faqs.map((f, i) => (
                <details
                  key={i}
                  open={i === 0}
                  style={{ borderTop: i === 0 ? "1px solid var(--ka-line)" : undefined, borderBottom: "1px solid var(--ka-line)", padding: "20px 0" }}
                >
                  <summary
                    style={{ listStyle: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16 }}
                  >
                    <h3 style={{ fontFamily: "var(--ka-display)", fontSize: 22, fontStyle: i % 2 ? "italic" : "normal", color: "var(--ka-ink)" }}>
                      {f.question}
                    </h3>
                    <span style={{ fontFamily: "var(--ka-display)", fontSize: 20, color: "var(--ka-muted)" }}>+</span>
                  </summary>
                  <p style={{ marginTop: 14, color: "var(--ka-ink-soft)", fontSize: 16, lineHeight: 1.7, fontWeight: 300 }}>
                    {f.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* ── Author bio ────────────────────────────────────────────── */}
        {post.authorName && post.authorBio && (
          <section style={{ marginTop: 64, paddingTop: 32, borderTop: "1px solid var(--ka-line)", display: "flex", gap: 20, alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div className="ka-eyebrow" style={{ marginBottom: 6 }}>About the author</div>
              <p style={{ fontFamily: "var(--ka-display)", fontSize: 18, color: "var(--ka-ink)", marginBottom: 6 }}>
                {post.authorName}
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--ka-ink-soft)", fontWeight: 300 }}>
                {post.authorBio}
              </p>
            </div>
          </section>
        )}
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
