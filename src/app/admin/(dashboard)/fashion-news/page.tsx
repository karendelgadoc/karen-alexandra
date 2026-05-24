"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog-db";

export default function AdminFashionNewsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/fashion-news")
      .then((r) => r.json())
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    await fetch(`/api/admin/fashion-news/${id}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light">Fashion News</h1>
          <p className="text-xs text-stone-400 mt-1">Articles for the /fashion-news page · separate from blog posts</p>
        </div>
        <Link
          href="/admin/fashion-news/new"
          className="text-xs tracking-[0.15em] uppercase bg-[var(--charcoal)] text-[var(--cream)] px-5 py-2.5 hover:opacity-80 transition-opacity"
        >
          + New Article
        </Link>
      </div>

      {loading ? (
        <p className="text-[var(--muted)] text-sm">Loading…</p>
      ) : posts.length === 0 ? (
        <div className="text-sm text-[var(--muted)] py-8 text-center border border-dashed border-stone-200">
          <p>No fashion news articles yet.</p>
          <p className="mt-1 text-xs">Move a blog post here using the "→ Fashion News" button in Blog Posts, or create a new article above.</p>
        </div>
      ) : (
        <div className="divide-y divide-[var(--beige)]">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center justify-between py-4 gap-4">
              <div className="min-w-0">
                <p className="text-sm font-light truncate">{post.title}</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  {post.date}
                  {!post.published && <span className="ml-2 text-amber-600">Draft</span>}
                  {post.featured && <span className="ml-2 text-emerald-600">Featured</span>}
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <Link
                  href={`/fashion-news/${post.slug}`}
                  className="text-xs tracking-[0.1em] uppercase text-stone-400 hover:text-stone-600 transition-colors"
                  target="_blank"
                >
                  View
                </Link>
                <Link
                  href={`/admin/fashion-news/${post.id}/edit`}
                  className="text-xs tracking-[0.1em] uppercase text-[var(--taupe)] hover:text-[var(--charcoal)] transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post.id, post.title)}
                  className="text-xs tracking-[0.1em] uppercase text-red-400 hover:text-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
