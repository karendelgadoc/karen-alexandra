"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white">
      <div className="grid grid-cols-3 items-center px-5 md:px-8 py-4 md:py-5">
        {/* Left */}
        <div>
          <Link
            href="/blog"
            className="text-[11px] md:text-xs tracking-[0.15em] text-[var(--charcoal)] hover:text-[var(--taupe)] transition-colors"
          >
            blog posts
          </Link>
        </div>

        {/* Center */}
        <div className="flex justify-center">
          <Link
            href="/"
            className="text-[13px] md:text-sm tracking-[0.2em] font-medium text-[var(--charcoal)] hover:text-[var(--taupe)] transition-colors whitespace-nowrap"
          >
            Karen Alexandra
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center justify-end gap-3 md:gap-5">
          <Link
            href="/contact"
            className="hidden sm:block text-[11px] md:text-xs tracking-[0.15em] text-[var(--charcoal)] hover:text-[var(--taupe)] transition-colors"
          >
            contact me
          </Link>
          <button
            aria-label="Search"
            className="text-[var(--charcoal)] hover:text-[var(--taupe)] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
