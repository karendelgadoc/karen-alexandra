import React from "react";
import type { ReactNode } from "react";
import type { ContactContent } from "@/lib/page-content-db";

const INQUIRY_ITEMS = [
  { n: "I",   title: "Brand partnerships",     who: "Fashion houses, hospitality, beauty",   note: "Long-form collaborations — editorial campaigns, ambassadorship, residencies. Open for select houses.", email: "partnerships@karenalexandra.com" },
  { n: "II",  title: "Press & features",       who: "Editors, journalists, podcasters",      note: "Interview requests, contributing essays, comment for editorial. Press kit available on request.",       email: "press@karenalexandra.com" },
  { n: "III", title: "E-commerce consulting",  who: "Independent labels & growth teams",     note: "Strategy engagements for direct storefronts, merchandising rhythm, audience and retention work.",      email: "studio@karenalexandra.com" },
  { n: "IV",  title: "Speaking & moderating",  who: "Conferences, panels, boardrooms",       note: "Keynotes and conversations on the new luxury consumer, slow wardrobes, and editorial commerce.",     email: "speaking@karenalexandra.com" },
];

const FAQ_ITEMS = [
  { q: "What partnerships do you take on?",        a: "Long-form collaborations — typically a season or more — with houses and hospitality groups whose work I'd recommend without the brief. One-night activations and product seeding aren't a fit." },
  { q: "Do you accept gifted travel?",             a: "Selectively, and always disclosed. Editorial direction is mine; the property knows that before the booking is made." },
  { q: "How does the consulting work work?",       a: "Engagements are usually three or six months, anchored by a single deliverable — a storefront rebuild, a category launch, a season plan. References on request." },
  { q: "Can you speak at our event?",              a: "Yes, given enough notice and a question worth answering. I keep the calendar deliberately small." },
  { q: "What's the fastest way to reach you?",     a: "An email to the right inbox above. The form lands in the same place; either is fine. I don't take meetings before a first written exchange." },
];

const fieldStyle: React.CSSProperties = {
  width: "100%", background: "transparent", border: "none",
  borderBottom: "1px solid var(--ka-ink)", padding: "12px 0",
  fontFamily: "var(--ka-body)", fontSize: 17, color: "var(--ka-ink)", outline: "none",
};

export function HeroSection({ c }: { c: ContactContent }) {
  return (
    <section style={{ padding: "120px 64px 80px", borderBottom: "1px solid var(--ka-line)" }}>
      <div className="ka-eyebrow" style={{ marginBottom: 56 }}>{c.hero.eyebrow}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 80, alignItems: "end" }}>
        <h1 style={{ fontFamily: "var(--ka-display)", fontWeight: 400, fontSize: "clamp(56px, 9vw, 132px)", lineHeight: 0.96, letterSpacing: "-0.02em" }}>
          {c.hero.headlineLine1}
          <br />
          <span style={{ fontStyle: "italic" }}>{c.hero.headlineLine2}</span>
          <span style={{ color: "var(--ka-accent-deep)" }}>.</span>
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--ka-muted)", maxWidth: 400, justifySelf: "end", fontFamily: "var(--ka-body)" }}>{c.hero.subhead}</p>
      </div>
    </section>
  );
}

