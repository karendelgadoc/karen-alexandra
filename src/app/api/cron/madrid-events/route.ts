import { NextRequest, NextResponse } from "next/server";
import { saveMadridCalendarEvents, type MadridEvent } from "@/lib/madrid-events-db";
import { htmlToText, extractMetaContext, extractEventsWithLLM } from "@/lib/event-extractor";

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
        headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36" },
        redirect: "follow",
      });
      clearTimeout(t);
      if (res.ok) return true;
    } catch { clearTimeout(t); }
  }
  return false;
}

// Drops any event whose link is broken/unreachable so the calendar never
// publishes a dead URL. Runs all checks in parallel.
async function validateEventUrls(events: MadridEvent[]): Promise<MadridEvent[]> {
  const checks = await Promise.all(
    events.map(async (e) => ({ e, ok: await isUrlReachable(e.url) })),
  );
  return checks.filter((c) => c.ok).map((c) => c.e);
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
        let venue = loc?.name ? String(loc.name) : defaultVenue;
        // Some sources (IFEMA) repeat the event name in location.name — that's
        // not a real venue, so fall back to the source's default venue.
        if (venue.toLowerCase() === name.toLowerCase()) venue = defaultVenue;
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
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36" },
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

  // 2. LLM fallback: let Claude read the page meta tags + text
  const text = extractMetaContext(html) + htmlToText(html);
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

// IFEMA's dedicated fashion fairs each have their own page with accurate
// Event JSON-LD (real dates + working URLs). MBFW Madrid in particular is
// NOT in the main calendar feed — it only lives on its own page.
const IFEMA_FASHION_SLUGS = ["momad", "mbfw-madrid", "bisutex", "intergift"];
const fetchIFEMAFashionPages = async (): Promise<MadridEvent[]> => {
  const results = await Promise.all(
    IFEMA_FASHION_SLUGS.map((slug) =>
      scrapeSiteEvents(`https://www.ifema.es/en/${slug}`, "IFEMA Madrid", () => true),
    ),
  );
  return results.flat();
};
const fetchMuseoDelTrajeEvents= () => scrapeSiteEvents("https://www.cultura.gob.es/museodeltaje/actividades/actividades-culturales.html", "Museo del Traje, Madrid", () => true);
const fetchRomanticismoEvents = () => scrapeSiteEvents("https://museoromanticismo.mcu.es/actividades-y-didactica/actividades.html",       "Museo del Romanticismo, Madrid",       (n, d) => !((n + d).toLowerCase().includes("concierto")));
const fetchCasaEncendidaEvents= () => scrapeSiteEvents("https://www.lacasaencendida.es/programacion",   "La Casa Encendida, Madrid",            (n, d) => ["moda","fashion","diseño","design","exposición","exhibition","colección","textil"].some((kw) => (n+d).toLowerCase().includes(kw)));
const fetchISEMEvents         = () => scrapeSiteEvents("https://www.isem.es/agenda/",                   "ISEM Fashion Business School, Madrid", isFashionRelated);
const fetchLoeweProgramme     = () => scrapeSiteEvents("https://craftprize.loewe.com/",                 "Loewe Foundation, Calle Goya 35, Madrid", () => true);
const fetchWOWEvents          = () => scrapeSiteEvents("https://wowconcept.com/blogs/news",             "WOW Concept, Gran Vía 32, Madrid",     () => true);
const fetchPedroDelHierroEvents = () => scrapeSiteEvents("https://www.pedrodelhierro.com/es/events",   "Pedro del Hierro, Madrid",             () => true);
const fetchESDENEvents        = () => scrapeSiteEvents("https://www.esden.es/blog/",                    "ESDEN Business School, Madrid",        isFashionRelated);

// MODAES publishes a structured agenda. We parse it directly (rather than via
// the LLM) so each event links to its OWN page — the official "Web" link when
// present, otherwise the MODAES detail page — never the generic agenda. Kept to
// Madrid events only.
async function fetchMODAESEvents(): Promise<MadridEvent[]> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  let html = "";
  try {
    const res = await fetch("https://www.modaes.com/agenda", {
      cache: "no-store",
      signal: ctrl.signal,
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36" },
    });
    clearTimeout(t);
    if (!res.ok) return [];
    html = await res.text();
  } catch { clearTimeout(t); return []; }

  const decode = (s: string) => s.replace(/&amp;/g, "&").replace(/&#0?39;/g, "'").replace(/&quot;/g, '"').trim();
  const today = new Date().toISOString().slice(0, 10);
  const events: MadridEvent[] = [];
  const blocks = html.match(/<article class="agenda_list_item[^"]*"[^>]*id="[0-9_]+"[\s\S]*?<\/article>/g) ?? [];

  for (const b of blocks) {
    const id = b.match(/id="([0-9_]+)"/)?.[1] ?? "";
    const name = decode(b.match(/class="name">([^<]+)</)?.[1] ?? "");
    const modalidad = decode(b.match(/class="modalidad">([^<]+)</)?.[1] ?? "");
    if (!name) continue;

    // Exact start date from the add-to-calendar links (st=YYYYMMDD or startdt=YYYY-MM-DD)
    const st = b.match(/[?&]st=(\d{4})(\d{2})(\d{2})/);
    const startdt = b.match(/startdt=(\d{4}-\d{2}-\d{2})/);
    const startDate = st ? `${st[1]}-${st[2]}-${st[3]}` : startdt ? startdt[1] : "";
    if (!startDate || startDate < today) continue;

    // Madrid only: explicit location, or Modaes's own (Madrid-held) event series
    const isMadrid = /madrid/i.test(modalidad) || /modaes/i.test(name);
    if (!isMadrid) continue;

    // Specific event page: prefer the official "Web" link, else the MODAES detail page
    const webUrl = b.match(/<a href="(https?:\/\/[^"]+)"[^>]*>\s*Web\s*<\/a>/i)?.[1] ?? "";
    const url = webUrl || `https://www.modaes.com/agenda?id=${id}`;

    events.push({
      id: `modaes-${id}`,
      date: toDisplayDate(startDate),
      rawDate: startDate,
      name,
      venue: /madrid/i.test(modalidad) ? modalidad : "Madrid",
      type: guessType(name, modalidad),
      url,
      isNext: false,
    });
  }
  return events;
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
      ifema, ifemaFashion, museoTraje, romanticismo, casaEncendida,
      isem, loewe, wow, pedroHierro, esden, modaes,
    ] = await Promise.all([
      fetchIFEMAEvents(),
      fetchIFEMAFashionPages(),
      fetchMuseoDelTrajeEvents(),
      fetchRomanticismoEvents(),
      fetchCasaEncendidaEvents(),
      fetchISEMEvents(),
      fetchLoeweProgramme(),
      fetchWOWEvents(),
      fetchPedroDelHierroEvents(),
      fetchESDENEvents(),
      fetchMODAESEvents(),
    ]);

    // Every event here comes from a real source with a real date — no fabrication.
    const merged = deduplicateEvents([
      ...ifema, ...ifemaFashion, ...museoTraje, ...romanticismo, ...casaEncendida,
      ...isem, ...loewe, ...wow, ...pedroHierro, ...esden, ...modaes,
    ]);

    // Drop any event whose link is broken so we never publish a dead URL.
    const valid = await validateEventUrls(merged);

    const all = valid
      .sort((a, b) => a.rawDate.localeCompare(b.rawDate))
      .slice(0, 6)
      .map((e, i) => ({ ...e, isNext: i === 0 }));

    const sources = {
      ifema: ifema.length, ifemaFashion: ifemaFashion.length,
      museoTraje: museoTraje.length, romanticismo: romanticismo.length,
      casaEncendida: casaEncendida.length, isem: isem.length,
      loewe: loewe.length, wow: wow.length,
      pedroHierro: pedroHierro.length, esden: esden.length,
      modaes: modaes.length,
      droppedBrokenLinks: merged.length - valid.length,
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
