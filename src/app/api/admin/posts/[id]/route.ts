import { NextRequest, NextResponse } from "next/server";
import { getPostById, updatePost, deletePost } from "@/lib/posts-db";

interface Params {
  params: Promise<{ id: string }>;
}

function requireSession(request: NextRequest) {
  const session = request.cookies.get("admin_session");
  if (!session?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(req: NextRequest, { params }: Params) {
  const denied = requireSession(req);
  if (denied) return denied;
  const { id } = await params;
  try {
    const post = await getPostById(id);
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  const denied = requireSession(request);
  if (denied) return denied;
  const { id } = await params;
  try {
    const body = await request.json();
    const post = await updatePost(id, body);
    return NextResponse.json(post);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const denied = requireSession(req);
  if (denied) return denied;
  const { id } = await params;
  try {
    await deletePost(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
