import type { MadridEvent } from "./madrid-events-db";

const MONTH_ABBR = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

function toDisplayDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return `${MONTH_ABBR[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")}`;
}

export function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export interface ExtractedEvent {
  name: string;
  startDate: string; // YYYY-MM-DD
  venue: string;
  url: string;
  type: string;
}

// Calls Claude Haiku to extract fashion events from plain text.
// Returns [] if ANTHROPIC_API_KEY is not set (graceful degradation).
export async function extractEventsWithLLM(
  text: string,
  sourceUrl: string,
): Promise<ExtractedEvent[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || text.length < 50) return [];

  const today = new Date().toISOString().slice(0, 10);
  const prompt = `Extract upcoming fashion/design events in Madrid, Spain from this webpage text.

Today: ${today}
Source URL: ${sourceUrl}

Webpage text:
${text.slice(0, 3500)}

Return ONLY a JSON array. Each item must have a specific future date (>= ${today}). Include fashion shows, exhibitions, pop-ups, workshops, fairs, boutique events, and design events in Madrid.

[{"name":"event name","startDate":"YYYY-MM-DD","venue":"venue name in Madrid","url":"direct event URL or ${sourceUrl}","type":"Show|Fair|Expo|Talk|Pop-up|Festival|Event"}]

If no relevant upcoming events found, return [].`;

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: ctrl.signal,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 512,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    clearTimeout(t);
    if (!res.ok) return [];

    const data = await res.json() as { content: Array<{ type: string; text: string }> };
    const raw = (data.content.find((c) => c.type === "text")?.text ?? "").trim();
    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) return [];
    const parsed = JSON.parse(match[0]) as ExtractedEvent[];
    return Array.isArray(parsed) ? parsed.filter((e) => e.startDate >= today) : [];
  } catch {
    clearTimeout(t);
    return [];
  }
}

// Fetches a URL and extracts events using LLM. Works on any site including
// Instagram (limited by JS-rendering, but extracts what meta tags contain).
export async function extractEventsFromUrl(sourceUrl: string): Promise<MadridEvent[]> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 10000);
  let html = "";
  try {
    const res = await fetch(sourceUrl, {
      cache: "no-store",
      signal: ctrl.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; KarenAlexandra/1.0)",
        "Accept": "text/html,application/xhtml+xml",
      },
    });
    clearTimeout(t);
    if (!res.ok) return [];
    html = await res.text();
  } catch {
    clearTimeout(t);
    return [];
  }

  const text = htmlToText(html);
  const extracted = await extractEventsWithLLM(text, sourceUrl);
  const hostname = (() => { try { return new URL(sourceUrl).hostname.replace(/\W+/g, "-"); } catch { return "manual"; } })();

  return extracted.map((e) => ({
    id: `llm-${hostname}-${e.startDate}-${e.name.slice(0, 20).replace(/\s+/g, "-").toLowerCase()}`,
    date: toDisplayDate(e.startDate),
    rawDate: e.startDate,
    name: e.name,
    venue: e.venue,
    type: e.type,
    url: e.url,
    isNext: false,
  }));
}
