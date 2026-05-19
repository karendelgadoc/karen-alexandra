/**
 * Tiny allowlist HTML sanitizer for blog/case-study body paragraphs.
 *
 * Posts are written by admins, so this is defense-in-depth, not a primary
 * defense. If an admin account is ever compromised, this prevents the attacker
 * from injecting <script>, <iframe>, event handlers, or javascript: links.
 */

// Only these tags survive. Everything else gets HTML-encoded.
const ALLOWED_TAGS = new Set(["b", "i", "em", "strong", "u", "br", "a", "p", "span"]);
// Only these attributes survive on the tags above.
const ALLOWED_ATTRS = new Set(["href", "title", "target", "rel"]);

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeHref(href: string): string | null {
  const trimmed = href.trim();
  // Block javascript:, data:, vbscript:, etc.
  if (/^(javascript|data|vbscript|file):/i.test(trimmed)) return null;
  return trimmed;
}

export function sanitizeHtml(input: string): string {
  // Strip dangerous patterns wholesale, then re-emit only allowlisted tags.
  // This is deliberately simple — strict allowlist, no parser dependency.
  return input.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g, (match, tagName: string, rest: string) => {
    const tag = tagName.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) return escapeHtml(match);

    const isClosing = match.startsWith("</");
    if (isClosing) return `</${tag}>`;

    // Self-closing tags
    if (tag === "br") return "<br />";

    // Strip / rebuild attributes
    const attrs: string[] = [];
    const attrRe = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*"([^"]*)"|([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*'([^']*)'/g;
    let m: RegExpExecArray | null;
    while ((m = attrRe.exec(rest))) {
      const name = (m[1] ?? m[3] ?? "").toLowerCase();
      const value = m[2] ?? m[4] ?? "";
      if (!ALLOWED_ATTRS.has(name)) continue;
      if (name === "href") {
        const safe = safeHref(value);
        if (!safe) continue;
        attrs.push(`href="${escapeHtml(safe)}"`);
      } else if (name === "target") {
        // Force noopener/noreferrer when target=_blank
        attrs.push(`target="${escapeHtml(value)}"`);
        if (value === "_blank" && !rest.includes("rel=")) attrs.push(`rel="noopener noreferrer"`);
      } else {
        attrs.push(`${name}="${escapeHtml(value)}"`);
      }
    }
    return attrs.length ? `<${tag} ${attrs.join(" ")}>` : `<${tag}>`;
  });
}