export function FormSection({ c }: { c: ContactContent }) {
  return (
    <>
      <section style={{ padding: "120px 64px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 64, borderBottom: "1px solid var(--ka-line)", paddingBottom: 24 }}>
          <div style={{ display: "flex", gap: 24, alignItems: "baseline" }}>
            <span style={{ fontFamily: "var(--ka-mono)", fontSize: 11, letterSpacing: "0.12em", color: "var(--ka-accent-deep)" }}>N° 01</span>
            <h2 style={{ fontFamily: "var(--ka-display)", fontWeight: 400, fontSize: 32, fontStyle: "italic" }}>What is this about?</h2>
          </div>
          <a href="mailto:studio@karenalexandra.com" className="ka-arrow-link">Or write directly <span className="ka-arrow">→</span></a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 64 }}>
          {INQUIRY_ITEMS.map((item, i) => (
            <div key={item.n} style={{ paddingTop: 32, borderTop: "1px solid var(--ka-ink)" }}>
              <div className="ka-eyebrow" style={{ marginBottom: 16 }}>N° {item.n} · {item.who}</div>
              <h3 style={{ fontFamily: "var(--ka-display)", fontWeight: 400, fontSize: 36, marginBottom: 16, fontStyle: i % 2 ? "italic" : "normal" }}>{item.title}</h3>
              <p style={{ color: "var(--ka-muted)", fontSize: 15, lineHeight: 1.7, maxWidth: 480, marginBottom: 24, fontFamily: "var(--ka-body)" }}>{item.note}</p>
              <a href={`mailto:${item.email}`} className="ka-arrow-link" style={{ fontSize: 11 }}>{item.email} <span className="ka-arrow">→</span></a>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "120px 64px", borderTop: "1px solid var(--ka-line)", background: "var(--ka-bg-soft)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 96, alignItems: "start" }}>
          <aside>
            <div className="ka-eyebrow" style={{ marginBottom: 32 }}>A note from Karen</div>
            <p style={{ fontFamily: "var(--ka-display)", fontSize: 30, lineHeight: 1.35, fontStyle: "italic", marginBottom: 32 }}>&ldquo;{c.sidebar.quote}&rdquo;</p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, paddingTop: 24, borderTop: "1px solid var(--ka-line)" }}>
              <div style={{ width: 40, height: 1, background: "var(--ka-ink)" }} />
              <div>
                <div style={{ fontFamily: "var(--ka-display)", fontSize: 18 }}>Karen Alexandra</div>
                <div className="ka-eyebrow" style={{ marginTop: 4 }}>Editor &amp; Founder</div>
              </div>
            </div>
            <div style={{ marginTop: 64, paddingTop: 32, borderTop: "1px solid var(--ka-line)" }}>
              <div className="ka-eyebrow" style={{ marginBottom: 16 }}>Studio</div>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--ka-muted)", fontFamily: "var(--ka-body)" }}>
                {c.sidebar.location}<br />
                {c.sidebar.availability}<br /><br />
                <span style={{ color: "var(--ka-ink)" }}>studio@karenalexandra.com</span><br />
                <span className="ka-eyebrow">{c.sidebar.responseNote}</span>
              </p>
            </div>
          </aside>

          <form method="POST" action="/api/contact" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px 48px" }}>
            <input type="text" name="_honeypot" tabIndex={-1} aria-hidden="true" style={{ display: "none" }} />
            <label style={{ display: "block" }}>
              <div className="ka-eyebrow" style={{ marginBottom: 12 }}>01 — Your name</div>
              <input name="name" type="text" placeholder="First and last" required style={fieldStyle} />
            </label>
            <label style={{ display: "block" }}>
              <div className="ka-eyebrow" style={{ marginBottom: 12 }}>02 — Email</div>
              <input name="email" type="email" placeholder="your@email.com" required style={fieldStyle} />
            </label>
            <label style={{ display: "block" }}>
              <div className="ka-eyebrow" style={{ marginBottom: 12 }}>03 — Brand / publication</div>
              <input name="brand" type="text" placeholder="Optional" style={fieldStyle} />
            </label>
            <label style={{ display: "block" }}>
              <div className="ka-eyebrow" style={{ marginBottom: 12 }}>04 — Inquiry type</div>
              <div style={{ position: "relative" }}>
                <select name="type" defaultValue="" style={{ ...fieldStyle, appearance: "none", borderRadius: 0 }}>
                  <option value="" disabled>Select an inquiry type —</option>
                  <option value="Brand partnership">Brand partnership</option>
                  <option value="Press or feature">Press or feature</option>
                  <option value="E-commerce consulting">E-commerce consulting</option>
                  <option value="Speaking or moderating">Speaking or moderating</option>
                  <option value="Newsletter / Substack">Newsletter / Substack</option>
                  <option value="Something else">Something else</option>
                </select>
                <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", fontFamily: "var(--ka-display)", fontStyle: "italic", color: "var(--ka-accent-deep)", pointerEvents: "none" }}>↓</span>
              </div>
            </label>
            <label style={{ display: "block", gridColumn: "1 / -1" }}>
              <div className="ka-eyebrow" style={{ marginBottom: 12 }}>05 — A few words on what you have in mind</div>
              <textarea name="message" placeholder="Take your time. Specifics help." required rows={5} style={{ ...fieldStyle, resize: "vertical", lineHeight: 1.55 }} />
            </label>
            <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
              <span className="ka-eyebrow" style={{ maxWidth: 320, color: "var(--ka-muted)", letterSpacing: "0.18em" }}>By writing, you agree to the occasional follow-up by email. Nothing else.</span>
              <button type="submit" className="ka-btn" style={{ background: "var(--ka-ink)", color: "var(--ka-bg)" }}>Send the letter →</button>
            </div>
          </form>
        </div>
      </section>

      <section style={{ padding: "120px 64px", borderTop: "1px solid var(--ka-line)" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 64, borderBottom: "1px solid var(--ka-line)", paddingBottom: 24 }}>
          <div style={{ display: "flex", gap: 24, alignItems: "baseline" }}>
            <span style={{ fontFamily: "var(--ka-mono)", fontSize: 11, letterSpacing: "0.12em", color: "var(--ka-accent-deep)" }}>N° 02</span>
            <h2 style={{ fontFamily: "var(--ka-display)", fontWeight: 400, fontSize: 32, fontStyle: "italic" }}>Asked, before now</h2>
          </div>
          <a href="mailto:press@karenalexandra.com" className="ka-arrow-link">Press kit <span className="ka-arrow">→</span></a>
        </div>
        <div>
          {FAQ_ITEMS.map((item, i) => (
            <details key={i} open={i === 0} style={{ borderTop: "1px solid var(--ka-line)", padding: "32px 0" }}>
              <summary style={{ listStyle: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 32 }}>
                <div style={{ display: "flex", gap: 24, alignItems: "baseline", flex: 1 }}>
                  <span className="ka-eyebrow" style={{ color: "var(--ka-accent-deep)", flex: "0 0 auto" }}>0{i + 1}</span>
                  <h3 style={{ fontFamily: "var(--ka-display)", fontWeight: 400, fontSize: 28, fontStyle: i % 2 ? "italic" : "normal" }}>{item.q}</h3>
                </div>
                <span style={{ fontFamily: "var(--ka-display)", fontSize: 24, color: "var(--ka-muted)" }}>+</span>
              </summary>
              <p style={{ marginTop: 20, marginLeft: 56, color: "var(--ka-muted)", fontSize: 16, lineHeight: 1.75, maxWidth: 720, fontFamily: "var(--ka-body)" }}>{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

export function CloseQuoteSection({ c }: { c: ContactContent }) {
  return (
    <section style={{ padding: "140px 64px", borderTop: "1px solid var(--ka-line)", textAlign: "center" }}>
      <div style={{ width: 56, height: 1, background: "var(--ka-accent-deep)", margin: "0 auto 48px" }} />
      <p style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(32px, 4vw, 56px)", fontStyle: "italic", maxWidth: 1100, margin: "0 auto", lineHeight: 1.15 }}>
        &ldquo;{c.close.quote}&rdquo;
      </p>
      <div className="ka-eyebrow" style={{ marginTop: 48 }}>— From the editor&apos;s desk</div>
    </section>
  );
}

export function buildContactSectionMap(c: ContactContent): Record<string, ReactNode> {
  return {
    "hero":        <HeroSection c={c} />,
    "form":        <FormSection c={c} />,
    "close-quote": <CloseQuoteSection c={c} />,
  };
}
