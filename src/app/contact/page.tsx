import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact — Karen Alexandra",
  description: "Get in touch with Karen Alexandra.",
};

export default function ContactPage() {
  return (
    <section className="max-w-2xl mx-auto px-6 py-32 text-center">
      <p className="text-xs tracking-[0.3em] uppercase text-[var(--taupe)] mb-6">
        Contact
      </p>
      <h1 className="text-5xl md:text-6xl font-light mb-8">Get in Touch</h1>
      <p className="text-[var(--muted)] leading-relaxed mb-12 max-w-md mx-auto">
        Interested in working together or just want to say hello? I&apos;d love
        to hear from you.
      </p>

      <div className="border border-[var(--beige)] p-10 mb-8">
        <p className="text-xl font-light mb-1">Karen Alexandra</p>
        <p className="text-sm text-[var(--muted)] mb-6">
          Brand Marketing Director for Tech and Travel Companies
        </p>
        <Link
          href="mailto:karendelgadoc2@gmail.com"
          className="inline-block text-xs tracking-[0.2em] uppercase bg-[var(--charcoal)] text-[var(--cream)] px-10 py-4 hover:bg-[var(--taupe)] transition-colors"
        >
          Send an Email
        </Link>
      </div>

      <p className="text-xs text-[var(--muted)]">
        karendelgadoc2@gmail.com
      </p>
    </section>
  );
}
