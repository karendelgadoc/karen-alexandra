"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BlogPostInput, BlogCategory, FaqItem } from "@/lib/blog-db";
import SeoPanel from "@/components/admin/SeoPanel";

const CATEGORIES: BlogCategory[] = ["fashion", "lifestyle", "travel", "wellness"];

const EMPTY: BlogPostInput = {
  slug: "", title: "", date: "", category: "lifestyle",
  heroImage: "", heroAlt: "", excerpt: "", body: "",
  published: true, featured: false,
  seoTitle: "", seoDescription: "", focusKeyword: "",
  ogImage: "", canonicalUrl: "", noindex: false,
  keyTakeaway: "", faqItems: [],
  authorName: "Karen Alexandra",
  authorBio: "Brand Marketing Director with 10+ years building luxury fashion, travel and tech brands.",
};

export default function NewBlogPostPage() {
  const router = useRouter();
  const [form, setForm] = useState<BlogPostInput>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof BlogPostInput>(key: K, value: BlogPostInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch("/api/admin/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to save.");
      setSaving(false);
      return;
    }
    router.push("/admin/blog");
  }

  return (
    <div>
      <h1 className="text-2xl font-light mb-8">New Blog Post</h1>
      <form onSubmit={handleSubmit} className="grid gap-8" style={{ gridTemplateColumns: "minmax(0, 1fr) 360px" }}>
        <div className="space-y-5 min-w-0">
          <BlogPostFormFields form={form} set={set} />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-4 pt-2">
            <button type="submit" disabled={saving}
              className="text-xs tracking-[0.15em] uppercase bg-[var(--charcoal)] text-[var(--cream)] px-6 py-3 hover:opacity-80 transition-opacity disabled:opacity-40">
              {saving ? "Saving…" : "Publish"}
            </button>
            <button type="button" onClick={() => router.push("/admin/blog")}
              className="text-xs tracking-[0.15em] uppercase border border-stone-300 px-6 py-3 hover:border-[var(--charcoal)] transition-colors">
              Cancel
            </button>
          </div>
        </div>
        <aside><SeoPanel form={form} /></aside>
      </form>
    </div>
  );
}

// ── Shared form fields ────────────────────────────────────────────────────────

const FIELD_CLS = "w-full border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:border-[var(--charcoal)]";
const LABEL_CLS = "block text-xs tracking-[0.15em] uppercase text-[var(--taupe)] mb-1.5";

function SectionHeader({ title, subtitle, tone = "default" }: { title: string; subtitle?: string; tone?: "default" | "geo" }) {
  return (
    <div className="pt-8 pb-2 border-t border-stone-200" style={{ marginTop: 16 }}>
      <h2 className={`text-sm font-semibold ${tone === "geo" ? "text-violet-700" : "text-stone-900"}`}>{title}</h2>
      {subtitle && <p className="text-xs text-stone-500 mt-1">{subtitle}</p>}
    </div>
  );
}

