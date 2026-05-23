import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services — Karen Alexandra",
  description:
    "Four ways to begin a correspondence. Selectively-offered engagements for fashion houses, hospitality groups, and independent labels.",
};

const SV_SERVICES = [
  {
    n: "I",
    title: "E-commerce strategy",
    italic: false,
    tag: "Most-requested · 3–6 mo engagement",
    summary: "Direct storefront positioning, merchandising calendars, season-launch playbooks, marketplace expansion — the work that compounds past the first quarter.",
    deliverables: ["Storefront audit & repositioning", "Twelve-month merchandising calendar", "Audience & retention plan", "Quarterly review"],
    proofStat: "+218%",
    proofNote: "Return-customer rate",
    proofCase: "Glent Shoes",
    proofSlug: "case-study-little-black-shell",
  },
  {
    n: "II",
    title: "Brand & creative direction",
    italic: true,
    tag: "Campaign or season-led",
    summary: "Editorial direction for campaigns, lookbooks, and shoppable storytelling — bridging the buying floor and the masthead. Bias toward fewer, better assets.",
    deliverables: ["Creative brief & mood", "Cast, location, photographer shortlist", "Edit & sequence", "Rollout calendar"],
    proofStat: "47",
    proofNote: "Properties profiled · ongoing",
    proofCase: "Four Seasons × KA",
    proofSlug: "case-studies",
  },
  {
    n: "III",
    title: "Editorial partnerships",
    italic: false,
    tag: "Ongoing · 12 mo minimum",
    summary: "A long-form correspondence between the brand and the Journal — Substack letters, films, and quietly-shoppable storytelling. The opposite of an activation.",
    deliverables: ["Annual editorial calendar", "Eight to twelve long-form pieces", "Two short films per year", "Distribution across owned + earned"],
    proofStat: "3.2×",
    proofNote: "Direct-bookings via editorial",
    proofCase: "Aman Resorts",
    proofSlug: "case-studies",
  },
  {
    n: "IV",
    title: "Audience & growth advisory",
    italic: true,
    tag: "Project-based · 6–8 weeks",
    summary: "An audience map and a written rollout — paid + organic, with a heavy hand for retention. For teams that already know the funnel matters and want it written down.",
    deliverables: ["Audience segmentation map", "CRM & email overhaul", "Channel matrix & cadence", "Measurement framework"],
    proofStat: "+62%",
    proofNote: "Engaged time on campaign hub",
    proofCase: "Loewe",
    proofSlug: "case-studies",
  },
];

const SV_PROCESS = [
  { num: "01", title: "A first letter",   when: "Week 0",     note: "You write. I respond within five business days. If there's a fit, we put a thirty-minute call on the calendar." },
  { num: "02", title: "Brief & proposal", when: "Week 1",     note: "I send a short proposal — scope, deliverables, fee, calendar. Two iterations included." },
  { num: "03", title: "Discovery",        when: "Weeks 2–3",  note: "Two weeks reading everything — your site, your last twelve months of communications, the rooms you're not in." },
  { num: "04", title: "The work",         when: "Weeks 3–N",  note: "Weekly written notes, fortnightly working sessions, and a single end-of-engagement document you can hand to anyone." },
  { num: "05", title: "Close & handover", when: "Final week", note: "A written handover, two months of after-care, and an open door." },
];

const SV_CASE_LINKS = [
  { brand: "Glent Shoes",       title: "Building a direct storefront from zero",   stat: "+218%", sub: "Return-customer rate",     slug: "case-study-little-black-shell" },
  { brand: "Aman Resorts",      title: "A whisper-quiet content strategy",          stat: "3.2×",  sub: "Direct-bookings via editorial", slug: "case-studies" },
  { brand: "Four Seasons × KA", title: "An ongoing editorial correspondence",       stat: "47",    sub: "Properties profiled",      slug: "case-studies" },
];

