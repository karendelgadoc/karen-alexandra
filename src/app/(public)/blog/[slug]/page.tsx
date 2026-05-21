import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAllBlogSlugs, getBlogPostBySlug } from "@/lib/blog-db";
import { sanitizeHtml } from "@/lib/sanitize";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Karen Alexandra`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  // Body paragraphs — double newline separates paragraphs
  const paragraphs = post.body.split(/\n\n+/).filter(Boolean);

  return (
    <>
      {/* Hero */}
      {post.heroImage && (
        <section className="w-full aspect-[16/7] overflow-hidden bg-[var(--beige)] relative">
          <Image
            src={post.heroImage}
            alt={post.heroAlt}
            fill
            className="object-cover"
            priority
          />
        </section>
      )}

      {/* Article */}
      <article className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-10">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--taupe)] mb-3">
            {post.category} &middot;{" "}
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="text-4xl md:text-5xl font-light leading-tight mb-6">
            {post.title}
          </h1>
          <p className="text-lg text-[var(--muted)] leading-relaxed border-l-2 border-[var(--taupe)] pl-5">
            {post.excerpt}
          </p>
        </div>

        <hr className="border-[var(--beige)] mb-10" />

        <div className="space-y-5 text-[var(--muted)] leading-relaxed">
          {paragraphs.map((para, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: sanitizeHtml(para) }} />
          ))}
        </div>
      </article>

      {/* Work with Me CTA */}
      <div className="max-w-2xl mx-auto px-6 pb-4">
        <hr className="border-[var(--beige)] mb-12" />
        <div className="border border-[var(--beige)] p-10 text-center space-y-5">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--taupe)]">
            Work with Me
          </p>
          <h2 className="text-2xl font-light">
            Interested in a collaboration?
          </h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed max-w-sm mx-auto">
            I partner with luxury and premium lifestyle brands on blog, YouTube, and social — and work with fashion brands on e-commerce strategy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              href="/services"
              className="text-xs tracking-[0.2em] uppercase border border-[var(--charcoal)] px-8 py-3 hover:bg-[var(--charcoal)] hover:text-[var(--cream)] transition-colors"
            >
              View Services
            </Link>
            <Link
              href="/contact"
              className="text-xs tracking-[0.2em] uppercase bg-[var(--charcoal)] text-[var(--cream)] px-8 py-3 hover:bg-[var(--taupe)] transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>

      {/* Back link */}
      <div className="max-w-2xl mx-auto px-6 pb-20 pt-10">
        <Link
          href="/blog"
          className="text-xs tracking-[0.2em] uppercase text-[var(--taupe)] hover:text-[var(--charcoal)] transition-colors"
        >
          ← Back to Blog
        </Link>
      </div>
    </>
  );
}
