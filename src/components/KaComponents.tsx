import Link from "next/link";
import type { ReactNode } from "react";

const MARQUEE_ITEMS = [
  "Cashmere weather",
  "Capri in May",
  "Corfu for dinner",
  "Mykonos, always",
  "What I wore in Rome",
  "The art of well",
  "Front row, always",
];

export function KaMarquee({ items = MARQUEE_ITEMS }: { items?: string[] }) {
  // Duplicate the track so the animation loops seamlessly
  const track = [...items, ...items];
  return (
    <div className="ka-marquee">
      <div className="ka-marquee-track">
        {track.map((item, i) => (
          <span key={i} style={{ display: "contents" }}>
            <span className="ka-marquee-item">{item}</span>
            <span className="ka-marquee-dot" />
          </span>
        ))}
      </div>
    </div>
  );
}

// A diagonal arrow icon for "opens elsewhere" buttons (YouTube, Substack).
// Rendered as an inline SVG rather than the Unicode "↗" character: some
// mobile browsers substitute a chunky emoji-style glyph for that character
// at small sizes, which doesn't match the thin desktop rendering — an SVG
// looks identical everywhere.
export function KaArrowUpRight({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

export function KaEyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={`ka-eyebrow ${className}`}>{children}</span>;
}

interface KaSectionHeadProps {
  num: string;
  title: string;
  href?: string;
  linkLabel?: string;
}

export function KaSectionHead({
  num,
  title,
  href,
  linkLabel = "View all",
}: KaSectionHeadProps) {
  return (
    <div className="ka-section-head" style={{ padding: "0 64px 32px" }}>
      <span className="ka-section-num">{num}</span>
      <h2>{title}</h2>
      {href ? (
        <Link href={href} className="ka-arrow-link">
          {linkLabel} <span className="ka-arrow">→</span>
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}
