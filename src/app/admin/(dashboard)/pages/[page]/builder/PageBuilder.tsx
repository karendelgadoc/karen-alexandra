"use client";

import { useState, useMemo, type ReactNode } from "react";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SectionItem {
  id: string;
  label: string;
  isHidden: boolean;
  node: ReactNode;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconDrag() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
      <rect x="2" y="2" width="10" height="2" rx="1" />
      <rect x="2" y="6" width="10" height="2" rx="1" />
      <rect x="2" y="10" width="10" height="2" rx="1" />
    </svg>
  );
}
function IconEye({ off }: { off?: boolean }) {
  return off ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// ── A draggable wrapper for the rendered section ──────────────────────────────

function DraggableSection({
  id, label, isHidden, children, onToggleHidden,
}: {
  id: string;
  label: string;
  isHidden: boolean;
  children: ReactNode;
  onToggleHidden: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  if (isHidden) {
    return (
      <div
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
          zIndex: isDragging ? 50 : undefined,
          position: "relative",
        }}
        className="ka-builder-section"
      >
        <div
          style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "16px 24px", background: "#fafaf9",
            border: "1px dashed #d6d3d1", borderRadius: 4,
            color: "#a8a29e", fontFamily: "system-ui, sans-serif",
            margin: "0 32px",
          }}
        >
          <button
            {...listeners} {...attributes}
            style={{ cursor: "grab", border: "none", background: "none", padding: 4, color: "#a8a29e", display: "flex", touchAction: "none" }}
            title="Drag to reorder"
          ><IconDrag /></button>
          <span style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", flex: 1 }}>
            {label} <span style={{ marginLeft: 8, fontStyle: "italic", textTransform: "none", letterSpacing: 0 }}>(hidden — visitors don&apos;t see this)</span>
          </span>
          <button
            onClick={() => onToggleHidden(id)}
            style={{ border: "1px solid #d6d3d1", background: "white", padding: "6px 12px", borderRadius: 3, fontSize: 11, color: "#57534e", cursor: "pointer", letterSpacing: "0.05em", textTransform: "uppercase" }}
          >
            Show
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : undefined,
        position: "relative",
        outline: isDragging ? "2px solid #7c3aed" : "none",
        outlineOffset: -2,
        opacity: isDragging ? 0.85 : 1,
      }}
      className="ka-builder-section"
    >
      {/* Hover overlay with controls — invisible by default, shows on hover */}
      <div className="ka-builder-overlay" aria-hidden="true" />

      {/* Top-left section label + drag handle */}
      <div className="ka-builder-handle">
        <button
          {...listeners} {...attributes}
          style={{ cursor: "grab", border: "none", background: "none", padding: 4, color: "white", display: "flex", touchAction: "none" }}
          title="Drag to reorder"
        ><IconDrag /></button>
        <span style={{ fontSize: 10, color: "white", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "system-ui, sans-serif" }}>{label}</span>
      </div>

      {/* Top-right: hide + edit */}
      <div className="ka-builder-controls">
        <button
          onClick={() => onToggleHidden(id)}
          title="Hide section"
          style={{ border: "none", background: "rgba(0,0,0,0.85)", color: "white", padding: 8, borderRadius: 3, cursor: "pointer", display: "flex" }}
        >
          <IconEye />
        </button>
      </div>

      {/* The actual rendered section */}
      {children}
    </div>
  );
}

// ── Main builder ──────────────────────────────────────────────────────────────

