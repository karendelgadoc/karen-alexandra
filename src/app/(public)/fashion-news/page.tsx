import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fashion News — Karen Alexandra",
  description:
    "The week in fashion — read slowly. Runway notes, designer correspondence, and the quieter dispatches the trade press tends to skip.",
};

const FN_LATEST = [
  { tag: "Runway",   time: "2h",  title: "Loewe sends only 12 looks. The whisper is louder than ever." },
  { tag: "Drops",    time: "5h",  title: "Phoebe Philo's third release is now live — and nearly sold through." },
  { tag: "Couture",  time: "8h",  title: "On Schiaparelli's restraint, and a thesis I keep returning to." },
  { tag: "Street",   time: "11h", title: "The Milan crowd is wearing flats again. Read into it." },
  { tag: "Critique", time: "14h", title: "The case against the 'micro-trend' as a category of thinking." },
  { tag: "Industry", time: "1d",  title: "What the LVMH numbers don't say about the slow consumer." },
];

const FN_FEATURE = {
  cat: "The Big Read · Couture Week",
  title: "The silence at Schiaparelli — and why I think it's the year's most important room.",
  dek: "Daniel Roseberry sent thirty-two looks down a runway flanked entirely by mirrors. There were no influencers in the front row. No phones. Three minutes of quiet between sets. A correspondence on what that meant — and what it's signalling about the next two years in fashion.",
  byline: "By Karen Alexandra",
  read: "12 min read",
  date: "May 22",
};

const FN_SECONDARY = [
  { tag: "Designer", title: "Pierpaolo's last bow — what we'll miss most.", read: "8 min" },
  { tag: "Houses",   title: "The Row's quietest archive year is also its loudest statement.", read: "6 min" },
  { tag: "Beauty",   title: "Why the 'no-fragrance' campaign at Aesop is a feat of editing.", read: "5 min" },
];

const FN_TAGS = ["All news", "Runway", "Couture Week", "Street Style", "Drops", "Designer", "Critique", "Houses", "Beauty", "Industry"];

const FN_CALENDAR = [
  { d: "MON 26", e: "Schiaparelli Couture",   loc: "Paris",    type: "Show",  cur: false },
  { d: "TUE 27", e: "Phoebe Philo C03 drop",  loc: "Online",   type: "Drop",  cur: true  },
  { d: "WED 28", e: "Margiela Artisanal",      loc: "Paris",    type: "Show",  cur: false },
  { d: "THU 29", e: "The Row resort preview",  loc: "New York", type: "Press", cur: false },
  { d: "FRI 30", e: "Hermès leather AW story", loc: "Milan",    type: "Story", cur: false },
  { d: "SAT 31", e: "Cocoa Brown × KA letter", loc: "Substack", type: "Issue", cur: false },
  { d: "SUN 01", e: "Loewe pre-fall lookbook", loc: "Madrid",   type: "Book",  cur: false },
];

const FN_GRID_POSTS = [
  { tag: "Critique",  title: "On the front row's quiet retreat from the phone.",                   excerpt: "Three weeks of shows watched from front, side, and standing — a small case study on attention as the new luxury.", read: "9 min",  date: "May 20" },
  { tag: "Runway",    title: "Twelve looks at Loewe — read in the order shown.",                   excerpt: "An annotated reading of Jonathan Anderson's most disciplined show to date.",                                             read: "7 min",  date: "May 18" },
  { tag: "Drops",     title: "Phoebe, again — and the new shape of restraint.",                    excerpt: "A note from inside the C03 release, plus the one piece I waited an hour to add to cart.",                             read: "5 min",  date: "May 16" },
  { tag: "Industry",  title: "The numbers behind 'quiet luxury' — and what they're hiding.",        excerpt: "A short, opinionated reading of the most recent earnings cycle for the houses that matter.",                         read: "11 min", date: "May 14" },
  { tag: "Street",    title: "Milan, in flats. A small revolution.",                                excerpt: "Five days of careful watching outside the shows — what's changed, what's quietly worth borrowing.",                 read: "6 min",  date: "May 12" },
  { tag: "Houses",    title: "The Row's quietest archive year is also its loudest statement.",      excerpt: "On the Olsen project's discipline, and why the absent collection still feels like the season's most-watched.",       read: "8 min",  date: "May 10" },
  { tag: "Designer",  title: "Pierpaolo's last bow — the chapter the press release didn't write.",  excerpt: "A long correspondence with the Valentino atelier on the closing of a thirty-five-year correspondence with the house.", read: "13 min", date: "May 7"  },
];

