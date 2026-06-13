import type { ReactNode } from "react";
import type { AboutContent } from "@/lib/page-content-db";

export function HeroSection({ c }: { c: AboutContent }) {
  return (
    <section style={{ padding: "80px 64px 48px", borderBottom: "1px solid var(--ka-line)" }}>
      <div className="ka-eyebrow" style={{ marginBottom: 40 }}>{c.hero.eyebrow}</div>
      <h1 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(64px,10vw,120px)", fontWeight: 300, lineHeight: 0.93, marginBottom: 32 }}>
        Hello,<br />I&apos;m <span style={{ fontStyle: "italic" }}>Karen<span style={{ color: "var(--ka-accent-deep)" }}>.</span></span>
      </h1>
      <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--ka-muted)", maxWidth: 520 }}>{c.hero.subhead}</p>
    </section>
  );
}

export function ManifestoSection({ c }: { c: AboutContent }) {
  return (
    <section style={{ padding: "80px 64px", background: "var(--ka-bg-soft)" }}>
      <div className="ka-eyebrow" style={{ marginBottom: 32 }}>{c.manifesto.eyebrow}</div>
      <p style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(22px,2.5vw,34px)", fontStyle: "italic", lineHeight: 1.3, marginBottom: 32 }}>{c.manifesto.quote}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, paddingTop: 32, borderTop: "1px solid var(--ka-ink)" }}>
        <p style={{ fontSize: 16, lineHeight: 1.75, color: "var(--ka-ink)" }}>{c.manifesto.para1}</p>
        <p style={{ fontSize: 16, lineHeight: 1.75, color: "var(--ka-ink)" }}>{c.manifesto.para2}</p>
      </div>
    </section>
  );
}

export function BioSection({ c }: { c: AboutContent }) {
  return (
    <section style={{ padding: "80px 64px", borderTop: "1px solid var(--ka-line)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 80, alignItems: "start" }}>
        <div>
          <img src={c.bio.portraitUrl} alt="Karen Alexandra" style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block" }} />
          <p style={{ fontFamily: "var(--ka-display)", fontStyle: "italic", fontSize: 20, lineHeight: 1.35, marginTop: 24 }}>{c.bio.tagline}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <p style={{ fontSize: 18, lineHeight: 1.75 }}>{c.bio.para1}</p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--ka-muted)" }}>{c.bio.para2}</p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--ka-muted)" }}>{c.bio.para3}</p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--ka-muted)" }}>{c.bio.para4}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 16, paddingTop: 32, borderTop: "1px solid var(--ka-ink)" }}>
            {c.bio.facts.map((f, i) => (
              <div key={i}>
                <div className="ka-eyebrow" style={{ marginBottom: 4, fontSize: 10 }}>{f.label}</div>
                <div style={{ fontFamily: "var(--ka-display)", fontSize: 15 }}>{f.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function MapSection() {
  return (
    <section style={{ padding: "80px 64px", background: "var(--ka-bg-soft)", borderTop: "1px solid var(--ka-line)" }}>
      <div className="ka-eyebrow" style={{ marginBottom: 24 }}>N° 03 — A world-citizen, in order</div>
      <div style={{ padding: "48px 32px", border: "1px solid var(--ka-line)", textAlign: "center", color: "var(--ka-muted)", fontFamily: "var(--ka-display)", fontStyle: "italic", fontSize: 18 }}>
        Interactive world map — rendered live on the page
      </div>
    </section>
  );
}

export function JoysSection({ c }: { c: AboutContent }) {
  return (
    <section style={{ padding: "80px 64px", borderTop: "1px solid var(--ka-line)" }}>
      <div className="ka-eyebrow" style={{ marginBottom: 48 }}>N° 04 — A short list of joys</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
        {c.joys.map((j, i) => (
          <div key={i} style={{ padding: "32px 20px 40px", borderRight: "1px solid var(--ka-line)", borderBottom: "1px solid var(--ka-line)" }}>
            <div className="ka-eyebrow" style={{ color: "var(--ka-accent-deep)", marginBottom: 12 }}>N° {j.n}</div>
            <div style={{ fontFamily: "var(--ka-display)", fontSize: 22, fontStyle: i % 2 ? "italic" : "normal", marginBottom: 12 }}>{j.title}</div>
            <div style={{ fontFamily: "var(--ka-display)", fontStyle: "italic", fontSize: 14, color: "var(--ka-muted)" }}>{j.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CtaSection({ c }: { c: AboutContent }) {
  return (
    <section style={{ padding: "80px 64px", background: "var(--ka-ink)", color: "var(--ka-bg)", textAlign: "center" }}>
      <h2 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(32px,5vw,72px)", fontStyle: "italic", lineHeight: 1, maxWidth: 1000, margin: "0 auto 32px" }}>
        {c.cta.headline}
      </h2>
      <p style={{ color: "rgba(250,247,242,0.7)", maxWidth: 520, margin: "0 auto", fontSize: 16, lineHeight: 1.7 }}>{c.cta.subhead}</p>
    </section>
  );
}

export function buildAboutSectionMap(c: AboutContent): Record<string, ReactNode> {
  return {
    "hero":      <HeroSection c={c} />,
    "manifesto": <ManifestoSection c={c} />,
    "bio":       <BioSection c={c} />,
    "map":       <MapSection />,
    "joys":      <JoysSection c={c} />,
    "cta":       <CtaSection c={c} />,
  };
}
