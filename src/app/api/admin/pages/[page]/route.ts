import { NextRequest, NextResponse } from "next/server";
import {
  PAGE_KEYS,
  getHomeContent,
  getPortfolioContent,
  getJournalContent,
  getContactContent,
  getWatchContent,
  getAboutContent,
  getServicesContent,
  getMediaKitContent,
  upsertPageContent,
  type PageKey,
} from "@/lib/page-content-db";

import { requireAdmin } from "@/lib/admin-guard";
import { pingIndexNow, indexNowUrl } from "@/lib/indexnow";
import { isHiddenRoute } from "@/lib/site-flags";

const PAGE_TO_PATH: Record<string, string> = {
  home:        "/",
  portfolio:   "/portfolio",
  journal:     "/journal",
  contact:     "/contact",
  watch:       "/watch",
  about:       "/about",
  services:    "/services",
  "media-kit": "/media-kit",
};

const FETCHERS: Record<PageKey, () => Promise<unknown>> = {
  home:        getHomeContent,
  portfolio:   getPortfolioContent,
  journal:     getJournalContent,
  contact:     getContactContent,
  watch:       getWatchContent,
  about:       getAboutContent,
  services:    getServicesContent,
  "media-kit": getMediaKitContent,
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
    // Hidden pages 404 publicly, so there is nothing for IndexNow to crawl.
    if (path && !isHiddenRoute(path)) pingIndexNow(indexNowUrl.page(path));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
