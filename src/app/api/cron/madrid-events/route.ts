import { NextRequest, NextResponse } from "next/server";
import { saveMadridCalendarEvents, type MadridEvent } from "@/lib/madrid-events-db";
import { htmlToText, extractEventsWithLLM } from "@/lib/event-extractor";

const MONTH_ABBR = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

function toDisplayDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return `${MONTH_ABBR[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")}`;
}

function guessType(name: string, desc: string): string {
  const n = (name + " " + desc).toLowerCase();
  if (n.includes("fashion week") || n.includes("mbfw") || n.includes("pasarela") || n.includes("desfile")) return "Show";
  if (n.includes("footwear") || n.includes("accessories") || n.includes("momad") || n.includes("trade show") || n.includes("feria")) return "Fair";
  if (n.includes("exhib") || n.includes("expo") || n.includes("museo") || n.includes("museum") || n.includes("gallery") || n.includes("exposición")) return "Expo";
  if (n.includes("bridal") || n.includes("boda") || n.includes("novia")) return "Bridal";
  if (n.includes("masterclass") || n.includes("taller") || n.includes("workshop") || n.includes("conferencia") || n.includes("lecture")) return "Talk";
  if (n.includes("pop up") || n.includes("pop-up") || n.includes("popup") || n.includes("inauguración") || n.includes("opening")) return "Pop-up";
  if (n.includes("festival") || n.includes("design") || n.includes("diseño")) return "Festival";
  return "Event";
}

const FASHION_KEYWORDS = [
  "moda", "fashion", "diseño", "design", "textil", "textile",
  "footwear", "calzado", "accessories", "accesorios",
  "momad", "mbfw", "bridal", "novia", "luxury", "lujo",
  "belleza", "beauty", "joyería", "jewellery", "jewelry",
  "loewe", "pedro del hierro", "flabelus", "alma en pena",
  "vestido", "couture", "prêt-à-porter", "tendencias",
  "pasarela", "colección", "collection", "indumentaria",
  "traje", "costume", "romanticismo",
];

function isFashionRelated(name: string, desc: string): boolean {
  const text = (name + " " + desc).toLowerCase();
  return FASHION_KEYWORDS.some((kw) => text.includes(kw));
}

// ── URL validation ─────────────────────────────────────────────────────────────

async function isUrlReachable(url: string): Promise<boolean> {
  for (const method of ["HEAD", "GET"] as const) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 6000);
    try {
      const res = await fetch(url, {
        method,
        signal: ctrl.signal,
        headers: { "User-Agent": "Mozilla/5.0 (compatible; KarenAlexandra/1.0)" },
        redirect: "follow",
      });
      clearTimeout(t);
      if (res.ok) return true;
    } catch { clearTimeout(t); }
  }
  return false;
}

async function pickReachableUrl(candidates: string[]): Promise<string> {
  for (const url of candidates) {
    if (await isUrlReachable(url)) return url;
  }
  return candidates[0];
}

// ── Site scraper: JSON-LD first, then LLM fallback ────────────────────────────

function parseJsonLd(
  html: string,
  sourceUrl: string,
  defaultVenue: string,
  filterFn: (name: string, desc: string) => boolean,
  today: string,
): MadridEvent[] {
  const events: MadridEvent[] = [];
  const hostname = (() => { try { return new URL(sourceUrl).hostname.replace(/\W+/g, "-"); } catch { return "src"; } })();
  const blocks = html.match(/application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g) ?? [];

  for (const block of blocks) {
    try {
      const json = block.replace(/application\/ld\+json[^>]*>/, "").replace(/<\/script>/, "").trim();
      const parsed = JSON.parse(json) as unknown;

      const items: Record<string, unknown>[] = [];
      const collect = (x: unknown) => {
        if (!x || typeof x !== "object") return;
        const r = x as Record<string, unknown>;
        const type = r["@type"];
        if (type === "Event" || type === "EventSeries" ||
            (Array.isArray(type) && (type.includes("Event") || type.includes("EventSeries")))) {
          items.push(r);
        }
      };
      if (Array.isArray(parsed)) (parsed as unknown[]).forEach(collect);
      else if (parsed && typeof parsed === "object") {
        const p = parsed as Record<string, unknown>;
        collect(p);
        if (Array.isArray(p["@graph"])) (p["@graph"] as unknown[]).forEach(collect);
      }

      for (const item of items) {
        const name = String(item.name ?? "").trim();
        const desc = String(item.description ?? "").trim();
        if (!name || !filterFn(name, desc)) continue;
        const startDate = String(item.startDate ?? "").slice(0, 10);
        if (!startDate || startDate < today) continue;
        const loc = item.location as Record<string, unknown> | undefined;
        const venue = loc?.name ? String(loc.name) : defaultVenue;
        const url = String(item.url ?? item["@id"] ?? sourceUrl);
        events.push({
          id: `${hostname}-${startDate}-${name.slice(0, 20).replace(/\s+/g, "-").toLowerCase()}`,
          date: toDisplayDate(startDate),
          rawDate: startDate,
          name, venue, url,
          type: guessType(name, desc),
          isNext: false,
        });
      }
    } catch { /* skip malformed block */ }
  }
  return events;
}

