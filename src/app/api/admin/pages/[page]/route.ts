import { NextRequest, NextResponse } from "next/server";
import {
  PAGE_KEYS,
  getHomeContent,
  getPortfolioContent,
  getContactContent,
  getWatchContent,
  getAboutContent,
  upsertPageContent,
  type PageKey,
} from "@/lib/page-content-db";

import { requireAdmin } from "@/lib/admin-guard";
import { pingIndexNow, indexNowUrl } from "@/lib/indexnow";

const PAGE_TO_PATH: Record<string, string> = {
  home: "/",
  portfolio: "/portfolio",
  contact: "/contact",
  watch: "/watch",
  about: "/about",
};

const FETCHERS: Record<PageKey, () => Promise<unknown>> = {
  home: getHomeContent,
  portfolio: getPortfolioContent,
  contact: getContactContent,
  watch: getWatchContent,
  about: getAboutContent,
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const { page } = await params;
  if (!PAGE_KEYS.includes(page as PageKey)) {
    return NextResponse.json({ error: "Unknown page" }, { status: 404 });
  }
  try {
    const content = await FETCHERS[page as PageKey]();
    return NextResponse.json(content);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const { page } = await params;
  if (!PAGE_KEYS.includes(page as PageKey)) {
    return NextResponse.json({ error: "Unknown page" }, { status: 404 });
  }
  try {
    const body = await request.json();
    await upsertPageContent(page, body);
    const path = PAGE_TO_PATH[page];
    if (path) pingIndexNow(indexNowUrl.page(path));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
