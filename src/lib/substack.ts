// Server-side fetch of latest posts from Karen's Substack publication.
//
// Mirrors src/lib/youtube.ts: no API key needed, just the publication's
// public RSS feed. Posts are NOT stored in InsForge — they're fetched fresh
// on every revalidation window, so a new Substack letter shows up on
// /journal automatically, the same way a new upload shows up on /watch.
//
// Cards always link straight out to the Substack post (no local copy is
// created), matching how "On Film" links out to YouTube.

export const SUBSTACK_PUBLICATION_URL = "https://karenalexandra.substack.com";
export const SUBSTACK_FEED_URL = `${SUBSTACK_PUBLICATION_URL}/feed`;

export interface SubstackPost {
  slug: string; // derived from the post URL — used as a React key only, not a route
  title: string;
  url: string; // full Substack post URL; cards always open this
  heroImage: string;
  heroAlt: string;
  category: string; // "fashion" | "travel" | "wellness" | "lifestyle" — matches BlogCategory
  date: string; // ISO 8601
  excerpt: string;
}

// ─── XML helpers (regex-based, same approach as youtube.ts — no XML dep) ─────

function tagText(xml: string, tag: string): string | null {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  if (!m) return null;
  const raw = m[1].trim();
  const cdata = raw.match(/^<!\[CDATA\[([\s\S]*)\]\]>$/);
  return (cdata ? cdata[1] : raw).trim();
}

function attrValue(xml: string, tag: string, attr: string): string | null {
  const m = xml.match(new RegExp(`<${tag}[^>]*\\b${attr}="([^"]*)"`));
  return m ? m[1] : null;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;/g, "'")
    .replace(/&apos;/g, "'");
}

function stripHtml(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")).trim();
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n - 1).trimEnd() + "…";
}

function firstImage(html: string): string | null {
  const m = html.match(/<img[^>]+src="([^"]+)"/);
  return m ? m[1] : null;
}

function slugFromUrl(url: string): string {
  try {
    const parts = new URL(url).pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] || url;
  } catch {
    return url;
  }
}

// Best-effort categorization from the post's own Substack tags, falling back
// to a keyword sniff of the title/description — same heuristic shape as
// inferCategory() in youtube.ts, but mapped onto the site's four journal
// categories (BlogCategory, minus "fashion-news" which doesn't apply here).
function inferCategory(title: string, categories: string[], description: string): string {
  const t = `${categories.join(" ")} ${title} ${description}`.toLowerCase();
  if (/(travel|trip|villa|hotel|destination|mykonos|mallorca|marbella|menorca|bogot|positano|guide|city)/.test(t)) return "travel";
  if (/(fashion|outfit|wardrobe|style|closet|capsule|wear|runway|collection|shopping)/.test(t)) return "fashion";
  if (/(wellness|morning routine|skincare|ritual|yoga|spa|self.?care|health)/.test(t)) return "wellness";
  return "lifestyle";
}

async function fetchViaRss(limit: number): Promise<SubstackPost[]> {
  const res = await fetch(SUBSTACK_FEED_URL, { next: { revalidate: 600 } });
  if (!res.ok) throw new Error(`substack rss ${res.status}`);
  const xml = await res.text();

  const items = xml.split("<item>").slice(1).map((e) => e.split("</item>")[0]);
  const posts: SubstackPost[] = [];
  for (const item of items.slice(0, limit)) {
    const rawTitle = tagText(item, "title");
    const link = tagText(item, "link");
    if (!rawTitle || !link) continue;
    const title = decodeEntities(rawTitle);

    const pubDate = tagText(item, "pubDate");
    const parsed = pubDate ? new Date(pubDate) : null;
    const date = parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString() : new Date(0).toISOString();

    const description = tagText(item, "description") ?? "";
    const contentEncoded = tagText(item, "content:encoded") ?? "";
    const categories = [...item.matchAll(/<category>([\s\S]*?)<\/category>/g)].map((m) =>
      decodeEntities(m[1].replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/, "$1").trim())
    );
    const image =
      attrValue(item, "enclosure", "url") ??
      attrValue(item, "media:content", "url") ??
      firstImage(contentEncoded) ??
      firstImage(description) ??
      "";

    posts.push({
      slug: slugFromUrl(link),
      title,
      url: link,
      heroImage: image,
      heroAlt: title,
      category: inferCategory(title, categories, description),
      date,
      excerpt: truncate(stripHtml(description), 200),
    });
  }
  return posts;
}

export async function getLatestSubstackPosts(limit = 12): Promise<SubstackPost[]> {
  try {
    return await fetchViaRss(limit);
  } catch (e) {
    console.error("[substack] fetch failed", e instanceof Error ? e.message : e);
    return [];
  }
}
