import React from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { MediaKitContent } from "@/lib/page-content-db";
import type { BlogPost } from "@/lib/blog-db";
import type { VideoCard } from "@/lib/youtube";

const MK_SAMPLES = [
  { type: "Long-form letter",  title: "On the slow wardrobe — why I'm only buying one bag this year.", meta: "Substack · 121K reads"    },
  { type: "Film",              title: "Forty-eight hours at the Four Seasons George V.",                meta: "YouTube · 82K views · 14m" },
  { type: "Instagram series",  title: "Spring capsule — twelve pieces, in order of importance.",       meta: "IG carousel · 64K saves"   },
  { type: "Editorial film",    title: "A weekend at Aman Venice — what to pack, what to skip.",        meta: "YouTube · 68K views"       },
];

export function HeroSection({ c }: { c: MediaKitContent }) {
  return (
    <section style={{ padding: "clamp(56px,8vw,100px) clamp(20px,5vw,64px) clamp(48px,6vw,80px)", borderBottom: "1px solid var(--ka-ink)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "clamp(32px,5vw,64px)", flexWrap: "wrap", gap: 12 }}>
        <div className="ka-eyebrow">{c.hero.eyebrowLeft}</div>
        <div className="ka-eyebrow">{c.hero.eyebrowRight}</div>
      </div>
      <div className="ka-mk-hero-grid">
        <h1 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(56px,10vw,140px)", fontWeight: 300, lineHeight: 0.94 }}>
          {c.hero.headline}<br />
          <span style={{ fontStyle: "italic" }}>{c.hero.headlineItalic}</span><br />
          {c.hero.headlineLine3 ?? "audience"}<span style={{ color: "var(--ka-accent-deep)" }}>.</span>
        </h1>
        <div style={{ alignSelf: "end", maxWidth: 400 }}>
          <p style={{ fontSize: "clamp(14px,1.2vw,17px)", lineHeight: 1.7, color: "var(--ka-ink)", marginBottom: 32 }}>
            {c.hero.subhead}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <a href="/media-kit.pdf" className="ka-btn" style={{ background: "var(--ka-ink)", color: "var(--ka-bg)" }}>
              ↓ Download PDF kit
            </a>
            <a href="mailto:press@karenalexandra.com" className="ka-arrow-link" style={{ fontSize: 11 }}>
              press@karenalexandra.com <span className="ka-arrow">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BioSection({ c }: { c: MediaKitContent }) {
  const bioLines = c.bio.headline.split("\n");
  return (
    <section className="ka-mk-bio-section" style={{ padding: "clamp(48px,8vw,120px) clamp(20px,5vw,64px)", background: "var(--ka-bg-soft)" }}>
      <img
        src={c.bio.portraitUrl}
        alt="Karen Alexandra"
        style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block" }}
      />
      <div>
        <div className="ka-eyebrow" style={{ marginBottom: 32 }}>{c.bio.eyebrow}</div>
        <h2 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(28px,4vw,56px)", fontStyle: "italic", lineHeight: 1.05 }}>
          {bioLines.map((line, i) => (
            <React.Fragment key={i}>{line}{i < bioLines.length - 1 && <br />}</React.Fragment>
          ))}
        </h2>
        <p style={{ fontFamily: "var(--ka-display)", fontStyle: "italic", fontSize: "clamp(16px,1.5vw,22px)", lineHeight: 1.5, color: "var(--ka-ink)", marginTop: 32 }}>
          {c.bio.bioText}
        </p>
        <div className="ka-mk-bio-facts" style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--ka-ink)" }}>
          {[
            ["Based",        c.bio.basedValue,        ""],
            ["Languages",    c.bio.languagesValue,     ""],
            ["Working with", c.bio.workingWithValue,   ""],
          ].map(([label, main, sub], i) => (
            <div key={i}>
              <div className="ka-eyebrow" style={{ marginBottom: 6 }}>{label}</div>
              <div style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(16px,1.5vw,22px)", marginTop: 8 }}>{main}</div>
              {sub && <div style={{ fontFamily: "var(--ka-display)", fontStyle: "italic", fontSize: "clamp(14px,1.2vw,18px)", color: "var(--ka-muted)" }}>{sub}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReachSection({
  c,
  recentPosts,
  recentVideos,
}: {
  c: MediaKitContent;
  recentPosts: BlogPost[];
  recentVideos: VideoCard[];
}) {
  return (
    <>
      <section style={{ padding: "clamp(48px,8vw,120px) clamp(20px,5vw,64px)", borderBottom: "1px solid var(--ka-line)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 32, marginBottom: 48, borderBottom: "1px solid var(--ka-ink)", flexWrap: "wrap", gap: 12 }}>
          <div className="ka-eyebrow">N° 02 — The audience</div>
          <a href="mailto:press@karenalexandra.com" className="ka-arrow-link" style={{ fontSize: 10 }}>Full deck on request <span className="ka-arrow">→</span></a>
        </div>
        <div className="ka-mk-reach-grid">
          {c.reach.map((s, i) => (
            <div key={i} className="ka-mk-reach-cell">
              <div className="ka-eyebrow" style={{ color: "var(--ka-accent-deep)" }}>0{i + 1}</div>
              <div className="ka-mk-reach-num" style={{ fontStyle: i % 2 ? "italic" : "normal", marginTop: 24 }}>{s.v}</div>
              <div className="ka-eyebrow" style={{ marginTop: 16 }}>{s.l}</div>
            </div>
          ))}
        </div>

        <div className="ka-mk-audience-section" style={{ marginTop: 80 }}>
          <div>
            <div className="ka-eyebrow" style={{ marginBottom: 16 }}>Audience profile</div>
            <h3 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(22px,2.5vw,32px)", fontStyle: "italic", lineHeight: 1.1 }}>
              Read by women who research before they buy.
            </h3>
            <p style={{ color: "var(--ka-muted)", fontSize: 15, lineHeight: 1.7, marginTop: 20, maxWidth: 380 }}>
              A first-party survey of 2,400 subscribers, conducted Q1 MMXXVI.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {c.demo.map((d, i) => (
              <div key={i} className="ka-mk-audience-row" style={{ padding: "16px 0", borderBottom: "1px solid var(--ka-line)" }}>
                <span style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(14px,1.3vw,18px)", fontStyle: i % 2 ? "italic" : "normal" }}>{d.label}</span>
                <div className="ka-mk-demo-bar">
                  <div className="ka-mk-demo-fill" style={{ width: `${d.pct}%` }} />
                </div>
                <span style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(18px,2vw,24px)", fontStyle: "italic", textAlign: "right", color: "var(--ka-accent-deep)" }}>{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content samples */}
      <section style={{ padding: "clamp(48px,8vw,120px) clamp(20px,5vw,64px)", borderTop: "1px solid var(--ka-line)", background: "var(--ka-bg-soft)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 32, marginBottom: 48, borderBottom: "1px solid var(--ka-ink)", flexWrap: "wrap", gap: 12 }}>
          <div className="ka-eyebrow">N° 06 — Recent content</div>
          <Link href="/journal" className="ka-arrow-link" style={{ fontSize: 10 }}>Full library <span className="ka-arrow">→</span></Link>
        </div>
        <div className="ka-mk-content-grid">
          {recentPosts.map((post, i) => (
            <Link key={post.slug} href={`/journal/${post.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
              <article>
                <div style={{ aspectRatio: "4/5", position: "relative", overflow: "hidden", background: "var(--ka-sand)" }}>
                  {post.heroImage
                    ? <Image src={post.heroImage} alt={post.heroAlt} fill style={{ objectFit: "cover" }} sizes="25vw" />
                    : <div className="ka-img" style={{ position: "absolute", inset: 0 }}><span className="ka-img-label">Long-form letter</span></div>
                  }
                </div>
                <div className="ka-eyebrow" style={{ marginTop: 16, color: "var(--ka-accent-deep)" }}>Long-form letter</div>
                <h4 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(16px,1.5vw,20px)", fontStyle: i % 2 ? "italic" : "normal", lineHeight: 1.3, marginTop: 8 }}>
                  {post.title}
                </h4>
                <div className="ka-card-meta" style={{ marginTop: 12 }}>The Edit · {post.date}</div>
              </article>
            </Link>
          ))}
          {recentVideos.map((video, i) => (
            <a key={video.id} href={video.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
              <article>
                <div style={{ aspectRatio: "16/9", position: "relative", overflow: "hidden", background: "var(--ka-sand)" }}>
                  <Image src={video.thumbnail} alt={video.title} fill style={{ objectFit: "cover" }} sizes="25vw" />
                </div>
                <div className="ka-eyebrow" style={{ marginTop: 16, color: "var(--ka-accent-deep)" }}>Film · {video.category}</div>
                <h4 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(16px,1.5vw,20px)", fontStyle: i % 2 ? "normal" : "italic", lineHeight: 1.3, marginTop: 8 }}>
                  {video.title}
                </h4>
                <div className="ka-card-meta" style={{ marginTop: 12 }}>
                  YouTube{video.views ? ` · ${video.views} views` : ""}{video.length !== "—" ? ` · ${video.length}` : ""}
                </div>
              </article>
            </a>
          ))}
          {/* Fallback placeholders if fewer than 4 items fetched */}
          {recentPosts.length === 0 && recentVideos.length === 0 && MK_SAMPLES.map((s, i) => (
            <article key={i}>
              <div className="ka-img" style={{ aspectRatio: i === 1 || i === 3 ? "16/9" : "4/5" }}>
                <span className="ka-img-label">{s.type}</span>
              </div>
              <div className="ka-eyebrow" style={{ marginTop: 16, color: "var(--ka-accent-deep)" }}>{s.type}</div>
              <h4 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(16px,1.5vw,20px)", fontStyle: i % 2 ? "italic" : "normal", lineHeight: 1.3, marginTop: 8 }}>{s.title}</h4>
              <div className="ka-card-meta" style={{ marginTop: 12 }}>{s.meta}</div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export function PartnersSection({ c }: { c: MediaKitContent }) {
  return (
    <section style={{ padding: "clamp(48px,8vw,120px) clamp(20px,5vw,64px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 32, marginBottom: 48, borderBottom: "1px solid var(--ka-ink)", flexWrap: "wrap", gap: 12 }}>
        <div className="ka-eyebrow">N° 03 — Selected partnerships</div>
        <a href="mailto:press@karenalexandra.com" className="ka-arrow-link" style={{ fontSize: 10 }}>Full client list on request <span className="ka-arrow">→</span></a>
      </div>
      <div className="ka-mk-partner-grid">
        {c.partners.map((p, i) => (
          <div key={i} className="ka-mk-partner-cell">{p}</div>
        ))}
      </div>
    </section>
  );
}

export function PressSection({ c }: { c: MediaKitContent }) {
  return (
    <section style={{ padding: "clamp(48px,8vw,120px) clamp(20px,5vw,64px)", background: "var(--ka-bg-soft)", borderTop: "1px solid var(--ka-line)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 32, marginBottom: 48, borderBottom: "1px solid var(--ka-ink)", flexWrap: "wrap", gap: 12 }}>
        <div className="ka-eyebrow">N° 04 — In the press</div>
        <a href="#" className="ka-arrow-link" style={{ fontSize: 10 }}>Full press archive <span className="ka-arrow">→</span></a>
      </div>
      <div className="ka-mk-press-grid">
        {c.press.map((p, i) => (
          <div key={i} className="ka-mk-press-card">
            <div className="ka-eyebrow">{p.p}</div>
            <p style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(20px,2.5vw,32px)", fontStyle: i % 2 ? "normal" : "italic", lineHeight: 1.25, marginTop: 24 }}>
              &ldquo;{p.q}&rdquo;
            </p>
            <div className="ka-card-meta" style={{ marginTop: 32 }}>{p.d} · Read feature →</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function TestimonialsSection({ c }: { c: MediaKitContent }) {
  return (
    <section style={{ padding: "clamp(56px,10vw,140px) clamp(20px,5vw,64px)", textAlign: "center", borderTop: "1px solid var(--ka-line)" }}>
      <div className="ka-eyebrow" style={{ marginBottom: 48 }}>N° 05 — The community, on the work</div>
      <div className="ka-mk-testimonials-grid">
        {c.testimonials.map((t, i) => (
          <div key={i}>
            <div style={{ width: 32, height: 1, background: "var(--ka-accent-deep)", margin: "0 auto 32px" }} />
            <p style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(18px,2.5vw,32px)", fontStyle: "italic", lineHeight: 1.3 }}>
              &ldquo;{t.q}&rdquo;
            </p>
            <div className="ka-eyebrow" style={{ marginTop: 32 }}>{t.who}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function InstagramSection({ c }: { c: MediaKitContent }) {
  return (
    <section style={{ padding: "clamp(48px,8vw,120px) clamp(20px,5vw,64px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 56, paddingBottom: 24, borderBottom: "1px solid var(--ka-ink)", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div className="ka-eyebrow" style={{ marginBottom: 12 }}>N° 07 — On Instagram</div>
          <h2 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(28px,4vw,56px)", fontStyle: "italic" }}>{c.instagram.handle}</h2>
          <div style={{ fontFamily: "var(--ka-display)", fontStyle: "italic", color: "var(--ka-muted)", fontSize: "clamp(15px,1.5vw,20px)", marginTop: 12 }}>
            {c.instagram.followers} · {c.instagram.engagement}
          </div>
        </div>
        <a href={`https://instagram.com/${c.instagram.handle.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="ka-arrow-link">
          Open on Instagram <span className="ka-arrow">↗</span>
        </a>
      </div>
      <div className="ka-mk-ig-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="ka-img" style={{ aspectRatio: "1/1" }}>
            <span className="ka-img-label">IG · 0{i + 1}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CtaSection({ c }: { c: MediaKitContent }) {
  return (
    <section style={{ padding: "clamp(56px,10vw,140px) clamp(20px,5vw,64px)", background: "var(--ka-ink)", color: "var(--ka-bg)" }}>
      <div className="ka-mk-cta-grid">
        <div>
          <div className="ka-eyebrow" style={{ color: "rgba(250,247,242,0.5)", marginBottom: 24 }}>Press · Partnership inquiries</div>
          <h2 style={{ fontFamily: "var(--ka-display)", color: "var(--ka-bg)", fontSize: "clamp(44px,6vw,88px)", fontStyle: "italic", lineHeight: 1 }}>
            Take the kit<br />with you.
          </h2>
          <p style={{ color: "rgba(250,247,242,0.7)", maxWidth: 480, marginTop: 24, fontSize: "clamp(14px,1.2vw,16px)", lineHeight: 1.7 }}>
            {c.ctaSubhead}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <a href="/media-kit.pdf" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "clamp(16px,2vw,28px) clamp(20px,2.5vw,32px)", border: "1px solid var(--ka-bg)", textDecoration: "none", color: "var(--ka-bg)" }}>
            <div>
              <div className="ka-eyebrow" style={{ color: "rgba(250,247,242,0.5)", marginBottom: 8 }}>PDF · 12 MB</div>
              <div style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(18px,2vw,24px)" }}>Download Media Kit</div>
            </div>
            <span style={{ fontSize: 28 }}>↓</span>
          </a>
          <a href="mailto:press@karenalexandra.com" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "clamp(16px,2vw,28px) clamp(20px,2.5vw,32px)", border: "1px solid rgba(250,247,242,0.3)", textDecoration: "none", color: "var(--ka-bg)" }}>
            <div>
              <div className="ka-eyebrow" style={{ color: "rgba(250,247,242,0.5)", marginBottom: 8 }}>Or write directly</div>
              <div style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(16px,1.8vw,22px)", fontStyle: "italic" }}>press@karenalexandra.com</div>
            </div>
            <span style={{ fontSize: 22 }}>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function buildMediaKitSectionMap(
  c: MediaKitContent,
  { recentPosts = [], recentVideos = [] }: { recentPosts?: BlogPost[]; recentVideos?: VideoCard[] } = {}
): Record<string, ReactNode> {
  return {
    "hero":         <HeroSection c={c} />,
    "bio":          <BioSection c={c} />,
    "reach":        <ReachSection c={c} recentPosts={recentPosts} recentVideos={recentVideos} />,
    "partners":     <PartnersSection c={c} />,
    "press":        <PressSection c={c} />,
    "testimonials": <TestimonialsSection c={c} />,
    "instagram":    <InstagramSection c={c} />,
    "cta":          <CtaSection c={c} />,
  };
}
