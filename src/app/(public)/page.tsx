import Link from "next/link";
import Image from "next/image";
import PhotoCarousel from "@/components/PhotoCarousel";

export default function HomePage() {
  return (
    <>
      {/* Hero — full-height split on desktop, stacked on mobile */}
      <section className="flex flex-col md:flex-row md:h-[calc(100vh-56px)]">
        {/* Image — top on mobile, right on desktop */}
        <div className="w-full md:w-1/2 relative overflow-hidden h-[55vw] md:h-auto order-1 md:order-2">
          <Image
            src="https://5xkq5mmr.us-east.insforge.app/api/storage/buckets/blog-images/objects/site%2FIMG_6819.jpg"
            alt="Karen Alexandra lifestyle"
            fill
            className="object-cover object-top"
            priority
          />
        </div>

        {/* Text — below image on mobile, left on desktop */}
        <div className="w-full md:w-1/2 bg-white flex flex-col justify-end p-8 md:p-14 md:pb-16 order-2 md:order-1 py-10 md:py-16">
          <h1 className="text-4xl sm:text-5xl font-light tracking-[0.18em] uppercase leading-snug mb-4">
            The Art<br />of Well.
          </h1>
          <p className="text-sm font-light text-[var(--muted)] tracking-wide">
            A global citizen&apos;s guide to well living.
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <hr className="border-[var(--beige)]" />
      </div>

      {/* Intro Strip */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--taupe)] mb-4">
            About
          </p>
          <h2 className="text-2xl md:text-3xl font-light leading-snug mb-6">
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
            src="https://5xkq5mmr.us-east.insforge.app/api/storage/buckets/blog-images/objects/site%2FIMG_4534.jpg"
            alt="Karen Alexandra"
            width={600}
            height={800}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Photo carousel */}
      <PhotoCarousel />
    </>
  );
}
