// Typed block model for the visual blog editor.
// Round-trips with the `body` string format the /journal renderer understands.

export type Block =
  | { id: string; type: "paragraph"; text: string }
  | { id: string; type: "heading"; level: 2 | 3; text: string }
  | { id: string; type: "image"; src: string; alt: string; caption: string }
  | { id: string; type: "imageText"; src: string; alt: string; text: string; align: "left" | "right" }
  | { id: string; type: "highlight"; label: string; text: string }
  | { id: string; type: "quote"; text: string }
  | { id: string; type: "rule" }
  | { id: string; type: "collage"; images: { src: string; alt: string }[]; caption: string }
  | { id: string; type: "map" };

export type BlockType = Block["type"];

let nextId = 0;
export function genId(): string {
  nextId += 1;
  return `b${Date.now().toString(36)}-${nextId}`;
}

function attr(s: string, k: string): string {
  return s.match(new RegExp(`${k}="([^"]*)"`))?.[1] ?? "";
}

export function parseBody(body: string): Block[] {
  if (!body || !body.trim()) return [];
  const paragraphs = body.split(/\n\n+/).filter((p) => p.trim().length > 0);

  return paragraphs.map((p): Block => {
    if (p.startsWith("### ")) return { id: genId(), type: "heading", level: 3, text: p.slice(4) };
    if (p.startsWith("## "))  return { id: genId(), type: "heading", level: 2, text: p.slice(3) };

    if (p.startsWith("[!IMG"))       return { id: genId(), type: "image",     src: attr(p, "src"), alt: attr(p, "alt"), caption: attr(p, "caption") };
    if (p.startsWith("[!GRID-LEFT")) return { id: genId(), type: "imageText", src: attr(p, "src"), alt: attr(p, "alt"), text: attr(p, "text"), align: "left" };
    if (p.startsWith("[!GRID"))      return { id: genId(), type: "imageText", src: attr(p, "src"), alt: attr(p, "alt"), text: attr(p, "text"), align: "right" };
    if (p.startsWith("[!HIGHLIGHT")) return { id: genId(), type: "highlight", label: attr(p, "label"), text: attr(p, "text") };
    if (p.startsWith("[!QUOTE"))     return { id: genId(), type: "quote",     text: attr(p, "text") };
    if (p.trim() === "[!RULE]")      return { id: genId(), type: "rule" };
    if (p.trim() === "[!MAP-BOGOTA]") return { id: genId(), type: "map" };
    if (p.startsWith("[!COLLAGE")) {
      const images = [1, 2, 3, 4].map((i) => ({
        src: attr(p, `src${i}`),
        alt: attr(p, `alt${i}`),
      })).filter((img) => img.src);
      return { id: genId(), type: "collage", images, caption: attr(p, "caption") };
    }

    return { id: genId(), type: "paragraph", text: p };
  });
}

function esc(s: string): string {
  // Block syntax uses double quotes as attribute delimiters — strip them from values.
  return (s ?? "").replace(/"/g, "”");
}

export function serializeBlocks(blocks: Block[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "paragraph": return b.text;
        case "heading":   return `${"#".repeat(b.level)} ${b.text}`;
        case "image":     return `[!IMG src="${esc(b.src)}" alt="${esc(b.alt)}" caption="${esc(b.caption)}"]`;
        case "imageText": {
          const tag = b.align === "left" ? "GRID-LEFT" : "GRID";
          return `[!${tag} src="${esc(b.src)}" alt="${esc(b.alt)}" text="${esc(b.text)}"]`;
        }
        case "highlight": return `[!HIGHLIGHT label="${esc(b.label)}" text="${esc(b.text)}"]`;
        case "quote":     return `[!QUOTE text="${esc(b.text)}"]`;
        case "rule":      return `[!RULE]`;
        case "map":       return `[!MAP-BOGOTA]`;
        case "collage": {
          const parts = b.images.map((img, i) => `src${i + 1}="${esc(img.src)}" alt${i + 1}="${esc(img.alt)}"`);
          return `[!COLLAGE ${parts.join(" ")} caption="${esc(b.caption)}"]`;
        }
      }
    })
    .join("\n\n");
}

export const BLOCK_LABELS: Record<BlockType, string> = {
  paragraph: "Paragraph",
  heading:   "Heading",
  image:     "Image",
  imageText: "Image + Text",
  highlight: "Lilac highlight",
  quote:     "Pull quote",
  rule:      "Hairline divider",
  collage:   "Photo collage",
  map:       "Bogotá map",
};

export function makeBlock(type: BlockType): Block {
  switch (type) {
    case "paragraph": return { id: genId(), type, text: "" };
    case "heading":   return { id: genId(), type, level: 2, text: "" };
    case "image":     return { id: genId(), type, src: "", alt: "", caption: "" };
    case "imageText": return { id: genId(), type, src: "", alt: "", text: "", align: "right" };
    case "highlight": return { id: genId(), type, label: "", text: "" };
    case "quote":     return { id: genId(), type, text: "" };
    case "rule":      return { id: genId(), type };
    case "collage":   return { id: genId(), type, images: [{ src: "", alt: "" }, { src: "", alt: "" }], caption: "" };
    case "map":       return { id: genId(), type };
  }
}
