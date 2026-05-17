import { NextRequest, NextResponse } from "next/server";
import { getAllBlogPostsAdmin, createBlogPost } from "@/lib/blog-db";

function requireSession(request: NextRequest) {
  const session = request.cookies.get("admin_session");
  if (!session?.value) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET(request: NextRequest) {
  const denied = requireSession(request);
  if (denied) return denied;
  try {
    const posts = await getAllBlogPostsAdmin();
    return NextResponse.json(posts);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const denied = requireSession(request);
  if (denied) return denied;
  try {
    const body = await request.json();
    const post = await createBlogPost(body);
    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
