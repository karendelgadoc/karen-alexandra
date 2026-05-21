// Server-side fetch of latest videos from Karen's YouTube channel.
//
// Two paths:
//   1. With YOUTUBE_API_KEY env var: hits the YouTube Data API v3 for
//      title, published date, thumbnail, view count, AND ISO-8601 duration.
//   2. Without: parses the public RSS feed — gives title, published date,
//      thumbnail, view count. Duration is unavailable from RSS, shown as "—".
//
// Both paths return the same VideoCard shape; the page renders identically.

export const YT_CHANNEL_HANDLE = "KarenAlexandra";
export const YT_CHANNEL_ID = "UCq1nK9NBTKy2N_TzMPCeR9w";
export const YT_CHANNEL_URL = `https://www.youtube.com/@${YT_CHANNEL_HANDLE}`;

export interface VideoCard {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  category: string; // best-effort tag inferred from title/description; falls back to "Film"
  date: string; // e.g. "May 2026"
  length: string; // e.g. "12:18" or "—"
  views: string; // e.g. "12.4K" or ""
  summary: string;
}

function inferCategory(title: string, description?: string): string {
  const t = `${title} ${description ?? ""}`.toLowerCase();
  if (/(travel|trip|villa|hotel|destination|mykonos|mallorca|marbella|menorca|bogot|positano)/.test(t)) return "Travel";
  if (/(fashion|outfit|wardrobe|style|edit|pack|capsule|wear|swimsuit)/.test(t)) return "Fashion";
  if (/(wellness|morning routine|skincare|ritual|yoga|spa)/.test(t)) return "Wellness";
  if (/(home|interior|design|lifestyle|day in)/.test(t)) return "Lifestyle";
  return "Film";
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-US", { month: "long", year: "numeric" });
  } catch {
    return "";
  }
}

function formatViews(views?: string | number): string {
  if (views === undefined || views === null) return "";
  const n = typeof views === "string" ? parseInt(views, 10) : views;
  if (!Number.isFinite(n) || n <= 0) return "";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

// "PT1H2M3S" → "1:02:03"; "PT12M18S" → "12:18"; "PT55S" → "0:55"
function formatDuration(iso?: string): string {
  if (!iso) return "—";
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!m) return "—";
  const h = parseInt(m[1] ?? "0", 10);
  const min = parseInt(m[2] ?? "0", 10);
  const sec = parseInt(m[3] ?? "0", 10);
  if (h > 0) return `${h}:${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${min}:${String(sec).padStart(2, "0")}`;
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n - 1).trimEnd() + "…";
}

function thumb(id: string): string {
  // maxresdefault isn't always available, hqdefault always is
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

// ─── API path (preferred when YOUTUBE_API_KEY is set) ────────────────────────

interface YTApiItem {
  contentDetails?: { videoId?: string; duration?: string };
  id?: string | { videoId?: string };
  snippet?: {
    title?: string;
    description?: string;
    publishedAt?: string;
    thumbnails?: {
      high?: { url?: string };
      maxres?: { url?: string };
    };
  };
  statistics?: { viewCount?: string };
}

async function fetchViaApi(apiKey: string, limit: number): Promise<VideoCard[]> {
  // 1. Get the uploads playlist ID for the channel
  const chRes = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${YT_CHANNEL_ID}&key=${apiKey}`,
    { next: { revalidate: 3600 } }
  );
  if (!chRes.ok) throw new Error(`channels.list ${chRes.status}`);
  const chData = (await chRes.json()) as {
    items?: { contentDetails?: { relatedPlaylists?: { uploads?: string } } }[];
  };
  const uploadsId = chData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsId) throw new Error("no uploads playlist");

  // 2. Get the last N items in that playlist
  const plRes = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsId}&maxResults=${limit}&key=${apiKey}`,
    { next: { revalidate: 600 } }
  );
  if (!plRes.ok) throw new Error(`playlistItems.list ${plRes.status}`);
  const plData = (await plRes.json()) as { items?: YTApiItem[] };
  const items = plData.items ?? [];
  if (items.length === 0) return [];

  const ids = items
    .map((it) => it.contentDetails?.videoId)
    .filter((x): x is string => !!x);
  if (ids.length === 0) return [];

  // 3. Get statistics + content details (for duration + view count) for those videos
  const vRes = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics,snippet&id=${ids.join(",")}&key=${apiKey}`,
    { next: { revalidate: 600 } }
  );
  if (!vRes.ok) throw new Error(`videos.list ${vRes.status}`);
  const vData = (await vRes.json()) as { items?: YTApiItem[] };
  const byId = new Map<string, YTApiItem>();
  for (const v of vData.items ?? []) {
    const id = typeof v.id === "string" ? v.id : v.id?.videoId;
    if (id) byId.set(id, v);
  }

  return ids.flatMap<VideoCard>((id) => {
    const meta = byId.get(id);
    const sn = meta?.snippet ?? items.find((p) => p.contentDetails?.videoId === id)?.snippet;
    if (!sn?.title) return [];
    const title = sn.title;
    const desc = sn.description ?? "";
    return [{
      id,
      title,
      url: `https://www.youtube.com/watch?v=${id}`,
      thumbnail: sn.thumbnails?.maxres?.url ?? sn.thumbnails?.high?.url ?? thumb(id),
      category: inferCategory(title, desc),
      date: formatDate(sn.publishedAt ?? ""),
      length: formatDuration(meta?.contentDetails?.duration),
      views: formatViews(meta?.statistics?.viewCount),
      summary: truncate(desc.split(/\n+/)[0] ?? "", 220),
    }];
  });
}

// ─── RSS path (fallback when no API key) ─────────────────────────────────────

function tagText(xml: string, tag: string): string | null {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return m ? m[1].trim() : null;
}

function attrValue(xml: string, tag: string, attr: string): string | null {
  const m = xml.match(new RegExp(`<${tag}[^>]*\\b${attr}="([^"]+)"`));
  return m ? m[1] : null;
}

async function fetchViaRss(limit: number): Promise<VideoCard[]> {
  const res = await fetch(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${YT_CHANNEL_ID}`,
    { next: { revalidate: 600 } }
  );
  if (!res.ok) throw new Error(`rss ${res.status}`);
  const xml = await res.text();

  const entries = xml.split("<entry>").slice(1).map((e) => e.split("</entry>")[0]);
  const videos: VideoCard[] = [];
  for (const entry of entries.slice(0, limit)) {
    const id = tagText(entry, "yt:videoId");
    const title = tagText(entry, "title");
    if (!id || !title) continue;
    const published = tagText(entry, "published") ?? "";
    const thumbUrl = attrValue(entry, "media:thumbnail", "url") ?? thumb(id);
    const views = attrValue(entry, "media:statistics", "views") ?? "";
    const desc = tagText(entry, "media:description") ?? "";
    videos.push({
      id,
      title,
      url: `https://www.youtube.com/watch?v=${id}`,
      thumbnail: thumbUrl,
      category: inferCategory(title, desc),
      date: formatDate(published),
      length: "—",
      views: formatViews(views),
      summary: truncate(desc.split(/\n+/)[0] ?? "", 220),
    });
  }
  return videos;
}

// ─── Public entry point ──────────────────────────────────────────────────────

export async function getLatestVideos(limit = 12): Promise<VideoCard[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  try {
    if (apiKey) {
      const fromApi = await fetchViaApi(apiKey, limit);
      if (fromApi.length > 0) return fromApi;
    }
    return await fetchViaRss(limit);
  } catch (e) {
    console.error("[youtube] fetch failed", e instanceof Error ? e.message : e);
    return [];
  }
}
