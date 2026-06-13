import React from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ServicesContent } from "@/lib/page-content-db";
import type { Post } from "@/lib/posts";

export function HeroSection({ c }: { c: ServicesContent }) {
  return (
    <section style={{ padding: "clamp(56px,8vw,120px) clamp(20px,5vw,64px) clamp(40px,6vw,80px)", borderBottom: "1px solid var(--ka-line)" }}>
      <div className="ka-eyebrow" style={{ marginBottom: "clamp(32px,4vw,56px)" }}>{c.hero.eyebrow}</div>
      <div className="ka-sv-hero-grid">
        <h1 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(48px,9vw,132px)", fontWeight: 300, lineHeight: 0.96 }}>
          {c.hero.headline}<br />
          <span style={{ fontStyle: "italic" }}>{c.hero.headlineItalic}</span><span style={{ color: "var(--ka-accent-deep)" }}>.</span>
        </h1>
        <p style={{ fontSize: "clamp(14px,1.2vw,17px)", lineHeight: 1.7, color: "var(--ka-ink)", maxWidth: 420, alignSelf: "end" }}>
          {c.hero.subhead}
        </p>
      </div>
    </section>
  );
}

export function PrincipleSection({ c }: { c: ServicesContent }) {
  return (
    <section style={{ padding: "clamp(24px,3.5vw,48px) clamp(20px,5vw,64px)", borderBottom: "1px solid var(--ka-line)", background: "var(--ka-bg-soft)" }}>
      <div className="ka-sv-principle-grid">
        <span className="ka-eyebrow" style={{ color: "var(--ka-accent-deep)" }}>{c.principle.label}</span>
        <p style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(17px,2vw,26px)", fontStyle: "italic", lineHeight: 1.4 }}>
          {c.principle.quote}
        </p>
        <Link href="/contact" className="ka-arrow-link">The studio principles <span className="ka-arrow">→</span></Link>
      </div>
    </section>
  );
}

