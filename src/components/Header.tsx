"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/blog", label: "Case Studies" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[var(--cream)]/95 backdrop-blur-sm border-b border-[var(--beige)]">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm tracking-[0.2em] uppercase font-medium hover:text-[var(--taupe)] transition-colors"
        >
          Karen Alexandra
        </Link>
        <nav className="flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-xs tracking-[0.15em] uppercase transition-colors ${
                pathname === href
                  ? "text-[var(--taupe)]"
                  : "text-[var(--charcoal)] hover:text-[var(--taupe)]"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
