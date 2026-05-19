"use client";

import { useEffect, useRef, useState } from "react";

interface Photo {
  id: string;
  url: string;
  filename: string;
  title: string | null;
  alt_text: string | null;
  tags: string[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  onPick: (photo: { url: string; alt: string }) => void;
}

export default function BlogImagePicker({ open, onClose, onPick }: Props) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch("/api/admin/photos")
      .then((r) => r.json())
      .then((data) => setPhotos(Array.isArray(data) ? data : []))
      .catch(() => setError("Failed to load photo library"))
      .finally(() => setLoading(false));
  }, [open]);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    let lastUploaded: Photo | null = null;
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/photos/upload", {
          method: "POST",
          body: fd,
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error ?? "Upload failed");
        }
        lastUploaded = await res.json();
        if (lastUploaded) setPhotos((prev) => [lastUploaded as Photo, ...prev]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    if (lastUploaded) {
      onPick({ url: lastUploaded.url, alt: lastUploaded.alt_text ?? lastUploaded.title ?? "" });
      onClose();
    }
  }

  if (!open) return null;

  const filtered = photos.filter((p) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      (p.title ?? "").toLowerCase().includes(s) ||
      (p.alt_text ?? "").toLowerCase().includes(s) ||
      p.filename.toLowerCase().includes(s) ||
      p.tags.some((t) => t.toLowerCase().includes(s))
    );
  });

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 32,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white", width: "100%", maxWidth: 1100, maxHeight: "85vh",
          display: "flex", flexDirection: "column", borderRadius: 4, overflow: "hidden",
        }}
      >
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #e7e5e4", display: "flex", alignItems: "center", gap: 16 }}>
          <h2 style={{ fontFamily: "var(--ka-display, Georgia)", fontSize: 22, fontStyle: "italic", margin: 0, flex: 1 }}>Choose an image</h2>
          <input
            type="text"
            placeholder="Search library…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: "1px solid #d6d3d1", padding: "8px 12px", fontSize: 13, borderRadius: 3, width: 220 }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            style={{
              border: "none", background: "#171717", color: "white",
              padding: "8px 16px", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
              cursor: uploading ? "default" : "pointer", borderRadius: 3,
            }}
          >
            {uploading ? "Uploading…" : "+ Upload"}
          </button>
          <input
            ref={fileRef} type="file" accept="image/*" multiple
            onChange={(e) => handleUpload(e.target.files)}
            style={{ display: "none" }}
          />
          <button
            type="button" onClick={onClose}
            style={{ border: "none", background: "none", fontSize: 20, color: "#78716c", cursor: "pointer", padding: 4 }}
          >×</button>
        </div>

        {error && <div style={{ padding: "8px 24px", background: "#fef2f2", color: "#b91c1c", fontSize: 12 }}>{error}</div>}

        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          {loading ? (
            <p style={{ color: "#a8a29e", fontSize: 13 }}>Loading photos…</p>
          ) : filtered.length === 0 ? (
            <p style={{ color: "#a8a29e", fontSize: 13 }}>No photos found. Upload one above.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
              {filtered.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => { onPick({ url: p.url, alt: p.alt_text ?? p.title ?? "" }); onClose(); }}
                  style={{
                    border: "1px solid #e7e5e4", background: "white", padding: 0,
                    cursor: "pointer", overflow: "hidden", borderRadius: 3, position: "relative",
                    aspectRatio: "1", display: "block",
                  }}
                  title={p.title ?? p.filename}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={p.alt_text ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
