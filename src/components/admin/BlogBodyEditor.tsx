"use client";

import { useEffect, useRef, useState } from "react";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  type Block, type BlockType, BLOCK_LABELS, makeBlock, parseBody, serializeBlocks,
} from "@/lib/blog-blocks";
import BlogImagePicker from "./BlogImagePicker";

interface Props {
  value: string;
  onChange: (body: string) => void;
}

const BLOCK_MENU: BlockType[] = ["paragraph", "heading", "image", "imageText", "highlight", "quote", "rule", "collage", "map"];

export default function BlogBodyEditor({ value, onChange }: Props) {
  const [blocks, setBlocks] = useState<Block[]>(() => parseBody(value));
  const [pickerFor, setPickerFor] = useState<{ blockId: string; slot?: number } | null>(null);
  const [addAfter, setAddAfter] = useState<string | null>(null);

  useEffect(() => {
    onChange(serializeBlocks(blocks));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      setBlocks((prev) => arrayMove(
        prev,
        prev.findIndex((b) => b.id === active.id),
        prev.findIndex((b) => b.id === over.id),
      ));
    }
  }

  function updateBlock(id: string, patch: Partial<Block>) {
    setBlocks((prev) => prev.map((b) => (b.id === id ? ({ ...b, ...patch } as Block) : b)));
  }
  function removeBlock(id: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }
  function insertBlock(type: BlockType, afterId: string | null) {
    const newBlock = makeBlock(type);
    setBlocks((prev) => {
      if (!afterId || afterId === "__start__") {
        return afterId === "__start__" ? [newBlock, ...prev] : [...prev, newBlock];
      }
      const idx = prev.findIndex((b) => b.id === afterId);
      const next = [...prev];
      next.splice(idx + 1, 0, newBlock);
      return next;
    });
    setAddAfter(null);
  }

  function onPickImage(pick: { url: string; alt: string }) {
    if (!pickerFor) return;
    const { blockId, slot } = pickerFor;
    setBlocks((prev) => prev.map((b) => {
      if (b.id !== blockId) return b;
      if (b.type === "image" || b.type === "imageText") {
        return { ...b, src: pick.url, alt: pick.alt || b.alt };
      }
      if (b.type === "collage" && typeof slot === "number") {
        const images = b.images.slice();
        while (images.length <= slot) images.push({ src: "", alt: "" });
        images[slot] = { src: pick.url, alt: pick.alt };
        return { ...b, images };
      }
      return b;
    }));
    setPickerFor(null);
  }

  return (
    <>
      <style>{`
        .bbe {
          background: var(--ka-bg, #f7f4ee);
          border: 1px solid #e7e5e4;
          border-radius: 4px;
          padding: 48px 24px;
          min-height: 600px;
        }
        .bbe-canvas { max-width: 640px; margin: 0 auto; }
        .bbe-blk { position: relative; padding: 6px 0; }
        .bbe-blk-inner { position: relative; }
        .bbe-blk[data-dragging="1"] { opacity: 0.7; }
        .bbe-blk:hover .bbe-handle,
        .bbe-blk:hover .bbe-tools { opacity: 1; }
        .bbe-handle {
          position: absolute; left: -36px; top: 8px;
          width: 24px; height: 24px;
          display: flex; align-items: center; justify-content: center;
          color: #a8a29e; cursor: grab; opacity: 0; transition: opacity 0.12s;
          border-radius: 3px; background: white; border: 1px solid #e7e5e4;
          touch-action: none;
        }
        .bbe-handle:hover { color: #57534e; }
        .bbe-tools {
          position: absolute; right: -8px; top: -8px;
          display: flex; gap: 4px;
          opacity: 0; transition: opacity 0.12s;
          z-index: 5;
        }
        .bbe-tools button {
          border: 1px solid #d6d3d1; background: white;
          padding: 4px 10px; font-size: 10px; letter-spacing: 0.08em;
          text-transform: uppercase; color: #57534e; cursor: pointer; border-radius: 2px;
        }
        .bbe-tools button:hover { border-color: #171717; color: #171717; }
        .bbe-tools button.danger:hover { border-color: #b91c1c; color: #b91c1c; }

        .bbe-add-row {
          position: relative; display: flex; justify-content: center;
          padding: 4px 0; min-height: 18px;
          opacity: 0; transition: opacity 0.12s;
        }
        .bbe-blk:hover + .bbe-add-row,
        .bbe-add-row:hover,
        .bbe-add-row[data-open="1"] { opacity: 1; }
        .bbe-add-btn {
          border: 1px dashed #d6d3d1; background: white; color: #78716c;
          font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
          padding: 4px 12px; border-radius: 2px; cursor: pointer;
        }
        .bbe-add-btn:hover { border-color: #6e4fd1; color: #6e4fd1; }
        .bbe-add-menu {
          position: absolute; top: 28px; left: 50%; transform: translateX(-50%);
          background: white; border: 1px solid #e7e5e4;
          box-shadow: 0 6px 24px rgba(0,0,0,0.10);
          padding: 6px; border-radius: 3px; z-index: 50;
          display: grid; grid-template-columns: 1fr 1fr; gap: 4px;
          min-width: 280px;
        }
        .bbe-add-menu button {
          text-align: left; padding: 8px 12px; border: none; background: none;
          font-size: 12px; cursor: pointer; border-radius: 2px; color: #292524;
        }
        .bbe-add-menu button:hover { background: #f5f5f4; }

        /* Inline editable text styled to match the live /journal render */
        .bbe-edit {
          outline: none; cursor: text;
          border-radius: 2px; padding: 2px 4px; margin: -2px -4px;
          transition: background 0.12s;
        }
        .bbe-edit:hover { background: rgba(110,79,209,0.05); }
        .bbe-edit:focus { background: rgba(110,79,209,0.08); }
        .bbe-edit:empty::before {
          content: attr(data-placeholder); color: #a8a29e; font-style: italic;
        }
        .bbe-para {
          font-size: 17px; line-height: 1.75; color: var(--ka-ink-soft, #525252);
          font-weight: 300; margin: 0;
        }
        .bbe-h2 {
          font-family: var(--ka-display, Georgia, serif);
          font-size: 32px; font-style: italic; margin: 28px 0 0;
          color: var(--ka-ink, #1a1a1a); font-weight: 400; line-height: 1.1;
        }
        .bbe-h3 {
          font-family: var(--ka-display, Georgia, serif);
          font-size: 22px; font-style: italic; margin: 16px 0 0;
          color: var(--ka-ink, #1a1a1a); font-weight: 400;
        }
        .bbe-italic {
          font-family: var(--ka-display, Georgia, serif);
          font-style: italic; font-size: 17px; line-height: 1.6;
          margin: 0;
        }
        .bbe-caption {
          padding: 8px 32px 0; font-size: 11px; color: #78716c;
          letter-spacing: 0.1em; text-transform: uppercase;
          font-family: var(--ka-body, Jost, sans-serif);
        }
        .bbe-eyebrow {
          font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
          color: #6e4fd1; margin-bottom: 8px;
        }

        .bbe-image-frame {
          position: relative; width: 100%; cursor: pointer; overflow: hidden;
          background: #f5f5f4;
        }
        .bbe-image-frame.placeholder {
          border: 1px dashed #d6d3d1;
          display: flex; align-items: center; justify-content: center;
          color: #a8a29e; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;
        }
        .bbe-image-frame:hover .bbe-image-overlay { opacity: 1; }
        .bbe-image-overlay {
          position: absolute; inset: 0; background: rgba(0,0,0,0.45);
          display: flex; align-items: center; justify-content: center;
          color: white; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
          opacity: 0; transition: opacity 0.15s;
        }

        .bbe-rule { height: 1px; background: #d6d3d1; margin: 12px 0; }

        .bbe-highlight {
          background: var(--ka-bg-soft, #f4eefe);
          border-left: 3px solid #6e4fd1;
          padding: 20px 24px;
        }
        .bbe-quote {
          border-top: 1px solid #e7e5e4;
          border-bottom: 1px solid #e7e5e4;
          padding: 24px 0; text-align: center;
        }
        .bbe-quote-text {
          font-family: var(--ka-display, Georgia, serif);
          font-style: italic; font-size: 22px; line-height: 1.4;
          color: var(--ka-ink, #1a1a1a); margin: 0;
        }

        .bbe-grid2 {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 24px; align-items: center;
          margin: 16px -32px; padding: 0 32px;
        }
      `}</style>

      <div className="bbe">
        <div className="bbe-canvas">
          {/* Top "add block" row when empty or to insert at the very start */}
          {blocks.length === 0 ? (
            <div className="bbe-add-row" data-open="1" style={{ opacity: 1 }}>
              <button type="button" className="bbe-add-btn" onClick={() => setAddAfter(addAfter === "__start__" ? null : "__start__")}>
                + Add your first block
              </button>
              {addAfter === "__start__" && (
                <div className="bbe-add-menu">
                  {BLOCK_MENU.map((t) => (
                    <button key={t} type="button" onClick={() => insertBlock(t, "__start__")}>{BLOCK_LABELS[t]}</button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <AddRow open={addAfter === "__start__"} onToggle={() => setAddAfter(addAfter === "__start__" ? null : "__start__")} onInsert={(t) => insertBlock(t, "__start__")} />
          )}

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
              {blocks.map((b) => (
                <div key={b.id}>
                  <SortableBlock
                    block={b}
                    onChange={(patch) => updateBlock(b.id, patch)}
                    onRemove={() => removeBlock(b.id)}
                    onPickImage={(slot) => setPickerFor({ blockId: b.id, slot })}
                  />
                  <AddRow
                    open={addAfter === b.id}
                    onToggle={() => setAddAfter(addAfter === b.id ? null : b.id)}
                    onInsert={(t) => insertBlock(t, b.id)}
                  />
                </div>
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>

      <BlogImagePicker
        open={pickerFor !== null}
        onClose={() => setPickerFor(null)}
        onPick={onPickImage}
      />
    </>
  );
}

// ── Insert "+ Add block" row ──────────────────────────────────────────────

function AddRow({ open, onToggle, onInsert }: {
  open: boolean;
  onToggle: () => void;
  onInsert: (t: BlockType) => void;
}) {
  return (
    <div className="bbe-add-row" data-open={open ? "1" : "0"} style={open ? { opacity: 1 } : undefined}>
      <button type="button" className="bbe-add-btn" onClick={onToggle}>+ Add block</button>
      {open && (
        <div className="bbe-add-menu">
          {BLOCK_MENU.map((t) => (
            <button key={t} type="button" onClick={() => onInsert(t)}>{BLOCK_LABELS[t]}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Sortable wrapper ─────────────────────────────────────────────────────

function SortableBlock({
  block, onChange, onRemove, onPickImage,
}: {
  block: Block;
  onChange: (patch: Partial<Block>) => void;
  onRemove: () => void;
  onPickImage: (slot?: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  return (
    <div
      ref={setNodeRef}
      className="bbe-blk"
      data-dragging={isDragging ? "1" : "0"}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <button type="button" className="bbe-handle" {...listeners} {...attributes} title="Drag to reorder" aria-label="Drag handle">
        <svg width="12" height="12" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
          <circle cx="4" cy="3" r="1.2" /><circle cx="10" cy="3" r="1.2" />
          <circle cx="4" cy="7" r="1.2" /><circle cx="10" cy="7" r="1.2" />
          <circle cx="4" cy="11" r="1.2" /><circle cx="10" cy="11" r="1.2" />
        </svg>
      </button>
      <div className="bbe-tools">
        {block.type === "imageText" && (
          <button type="button" onClick={() => onChange({ align: block.align === "left" ? "right" : "left" } as Partial<Block>)}>
            {block.align === "left" ? "← Image left" : "Image right →"}
          </button>
        )}
        {block.type === "heading" && (
          <button type="button" onClick={() => onChange({ level: block.level === 2 ? 3 : 2 } as Partial<Block>)}>
            H{block.level}
          </button>
        )}
        <button type="button" className="danger" onClick={onRemove}>Remove</button>
      </div>

      <BlockEditor block={block} onChange={onChange} onPickImage={onPickImage} />
    </div>
  );
}

// ── Editable text via contentEditable (no cursor jumps) ──────────────────

function Editable({
  value, onChange, placeholder, className, multiline = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  className?: string;
  multiline?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  // Only set DOM text when the external value differs from current DOM —
  // this keeps the caret in place during normal typing.
  useEffect(() => {
    if (ref.current && ref.current.innerText !== value) {
      ref.current.innerText = value;
    }
  }, [value]);

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      data-placeholder={placeholder}
      className={`bbe-edit ${className ?? ""}`}
      onBlur={(e) => onChange(e.currentTarget.innerText)}
      onKeyDown={(e) => {
        // For single-line fields, prevent newlines.
        if (!multiline && e.key === "Enter") {
          e.preventDefault();
          (e.currentTarget as HTMLDivElement).blur();
        }
      }}
    />
  );
}

// ── The inline editor for each block — renders like the live post ────────

function ImageFrame({ src, alt, aspect, onClick, placeholderLabel }: {
  src: string;
  alt: string;
  aspect: string;
  onClick: () => void;
  placeholderLabel: string;
}) {
  if (!src) {
    return (
      <div className="bbe-image-frame placeholder" style={{ aspectRatio: aspect }} onClick={onClick}>
        + {placeholderLabel}
      </div>
    );
  }
  return (
    <div className="bbe-image-frame" style={{ aspectRatio: aspect }} onClick={onClick}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      <div className="bbe-image-overlay">Click to replace</div>
    </div>
  );
}

function BlockEditor({ block, onChange, onPickImage }: {
  block: Block;
  onChange: (patch: Partial<Block>) => void;
  onPickImage: (slot?: number) => void;
}) {
  switch (block.type) {
    case "paragraph":
      return (
        <Editable
          value={block.text}
          onChange={(v) => onChange({ text: v })}
          placeholder="Write a paragraph…"
          className="bbe-para"
          multiline
        />
      );
    case "heading":
      return (
        <Editable
          value={block.text}
          onChange={(v) => onChange({ text: v })}
          placeholder={`${block.level === 2 ? "Section" : "Subsection"} heading…`}
          className={block.level === 2 ? "bbe-h2" : "bbe-h3"}
        />
      );
    case "image":
      return (
        <figure style={{ margin: "16px -32px" }}>
          <ImageFrame src={block.src} alt={block.alt} aspect="3/2" onClick={() => onPickImage()} placeholderLabel="Choose image" />
          <Editable
            value={block.caption}
            onChange={(v) => onChange({ caption: v })}
            placeholder="Caption (optional)"
            className="bbe-caption"
          />
        </figure>
      );
    case "imageText": {
      const imgEl = (
        <ImageFrame src={block.src} alt={block.alt} aspect="4/5" onClick={() => onPickImage()} placeholderLabel="Choose image" />
      );
      const textEl = (
        <Editable
          value={block.text}
          onChange={(v) => onChange({ text: v })}
          placeholder="Text beside the image…"
          className="bbe-italic"
          multiline
        />
      );
      return (
        <div className="bbe-grid2">
          {block.align === "left" ? <>{imgEl}{textEl}</> : <>{textEl}{imgEl}</>}
        </div>
      );
    }
    case "highlight":
      return (
        <aside className="bbe-highlight">
          <div className="bbe-eyebrow">
            <Editable
              value={block.label}
              onChange={(v) => onChange({ label: v })}
              placeholder="Eyebrow label (optional)"
            />
          </div>
          <Editable
            value={block.text}
            onChange={(v) => onChange({ text: v })}
            placeholder="The highlighted text…"
            className="bbe-italic"
            multiline
          />
        </aside>
      );
    case "quote":
      return (
        <blockquote className="bbe-quote">
          <Editable
            value={block.text}
            onChange={(v) => onChange({ text: v })}
            placeholder="Pull quote…"
            className="bbe-quote-text"
            multiline
          />
        </blockquote>
      );
    case "rule":
      return <div className="bbe-rule" />;
    case "map":
      return (
        <div style={{ background: "#f4eefe", border: "1px solid #e4d8fa", borderRadius: 2, padding: 32, textAlign: "center", color: "#6e4fd1", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
          Illustrated Bogotá map
        </div>
      );
    case "collage": {
      const slots = Math.max(2, Math.min(4, block.images.length));
      const cols = Math.min(slots, 3);
      return (
        <figure style={{ margin: "16px -32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 6 }}>
            {Array.from({ length: slots }).map((_, i) => {
              const img = block.images[i];
              return (
                <ImageFrame
                  key={i}
                  src={img?.src ?? ""}
                  alt={img?.alt ?? ""}
                  aspect="1"
                  onClick={() => onPickImage(i)}
                  placeholderLabel={`Photo ${i + 1}`}
                />
              );
            })}
          </div>
          <div style={{ marginTop: 8, display: "flex", justifyContent: "center", gap: 6 }}>
            {[2, 3, 4].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  const next = block.images.slice(0, n);
                  while (next.length < n) next.push({ src: "", alt: "" });
                  onChange({ images: next });
                }}
                style={{
                  border: "1px solid #e7e5e4",
                  background: slots === n ? "#171717" : "white",
                  color: slots === n ? "white" : "#57534e",
                  padding: "3px 10px", fontSize: 10, letterSpacing: "0.08em",
                  textTransform: "uppercase", borderRadius: 2, cursor: "pointer",
                }}
              >
                {n} photos
              </button>
            ))}
          </div>
          <Editable
            value={block.caption}
            onChange={(v) => onChange({ caption: v })}
            placeholder="Caption (optional)"
            className="bbe-caption"
          />
        </figure>
      );
    }
  }
}
