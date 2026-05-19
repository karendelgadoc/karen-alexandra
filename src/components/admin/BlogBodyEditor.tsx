"use client";

import { useEffect, useMemo, useState } from "react";
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
  value: string;          // current body string
  onChange: (body: string) => void;
}

const BLOCK_MENU: BlockType[] = ["paragraph", "heading", "image", "imageText", "highlight", "quote", "rule", "collage", "map"];

export default function BlogBodyEditor({ value, onChange }: Props) {
  // Initialize blocks from the body string once. Subsequent edits flow through serializeBlocks → onChange.
  const [blocks, setBlocks] = useState<Block[]>(() => parseBody(value));
  const [pickerFor, setPickerFor] = useState<{ blockId: string; slot?: number } | null>(null);
  const [addAfter, setAddAfter] = useState<string | null>(null); // block id after which to insert

  // Keep parent in sync whenever blocks change.
  useEffect(() => {
    onChange(serializeBlocks(blocks));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
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
      if (!afterId) return [...prev, newBlock];
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
        .blk { position: relative; padding: 14px 16px 14px 44px; border: 1px solid transparent; border-radius: 3px; background: white; transition: border-color 0.12s; }
        .blk:hover { border-color: #e7e5e4; }
        .blk.dragging { z-index: 30; opacity: 0.85; border-color: #7c3aed; }
        .blk-handle { position: absolute; left: 8px; top: 16px; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; color: #a8a29e; cursor: grab; touch-action: none; border-radius: 3px; }
        .blk-handle:hover { color: #57534e; background: #f5f5f4; }
        .blk-toolbar { position: absolute; right: 8px; top: 8px; display: flex; gap: 4px; opacity: 0; transition: opacity 0.12s; }
        .blk:hover .blk-toolbar { opacity: 1; }
        .blk-toolbar button { border: 1px solid #e7e5e4; background: white; padding: 4px 8px; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: #57534e; cursor: pointer; border-radius: 2px; }
        .blk-toolbar button:hover { border-color: #171717; color: #171717; }
        .blk-toolbar button.danger:hover { border-color: #b91c1c; color: #b91c1c; }
        .blk-type { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #a8a29e; margin-bottom: 6px; }
        .blk input, .blk textarea { width: 100%; border: 1px solid #e7e5e4; background: white; padding: 8px 10px; font-size: 14px; font-family: inherit; border-radius: 3px; }
        .blk input:focus, .blk textarea:focus { outline: none; border-color: #171717; }
        .blk textarea { resize: vertical; min-height: 60px; }
        .add-row { display: flex; justify-content: center; padding: 4px 0; }
        .add-btn { border: 1px dashed #d6d3d1; background: white; color: #a8a29e; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; padding: 6px 14px; border-radius: 2px; cursor: pointer; }
        .add-btn:hover { border-color: #7c3aed; color: #7c3aed; }
        .add-menu { position: absolute; background: white; border: 1px solid #e7e5e4; box-shadow: 0 6px 20px rgba(0,0,0,0.08); padding: 6px; border-radius: 3px; z-index: 50; display: grid; grid-template-columns: 1fr 1fr; gap: 4px; min-width: 280px; }
        .add-menu button { text-align: left; padding: 8px 12px; border: none; background: none; font-size: 12px; cursor: pointer; border-radius: 2px; color: #292524; }
        .add-menu button:hover { background: #f5f5f4; }
        .preview { background: var(--ka-bg, #f7f4ee); padding: 60px 32px; min-height: 100%; }
        .preview-inner { max-width: 640px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; font-size: 17px; line-height: 1.75; color: var(--ka-ink-soft, #525252); font-weight: 300; }
        .preview h2 { font-family: var(--ka-display, Georgia); font-size: 32px; font-style: italic; margin: 24px 0 0; color: var(--ka-ink); font-weight: 400; line-height: 1.1; }
        .preview h3 { font-family: var(--ka-display, Georgia); font-size: 22px; font-style: italic; margin: 12px 0 0; color: var(--ka-ink); font-weight: 400; }
      `}</style>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, minHeight: 600 }}>
        {/* ── Left: block editor ──────────────────────────────────── */}
        <div style={{ background: "#fafaf9", border: "1px solid #e7e5e4", borderRadius: 4, padding: 12, position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, padding: "0 4px" }}>
            <span style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#a8a29e" }}>Content blocks</span>
            <span style={{ fontSize: 10, color: "#a8a29e" }}>{blocks.length} block{blocks.length === 1 ? "" : "s"}</span>
          </div>

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
                  <div className="add-row" style={{ position: "relative" }}>
                    <button type="button" className="add-btn" onClick={() => setAddAfter(addAfter === b.id ? null : b.id)}>
                      + Add block
                    </button>
                    {addAfter === b.id && (
                      <div className="add-menu" style={{ top: 32 }}>
                        {BLOCK_MENU.map((t) => (
                          <button key={t} type="button" onClick={() => insertBlock(t, b.id)}>{BLOCK_LABELS[t]}</button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </SortableContext>
          </DndContext>

          {blocks.length === 0 && (
            <div style={{ position: "relative", padding: 32, textAlign: "center", color: "#a8a29e", fontSize: 13 }}>
              <p style={{ marginBottom: 12 }}>This post has no content yet.</p>
              <button type="button" className="add-btn" onClick={() => setAddAfter("__start__")}>+ Add first block</button>
              {addAfter === "__start__" && (
                <div className="add-menu" style={{ top: 80, left: "50%", transform: "translateX(-50%)" }}>
                  {BLOCK_MENU.map((t) => (
                    <button key={t} type="button" onClick={() => insertBlock(t, null)}>{BLOCK_LABELS[t]}</button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Right: live preview ──────────────────────────────────── */}
        <div style={{ background: "white", border: "1px solid #e7e5e4", borderRadius: 4, overflow: "auto", maxHeight: "calc(100vh - 200px)" }}>
          <div style={{ padding: "10px 16px", borderBottom: "1px solid #e7e5e4", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#a8a29e", position: "sticky", top: 0, background: "white", zIndex: 1 }}>
            Live preview
          </div>
          <div className="preview">
            <div className="preview-inner">
              {blocks.length === 0 && <p style={{ color: "#a8a29e", fontStyle: "italic" }}>Start adding blocks to see the post take shape.</p>}
              {blocks.map((b) => <BlockPreview key={b.id} block={b} />)}
            </div>
          </div>
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
      className={`blk${isDragging ? " dragging" : ""}`}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <button type="button" className="blk-handle" {...listeners} {...attributes} title="Drag to reorder" aria-label="Drag handle">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
          <circle cx="4" cy="3" r="1.2" /><circle cx="10" cy="3" r="1.2" />
          <circle cx="4" cy="7" r="1.2" /><circle cx="10" cy="7" r="1.2" />
          <circle cx="4" cy="11" r="1.2" /><circle cx="10" cy="11" r="1.2" />
        </svg>
      </button>
      <div className="blk-toolbar">
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
      <div className="blk-type">{BLOCK_LABELS[block.type]}</div>
      <BlockFields block={block} onChange={onChange} onPickImage={onPickImage} />
    </div>
  );
}

// ── Per-block edit fields ────────────────────────────────────────────────

function ImageField({ src, onPick, label }: { src: string; onPick: () => void; label: string }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 3, border: "1px solid #e7e5e4" }} />
      ) : (
        <div style={{ width: 60, height: 60, border: "1px dashed #d6d3d1", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", color: "#a8a29e", fontSize: 10 }}>No image</div>
      )}
      <button type="button" onClick={onPick} style={{ border: "1px solid #d6d3d1", background: "white", padding: "6px 12px", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#57534e", cursor: "pointer", borderRadius: 2 }}>
        {src ? "Replace" : label}
      </button>
    </div>
  );
}

function BlockFields({ block, onChange, onPickImage }: {
  block: Block;
  onChange: (patch: Partial<Block>) => void;
  onPickImage: (slot?: number) => void;
}) {
  switch (block.type) {
    case "paragraph":
      return <textarea value={block.text} onChange={(e) => onChange({ text: e.target.value })} rows={3} placeholder="Write a paragraph…" />;
    case "heading":
      return <input value={block.text} onChange={(e) => onChange({ text: e.target.value })} placeholder={`H${block.level} heading…`} />;
    case "image":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <ImageField src={block.src} onPick={() => onPickImage()} label="Choose image" />
          <input value={block.alt} onChange={(e) => onChange({ alt: e.target.value })} placeholder="Alt text (for SEO & accessibility)" />
          <input value={block.caption} onChange={(e) => onChange({ caption: e.target.value })} placeholder="Caption (optional)" />
        </div>
      );
    case "imageText":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <ImageField src={block.src} onPick={() => onPickImage()} label="Choose image" />
          <input value={block.alt} onChange={(e) => onChange({ alt: e.target.value })} placeholder="Alt text" />
          <textarea value={block.text} onChange={(e) => onChange({ text: e.target.value })} rows={4} placeholder="Text that sits beside the image…" />
        </div>
      );
    case "highlight":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input value={block.label} onChange={(e) => onChange({ label: e.target.value })} placeholder="Eyebrow label (optional)" />
          <textarea value={block.text} onChange={(e) => onChange({ text: e.target.value })} rows={3} placeholder="The highlighted text…" />
        </div>
      );
    case "quote":
      return <textarea value={block.text} onChange={(e) => onChange({ text: e.target.value })} rows={2} placeholder="Pull quote…" />;
    case "rule":
      return <p style={{ color: "#a8a29e", fontSize: 12, margin: 0 }}>A hairline divider (no fields).</p>;
    case "map":
      return <p style={{ color: "#a8a29e", fontSize: 12, margin: 0 }}>Renders the illustrated Bogotá map (no fields).</p>;
    case "collage":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
            {Array.from({ length: 4 }).map((_, i) => {
              const img = block.images[i];
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onPickImage(i)}
                  style={{
                    aspectRatio: "1", border: img?.src ? "1px solid #e7e5e4" : "1px dashed #d6d3d1",
                    background: img?.src ? "white" : "#fafaf9", padding: 0, cursor: "pointer", borderRadius: 2,
                    display: "flex", alignItems: "center", justifyContent: "center", color: "#a8a29e", fontSize: 10,
                  }}
                  title={`Photo ${i + 1}`}
                >
                  {img?.src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 2 }} />
                  ) : (
                    <span>+ {i + 1}</span>
                  )}
                </button>
              );
            })}
          </div>
          <input value={block.caption} onChange={(e) => onChange({ caption: e.target.value })} placeholder="Caption (optional)" />
        </div>
      );
  }
}

// ── Live preview ────────────────────────────────────────────────────────

function BlockPreview({ block }: { block: Block }) {
  switch (block.type) {
    case "paragraph":
      return <p style={{ margin: 0 }}>{block.text || <span style={{ color: "#a8a29e", fontStyle: "italic" }}>(empty paragraph)</span>}</p>;
    case "heading":
      return block.level === 2
        ? <h2>{block.text || "(heading)"}</h2>
        : <h3>{block.text || "(subheading)"}</h3>;
    case "image":
      return (
        <figure style={{ margin: "16px -32px" }}>
          {block.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={block.src} alt={block.alt} style={{ width: "100%", aspectRatio: "3/2", objectFit: "cover", display: "block" }} />
          ) : (
            <div style={{ width: "100%", aspectRatio: "3/2", background: "#f5f5f4", display: "flex", alignItems: "center", justifyContent: "center", color: "#a8a29e", fontSize: 12 }}>No image selected</div>
          )}
          {block.caption && (
            <figcaption style={{ padding: "8px 32px 0", fontSize: 11, color: "#78716c", letterSpacing: "0.1em", textTransform: "uppercase" }}>{block.caption}</figcaption>
          )}
        </figure>
      );
    case "imageText": {
      const imgEl = block.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={block.src} alt={block.alt} style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block" }} />
      ) : (
        <div style={{ width: "100%", aspectRatio: "4/5", background: "#f5f5f4", display: "flex", alignItems: "center", justifyContent: "center", color: "#a8a29e", fontSize: 12 }}>No image</div>
      );
      const textEl = (
        <p style={{ fontFamily: "var(--ka-display, Georgia)", fontStyle: "italic", fontSize: 17, lineHeight: 1.6, margin: 0 }}>
          {block.text || <span style={{ color: "#a8a29e" }}>(text)</span>}
        </p>
      );
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "center", margin: "16px -32px", padding: "0 32px" }}>
          {block.align === "left" ? <>{imgEl}{textEl}</> : <>{textEl}{imgEl}</>}
        </div>
      );
    }
    case "highlight":
      return (
        <aside style={{ background: "#f4eefe", borderLeft: "3px solid #6e4fd1", padding: "16px 20px", margin: "8px 0" }}>
          {block.label && <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6e4fd1", marginBottom: 6 }}>{block.label}</div>}
          <p style={{ fontFamily: "var(--ka-display, Georgia)", fontStyle: "italic", fontSize: 17, lineHeight: 1.5, margin: 0 }}>{block.text || "(highlight)"}</p>
        </aside>
      );
    case "quote":
      return (
        <blockquote style={{ borderTop: "1px solid #e7e5e4", borderBottom: "1px solid #e7e5e4", padding: "20px 0", margin: "8px 0", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--ka-display, Georgia)", fontStyle: "italic", fontSize: 21, lineHeight: 1.4, margin: 0 }}>&ldquo;{block.text || "pull quote"}&rdquo;</p>
        </blockquote>
      );
    case "rule":
      return <div style={{ height: 1, background: "#e7e5e4", margin: "16px 0" }} />;
    case "map":
      return <div style={{ background: "#f4eefe", border: "1px solid #e4d8fa", borderRadius: 2, padding: 40, textAlign: "center", color: "#6e4fd1", fontFamily: "Georgia, serif", fontStyle: "italic" }}>Illustrated Bogotá map</div>;
    case "collage": {
      const imgs = block.images.filter((i) => i.src);
      if (imgs.length === 0) {
        return <div style={{ background: "#f5f5f4", padding: 24, textAlign: "center", color: "#a8a29e", fontSize: 12, margin: "16px -32px" }}>Collage (no images selected)</div>;
      }
      return (
        <figure style={{ margin: "16px -32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(imgs.length, 3)}, 1fr)`, gap: 6 }}>
            {imgs.map((img, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={img.src} alt={img.alt} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
            ))}
          </div>
          {block.caption && (
            <figcaption style={{ padding: "8px 32px 0", fontSize: 11, color: "#78716c", letterSpacing: "0.1em", textTransform: "uppercase" }}>{block.caption}</figcaption>
          )}
        </figure>
      );
    }
  }
}
