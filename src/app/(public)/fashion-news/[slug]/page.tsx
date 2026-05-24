import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAllFashionNewsSlugs, getFashionNewsPostBySlug } from "@/lib/blog-db";
import { JsonLd, articleSchema, faqSchema, breadcrumbSchema } from "@/components/JsonLd";
import { sanitizeHtml } from "@/lib/sanitize";

export const revalidate = 60;

const SITE = "https://karenalexandra.com";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllFashionNewsSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getFashionNewsPostBySlug(slug);
  if (!post) return {};

  const title = post.seoTitle?.trim() || post.title;
  const description = post.seoDescription?.trim() || post.excerpt;
  const ogImage = post.ogImage?.trim() || post.heroImage;
  const canonical = post.canonicalUrl?.trim() || `${SITE}/fashion-news/${post.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    keywords: post.focusKeyword ? [post.focusKeyword, "fashion news"] : ["fashion news"],
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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function FashionNewsPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getFashionNewsPostBySlug(slug);
  if (!post) notFound();

  const paragraphs = post.body.split(/\n\n+/).filter(Boolean);
  const url = `${SITE}/fashion-news/${post.slug}`;
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
        keywords: post.focusKeyword ? [post.focusKeyword, "fashion news"] : ["fashion news"],
        category: "fashion-news",
      })} />
      {fSchema && <JsonLd data={fSchema} />}
      <JsonLd data={breadcrumbSchema([
        { name: "Home",         url: `${SITE}/` },
        { name: "Fashion News", url: `${SITE}/fashion-news` },
        { name: post.title,     url },
      ])} />

      {post.heroImage && (
        <section style={{ aspectRatio: "16/7", position: "relative", overflow: "hidden", background: "var(--ka-sand)" }}>
          <Image src={post.heroImage} alt={post.heroAlt} fill style={{ objectFit: "cover" }} priority sizes="100vw" />
        </section>
      )}

      <article style={{ maxWidth: "720px", margin: "0 auto", padding: "80px 32px" }}>
        <div style={{ marginBottom: "40px" }}>
          <span className="ka-eyebrow" style={{ display: "block", marginBottom: "12px" }}>
            Fashion News&nbsp;&nbsp;·&nbsp;&nbsp;
            {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            {post.authorName && <>&nbsp;&nbsp;·&nbsp;&nbsp;By {post.authorName}</>}
          </span>
          <h1 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 400, fontStyle: "italic", lineHeight: 1.05, letterSpacing: "-0.01em", marginBottom: "28px" }}>
            {post.title}
          </h1>
          <p style={{ fontSize: "17px", lineHeight: 1.7, color: "var(--ka-ink-soft)", borderLeft: "3px solid var(--ka-accent-deep)", paddingLeft: "24px", fontStyle: "italic", fontFamily: "var(--ka-display)" }}>
            {post.excerpt}
          </p>
        </div>

        {post.keyTakeaway && (
          <aside style={{ background: "var(--ka-bg-soft)", borderLeft: "3px solid var(--ka-accent-deep)", padding: "20px 24px", marginBottom: 40 }}>
            <div className="ka-eyebrow" style={{ marginBottom: 8, color: "var(--ka-accent-deep)" }}>The short of it</div>
            <p style={{ fontFamily: "var(--ka-display)", fontStyle: "italic", fontSize: 20, lineHeight: 1.45, color: "var(--ka-ink)" }}>
              {post.keyTakeaway}
            </p>
          </aside>
        )}

        <div className="ka-rule" style={{ marginBottom: "48px" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "24px", fontSize: "17px", lineHeight: 1.75, color: "var(--ka-ink-soft)", fontWeight: 300 }}>
          {paragraphs.map((para, i) => {
            if (para.startsWith("### ")) return <h3 key={i} style={{ fontFamily: "var(--ka-display)", fontSize: 24, fontStyle: "italic", marginTop: 16, color: "var(--ka-ink)" }}>{para.slice(4)}</h3>;
            if (para.startsWith("## ")) return <h2 key={i} style={{ fontFamily: "var(--ka-display)", fontSize: 36, fontStyle: "italic", marginTop: 32, marginBottom: 4, color: "var(--ka-ink)", fontWeight: 400 }}>{para.slice(3)}</h2>;

            if (para.startsWith("[!IMG")) {
              const src = para.match(/src="([^"]+)"/)?.[1];
              const alt = para.match(/alt="([^"]+)"/)?.[1] ?? "";
              const caption = para.match(/caption="([^"]+)"/)?.[1];
              if (!src) return null;
              return (
                <figure key={i} style={{ margin: "32px -32px" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={alt} style={{ width: "100%", height: "auto", display: "block" }} loading="lazy" />
                  {caption && <figcaption style={{ padding: "10px 32px 0", fontSize: 12, color: "var(--ka-muted)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--ka-body)" }}>{caption}</figcaption>}
                </figure>
              );
            }

            if (para.startsWith("[!HIGHLIGHT")) {
              const text = para.match(/text="([^"]+)"/)?.[1] ?? "";
              const label = para.match(/label="([^"]+)"/)?.[1];
              return (
                <aside key={i} style={{ background: "var(--ka-bg-soft)", borderLeft: "3px solid var(--ka-accent-deep)", padding: "24px 28px", margin: "16px 0" }}>
                  {label && <div className="ka-eyebrow" style={{ marginBottom: 10, color: "var(--ka-accent-deep)" }}>{label}</div>}
                  <p style={{ fontFamily: "var(--ka-display)", fontStyle: "italic", fontSize: 19, lineHeight: 1.55, color: "var(--ka-ink)", margin: 0 }}>{text}</p>
                </aside>
              );
            }

            if (para.startsWith("[!QUOTE")) {
              const text = para.match(/text="([^"]+)"/)?.[1] ?? "";
              return (
                <blockquote key={i} style={{ borderLeft: "none", borderTop: "1px solid var(--ka-line)", borderBottom: "1px solid var(--ka-line)", padding: "28px 0", margin: "16px 0", textAlign: "center" }}>
                  <p style={{ fontFamily: "var(--ka-display)", fontStyle: "italic", fontSize: 24, lineHeight: 1.45, color: "var(--ka-ink)", fontWeight: 400, margin: 0 }}>&ldquo;{text}&rdquo;</p>
                </blockquote>
              );
            }

            if (para.trim() === "[!RULE]") return <div key={i} className="ka-rule" style={{ margin: "16px 0" }} />;

            return <p key={i} dangerouslySetInnerHTML={{ __html: sanitizeHtml(para) }} />;
          })}
        </div>

        {faqs.length > 0 && (
          <section style={{ marginTop: 64, paddingTop: 48, borderTop: "1px solid var(--ka-line)" }}>
            <h2 style={{ fontFamily: "var(--ka-display)", fontSize: 32, fontStyle: "italic", marginBottom: 8, color: "var(--ka-ink)" }}>Frequently asked</h2>
            <p className="ka-eyebrow" style={{ marginBottom: 32 }}>About this piece</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {faqs.map((f, i) => (
                <details key={i} open={i === 0} style={{ borderTop: i === 0 ? "1px solid var(--ka-line)" : undefined, borderBottom: "1px solid var(--ka-line)", padding: "20px 0" }}>
                  <summary style={{ listStyle: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16 }}>
                    <h3 style={{ fontFamily: "var(--ka-display)", fontSize: 22, fontStyle: i % 2 ? "italic" : "normal", color: "var(--ka-ink)" }}>{f.question}</h3>
                    <span style={{ fontFamily: "var(--ka-display)", fontSize: 20, color: "var(--ka-muted)" }}>+</span>
                  </summary>
                  <p style={{ marginTop: 14, color: "var(--ka-ink-soft)", fontSize: 16, lineHeight: 1.7, fontWeight: 300 }}>{f.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {post.authorName && post.authorBio && (
          <section style={{ marginTop: 64, paddingTop: 32, borderTop: "1px solid var(--ka-line)" }}>
            <div className="ka-eyebrow" style={{ marginBottom: 6 }}>About the author</div>
            <p style={{ fontFamily: "var(--ka-display)", fontSize: 18, color: "var(--ka-ink)", marginBottom: 6 }}>{post.authorName}</p>
            <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--ka-ink-soft)", fontWeight: 300 }}>{post.authorBio}</p>
          </section>
        )}
      </article>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 32px 80px" }}>
        <div className="ka-rule" style={{ marginBottom: "32px" }} />
        <Link href="/fashion-news" className="ka-arrow-link" style={{ flexDirection: "row-reverse", gap: "10px" }}>
          <span className="ka-arrow" style={{ transform: "rotate(180deg)" }}>→</span>
          Back to Fashion News
        </Link>
      </div>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 32px 96px" }}>
        <div className="ka-work-with-me">
          <h3>Work with Karen?</h3>
          <p>Editorial partnerships, e-commerce strategy, and brand direction — selectively offered, long-form by design.</p>
          <Link href="/services" className="ka-arrow-link" style={{ fontSize: 10 }}>The studio <span className="ka-arrow">→</span></Link>
        </div>
      </div>
    </>
  );
}
