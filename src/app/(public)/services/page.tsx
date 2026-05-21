import type { Metadata } from "next";
import Link from "next/link";
import CalendlyPopup from "@/components/CalendlyPopup";

export const metadata: Metadata = {
  title: "Work with Me — Karen Alexandra",
  description:
    "E-commerce strategy and digital marketing for luxury and premium fashion brands. Brand partnerships for luxury lifestyle brands.",
};

const consultingServices = [
  "E-commerce strategy & Shopify optimization",
  "Digital merchandising & product curation",
  "Conversion rate optimization",
  "Content strategy & editorial calendar",
  "Social channel growth & management",
  "Campaign planning & execution",
];

const partnershipTypes = [
  "Sponsored blog features & long-form editorial",
  "YouTube integrations & dedicated videos",
  "Instagram posts, reels & stories",
  "Multi-platform campaign packages",
  "Hotel & destination features",
  "Wellness, beauty & lifestyle collaborations",
];

const steps = [
  {
    n: "01",
    title: "Intro Call",
    body: "A 30-minute conversation to understand your brand, goals, and where you want to grow.",
  },
  {
    n: "02",
    title: "Proposal",
    body: "A tailored scope of work with clear deliverables, timelines, and investment.",
  },
  {
    n: "03",
    title: "Kick-off",
    body: "We align on strategy and get to work. Most engagements begin within two weeks of signing.",
  },
];

