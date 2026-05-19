import { NextRequest, NextResponse } from "next/server";
import { getMenuContent, upsertPageContent } from "@/lib/page-content-db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const content = await getMenuContent();
  return NextResponse.json(content);
}

export async function PUT(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  try {
    const body = await request.json();
    await upsertPageContent("menu", body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
