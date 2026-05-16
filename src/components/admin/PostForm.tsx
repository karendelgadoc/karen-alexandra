"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Section } from "@/lib/posts";
import type { AdminPost } from "@/lib/posts-db";
import SectionEditor from "./SectionEditor";
import ImageUploader from "./ImageUploader";

interface Props {
  initialData?: AdminPost;
}

const inputClass =
  "w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400";
const labelClass = "block text-xs font-medium text-stone-600 mb-1";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function PostForm({ initialData }: Props) {
  const router = useRouter();
  const isEdit = !!initialData;

  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [date, setDate] = useState(initialData?.date ?? new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState(initialData?.category ?? "Case Studies");
  const [heroImage, setHeroImage] = useState(initialData?.heroImage ?? "");
  const [heroAlt, setHeroAlt] = useState(initialData?.heroAlt ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [published, setPublished] = useState(initialData?.published ?? true);
  const [sections, setSections] = useState<Section[]>(initialData?.sections ?? []);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!isEdit) setSlug(slugify(value));
  }

  function addSection() {
    setSections((prev) => [...prev, {}]);
  }

  function updateSection(index: number, section: Section) {
    setSections((prev) => prev.map((s, i) => (i === index ? section : s)));
  }

  function removeSection(index: number) {
    setSections((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = { slug, title, date, category, heroImage, heroAlt, excerpt, sections, published };

    try {
      const url = isEdit ? `/api/admin/posts/${initialData!.id}` : "/api/admin/posts";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Error al guardar");
      }

      router.push("/admin/posts");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Basic fields */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 space-y-4">
        <h2 className="text-sm font-semibold text-stone-700">Información del post</h2>

        <div>
          <label className={labelClass}>Título *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Case Study: Mi Proyecto"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Slug (URL) *</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="case-study-mi-proyecto"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Fecha *</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Categoría *</label>
          <input
            type="text"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Case Studies"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Extracto (resumen corto) *</label>
          <textarea
            required
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            placeholder="Breve descripción del post que aparece en la lista..."
            className={inputClass}
          />
        </div>
      </div>

      {/* Hero image */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 space-y-4">
        <h2 className="text-sm font-semibold text-stone-700">Imagen de portada</h2>
        <ImageUploader
          label="Imagen principal *"
          value={heroImage}
          onChange={setHeroImage}
          placeholder="https://karenalexandra.com/... o sube un archivo →"
        />
        <div>
          <label className={labelClass}>Texto alternativo (alt) *</label>
          <input
            type="text"
            required
            value={heroAlt}
            onChange={(e) => setHeroAlt(e.target.value)}
            placeholder="Karen Alexandra | Fashion E-Commerce Merchandiser"
            className={inputClass}
          />
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-stone-700">
            Secciones del contenido ({sections.length})
          </h2>
          <button
            type="button"
            onClick={addSection}
            className="text-xs bg-stone-100 hover:bg-stone-200 border border-stone-300 px-3 py-1.5 rounded transition-colors"
          >
            + Añadir sección
          </button>
        </div>

        {sections.length === 0 && (
          <p className="text-sm text-stone-400 text-center py-6 border border-dashed border-stone-200 rounded-lg">
            Sin secciones. Añade una para empezar.
          </p>
        )}

        {sections.map((section, i) => (
          <SectionEditor
            key={i}
            section={section}
            index={i}
            onChange={updateSection}
            onRemove={removeSection}
          />
        ))}
      </div>

      {/* Publish + submit */}
      <div className="flex items-center justify-between pt-2">
        <label className="flex items-center gap-2 text-sm text-stone-600">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Publicado (visible en el sitio)
        </label>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-stone-500 hover:text-stone-700 px-4 py-2 rounded border border-stone-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="text-sm bg-stone-900 text-white px-6 py-2 rounded hover:bg-stone-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear post"}
          </button>
        </div>
      </div>
    </form>
  );
}
