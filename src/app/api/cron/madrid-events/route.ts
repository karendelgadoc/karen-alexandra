import { NextRequest, NextResponse } from "next/server";
import { saveMadridCalendarEvents, type MadridEvent } from "@/lib/madrid-events-db";

const MONTH_ABBR = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

function toDisplayDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return `${MONTH_ABBR[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")}`;
}

function guessType(name: string, desc: string): string {
  const n = (name + " " + desc).toLowerCase();
  if (n.includes("fashion week") || n.includes("mbfw") || n.includes("pasarela") || n.includes("desfile")) return "Show";
  if (n.includes("footwear") || n.includes("accessories") || n.includes("momad") || n.includes("trade show") || n.includes("feria")) return "Fair";
  if (n.includes("exhib") || n.includes("expo") || n.includes("museo") || n.includes("museum") || n.includes("gallery")) return "Expo";
  if (n.includes("bridal") || n.includes("boda") || n.includes("novia")) return "Bridal";
  if (n.includes("festival") || n.includes("design") || n.includes("diseño")) return "Festival";
  return "Event";
}

const FASHION_KEYWORDS = [
  "moda", "fashion", "diseño", "design", "textil", "textile",
  "footwear", "calzado", "accessories", "accesorios",
  "momad", "mbfw", "bridal", "novia", "luxury", "lujo",
  "belleza", "beauty", "joyería", "jewellery",
  "loewe", "zara", "mango", "textil",
];

function isFashionRelated(name: string, desc: string): boolean {
  const text = (name + " " + desc).toLowerCase();
  return FASHION_KEYWORDS.some((kw) => text.includes(kw));
}

// ── Primary source: IFEMA Madrid calendar (JSON-LD structured data) ────────────
async function fetchIFEMAEvents(): Promise<MadridEvent[]> {
  const res = await fetch("https://www.ifema.es/en/calendar", {
    cache: "no-store",
    headers: { "User-Agent": "Mozilla/5.0 (compatible; KarenAlexandra/1.0)" },
  }).catch(() => null);

  if (!res?.ok) return [];

  const html = await res.text().catch(() => "");
  const events: MadridEvent[] = [];

  // IFEMA embeds one schema.org Event JSON-LD block per event on the page
  const blocks = html.match(/application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g) ?? [];

  for (const block of blocks) {
    try {
      const json = block.replace(/application\/ld\+json[^>]*>/, "").replace(/<\/script>/, "").trim();
      const d = JSON.parse(json) as Record<string, unknown>;
      if (d["@type"] !== "Event") continue;

      const name = String(d.name ?? "");
      const desc = String(d.description ?? "");
      if (!isFashionRelated(name, desc)) continue;

      const startDate = String(d.startDate ?? "");
      if (!startDate) continue;

      const today = new Date().toISOString().slice(0, 10);
      if (startDate < today) continue; // skip past events

      const url = String(d.url ?? "https://www.ifema.es/en/calendar");

      events.push({
        id: `ifema-${startDate}-${name.slice(0, 20).replace(/\s+/g, "-")}`,
        date: toDisplayDate(startDate),
        rawDate: startDate,
        name,
        venue: "IFEMA Madrid",
        type: guessType(name, desc),
        url,
        isNext: false,
      });
    } catch {
      // malformed block — skip
    }
  }

  return events;
}

// ── Secondary source: MBFWMadrid (known annual schedule) ──────────────────────
function getKnownAnnualEvents(): MadridEvent[] {
  const now = new Date();
  const year = now.getFullYear();

  // MBFWMadrid runs Feb and Sep each year at IFEMA
  // Loewe Foundation runs programming year-round at Calle Goya 35
  // Museo del Traje has ongoing fashion exhibitions
  const candidates: MadridEvent[] = [
    {
      id: `mbfw-${year}-sep`,
      date: `SEP 09`,
      rawDate: `${year}-09-09`,
      name: "MBFWMadrid — Primavera/Verano",
      venue: "IFEMA Madrid",
      type: "Show",
      url: "https://www.mbfwmadrid.com",
      isNext: false,
    },
    {
      id: `loewe-${year}`,
      date: `JUL 01`,
      rawDate: `${year}-07-01`,
      name: "Loewe Foundation — Summer Programming",
      venue: "Calle Goya 35, Madrid",
      type: "Expo",
      url: "https://loewefoundation.com",
      isNext: false,
    },
    {
      id: `museodeltaje-${year}`,
      date: `JUN 01`,
      rawDate: `${year}-06-01`,
      name: "Museo del Traje — Permanent Collection",
      venue: "Av. Juan de Herrera 2",
      type: "Expo",
      url: "https://www.cultura.gob.es/museodeltaje",
      isNext: false,
    },
  ];

  const today = now.toISOString().slice(0, 10);
  return candidates.filter((e) => e.rawDate >= today);
}

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  const isLocal = new URL(req.url).hostname === "localhost";

  if (!isLocal && cronSecret && auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Scrape IFEMA (best source for Madrid trade fairs & fashion events)
    const ifemaEvents = await fetchIFEMAEvents();

    // 2. Supplement with known annual events not listed on IFEMA
    const annualEvents = getKnownAnnualEvents();

    // Merge: IFEMA takes priority; add annual events that aren't already covered
    const ifemaIds = new Set(ifemaEvents.map((e) => e.rawDate.slice(0, 7))); // by month
    const extra = annualEvents.filter((e) => !ifemaIds.has(e.rawDate.slice(0, 7)));

    const all = [...ifemaEvents, ...extra]
      .sort((a, b) => a.rawDate.localeCompare(b.rawDate))
      .slice(0, 6)
      .map((e, i) => ({ ...e, isNext: i === 0 }));

    if (all.length > 0) {
      await saveMadridCalendarEvents(all);
      return NextResponse.json({ ok: true, source: "ifema+annual", count: all.length, events: all });
    }

    return NextResponse.json({ ok: true, source: "no-results", count: 0, note: "Static fallback active on page" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
