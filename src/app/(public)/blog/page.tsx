import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/posts-db";

export const metadata: Metadata = {
  title: "Case Studies — Karen Alexandra",
  description:
    "Brand marketing and digital merchandising case studies by Karen Alexandra.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  return (
    <>
      <section className="max-w-6xl mx-auto px-6 py-20">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--taupe)] mb-4">
          Selected Work
        </p>
        <h1 className="text-5xl font-light mb-3">Case Studies</h1>
        <p className="text-[var(--muted)] max-w-xl">
          A collection of brand-building projects spanning luxury fashion, travel
          content, and e-commerce.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <hr className="border-[var(--beige)]" />
      </div>

      <section className="max-w-6xl mx-auto px-6 py-16 space-y-16">
        {posts.map((post, i) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group grid md:grid-cols-2 gap-10 items-center"
          >
            <div
              className={`aspect-[4/3] overflow-hidden bg-[var(--beige)] ${
                i % 2 === 1 ? "md:order-2" : ""
              }`}
            >
              <Image
                src={post.heroImage}
                alt={post.heroAlt}
                width={800}
                height={600}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className={i % 2 === 1 ? "md:order-1" : ""}>
              <p className="text-xs tracking-[0.2em] uppercase text-[var(--taupe)] mb-3">
                {post.category} &middot;{" "}
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
              <h2 className="text-3xl font-light mb-4 group-hover:text-[var(--taupe)] transition-colors">
                {post.title}
              </h2>
              <p className="text-[var(--muted)] leading-relaxed mb-6">
                {post.excerpt}
              </p>
              <span className="text-xs tracking-[0.2em] uppercase text-[var(--taupe)] group-hover:text-[var(--charcoal)] transition-colors">
                Read Case Study →
              </span>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
