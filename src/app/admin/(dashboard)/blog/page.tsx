"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog-db";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/blog")
      .then((r) => r.json())
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleMoveToFashionNews(id: string, title: string) {
    if (!confirm(`Move "${title}" to Fashion News? It will disappear from Blog Posts and appear on /fashion-news.`)) return;
    const res = await fetch(`/api/admin/blog/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: "fashion-news" }),
    });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } else {
      const err = await res.json().catch(() => ({}));
      alert(`Failed to move: ${err.error ?? res.status}`);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-light">Blog Posts</h1>
        <Link
          href="/admin/blog/new"
          className="text-xs tracking-[0.15em] uppercase bg-[var(--charcoal)] text-[var(--cream)] px-5 py-2.5 hover:opacity-80 transition-opacity"
        >
          + New Post
        </Link>
      </div>

      {loading ? (
        <p className="text-[var(--muted)] text-sm">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="text-[var(--muted)] text-sm">No blog posts yet.</p>
      ) : (
        <div className="divide-y divide-[var(--beige)]">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center justify-between py-4 gap-4">
              <div className="min-w-0">
                <p className="text-sm font-light truncate">{post.title}</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  {post.category} &middot; {post.date}
                  {!post.published && <span className="ml-2 text-amber-600">Draft</span>}
                  {post.featured && <span className="ml-2 text-emerald-600">Featured</span>}
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <button
                  onClick={() => handleMoveToFashionNews(post.id, post.title)}
                  className="text-xs tracking-[0.1em] uppercase text-stone-400 hover:text-stone-700 transition-colors"
                  title="Move to Fashion News section"
                >
                  → Fashion News
                </button>
                <Link
                  href={`/admin/blog/${post.id}/edit`}
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
