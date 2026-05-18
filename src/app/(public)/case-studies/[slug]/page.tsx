import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Section } from "@/lib/posts";
import { getAllSlugs, getPostBySlug } from "@/lib/posts-db";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Karen Alexandra`,
    description: post.excerpt,
  };
}

function renderSection(section: Section, i: number) {
  return (
    <div key={i} style={{ marginBottom: "48px" }}>
      {section.heading && (
        <div style={{ marginBottom: "20px" }}>
          {section.headingLevel === "h3" ? (
            <h3
              style={{
                fontFamily: "var(--ka-display)",
                fontSize: "28px",
                fontStyle: section.italic ? "italic" : "normal",
                fontWeight: 400,
                lineHeight: 1.1,
              }}
            >
              {section.heading}
            </h3>
          ) : (
            <h2
              style={{
                fontFamily: "var(--ka-display)",
                fontSize: "40px",
                fontStyle: section.italic ? "italic" : "normal",
                fontWeight: 400,
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
              }}
            >
              {section.heading}
            </h2>
          )}
        </div>
      )}

      {section.image && (
        <div
          style={{
            margin: "32px 0",
            overflow: "hidden",
            background: "var(--ka-sand)",
          }}
        >
          <Image
            src={section.image}
            alt={section.imageAlt ?? ""}
            width={1200}
            height={800}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      )}

      {section.body && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            fontSize: "16px",
            lineHeight: 1.75,
            color: "var(--ka-ink-soft)",
            fontWeight: 300,
          }}
        >
          {section.body.split("\n\n").map((para, j) => (
            <p key={j} dangerouslySetInnerHTML={{ __html: para }} />
          ))}
        </div>
      )}

      {section.list && (
        <ul style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {section.list.map((item, j) => {
            const colonIdx = item.indexOf(": ");
            const label = colonIdx > -1 ? item.slice(0, colonIdx) : null;
            const rest = colonIdx > -1 ? item.slice(colonIdx + 2) : item;
            return (
              <li
                key={j}
                style={{ display: "flex", gap: "16px", fontSize: "15px", lineHeight: 1.7, color: "var(--ka-ink-soft)", fontWeight: 300 }}
              >
                <span
                  style={{
                    marginTop: "10px",
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: "var(--ka-accent-deep)",
                    flexShrink: 0,
                  }}
                />
                <span>
                  {label && (
                    <strong style={{ color: "var(--ka-ink)", fontWeight: 400 }}>
                      {label}:{" "}
                    </strong>
                  )}
                  {rest}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
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

      {/* ── Article ──────────────────────────────────────────────────── */}
      <article style={{ maxWidth: "820px", margin: "0 auto", padding: "80px 32px" }}>
        <div style={{ marginBottom: "48px" }}>
          <span className="ka-eyebrow" style={{ display: "block", marginBottom: "16px" }}>
            {post.category}&nbsp;&nbsp;·&nbsp;&nbsp;
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
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
              fontSize: "18px",
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

        <div className="ka-rule" style={{ marginBottom: "56px" }} />

        {post.sections.map((section, i) => renderSection(section, i))}
      </article>

      {/* ── Back link ────────────────────────────────────────────────── */}
      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "0 32px 80px" }}>
        <div className="ka-rule" style={{ marginBottom: "32px" }} />
        <Link
          href="/case-studies"
          className="ka-arrow-link"
          style={{ flexDirection: "row-reverse" }}
        >
          <span className="ka-arrow" style={{ transform: "rotate(180deg)" }}>→</span>
          All Case Studies
        </Link>
      </div>
    </>
  );
}