const SV_TESTIMONIALS = [
  { q: "Karen reshaped how we thought about our direct storefront for the next three years — slowly, with conviction.",             who: "— Founder, Glent Shoes" },
  { q: "The rare voice brands actually want to be edited by. Sharper, slower, entirely her own.",                                   who: "— Communications Director, Aman Resorts" },
  { q: "Six months later, we still reach for the document she left us. It reads like a thesis on the brand.",                       who: "— VP Marketing, an independent house" },
];

const SV_FAQ = [
  { q: "How do you decide who to take on?",        a: "I look at three things: a real product (or experience), a team that respects the long arc of brand work, and a calendar that lets the work breathe. I take on a maximum of four engagements at a time." },
  { q: "What does an engagement typically cost?",  a: "Project work begins at a five-figure retainer. Long-form editorial partnerships are scoped annually. Detailed ranges are in the media kit, and exact figures live in the proposal." },
  { q: "Can you work with us in-house?",           a: "Selectively — and always under a written scope. I can sit with a team for a week per month for the length of a season. I don't take full-time roles." },
  { q: "Do you offer one-off consults?",           a: "Yes — a single three-hour working session, with a written brief in advance and a follow-up document. Limited slots most quarters." },
  { q: "What's your minimum engagement length?",  a: "Six weeks for advisory, three months for strategy, twelve months for editorial partnerships. Shorter than that and the work doesn't compound." },
  { q: "How does this work with my existing team?", a: "I write for your team, not over them. The end-of-engagement document is designed to be handed off and lived with after I'm gone." },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ padding: "clamp(56px,8vw,120px) clamp(20px,5vw,64px) clamp(40px,6vw,80px)", borderBottom: "1px solid var(--ka-line)" }}>
        <div className="ka-eyebrow" style={{ marginBottom: "clamp(32px,4vw,56px)" }}>Services · The studio · MMXXVI</div>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "clamp(24px,5vw,80px)", alignItems: "end" }}>
          <h1 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(48px,9vw,132px)", fontWeight: 300, lineHeight: 0.96 }}>
            Four ways to<br />
            <span style={{ fontStyle: "italic" }}>begin a correspondence</span><span style={{ color: "var(--ka-accent-deep)" }}>.</span>
          </h1>
          <p style={{ fontSize: "clamp(14px,1.2vw,17px)", lineHeight: 1.7, color: "var(--ka-ink)", maxWidth: 420, alignSelf: "end" }}>
            Selectively-offered engagements for fashion houses, hospitality groups,
            and independent labels. Long-form by design — typically a season or more.
          </p>
        </div>
      </section>

      {/* Principle strip */}
      <section style={{ padding: "clamp(24px,3.5vw,48px) clamp(20px,5vw,64px)", borderBottom: "1px solid var(--ka-line)", background: "var(--ka-bg-soft)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "clamp(24px,4vw,64px)", alignItems: "center" }}>
          <span className="ka-eyebrow" style={{ color: "var(--ka-accent-deep)" }}>How the studio operates</span>
          <p style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(17px,2vw,26px)", fontStyle: "italic", lineHeight: 1.4 }}>
            Four engagements, taken on at a time. No discovery calls before a written brief. One thesis per project, repeated until it&apos;s true.
          </p>
          <Link href="/contact" className="ka-arrow-link">The studio principles <span className="ka-arrow">→</span></Link>
        </div>
      </section>

      {/* Service cards */}
      <section style={{ padding: "clamp(48px,8vw,120px) clamp(20px,5vw,64px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 32, marginBottom: 0, borderBottom: "1px solid var(--ka-ink)", flexWrap: "wrap", gap: 12 }}>
          <div className="ka-eyebrow">N° 01 — The engagements</div>
          <Link href="/contact" className="ka-arrow-link" style={{ fontSize: 10 }}>Or send a brief <span className="ka-arrow">→</span></Link>
        </div>
        {SV_SERVICES.map((s, i) => (
          <article key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 1fr", gap: "clamp(24px,4vw,64px)", padding: "clamp(32px,5vw,56px) 0", borderTop: i === 0 ? "none" : "1px solid var(--ka-ink)", borderBottom: "1px solid var(--ka-ink)" }}>
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

      {/* Process */}
      <section style={{ padding: "clamp(48px,8vw,120px) clamp(20px,5vw,64px)", background: "var(--ka-bg-soft)", borderTop: "1px solid var(--ka-line)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 32, marginBottom: 48, borderBottom: "1px solid var(--ka-ink)", flexWrap: "wrap", gap: 12 }}>
          <div className="ka-eyebrow">N° 02 — How the work begins</div>
          <Link href="/contact" className="ka-arrow-link" style={{ fontSize: 10 }}>A first letter <span className="ka-arrow">→</span></Link>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", top: 12, left: "9%", right: "9%", height: 1, background: "var(--ka-ink)", opacity: 0.4 }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 32, position: "relative" }}>
            {SV_PROCESS.map((p, i) => (
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

      {/* Case links */}
      <section style={{ padding: "clamp(48px,8vw,120px) clamp(20px,5vw,64px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 32, marginBottom: 48, borderBottom: "1px solid var(--ka-ink)", flexWrap: "wrap", gap: 12 }}>
          <div className="ka-eyebrow">N° 03 — Recent engagements, in depth</div>
          <Link href="/case-studies" className="ka-arrow-link" style={{ fontSize: 10 }}>All case studies <span className="ka-arrow">→</span></Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 48 }}>
          {SV_CASE_LINKS.map((c, i) => (
            <Link key={i} href={`/case-studies/${c.slug}`} style={{ display: "block", textDecoration: "none", color: "inherit", paddingTop: 32, borderTop: "1px solid var(--ka-ink)" }}>
              <div className="ka-img" style={{ aspectRatio: "4/5", marginBottom: 28 }}>
                <span className="ka-img-label">{c.brand}</span>
              </div>
              <div className="ka-eyebrow">{c.brand}</div>
              <h3 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(18px,2.5vw,30px)", fontStyle: i % 2 ? "italic" : "normal", lineHeight: 1.15, marginTop: 14 }}>
                {c.title}
              </h3>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--ka-line)" }}>
                <div>
                  <div style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(24px,3vw,36px)", fontStyle: "italic", color: "var(--ka-accent-deep)", lineHeight: 1 }}>{c.stat}</div>
                  <div className="ka-eyebrow" style={{ marginTop: 8 }}>{c.sub}</div>
                </div>
                <span className="ka-eyebrow">Read →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "clamp(56px,10vw,140px) clamp(20px,5vw,64px)", borderTop: "1px solid var(--ka-line)", background: "var(--ka-ink)", color: "var(--ka-bg)" }}>
        <div className="ka-eyebrow" style={{ color: "rgba(250,247,242,0.5)", textAlign: "center", marginBottom: 80 }}>
          N° 04 — On the work
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "clamp(24px,4vw,56px)" }}>
          {SV_TESTIMONIALS.map((t, i) => (
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

      {/* FAQ */}
      <section style={{ padding: "clamp(48px,8vw,120px) clamp(20px,5vw,64px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 32, marginBottom: 32, borderBottom: "1px solid var(--ka-ink)", flexWrap: "wrap", gap: 12 }}>
          <div className="ka-eyebrow">N° 05 — Asked, before now</div>
          <Link href="/contact" className="ka-arrow-link" style={{ fontSize: 10 }}>Or write directly <span className="ka-arrow">→</span></Link>
        </div>
        {SV_FAQ.map((item, i) => (
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

      {/* CTA */}
      <section style={{ padding: "clamp(56px,10vw,140px) clamp(20px,5vw,64px)", textAlign: "center", borderTop: "1px solid var(--ka-line)" }}>
        <div className="ka-eyebrow">Inquiries</div>
        <h2 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(40px,7vw,96px)", fontStyle: "italic", margin: "32px auto 24px", maxWidth: 1100, lineHeight: 1 }}>
          Begin with a letter.
        </h2>
        <p style={{ color: "var(--ka-muted)", maxWidth: 540, margin: "0 auto 48px", fontSize: "clamp(14px,1.2vw,16px)", lineHeight: 1.7 }}>
          Brief responses within five business days. The contact form leads to a written exchange —
          there are no booking links here, by design.
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
    </>
  );
}