export function BlogPostFormFields({
  form, set,
}: {
  form: BlogPostInput;
  set: <K extends keyof BlogPostInput>(key: K, value: BlogPostInput[K]) => void;
}) {
  const faqs = form.faqItems ?? [];

  function updateFaq(idx: number, field: keyof FaqItem, value: string) {
    const next = faqs.map((f, i) => (i === idx ? { ...f, [field]: value } : f));
    set("faqItems", next);
  }
  function addFaq() { set("faqItems", [...faqs, { question: "", answer: "" }]); }
  function removeFaq(idx: number) { set("faqItems", faqs.filter((_, i) => i !== idx)); }

  return (
    <>
      {/* ── Core content ────────────────────────────────────────── */}
      {([
        { key: "title", label: "Title", type: "text" },
        { key: "slug", label: "Slug", type: "text" },
        { key: "date", label: "Date", type: "date" },
        { key: "heroImage", label: "Hero Image URL", type: "url" },
        { key: "heroAlt", label: "Hero Image Alt Text", type: "text" },
      ] as const).map(({ key, label, type }) => (
        <div key={key}>
          <label className={LABEL_CLS}>{label}</label>
          <input type={type} value={(form[key] as string) ?? ""}
            onChange={(e) => set(key, e.target.value as BlogPostInput[typeof key])}
            required={key !== "heroImage" && key !== "heroAlt"}
            className={FIELD_CLS} />
        </div>
      ))}

      <div>
        <label className={LABEL_CLS}>Category</label>
        <select value={form.category}
          onChange={(e) => set("category", e.target.value as BlogCategory)}
          className={`${FIELD_CLS} bg-white`}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
      </div>

      <div>
        <label className={LABEL_CLS}>Excerpt</label>
        <textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={3}
          className={`${FIELD_CLS} resize-none`} />
      </div>

      <div>
        <label className={LABEL_CLS}>Body (separate paragraphs with a blank line)</label>
        <textarea value={form.body} onChange={(e) => set("body", e.target.value)} rows={18}
          className={`${FIELD_CLS} resize-y font-mono`} />
        <p className="text-xs text-stone-400 mt-1">Use <code className="text-xs bg-stone-100 px-1">## Heading</code> for subheadings (helps GEO).</p>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={!!form.published}
            onChange={(e) => set("published", e.target.checked)} className="accent-[var(--charcoal)]" />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={!!form.featured}
            onChange={(e) => set("featured", e.target.checked)} className="accent-[var(--charcoal)]" />
          Featured on homepage
        </label>
      </div>

      {/* ── SEO ───────────────────────────────────────────────────── */}
      <SectionHeader title="Search engine optimization" subtitle="How this post appears in Google, Bing, etc." />

      <div>
        <label className={LABEL_CLS}>Focus keyword</label>
        <input type="text" value={form.focusKeyword ?? ""}
          onChange={(e) => set("focusKeyword", e.target.value)} className={FIELD_CLS}
          placeholder="e.g. luxury villas Mykonos" />
        <p className="text-xs text-stone-400 mt-1">The phrase you want this post to rank for.</p>
      </div>

      <div>
        <label className={LABEL_CLS}>SEO title <span className="text-stone-400 font-normal normal-case">(optional override)</span></label>
        <input type="text" value={form.seoTitle ?? ""}
          onChange={(e) => set("seoTitle", e.target.value)} className={FIELD_CLS}
          placeholder={form.title || "Falls back to the post title"} />
        <p className="text-xs text-stone-400 mt-1">{(form.seoTitle ?? "").length || form.title.length}/60 characters</p>
      </div>

      <div>
        <label className={LABEL_CLS}>Meta description <span className="text-stone-400 font-normal normal-case">(optional override)</span></label>
        <textarea value={form.seoDescription ?? ""} onChange={(e) => set("seoDescription", e.target.value)} rows={2}
          className={`${FIELD_CLS} resize-none`} placeholder={form.excerpt || "Falls back to the excerpt"} />
        <p className="text-xs text-stone-400 mt-1">{(form.seoDescription ?? "").length || form.excerpt.length}/160 characters</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL_CLS}>Social share image (OG)</label>
          <input type="url" value={form.ogImage ?? ""}
            onChange={(e) => set("ogImage", e.target.value)} className={FIELD_CLS}
            placeholder="Defaults to hero image" />
        </div>
        <div>
          <label className={LABEL_CLS}>Canonical URL</label>
          <input type="url" value={form.canonicalUrl ?? ""}
            onChange={(e) => set("canonicalUrl", e.target.value)} className={FIELD_CLS}
            placeholder="Auto-set if blank" />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm cursor-pointer text-stone-600">
        <input type="checkbox" checked={!!form.noindex}
          onChange={(e) => set("noindex", e.target.checked)} className="accent-[var(--charcoal)]" />
        Hide from search engines (noindex)
      </label>

      {/* ── GEO ───────────────────────────────────────────────────── */}
      <SectionHeader
        title="AI search optimization (GEO)"
        subtitle="Helps ChatGPT, Perplexity, Claude and Google AI Overviews surface this post."
        tone="geo"
      />

      <div>
        <label className={LABEL_CLS}>Key takeaway <span className="text-violet-600 font-normal normal-case">(TL;DR — most important for GEO)</span></label>
        <textarea value={form.keyTakeaway ?? ""} onChange={(e) => set("keyTakeaway", e.target.value)} rows={2}
          className={`${FIELD_CLS} resize-none`}
          placeholder="The 1-sentence direct answer or essence of this post. AI engines extract this verbatim." />
        <p className="text-xs text-stone-400 mt-1">{(form.keyTakeaway ?? "").length}/200 chars · Appears as a TL;DR block above the article body.</p>
      </div>

      <div>
        <label className={LABEL_CLS}>Author name</label>
        <input type="text" value={form.authorName ?? ""}
          onChange={(e) => set("authorName", e.target.value)} className={FIELD_CLS} />
      </div>
      <div>
        <label className={LABEL_CLS}>Author bio <span className="text-stone-400 font-normal normal-case">(E-E-A-T signal)</span></label>
        <textarea value={form.authorBio ?? ""} onChange={(e) => set("authorBio", e.target.value)} rows={2}
          className={`${FIELD_CLS} resize-none`}
          placeholder="1-2 sentences. Why are you qualified to write this?" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={LABEL_CLS} style={{ marginBottom: 0 }}>FAQ items</label>
          <button type="button" onClick={addFaq}
            className="text-xs text-violet-600 hover:text-violet-800 transition-colors">+ Add Q&amp;A</button>
        </div>
        <p className="text-xs text-stone-400 mb-3">Q&amp;A pairs become a FAQPage schema and appear at the bottom of the article. AI engines surface these directly.</p>
        {faqs.length === 0 && (
          <p className="text-xs text-stone-400 italic py-3 px-3 bg-stone-50 border border-dashed border-stone-200">
            No FAQs yet. Add 2–5 questions readers commonly ask.
          </p>
        )}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-stone-200 p-3 bg-stone-50 space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-xs text-stone-400 font-mono mt-2">Q{i + 1}</span>
                <input type="text" value={faq.question}
                  onChange={(e) => updateFaq(i, "question", e.target.value)}
                  placeholder="Question…"
                  className="flex-1 border border-stone-200 px-2 py-1.5 text-sm focus:outline-none focus:border-[var(--charcoal)] bg-white" />
                <button type="button" onClick={() => removeFaq(i)}
                  className="text-stone-300 hover:text-red-500 text-lg leading-none px-1" title="Remove">×</button>
              </div>
              <textarea value={faq.answer} onChange={(e) => updateFaq(i, "answer", e.target.value)} rows={2}
                placeholder="Answer (40+ characters)…"
                className="w-full border border-stone-200 px-2 py-1.5 text-sm focus:outline-none focus:border-[var(--charcoal)] resize-none bg-white" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
