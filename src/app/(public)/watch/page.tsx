import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Watch — Karen Alexandra",
  description: "Travel, fashion and wellness films by Karen Alexandra.",
};

const VIDEOS = [
  {
    title: "A week in Mykonos — villas, yacht days & the best restaurants",
    category: "Travel",
    length: "18:42",
    date: "May 2025",
    views: "12.4K",
    image: "/photos/mykonos-infinity.jpg",
    summary:
      "A sun-soaked week navigating the island's best-kept addresses — from a clifftop villa to a yacht charter and the restaurant everyone is talking about.",
  },
  {
    title: "What I packed for Mallorca — resort wardrobe breakdown",
    category: "Fashion",
    length: "12:18",
    date: "April 2025",
    views: "8.7K",
    image: "/photos/mallorca-cliff.jpg",
    summary:
      "Fourteen days, one suitcase. Every piece I brought, how I styled it and what I wished I'd left at home.",
  },
  {
    title: "Morning routine in Santorini — wellness habits I never skip",
    category: "Wellness",
    length: "09:55",
    date: "March 2025",
    views: "6.1K",
    image: "/photos/santorini-pool.jpg",
    summary:
      "Sunrise, sea and a slow morning. The rituals that keep me grounded even when the backdrop is spectacular.",
  },
  {
    title: "Inside a Mykonos villa — how I find & book luxury rentals",
    category: "Travel",
    length: "15:30",
    date: "February 2025",
    views: "9.2K",
    image: "/photos/mykonos-villa.jpg",
    summary:
      "The exact process I use to find exceptional villas — platforms, red flags and what to ask before you book.",
  },
  {
    title: "The Marbella edit — fashion highlights from the Costa del Sol",
    category: "Fashion",
    length: "11:04",
    date: "January 2025",
    views: "7.5K",
    image: "/photos/marbella-beach.jpg",
    summary:
      "Lightweight linens, the perfect swimsuit and a raffia bag you'll carry forever. The pieces I wore on repeat.",
  },
  {
    title: "Menorca — the slower island, styled",
    category: "Lifestyle",
    length: "14:22",
    date: "December 2024",
    views: "5.8K",
    image: "/photos/menorca-village.jpg",
    summary:
      "An island that rewards patience. Why I keep coming back, and what to do when you want nothing on the schedule.",
  },
];

const VIDEO_FILTERS = ["All films", "Travel", "Fashion", "Wellness", "Lifestyle"];

function PlayButton({ size = 52 }: { size?: number }) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: "var(--ka-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 16px rgba(10,10,10,0.12)",
      }}
    >
      <svg width={size * 0.35} height={size * 0.35} viewBox="0 0 18 18" fill="var(--ka-ink)">
        <polygon points="4,3 15,9 4,15" />
      </svg>
    </div>
  );
}

