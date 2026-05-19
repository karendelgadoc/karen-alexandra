"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { BlogPostInput } from "@/lib/blog-db";
import { BlogPostFormFields } from "../../new/page";
import SeoPanel from "@/components/admin/SeoPanel";

interface Props { params: Promise<{ id: string }> }

export default function EditBlogPostPage({ params }: Props) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [form, setForm] = useState<BlogPostInput | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then(({ id: postId }) => {
      setId(postId);
      fetch(`/api/admin/blog/${postId}`)
        .then((r) => r.json())
        .then((post) =>
          setForm({
            slug: post.slug,
            title: post.title,
            date: post.date,
            category: post.category,
            heroImage: post.heroImage,
            heroAlt: post.heroAlt,
            excerpt: post.excerpt,
            body: post.body,
            published: post.published,
            featured: post.featured,
            seoTitle: post.seoTitle ?? "",
            seoDescription: post.seoDescription ?? "",
            focusKeyword: post.focusKeyword ?? "",
            ogImage: post.ogImage ?? "",
            canonicalUrl: post.canonicalUrl ?? "",
            noindex: post.noindex ?? false,
            keyTakeaway: post.keyTakeaway ?? "",
            faqItems: post.faqItems ?? [],
            authorName: post.authorName ?? "Karen Alexandra",
            authorBio: post.authorBio ?? "",
          })
        );
    });
  }, [params]);

  function set<K extends keyof BlogPostInput>(key: K, value: BlogPostInput[K]) {
    setForm((f) => (f ? { ...f, [key]: value } : f));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !form) return;
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/admin/blog/${id}`, {
      method: "PUT",
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

  if (!form) return <p className="text-sm text-[var(--muted)]">Loading…</p>;

  return (
    <div>
      <h1 className="text-2xl font-light mb-8">Edit Blog Post</h1>
      <form onSubmit={handleSubmit} className="grid gap-8" style={{ gridTemplateColumns: "minmax(0, 1fr) 360px" }}>
        <div className="space-y-5 min-w-0">
          <BlogPostFormFields form={form} set={set} />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-4 pt-2">
            <button type="submit" disabled={saving}
              className="text-xs tracking-[0.15em] uppercase bg-[var(--charcoal)] text-[var(--cream)] px-6 py-3 hover:opacity-80 transition-opacity disabled:opacity-40">
              {saving ? "Saving…" : "Save Changes"}
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
