import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { PortfolioContent } from "@/lib/page-content-db";
import type { Post } from "@/lib/posts";


export function HeroSection({ c }: { c: PortfolioContent }) {
  return (
    <section className="ka-rp ka-r-stack-md" style={{ padding: "120px 64px 96px", borderBottom: "1px solid var(--ka-line)", display: "grid", gridTemplateColumns: "1fr auto", alignItems: "flex-end", gap: "64px" }}>
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
    <section className="ka-r-2" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: "1px solid var(--ka-line)" }}>
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

export function LogosSection({ c }: { c: PortfolioContent }) {
  const logos = c.clientLogos ?? [];
  return (
    <section className="ka-rp" style={{ padding: "80px 64px", borderBottom: "1px solid var(--ka-line)" }}>
      <span className="ka-eyebrow" style={{ display: "block", marginBottom: "40px" }}>Brands I&apos;ve worked with</span>
      <div className="ka-r-logos" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1px", background: "var(--ka-line)", border: "1px solid var(--ka-line)" }}>
        {logos.map((logo) => (
          <div key={logo} style={{ background: "var(--ka-bg)", padding: "28px 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "var(--ka-body)", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "var(--ka-ink-soft)", textAlign: "center" as const }}>{logo}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// Fixed rather than read from c.capabilities, for the same reason as the
// contact hero (see components/sections/contact.tsx): page_content already
// holds an older version of this copy, and fetchPageContent deep-merges
// stored content over PORTFOLIO_DEFAULTS, so the stored value wins. Order
// and copy match the "Ways we can work together" cards on /contact — no
// numbering or email here, matching this section's own existing style.
const CAPABILITIES: { title: string; desc: string }[] = [
  { title: "Fractional Brand Marketing Director", desc: "Hire me as your Fractional Brand Marketing Director to create and execute on your brand's marketing strategy." },
  { title: "Influencer Campaign Management",      desc: "Full influencer marketing management from strategy to day-to-day campaign management." },
  { title: "E-commerce & Blog Content",           desc: "Up-level your digital storefront through SEO/GEO optimized content, and curated digital merchandising." },
  { title: "Brand partnerships",                  desc: "Long-form collaborations either on my own channels or UGC for your brand's content." },
];

export function CapabilitiesSection() {
  return (
    <section className="ka-rp" style={{ padding: "96px 64px", borderBottom: "1px solid var(--ka-line)" }}>
      <span className="ka-eyebrow" style={{ display: "block", marginBottom: "56px" }}>What I do</span>
      <div className="ka-r-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "var(--ka-line)", border: "1px solid var(--ka-line)" }}>
        {CAPABILITIES.map(({ title, desc }) => (
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
      <div className="ka-rp" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 64px 48px", borderBottom: "1px solid var(--ka-line)", marginBottom: "64px" }}>
        <div>
          <span className="ka-eyebrow" style={{ display: "block", marginBottom: "12px" }}>02</span>
          <h2 style={{ fontFamily: "var(--ka-display)", fontSize: "56px", fontStyle: "italic", fontWeight: 400 }}>Selected Work</h2>
        </div>
        <Link href="/case-studies" className="ka-arrow-link">All case studies <span className="ka-arrow">→</span></Link>
      </div>
      {posts.map((post, i) => (
        <Link key={post.slug} href={`/case-studies/${post.slug}`} className="ka-rp ka-r-stack ka-case-row"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "0 64px", marginBottom: "64px", gap: "64px", alignItems: "center", textDecoration: "none" }}>
          <div className="ka-case-image" style={{ aspectRatio: "4/3", position: "relative", overflow: "hidden", background: "var(--ka-sand)", order: i % 2 === 0 ? 0 : 1 }}>
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

// Fixed rather than read from c.press, for the same reason as CAPABILITIES
// above: copied over from the (hidden but still live in the DB)
// /services page's testimonials, so it's sourced from SERVICES_DEFAULTS in
// page-content-db.ts rather than from anything portfolio-specific. If Karen
// has edited the actual testimonial text via /admin/pages/services since
// these defaults were written, this won't reflect that — update here by hand.
const TESTIMONIALS: { q: string; who: string }[] = [
  { q: "I so appreciated your time! And after our call, I already got started on our new TikTok posting strategy. You're a rock star!", who: "Stacy Flax · Founder, Bored Rebel" },
  { q: "Had an insightful and inspiring chat with Karen today. We talked about my marketing strategy, pivots to a new ideal client, and emerging trends. I highly recommend connecting with her if you're looking to scale or pivot — her expertise in brand marketing and her kindness are off the charts!", who: "Sandra Kaye · Consulting client" },
];

export function TestimonialsSection() {
  return (
    <section className="ka-rp ka-r-stack" style={{ padding: "96px 64px", borderBottom: "1px solid var(--ka-line)", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "64px" }}>
      {TESTIMONIALS.map(({ q, who }) => (
        <div key={who}>
          <p style={{ fontFamily: "var(--ka-display)", fontSize: "22px", fontStyle: "italic", lineHeight: 1.35, color: "var(--ka-ink)", marginBottom: "20px" }}>&ldquo;{q}&rdquo;</p>
          <span className="ka-eyebrow" style={{ display: "block" }}>{who}</span>
        </div>
      ))}
    </section>
  );
}

// Fixed for the same reason as TESTIMONIALS above: this used to be a
// "Let's collaborate" headline + "Get in touch" link (c.cta.headline /
// c.cta.buttonLabel). Karen asked for the contact page's closing quote
// moved here instead, with a mailto button styled like the "Or write
// directly" card on /media-kit's CtaSection, using the studio inbox rather
// than press.
export function CtaSection() {
  return (
    <section className="ka-rp" style={{ background: "var(--ka-ink)", color: "var(--ka-bg)", padding: "96px 64px", textAlign: "center" }}>
      <div style={{ width: 56, height: 1, background: "var(--ka-accent)", margin: "0 auto 48px" }} />
      <p style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(32px, 4vw, 56px)", fontStyle: "italic", maxWidth: 1100, margin: "0 auto", lineHeight: 1.15, color: "var(--ka-bg)" }}>
        &ldquo;Considered always beats prompt. Write when you have something to say — not before.&rdquo;
      </p>
      <div className="ka-eyebrow" style={{ marginTop: 48, marginBottom: 56, color: "rgba(250,247,242,0.5)" }}>— From the editor&apos;s desk</div>
      <a
        href="mailto:studio@karenalexandra.com"
        style={{ display: "inline-flex", justifyContent: "space-between", alignItems: "center", gap: 40, maxWidth: 420, width: "100%", padding: "clamp(16px,2vw,28px) clamp(20px,2.5vw,32px)", border: "1px solid rgba(250,247,242,0.3)", textDecoration: "none", color: "var(--ka-bg)", textAlign: "left" }}
      >
        <div>
          <div className="ka-eyebrow" style={{ color: "rgba(250,247,242,0.5)", marginBottom: 8 }}>Or write directly</div>
          <div style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(16px,1.8vw,22px)", fontStyle: "italic" }}>studio@karenalexandra.com</div>
        </div>
        <span style={{ fontSize: 22 }}>→</span>
      </a>
    </section>
  );
}

export interface PortfolioExtraProps { posts: Post[]; }

export function buildPortfolioSectionMap(c: PortfolioContent, extra: PortfolioExtraProps): Record<string, ReactNode> {
  return {
    "hero":          <HeroSection c={c} />,
    "facts":         <FactsSection c={c} />,
    "logos":         <LogosSection c={c} />,
    "capabilities":  <CapabilitiesSection />,
    "selected-work": <SelectedWorkSection posts={extra.posts} />,
    "press":         <TestimonialsSection />,
    "cta":           <CtaSection />,
  };
}
