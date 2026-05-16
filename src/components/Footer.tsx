import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#ECEAE5" }}>
      <div className="max-w-6xl mx-auto px-8 md:px-10 py-12 md:py-16 flex flex-col md:grid md:grid-cols-3 gap-10 md:gap-8 items-center md:items-start">
        {/* Monogram */}
        <div className="flex justify-center md:justify-start">
          <span
            className="text-5xl md:text-6xl font-light tracking-tight text-[var(--charcoal)] select-none"
            style={{ fontFamily: "Georgia, serif" }}
          >
            K/A
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-row md:flex-col items-center md:items-center gap-6 md:gap-3">
          <Link
            href="/blog"
            className="text-sm text-[var(--charcoal)] hover:text-[var(--taupe)] transition-colors"
          >
            Blog Posts
          </Link>
          <Link
            href="/contact"
            className="text-sm text-[var(--charcoal)] hover:text-[var(--taupe)] transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-[var(--muted)] hover:text-[var(--taupe)] transition-colors"
          >
            Privacy
          </Link>
        </div>

        {/* Quote */}
        <div className="relative pl-5 md:pl-6 text-center md:text-left">
          <span
            className="absolute -top-3 left-0 text-6xl md:text-7xl font-light text-[var(--muted)] leading-none select-none"
            style={{ fontFamily: "Georgia, serif" }}
          >
            &ldquo;
          </span>
          <p className="italic text-[var(--charcoal)] text-sm md:text-base leading-relaxed">
            Choosing an outfit for the day is like waking up and answering the question &ldquo;who do I want to be today?&rdquo;
          </p>
        </div>
      </div>
    </footer>
  );
}
