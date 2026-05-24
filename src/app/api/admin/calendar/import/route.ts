import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { extractEventsFromUrl } from "@/lib/event-extractor";

// POST { url } → fetch page → LLM extract → return event previews for admin approval
export async function POST(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;

  const body = await req.json().catch(() => null);
  const url = typeof body?.url === "string" ? body.url.trim() : "";
  if (!url || !url.startsWith("http")) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured. Add it in Vercel environment variables." },
      { status: 503 },
    );
  }

  const events = await extractEventsFromUrl(url);
  return NextResponse.json({ events, source: url });
}
