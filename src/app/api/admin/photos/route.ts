import { NextRequest, NextResponse } from "next/server";
import { getAllPhotos, createPhoto } from "@/lib/photos-db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  try {
    const photos = await getAllPhotos();
    return NextResponse.json(photos);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  try {
    const body = await request.json();
    const photo = await createPhoto(body);
    return NextResponse.json(photo, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
