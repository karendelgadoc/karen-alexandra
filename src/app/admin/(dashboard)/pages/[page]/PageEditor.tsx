"use client";

import { useState } from "react";
import ImageUploader from "@/components/admin/ImageUploader";
import type {
  PageKey,
  HomeContent,
  PortfolioContent,
  ContactContent,
  WatchContent,
  AboutContent,
  ServicesContent,
  MediaKitContent,
} from "@/lib/page-content-db";

// ── Shared field components ───────────────────────────────────────────────────

function Field({
  label,
  value,
  onChange,
  area = false,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  area?: boolean;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">
        {label}
      </span>
      {area ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="w-full border border-stone-200 rounded px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-stone-400 resize-y"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-stone-200 rounded px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-stone-400"
        />
      )}
    </label>
  );
}

function SectionCard({
  title,
  children,
  onSave,
  status,
}: {
  title: string;
  children: React.ReactNode;
  onSave: () => void;
  status: "idle" | "saving" | "saved" | "error";
}) {
  return (
    <div className="bg-white border border-stone-200 rounded-lg p-6 mb-4">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-stone-800">{title}</h2>
        <div className="flex items-center gap-3">
          {status === "saved" && (
            <span className="text-xs text-green-600">Saved ✓</span>
          )}
          {status === "error" && (
            <span className="text-xs text-red-500">Error — try again</span>
          )}
          <button
            onClick={onSave}
            disabled={status === "saving"}
            className="px-4 py-1.5 bg-stone-900 text-white text-xs rounded hover:bg-stone-700 disabled:opacity-50 transition-colors"
          >
            {status === "saving" ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function NoFormNotice() {
  return (
    <div className="text-center py-12 px-4 bg-white border border-stone-200 rounded-lg">
      <div className="text-stone-300 text-3xl mb-3">⊘</div>
      <p className="text-sm text-stone-500">No editable fields for this section.</p>
      <p className="text-xs text-stone-400 mt-1">Content is dynamic or managed elsewhere.</p>
    </div>
  );
}

function useSection(page: PageKey) {
  const [statuses, setStatuses] = useState<Record<string, "idle" | "saving" | "saved" | "error">>({});

  async function save(section: string, data: unknown) {
    setStatuses((s) => ({ ...s, [section]: "saving" }));
    try {
      const getRes = await fetch(`/api/admin/pages/${page}`);
      const current = getRes.ok ? await getRes.json() : {};
      const merged = { ...current, [section]: data };
      const res = await fetch(`/api/admin/pages/${page}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(merged),
      });
      setStatuses((s) => ({ ...s, [section]: res.ok ? "saved" : "error" }));
      if (res.ok) setTimeout(() => setStatuses((s) => ({ ...s, [section]: "idle" })), 2500);
    } catch {
      setStatuses((s) => ({ ...s, [section]: "error" }));
    }
  }

  return { statuses, save };
}

// ── Home editor ───────────────────────────────────────────────────────────────

function HomeEditor({ initial, focusSectionId }: { initial: HomeContent; page: PageKey; focusSectionId?: string }) {
  const { statuses, save } = useSection("home");
  const [hero, setHero] = useState(initial.hero);
  const [quote, setQuote] = useState(initial.quote);
  const [marquee, setMarquee] = useState(initial.marquee);

  const show = (id: string) => !focusSectionId || focusSectionId === id;
  const editable = ["hero", "editor-note", "marquee"];

  return (
    <>
      {show("hero") && (
        <SectionCard title="Hero" onSave={() => save("hero", hero)} status={statuses.hero ?? "idle"}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Eyebrow" value={hero.eyebrow} onChange={(v) => setHero({ ...hero, eyebrow: v })} />
            <Field label="CTA button label" value={hero.ctaLabel} onChange={(v) => setHero({ ...hero, ctaLabel: v })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Headline line 1" value={hero.headline} onChange={(v) => setHero({ ...hero, headline: v })} />
            <Field label="Headline italic line" value={hero.headlineItalic} onChange={(v) => setHero({ ...hero, headlineItalic: v })} />
          </div>
          <Field label="Intro paragraph 1" value={hero.subhead1} onChange={(v) => setHero({ ...hero, subhead1: v })} area rows={3} />
          <Field label="Intro paragraph 2" value={hero.subhead2} onChange={(v) => setHero({ ...hero, subhead2: v })} area rows={3} />
          <Field label="CTA note (italic text beside button)" value={hero.ctaNote} onChange={(v) => setHero({ ...hero, ctaNote: v })} />
          <Field label="'This week's letter' callout title" value={hero.letterCardTitle} onChange={(v) => setHero({ ...hero, letterCardTitle: v })} />
          <ImageUploader
            label="Portrait image"
            value={hero.portraitUrl}
            onChange={(v) => setHero({ ...hero, portraitUrl: v })}
          />
        </SectionCard>
      )}

      {show("editor-note") && (
        <SectionCard title="Pull quote" onSave={() => save("quote", quote)} status={statuses.quote ?? "idle"}>
          <Field label="Quote text" value={quote.text} onChange={(v) => setQuote({ text: v })} area rows={2} />
        </SectionCard>
      )}

      {show("marquee") && (
        <SectionCard title="Marquee strip" onSave={() => save("marquee", marquee)} status={statuses.marquee ?? "idle"}>
          <p className="text-xs text-stone-400 mb-2">One item per line — these scroll across the marquee strip.</p>
          <textarea
            value={marquee.items.join("\n")}
            onChange={(e) => setMarquee({ items: e.target.value.split("\n") })}
            rows={6}
            className="w-full border border-stone-200 rounded px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-stone-400 resize-y font-mono"
          />
        </SectionCard>
      )}

      {focusSectionId && !editable.includes(focusSectionId) && <NoFormNotice />}
    </>
  );
}

// ── Portfolio editor ───────────────────────────────────────────────────────────

function PortfolioEditor({ initial, focusSectionId }: { initial: PortfolioContent; focusSectionId?: string }) {
  const { statuses, save } = useSection("portfolio");
  const [hero, setHero] = useState(initial.hero);
  const [stats, setStats] = useState(initial.stats);
  const [capabilities, setCapabilities] = useState(initial.capabilities);
  const [press, setPress] = useState(initial.press);
  const [cta, setCta] = useState(initial.cta);
  const [clientLogos, setClientLogos] = useState(initial.clientLogos ?? []);
  const [galleryImages, setGalleryImages] = useState(initial.galleryImages);

  const show = (id: string) => !focusSectionId || focusSectionId === id;
  const editable = ["hero", "facts", "capabilities", "logos", "press", "cta"];

  return (
    <>
      {show("hero") && (
        <SectionCard title="Hero" onSave={() => save("hero", hero)} status={statuses.hero ?? "idle"}>
          <Field label="Eyebrow" value={hero.eyebrow} onChange={(v) => setHero({ ...hero, eyebrow: v })} />
          <Field label="Headline" value={hero.headline} onChange={(v) => setHero({ ...hero, headline: v })} area rows={2} />
          <Field label="Accent text (italic line)" value={hero.accentText} onChange={(v) => setHero({ ...hero, accentText: v })} />
        </SectionCard>
      )}

      {show("facts") && (
        <SectionCard title="Stats" onSave={() => save("stats", stats)} status={statuses.stats ?? "idle"}>
          {stats.map((s, i) => (
            <div key={i} className="grid grid-cols-3 gap-3 pb-4 border-b border-stone-100 last:border-0 last:pb-0">
              <Field label={`Stat ${i + 1} — Value`} value={s.value} onChange={(v) => { const n = [...stats]; n[i] = { ...n[i], value: v }; setStats(n); }} />
              <Field label="Label" value={s.label} onChange={(v) => { const n = [...stats]; n[i] = { ...n[i], label: v }; setStats(n); }} />
              <Field label="Note" value={s.note} onChange={(v) => { const n = [...stats]; n[i] = { ...n[i], note: v }; setStats(n); }} />
            </div>
          ))}
        </SectionCard>
      )}

      {show("logos") && (
        <SectionCard title="Client logos" onSave={() => save("clientLogos", clientLogos)} status={statuses.clientLogos ?? "idle"}>
          <p className="text-xs text-stone-400 mb-2">One brand name per line. Names display in uppercase automatically.</p>
          <textarea
            value={clientLogos.join("\n")}
            onChange={(e) => setClientLogos(e.target.value.split("\n"))}
            rows={12}
            className="w-full border border-stone-200 rounded px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-stone-400 resize-y font-mono"
          />
        </SectionCard>
      )}

      {show("capabilities") && (
        <SectionCard title="Capabilities" onSave={() => save("capabilities", capabilities)} status={statuses.capabilities ?? "idle"}>
          {capabilities.map((c, i) => (
            <div key={i} className="pb-4 border-b border-stone-100 last:border-0 last:pb-0 space-y-2">
              <Field label={`Capability ${i + 1} — Title`} value={c.title} onChange={(v) => { const n = [...capabilities]; n[i] = { ...n[i], title: v }; setCapabilities(n); }} />
              <Field label="Description" value={c.desc} onChange={(v) => { const n = [...capabilities]; n[i] = { ...n[i], desc: v }; setCapabilities(n); }} area rows={2} />
            </div>
          ))}
        </SectionCard>
      )}

      {show("press") && (
        <SectionCard title="Press quotes" onSave={() => save("press", press)} status={statuses.press ?? "idle"}>
          {press.map((p, i) => (
            <div key={i} className="grid grid-cols-4 gap-3 pb-4 border-b border-stone-100 last:border-0 last:pb-0">
              <Field label="Publication" value={p.publication} onChange={(v) => { const n = [...press]; n[i] = { ...n[i], publication: v }; setPress(n); }} />
              <div className="col-span-2">
                <Field label="Quote" value={p.quote} onChange={(v) => { const n = [...press]; n[i] = { ...n[i], quote: v }; setPress(n); }} area rows={2} />
              </div>
              <Field label="Year" value={p.date} onChange={(v) => { const n = [...press]; n[i] = { ...n[i], date: v }; setPress(n); }} />
            </div>
          ))}
        </SectionCard>
      )}

      {show("cta") && (
        <SectionCard title="CTA section" onSave={() => save("cta", cta)} status={statuses.cta ?? "idle"}>
          <Field label="Headline" value={cta.headline} onChange={(v) => setCta({ ...cta, headline: v })} />
          <Field label="Button label" value={cta.buttonLabel} onChange={(v) => setCta({ ...cta, buttonLabel: v })} />
        </SectionCard>
      )}

      {!focusSectionId && (
        <SectionCard title="Gallery images" onSave={() => save("galleryImages", galleryImages)} status={statuses.galleryImages ?? "idle"}>
          {galleryImages.map((url, i) => (
            <ImageUploader
              key={i}
              label={`Image ${i + 1}`}
              value={url}
              onChange={(v) => { const n = [...galleryImages]; n[i] = v; setGalleryImages(n); }}
            />
          ))}
        </SectionCard>
      )}

      {focusSectionId && !editable.includes(focusSectionId) && <NoFormNotice />}
    </>
  );
}

// ── Contact editor ─────────────────────────────────────────────────────────────

function ContactEditor({ initial, focusSectionId }: { initial: ContactContent; focusSectionId?: string }) {
  const { statuses, save } = useSection("contact");
  const [hero, setHero] = useState(initial.hero);
  const [sidebar, setSidebar] = useState(initial.sidebar);
  const [close, setClose] = useState(initial.close);

  const show = (id: string) => !focusSectionId || focusSectionId === id;
  const editable = ["hero", "form", "close-quote"];

  return (
    <>
      {show("hero") && (
        <SectionCard title="Hero" onSave={() => save("hero", hero)} status={statuses.hero ?? "idle"}>
          <Field label="Eyebrow" value={hero.eyebrow} onChange={(v) => setHero({ ...hero, eyebrow: v })} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Headline line 1" value={hero.headlineLine1} onChange={(v) => setHero({ ...hero, headlineLine1: v })} />
            <Field label="Headline italic word" value={hero.headlineLine2} onChange={(v) => setHero({ ...hero, headlineLine2: v })} />
          </div>
          <Field label="Subhead paragraph" value={hero.subhead} onChange={(v) => setHero({ ...hero, subhead: v })} area rows={3} />
        </SectionCard>
      )}

      {show("form") && (
        <SectionCard title="Form sidebar" onSave={() => save("sidebar", sidebar)} status={statuses.sidebar ?? "idle"}>
          <Field label="Karen's quote" value={sidebar.quote} onChange={(v) => setSidebar({ ...sidebar, quote: v })} area rows={3} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Location" value={sidebar.location} onChange={(v) => setSidebar({ ...sidebar, location: v })} />
            <Field label="Availability" value={sidebar.availability} onChange={(v) => setSidebar({ ...sidebar, availability: v })} />
          </div>
          <Field label="Response note" value={sidebar.responseNote} onChange={(v) => setSidebar({ ...sidebar, responseNote: v })} />
        </SectionCard>
      )}

      {show("close-quote") && (
        <SectionCard title="Closing quote" onSave={() => save("close", close)} status={statuses.close ?? "idle"}>
          <Field label="Quote" value={close.quote} onChange={(v) => setClose({ quote: v })} area rows={2} />
        </SectionCard>
      )}

      {focusSectionId && !editable.includes(focusSectionId) && <NoFormNotice />}
    </>
  );
}

// ── Watch editor ───────────────────────────────────────────────────────────────

function WatchEditor({ initial, focusSectionId }: { initial: WatchContent; focusSectionId?: string }) {
  const { statuses, save } = useSection("watch");
  const [hero, setHero] = useState(initial.hero);

  const show = (id: string) => !focusSectionId || focusSectionId === id;

  return (
    <>
      {show("hero") && (
        <SectionCard title="Hero" onSave={() => save("hero", hero)} status={statuses.hero ?? "idle"}>
          <Field label="Eyebrow" value={hero.eyebrow} onChange={(v) => setHero({ ...hero, eyebrow: v })} />
          <Field label="Headline" value={hero.headline} onChange={(v) => setHero({ ...hero, headline: v })} />
          <Field label="Subhead" value={hero.subhead} onChange={(v) => setHero({ ...hero, subhead: v })} area rows={2} />
        </SectionCard>
      )}
      {focusSectionId && focusSectionId !== "hero" && <NoFormNotice />}
    </>
  );
}

// ── About editor ───────────────────────────────────────────────────────────────

function AboutEditor({ initial, focusSectionId }: { initial: AboutContent; focusSectionId?: string }) {
  const { statuses, save } = useSection("about");
  const [hero, setHero] = useState(initial.hero);
  const [manifesto, setManifesto] = useState(initial.manifesto);
  const [bio, setBio] = useState(initial.bio);
  const [joys, setJoys] = useState(initial.joys);
  const [cta, setCta] = useState(initial.cta);

  const show = (id: string) => !focusSectionId || focusSectionId === id;
  const editable = ["hero", "manifesto", "bio", "joys", "cta"];

  return (
    <>
      {show("hero") && (
        <SectionCard title="Hero" onSave={() => save("hero", hero)} status={statuses.hero ?? "idle"}>
          <Field label="Eyebrow" value={hero.eyebrow} onChange={(v) => setHero({ ...hero, eyebrow: v })} />
          <Field label="Subhead" value={hero.subhead} onChange={(v) => setHero({ ...hero, subhead: v })} area rows={3} />
        </SectionCard>
      )}

      {show("manifesto") && (
        <SectionCard title="On This Place" onSave={() => save("manifesto", manifesto)} status={statuses.manifesto ?? "idle"}>
          <Field label="Eyebrow" value={manifesto.eyebrow} onChange={(v) => setManifesto({ ...manifesto, eyebrow: v })} />
          <Field label="Pull quote" value={manifesto.quote} onChange={(v) => setManifesto({ ...manifesto, quote: v })} area rows={3} />
          <Field label="Paragraph 1" value={manifesto.para1} onChange={(v) => setManifesto({ ...manifesto, para1: v })} area rows={4} />
          <Field label="Paragraph 2" value={manifesto.para2} onChange={(v) => setManifesto({ ...manifesto, para2: v })} area rows={4} />
        </SectionCard>
      )}

      {show("bio") && (
        <SectionCard title="Bio & Portrait" onSave={() => save("bio", bio)} status={statuses.bio ?? "idle"}>
          <ImageUploader label="Portrait image" value={bio.portraitUrl} onChange={(v) => setBio({ ...bio, portraitUrl: v })} />
          <Field label="Tagline (short version)" value={bio.tagline} onChange={(v) => setBio({ ...bio, tagline: v })} area rows={2} />
          <Field label="Paragraph 1" value={bio.para1} onChange={(v) => setBio({ ...bio, para1: v })} area rows={4} />
          <Field label="Paragraph 2" value={bio.para2} onChange={(v) => setBio({ ...bio, para2: v })} area rows={4} />
          <Field label="Paragraph 3" value={bio.para3} onChange={(v) => setBio({ ...bio, para3: v })} area rows={4} />
          <Field label="Paragraph 4" value={bio.para4} onChange={(v) => setBio({ ...bio, para4: v })} area rows={3} />
          <div style={{ marginTop: 16 }}>
            <div style={{ fontFamily: "var(--ka-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12, color: "var(--ka-muted)" }}>Quick facts</div>
            {bio.facts.map((f, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8, marginBottom: 8 }}>
                <Field label={`Label ${i + 1}`} value={f.label} onChange={(v) => { const n = [...bio.facts]; n[i] = { ...f, label: v }; setBio({ ...bio, facts: n }); }} />
                <Field label={`Value ${i + 1}`} value={f.value} onChange={(v) => { const n = [...bio.facts]; n[i] = { ...f, value: v }; setBio({ ...bio, facts: n }); }} />
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {show("joys") && (
        <SectionCard title="Joys" onSave={() => save("joys", joys)} status={statuses.joys ?? "idle"}>
          {joys.map((j, i) => (
            <div key={i} style={{ paddingBottom: 16, marginBottom: 16, borderBottom: "1px solid var(--ka-line)" }}>
              <div style={{ fontFamily: "var(--ka-mono)", fontSize: 10, letterSpacing: "0.12em", color: "var(--ka-muted)", marginBottom: 8 }}>N° {j.n}</div>
              <Field label="Title" value={j.title} onChange={(v) => { const n = [...joys]; n[i] = { ...j, title: v }; setJoys(n); }} />
              <Field label="Description" value={j.desc} onChange={(v) => { const n = [...joys]; n[i] = { ...j, desc: v }; setJoys(n); }} />
            </div>
          ))}
        </SectionCard>
      )}

      {show("cta") && (
        <SectionCard title="CTA" onSave={() => save("cta", cta)} status={statuses.cta ?? "idle"}>
          <Field label="Headline" value={cta.headline} onChange={(v) => setCta({ ...cta, headline: v })} area rows={2} />
          <Field label="Subhead" value={cta.subhead} onChange={(v) => setCta({ ...cta, subhead: v })} area rows={2} />
        </SectionCard>
      )}

      {focusSectionId && !editable.includes(focusSectionId) && <NoFormNotice />}
    </>
  );
}

// ── Services editor ───────────────────────────────────────────────────────────

function ServicesEditor({ initial, focusSectionId }: { initial: ServicesContent; focusSectionId?: string }) {
  const { statuses, save } = useSection("services");
  const [hero, setHero] = useState(initial.hero);
  const [principle, setPrinciple] = useState(initial.principle);
  const [services, setServices] = useState(initial.services);
  const [process, setProcess] = useState(initial.process);
  const [testimonials, setTestimonials] = useState(initial.testimonials);
  const [faq, setFaq] = useState(initial.faq);
  const [cta, setCta] = useState(initial.cta);

  const show = (id: string) => !focusSectionId || focusSectionId === id;
  const editable = ["hero", "principle", "services", "process", "testimonials", "faq", "cta"];

  return (
    <>
      {show("hero") && (
        <SectionCard title="Hero" onSave={() => save("hero", hero)} status={statuses.hero ?? "idle"}>
          <Field label="Eyebrow" value={hero.eyebrow} onChange={(v) => setHero({ ...hero, eyebrow: v })} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Headline" value={hero.headline} onChange={(v) => setHero({ ...hero, headline: v })} />
            <Field label="Headline italic" value={hero.headlineItalic} onChange={(v) => setHero({ ...hero, headlineItalic: v })} />
          </div>
          <Field label="Subhead" value={hero.subhead} onChange={(v) => setHero({ ...hero, subhead: v })} area rows={3} />
        </SectionCard>
      )}

      {show("principle") && (
        <SectionCard title="Principle Strip" onSave={() => save("principle", principle)} status={statuses.principle ?? "idle"}>
          <Field label="Label" value={principle.label} onChange={(v) => setPrinciple({ ...principle, label: v })} />
          <Field label="Quote" value={principle.quote} onChange={(v) => setPrinciple({ ...principle, quote: v })} area rows={3} />
        </SectionCard>
      )}

      {show("services") && (
        <SectionCard title="Service Cards" onSave={() => save("services", services)} status={statuses.services ?? "idle"}>
          {services.map((s, i) => (
            <div key={i} className="pb-6 border-b border-stone-100 last:border-0 last:pb-0 space-y-3">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Service {s.n}</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Title" value={s.title} onChange={(v) => { const n = [...services]; n[i] = { ...n[i], title: v }; setServices(n); }} />
                <Field label="Tag" value={s.tag} onChange={(v) => { const n = [...services]; n[i] = { ...n[i], tag: v }; setServices(n); }} />
              </div>
              <label className="flex items-center gap-2 text-sm text-stone-600">
                <input type="checkbox" checked={s.italic} onChange={(e) => { const n = [...services]; n[i] = { ...n[i], italic: e.target.checked }; setServices(n); }} />
                Title italic
              </label>
              <Field label="Summary" value={s.summary} onChange={(v) => { const n = [...services]; n[i] = { ...n[i], summary: v }; setServices(n); }} area rows={3} />
              <Field
                label="Deliverables (one per line)"
                value={s.deliverables.join("\n")}
                onChange={(v) => { const n = [...services]; n[i] = { ...n[i], deliverables: v.split("\n") }; setServices(n); }}
                area
                rows={4}
              />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Proof stat" value={s.proofStat} onChange={(v) => { const n = [...services]; n[i] = { ...n[i], proofStat: v }; setServices(n); }} />
                <Field label="Proof note" value={s.proofNote} onChange={(v) => { const n = [...services]; n[i] = { ...n[i], proofNote: v }; setServices(n); }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Proof case name" value={s.proofCase} onChange={(v) => { const n = [...services]; n[i] = { ...n[i], proofCase: v }; setServices(n); }} />
                <Field label="Proof case slug" value={s.proofSlug} onChange={(v) => { const n = [...services]; n[i] = { ...n[i], proofSlug: v }; setServices(n); }} />
              </div>
            </div>
          ))}
        </SectionCard>
      )}

      {show("process") && (
        <SectionCard title="Process Steps" onSave={() => save("process", process)} status={statuses.process ?? "idle"}>
          {process.map((p, i) => (
            <div key={i} className="pb-4 border-b border-stone-100 last:border-0 last:pb-0 space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <Field label={`Step ${p.num} — Title`} value={p.title} onChange={(v) => { const n = [...process]; n[i] = { ...n[i], title: v }; setProcess(n); }} />
                <Field label="When" value={p.when} onChange={(v) => { const n = [...process]; n[i] = { ...n[i], when: v }; setProcess(n); }} />
              </div>
              <Field label="Note" value={p.note} onChange={(v) => { const n = [...process]; n[i] = { ...n[i], note: v }; setProcess(n); }} area rows={2} />
            </div>
          ))}
        </SectionCard>
      )}

      {show("testimonials") && (
        <SectionCard title="Testimonials" onSave={() => save("testimonials", testimonials)} status={statuses.testimonials ?? "idle"}>
          {testimonials.map((t, i) => (
            <div key={i} className="pb-4 border-b border-stone-100 last:border-0 last:pb-0 space-y-2">
              <Field label={`Quote ${i + 1}`} value={t.q} onChange={(v) => { const n = [...testimonials]; n[i] = { ...n[i], q: v }; setTestimonials(n); }} area rows={3} />
              <Field label="Attribution" value={t.who} onChange={(v) => { const n = [...testimonials]; n[i] = { ...n[i], who: v }; setTestimonials(n); }} />
              <button onClick={() => setTestimonials(testimonials.filter((_, j) => j !== i))} className="text-xs text-red-400 hover:text-red-600">Remove</button>
            </div>
          ))}
          <button onClick={() => setTestimonials([...testimonials, { q: "", who: "" }])} className="text-xs text-stone-500 border border-stone-200 rounded px-3 py-1.5 hover:bg-stone-50">
            + Add testimonial
          </button>
        </SectionCard>
      )}

      {show("faq") && (
        <SectionCard title="FAQ" onSave={() => save("faq", faq)} status={statuses.faq ?? "idle"}>
          {faq.map((item, i) => (
            <div key={i} className="pb-4 border-b border-stone-100 last:border-0 last:pb-0 space-y-2">
              <Field label={`Q${i + 1}`} value={item.q} onChange={(v) => { const n = [...faq]; n[i] = { ...n[i], q: v }; setFaq(n); }} />
              <Field label="Answer" value={item.a} onChange={(v) => { const n = [...faq]; n[i] = { ...n[i], a: v }; setFaq(n); }} area rows={3} />
              <button onClick={() => setFaq(faq.filter((_, j) => j !== i))} className="text-xs text-red-400 hover:text-red-600">Remove</button>
            </div>
          ))}
          <button onClick={() => setFaq([...faq, { q: "", a: "" }])} className="text-xs text-stone-500 border border-stone-200 rounded px-3 py-1.5 hover:bg-stone-50">
            + Add FAQ item
          </button>
        </SectionCard>
      )}

      {show("cta") && (
        <SectionCard title="CTA" onSave={() => save("cta", cta)} status={statuses.cta ?? "idle"}>
          <Field label="Headline" value={cta.headline} onChange={(v) => setCta({ ...cta, headline: v })} />
          <Field label="Subhead" value={cta.subhead} onChange={(v) => setCta({ ...cta, subhead: v })} area rows={3} />
        </SectionCard>
      )}

      {focusSectionId && !editable.includes(focusSectionId) && <NoFormNotice />}
    </>
  );
}

// ── Media Kit editor ──────────────────────────────────────────────────────────

function MediaKitEditor({ initial, focusSectionId }: { initial: MediaKitContent; focusSectionId?: string }) {
  const { statuses, save } = useSection("media-kit");
  const [hero, setHero] = useState(initial.hero);
  const [bio, setBio] = useState(initial.bio);
  const [reach, setReach] = useState(initial.reach);
  const [demo, setDemo] = useState(initial.demo);
  const [partners, setPartners] = useState(initial.partners);
  const [press, setPress] = useState(initial.press);
  const [testimonials, setTestimonials] = useState(initial.testimonials);
  const [instagram, setInstagram] = useState(initial.instagram);
  const [ctaSubhead, setCtaSubhead] = useState(initial.ctaSubhead);

  const show = (id: string) => !focusSectionId || focusSectionId === id;
  const editable = ["hero", "bio", "reach", "partners", "press", "testimonials", "instagram", "cta"];

  return (
    <>
      {show("hero") && (
        <SectionCard title="Hero" onSave={() => save("hero", hero)} status={statuses.hero ?? "idle"}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Eyebrow left" value={hero.eyebrowLeft} onChange={(v) => setHero({ ...hero, eyebrowLeft: v })} />
            <Field label="Eyebrow right" value={hero.eyebrowRight} onChange={(v) => setHero({ ...hero, eyebrowRight: v })} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Headline line 1" value={hero.headline} onChange={(v) => setHero({ ...hero, headline: v })} />
            <Field label="Headline line 2 (italic)" value={hero.headlineItalic} onChange={(v) => setHero({ ...hero, headlineItalic: v })} />
            <Field label="Headline line 3 (+ purple dot)" value={hero.headlineLine3 ?? ""} onChange={(v) => setHero({ ...hero, headlineLine3: v })} />
          </div>
          <Field label="Subhead" value={hero.subhead} onChange={(v) => setHero({ ...hero, subhead: v })} area rows={3} />
        </SectionCard>
      )}

      {show("bio") && (
        <SectionCard title="Bio & Portrait" onSave={() => save("bio", bio)} status={statuses.bio ?? "idle"}>
          <Field label="Eyebrow" value={bio.eyebrow} onChange={(v) => setBio({ ...bio, eyebrow: v })} />
          <Field label="Headline (use \\n for line breaks)" value={bio.headline} onChange={(v) => setBio({ ...bio, headline: v })} area rows={3} />
          <Field label="Bio text" value={bio.bioText} onChange={(v) => setBio({ ...bio, bioText: v })} area rows={4} />
          <div className="grid grid-cols-3 gap-3">
            <Field label="Based" value={bio.basedValue} onChange={(v) => setBio({ ...bio, basedValue: v })} />
            <Field label="Languages" value={bio.languagesValue} onChange={(v) => setBio({ ...bio, languagesValue: v })} />
            <Field label="Working with" value={bio.workingWithValue} onChange={(v) => setBio({ ...bio, workingWithValue: v })} />
          </div>
          <ImageUploader label="Portrait image" value={bio.portraitUrl} onChange={(v) => setBio({ ...bio, portraitUrl: v })} />
        </SectionCard>
      )}

      {show("reach") && (
        <>
          <SectionCard title="Reach Stats" onSave={() => save("reach", reach)} status={statuses.reach ?? "idle"}>
            {reach.map((r, i) => (
              <div key={i} className="grid grid-cols-2 gap-3">
                <Field label={`Stat ${i + 1} — Value`} value={r.v} onChange={(v) => { const n = [...reach]; n[i] = { ...n[i], v }; setReach(n); }} />
                <Field label="Label" value={r.l} onChange={(v) => { const n = [...reach]; n[i] = { ...n[i], l: v }; setReach(n); }} />
              </div>
            ))}
          </SectionCard>

          <SectionCard title="Audience Demographics" onSave={() => save("demo", demo)} status={statuses.demo ?? "idle"}>
            {demo.map((d, i) => (
              <div key={i} className="grid grid-cols-4 gap-3 items-end">
                <div className="col-span-3">
                  <Field label={`Demographic ${i + 1} — Label`} value={d.label} onChange={(v) => { const n = [...demo]; n[i] = { ...n[i], label: v }; setDemo(n); }} />
                </div>
                <label className="block">
                  <span className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">%</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={d.pct}
                    onChange={(e) => { const n = [...demo]; n[i] = { ...n[i], pct: parseInt(e.target.value, 10) || 0 }; setDemo(n); }}
                    className="w-full border border-stone-200 rounded px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-stone-400"
                  />
                </label>
              </div>
            ))}
          </SectionCard>
        </>
      )}

      {show("partners") && (
        <SectionCard title="Partners" onSave={() => save("partners", partners)} status={statuses.partners ?? "idle"}>
          <p className="text-xs text-stone-400 mb-2">One partner name per line.</p>
          <textarea
            value={partners.join("\n")}
            onChange={(e) => setPartners(e.target.value.split("\n"))}
            rows={8}
            className="w-full border border-stone-200 rounded px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-stone-400 resize-y font-mono"
          />
        </SectionCard>
      )}

      {show("press") && (
        <SectionCard title="Press" onSave={() => save("press", press)} status={statuses.press ?? "idle"}>
          {press.map((p, i) => (
            <div key={i} className="pb-4 border-b border-stone-100 last:border-0 last:pb-0 space-y-2">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-3">
                  <Field label={`${i + 1} — Publication`} value={p.p} onChange={(v) => { const n = [...press]; n[i] = { ...n[i], p: v }; setPress(n); }} />
                </div>
                <Field label="Date" value={p.d} onChange={(v) => { const n = [...press]; n[i] = { ...n[i], d: v }; setPress(n); }} />
              </div>
              <Field label="Quote" value={p.q} onChange={(v) => { const n = [...press]; n[i] = { ...n[i], q: v }; setPress(n); }} area rows={2} />
            </div>
          ))}
        </SectionCard>
      )}

      {show("testimonials") && (
        <SectionCard title="Testimonials" onSave={() => save("testimonials", testimonials)} status={statuses.testimonials ?? "idle"}>
          {testimonials.map((t, i) => (
            <div key={i} className="pb-4 border-b border-stone-100 last:border-0 last:pb-0 space-y-2">
              <Field label={`Quote ${i + 1}`} value={t.q} onChange={(v) => { const n = [...testimonials]; n[i] = { ...n[i], q: v }; setTestimonials(n); }} area rows={3} />
              <Field label="Attribution" value={t.who} onChange={(v) => { const n = [...testimonials]; n[i] = { ...n[i], who: v }; setTestimonials(n); }} />
              <button onClick={() => setTestimonials(testimonials.filter((_, j) => j !== i))} className="text-xs text-red-400 hover:text-red-600">Remove</button>
            </div>
          ))}
          <button onClick={() => setTestimonials([...testimonials, { q: "", who: "" }])} className="text-xs text-stone-500 border border-stone-200 rounded px-3 py-1.5 hover:bg-stone-50">
            + Add testimonial
          </button>
        </SectionCard>
      )}

      {show("instagram") && (
        <SectionCard title="Instagram" onSave={() => save("instagram", instagram)} status={statuses.instagram ?? "idle"}>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Handle" value={instagram.handle} onChange={(v) => setInstagram({ ...instagram, handle: v })} />
            <Field label="Followers" value={instagram.followers} onChange={(v) => setInstagram({ ...instagram, followers: v })} />
            <Field label="Engagement" value={instagram.engagement} onChange={(v) => setInstagram({ ...instagram, engagement: v })} />
          </div>
        </SectionCard>
      )}

      {show("cta") && (
        <SectionCard title="CTA Subhead" onSave={() => save("ctaSubhead", ctaSubhead)} status={statuses.ctaSubhead ?? "idle"}>
          <Field label="Subhead text" value={ctaSubhead} onChange={setCtaSubhead} area rows={3} />
        </SectionCard>
      )}

      {focusSectionId && !editable.includes(focusSectionId) && <NoFormNotice />}
    </>
  );
}

// ── Root component ─────────────────────────────────────────────────────────────

export default function PageEditor({
  page,
  initialData,
  focusSectionId,
}: {
  page: PageKey;
  initialData: unknown;
  focusSectionId?: string;
}) {
  if (page === "home") return <HomeEditor initial={initialData as HomeContent} page={page} focusSectionId={focusSectionId} />;
  if (page === "portfolio") return <PortfolioEditor initial={initialData as PortfolioContent} focusSectionId={focusSectionId} />;
  if (page === "contact") return <ContactEditor initial={initialData as ContactContent} focusSectionId={focusSectionId} />;
  if (page === "watch") return <WatchEditor initial={initialData as WatchContent} focusSectionId={focusSectionId} />;
  if (page === "about") return <AboutEditor initial={initialData as AboutContent} focusSectionId={focusSectionId} />;
  if (page === "services") return <ServicesEditor initial={initialData as ServicesContent} focusSectionId={focusSectionId} />;
  if (page === "media-kit") return <MediaKitEditor initial={initialData as MediaKitContent} focusSectionId={focusSectionId} />;
  return null;
}
