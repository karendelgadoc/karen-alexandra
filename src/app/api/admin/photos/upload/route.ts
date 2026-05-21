import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { getServerClient } from "@/lib/insforge";
import { createPhoto } from "@/lib/photos-db";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file in form data (field name should be 'file')" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: `Not an image (type: ${file.type || "unknown"})` }, { status: 400 });
    }
    // Vercel caps the request body at ~4.5 MB anyway; this is just a clean
    // 4.4 MB ceiling so we return a useful error instead of a generic 413.
    if (file.size > 4.4 * 1024 * 1024) {
      return NextResponse.json(
        { error: `File is ${(file.size / (1024 * 1024)).toFixed(1)} MB; serverless upload limit is 4.4 MB. Compress before uploading.` },
        { status: 413 }
      );
    }

    // Sanitize and ensure we keep some filename even if it's all special chars.
    const rawName = file.name || "image.jpg";
    let sanitized = rawName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9._-]/g, "");
    if (!sanitized || sanitized === "." || sanitized === ".." || /^\.+$/.test(sanitized)) {
      sanitized = `image-${Date.now()}.jpg`;
    }
    const key = `library/${Date.now()}-${sanitized}`;

    const insforge = getServerClient();
    const { error: uploadErr } = await insforge.storage
      .from("blog-images")
      .upload(key, file);

    if (uploadErr) {
      console.error("[photos/upload] storage upload failed", {
        key, name: rawName, size: file.size, type: file.type, message: uploadErr.message,
      });
      return NextResponse.json({ error: `Storage upload failed: ${uploadErr.message}` }, { status: 502 });
    }

    const url = `${process.env.NEXT_PUBLIC_INSFORGE_URL}/api/storage/buckets/blog-images/objects/${encodeURIComponent(key)}`;

    const photo = await createPhoto({
      storage_key: key,
      url,
      filename: sanitized,
      title: rawName.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
      source: "library",
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[photos/upload] unhandled error", msg);
    return NextResponse.json({ error: `Upload failed: ${msg}` }, { status: 500 });
  }
}
