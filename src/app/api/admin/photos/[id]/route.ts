import { NextRequest, NextResponse } from "next/server";
import { getPhotoById, updatePhoto, deletePhoto } from "@/lib/photos-db";
import { requireAdmin } from "@/lib/admin-guard";

interface Params { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: Params) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const { id } = await params;
  try {
    const photo = await getPhotoById(id);
    if (!photo) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(photo);
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
    const photo = await updatePhoto(id, body);
    return NextResponse.json(photo);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const { id } = await params;
  try {
    const photo = await getPhotoById(id).catch(() => null);
    await deletePhoto(id, photo?.storage_key);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
