"use client";

import type { Section } from "@/lib/posts";
import ImageUploader from "./ImageUploader";

interface Props {
  section: Section;
  index: number;
  onChange: (index: number, section: Section) => void;
  onRemove: (index: number) => void;
}

const inputClass =
  "w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400";
const labelClass = "block text-xs font-medium text-stone-600 mb-1";

export default function SectionEditor({ section, index, onChange, onRemove }: Props) {
  const update = (patch: Partial<Section>) => onChange(index, { ...section, ...patch });

  return (
    <div className="border border-stone-200 rounded-lg p-4 bg-stone-50 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          Sección {index + 1}
        </span>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-xs text-red-500 hover:text-red-700"
        >
          Eliminar
        </button>
      </div>

      {/* Heading */}
      <div>
        <label className={labelClass}>Título (opcional)</label>
        <input
          type="text"
          value={section.heading ?? ""}
          onChange={(e) => update({ heading: e.target.value || undefined })}
          placeholder="Ej: E-Commerce & Digital Merchandising"
          className={inputClass}
        />
      </div>

      {section.heading && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Nivel de título</label>
            <select
              value={section.headingLevel ?? "h2"}
              onChange={(e) => update({ headingLevel: e.target.value as "h2" | "h3" })}
              className={inputClass}
            >
              <option value="h2">H2</option>
              <option value="h3">H3</option>
            </select>
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 text-sm text-stone-600">
              <input
                type="checkbox"
                checked={section.italic ?? false}
                onChange={(e) => update({ italic: e.target.checked || undefined })}
              />
              Cursiva
            </label>
          </div>
        </div>
      )}

      {/* Body */}
      <div>
        <label className={labelClass}>Texto (opcional — separa párrafos con línea en blanco)</label>
        <textarea
          value={section.body ?? ""}
          onChange={(e) => update({ body: e.target.value || undefined })}
          rows={4}
          placeholder="Escribe el contenido del párrafo aquí..."
          className={inputClass}
        />
      </div>

      {/* Image */}
      <div className="space-y-3">
        <ImageUploader
          label="Imagen de sección (opcional)"
          value={section.image ?? ""}
          onChange={(url) => update({ image: url || undefined })}
          placeholder="https://... o sube un archivo →"
        />
        <div>
          <label className={labelClass}>Alt de imagen</label>
          <input
            type="text"
            value={section.imageAlt ?? ""}
            onChange={(e) => update({ imageAlt: e.target.value || undefined })}
            placeholder="Descripción de la imagen"
            className={inputClass}
          />
        </div>
      </div>

      {/* List */}
      <div>
        <label className={labelClass}>
          Lista con viñetas (opcional — una por línea, formato &quot;Título: Descripción&quot;)
        </label>
        <textarea
          value={section.list?.join("\n") ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            update({ list: val ? val.split("\n").filter(Boolean) : undefined });
          }}
          rows={4}
          placeholder={"Producto 1: Descripción del producto\nProducto 2: Otra descripción"}
          className={inputClass}
        />
      </div>
    </div>
  );
}
