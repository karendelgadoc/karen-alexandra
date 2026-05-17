"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BlogPostInput, BlogCategory } from "@/lib/blog-db";

const CATEGORIES: BlogCategory[] = ["fashion", "lifestyle", "travel", "wellness"];

const EMPTY: BlogPostInput = {
  slug: "", title: "", date: "", category: "lifestyle",
  heroImage: "", heroAlt: "", excerpt: "", body: "",
  published: true, featured: false,
};

export default function NewBlogPostPage() {
  const router = useRouter();
  const [form, setForm] = useState<BlogPostInput>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(key: keyof BlogPostInput, value: string | boolean) {
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
    <div className="max-w-2xl">
      <h1 className="text-2xl font-light mb-8">New Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <BlogPostFormFields form={form} set={set} />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="text-xs tracking-[0.15em] uppercase bg-[var(--charcoal)] text-[var(--cream)] px-6 py-3 hover:opacity-80 transition-opacity disabled:opacity-40"
          >
            {saving ? "Saving…" : "Publish"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/blog")}
            className="text-xs tracking-[0.15em] uppercase border border-stone-300 px-6 py-3 hover:border-[var(--charcoal)] transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export function BlogPostFormFields({
  form,
  set,
}: {
  form: BlogPostInput;
  set: (key: keyof BlogPostInput, value: string | boolean) => void;
}) {
  return (
    <>
      {(
        [
          { key: "title", label: "Title", type: "text" },
          { key: "slug", label: "Slug", type: "text" },
          { key: "date", label: "Date", type: "date" },
          { key: "heroImage", label: "Hero Image URL", type: "url" },
          { key: "heroAlt", label: "Hero Image Alt Text", type: "text" },
        ] as const
      ).map(({ key, label, type }) => (
        <div key={key}>
          <label className="block text-xs tracking-[0.15em] uppercase text-[var(--taupe)] mb-1.5">
            {label}
          </label>
          <input
            type={type}
            value={form[key] as string}
            onChange={(e) => set(key, e.target.value)}
            required={key !== "heroImage" && key !== "heroAlt"}
            className="w-full border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:border-[var(--charcoal)]"
          />
        </div>
      ))}

      <div>
        <label className="block text-xs tracking-[0.15em] uppercase text-[var(--taupe)] mb-1.5">
          Category
        </label>
        <select
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
          className="w-full border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:border-[var(--charcoal)] bg-white"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs tracking-[0.15em] uppercase text-[var(--taupe)] mb-1.5">
          Excerpt
        </label>
        <textarea
          value={form.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
          rows={3}
          className="w-full border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:border-[var(--charcoal)] resize-none"
        />
      </div>

      <div>
        <label className="block text-xs tracking-[0.15em] uppercase text-[var(--taupe)] mb-1.5">
          Body (separate paragraphs with a blank line)
        </label>
        <textarea
          value={form.body}
          onChange={(e) => set("body", e.target.value)}
          rows={18}
          className="w-full border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:border-[var(--charcoal)] resize-y font-mono"
        />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={!!form.published}
            onChange={(e) => set("published", e.target.checked)}
            className="accent-[var(--charcoal)]"
          />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={!!form.featured}
            onChange={(e) => set("featured", e.target.checked)}
            className="accent-[var(--charcoal)]"
          />
          Featured on homepage
        </label>
      </div>
    </>
  );
}