export function ServicesCardsSection({ c }: { c: ServicesContent }) {
  return (
    <section style={{ padding: "clamp(48px,8vw,120px) clamp(20px,5vw,64px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 32, marginBottom: 0, borderBottom: "1px solid var(--ka-ink)", flexWrap: "wrap", gap: 12 }}>
        <div className="ka-eyebrow">N° 01 — The engagements</div>
        <Link href="/contact" className="ka-arrow-link" style={{ fontSize: 10 }}>Or send a brief <span className="ka-arrow">→</span></Link>
      </div>
      {c.services.map((s, i) => (
        <article key={i} className="ka-sv-card-article" style={{ padding: "clamp(32px,5vw,56px) 0", borderTop: i === 0 ? "none" : "1px solid var(--ka-ink)", borderBottom: "1px solid var(--ka-ink)" }}>
          <div>
            <div style={{ fontFamily: "var(--ka-display)", fontSize: 14, color: "var(--ka-muted)", marginBottom: 24 }}>N° {s.n}</div>
            <h3 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(28px,3.5vw,48px)", fontStyle: s.italic ? "italic" : "normal", lineHeight: 1 }}>
              {s.title}
            </h3>
            <div className="ka-eyebrow" style={{ marginTop: 20, color: "var(--ka-accent-deep)" }}>{s.tag}</div>
          </div>
          <div>
            <p style={{ fontFamily: "var(--ka-display)", fontStyle: "italic", fontSize: "clamp(16px,1.6vw,22px)", lineHeight: 1.5, color: "var(--ka-ink)", marginBottom: 28 }}>
              {s.summary}
            </p>
            <div className="ka-eyebrow" style={{ marginBottom: 16 }}>What&apos;s delivered</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {s.deliverables.map((d, j) => (
                <li key={j} style={{ display: "flex", gap: 16, fontSize: 15, lineHeight: 1.7 }}>
                  <span style={{ color: "var(--ka-accent-deep)", fontFamily: "var(--ka-mono)", fontSize: 11, flex: "0 0 24px", paddingTop: 6 }}>—</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
          <aside>
            <div className="ka-eyebrow" style={{ marginBottom: 20 }}>Proof of work →</div>
            <div style={{ padding: 24, border: "1px solid var(--ka-line)", background: "var(--ka-bg-soft)" }}>
              <div style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(36px,4.5vw,56px)", fontStyle: "italic", color: "var(--ka-accent-deep)", lineHeight: 1 }}>
                {s.proofStat}
              </div>
              <div className="ka-eyebrow" style={{ marginTop: 12 }}>{s.proofNote}</div>
              <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--ka-line)" }}>
                <div style={{ fontFamily: "var(--ka-display)", fontStyle: "italic", fontSize: 18 }}>{s.proofCase}</div>
                <Link href={`/case-studies/${s.proofSlug}`} className="ka-arrow-link" style={{ fontSize: 10, marginTop: 12, display: "inline-flex" }}>
                  Read case study <span className="ka-arrow">→</span>
                </Link>
              </div>
            </div>
          </aside>
        </article>
      ))}
    </section>
  );
}

export function ProcessSection({ c }: { c: ServicesContent }) {
  return (
    <section style={{ padding: "clamp(48px,8vw,120px) clamp(20px,5vw,64px)", background: "var(--ka-bg-soft)", borderTop: "1px solid var(--ka-line)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 32, marginBottom: 48, borderBottom: "1px solid var(--ka-ink)", flexWrap: "wrap", gap: 12 }}>
        <div className="ka-eyebrow">N° 02 — How the work begins</div>
        <Link href="/contact" className="ka-arrow-link" style={{ fontSize: 10 }}>A first letter <span className="ka-arrow">→</span></Link>
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", top: 12, left: "9%", right: "9%", height: 1, background: "var(--ka-ink)", opacity: 0.4 }} />
        <div className="ka-sv-process-grid">
          {c.process.map((p, i) => (
            <div key={i}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--ka-bg-soft)", border: "1px solid var(--ka-ink)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontFamily: "var(--ka-mono)", color: "var(--ka-accent-deep)", marginBottom: 32 }}>
                {p.num}
              </div>
              <div className="ka-eyebrow" style={{ color: "var(--ka-accent-deep)", marginBottom: 12 }}>{p.when}</div>
              <h4 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(18px,2vw,26px)", fontStyle: i % 2 ? "italic" : "normal", marginBottom: 16, lineHeight: 1.15 }}>
                {p.title}
              </h4>
              <p style={{ color: "var(--ka-muted)", fontSize: 14, lineHeight: 1.65 }}>{p.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CaseLinksSection({ posts }: { posts: Post[] }) {
  return (
    <section style={{ padding: "clamp(48px,8vw,120px) clamp(20px,5vw,64px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 32, marginBottom: 48, borderBottom: "1px solid var(--ka-ink)", flexWrap: "wrap", gap: 12 }}>
        <div className="ka-eyebrow">N° 03 — Recent engagements, in depth</div>
        <Link href="/case-studies" className="ka-arrow-link" style={{ fontSize: 10 }}>All case studies <span className="ka-arrow">→</span></Link>
      </div>
      <div className="ka-sv-case-grid">
        {posts.map((post, i) => (
          <Link key={post.slug} href={`/case-studies/${post.slug}`} style={{ display: "block", textDecoration: "none", color: "inherit", paddingTop: 32, borderTop: "1px solid var(--ka-ink)" }}>
            <div style={{ aspectRatio: "4/5", marginBottom: 28, position: "relative", overflow: "hidden", background: "var(--ka-sand)" }}>
              {post.heroImage && (
                <Image src={post.heroImage} alt={post.heroAlt ?? post.title} fill style={{ objectFit: "cover" }} sizes="(max-width:767px) 100vw, 33vw" />
              )}
            </div>
            <div className="ka-eyebrow">{post.category}</div>
            <h3 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(18px,2.5vw,30px)", fontStyle: i % 2 ? "italic" : "normal", lineHeight: 1.15, marginTop: 14 }}>
              {post.title}
            </h3>
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "baseline", marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--ka-line)" }}>
              <span className="ka-eyebrow">Read →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function TestimonialsSection({ c }: { c: ServicesContent }) {
  return (
    <section style={{ padding: "clamp(56px,10vw,140px) clamp(20px,5vw,64px)", borderTop: "1px solid var(--ka-line)", background: "var(--ka-ink)", color: "var(--ka-bg)" }}>
      <div className="ka-eyebrow" style={{ color: "rgba(250,247,242,0.5)", textAlign: "center", marginBottom: 80 }}>
        N° 04 — On the work
      </div>
      <div className="ka-sv-testimonials-grid">
        {c.testimonials.map((t, i) => (
          <div key={i} style={{ paddingTop: 32, borderTop: "1px solid rgba(250,247,242,0.3)" }}>
            <div style={{ fontFamily: "var(--ka-display)", fontSize: 56, fontStyle: "italic", color: "var(--ka-accent)", lineHeight: 0.5, marginBottom: 24 }}>&ldquo;</div>
            <p style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(16px,1.8vw,24px)", fontStyle: i % 2 ? "normal" : "italic", lineHeight: 1.35, color: "var(--ka-bg)" }}>
              {t.q}
            </p>
            <div className="ka-eyebrow" style={{ marginTop: 32, color: "rgba(250,247,242,0.6)" }}>{t.who}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FaqSection({ c }: { c: ServicesContent }) {
  return (
    <section style={{ padding: "clamp(48px,8vw,120px) clamp(20px,5vw,64px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 32, marginBottom: 32, borderBottom: "1px solid var(--ka-ink)", flexWrap: "wrap", gap: 12 }}>
        <div className="ka-eyebrow">N° 05 — Asked, before now</div>
        <Link href="/contact" className="ka-arrow-link" style={{ fontSize: 10 }}>Or write directly <span className="ka-arrow">→</span></Link>
      </div>
      {c.faq.map((item, i) => (
        <details key={i} open={i === 0} className="ka-sv-faq-item">
          <summary>
            <div style={{ display: "flex", gap: 24, alignItems: "baseline", flex: 1 }}>
              <span className="ka-eyebrow" style={{ color: "var(--ka-accent-deep)", flex: "0 0 auto" }}>0{i + 1}</span>
              <h3 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(17px,2vw,26px)", fontStyle: i % 2 ? "italic" : "normal" }}>{item.q}</h3>
            </div>
            <span style={{ fontFamily: "var(--ka-display)", fontSize: 22, color: "var(--ka-muted)" }}>+</span>
          </summary>
          <p style={{ marginTop: 20, marginLeft: "clamp(20px,4vw,56px)", color: "var(--ka-muted)", fontSize: 16, lineHeight: 1.75, maxWidth: 760, marginBottom: 0 }}>
            {item.a}
          </p>
        </details>
      ))}
    </section>
  );
}

export function CtaSection({ c }: { c: ServicesContent }) {
  return (
    <section style={{ padding: "clamp(56px,10vw,140px) clamp(20px,5vw,64px)", textAlign: "center", borderTop: "1px solid var(--ka-line)" }}>
      <div className="ka-eyebrow">Inquiries</div>
      <h2 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(40px,7vw,96px)", fontStyle: "italic", margin: "32px auto 24px", maxWidth: 1100, lineHeight: 1 }}>
        {c.cta.headline}
      </h2>
      <p style={{ color: "var(--ka-muted)", maxWidth: 540, margin: "0 auto 48px", fontSize: "clamp(14px,1.2vw,16px)", lineHeight: 1.7 }}>
        {c.cta.subhead}
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
        <Link href="/contact" className="ka-btn" style={{ background: "var(--ka-ink)", color: "var(--ka-bg)" }}>
          Open the contact letter →
        </Link>
        <a href="mailto:studio@karenalexandra.com" className="ka-arrow-link">
          studio@karenalexandra.com <span className="ka-arrow">→</span>
        </a>
      </div>
    </section>
  );
}

export function buildServicesSectionMap(
  c: ServicesContent,
  { posts = [] }: { posts?: Post[] } = {}
): Record<string, ReactNode> {
  return {
    "hero":         <HeroSection c={c} />,
    "principle":    <PrincipleSection c={c} />,
    "services":     <ServicesCardsSection c={c} />,
    "process":      <ProcessSection c={c} />,
    "case-links":   <CaseLinksSection posts={posts} />,
    "testimonials": <TestimonialsSection c={c} />,
    "faq":          <FaqSection c={c} />,
    "cta":          <CtaSection c={c} />,
  };
}
