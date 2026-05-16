import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { posts, getPost, type Section } from "@/lib/posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Karen Alexandra`,
    description: post.excerpt,
  };
}

function renderSection(section: Section, i: number) {
  return (
    <div key={i} className="mb-10">
      {section.heading && (
        <div className="mb-4">
          {section.headingLevel === "h3" ? (
            <h3 className="text-2xl font-light">
              {section.italic ? <em>{section.heading}</em> : section.heading}
            </h3>
          ) : (
            <h2 className="text-3xl font-light">
              {section.italic ? <em>{section.heading}</em> : section.heading}
            </h2>
          )}
        </div>
      )}

      {section.image && (
        <div className="my-8 overflow-hidden bg-[var(--beige)]">
          <Image
            src={section.image}
            alt={section.imageAlt ?? ""}
            width={1200}
            height={800}
            className="w-full h-auto"
          />
        </div>
      )}

      {section.body && (
        <div className="text-[var(--muted)] leading-relaxed space-y-4">
          {section.body.split("\n\n").map((para, j) => (
            <p key={j} dangerouslySetInnerHTML={{ __html: para }} />
          ))}
        </div>
      )}

      {section.list && (
        <ul className="space-y-4 mt-4">
          {section.list.map((item, j) => {
            const [label, ...rest] = item.split(": ");
            return (
              <li key={j} className="flex gap-3 text-[var(--muted)] leading-relaxed">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--taupe)] shrink-0" />
                <span>
                  <strong className="text-[var(--charcoal)] font-medium">
                    {label}:
                  </strong>{" "}
                  {rest.join(": ")}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      {/* Hero */}
      <section className="w-full aspect-[16/7] overflow-hidden bg-[var(--beige)] relative">
        <Image
          src={post.heroImage}
          alt={post.heroAlt}
          fill
          className="object-cover"
          priority
        />
      </section>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <p className="text-xs tracking-[0.2em] uppercase text-[var(--taupe)] mb-3">
            {post.category} &middot;{" "}
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
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

        {post.sections.map((section, i) => renderSection(section, i))}
      </article>

      {/* Back link */}
      <div className="max-w-3xl mx-auto px-6 pb-20">
        <hr className="border-[var(--beige)] mb-10" />
        <Link
          href="/blog"
          className="text-xs tracking-[0.2em] uppercase text-[var(--taupe)] hover:text-[var(--charcoal)] transition-colors"
        >
          ← All Case Studies
        </Link>
      </div>
    </>
  );
}
