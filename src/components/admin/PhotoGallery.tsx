"use client";

import { useState, useRef, useCallback } from "react";

interface Photo {
  id: string;
  storage_key: string | null;
  url: string;
  filename: string;
  title: string | null;
  alt_text: string | null;
  description: string | null;
  tags: string[];
  location: string | null;
  photographer: string | null;
  width: number | null;
  height: number | null;
  source: string;
  created_at: string;
}

interface Props {
  initialPhotos: Photo[];
  adminKey: string;
}

export default function PhotoGallery({ initialPhotos, adminKey }: Props) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [selected, setSelected] = useState<Photo | null>(null);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // edit form state
  const [form, setForm] = useState<Partial<Photo>>({});

  const filtered = photos.filter((p) => {
    const q = search.toLowerCase();
    return (
      !q ||
      p.filename.toLowerCase().includes(q) ||
      (p.title ?? "").toLowerCase().includes(q) ||
      (p.location ?? "").toLowerCase().includes(q) ||
      (p.tags ?? []).some((t) => t.toLowerCase().includes(q))
    );
  });

  function openPhoto(photo: Photo) {
    setSelected(photo);
    setForm({
      title: photo.title ?? "",
      alt_text: photo.alt_text ?? "",
      description: photo.description ?? "",
      tags: photo.tags ?? [],
      location: photo.location ?? "",
      photographer: photo.photographer ?? "",
    });
    setSaveMsg(null);
  }

  async function handleUploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError(null);

    const uploaded: Photo[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 20 * 1024 * 1024) {
        setUploadError(`${file.name} exceeds 20 MB limit`);
        continue;
      }
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/photos/upload", {
          method: "POST",
          headers: { "x-admin-key": adminKey },
          body: fd,
        });
        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody.error ?? `Upload failed (${res.status})`);
        }
        const photo = await res.json();
        uploaded.push(photo);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Upload failed");
      }
    }

    if (uploaded.length > 0) setPhotos((prev) => [...uploaded, ...prev]);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch(`/api/admin/photos/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Save failed");
      const updated = await res.json();
      setPhotos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setSelected(updated);
      setSaveMsg("Saved");
      setTimeout(() => setSaveMsg(null), 2000);
    } catch {
      setSaveMsg("Error saving");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!selected) return;
    if (!confirm(`Delete "${selected.title || selected.filename}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/photos/${selected.id}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      });
      setPhotos((prev) => prev.filter((p) => p.id !== selected.id));
      setSelected(null);
    } catch {
      alert("Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  function copyUrl() {
    if (!selected) return;
    navigator.clipboard.writeText(selected.url);
    setSaveMsg("URL copied!");
    setTimeout(() => setSaveMsg(null), 1500);
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleUploadFiles(e.dataTransfer.files);
  }, []); // eslint-disable-line

  return (
    <div className="flex h-full min-h-0">
      {/* Main panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-stone-200 shrink-0">
          <input
            type="search"
            placeholder="Search photos…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 max-w-xs border border-stone-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
          <span className="text-xs text-stone-400">{filtered.length} photos</span>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="ml-auto px-4 py-1.5 bg-stone-900 text-white text-sm rounded hover:bg-stone-700 disabled:opacity-50 transition-colors"
          >
            {uploading ? "Uploading…" : "+ Upload Photos"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleUploadFiles(e.target.files)}
          />
        </div>
        {uploadError && (
          <div className="px-6 py-2 bg-red-50 text-red-700 text-xs border-b border-red-100">{uploadError}</div>
        )}

        {/* Drop zone + grid */}
        <div
          className={`flex-1 overflow-y-auto p-6 ${dragOver ? "ring-2 ring-inset ring-stone-400 bg-stone-50" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {dragOver && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <p className="text-stone-500 text-lg font-medium bg-white/90 px-6 py-3 rounded shadow">Drop photos to upload</p>
            </div>
          )}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-stone-400">
              <p className="text-sm">{search ? "No photos match your search." : "No photos yet. Upload some above."}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {filtered.map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => openPhoto(photo)}
                  className={`group relative aspect-square overflow-hidden rounded border-2 transition-all focus:outline-none ${
                    selected?.id === photo.id
                      ? "border-stone-800 shadow-md"
                      : "border-transparent hover:border-stone-300"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={photo.alt_text ?? photo.title ?? photo.filename}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs truncate">{photo.title || photo.filename}</p>
                  </div>
                  {photo.source === "static" && (
                    <span className="absolute top-1 right-1 text-[9px] bg-stone-800/70 text-white px-1 py-0.5 rounded">site</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Side panel — metadata editor */}
      {selected && (
        <div className="w-80 shrink-0 border-l border-stone-200 flex flex-col overflow-hidden bg-white">
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 shrink-0">
            <h3 className="text-sm font-medium text-stone-800 truncate">{selected.title || selected.filename}</h3>
            <button onClick={() => setSelected(null)} className="text-stone-400 hover:text-stone-600 text-lg leading-none ml-2">×</button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Preview */}
            <div className="aspect-video bg-stone-100 relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selected.url}
                alt={selected.alt_text ?? ""}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-4 space-y-4">
              {/* Source badge */}
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span className={`px-2 py-0.5 rounded-full text-xs ${selected.source === 'static' ? 'bg-stone-100 text-stone-500' : 'bg-green-50 text-green-700'}`}>
                  {selected.source === 'static' ? 'Site photo' : 'Library upload'}
                </span>
                <span className="truncate text-stone-300">{selected.filename}</span>
              </div>

              {/* URL copy */}
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">URL</label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    readOnly
                    value={selected.url}
                    className="flex-1 min-w-0 text-xs border border-stone-200 rounded px-2 py-1.5 bg-stone-50 text-stone-500 truncate"
                  />
                  <button
                    onClick={copyUrl}
                    className="shrink-0 text-xs px-2 py-1.5 border border-stone-200 rounded bg-stone-50 hover:bg-stone-100 transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Fields */}
              <Field label="Title">
                <input
                  type="text"
                  value={(form.title as string) ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Descriptive photo title"
                  className={inputCls}
                />
              </Field>

              <Field label="Alt text" hint="Shown to screen readers and search engines">
                <textarea
                  rows={2}
                  value={(form.alt_text as string) ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, alt_text: e.target.value }))}
                  placeholder="Describe what's in the photo"
                  className={inputCls}
                />
              </Field>

              <Field label="Location" hint="Helps with geo SEO — e.g. Mykonos, Greece">
                <input
                  type="text"
                  value={(form.location as string) ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="City, Country"
                  className={inputCls}
                />
              </Field>

              <Field label="Tags" hint="Comma-separated: travel, fashion, wellness">
                <input
                  type="text"
                  value={Array.isArray(form.tags) ? (form.tags as string[]).join(", ") : ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                    }))
                  }
                  placeholder="travel, mykonos, summer"
                  className={inputCls}
                />
              </Field>

              <Field label="Photographer / Credit">
                <input
                  type="text"
                  value={(form.photographer as string) ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, photographer: e.target.value }))}
                  placeholder="Karen Alexandra"
                  className={inputCls}
                />
              </Field>

              <Field label="Description / Caption">
                <textarea
                  rows={3}
                  value={(form.description as string) ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Optional longer caption for galleries or blog use"
                  className={inputCls}
                />
              </Field>

              <div className="pt-1 flex items-center gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-2 bg-stone-900 text-white text-sm rounded hover:bg-stone-700 disabled:opacity-50 transition-colors"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
                {saveMsg && (
                  <span className={`text-xs ${saveMsg.includes("Error") ? "text-red-600" : "text-green-600"}`}>
                    {saveMsg}
                  </span>
                )}
              </div>

              {/* Download (admin only) */}
              <a
                href={selected.url}
                download={selected.filename}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-2 border border-stone-200 text-stone-600 text-sm rounded hover:bg-stone-50 transition-colors"
              >
                Download original
              </a>

              {/* Delete */}
              {selected.source !== "static" && (
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full py-2 text-red-600 text-sm border border-red-200 rounded hover:bg-red-50 disabled:opacity-50 transition-colors"
                >
                  {deleting ? "Deleting…" : "Delete photo"}
                </button>
              )}
              {selected.source === "static" && (
                <p className="text-xs text-stone-400 text-center">Site photos cannot be deleted here — they are part of the codebase.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls =
  "w-full border border-stone-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 resize-none";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-stone-600 mb-1">{label}</label>
      {hint && <p className="text-xs text-stone-400 mb-1">{hint}</p>}
      {children}
    </div>
  );
}
