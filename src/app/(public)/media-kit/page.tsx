import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Media Kit — Karen Alexandra",
  description:
    "Partner with Karen Alexandra — luxury lifestyle content creator with 30K Instagram followers, 3M Pinterest monthly views, and brand partnerships with Four Seasons, IHG, Shopbop, and more.",
};

const stats = [
  { value: "30K", label: "Instagram Followers", note: "Luxury fashion & lifestyle audience" },
  { value: "3M", label: "Pinterest Monthly Views", note: "At peak, curated aspirational content" },
  { value: "20+", label: "Brand Partners", note: "Four Seasons, IHG, Shopbop, Citizens of Humanity" },
  { value: "3", label: "Content Channels", note: "Blog, YouTube, Instagram" },
];

const categories = [
  "Luxury Fashion",
  "Premium Hotels & Resorts",
  "Travel & Destinations",
  "Wellness & Beauty",
  "Lifestyle & Interiors",
  "Food & Dining",
];

const partnershipFormats = [
  {
    title: "Blog Feature",
    body: "Long-form editorial content published on karenalexandra.com. Evergreen, SEO-optimized, and linked across social channels.",
  },
  {
    title: "YouTube Integration",
    body: "Dedicated segment or full video feature. Authentic storytelling for brands that deserve more than 15 seconds.",
  },
  {
    title: "Instagram Post / Reel",
    body: "Curated, on-brand visuals with strong editorial voice. Stories, carousel posts, and reels available.",
  },
  {
    title: "Multi-Platform Package",
    body: "Blog + YouTube + Instagram together. Maximum reach, cohesive storytelling across every channel.",
  },
];

const pastPartners = [
  "Four Seasons Hotels & Resorts",
  "IHG Hotels & Resorts",
  "Shopbop",
  "Citizens of Humanity",
  "Agolde",
  "Sisley Paris",
  "Makeup Forever",
  "ASOS",
  "River Island",
];

export default function MediaKitPage() {
  return (
    <>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--taupe)] mb-4">
          Media Kit
        </p>
        <h1 className="text-5xl md:text-6xl font-light leading-tight max-w-2xl mx-auto mb-6">
          Partner with Karen Alexandra.
        </h1>
        <p className="text-[var(--muted)] max-w-xl mx-auto leading-relaxed">
          Luxury lifestyle content across fashion, hotels, travel, wellness, and beauty — for brands that value authenticity and editorial quality.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <hr className="border-[var(--beige)]" />
      </div>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--taupe)] mb-12 text-center">
          Reach &amp; Audience
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(({ value, label, note }) => (
            <div key={label}>
              <p className="text-5xl font-light text-[var(--charcoal)] mb-2">{value}</p>
              <p className="text-xs tracking-[0.15em] uppercase text-[var(--taupe)] mb-2">{label}</p>
              <p className="text-xs text-[var(--muted)] leading-relaxed">{note}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <hr className="border-[var(--beige)]" />
      </div>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--taupe)] mb-10 text-center">
          Content Categories
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((c) => (
            <span
              key={c}
              className="border border-[var(--beige)] text-sm text-[var(--charcoal)] px-5 py-2"
            >
              {c}
            </span>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <hr className="border-[var(--beige)]" />
      </div>

      {/* Partnership formats */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--taupe)] mb-12 text-center">
          Partnership Formats
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {partnershipFormats.map(({ title, body }) => (
            <div key={title} className="border border-[var(--beige)] p-8 space-y-3">
              <h3 className="text-lg font-light">{title}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <hr className="border-[var(--beige)]" />
      </div>

      {/* Past partners */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--taupe)] mb-10">
          Past Brand Partners
        </p>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {pastPartners.map((p) => (
            <span key={p} className="text-sm text-[var(--muted)]">
              {p}
            </span>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <hr className="border-[var(--beige)]" />
      </div>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--taupe)] mb-4">
          Interested?
        </p>
        <h2 className="text-4xl md:text-5xl font-light mb-10 max-w-md mx-auto">
          Let&apos;s create something together.
        </h2>
        <Link
          href="/contact?type=partnership"
          className="inline-block text-xs tracking-[0.2em] uppercase bg-[var(--charcoal)] text-[var(--cream)] px-12 py-4 hover:bg-[var(--taupe)] transition-colors"
        >
          Get in Touch
        </Link>
      </section>
    </>
  );
}
