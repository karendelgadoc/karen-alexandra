import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { getMadridAutoEvents, getMadridManualEvents, saveMadridManualEvents } from "@/lib/madrid-events-db";

// GET — returns { auto, manual } so the admin UI can display both
export async function GET(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;

  const [auto, manual] = await Promise.all([
    getMadridAutoEvents().catch(() => []),
    getMadridManualEvents().catch(() => []),
  ]);

  return NextResponse.json({ auto, manual });
}

// POST — add a manually curated event
export async function POST(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;

  const body = await req.json().catch(() => null);
  if (!body?.event) return NextResponse.json({ error: "Missing event" }, { status: 400 });

  const ev = body.event as { id?: string; name: string; rawDate: string; date: string; venue: string; type: string; url: string };
  if (!ev.name || !ev.rawDate || !ev.date || !ev.venue || !ev.url) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const current = await getMadridManualEvents().catch(() => []);
  const newEvent = { ...ev, id: ev.id ?? `manual-${Date.now()}`, isNext: false };

  // Avoid duplicates by id
  const updated = [...current.filter((e) => e.id !== newEvent.id), newEvent];
  await saveMadridManualEvents(updated);

  return NextResponse.json({ ok: true, event: newEvent });
}

// DELETE ?id=xxx — remove a manually curated event
export async function DELETE(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const current = await getMadridManualEvents().catch(() => []);
  await saveMadridManualEvents(current.filter((e) => e.id !== id));

  return NextResponse.json({ ok: true });
}
