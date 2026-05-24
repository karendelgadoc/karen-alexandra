import { NextRequest, NextResponse } from "next/server";
import { getAllFashionNewsAdmin, createBlogPost } from "@/lib/blog-db";
import { requireAdmin } from "@/lib/admin-guard";
import { pingIndexNow, indexNowUrl } from "@/lib/indexnow";

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  try {
    const posts = await getAllFashionNewsAdmin();
    return NextResponse.json(posts);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  try {
    const body = await request.json();
    // Force category regardless of what the client sends
    const post = await createBlogPost({ ...body, category: "fashion-news" });
    if (post.published) {
      pingIndexNow([
        indexNowUrl.fashionNews(post.slug),
        indexNowUrl.fashionNewsIndex(),
        indexNowUrl.home(),
      ]);
    }
    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
