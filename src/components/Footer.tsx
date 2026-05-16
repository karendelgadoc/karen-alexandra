import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--beige)] bg-[var(--cream)]">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)]">
          Karen Alexandra
        </p>
        <p className="text-xs text-[var(--muted)]">
          Brand Marketing Director for Tech and Travel Companies
        </p>
        <Link
          href="mailto:karendelgadoc2@gmail.com"
          className="text-xs tracking-wide text-[var(--muted)] hover:text-[var(--taupe)] transition-colors"
        >
          karendelgadoc2@gmail.com
        </Link>
      </div>
    </footer>
  );
}