const FN_MOST_READ = [
  "The case against the 'micro-trend' as a category of thinking.",
  "Why I'm only buying one bag this year — and which one.",
  "On the small theatres of an ordinary morning at Paris fashion week.",
  "A field guide to spring tailoring — six pieces, in order of importance.",
  "The Loewe whisper, decoded — twelve looks, read in the order shown.",
];

export default function FashionNewsPage() {
  return (
    <>
      {/* Date bar */}
      <div className="ka-fn-date-bar" style={{ padding: "10px clamp(20px,5vw,64px)" }}>
        <span>Vol. I — Issue N° 22</span>
        <span>Updated daily · Saturday 23 May MMXXVI</span>
        <span style={{ color: "var(--ka-accent-deep)" }}>● Live — Couture Week, Paris</span>
      </div>

      {/* Hero */}
      <section style={{ padding: "56px clamp(20px,5vw,64px) 24px" }}>
        <div className="ka-eyebrow" style={{ marginBottom: 28, color: "var(--ka-accent-deep)" }}>
          Fashion News · MMXXVI
        </div>
        <div className="ka-fn-hero-grid">
          <h1 className="ka-fn-hero-headline">
            Fashion<br />
            <span style={{ fontStyle: "italic" }}>
              News<span style={{ color: "var(--ka-accent-deep)" }}>.</span>
            </span>
          </h1>
          <p style={{ fontSize: "clamp(14px,1.2vw,16px)", lineHeight: 1.7, color: "var(--ka-ink)", maxWidth: 420, alignSelf: "end" }}>
            The week in fashion — read slowly. Runway notes, designer correspondence,
            and the quieter dispatches the trade press tends to skip. Filed by Karen Alexandra.
          </p>
        </div>
      </section>

      {/* Top 3-col grid */}
      <section style={{ padding: "32px clamp(20px,5vw,64px) clamp(48px,6vw,96px)", borderBottom: "1px solid var(--ka-ink)" }}>
        <div className="ka-fn-top-grid">
          {/* Latest dispatches */}
          <div className="ka-fn-top-col" style={{ borderTop: "1px solid var(--ka-ink)", paddingTop: 20, borderRight: "1px solid var(--ka-line)" }}>
            <div className="ka-eyebrow" style={{ marginBottom: 24, color: "var(--ka-accent-deep)" }}>● Latest dispatches</div>
            {FN_LATEST.map((it, i) => (
              <a key={i} href="#" style={{ display: "block", padding: "18px 0", borderBottom: i < FN_LATEST.length - 1 ? "1px solid var(--ka-line)" : "none", textDecoration: "none", color: "inherit" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ka-muted)", marginBottom: 8 }}>
                  <span style={{ color: "var(--ka-accent-deep)" }}>{it.tag}</span>
                  <span>{it.time} ago</span>
                </div>
                <h4 style={{ fontFamily: "var(--ka-display)", fontSize: 18, lineHeight: 1.3, fontStyle: i % 2 ? "normal" : "italic" }}>{it.title}</h4>
              </a>
            ))}
          </div>

          {/* Feature */}
          <div className="ka-fn-top-col">
            <div className="ka-img" style={{ aspectRatio: "4/3", width: "100%" }}>
              <span className="ka-img-label">Feature · Schiaparelli mirror room</span>
            </div>
            <div className="ka-eyebrow" style={{ marginTop: 28, color: "var(--ka-accent-deep)" }}>{FN_FEATURE.cat}</div>
            <h2 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(28px,3.5vw,56px)", fontStyle: "italic", lineHeight: 1.04, marginTop: 16 }}>
              {FN_FEATURE.title}
            </h2>
            <p style={{ fontFamily: "var(--ka-display)", fontStyle: "italic", fontSize: "clamp(16px,1.5vw,22px)", lineHeight: 1.45, color: "var(--ka-ink)", marginTop: 24 }}>
              {FN_FEATURE.dek}
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 32, paddingTop: 20, borderTop: "1px solid var(--ka-line)" }}>
              <span className="ka-eyebrow">{FN_FEATURE.byline}</span>
              <span className="ka-eyebrow">{FN_FEATURE.date} · {FN_FEATURE.read}</span>
            </div>
          </div>

          {/* Secondary */}
          <div className="ka-fn-top-col" style={{ borderTop: "1px solid var(--ka-ink)", paddingTop: 20, display: "flex", flexDirection: "column", gap: 36 }}>
            <div className="ka-eyebrow" style={{ color: "var(--ka-accent-deep)" }}>Also this week</div>
            {FN_SECONDARY.map((it, i) => (
              <a key={i} href="#" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                <div className="ka-img" style={{ aspectRatio: "4/3", width: "100%" }}>
                  <span className="ka-img-label">{it.tag}</span>
                </div>
                <div className="ka-eyebrow" style={{ marginTop: 14, color: "var(--ka-accent-deep)" }}>{it.tag} · {it.read}</div>
                <h4 style={{ fontFamily: "var(--ka-display)", fontSize: 22, lineHeight: 1.25, marginTop: 8, fontStyle: i % 2 ? "italic" : "normal" }}>
                  {it.title}
                </h4>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Tags row */}
      <section style={{ padding: "20px clamp(20px,5vw,64px)", borderBottom: "1px solid var(--ka-line)", display: "flex", alignItems: "center", gap: 20, overflowX: "auto" }}>
        <span className="ka-eyebrow" style={{ flex: "0 0 auto" }}>Read by topic →</span>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {FN_TAGS.map((t, i) => (
            <button key={i} className={`ka-tag${i === 0 ? " ka-tag-active" : ""}`} style={{ fontSize: 9, padding: "5px 12px" }}>
              {t}
            </button>
          ))}
        </div>
      </section>

      {/* Calendar */}
      <section style={{ padding: "clamp(48px,7vw,96px) clamp(20px,5vw,64px)", borderBottom: "1px solid var(--ka-line)", background: "var(--ka-bg-soft)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 56, paddingBottom: 24, borderBottom: "1px solid var(--ka-ink)", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div className="ka-eyebrow" style={{ marginBottom: 16 }}>N° 02 — This week&apos;s calendar</div>
            <h2 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(28px,4vw,56px)", fontStyle: "italic" }}>
              Couture week, in seven dates.
            </h2>
          </div>
          <a href="#" className="ka-arrow-link">Full calendar <span className="ka-arrow">→</span></a>
        </div>
        <div className="ka-fn-calendar-grid">
          {FN_CALENDAR.map((d, i) => (
            <div
              key={i}
              className={`ka-fn-calendar-day${d.cur ? " today" : ""}`}
              style={{
                background: d.cur ? "var(--ka-ink)" : "var(--ka-bg)",
                color: d.cur ? "var(--ka-bg)" : "var(--ka-ink)",
                border: `1px solid ${d.cur ? "var(--ka-ink)" : "var(--ka-line)"}`,
                minHeight: "clamp(140px,15vw,200px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "clamp(14px,2vw,24px) clamp(8px,1.2vw,16px)",
                textAlign: "left",
              }}
            >
              <div>
                <div className="ka-eyebrow" style={{ color: d.cur ? "rgba(250,247,242,0.6)" : "var(--ka-muted)", fontSize: "clamp(8px,0.9vw,10px)" }}>
                  {d.d}
                </div>
                <h4 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(13px,1.5vw,20px)", lineHeight: 1.2, marginTop: 12, fontStyle: i % 2 ? "italic" : "normal", color: d.cur ? "var(--ka-bg)" : "var(--ka-ink)" }}>
                  {d.e}
                </h4>
              </div>
              <div className="ka-eyebrow" style={{ fontSize: "clamp(8px,0.8vw,10px)", color: d.cur ? "var(--ka-accent)" : "var(--ka-accent-deep)" }}>
                {d.type} · {d.loc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Long-form grid */}
      <section style={{ padding: "clamp(48px,8vw,120px) clamp(20px,5vw,64px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 32, marginBottom: 48, borderBottom: "1px solid var(--ka-ink)", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div className="ka-eyebrow" style={{ marginBottom: 8, color: "var(--ka-accent-deep)" }}>N° 03</div>
            <h2 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(28px,4vw,48px)", fontStyle: "italic" }}>The week, in long form.</h2>
          </div>
          <a href="#" className="ka-arrow-link">All fashion news <span className="ka-arrow">→</span></a>
        </div>
        <div>
          {FN_GRID_POSTS.map((p, i) => (
            <article key={i} className="ka-fn-long-article" style={{ padding: "clamp(28px,4vw,48px) 0", borderBottom: "1px solid var(--ka-line)" }}>
              <div>
                <div className="ka-card-meta" style={{ marginBottom: 12 }}>
                  <span style={{ color: "var(--ka-accent-deep)" }}>{p.tag}</span> · {p.date} · {p.read}
                </div>
                <h3 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(20px,2.5vw,34px)", fontStyle: i % 2 ? "italic" : "normal", lineHeight: 1.15 }}>
                  {p.title}
                </h3>
                <p style={{ color: "var(--ka-muted)", fontSize: 14, lineHeight: 1.7, marginTop: 12 }}>{p.excerpt}</p>
                <a href="#" className="ka-arrow-link" style={{ marginTop: 20, fontSize: 10, display: "inline-flex" }}>
                  Read <span className="ka-arrow">→</span>
                </a>
              </div>
              <div className="ka-img" style={{ aspectRatio: i % 2 ? "4/5" : "16/10" }}>
                <span className="ka-img-label">{p.tag} · {p.date}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Most Read */}
      <section style={{ padding: "clamp(48px,8vw,120px) clamp(20px,5vw,64px)", borderTop: "1px solid var(--ka-line)", background: "var(--ka-bg-soft)" }}>
        <div className="ka-fn-most-read-section">
          <div>
            <div className="ka-eyebrow" style={{ marginBottom: 24 }}>N° 04 — Karen&apos;s staff picks</div>
            <h2 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(32px,4vw,56px)", fontStyle: "italic", lineHeight: 1 }}>
              Most read, this season.
            </h2>
            <p style={{ fontFamily: "var(--ka-display)", fontStyle: "italic", fontSize: 18, color: "var(--ka-muted)", marginTop: 24, lineHeight: 1.5 }}>
              The five letters readers returned to — and the ones I&apos;d ask you to begin with.
            </p>
          </div>
          <div>
            {FN_MOST_READ.map((t, i) => (
              <a key={i} href="#" style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "clamp(16px,2.5vw,32px)", alignItems: "baseline", padding: "28px 0", borderTop: "1px solid var(--ka-ink)", textDecoration: "none", color: "inherit" }}>
                <span style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(36px,4vw,56px)", fontStyle: "italic", color: "var(--ka-accent-deep)", lineHeight: 1, minWidth: "clamp(40px,5vw,64px)" }}>
                  0{i + 1}
                </span>
                <h4 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(16px,1.8vw,26px)", fontStyle: i % 2 ? "italic" : "normal", lineHeight: 1.3 }}>
                  {t}
                </h4>
                <span className="ka-eyebrow">Read →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section style={{ padding: "clamp(48px,8vw,120px) clamp(20px,5vw,64px)", background: "var(--ka-ink)", color: "var(--ka-bg)", textAlign: "center" }}>
        <div className="ka-eyebrow" style={{ color: "rgba(250,247,242,0.6)" }}>The Friday Briefing</div>
        <h2 style={{ fontFamily: "var(--ka-display)", color: "var(--ka-bg)", fontSize: "clamp(28px,4vw,56px)", fontStyle: "italic", margin: "24px auto 16px", maxWidth: 900, lineHeight: 1.1 }}>
          The week in fashion, edited to seven minutes.
        </h2>
        <p style={{ color: "rgba(250,247,242,0.7)", maxWidth: 480, margin: "0 auto 32px", fontSize: 15, lineHeight: 1.7 }}>
          A separate dispatch from the Saturday Letter. Runway, drops, and the quiet shifts — every Friday at six.
        </p>
        <a
          href="https://karenalexandra.substack.com"
          target="_blank"
          rel="noopener noreferrer"
          className="ka-btn ka-btn-light"
        >
          Subscribe to the Friday Briefing →
        </a>
      </section>
    </>
  );
}
