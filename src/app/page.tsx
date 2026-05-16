import Link from "next/link";
import Image from "next/image";
import { posts } from "@/lib/posts";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="min-h-[90vh] flex items-center justify-center px-6 py-24 text-center">
        <div className="max-w-3xl">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--taupe)] mb-6">
            Brand Marketing Director
          </p>
          <h1 className="text-6xl md:text-8xl font-light tracking-tight leading-none mb-6">
            The Art of Well.
          </h1>
          <p className="text-lg md:text-xl font-light text-[var(--muted)] max-w-xl mx-auto mb-10">
            A global citizen&apos;s guide to well living — curated through brand
            strategy, digital merchandising, and the stories worth telling.
          </p>
          <div className="flex items-center justify-center gap-6">
            <Link
              href="/blog"
              className="text-xs tracking-[0.2em] uppercase border border-[var(--charcoal)] px-8 py-3 hover:bg-[var(--charcoal)] hover:text-[var(--cream)] transition-colors"
            >
              Case Studies
            </Link>
            <Link
              href="/contact"
              className="text-xs tracking-[0.2em] uppercase text-[var(--taupe)] hover:text-[var(--charcoal)] transition-colors"
            >
              Get in Touch →
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <hr className="border-[var(--beige)]" />
      </div>

      {/* Case Studies Preview */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--taupe)] mb-2">
              Selected Work
            </p>
            <h2 className="text-3xl font-light">Case Studies</h2>
          </div>
          <Link
            href="/blog"
            className="text-xs tracking-[0.15em] uppercase text-[var(--muted)] hover:text-[var(--taupe)] transition-colors hidden md:block"
          >
            View All →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <div className="aspect-[4/3] overflow-hidden bg-[var(--beige)] mb-5">
                <Image
                  src={post.heroImage}
                  alt={post.heroAlt}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-xs tracking-[0.2em] uppercase text-[var(--taupe)] mb-2">
                {post.category}
              </p>
              <h3 className="text-xl font-light mb-2 group-hover:text-[var(--taupe)] transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <hr className="border-[var(--beige)]" />
      </div>

      {/* Intro Strip */}
      <section className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--taupe)] mb-4">
            About
          </p>
          <h2 className="text-3xl font-light leading-snug mb-6">
            Brand strategy rooted in lived experience.
          </h2>
          <p className="text-[var(--muted)] leading-relaxed mb-6">
            I&apos;m Karen Alexandra — Brand Marketing Director with a background
            spanning luxury fashion, travel, and tech. From growing fashion blogs
            to 30k Instagram followers to launching a Peruvian-inspired dog
            apparel brand, I bring a digital-first, data-informed approach to
            every brand I touch.
          </p>
          <Link
            href="/about"
            className="text-xs tracking-[0.2em] uppercase text-[var(--taupe)] hover:text-[var(--charcoal)] transition-colors"
          >
            Read More →
          </Link>
        </div>
        <div className="aspect-[3/4] overflow-hidden bg-[var(--beige)]">
          <Image
            src="http://karenalexandra.com/wp-content/uploads/2025/06/IMG_2439.jpg"
            alt="Karen Alexandra"
            width={600}
            height={800}
            className="w-full h-full object-cover"
          />
        </div>
      </section>
    </>
  );
}
