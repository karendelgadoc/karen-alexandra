import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { AboutContent } from "@/lib/page-content-db";
import type { Post } from "@/lib/posts";

const credentialItems = [
  { label: "Instagram Growth", value: "30K", note: "Fashion & travel audience built organically" },
  { label: "Pinterest Reach", value: "3M", note: "Monthly viewers at peak" },
  { label: "Brand Partners", value: "20+", note: "Shopbop, Four Seasons, IHG, Citizens of Humanity and more" },
  { label: "Industries", value: "3", note: "Fashion, Travel, Tech" },
];

export function HeroSection({ c }: { c: AboutContent }) {
  return (
    <>
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--taupe)] mb-4">{c.hero.eyebrow}</p>
        <h1 className="text-5xl md:text-6xl font-light leading-tight max-w-2xl mx-auto">{c.hero.headline}</h1>
      </section>
      <div className="max-w-6xl mx-auto px-6"><hr className="border-[var(--beige)]" /></div>
    </>
  );
}

export function BioSection({ c }: { c: AboutContent }) {
  return (
    <>
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-start">
        <div className="aspect-[3/4] overflow-hidden bg-[var(--beige)] sticky top-28">
          <Image src={c.portraitUrl} alt="Karen Alexandra" width={600} height={800} className="w-full h-full object-cover" />
        </div>
        <div className="space-y-6 text-[var(--muted)] leading-relaxed">
          <p className="text-2xl font-light text-[var(--charcoal)] leading-snug">
            I&apos;m Karen Alexandra — Brand Marketing Director with roots in fashion merchandising and a passion for digital storytelling.
          </p>
          <p>
            My career began at Nordstrom, where I studied fashion merchandising and built{" "}
            <span className="text-[var(--charcoal)] font-medium">Little Black Shell</span>, a luxury fashion blog that grew to 30,000 Instagram followers. The blog became a strategic portfolio that landed me brand partnerships with Shopbop, Citizens of Humanity, Agolde, Sisley Paris, Makeup Forever, ASOS, and River Island.
          </p>
          <p>
            I later pivoted to luxury travel, rebranding as{" "}
            <span className="text-[var(--charcoal)] font-medium">Lifestyle Traveler</span>{" "}and growing my Pinterest presence to 3 million monthly viewers. Through partnerships with Four Seasons Hotels & Resorts, IHG, and international tourism boards, I refined the art of curating aspirational experiences digitally.
          </p>
          <p>
            Most recently, I co-founded{" "}
            <span className="text-[var(--charcoal)] font-medium">Mia The New Yorker</span>, a Peruvian-inspired fashion e-commerce brand launched October 2024. I led buying, digital merchandising, and Shopify store management — translating traditional merchandising principles into a data-driven digital environment.
          </p>
          <p>Today I bring this cross-industry expertise to luxury and premium fashion brands, helping them build authentic digital presences that convert — from e-commerce strategy to brand partnerships that resonate.</p>
          <div className="pt-4">
            <Link href="/contact" className="text-xs tracking-[0.2em] uppercase border border-[var(--charcoal)] px-8 py-3 hover:bg-[var(--charcoal)] hover:text-[var(--cream)] transition-colors inline-block">
              Work with Me
            </Link>
          </div>
        </div>
      </section>
      <div className="max-w-6xl mx-auto px-6"><hr className="border-[var(--beige)]" /></div>
    </>
  );
}

export function CredentialsSection() {
  return (
    <>
      <section className="max-w-6xl mx-auto px-6 py-20">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--taupe)] mb-12 text-center">By the Numbers</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {credentialItems.map(({ label, value, note }) => (
            <div key={label} className="text-center">
              <p className="text-4xl md:text-5xl font-light text-[var(--charcoal)] mb-2">{value}</p>
              <p className="text-xs tracking-[0.15em] uppercase text-[var(--taupe)] mb-2">{label}</p>
              <p className="text-xs text-[var(--muted)] leading-relaxed">{note}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="max-w-6xl mx-auto px-6"><hr className="border-[var(--beige)]" /></div>
    </>
  );
}

export function CaseStudiesPreviewSection({ posts }: { posts: Post[] }) {
  return (
    <>
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="flex items-end justify-between mb-10 md:mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--taupe)] mb-2">Selected Work</p>
            <h2 className="text-2xl md:text-3xl font-light">Case Studies</h2>
          </div>
          <Link href="/case-studies" className="text-xs tracking-[0.15em] uppercase text-[var(--muted)] hover:text-[var(--taupe)] transition-colors hidden md:block">View All →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/case-studies/${post.slug}`} className="group block">
              <div className="aspect-[4/3] overflow-hidden bg-[var(--beige)] mb-4 md:mb-5">
                <Image src={post.heroImage} alt={post.heroAlt} width={800} height={600} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <p className="text-xs tracking-[0.2em] uppercase text-[var(--taupe)] mb-2">{post.category}</p>
              <h3 className="text-lg md:text-xl font-light mb-2 group-hover:text-[var(--taupe)] transition-colors">{post.title}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
      <div className="max-w-6xl mx-auto px-6"><hr className="border-[var(--beige)]" /></div>
    </>
  );
}

export function GallerySection({ c }: { c: AboutContent }) {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-24">
      <div className="grid grid-cols-3 gap-3">
        {c.galleryImages.map((src, i) => (
          <div key={i} className="aspect-square overflow-hidden bg-[var(--beige)]">
            <Image src={src} alt="Karen Alexandra" width={400} height={400} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        ))}
      </div>
    </section>
  );
}

export interface AboutExtraProps { posts: Post[]; }

export function buildAboutSectionMap(c: AboutContent, extra: AboutExtraProps): Record<string, ReactNode> {
  return {
    "hero":                  <HeroSection c={c} />,
    "bio":                   <BioSection c={c} />,
    "credentials":           <CredentialsSection />,
    "case-studies-preview":  <CaseStudiesPreviewSection posts={extra.posts} />,
    "gallery":               <GallerySection c={c} />,
  };
}
