/**
 * IndexNow — instantly notifies Bing, Yandex, Naver, Seznam and DuckDuckGo
 * that a URL changed. Skips Google (they don't participate — they get notified
 * by sitemap lastmod + crawl).
 *
 * https://www.indexnow.org/documentation
 */

const KEY = "e03e0e3336dffab74aaa938e98ffa26e";
const HOST = "karenalexandra.com";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/IndexNow";

/**
 * Fire-and-forget ping. Does not block the calling request; failures are
 * logged but don't surface to the user (they just slow re-indexing).
 *
 * @param urls one or more fully-qualified URLs that changed (created, updated, or deleted).
 */
export function pingIndexNow(urls: string | string[]): void {
  const urlList = Array.isArray(urls) ? urls : [urls];
  const cleaned = urlList
    .map((u) => u.trim())
    .filter((u) => u.startsWith(`https://${HOST}`));
  if (cleaned.length === 0) return;

  const body = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: cleaned,
  });

  // Don't await — we don't want to slow down admin saves
  fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body,
  })
    .then((r) => {
      if (!r.ok) console.warn("[IndexNow] non-OK response:", r.status, r.statusText);
    })
    .catch((err) => console.warn("[IndexNow] ping failed:", err));
}

// Helpers — build the canonical URLs we want to ping
export const indexNowUrl = {
  blogPost: (slug: string) => `https://${HOST}/journal/${slug}`,
  caseStudy: (slug: string) => `https://${HOST}/case-studies/${slug}`,
  journalIndex: () => `https://${HOST}/journal`,
  caseStudiesIndex: () => `https://${HOST}/case-studies`,
  page: (path: string) => `https://${HOST}${path.startsWith("/") ? path : `/${path}`}`,
  home: () => `https://${HOST}/`,
};
