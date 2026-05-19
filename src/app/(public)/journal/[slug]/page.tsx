import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAllBlogSlugs, getBlogPostBySlug } from "@/lib/blog-db";
import { JsonLd, articleSchema, faqSchema, breadcrumbSchema } from "@/components/JsonLd";
import { sanitizeHtml } from "@/lib/sanitize";
import BogotaMap from "@/components/BogotaMap";

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
            // ## / ### headings
            if (para.startsWith("### ")) {
              return <h3 key={i} style={{ fontFamily: "var(--ka-display)", fontSize: 24, fontStyle: "italic", marginTop: 16, color: "var(--ka-ink)" }}>{para.slice(4)}</h3>;
            }
            if (para.startsWith("## ")) {
              return <h2 key={i} style={{ fontFamily: "var(--ka-display)", fontSize: 36, fontStyle: "italic", marginTop: 32, marginBottom: 4, color: "var(--ka-ink)", fontWeight: 400 }}>{para.slice(3)}</h2>;
            }

            // [!IMG src="…" alt="…" caption="…"]
            if (para.startsWith("[!IMG")) {
              const src = para.match(/src="([^"]+)"/)?.[1];
              const alt = para.match(/alt="([^"]+)"/)?.[1] ?? "";
              const caption = para.match(/caption="([^"]+)"/)?.[1];
              if (!src) return null;
              return (
                <figure key={i} style={{ margin: "32px -32px" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={alt} style={{ width: "100%", height: "auto", display: "block" }} loading="lazy" />
                  {caption && (
                    <figcaption style={{ padding: "10px 32px 0", fontSize: 12, color: "var(--ka-muted)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--ka-body)" }}>
                      {caption}
                    </figcaption>
                  )}
                </figure>
              );
            }

            // [!GRID-LEFT src="…" alt="…" text="…"]
            // Left-aligned image, text to the right.
            // NOTE: must be checked BEFORE [!GRID — both start with the same prefix.
            if (para.startsWith("[!GRID-LEFT")) {
              const src = para.match(/src="([^"]+)"/)?.[1];
              const alt = para.match(/alt="([^"]+)"/)?.[1] ?? "";
              const text = para.match(/text="([^"]+)"/)?.[1] ?? "";
              if (!src) return null;
              return (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", alignItems: "start", margin: "24px -32px", padding: "0 32px" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={alt} style={{ width: "100%", height: "auto", display: "block" }} loading="lazy" />
                  <p style={{ fontSize: 18, lineHeight: 1.75, color: "var(--ka-ink-soft)", fontWeight: 300, fontFamily: "var(--ka-display)", fontStyle: "italic", margin: 0 }}>
                    {text}
                  </p>
                </div>
              );
            }

            // [!GRID src="…" alt="…" text="…"]
            // Right-aligned image, text to the left — editorial asymmetric layout
            if (para.startsWith("[!GRID")) {
              const src = para.match(/src="([^"]+)"/)?.[1];
              const alt = para.match(/alt="([^"]+)"/)?.[1] ?? "";
              const text = para.match(/text="([^"]+)"/)?.[1] ?? "";
              if (!src) return null;
              return (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", alignItems: "start", margin: "24px -32px", padding: "0 32px" }}>
                  <p style={{ fontSize: 18, lineHeight: 1.75, color: "var(--ka-ink-soft)", fontWeight: 300, fontFamily: "var(--ka-display)", fontStyle: "italic", margin: 0 }}>
                    {text}
                  </p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={alt} style={{ width: "100%", height: "auto", display: "block" }} loading="lazy" />
                </div>
              );
            }

            // [!HIGHLIGHT text="…" label="…"]  — lilac callout aside
            if (para.startsWith("[!HIGHLIGHT")) {
              const text = para.match(/text="([^"]+)"/)?.[1] ?? "";
              const label = para.match(/label="([^"]+)"/)?.[1];
              return (
                <aside key={i} style={{ background: "var(--ka-bg-soft)", borderLeft: "3px solid var(--ka-accent-deep)", padding: "24px 28px", margin: "16px 0" }}>
                  {label && (
                    <div className="ka-eyebrow" style={{ marginBottom: 10, color: "var(--ka-accent-deep)" }}>{label}</div>
                  )}
                  <p style={{ fontFamily: "var(--ka-display)", fontStyle: "italic", fontSize: 19, lineHeight: 1.55, color: "var(--ka-ink)", margin: 0 }}>
                    {text}
                  </p>
                </aside>
              );
            }

            // [!QUOTE text="…"]  — pull quote
            if (para.startsWith("[!QUOTE")) {
              const text = para.match(/text="([^"]+)"/)?.[1] ?? "";
              return (
                <blockquote key={i} style={{ borderLeft: "none", borderTop: "1px solid var(--ka-line)", borderBottom: "1px solid var(--ka-line)", padding: "28px 0", margin: "16px 0", textAlign: "center" }}>
                  <p style={{ fontFamily: "var(--ka-display)", fontStyle: "italic", fontSize: 24, lineHeight: 1.45, color: "var(--ka-ink)", fontWeight: 400, margin: 0 }}>
                    &ldquo;{text}&rdquo;
                  </p>
                </blockquote>
              );
            }

            // [!RULE]  — decorative hairline break
            if (para.trim() === "[!RULE]") {
              return <div key={i} className="ka-rule" style={{ margin: "16px 0" }} />;
            }

            // [!MAP-BOGOTA]  — custom illustrated Bogotá map
            if (para.trim() === "[!MAP-BOGOTA]") {
              return <BogotaMap key={i} />;
            }

            // [!COLLAGE src1="…" alt1="…" … caption="…"]  — 2–4 photo collage
            if (para.startsWith("[!COLLAGE")) {
              const imgs = [1, 2, 3, 4]
                .map((n) => ({
                  src: para.match(new RegExp(`src${n}="([^"]+)"`))?.[1] ?? "",
                  alt: para.match(new RegExp(`alt${n}="([^"]+)"`))?.[1] ?? "",
                }))
                .filter((img) => img.src);
              if (imgs.length === 0) return null;
              const caption = para.match(/caption="([^"]+)"/)?.[1];
              const cols = Math.min(imgs.length, 3);
              return (
                <figure key={i} style={{ margin: "32px -32px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 6 }}>
                    {imgs.map((img, j) => (
                      <div key={j} style={{ position: "relative", aspectRatio: "1", overflow: "hidden" }}>
                        <Image src={img.src} alt={img.alt} fill style={{ objectFit: "cover" }} sizes={`(max-width: 800px) ${100 / cols}vw, ${800 / cols}px`} />
                      </div>
                    ))}
                  </div>
                  {caption && (
                    <figcaption style={{ padding: "10px 32px 0", fontSize: 12, color: "var(--ka-muted)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--ka-body)" }}>
                      {caption}
                    </figcaption>
                  )}
                </figure>
              );
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
