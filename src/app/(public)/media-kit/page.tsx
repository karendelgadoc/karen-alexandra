import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllBlogPosts } from "@/lib/blog-db";
import { getLatestVideos } from "@/lib/youtube";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Media Kit — Karen Alexandra",
  description:
    "A small, considered audience. Karen Alexandra — luxury fashion e-commerce lead and lifestyle correspondent. For press and brand partners.",
};

const MK_REACH = [
  { v: "248K",  l: "Substack & email" },
  { v: "186K",  l: "Instagram · @karenalex" },
  { v: "94K",   l: "YouTube · The Reel" },
  { v: "12.4M", l: "Monthly impressions" },
];

const MK_DEMO = [
  { label: "Women, 28–45",    pct: 78 },
  { label: "US · UK · EU",   pct: 84 },
  { label: "Avg. HHI > $180K", pct: 71 },
  { label: "Returning readers", pct: 62 },
];

const MK_PARTNERS = [
  "FOUR SEASONS", "AMAN", "LOEWE", "MYTHERESA", "DIOR",
  "AESOP", "LE LABO", "JACQUEMUS", "BERGDORF", "HERMÈS",
  "GLENT SHOES", "THE ROW", "GOOP", "NET-A-PORTER", "MARGIELA",
];

const MK_PRESS = [
  { p: "Vogue Business",       q: "Rewriting the playbook for independent luxury labels.",                  d: "Apr 2026" },
  { p: "Business of Fashion",  q: "The editor brands actually want to be read by.",                         d: "Feb 2026" },
  { p: "Condé Nast Traveler",  q: "On the rituals of arrival, and the case for the courtyard room.",        d: "Jan 2026" },
  { p: "Harper's Bazaar",      q: "The slow wardrobe finds its most articulate voice.",                     d: "Nov 2025" },
];

const MK_TESTIMONIALS = [
  { q: "Karen provides feel good content from all over the spectrum — whether it's a business hack, mindset tip, travel inspiration, or design. She knows how to capture an audience by being raw and providing insight we all love to hear.", who: "@alexmcguire · Community member" },
  { q: "She shows up all the time and I can really relate to what she's going through and the adventures she's choosing. She is not acting for the camera — she's really sharing her journey.", who: "@elizabethmanette · Community member" },
  { q: "She has a 'real girl in the real world' vibe, hustling to bring her dreams to fruition in true, understandable and attainable ways.", who: "@deannanfox · Community member" },
];

const MK_SAMPLES = [
  { type: "Long-form letter",  title: "On the slow wardrobe — why I'm only buying one bag this year.", meta: "Substack · 121K reads"    },
  { type: "Film",              title: "Forty-eight hours at the Four Seasons George V.",                meta: "YouTube · 82K views · 14m" },
  { type: "Instagram series",  title: "Spring capsule — twelve pieces, in order of importance.",       meta: "IG carousel · 64K saves"   },
  { type: "Editorial film",    title: "A weekend at Aman Venice — what to pack, what to skip.",        meta: "YouTube · 68K views"       },
];

