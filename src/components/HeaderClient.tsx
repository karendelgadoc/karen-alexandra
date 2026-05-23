"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface NavLink {
  label: string;
  href: string;
}

const WORK_ITEMS = [
  { name: "Portfolio",    href: "/portfolio",    note: "Overview" },
  { name: "Case Studies", href: "/case-studies", note: "In depth" },
  { name: "Services",     href: "/services",     note: "Engage" },
  { name: "Media Kit",    href: "/media-kit",    note: "Press" },
];

const MOBILE_GROUPS = [
  {
    label: "Read",
    items: [
      { name: "The Edit",      href: "/journal" },
      { name: "Fashion News",  href: "/fashion-news" },
      { name: "On Film",       href: "/watch" },
    ],
  },
  {
    label: "Work",
    items: [
      { name: "Portfolio",     href: "/portfolio" },
      { name: "Case Studies",  href: "/case-studies" },
      { name: "Services",      href: "/services" },
      { name: "Media Kit",     href: "/media-kit" },
    ],
  },
  {
    label: "Connect",
    items: [
      { name: "About",   href: "/about" },
      { name: "Contact", href: "/contact" },
    ],
  },
];

export default function HeaderClient({
  leftLinks,
  rightLinks,
}: {
  leftLinks: NavLink[];
  rightLinks: NavLink[];
}) {
  const pathname = usePathname();
  const [workOpen, setWorkOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const workRef = useRef<HTMLDivElement>(null);

  function isActive(href: string) {
    return pathname === href || (href !== "/" && pathname.startsWith(href + "/"));
  }

  const isWorkActive = WORK_ITEMS.some((it) => isActive(it.href));

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close work dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (workRef.current && !workRef.current.contains(e.target as Node)) {
        setWorkOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      {/* ── Desktop / Tablet nav ─────────────────────────────────── */}
      <nav className="ka-nav ka-rp">
        {/* Hamburger — mobile only */}
        <button
          className="ka-nav-hamburger"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <span />
          <span />
          <span style={{ width: "70%" }} />
        </button>

        {/* Left links */}
        <div className="ka-nav-left">
          {leftLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`ka-nav-link${isActive(href) ? " active" : ""}`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Logo */}
        <Link href="/" className="ka-logo">
          <Image
            src="/logo-wordmark.png"
            alt="Karen Alexandra"
            width={180}
            height={36}
            style={{ height: "auto" }}
            priority
          />
        </Link>

        {/* Right links + Work dropdown */}
        <div className="ka-nav-right">
          {/* Work dropdown */}
          <div
            ref={workRef}
            className="ka-work-dropdown"
          >
            <button
              className={`ka-nav-link ka-work-trigger${isWorkActive ? " active" : ""}`}
              onClick={() => setWorkOpen((v) => !v)}
              aria-expanded={workOpen}
            >
              Work{" "}
              <span
                style={{
                  fontSize: 9,
                  display: "inline-block",
                  transform: workOpen ? "rotate(180deg)" : "none",
                  transition: "transform .2s",
                  marginLeft: 4,
                }}
              >
                ▾
              </span>
            </button>

            {workOpen && (
              <div className="ka-work-menu">
                <div className="ka-eyebrow" style={{ fontSize: 9, marginBottom: 14, color: "var(--ka-accent-deep)" }}>
                  The studio
                </div>
                {WORK_ITEMS.map((it, i) => (
                  <Link
                    key={it.href}
                    href={it.href}
                    className="ka-work-item"
                    style={{
                      borderTop: i ? "1px solid var(--ka-line-soft)" : "none",
                      fontStyle: isActive(it.href) ? "italic" : "normal",
                    }}
                    onClick={() => setWorkOpen(false)}
                  >
                    <span style={{ fontFamily: "var(--ka-display)", fontSize: 18 }}>{it.name}</span>
                    <span className="ka-eyebrow" style={{ fontSize: 9, color: "var(--ka-muted)" }}>{it.note} →</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {rightLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`ka-nav-link${isActive(href) ? " active" : ""}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* ── Mobile full-screen overlay ───────────────────────────── */}
      {mobileOpen && (
        <div className="ka-mobile-overlay">
          <div className="ka-mobile-overlay-header">
            <Link href="/" onClick={() => setMobileOpen(false)}>
              <Image src="/logo-wordmark.png" alt="Karen Alexandra" width={140} height={28} style={{ height: 20, width: "auto" }} />
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              style={{ background: "transparent", border: "none", fontFamily: "var(--ka-display)", fontSize: 28, cursor: "pointer", color: "var(--ka-ink)", lineHeight: 1 }}
            >
              ×
            </button>
          </div>

          {MOBILE_GROUPS.map((group) => (
            <div key={group.label} className="ka-mobile-group">
              <div className="ka-eyebrow" style={{ color: "var(--ka-accent-deep)", marginBottom: 20 }}>{group.label}</div>
              {group.items.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="ka-mobile-link"
                  style={{
                    fontSize: group.label === "Read" ? 36 : 26,
                    fontStyle: isActive(item.href) ? "italic" : "normal",
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          ))}

          <div style={{ marginTop: "auto", paddingTop: 48 }}>
            <div className="ka-eyebrow" style={{ marginBottom: 10 }}>The Saturday Letter</div>
            <p style={{ fontFamily: "var(--ka-display)", fontStyle: "italic", fontSize: 17, color: "var(--ka-muted)", marginBottom: 14 }}>
              One letter, every Saturday.
            </p>
            <a
              href="https://karenalexandra.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ka-arrow-link"
              style={{ fontSize: 10 }}
            >
              Subscribe <span className="ka-arrow">→</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
