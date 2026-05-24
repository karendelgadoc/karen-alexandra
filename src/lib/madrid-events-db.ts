import { getServerClient } from "./insforge";
import { upsertPageContent } from "./page-content-db";

export interface MadridEvent {
  id: string;
  date: string;    // display: "JUN 10"
  rawDate: string; // ISO: "2026-06-10"
  name: string;
  venue: string;
  type: string;
  url: string;
  isNext: boolean;
}

// Verified real IFEMA fashion events (accurate dates + working URLs as of
// 2026-05-24). Only shown if the DB has no cron-populated events.
const STATIC_FALLBACK: MadridEvent[] = [
  { id: "s1", date: "JUL 23", rawDate: "2026-07-23", name: "Momad",                              venue: "IFEMA Madrid", type: "Fair", url: "https://www.ifema.es/en/momad",       isNext: true  },
  { id: "s2", date: "SEP 14", rawDate: "2026-09-14", name: "Mercedes-Benz Fashion Week Madrid",  venue: "IFEMA Madrid", type: "Show", url: "https://www.ifema.es/en/mbfw-madrid", isNext: false },
  { id: "s3", date: "SEP 24", rawDate: "2026-09-24", name: "Bisutex",                            venue: "IFEMA Madrid", type: "Fair", url: "https://www.ifema.es/en/bisutex",     isNext: false },
  { id: "s4", date: "FEB 03", rawDate: "2027-02-03", name: "Intergift",                          venue: "IFEMA Madrid", type: "Fair", url: "https://www.ifema.es/en/intergift",   isNext: false },
];

function normalizeKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/[áàäâ]/g, "a").replace(/[éèëê]/g, "e")
    .replace(/[íìïî]/g, "i").replace(/[óòöô]/g, "o")
    .replace(/[úùüû]/g, "u").replace(/ñ/g, "n")
    .replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").trim()
    .split(" ").slice(0, 4).join(" ");
}

async function fetchStoredEvents(key: string): Promise<MadridEvent[]> {
  const db = getServerClient();
  const result = await db.database
    .from("page_content")
    .select("content")
    .eq("page", key);
  const rows = (result as { data?: Array<{ content: unknown }> }).data;
  if (!rows || rows.length === 0) return [];
  const cache = rows[0].content as { events?: MadridEvent[] };
  return Array.isArray(cache.events) ? cache.events : [];
}

// Auto-scraped events saved by the daily cron
export async function getMadridAutoEvents(): Promise<MadridEvent[]> {
  return fetchStoredEvents("madrid_calendar");
}

// Manually curated events added via the admin import tool
export async function getMadridManualEvents(): Promise<MadridEvent[]> {
  return fetchStoredEvents("madrid_calendar_manual");
}

export async function saveMadridManualEvents(events: MadridEvent[]): Promise<void> {
  await upsertPageContent("madrid_calendar_manual", {
    events,
    lastUpdated: new Date().toISOString(),
  });
}

// Merged view: manual events take priority, auto-scraped fill remaining slots.
// Deduplicates by normalized event name. Always sorted soonest first.
export async function getMadridCalendarEvents(): Promise<MadridEvent[]> {
  const today = new Date().toISOString().slice(0, 10);

  try {
    const [auto, manual] = await Promise.all([
      getMadridAutoEvents().catch(() => []),
      getMadridManualEvents().catch(() => []),
    ]);

    const seen = new Set<string>();
    const result: MadridEvent[] = [];

    const add = (ev: MadridEvent) => {
      if (ev.rawDate < today) return;
      const key = normalizeKey(ev.name);
      if (seen.has(key)) return;
      seen.add(key);
      result.push(ev);
    };

    // Manual events first (user-curated, always surface)
    manual.forEach(add);
    // Auto-scraped fill remaining slots
    auto.forEach(add);

    const sorted = result
      .sort((a, b) => a.rawDate.localeCompare(b.rawDate))
      .slice(0, 6)
      .map((e, i) => ({ ...e, isNext: i === 0 }));

    return sorted.length > 0 ? sorted : STATIC_FALLBACK;
  } catch {
    return STATIC_FALLBACK;
  }
}

// Used by the cron to save auto-scraped events
export async function saveMadridCalendarEvents(events: MadridEvent[]): Promise<void> {
  await upsertPageContent("madrid_calendar", {
    events,
    lastUpdated: new Date().toISOString(),
  });
}
