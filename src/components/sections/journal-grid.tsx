"use client";

import { useState } from "react";
import Link from "next/link";
import FallbackImage from "@/components/FallbackImage";
import type { JournalEntry } from "@/lib/journal";

// Asymmetric collage layout config (12-column grid).
//
// Column spans only — no explicit grid-row. Auto-placement then guarantees
// cards can never occupy the same cell; the previous config pinned explicit
// rows and had two genuine collisions (cards 4↔6 and 7↔8 overlapped on top
// of each other). Each group of spans sums to exactly 12 so every row tiles
// edge to edge, and `mt` staggers cards vertically to keep the collage feel
// without any risk of overlap.
const COLLAGE_POSITIONS = [
  { col: "span 5", aspect: "5/6", mt: 0 },  // ┐
  { col: "span 4", aspect: "4/5", mt: 48 }, // ├ 5 + 4 + 3 = 12
  { col: "span 3", aspect: "3/4", mt: 0 },  // ┘
  { col: "span 4", aspect: "5/6", mt: 0 },  // ┐
  { col: "span 5", aspect: "5/4", mt: 40 }, // ├ 4 + 5 + 3 = 12
  { col: "span 3", aspect: "3/4", mt: 0 },  // ┘
  { col: "span 6", aspect: "5/4", mt: 0 },  // ┐ 6 + 6 = 12
  { col: "span 6", aspect: "4/5", mt: 40 }, // ┘
];

const PAGE_SIZE = 8;

function PostCard({
  entry,
  position,
}: {
  entry: JournalEntry;
  position: (typeof COLLAGE_POSITIONS)[number];
}) {
  return (
    <Link
      href={entry.href}
      {...(entry.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      style={{
        gridColumn: position.col,
        marginTop: position.mt ? `${position.mt}px` : undefined,
        display: "block",
        minWidth: 0,
      }}
    >
      <div
        style={{
          aspectRatio: position.aspect,
          position: "relative",
          overflow: "hidden",
          background: "var(--ka-sand)",
        }}
      >
        {entry.heroImage ? (
          <FallbackImage
            src={entry.heroImage}
            alt={entry.heroAlt}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 40vw"
            unoptimized={entry.external}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "var(--ka-sand)" }} />
        )}
      </div>
      <div style={{ padding: "14px 0 0" }}>
        <span className="ka-eyebrow">
          {entry.category}
          {entry.external ? "  ·  Substack" : ""}
        </span>
        <p
          style={{
            fontFamily: "var(--ka-display)",
            fontSize: "22px",
            fontStyle: "italic",
            marginTop: "6px",
            lineHeight: 1.2,
          }}
        >
          {entry.title}
        </p>
        <p
          style={{
            fontSize: "12px",
            fontFamily: "var(--ka-mono)",
            color: "var(--ka-muted)",
            marginTop: "6px",
            letterSpacing: "0.08em",
          }}
        >
          {new Date(entry.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>
    </Link>
  );
}

// Client-side pagination over entries already fetched on the server. All
// non-featured entries are passed in up front (local letters are unbounded,
// synced Substack posts capped at 12), and "Load older entries" just reveals
// more of them in batches — no extra fetch needed.
export default function JournalGrid({
  entries,
  totalCount,
  afterGrid,
}: {
  entries: JournalEntry[];
  /** Total entry count shown in the footer, including the featured letter. */
  totalCount: number;
  /** Content rendered between the collage grid and the "load older" footer — e.g. the pull quote. */
  afterGrid?: React.ReactNode;
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visibleEntries = entries.slice(0, visibleCount);
  const hasMore = visibleCount < entries.length;
  const shownCount = visibleEntries.length + (totalCount - entries.length);

  return (
    <>
      {visibleEntries.length > 0 && (
        <section className="ka-rp" style={{ padding: "80px 64px" }}>
          <div
            className="ka-r-collage"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gap: "24px",
              alignItems: "start",
            }}
          >
            {visibleEntries.map((entry, i) => (
              <PostCard
                key={entry.key}
                entry={entry}
                position={COLLAGE_POSITIONS[i % COLLAGE_POSITIONS.length]}
              />
            ))}
          </div>
        </section>
      )}

      {afterGrid}

      {/* ── Load More ────────────────────────────────────────────────── */}
      <div className="ka-rp" style={{ padding: "56px 64px", textAlign: "center" }}>
        {hasMore && (
          <button
            className="ka-btn"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
          >
            Load older entries
          </button>
        )}
        <p
          style={{
            marginTop: hasMore ? "16px" : 0,
            fontSize: "11px",
            fontFamily: "var(--ka-mono)",
            color: "var(--ka-muted)",
            letterSpacing: "0.08em",
          }}
        >
          Showing {shownCount} of {totalCount} entries
        </p>
      </div>
    </>
  );
}