const testimonials = [
  {
    quote:
      "Karen provides feel good content from all over the spectrum — whether it's a business hack, mindset tip, travel inspiration, or design. She knows how to capture an audience by being raw and providing insight we all love to hear.",
    name: "@alexmcguire",
    role: "Community Member",
  },
  {
    quote:
      "She shows up all the time and I can really relate to what she's going through and the adventures she's choosing. She is not acting for the camera — she's really sharing her journey.",
    name: "@elizabethmanette",
    role: "Community Member",
  },
  {
    quote:
      "She has a 'real girl in the real world' vibe, hustling to bring her dreams to fruition in true, understandable and attainable ways.",
    name: "@deannanfox",
    role: "Community Member",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--taupe)] mb-4">
          Work with Me
        </p>
        <h1 className="text-5xl md:text-6xl font-light leading-tight max-w-2xl mx-auto mb-6">
          Let&apos;s build something remarkable together.
        </h1>
        <p className="text-[var(--muted)] max-w-xl mx-auto leading-relaxed">
          I work with luxury and premium brands to grow their digital presence — from e-commerce strategy to partnerships that resonate.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <hr className="border-[var(--beige)]" />
      </div>

      {/* Two tracks */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-px bg-[var(--beige)]">
          {/* Track 1: Consulting */}
          <div className="bg-[var(--cream)] p-10 md:p-14 space-y-8">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[var(--taupe)] mb-3">
                Consulting
              </p>
              <h2 className="text-3xl font-light mb-4">
                E-Commerce &amp; Digital Marketing
              </h2>
              <p className="text-[var(--muted)] leading-relaxed">
                For luxury and premium fashion brands ready to grow their digital revenue. Retainer-based engagements with 3-month minimums — so we have time to do the work properly.
              </p>
            </div>
            <ul className="space-y-3">
              {consultingServices.map((s) => (
                <li key={s} className="flex gap-3 text-sm text-[var(--muted)]">
                  <span className="mt-[6px] w-1 h-1 rounded-full bg-[var(--taupe)] shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
            <div>
              <p className="text-xs text-[var(--muted)] mb-6 italic">
                Custom quote — let&apos;s talk.
              </p>
              <Link
                href="/contact?type=consulting"
                className="text-xs tracking-[0.2em] uppercase border border-[var(--charcoal)] px-8 py-3 hover:bg-[var(--charcoal)] hover:text-[var(--cream)] transition-colors inline-block"
              >
                Start a Conversation
              </Link>
            </div>
          </div>

          {/* Track 2: Partnerships */}
          <div className="bg-[var(--cream)] p-10 md:p-14 space-y-8">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[var(--taupe)] mb-3">
                Brand Partnerships
              </p>
              <h2 className="text-3xl font-light mb-4">
                Influence &amp; Collaboration
              </h2>
              <p className="text-[var(--muted)] leading-relaxed">
                For luxury and premium lifestyle brands — fashion, hotels, travel, wellness, beauty, and interiors — seeking authentic content and audience reach across blog, YouTube, and social.
              </p>
            </div>
            <ul className="space-y-3">
              {partnershipTypes.map((s) => (
                <li key={s} className="flex gap-3 text-sm text-[var(--muted)]">
                  <span className="mt-[6px] w-1 h-1 rounded-full bg-[var(--taupe)] shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
            <div>
              <p className="text-xs text-[var(--muted)] mb-6 italic">
                Custom quote — let&apos;s talk.
              </p>
              <Link
                href="/contact?type=partnership"
                className="text-xs tracking-[0.2em] uppercase border border-[var(--charcoal)] px-8 py-3 hover:bg-[var(--charcoal)] hover:text-[var(--cream)] transition-colors inline-block"
              >
                Request Media Kit
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <hr className="border-[var(--beige)]" />
      </div>

      {/* Process */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--taupe)] mb-16 text-center">
          How It Works
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {steps.map(({ n, title, body }) => (
            <div key={n}>
              <p
                className="text-6xl font-light text-[var(--beige)] mb-5 leading-none select-none"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {n}
              </p>
              <h3 className="text-lg font-light mb-3">{title}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <hr className="border-[var(--beige)]" />
      </div>

      {/* Client testimonial */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--taupe)] mb-12 text-center">
          What Clients Say
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            {
              quote:
                "I so appreciated your time! And after our call, I already got started on our new TikTok posting strategy. You're a rock star!",
              name: "Stacy Flax",
              role: "Founder, Bored Rebel",
            },
            {
              quote:
                "Had an insightful and inspiring chat with Karen today. We talked about my marketing strategy, pivots to a new ideal client, and emerging trends. I highly recommend connecting with her if you're looking to scale or pivot — her expertise in brand marketing and her kindness are off the charts!",
              name: "Sandra Kaye",
              role: "Consulting Client",
            },
          ].map(({ quote, name, role }) => (
            <div key={name} className="border border-[var(--beige)] p-8 space-y-5">
              <span
                className="block text-5xl font-light text-[var(--beige)] leading-none select-none"
                style={{ fontFamily: "Georgia, serif" }}
              >
                &ldquo;
              </span>
              <p className="text-sm text-[var(--charcoal)] leading-relaxed italic">
                {quote}
              </p>
              <div>
                <p className="text-sm font-medium text-[var(--charcoal)]">{name}</p>
                <p className="text-xs text-[var(--muted)]">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <hr className="border-[var(--beige)]" />
      </div>

      {/* Audience testimonials */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--taupe)] mb-12 text-center">
          What the Audience Says
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(({ quote, name, role }, i) => (
            <div key={i} className="border border-[var(--beige)] p-8 space-y-5">
              <span
                className="block text-5xl font-light text-[var(--beige)] leading-none select-none"
                style={{ fontFamily: "Georgia, serif" }}
              >
                &ldquo;
              </span>
              <p className="text-sm text-[var(--muted)] leading-relaxed italic">
                {quote}
              </p>
              <div>
                <p className="text-sm font-medium text-[var(--charcoal)]">{name}</p>
                <p className="text-xs text-[var(--muted)]">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <hr className="border-[var(--beige)]" />
      </div>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--taupe)] mb-4">
          Ready to Begin?
        </p>
        <h2 className="text-4xl md:text-5xl font-light mb-10 max-w-lg mx-auto">
          Let&apos;s make it happen.
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <CalendlyPopup label="Book a 30-min Intro Call" />
          <Link
            href="/contact"
            className="text-xs tracking-[0.2em] uppercase border border-[var(--charcoal)] px-10 py-3 hover:bg-[var(--charcoal)] hover:text-[var(--cream)] transition-colors"
          >
            Send a Message
          </Link>
        </div>
      </section>
    </>
  );
}
