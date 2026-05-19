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

function useSection(page: PageKey) {
  const [statuses, setStatuses] = useState<Record<string, "idle" | "saving" | "saved" | "error">>({});

  async function save(section: string, data: unknown) {
    setStatuses((s) => ({ ...s, [section]: "saving" }));
    try {
      // First fetch the current full content, then merge this section in
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

function HomeEditor({ initial }: { initial: HomeContent; page: PageKey }) {
  const { statuses, save } = useSection("home");
  const [hero, setHero] = useState(initial.hero);
  const [quote, setQuote] = useState(initial.quote);
  const [marquee, setMarquee] = useState(initial.marquee);

  return (
    <>
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

      <SectionCard title="Pull quote" onSave={() => save("quote", quote)} status={statuses.quote ?? "idle"}>
        <Field label="Quote text" value={quote.text} onChange={(v) => setQuote({ text: v })} area rows={2} />
      </SectionCard>

      <SectionCard title="Marquee strip" onSave={() => save("marquee", marquee)} status={statuses.marquee ?? "idle"}>
        <p className="text-xs text-stone-400 mb-2">One item per line — these scroll across the marquee strip.</p>
        <textarea
          value={marquee.items.join("\n")}
          onChange={(e) => setMarquee({ items: e.target.value.split("\n") })}
          rows={6}
          className="w-full border border-stone-200 rounded px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-stone-400 resize-y font-mono"
        />
      </SectionCard>
    </>
  );
}

// ── Portfolio editor ───────────────────────────────────────────────────────────

function PortfolioEditor({ initial }: { initial: PortfolioContent }) {
  const { statuses, save } = useSection("portfolio");
  const [hero, setHero] = useState(initial.hero);
  const [stats, setStats] = useState(initial.stats);
  const [capabilities, setCapabilities] = useState(initial.capabilities);
  const [press, setPress] = useState(initial.press);
  const [cta, setCta] = useState(initial.cta);
  const [galleryImages, setGalleryImages] = useState(initial.galleryImages);

  return (
    <>
      <SectionCard title="Hero" onSave={() => save("hero", hero)} status={statuses.hero ?? "idle"}>
        <Field label="Eyebrow" value={hero.eyebrow} onChange={(v) => setHero({ ...hero, eyebrow: v })} />
        <Field label="Headline" value={hero.headline} onChange={(v) => setHero({ ...hero, headline: v })} area rows={2} />
        <Field label="Accent text (italic line)" value={hero.accentText} onChange={(v) => setHero({ ...hero, accentText: v })} />
      </SectionCard>

      <SectionCard title="Stats" onSave={() => save("stats", stats)} status={statuses.stats ?? "idle"}>
        {stats.map((s, i) => (
          <div key={i} className="grid grid-cols-3 gap-3 pb-4 border-b border-stone-100 last:border-0 last:pb-0">
            <Field label={`Stat ${i + 1} — Value`} value={s.value} onChange={(v) => { const n = [...stats]; n[i] = { ...n[i], value: v }; setStats(n); }} />
            <Field label="Label" value={s.label} onChange={(v) => { const n = [...stats]; n[i] = { ...n[i], label: v }; setStats(n); }} />
            <Field label="Note" value={s.note} onChange={(v) => { const n = [...stats]; n[i] = { ...n[i], note: v }; setStats(n); }} />
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Capabilities" onSave={() => save("capabilities", capabilities)} status={statuses.capabilities ?? "idle"}>
        {capabilities.map((c, i) => (
          <div key={i} className="pb-4 border-b border-stone-100 last:border-0 last:pb-0 space-y-2">
            <Field label={`Capability ${i + 1} — Title`} value={c.title} onChange={(v) => { const n = [...capabilities]; n[i] = { ...n[i], title: v }; setCapabilities(n); }} />
            <Field label="Description" value={c.desc} onChange={(v) => { const n = [...capabilities]; n[i] = { ...n[i], desc: v }; setCapabilities(n); }} area rows={2} />
          </div>
        ))}
      </SectionCard>

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

      <SectionCard title="CTA section" onSave={() => save("cta", cta)} status={statuses.cta ?? "idle"}>
        <Field label="Headline" value={cta.headline} onChange={(v) => setCta({ ...cta, headline: v })} />
        <Field label="Button label" value={cta.buttonLabel} onChange={(v) => setCta({ ...cta, buttonLabel: v })} />
      </SectionCard>

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
    </>
  );
}

// ── Contact editor ─────────────────────────────────────────────────────────────

function ContactEditor({ initial }: { initial: ContactContent }) {
  const { statuses, save } = useSection("contact");
  const [hero, setHero] = useState(initial.hero);
  const [sidebar, setSidebar] = useState(initial.sidebar);
  const [close, setClose] = useState(initial.close);

  return (
    <>
      <SectionCard title="Hero" onSave={() => save("hero", hero)} status={statuses.hero ?? "idle"}>
        <Field label="Eyebrow" value={hero.eyebrow} onChange={(v) => setHero({ ...hero, eyebrow: v })} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Headline line 1" value={hero.headlineLine1} onChange={(v) => setHero({ ...hero, headlineLine1: v })} />
          <Field label="Headline italic word" value={hero.headlineLine2} onChange={(v) => setHero({ ...hero, headlineLine2: v })} />
        </div>
        <Field label="Subhead paragraph" value={hero.subhead} onChange={(v) => setHero({ ...hero, subhead: v })} area rows={3} />
      </SectionCard>

      <SectionCard title="Form sidebar" onSave={() => save("sidebar", sidebar)} status={statuses.sidebar ?? "idle"}>
        <Field label="Karen's quote" value={sidebar.quote} onChange={(v) => setSidebar({ ...sidebar, quote: v })} area rows={3} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Location" value={sidebar.location} onChange={(v) => setSidebar({ ...sidebar, location: v })} />
          <Field label="Availability" value={sidebar.availability} onChange={(v) => setSidebar({ ...sidebar, availability: v })} />
        </div>
        <Field label="Response note" value={sidebar.responseNote} onChange={(v) => setSidebar({ ...sidebar, responseNote: v })} />
      </SectionCard>

      <SectionCard title="Closing quote" onSave={() => save("close", close)} status={statuses.close ?? "idle"}>
        <Field label="Quote" value={close.quote} onChange={(v) => setClose({ quote: v })} area rows={2} />
      </SectionCard>
    </>
  );
}

// ── Watch editor ───────────────────────────────────────────────────────────────

function WatchEditor({ initial }: { initial: WatchContent }) {
  const { statuses, save } = useSection("watch");
  const [hero, setHero] = useState(initial.hero);

  return (
    <SectionCard title="Hero" onSave={() => save("hero", hero)} status={statuses.hero ?? "idle"}>
      <Field label="Eyebrow" value={hero.eyebrow} onChange={(v) => setHero({ ...hero, eyebrow: v })} />
      <Field label="Headline" value={hero.headline} onChange={(v) => setHero({ ...hero, headline: v })} />
      <Field label="Subhead" value={hero.subhead} onChange={(v) => setHero({ ...hero, subhead: v })} area rows={2} />
    </SectionCard>
  );
}

// ── About editor ───────────────────────────────────────────────────────────────

function AboutEditor({ initial }: { initial: AboutContent }) {
  const { statuses, save } = useSection("about");
  const [hero, setHero] = useState(initial.hero);
  const [portraitUrl, setPortraitUrl] = useState(initial.portraitUrl);
  const [galleryImages, setGalleryImages] = useState(initial.galleryImages);

  return (
    <>
      <SectionCard title="Hero" onSave={() => save("hero", hero)} status={statuses.hero ?? "idle"}>
        <Field label="Eyebrow" value={hero.eyebrow} onChange={(v) => setHero({ ...hero, eyebrow: v })} />
        <Field label="Headline" value={hero.headline} onChange={(v) => setHero({ ...hero, headline: v })} area rows={2} />
      </SectionCard>

      <SectionCard title="Portrait" onSave={() => save("portraitUrl", portraitUrl)} status={statuses.portraitUrl ?? "idle"}>
        <ImageUploader label="Portrait image" value={portraitUrl} onChange={setPortraitUrl} />
      </SectionCard>

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
    </>
  );
}

// ── Root component ─────────────────────────────────────────────────────────────

export default function PageEditor({
  page,
  initialData,
}: {
  page: PageKey;
  initialData: unknown;
}) {
  if (page === "home") return <HomeEditor initial={initialData as HomeContent} page={page} />;
  if (page === "portfolio") return <PortfolioEditor initial={initialData as PortfolioContent} />;
  if (page === "contact") return <ContactEditor initial={initialData as ContactContent} />;
  if (page === "watch") return <WatchEditor initial={initialData as WatchContent} />;
  if (page === "about") return <AboutEditor initial={initialData as AboutContent} />;
  return null;
}
