"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { VideoCard } from "@/lib/youtube";

const ALL = "All films";

function PlayButton({ size = 44 }: { size?: number }) {
  return (
    <div style={{ width: `${size}px`, height: `${size}px`, borderRadius: "50%", background: "var(--ka-bg)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 16px rgba(10,10,10,0.12)" }}>
      <svg width={size * 0.35} height={size * 0.35} viewBox="0 0 18 18" fill="var(--ka-ink)"><polygon points="4,3 15,9 4,15" /></svg>
    </div>
  );
}

export default function FilteredVideoGrid({ videos }: { videos: VideoCard[] }) {
  // Build the chip list dynamically: ALL plus every distinct category present in the videos
  // (so the chips only show categories that actually have content).
  const categories = useMemo(() => {
    const seen = new Set<string>();
    for (const v of videos) if (v.category) seen.add(v.category);
    // Preferred ordering when present; everything else goes after, alphabetised.
    const preferred = ["Travel", "Fashion", "Wellness", "Lifestyle", "Film"];
    const ordered = preferred.filter((c) => seen.has(c));
    const extras = [...seen].filter((c) => !preferred.includes(c)).sort();
    return [ALL, ...ordered, ...extras];
  }, [videos]);

  const [active, setActive] = useState<string>(ALL);

  const filtered = active === ALL ? videos : videos.filter((v) => v.category === active);

  return (
    <>
      <div style={{ padding: "28px 64px", display: "flex", gap: "10px", alignItems: "center", borderBottom: "1px solid var(--ka-line)", justifyContent: "space-between", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={`ka-tag${c === active ? " ka-tag-active" : ""}`}
              style={{ cursor: "pointer", border: "none", font: "inherit" }}
              aria-pressed={c === active}
            >
              {c}
            </button>
          ))}
        </div>
        <span style={{ fontFamily: "var(--ka-mono)", fontSize: "10px", color: "var(--ka-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Auto-sync · New videos appear automatically
        </span>
      </div>

      {filtered.length === 0 ? (
        <section style={{ padding: "80px 64px", textAlign: "center", color: "var(--ka-muted)", fontFamily: "var(--ka-body)" }}>
          No videos in <span style={{ fontStyle: "italic" }}>{active}</span> yet.
        </section>
      ) : (
        <section style={{ padding: "64px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px" }}>
          {filtered.map((v) => (
            <Link key={v.id || v.title} href={v.url} target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
              <div style={{ aspectRatio: "16/9", position: "relative", overflow: "hidden", background: "var(--ka-sand)" }}>
                <Image src={v.thumbnail} alt={v.title} fill style={{ objectFit: "cover" }} sizes="33vw" unoptimized={v.thumbnail.includes("ytimg.com")} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,10,10,0.15)" }}><PlayButton /></div>
                {v.length !== "—" && (
                  <span style={{ position: "absolute", bottom: "10px", right: "10px", fontFamily: "var(--ka-mono)", fontSize: "10px", background: "var(--ka-ink)", color: "var(--ka-bg)", padding: "2px 6px" }}>{v.length}</span>
                )}
              </div>
              <div style={{ padding: "14px 0 0" }}>
                <span className="ka-eyebrow">{[v.category, v.date].filter(Boolean).join("  ·  ")}</span>
                <p style={{ fontFamily: "var(--ka-display)", fontSize: "20px", fontStyle: "italic", marginTop: "8px", marginBottom: "10px", lineHeight: 1.2 }}>{v.title}</p>
                {v.summary && (
                  <p style={{ fontSize: "12px", color: "var(--ka-muted)", lineHeight: 1.6, fontWeight: 300 }}>{v.summary}</p>
                )}
              </div>
            </Link>
          ))}
        </section>
      )}
    </>
  );
}
