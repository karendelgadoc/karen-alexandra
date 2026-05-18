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
  return (
    <div className="ka-marquee">
      {items.map((item, i) => (
        <span key={i} style={{ display: "contents" }}>
          <span className="ka-marquee-item">{item}</span>
          {i < items.length - 1 && <span className="ka-marquee-dot" />}
        </span>
      ))}
    </div>
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
