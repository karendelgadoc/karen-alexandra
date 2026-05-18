import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllBlogPosts, type BlogCategory } from "@/lib/blog-db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog — Karen Alexandra",
  description: "Fashion, lifestyle, travel and wellness from a global citizen.",
};

const CATEGORIES: { label: string; value: BlogCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Fashion", value: "fashion" },
  { label: "Lifestyle", value: "lifestyle" },
  { label: "Travel", value: "travel" },
  { label: "Wellness", value: "wellness" },
];

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function BlogPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const activeCategory = CATEGORIES.find((c) => c.value === category)?.value ?? "all";
  const posts = await getAllBlogPosts(
    activeCategory !== "all" ? (activeCategory as BlogCategory) : undefined
  );

  return (
    <>
      {/* Header */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-10">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--taupe)] mb-4">
          The Journal
        </p>
        <h1 className="text-5xl font-light">Blog</h1>
      </section>

      {/* Category nav */}
      <div className="max-w-6xl mx-auto px-6 pb-10">
        <nav className="flex gap-1 flex-wrap">
          {CATEGORIES.map(({ label, value }) => {
            const isActive = value === activeCategory;
            const href = value === "all" ? "/blog" : `/blog?category=${value}`;
            return (
              <Link
                key={value}
                href={href}
                className={`text-[11px] tracking-[0.2em] uppercase px-4 py-2 border transition-colors ${
                  isActive
                    ? "border-[var(--charcoal)] bg-[var(--charcoal)] text-[var(--cream)]"
                    : "border-stone-300 text-[var(--muted)] hover:border-[var(--charcoal)] hover:text-[var(--charcoal)]"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <hr className="border-[var(--beige)]" />
      </div>

      {/* Posts grid */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        {posts.length === 0 ? (
          <p className="text-[var(--muted)] py-16 text-center">No posts yet in this category.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <div className="aspect-[3/2] overflow-hidden bg-[var(--beige)] mb-4">
                  {post.heroImage ? (
                    <Image
                      src={post.heroImage}
                      alt={post.heroAlt}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-[var(--beige)]" />
                  )}
                </div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--taupe)] mb-2">
                  {post.category} &middot;{" "}
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <h2 className="text-lg font-light mb-2 group-hover:text-[var(--taupe)] transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
