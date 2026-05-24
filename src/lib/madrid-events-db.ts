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

const STATIC_FALLBACK: MadridEvent[] = [
  { id: "s1", date: "JUN 10", rawDate: "2026-06-10", name: "MBFWMadrid — Season Preview",      venue: "IFEMA Madrid",        type: "Show",  url: "https://www.mbfwmadrid.com",                  isNext: true  },
  { id: "s2", date: "JUN 12", rawDate: "2026-06-12", name: "Loewe Foundation Craft Prize",      venue: "Calle Goya 35",       type: "Expo",  url: "https://loewefoundation.com/craft-prize",     isNext: false },
  { id: "s3", date: "JUN 14", rawDate: "2026-06-14", name: "MOMAD — Intl. Fashion Fair",        venue: "IFEMA Madrid",        type: "Fair",  url: "https://www.ifema.es/momad",                  isNext: false },
  { id: "s4", date: "JUN 19", rawDate: "2026-06-19", name: "Museo del Traje: Textiles",         venue: "Av. Juan de Herrera", type: "Expo",  url: "https://www.cultura.gob.es/museodeltaje",     isNext: false },
  { id: "s5", date: "JUN 24", rawDate: "2026-06-24", name: "Pedro del Hierro AW26 Preview",     venue: "Serrano Showroom",    type: "Press", url: "https://www.pedrodelhierro.com",              isNext: false },
  { id: "s6", date: "JUN 28", rawDate: "2026-06-28", name: "Design Festival — Fashion Stage",   venue: "Matadero Madrid",     type: "Event", url: "https://www.mataderomadrid.org",              isNext: false },
];

export async function getMadridCalendarEvents(): Promise<MadridEvent[]> {
  try {
    const db = getServerClient();
    const result = await db.database
      .from("page_content")
      .select("content")
      .eq("page", "madrid_calendar");
    const rows = (result as { data?: Array<{ content: unknown }> }).data;
    if (!rows || rows.length === 0) return STATIC_FALLBACK;

    const cache = rows[0].content as { events?: MadridEvent[]; lastUpdated?: string };
    if (!Array.isArray(cache.events) || cache.events.length === 0) return STATIC_FALLBACK;

    // Keep only future events, mark the soonest as isNext
    const today = new Date().toISOString().slice(0, 10);
    const upcoming = cache.events
      .filter((e) => e.rawDate >= today)
      .sort((a, b) => a.rawDate.localeCompare(b.rawDate))
      .slice(0, 6)
      .map((e, i) => ({ ...e, isNext: i === 0 }));

    return upcoming.length > 0 ? upcoming : STATIC_FALLBACK;
  } catch {
    return STATIC_FALLBACK;
  }
}

export async function saveMadridCalendarEvents(events: MadridEvent[]): Promise<void> {
  await upsertPageContent("madrid_calendar", {
    events,
    lastUpdated: new Date().toISOString(),
  });
}
