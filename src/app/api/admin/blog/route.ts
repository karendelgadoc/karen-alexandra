import { NextRequest, NextResponse } from "next/server";
import { getAllBlogPostsAdmin, createBlogPost } from "@/lib/blog-db";
import { requireAdmin } from "@/lib/admin-guard";
import { pingIndexNow, indexNowUrl } from "@/lib/indexnow";

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  try {
    const posts = await getAllBlogPostsAdmin();
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
    const post = await createBlogPost(body);
    if (post.published) {
      pingIndexNow([
        indexNowUrl.blogPost(post.slug),
        indexNowUrl.journalIndex(),
        indexNowUrl.home(),
      ]);
    }
    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
