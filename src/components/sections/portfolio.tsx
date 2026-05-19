import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { PortfolioContent } from "@/lib/page-content-db";
import type { Post } from "@/lib/posts";

const LOGOS = [
  "SHOPBOP", "FOUR SEASONS", "IHG", "CITIZENS OF HUMANITY", "RIVER ISLAND",
  "AGOLDE", "SISLEY PARIS", "MAKEUP FOREVER", "ASOS", "NORDSTROM",
];

export function HeroSection({ c }: { c: PortfolioContent }) {
  return (
    <section style={{ padding: "120px 64px 96px", borderBottom: "1px solid var(--ka-line)", display: "grid", gridTemplateColumns: "1fr auto", alignItems: "flex-end", gap: "64px" }}>
      <div>
        <span className="ka-eyebrow" style={{ display: "block", marginBottom: "24px" }}>{c.hero.eyebrow}</span>
        <h1 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(52px, 7vw, 96px)", fontWeight: 400, lineHeight: 1.0, letterSpacing: "-0.02em", marginBottom: "12px" }}>
          {c.hero.headline}{" "}
          <em style={{ fontStyle: "italic", color: "var(--ka-muted)" }}>{c.hero.accentText}</em>
        </h1>
      </div>
      <Link href="/contact" className="ka-btn" style={{ whiteSpace: "nowrap" }}>Work with me</Link>
    </section>
  );
}

export function FactsSection({ c }: { c: PortfolioContent }) {
  return (
    <section style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: "1px solid var(--ka-line)" }}>
      {c.stats.map(({ value, label, note }, i) => (
        <div key={label} style={{ padding: "48px 40px", borderRight: i < c.stats.length - 1 ? "1px solid var(--ka-line)" : "none" }}>
          <p style={{ fontFamily: "var(--ka-display)", fontSize: "64px", fontWeight: 300, lineHeight: 1.0, marginBottom: "8px" }}>{value}</p>
          <span className="ka-eyebrow" style={{ display: "block", marginBottom: "8px" }}>{label}</span>
          <p style={{ fontSize: "13px", color: "var(--ka-ink-soft)", lineHeight: 1.5, fontWeight: 300 }}>{note}</p>
        </div>
      ))}
    </section>
  );
}

export function LogosSection() {
  return (
    <section style={{ padding: "80px 64px", borderBottom: "1px solid var(--ka-line)" }}>
      <span className="ka-eyebrow" style={{ display: "block", marginBottom: "40px" }}>Brands I&apos;ve worked with</span>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1px", background: "var(--ka-line)", border: "1px solid var(--ka-line)" }}>
        {LOGOS.map((logo) => (
          <div key={logo} style={{ background: "var(--ka-bg)", padding: "28px 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "var(--ka-body)", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "var(--ka-ink-soft)", textAlign: "center" as const }}>{logo}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CapabilitiesSection({ c }: { c: PortfolioContent }) {
  return (
    <section style={{ padding: "96px 64px", borderBottom: "1px solid var(--ka-line)" }}>
      <span className="ka-eyebrow" style={{ display: "block", marginBottom: "56px" }}>What I do</span>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "var(--ka-line)", border: "1px solid var(--ka-line)" }}>
        {c.capabilities.map(({ title, desc }) => (
          <div key={title} style={{ background: "var(--ka-bg)", padding: "48px 40px" }}>
            <h3 style={{ fontFamily: "var(--ka-display)", fontSize: "28px", fontStyle: "italic", marginBottom: "16px" }}>{title}</h3>
            <p style={{ fontSize: "15px", color: "var(--ka-ink-soft)", lineHeight: 1.7, fontWeight: 300 }}>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SelectedWorkSection({ posts }: { posts: Post[] }) {
  return (
    <section style={{ padding: "96px 0", borderBottom: "1px solid var(--ka-line)" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 64px 48px", borderBottom: "1px solid var(--ka-line)", marginBottom: "64px" }}>
        <div>
          <span className="ka-eyebrow" style={{ display: "block", marginBottom: "12px" }}>02</span>
          <h2 style={{ fontFamily: "var(--ka-display)", fontSize: "56px", fontStyle: "italic", fontWeight: 400 }}>Selected Work</h2>
        </div>
        <Link href="/case-studies" className="ka-arrow-link">All case studies <span className="ka-arrow">→</span></Link>
      </div>
      {posts.map((post, i) => (
        <Link key={post.slug} href={`/case-studies/${post.slug}`}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "0 64px", marginBottom: "64px", gap: "64px", alignItems: "center", textDecoration: "none" }}>
          <div style={{ aspectRatio: "4/3", position: "relative", overflow: "hidden", background: "var(--ka-sand)", order: i % 2 === 0 ? 0 : 1 }}>
            {post.heroImage && <Image src={post.heroImage} alt={post.heroAlt} fill style={{ objectFit: "cover" }} sizes="50vw" />}
          </div>
          <div style={{ order: i % 2 === 0 ? 1 : 0 }}>
            <span className="ka-eyebrow" style={{ display: "block", marginBottom: "12px" }}>{post.category}</span>
            <h3 style={{ fontFamily: "var(--ka-display)", fontSize: "36px", fontStyle: "italic", lineHeight: 1.1, marginBottom: "16px" }}>{post.title}</h3>
            <p style={{ fontSize: "15px", color: "var(--ka-ink-soft)", lineHeight: 1.7, fontWeight: 300, marginBottom: "28px" }}>{post.excerpt}</p>
            <span className="ka-arrow-link">View case study <span className="ka-arrow">→</span></span>
          </div>
        </Link>
      ))}
    </section>
  );
}

export function PressSection({ c }: { c: PortfolioContent }) {
  return (
    <section style={{ padding: "96px 64px", borderBottom: "1px solid var(--ka-line)", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "48px" }}>
      {c.press.map(({ publication, quote, date }) => (
        <div key={publication}>
          <span className="ka-eyebrow" style={{ display: "block", marginBottom: "20px" }}>{publication} · {date}</span>
          <p style={{ fontFamily: "var(--ka-display)", fontSize: "22px", fontStyle: "italic", lineHeight: 1.35, color: "var(--ka-ink)" }}>&ldquo;{quote}&rdquo;</p>
        </div>
      ))}
    </section>
  );
}

export function CtaSection({ c }: { c: PortfolioContent }) {
  return (
    <section style={{ background: "var(--ka-ink)", color: "var(--ka-bg)", padding: "96px 64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <span className="ka-eyebrow" style={{ display: "block", marginBottom: "16px", color: "var(--ka-accent)" }}>Let&apos;s collaborate</span>
        <h2 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(40px, 5vw, 64px)", fontStyle: "italic", fontWeight: 400, color: "var(--ka-bg)" }}>{c.cta.headline}</h2>
      </div>
      <Link href="/contact" className="ka-btn ka-btn-light" style={{ flexShrink: 0 }}>{c.cta.buttonLabel}</Link>
    </section>
  );
}

export interface PortfolioExtraProps { posts: Post[]; }

export function buildPortfolioSectionMap(c: PortfolioContent, extra: PortfolioExtraProps): Record<string, ReactNode> {
  return {
    "hero":          <HeroSection c={c} />,
    "facts":         <FactsSection c={c} />,
    "logos":         <LogosSection />,
    "capabilities":  <CapabilitiesSection c={c} />,
    "selected-work": <SelectedWorkSection posts={extra.posts} />,
    "press":         <PressSection c={c} />,
    "cta":           <CtaSection c={c} />,
  };
}
