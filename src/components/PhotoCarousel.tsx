"use client";

import { useRef } from "react";
import Image from "next/image";

const BASE = "https://5xkq5mmr.us-east.insforge.app/api/storage/buckets/blog-images/objects/site%2F";

const photos = [
  { src: `${BASE}IMG_6819.jpg`, alt: "Travel postcard" },
  { src: `${BASE}IMG_4585-edited.jpg`, alt: "Travel postcard" },
  { src: `${BASE}IMG_4593.jpg`, alt: "Travel postcard" },
  { src: `${BASE}IMG_4534.jpg`, alt: "Travel postcard" },
];

export default function PhotoCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "prev" | "next") {
    if (!trackRef.current) return;
    const itemW = trackRef.current.querySelector("div")?.offsetWidth ?? 0;
    trackRef.current.scrollBy({ left: dir === "next" ? itemW + 16 : -(itemW + 16), behavior: "smooth" });
  }

  return (
    <section className="py-12 md:py-16 bg-white overflow-hidden">
      <p className="text-center text-[10px] tracking-[0.35em] uppercase text-[var(--muted)] mb-8 md:mb-10">
        Postcards of a Global Citizen
      </p>

      <div className="relative">
        {/* Prev */}
        <button
          onClick={() => scroll("prev")}
          aria-label="Previous"
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-9 md:h-9 border border-[var(--charcoal)] flex items-center justify-center text-sm bg-white hover:bg-[var(--beige)] transition-colors"
        >
          ‹
        </button>

        {/* Scrollable track */}
        <div
          ref={trackRef}
          className="flex gap-3 md:gap-4 overflow-x-auto scroll-smooth px-12 md:px-16"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        >
          {photos.map((photo, i) => (
            <div
              key={i}
              className="flex-none aspect-[3/4] bg-[var(--beige)] overflow-hidden w-[62vw] sm:w-[38vw] md:w-[26vw] lg:w-[22vw]"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={400}
                height={533}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Next */}
        <button
          onClick={() => scroll("next")}
          aria-label="Next"
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-9 md:h-9 border border-[var(--charcoal)] flex items-center justify-center text-sm bg-white hover:bg-[var(--beige)] transition-colors"
        >
          ›
        </button>
      </div>
    </section>
  );
}
