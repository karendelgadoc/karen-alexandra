import Image from "next/image";
import type { ReactNode } from "react";
import type { WatchContent } from "@/lib/page-content-db";
import { YT_CHANNEL_URL, type VideoCard } from "@/lib/youtube";
import FilteredVideoGrid from "./FilteredVideoGrid";

// Fallback used only if the YouTube fetch returns 0 videos (rate-limit, outage, etc.)
const FALLBACK_VIDEOS: VideoCard[] = [
  { id: "", title: "New films coming soon", url: YT_CHANNEL_URL, thumbnail: "/photos/mykonos-infinity.jpg", category: "Film", date: "", length: "—", views: "", summary: "Karen's YouTube channel — travel, fashion and wellness films. Subscribe to be notified when new films drop." },
];

function PlayButton({ size = 52 }: { size?: number }) {
  return (
    <div style={{ width: `${size}px`, height: `${size}px`, borderRadius: "50%", background: "var(--ka-bg)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 16px rgba(10,10,10,0.12)" }}>
      <svg width={size * 0.35} height={size * 0.35} viewBox="0 0 18 18" fill="var(--ka-ink)"><polygon points="4,3 15,9 4,15" /></svg>
    </div>
  );
}

export function HeroSection({ c }: { c: WatchContent }) {
  return (
    <section style={{ padding: "96px 64px 64px", borderBottom: "1px solid var(--ka-line)", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "48px" }}>
      <div>
        <span className="ka-eyebrow" style={{ display: "block", marginBottom: "20px" }}>{c.hero.eyebrow}</span>
        <h1 style={{ fontFamily: "var(--ka-display)", fontSize: "clamp(56px, 7vw, 96px)", fontStyle: "italic", fontWeight: 400, lineHeight: 1.0, letterSpacing: "-0.02em" }}>{c.hero.headline}</h1>
      </div>
      <a href={YT_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="ka-btn" style={{ flexShrink: 0 }}>YouTube Channel <span>↗</span></a>
    </section>
  );
}

export function FeaturedSection({ featured }: { featured: VideoCard }) {
  const stats = [featured.category, featured.date, featured.views ? `${featured.views} views` : null]
    .filter(Boolean)
    .join("  ·  ");
  return (
    <section style={{ background: "var(--ka-bg-soft)", padding: "64px", borderBottom: "1px solid var(--ka-line)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
      <a href={featured.url} target="_blank" rel="noopener noreferrer" style={{ aspectRatio: "16/9", position: "relative", overflow: "hidden", background: "var(--ka-sand)", cursor: "pointer", display: "block" }}>
        <Image src={featured.thumbnail} alt={featured.title} fill style={{ objectFit: "cover" }} sizes="50vw" priority unoptimized={featured.thumbnail.includes("ytimg.com")} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,10,10,0.2)" }}><PlayButton size={68} /></div>
        <span style={{ position: "absolute", top: "14px", left: "14px", fontFamily: "var(--ka-body)", fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase" as const, background: "var(--ka-accent)", color: "var(--ka-ink)", padding: "4px 10px" }}>Newest</span>
        {featured.length !== "—" && (
          <span style={{ position: "absolute", bottom: "12px", right: "12px", fontFamily: "var(--ka-mono)", fontSize: "10px", background: "var(--ka-ink)", color: "var(--ka-bg)", padding: "2px 7px" }}>{featured.length}</span>
        )}
      </a>
      <div>
        <span className="ka-eyebrow" style={{ display: "block", marginBottom: "12px" }}>{stats}</span>
        <h2 style={{ fontFamily: "var(--ka-display)", fontSize: "36px", fontStyle: "italic", fontWeight: 400, marginBottom: "20px", lineHeight: 1.15 }}>{featured.title}</h2>
        {featured.summary && (
          <div style={{ background: "var(--ka-bg)", border: "1px solid var(--ka-line)", padding: "20px 24px", marginBottom: "28px" }}>
            <span className="ka-eyebrow" style={{ display: "block", marginBottom: "8px", color: "var(--ka-accent-deep)" }}>Description</span>
            <p style={{ fontSize: "14px", lineHeight: 1.65, color: "var(--ka-ink-soft)", fontWeight: 300 }}>{featured.summary}</p>
          </div>
        )}
        <a href={featured.url} target="_blank" rel="noopener noreferrer" className="ka-arrow-link">Watch on YouTube <span className="ka-arrow">→</span></a>
      </div>
    </section>
  );
}

// Filters + grid are rendered together by FilteredVideoGrid (client component)
// so chip clicks re-filter the grid in place.


export function MetaSection() {
  return (
    <div style={{ padding: "32px 64px", borderTop: "1px solid var(--ka-line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <p style={{ fontFamily: "var(--ka-mono)", fontSize: "10px", color: "var(--ka-muted)", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>Films sync automatically from YouTube · @KarenAlexandra</p>
      <a href={YT_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="ka-arrow-link">Subscribe <span className="ka-arrow">→</span></a>
    </div>
  );
}

export interface WatchExtraProps {
  videos: VideoCard[];
}

export function buildWatchSectionMap(c: WatchContent, extra: WatchExtraProps): Record<string, ReactNode> {
  const videos = extra.videos.length > 0 ? extra.videos : FALLBACK_VIDEOS;
  const featured = videos[0];
  const rest = videos.slice(1);
  return {
    "hero":       <HeroSection c={c} />,
    "featured":   <FeaturedSection featured={featured} />,
    "filters":    <FilteredVideoGrid videos={rest} />,
    // Kept as a no-op for backward compat with any saved sectionOrder that
    // still references "video-grid" — the grid is now rendered inside "filters".
    "video-grid": null,
    "meta":       <MetaSection />,
  };
}
