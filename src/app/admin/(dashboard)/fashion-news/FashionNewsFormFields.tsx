"use client";

import type { BlogPostInput, FaqItem } from "@/lib/blog-db";
import SeoPanel from "@/components/admin/SeoPanel";
import BlogBodyEditor from "@/components/admin/BlogBodyEditor";
import ImagePickerField from "@/components/admin/ImagePickerField";

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

export function FashionNewsFormFields({
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
      {([
        { key: "title", label: "Title", type: "text" },
        { key: "slug", label: "Slug", type: "text" },
        { key: "date", label: "Date", type: "date" },
      ] as const).map(({ key, label, type }) => (
        <div key={key}>
          <label className={LABEL_CLS}>{label}</label>
          <input type={type} value={(form[key] as string) ?? ""}
            onChange={(e) => set(key, e.target.value as BlogPostInput[typeof key])}
            required
            className={FIELD_CLS} />
        </div>
      ))}

      <div>
        <label className={LABEL_CLS}>Hero image</label>
        <ImagePickerField
          value={form.heroImage ?? ""}
          onChange={(url) => set("heroImage", url)}
          onAltChange={(alt) => { if (!form.heroAlt) set("heroAlt", alt); }}
          aspect="4/5"
          label="Choose hero image"
        />
      </div>

      <div>
        <label className={LABEL_CLS}>Hero image alt text</label>
        <input type="text" value={form.heroAlt ?? ""}
          onChange={(e) => set("heroAlt", e.target.value)}
          placeholder="Describe the image for screen readers & SEO"
          className={FIELD_CLS} />
      </div>

      <div>
        <label className={LABEL_CLS}>Excerpt</label>
        <textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={3}
          className={`${FIELD_CLS} resize-none`} />
      </div>

      <div>
        <label className={LABEL_CLS}>Body</label>
        <BlogBodyEditor value={form.body} onChange={(body) => set("body", body)} />
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
          Featured (homepage hero)
        </label>
      </div>

      <SectionHeader title="Search engine optimization" subtitle="How this article appears in Google, Bing, etc." />

      <div>
        <label className={LABEL_CLS}>Focus keyword</label>
        <input type="text" value={form.focusKeyword ?? ""}
          onChange={(e) => set("focusKeyword", e.target.value)} className={FIELD_CLS}
          placeholder="e.g. Dior autumn winter runway" />
      </div>

      <div>
        <label className={LABEL_CLS}>SEO title <span className="text-stone-400 font-normal normal-case">(optional override)</span></label>
        <input type="text" value={form.seoTitle ?? ""}
          onChange={(e) => set("seoTitle", e.target.value)} className={FIELD_CLS}
          placeholder={form.title || "Falls back to the article title"} />
      </div>

      <div>
        <label className={LABEL_CLS}>Meta description <span className="text-stone-400 font-normal normal-case">(optional override)</span></label>
        <textarea value={form.seoDescription ?? ""} onChange={(e) => set("seoDescription", e.target.value)} rows={2}
          className={`${FIELD_CLS} resize-none`} placeholder={form.excerpt || "Falls back to the excerpt"} />
      </div>

      <div>
        <label className={LABEL_CLS}>Social share image (OG) <span className="text-stone-400 font-normal normal-case">— defaults to hero image</span></label>
        <ImagePickerField
          value={form.ogImage ?? ""}
          onChange={(url) => set("ogImage", url)}
          aspect="1.91/1"
          label="Choose OG image"
        />
      </div>

      <div>
        <label className={LABEL_CLS}>Canonical URL</label>
        <input type="url" value={form.canonicalUrl ?? ""}
          onChange={(e) => set("canonicalUrl", e.target.value)} className={FIELD_CLS}
          placeholder="Auto-set if blank" />
      </div>

      <label className="flex items-center gap-2 text-sm cursor-pointer text-stone-600">
        <input type="checkbox" checked={!!form.noindex}
          onChange={(e) => set("noindex", e.target.checked)} className="accent-[var(--charcoal)]" />
        Hide from search engines (noindex)
      </label>

      <SectionHeader title="AI search optimization (GEO)" subtitle="Helps ChatGPT, Perplexity, and Google AI Overviews surface this article." tone="geo" />

      <div>
        <label className={LABEL_CLS}>Key takeaway <span className="text-violet-600 font-normal normal-case">(TL;DR)</span></label>
        <textarea value={form.keyTakeaway ?? ""} onChange={(e) => set("keyTakeaway", e.target.value)} rows={2}
          className={`${FIELD_CLS} resize-none`}
          placeholder="The 1-sentence direct answer or essence of this article." />
      </div>

      <div>
        <label className={LABEL_CLS}>Author name</label>
        <input type="text" value={form.authorName ?? ""}
          onChange={(e) => set("authorName", e.target.value)} className={FIELD_CLS} />
      </div>
      <div>
        <label className={LABEL_CLS}>Author bio</label>
        <textarea value={form.authorBio ?? ""} onChange={(e) => set("authorBio", e.target.value)} rows={2}
          className={`${FIELD_CLS} resize-none`} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={LABEL_CLS} style={{ marginBottom: 0 }}>FAQ items</label>
          <button type="button" onClick={addFaq}
            className="text-xs text-violet-600 hover:text-violet-800 transition-colors">+ Add Q&amp;A</button>
        </div>
        {faqs.length === 0 && (
          <p className="text-xs text-stone-400 italic py-3 px-3 bg-stone-50 border border-dashed border-stone-200">
            No FAQs yet.
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
                placeholder="Answer…"
                className="w-full border border-stone-200 px-2 py-1.5 text-sm focus:outline-none focus:border-[var(--charcoal)] resize-none bg-white" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