export default function PageBuilder({
  page, sectionItems, initialOrder, initialHidden, currentContent,
}: {
  page: string;
  sectionItems: SectionItem[];
  initialOrder: string[];
  initialHidden: string[];
  currentContent: Record<string, unknown>;
}) {
  // Build a stable ordered list that includes every section (visible + hidden), respecting saved order
  const allIds = useMemo(() => sectionItems.map((s) => s.id), [sectionItems]);
  const initOrdered = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const id of initialOrder) {
      if (allIds.includes(id) && !seen.has(id)) { result.push(id); seen.add(id); }
    }
    for (const id of allIds) {
      if (!seen.has(id)) { result.push(id); seen.add(id); }
    }
    return result;
  }, [allIds, initialOrder]);

  const [order, setOrder] = useState<string[]>(initOrdered);
  const [hidden, setHidden] = useState<Set<string>>(new Set(initialHidden));
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [isDirty, setIsDirty] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setOrder((prev) => arrayMove(prev, prev.indexOf(active.id as string), prev.indexOf(over.id as string)));
      setIsDirty(true);
    }
  }

  function toggleHidden(id: string) {
    setHidden((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setIsDirty(true);
  }

  async function saveLayout() {
    setStatus("saving");
    try {
      const res = await fetch(`/api/admin/pages/${page}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...currentContent, sectionOrder: order, hiddenSections: [...hidden] }),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
      setIsDirty(false);
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  // Block link clicks and form submissions inside the canvas so the user
  // doesn't accidentally navigate away by clicking a CTA in a rendered section.
  function blockNav(e: React.MouseEvent | React.FormEvent) {
    const target = (e.target as Element).closest("a, button[type=submit], form");
    if (target) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  const orderedItems = order
    .map((id) => sectionItems.find((s) => s.id === id))
    .filter((s): s is SectionItem => !!s);

  const visibleCount = orderedItems.filter((s) => !hidden.has(s.id)).length;
  const hiddenCount = orderedItems.length - visibleCount;

  return (
    <>
      {/* Scoped styles for the builder canvas — hover overlay etc. */}
      <style>{`
        .ka-builder-section { position: relative; }
        .ka-builder-overlay {
          position: absolute; inset: 0; pointer-events: none;
          border: 2px solid transparent; transition: border-color 0.15s;
          z-index: 9;
        }
        .ka-builder-handle, .ka-builder-controls {
          position: absolute; z-index: 11;
          opacity: 0; transition: opacity 0.15s; pointer-events: none;
          display: flex; align-items: center; gap: 8px;
        }
        .ka-builder-handle {
          top: 12px; left: 12px;
          background: rgba(0,0,0,0.85); color: white;
          padding: 6px 12px 6px 6px; border-radius: 3px;
        }
        .ka-builder-controls { top: 12px; right: 12px; }
        .ka-builder-section:hover .ka-builder-overlay { border-color: #7c3aed; }
        .ka-builder-section:hover .ka-builder-handle,
        .ka-builder-section:hover .ka-builder-controls {
          opacity: 1; pointer-events: auto;
        }
      `}</style>

      <div style={{ display: "flex", height: "100%", overflow: "hidden", fontFamily: "system-ui, -apple-system, sans-serif" }}>

        {/* ── Left sidebar ─────────────────────────────────────────────── */}
        <aside
          style={{
            width: 240, flexShrink: 0, background: "white",
            borderRight: "1px solid #e7e5e4", display: "flex", flexDirection: "column",
          }}
        >
          <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid #f5f5f4" }}>
            <p style={{ fontSize: 11, color: "#a8a29e", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6 }}>
              Sections
            </p>
            <p style={{ fontSize: 11, color: "#a8a29e", lineHeight: 1.5 }}>
              {visibleCount} visible · {hiddenCount} hidden
            </p>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {orderedItems.map((s, i) => (
              <div
                key={s.id}
                onClick={(e) => {
                  // Scroll the canvas to this section
                  e.preventDefault();
                  const target = document.querySelector(`[data-builder-section="${s.id}"]`);
                  target?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 14px", borderBottom: "1px solid #f5f5f4",
                  cursor: "pointer", opacity: hidden.has(s.id) ? 0.45 : 1,
                  background: "white", transition: "background 0.12s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#fafaf9")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
              >
                <span style={{ fontSize: 10, color: "#a8a29e", fontFamily: "monospace", width: 18 }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ flex: 1, fontSize: 13, color: hidden.has(s.id) ? "#a8a29e" : "#292524", textDecoration: hidden.has(s.id) ? "line-through" : "none" }}>
                  {s.label}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleHidden(s.id); }}
                  style={{ border: "none", background: "none", color: hidden.has(s.id) ? "#a8a29e" : "#57534e", padding: 4, cursor: "pointer", display: "flex" }}
                  title={hidden.has(s.id) ? "Show" : "Hide"}
                >
                  <IconEye off={hidden.has(s.id)} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ padding: 14, borderTop: "1px solid #e7e5e4", display: "flex", flexDirection: "column", gap: 8 }}>
            <button
              onClick={saveLayout}
              disabled={!isDirty || status === "saving"}
              style={{
                padding: "10px 14px",
                background: isDirty ? "#171717" : "#f5f5f4",
                color: isDirty ? "white" : "#a8a29e",
                border: "none", borderRadius: 3,
                cursor: isDirty ? "pointer" : "default",
                fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              {status === "saving" ? "Saving…" : status === "saved" ? "✓ Saved" : status === "error" ? "Error — retry" : "Save Layout"}
            </button>
            <Link
              href={`/admin/pages/${page}`}
              style={{
                padding: "8px 12px", textAlign: "center" as const,
                background: "white", border: "1px solid #e7e5e4",
                color: "#57534e", textDecoration: "none", borderRadius: 3,
                fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
              }}
            >
              Edit Content →
            </Link>
          </div>
        </aside>

        {/* ── Visual canvas — the actual page rendered inline ─────────── */}
        <div
          onClick={blockNav}
          onSubmit={blockNav}
          style={{
            flex: 1, overflowY: "auto", background: "var(--ka-bg, white)",
            position: "relative",
          }}
        >
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={order} strategy={verticalListSortingStrategy}>
              {orderedItems.map((s) => (
                <div key={s.id} data-builder-section={s.id}>
                  <DraggableSection
                    id={s.id}
                    label={s.label}
                    isHidden={hidden.has(s.id)}
                    onToggleHidden={toggleHidden}
                  >
                    {s.node}
                  </DraggableSection>
                </div>
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </>
  );
}