export default function WatchPage() {
  const featured = VIDEOS[0];
  const rest = VIDEOS.slice(1);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "96px 64px 64px",
          borderBottom: "1px solid var(--ka-line)",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "48px",
        }}
      >
        <div>
          <span className="ka-eyebrow" style={{ display: "block", marginBottom: "20px" }}>
            On Film
          </span>
          <h1
            style={{
              fontFamily: "var(--ka-display)",
              fontSize: "clamp(56px, 7vw, 96px)",
              fontStyle: "italic",
              fontWeight: 400,
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
            }}
          >
            On film.
          </h1>
        </div>
        <a
          href="https://www.youtube.com/@karenalexandrac"
          target="_blank"
          rel="noopener noreferrer"
          className="ka-btn"
          style={{ flexShrink: 0 }}
        >
          YouTube Channel <span>↗</span>
        </a>
      </section>

      {/* ── Featured Video ───────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--ka-bg-soft)",
          padding: "64px",
          borderBottom: "1px solid var(--ka-line)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "64px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            aspectRatio: "16/9",
            position: "relative",
            overflow: "hidden",
            background: "var(--ka-sand)",
            cursor: "pointer",
          }}
        >
          <Image
            src={featured.image}
            alt={featured.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="50vw"
            priority
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(10,10,10,0.2)",
            }}
          >
            <PlayButton size={68} />
          </div>
          <span
            style={{
              position: "absolute",
              top: "14px",
              left: "14px",
              fontFamily: "var(--ka-body)",
              fontSize: "9px",
              letterSpacing: "0.22em",
              textTransform: "uppercase" as const,
              background: "var(--ka-accent)",
              color: "var(--ka-ink)",
              padding: "4px 10px",
            }}
          >
            Newest
          </span>
          <span
            style={{
              position: "absolute",
              bottom: "12px",
              right: "12px",
              fontFamily: "var(--ka-mono)",
              fontSize: "10px",
              background: "var(--ka-ink)",
              color: "var(--ka-bg)",
              padding: "2px 7px",
            }}
          >
            {featured.length}
          </span>
        </div>

        <div>
          <span className="ka-eyebrow" style={{ display: "block", marginBottom: "12px" }}>
            {featured.category}&nbsp;&nbsp;·&nbsp;&nbsp;{featured.date}&nbsp;&nbsp;·&nbsp;&nbsp;{featured.views} views
          </span>
          <h2
            style={{
              fontFamily: "var(--ka-display)",
              fontSize: "36px",
              fontStyle: "italic",
              fontWeight: 400,
              marginBottom: "20px",
              lineHeight: 1.15,
            }}
          >
            {featured.title}
          </h2>
          <div
            style={{
              background: "var(--ka-bg)",
              border: "1px solid var(--ka-line)",
              padding: "20px 24px",
              marginBottom: "28px",
            }}
          >
            <span
              className="ka-eyebrow"
              style={{
                display: "block",
                marginBottom: "8px",
                color: "var(--ka-accent-deep)",
              }}
            >
              AI · Summary
            </span>
            <p style={{ fontSize: "14px", lineHeight: 1.65, color: "var(--ka-ink-soft)", fontWeight: 300 }}>
              {featured.summary}
            </p>
          </div>
          <a
            href="https://www.youtube.com/@karenalexandrac"
            target="_blank"
            rel="noopener noreferrer"
            className="ka-arrow-link"
          >
            Watch on YouTube <span className="ka-arrow">→</span>
          </a>
        </div>
      </section>

      {/* ── Filters ──────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "28px 64px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
          borderBottom: "1px solid var(--ka-line)",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          {VIDEO_FILTERS.map((f, i) => (
            <span key={f} className={`ka-tag${i === 0 ? " ka-tag-active" : ""}`}>
              {f}
            </span>
          ))}
        </div>
        <span
          style={{
            fontFamily: "var(--ka-mono)",
            fontSize: "10px",
            color: "var(--ka-muted)",
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
          }}
        >
          Auto-sync · New videos appear automatically
        </span>
      </div>

      {/* ── Video Grid ───────────────────────────────────────────────── */}
      <section
        style={{
          padding: "64px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "40px",
        }}
      >
        {rest.map((v) => (
          <Link
            key={v.title}
            href="https://www.youtube.com/@karenalexandrac"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "block" }}
          >
            <div
              style={{
                aspectRatio: "16/9",
                position: "relative",
                overflow: "hidden",
                background: "var(--ka-sand)",
              }}
            >
              <Image
                src={v.image}
                alt={v.title}
                fill
                style={{ objectFit: "cover" }}
                sizes="33vw"
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(10,10,10,0.15)",
                }}
              >
                <PlayButton size={44} />
              </div>
              <span
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  fontFamily: "var(--ka-mono)",
                  fontSize: "10px",
                  background: "var(--ka-ink)",
                  color: "var(--ka-bg)",
                  padding: "2px 6px",
                }}
              >
                {v.length}
              </span>
            </div>
            <div style={{ padding: "14px 0 0" }}>
              <span className="ka-eyebrow">{v.category}&nbsp;&nbsp;·&nbsp;&nbsp;{v.date}</span>
              <p
                style={{
                  fontFamily: "var(--ka-display)",
                  fontSize: "20px",
                  fontStyle: "italic",
                  marginTop: "8px",
                  marginBottom: "10px",
                  lineHeight: 1.2,
                }}
              >
                {v.title}
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--ka-muted)",
                  lineHeight: 1.6,
                  fontWeight: 300,
                }}
              >
                <span style={{ fontFamily: "var(--ka-mono)", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
                  AI ·&nbsp;
                </span>
                {v.summary}
              </p>
            </div>
          </Link>
        ))}
      </section>

      {/* ── Meta note ────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "32px 64px",
          borderTop: "1px solid var(--ka-line)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--ka-mono)",
            fontSize: "10px",
            color: "var(--ka-muted)",
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
          }}
        >
          Video summaries are AI-generated · Content syncs automatically from YouTube
        </p>
        <a
          href="https://www.youtube.com/@karenalexandrac"
          target="_blank"
          rel="noopener noreferrer"
          className="ka-arrow-link"
        >
          Subscribe <span className="ka-arrow">→</span>
        </a>
      </div>
    </>
  );
}
