"use client";

import { useRef, useState } from "react";
import { getBrowserClient } from "@/lib/insforge";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

export default function ImageUploader({ value, onChange, label, placeholder }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten imágenes.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("La imagen no puede superar 10 MB.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const insforge = getBrowserClient();
      const { data, error: uploadError } = await insforge.storage
        .from("blog-images")
        .uploadAuto(file);

      if (uploadError || !data?.url) {
        throw new Error(uploadError?.message ?? "Error al subir la imagen");
      }

      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir");
    } finally {
      setUploading(false);
      // Reset so same file can be re-selected if needed
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const inputClass =
    "flex-1 min-w-0 border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400";

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-medium text-stone-600">{label}</label>
      )}

      <div className="flex gap-2 items-center">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "https://... o sube un archivo →"}
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="shrink-0 text-xs px-3 py-2 border border-stone-300 rounded bg-stone-50 hover:bg-stone-100 disabled:opacity-50 transition-colors whitespace-nowrap"
        >
          {uploading ? "Subiendo…" : "📁 Subir"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </div>

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}

      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt="Preview"
          className="h-28 object-cover rounded border border-stone-200 mt-1"
          onError={(e) => (e.currentTarget.style.display = "none")}
          onLoad={(e) => (e.currentTarget.style.display = "block")}
        />
      )}
    </div>
  );
}
