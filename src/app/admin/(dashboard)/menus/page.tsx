"use client";

import { useEffect, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

interface MenuContent {
  leftLinks: NavLink[];
  rightLinks: NavLink[];
}

interface FooterColumn {
  title: string;
  links: NavLink[];
}

interface FooterContent {
  tagline: string;
  columns: FooterColumn[];
  bottomLinks: NavLink[];
}

type SaveStatus = "idle" | "loading" | "saving" | "saved" | "error";

function statusLabel(s: SaveStatus) {
  if (s === "saving") return "Saving…";
  if (s === "saved") return "✓ Saved";
  if (s === "error") return "Error — retry";
  return "Save Changes";
}

// ── NavLinkEditor ─────────────────────────────────────────────────────────────

function NavLinkEditor({
  links,
  onChange,
  showExternal = false,
}: {
  links: NavLink[];
  onChange: (links: NavLink[]) => void;
  showExternal?: boolean;
}) {
  function update(index: number, field: keyof NavLink, value: string | boolean) {
    onChange(links.map((l, i) => (i === index ? { ...l, [field]: value } : l)));
  }
  function addLink() {
    onChange([...links, { label: "", href: "/" }]);
  }
  function removeLink(index: number) {
    onChange(links.filter((_, i) => i !== index));
  }
  function moveUp(index: number) {
    if (index === 0) return;
    const next = [...links];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  }
  function moveDown(index: number) {
    if (index === links.length - 1) return;
    const next = [...links];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  }

  return (
    <div className="space-y-2">
      {links.map((link, i) => (
        <div key={i} className="flex items-center gap-2 p-3 bg-white border border-stone-200 rounded">
          <div className="flex flex-col gap-0.5 mr-1">
            <button onClick={() => moveUp(i)} disabled={i === 0} className="text-stone-300 hover:text-stone-600 disabled:opacity-30 text-xs leading-none">▲</button>
            <button onClick={() => moveDown(i)} disabled={i === links.length - 1} className="text-stone-300 hover:text-stone-600 disabled:opacity-30 text-xs leading-none">▼</button>
          </div>
          <input
            value={link.label}
            onChange={(e) => update(i, "label", e.target.value)}
            placeholder="Label"
            className="flex-1 text-sm border-b border-stone-200 focus:border-stone-500 outline-none py-1 bg-transparent"
          />
          <input
            value={link.href}
            onChange={(e) => update(i, "href", e.target.value)}
            placeholder="/path or https://…"
            className="w-48 text-sm border-b border-stone-200 focus:border-stone-500 outline-none py-1 bg-transparent font-mono text-stone-500"
          />
          {showExternal && (
            <label className="flex items-center gap-1 text-xs text-stone-400 whitespace-nowrap cursor-pointer select-none">
              <input
                type="checkbox"
                checked={!!link.external}
                onChange={(e) => update(i, "external", e.target.checked)}
                className="rounded"
              />
              ext
            </label>
          )}
          <button
            onClick={() => removeLink(i)}
            className="text-stone-300 hover:text-red-400 transition-colors text-lg leading-none ml-1"
            title="Remove"
          >
            ×
          </button>
        </div>
      ))}
      <button
        onClick={addLink}
        className="text-sm text-stone-400 hover:text-stone-700 transition-colors py-2 px-3 border border-dashed border-stone-300 rounded w-full"
      >
        + Add link
      </button>
    </div>
  );
}

// ── FooterColumnsEditor ────────────────────────────────────────────────────────

function FooterColumnsEditor({
  columns,
  onChange,
}: {
  columns: FooterColumn[];
  onChange: (cols: FooterColumn[]) => void;
}) {
  function updateTitle(index: number, title: string) {
    onChange(columns.map((c, i) => (i === index ? { ...c, title } : c)));
  }
  function updateLinks(index: number, links: NavLink[]) {
    onChange(columns.map((c, i) => (i === index ? { ...c, links } : c)));
  }
  function moveUp(index: number) {
    if (index === 0) return;
    const next = [...columns];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  }
  function moveDown(index: number) {
    if (index === columns.length - 1) return;
    const next = [...columns];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  }
  function addColumn() {
    onChange([...columns, { title: "New column", links: [] }]);
  }
  function removeColumn(index: number) {
    onChange(columns.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      {columns.map((col, i) => (
        <div key={i} className="border border-stone-200 rounded-lg p-4 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex flex-col gap-0.5 flex-shrink-0">
              <button onClick={() => moveUp(i)} disabled={i === 0} className="text-stone-300 hover:text-stone-600 disabled:opacity-30 text-xs leading-none">▲</button>
              <button onClick={() => moveDown(i)} disabled={i === columns.length - 1} className="text-stone-300 hover:text-stone-600 disabled:opacity-30 text-xs leading-none">▼</button>
            </div>
            <input
              value={col.title}
              onChange={(e) => updateTitle(i, e.target.value)}
              placeholder="Column heading"
              className="font-semibold text-sm border-b border-stone-300 focus:border-stone-600 outline-none py-1 bg-transparent flex-1"
            />
            <button
              onClick={() => removeColumn(i)}
              className="text-stone-300 hover:text-red-400 transition-colors text-lg leading-none ml-auto flex-shrink-0"
              title="Remove column"
            >
              ×
            </button>
          </div>
          <NavLinkEditor
            links={col.links}
            onChange={(links) => updateLinks(i, links)}
            showExternal
          />
        </div>
      ))}
      <button
        onClick={addColumn}
        className="text-sm text-stone-400 hover:text-stone-700 transition-colors py-2 px-3 border border-dashed border-stone-300 rounded w-full"
      >
        + Add column
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function MenusPage() {
  const [menu, setMenu] = useState<MenuContent | null>(null);
  const [footer, setFooter] = useState<FooterContent | null>(null);
  const [menuStatus, setMenuStatus] = useState<SaveStatus>("loading");
  const [footerStatus, setFooterStatus] = useState<SaveStatus>("loading");

  useEffect(() => {
    fetch("/api/admin/menus")
      .then((r) => r.json())
      .then((data) => { setMenu(data); setMenuStatus("idle"); })
      .catch(() => setMenuStatus("error"));

    fetch("/api/admin/footer")
      .then((r) => r.json())
      .then((data) => { setFooter(data); setFooterStatus("idle"); })
      .catch(() => setFooterStatus("error"));
  }, []);

  async function saveMenu() {
    if (!menu) return;
    setMenuStatus("saving");
    try {
      const res = await fetch("/api/admin/menus", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menu),
      });
      if (!res.ok) throw new Error();
      setMenuStatus("saved");
      setTimeout(() => setMenuStatus("idle"), 2500);
    } catch {
      setMenuStatus("error");
      setTimeout(() => setMenuStatus("idle"), 3000);
    }
  }

  async function saveFooter() {
    if (!footer) return;
    setFooterStatus("saving");
    try {
      const res = await fetch("/api/admin/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(footer),
      });
      if (!res.ok) throw new Error();
      setFooterStatus("saved");
      setTimeout(() => setFooterStatus("idle"), 2500);
    } catch {
      setFooterStatus("error");
      setTimeout(() => setFooterStatus("idle"), 3000);
    }
  }

  if (menuStatus === "loading" || footerStatus === "loading") {
    return <div className="text-sm text-stone-400 py-8">Loading…</div>;
  }

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-stone-900">Navigation & Footer</h1>
        <p className="text-sm text-stone-500 mt-1">
          Edit header navigation and footer content. Changes go live within 60 seconds.
        </p>
      </div>

      {/* ── Header Navigation ─────────────────────────────────────────────── */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-stone-800">Header Navigation</h2>
            <p className="text-xs text-stone-400 mt-0.5">Left and right sides of the top nav bar.</p>
          </div>
          <button
            onClick={saveMenu}
            disabled={menuStatus === "saving" || !menu}
            className="px-5 py-2.5 bg-stone-900 text-white text-sm font-medium rounded hover:bg-stone-700 disabled:opacity-40 transition-colors"
          >
            {statusLabel(menuStatus)}
          </button>
        </div>

        {menu && (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">Left nav</h3>
              <NavLinkEditor
                links={menu.leftLinks}
                onChange={(links) => setMenu({ ...menu, leftLinks: links })}
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">Right nav</h3>
              <NavLinkEditor
                links={menu.rightLinks}
                onChange={(links) => setMenu({ ...menu, rightLinks: links })}
              />
            </div>
          </div>
        )}
      </section>

      <hr className="border-stone-200 mb-12" />

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-stone-800">Footer</h2>
            <p className="text-xs text-stone-400 mt-0.5">Tagline, link columns, and bottom bar.</p>
          </div>
          <button
            onClick={saveFooter}
            disabled={footerStatus === "saving" || !footer}
            className="px-5 py-2.5 bg-stone-900 text-white text-sm font-medium rounded hover:bg-stone-700 disabled:opacity-40 transition-colors"
          >
            {statusLabel(footerStatus)}
          </button>
        </div>

        {footer && (
          <div className="space-y-10">
            {/* Brand tagline */}
            <div>
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">Brand tagline</h3>
              <textarea
                value={footer.tagline}
                onChange={(e) => setFooter({ ...footer, tagline: e.target.value })}
                rows={2}
                className="w-full text-sm border border-stone-200 rounded p-3 focus:border-stone-500 outline-none resize-none bg-white"
                placeholder="The art of well — …"
              />
            </div>

            {/* Link columns */}
            <div>
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">
                Link columns
              </h3>
              <p className="text-xs text-stone-400 mb-4">
                Use ▲ ▼ to reorder columns or links within a column. Check &ldquo;ext&rdquo; for external links that open in a new tab.
              </p>
              <FooterColumnsEditor
                columns={footer.columns}
                onChange={(columns) => setFooter({ ...footer, columns })}
              />
            </div>

            {/* Bottom bar links */}
            <div>
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">Bottom bar links</h3>
              <NavLinkEditor
                links={footer.bottomLinks}
                onChange={(links) => setFooter({ ...footer, bottomLinks: links })}
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
