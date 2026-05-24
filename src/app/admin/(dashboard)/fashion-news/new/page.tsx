"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BlogPostInput, FaqItem } from "@/lib/blog-db";
import SeoPanel from "@/components/admin/SeoPanel";
import { FashionNewsFormFields } from "../FashionNewsFormFields";

const EMPTY: BlogPostInput = {
  slug: "", title: "", date: "", category: "fashion-news",
  heroImage: "", heroAlt: "", excerpt: "", body: "",
  published: true, featured: false,
  seoTitle: "", seoDescription: "", focusKeyword: "",
  ogImage: "", canonicalUrl: "", noindex: false,
  keyTakeaway: "", faqItems: [],
  authorName: "Karen Alexandra",
  authorBio: "Brand Marketing Director with 10+ years building luxury fashion, travel and tech brands.",
};

export default function NewFashionNewsPage() {
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
    const res = await fetch("/api/admin/fashion-news", {
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
    router.push("/admin/fashion-news");
  }

  return (
    <div>
      <h1 className="text-2xl font-light mb-8">New Fashion News Article</h1>
      <form onSubmit={handleSubmit} className="grid gap-8" style={{ gridTemplateColumns: "minmax(0, 1fr) 360px" }}>
        <div className="space-y-5 min-w-0">
          <FashionNewsFormFields form={form} set={set} />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-4 pt-2">
            <button type="submit" disabled={saving}
              className="text-xs tracking-[0.15em] uppercase bg-[var(--charcoal)] text-[var(--cream)] px-6 py-3 hover:opacity-80 transition-opacity disabled:opacity-40">
              {saving ? "Saving…" : "Publish"}
            </button>
            <button type="button" onClick={() => router.push("/admin/fashion-news")}
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