async function scrapeSiteEvents(
  sourceUrl: string,
  defaultVenue: string,
  filterFn: (name: string, desc: string) => boolean = isFashionRelated,
): Promise<MadridEvent[]> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  let html = "";
  try {
    const res = await fetch(sourceUrl, {
      cache: "no-store",
      signal: ctrl.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; KarenAlexandra/1.0)" },
    });
    clearTimeout(t);
    if (!res.ok) return [];
    html = await res.text();
  } catch { clearTimeout(t); return []; }

  const today = new Date().toISOString().slice(0, 10);
  const hostname = (() => { try { return new URL(sourceUrl).hostname.replace(/\W+/g, "-"); } catch { return "src"; } })();

  // 1. Try JSON-LD (structured, reliable)
  const structured = parseJsonLd(html, sourceUrl, defaultVenue, filterFn, today);
  if (structured.length > 0) return structured;

  // 2. LLM fallback: let Claude read the page text
  const text = htmlToText(html);
  const llmEvents = await extractEventsWithLLM(text, sourceUrl);

  return llmEvents.map((e) => ({
    id: `llm-${hostname}-${e.startDate}-${e.name.slice(0, 20).replace(/\s+/g, "-").toLowerCase()}`,
    date: toDisplayDate(e.startDate),
    rawDate: e.startDate,
    name: e.name,
    venue: e.venue || defaultVenue,
    type: e.type || guessType(e.name, ""),
    url: e.url,
    isNext: false,
  }));
}

// ── Source scrapers ────────────────────────────────────────────────────────────

const fetchIFEMAEvents        = () => scrapeSiteEvents("https://www.ifema.es/en/calendar",              "IFEMA Madrid",                         isFashionRelated);
const fetchMuseoDelTrajeEvents= () => scrapeSiteEvents("https://www.cultura.gob.es/museodeltaje/actividades/actividades-culturales.html", "Museo del Traje, Madrid", () => true);
const fetchRomanticismoEvents = () => scrapeSiteEvents("https://museoromanticismo.mcu.es/actividades-y-didactica/actividades.html",       "Museo del Romanticismo, Madrid",       (n, d) => !((n + d).toLowerCase().includes("concierto")));
const fetchCasaEncendidaEvents= () => scrapeSiteEvents("https://www.lacasaencendida.es/programacion",   "La Casa Encendida, Madrid",            (n, d) => ["moda","fashion","diseño","design","exposición","exhibition","colección","textil"].some((kw) => (n+d).toLowerCase().includes(kw)));
const fetchISEMEvents         = () => scrapeSiteEvents("https://www.isem.es/agenda/",                   "ISEM Fashion Business School, Madrid", isFashionRelated);
const fetchLoeweProgramme     = () => scrapeSiteEvents("https://craftprize.loewe.com/",                 "Loewe Foundation, Calle Goya 35, Madrid", () => true);
const fetchWOWEvents          = () => scrapeSiteEvents("https://wowconcept.com/blogs/news",             "WOW Concept, Gran Vía 32, Madrid",     () => true);
const fetchPedroDelHierroEvents = () => scrapeSiteEvents("https://www.pedrodelhierro.com/es/events",   "Pedro del Hierro, Madrid",             () => true);
const fetchESDENEvents        = () => scrapeSiteEvents("https://www.esden.es/blog/",                    "ESDEN Business School, Madrid",        isFashionRelated);

// ── Known annual events with live URL validation ───────────────────────────────

