import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { getServerClient } from "@/lib/insforge";
import { createPhoto } from "@/lib/photos-db";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: "File exceeds 20 MB limit" }, { status: 400 });
    }

    const sanitized = file.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9._-]/g, "");
    const key = `library/${Date.now()}-${sanitized}`;

    const insforge = getServerClient();
    const { error: uploadErr } = await insforge.storage
      .from("blog-images")
      .upload(key, file);

    if (uploadErr) {
      return NextResponse.json({ error: uploadErr.message }, { status: 500 });
    }

    const url = `${process.env.NEXT_PUBLIC_INSFORGE_URL}/storage/v1/object/public/blog-images/${key}`;

    const photo = await createPhoto({
      storage_key: key,
      url,
      filename: sanitized,
      title: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
      source: "library",
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