export default async function MediaKitPage() {
  const [blogPosts, videos] = await Promise.all([
    getAllBlogPosts().catch(() => []),
    getLatestVideos(2).catch(() => []),
  ]);
  const recentPosts = blogPosts.slice(0, 2);
  const recentVideos = videos.slice(0, 2);

  return (
    <>
      {/* Hero */}
      <section style={{ padding: "clamp(56px,8vw,100px) clamp(20px,5vw,64px) clamp(48px,6vw,80px)", borderBottom: "1px solid var(--ka-ink)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "clamp(32px,5vw,64px)", flexWrap: "wrap", gap: 12 }}>
          <div className="ka-eyebrow">Media Kit · Updated May MMXXVI</div>
          <div className="ka-eyebrow">For press &amp; partners</div>
        </div>
        <div className="ka-mk-hero-grid">
          <h1 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(56px,10vw,140px)", fontWeight: 300, lineHeight: 0.94 }}>
            A small,<br />
            <span style={{ fontStyle: "italic" }}>considered<span style={{ color: "var(--ka-accent-deep)" }}>.</span></span><br />
            audience.
          </h1>
          <div style={{ alignSelf: "end", maxWidth: 400 }}>
            <p style={{ fontSize: "clamp(14px,1.2vw,17px)", lineHeight: 1.7, color: "var(--ka-ink)", marginBottom: 32 }}>
              Karen Alexandra is a luxury fashion e-commerce lead and lifestyle
              correspondent. Read by a quietly compounding audience that prefers
              fewer letters, deeper.
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

      {/* Bio + Portrait */}
      <section className="ka-mk-bio-section" style={{ padding: "clamp(48px,8vw,120px) clamp(20px,5vw,64px)", background: "var(--ka-bg-soft)" }}>
        <img
          src="https://5xkq5mmr.us-east.insforge.app/api/storage/buckets/blog-images/objects/site%2FIMG_4534.jpg"
          alt="Karen Alexandra"
          style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block" }}
        />
        <div>
          <div className="ka-eyebrow" style={{ marginBottom: 32 }}>N° 01 — Bio, in brief</div>
          <h2 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(28px,4vw,56px)", fontStyle: "italic", lineHeight: 1.05 }}>
            A decade in luxury commerce.<br />An ongoing correspondence on the rest.
          </h2>
          <p style={{ fontFamily: "var(--ka-display)", fontStyle: "italic", fontSize: "clamp(16px,1.5vw,22px)", lineHeight: 1.5, color: "var(--ka-ink)", marginTop: 32 }}>
            Karen Alexandra is the Head of E-commerce at Glent Shoes, an editorial
            correspondent for Four Seasons, and the editor of The Saturday Letter —
            a weekly dispatch on luxury fashion, considered travel, and the rituals
            that hold a beautiful life together.
          </p>
          <div className="ka-mk-bio-facts" style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--ka-ink)" }}>
            {[
              ["Based",        "New York", "· Côte d'Azur"],
              ["Languages",    "EN · FR · IT", ""],
              ["Working with", "Houses, hotels, atéliers.", ""],
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

      {/* Reach */}
      <section style={{ padding: "clamp(48px,8vw,120px) clamp(20px,5vw,64px)", borderBottom: "1px solid var(--ka-line)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 32, marginBottom: 48, borderBottom: "1px solid var(--ka-ink)", flexWrap: "wrap", gap: 12 }}>
          <div className="ka-eyebrow">N° 02 — The audience</div>
          <a href="mailto:press@karenalexandra.com" className="ka-arrow-link" style={{ fontSize: 10 }}>Full deck on request <span className="ka-arrow">→</span></a>
        </div>
        <div className="ka-mk-reach-grid">
          {MK_REACH.map((s, i) => (
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
            {MK_DEMO.map((d, i) => (
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

      {/* Partners */}
      <section style={{ padding: "clamp(48px,8vw,120px) clamp(20px,5vw,64px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 32, marginBottom: 48, borderBottom: "1px solid var(--ka-ink)", flexWrap: "wrap", gap: 12 }}>
          <div className="ka-eyebrow">N° 03 — Selected partnerships</div>
          <a href="mailto:press@karenalexandra.com" className="ka-arrow-link" style={{ fontSize: 10 }}>Full client list on request <span className="ka-arrow">→</span></a>
        </div>
        <div className="ka-mk-partner-grid">
          {MK_PARTNERS.map((p, i) => (
            <div key={i} className="ka-mk-partner-cell">{p}</div>
          ))}
        </div>
      </section>

      {/* Press */}
      <section style={{ padding: "clamp(48px,8vw,120px) clamp(20px,5vw,64px)", background: "var(--ka-bg-soft)", borderTop: "1px solid var(--ka-line)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 32, marginBottom: 48, borderBottom: "1px solid var(--ka-ink)", flexWrap: "wrap", gap: 12 }}>
          <div className="ka-eyebrow">N° 04 — In the press</div>
          <a href="#" className="ka-arrow-link" style={{ fontSize: 10 }}>Full press archive <span className="ka-arrow">→</span></a>
        </div>
        <div className="ka-mk-press-grid">
          {MK_PRESS.map((p, i) => (
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

      {/* Testimonials */}
      <section style={{ padding: "clamp(56px,10vw,140px) clamp(20px,5vw,64px)", textAlign: "center", borderTop: "1px solid var(--ka-line)" }}>
        <div className="ka-eyebrow" style={{ marginBottom: 48 }}>N° 05 — The community, on the work</div>
        <div className="ka-mk-testimonials-grid">
          {MK_TESTIMONIALS.map((t, i) => (
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

      {/* Instagram grid */}
      <section style={{ padding: "clamp(48px,8vw,120px) clamp(20px,5vw,64px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 56, paddingBottom: 24, borderBottom: "1px solid var(--ka-ink)", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div className="ka-eyebrow" style={{ marginBottom: 12 }}>N° 07 — On Instagram</div>
            <h2 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(28px,4vw,56px)", fontStyle: "italic" }}>@karenalexandra</h2>
            <div style={{ fontFamily: "var(--ka-display)", fontStyle: "italic", color: "var(--ka-muted)", fontSize: "clamp(15px,1.5vw,20px)", marginTop: 12 }}>
              186K followers · 9.2% avg. engagement
            </div>
          </div>
          <a href="https://instagram.com/karenalexandra" target="_blank" rel="noopener noreferrer" className="ka-arrow-link">
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

      {/* Download CTA */}
      <section style={{ padding: "clamp(56px,10vw,140px) clamp(20px,5vw,64px)", background: "var(--ka-ink)", color: "var(--ka-bg)" }}>
        <div className="ka-mk-cta-grid">
          <div>
            <div className="ka-eyebrow" style={{ color: "rgba(250,247,242,0.5)", marginBottom: 24 }}>Press · Partnership inquiries</div>
            <h2 style={{ fontFamily: "var(--ka-display)", color: "var(--ka-bg)", fontSize: "clamp(44px,6vw,88px)", fontStyle: "italic", lineHeight: 1 }}>
              Take the kit<br />with you.
            </h2>
            <p style={{ color: "rgba(250,247,242,0.7)", maxWidth: 480, marginTop: 24, fontSize: "clamp(14px,1.2vw,16px)", lineHeight: 1.7 }}>
              Twenty-page PDF with audience demographics, partnership formats, sample
              deliverables, and rate ranges. Updated quarterly.
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
    </>
  );
}