async function getKnownAnnualEvents(): Promise<MadridEvent[]> {
  const now = new Date();
  const year = now.getFullYear();
  const today = now.toISOString().slice(0, 10);

  const mbfwUrl = await pickReachableUrl([
    "https://mbfwmadrid.com",
    "https://www.ifema.es/en/mbfw-madrid",
    "https://www.ifema.es/mbfw-madrid",
  ]);

  const candidates: MadridEvent[] = [
    { id: `mbfw-${year}-feb`, date: "FEB 01", rawDate: `${year}-02-01`, name: "MBFWMadrid — Otoño/Invierno",     venue: "IFEMA Madrid",                         type: "Show", url: mbfwUrl,                                   isNext: false },
    { id: `mbfw-${year}-sep`, date: "SEP 09", rawDate: `${year}-09-09`, name: "MBFWMadrid — Primavera/Verano",  venue: "IFEMA Madrid",                         type: "Show", url: mbfwUrl,                                   isNext: false },
    { id: `loewe-${year}`,    date: "JUL 01", rawDate: `${year}-07-01`, name: "Loewe Foundation Craft Prize", venue: "Loewe Foundation, Calle Goya 35, Madrid", type: "Expo", url: "https://craftprize.loewe.com/", isNext: false },
    { id: `museodeltaje-${year}`, date: "JUN 01", rawDate: `${year}-06-01`, name: "Museo del Traje — Permanent Collection", venue: "Museo del Traje, Madrid", type: "Expo", url: "https://www.cultura.gob.es/museodeltaje",  isNext: false },
  ];

  return candidates.filter((e) => e.rawDate >= today);
}

// ── Deduplication ──────────────────────────────────────────────────────────────

function normalizeKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/[áàäâ]/g, "a").replace(/[éèëê]/g, "e")
    .replace(/[íìïî]/g, "i").replace(/[óòöô]/g, "o")
    .replace(/[úùüû]/g, "u").replace(/ñ/g, "n")
    .replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").trim()
    .split(" ").slice(0, 4).join(" ");
}

function deduplicateEvents(events: MadridEvent[]): MadridEvent[] {
  const seenNames = new Set<string>();
  const seenDateVenue = new Set<string>();
  const result: MadridEvent[] = [];
  for (const ev of events) {
    const nameKey = normalizeKey(ev.name);
    const dvKey = `${ev.rawDate}|${ev.venue.toLowerCase().slice(0, 30)}`;
    if (seenNames.has(nameKey) || seenDateVenue.has(dvKey)) continue;
    seenNames.add(nameKey);
    seenDateVenue.add(dvKey);
    result.push(ev);
  }
  return result;
}

// ── Handler ────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  const isLocal = new URL(req.url).hostname === "localhost";

  if (!isLocal && cronSecret && auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [
      ifema, museoTraje, romanticismo, casaEncendida,
      isem, loewe, wow, pedroHierro, esden, annual,
    ] = await Promise.all([
      fetchIFEMAEvents(),
      fetchMuseoDelTrajeEvents(),
      fetchRomanticismoEvents(),
      fetchCasaEncendidaEvents(),
      fetchISEMEvents(),
      fetchLoeweProgramme(),
      fetchWOWEvents(),
      fetchPedroDelHierroEvents(),
      fetchESDENEvents(),
      getKnownAnnualEvents(),
    ]);

    const merged = deduplicateEvents([
      ...ifema, ...museoTraje, ...romanticismo, ...casaEncendida,
      ...isem, ...loewe, ...wow, ...pedroHierro, ...esden, ...annual,
    ]);

    const all = merged
      .sort((a, b) => a.rawDate.localeCompare(b.rawDate))
      .slice(0, 6)
      .map((e, i) => ({ ...e, isNext: i === 0 }));

    const sources = {
      ifema: ifema.length, museoTraje: museoTraje.length,
      romanticismo: romanticismo.length, casaEncendida: casaEncendida.length,
      isem: isem.length, loewe: loewe.length,
      wow: wow.length, pedroHierro: pedroHierro.length,
      esden: esden.length, annual: annual.length,
    };

    if (all.length > 0) {
      await saveMadridCalendarEvents(all);
      return NextResponse.json({ ok: true, sources, count: all.length, events: all });
    }

    return NextResponse.json({ ok: true, source: "no-results", count: 0, note: "Static fallback active on page" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
