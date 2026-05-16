import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Karen Alexandra",
  description:
    "Brand Marketing Director with a background in luxury fashion, travel, and tech.",
};

const credentials = [
  {
    label: "Instagram Growth",
    value: "30K",
    note: "Fashion & travel audience built organically",
  },
  {
    label: "Pinterest Reach",
    value: "3M",
    note: "Monthly viewers at peak",
  },
  {
    label: "Brand Partners",
    value: "20+",
    note: "Shopbop, Four Seasons, IHG, Citizens of Humanity and more",
  },
  {
    label: "Industries",
    value: "3",
    note: "Fashion, Travel, Tech",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--taupe)] mb-4">
          Our Story
        </p>
        <h1 className="text-5xl md:text-6xl font-light leading-tight max-w-2xl mx-auto">
          Brand strategy rooted in lived experience.
        </h1>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <hr className="border-[var(--beige)]" />
      </div>

      {/* Bio Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-start">
        <div className="aspect-[3/4] overflow-hidden bg-[var(--beige)] sticky top-28">
          <Image
            src="https://5xkq5mmr.us-east.insforge.app/api/storage/buckets/blog-images/objects/site%2FIMG_4534.jpg"
            alt="Karen Alexandra"
            width={600}
            height={800}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-6 text-[var(--muted)] leading-relaxed">
          <p className="text-2xl font-light text-[var(--charcoal)] leading-snug">
            I&apos;m Karen Alexandra — Brand Marketing Director with roots in
            fashion merchandising and a passion for digital storytelling.
          </p>
          <p>
            My career began at Nordstrom, where I studied fashion merchandising
            and built{" "}
            <span className="text-[var(--charcoal)] font-medium">
              Little Black Shell
            </span>
            , a luxury fashion blog that grew to 30,000 Instagram followers. The
            blog became a strategic portfolio that landed me brand partnerships
            with Shopbop, Citizens of Humanity, Agolde, Sisley Paris, Makeup
            Forever, ASOS, and River Island.
          </p>
          <p>
            I later pivoted to luxury travel, rebranding as{" "}
            <span className="text-[var(--charcoal)] font-medium">
              Lifestyle Traveler
            </span>{" "}
            and growing my Pinterest presence to 3 million monthly viewers.
            Through partnerships with Four Seasons Hotels & Resorts, IHG, and
            international tourism boards, I refined the art of curating
            aspirational experiences digitally.
          </p>
          <p>
            Most recently, I co-founded{" "}
            <span className="text-[var(--charcoal)] font-medium">
              Mia The New Yorker
            </span>
            , a Peruvian-inspired fashion e-commerce brand launched October
            2024. I led buying, digital merchandising, and Shopify store
            management — translating traditional merchandising principles into a
            data-driven digital environment.
          </p>
          <p>
            Today I bring this cross-industry expertise to tech and travel
            companies, helping brands build authentic digital presences that
            convert.
          </p>
          <div className="pt-4">
            <Link
              href="/contact"
              className="text-xs tracking-[0.2em] uppercase border border-[var(--charcoal)] px-8 py-3 hover:bg-[var(--charcoal)] hover:text-[var(--cream)] transition-colors inline-block"
            >
              Work with Me
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <hr className="border-[var(--beige)]" />
      </div>

      {/* Credentials */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--taupe)] mb-12 text-center">
          By the Numbers
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {credentials.map(({ label, value, note }) => (
            <div key={label} className="text-center">
              <p className="text-4xl md:text-5xl font-light text-[var(--charcoal)] mb-2">
                {value}
              </p>
              <p className="text-xs tracking-[0.15em] uppercase text-[var(--taupe)] mb-2">
                {label}
              </p>
              <p className="text-xs text-[var(--muted)] leading-relaxed">{note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Row */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-3 gap-3">
          {[
            "https://5xkq5mmr.us-east.insforge.app/api/storage/buckets/blog-images/objects/site%2FIMG_4585-edited.jpg",
            "https://5xkq5mmr.us-east.insforge.app/api/storage/buckets/blog-images/objects/site%2FIMG_4593.jpg",
            "https://5xkq5mmr.us-east.insforge.app/api/storage/buckets/blog-images/objects/site%2FIMG_6819.jpg",
          ].map((src, i) => (
            <div key={i} className="aspect-square overflow-hidden bg-[var(--beige)]">
              <Image
                src={src}
                alt="Karen Alexandra"
                width={400}
                height={400}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
