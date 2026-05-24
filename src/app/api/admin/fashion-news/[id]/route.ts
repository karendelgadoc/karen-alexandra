import { NextRequest, NextResponse } from "next/server";
import { getFashionNewsPostById, updateBlogPost, deleteBlogPost } from "@/lib/blog-db";
import { requireAdmin } from "@/lib/admin-guard";
import { pingIndexNow, indexNowUrl } from "@/lib/indexnow";

interface Params { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: Params) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const { id } = await params;
  try {
    const post = await getFashionNewsPostById(id);
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const { id } = await params;
  try {
    const body = await request.json();
    // Keep category locked to fashion-news
    const post = await updateBlogPost(id, { ...body, category: "fashion-news" });
    if (post.published) {
      pingIndexNow([
        indexNowUrl.fashionNews(post.slug),
        indexNowUrl.fashionNewsIndex(),
      ]);
    }
    return NextResponse.json(post);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const { id } = await params;
  try {
    const post = await getFashionNewsPostById(id).catch(() => null);
    await deleteBlogPost(id);
    if (post) {
      pingIndexNow([
        indexNowUrl.fashionNews(post.slug),
        indexNowUrl.fashionNewsIndex(),
      ]);
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
