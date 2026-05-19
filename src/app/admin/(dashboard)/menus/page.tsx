"use client";

import { useEffect, useState } from "react";

interface NavLink {
  label: string;
  href: string;
}

interface MenuContent {
  leftLinks: NavLink[];
  rightLinks: NavLink[];
}

function NavLinkEditor({
  links,
  onChange,
}: {
  links: NavLink[];
  onChange: (links: NavLink[]) => void;
}) {
  function update(index: number, field: keyof NavLink, value: string) {
    const next = links.map((l, i) => (i === index ? { ...l, [field]: value } : l));
    onChange(next);
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
            placeholder="/path"
            className="w-48 text-sm border-b border-stone-200 focus:border-stone-500 outline-none py-1 bg-transparent font-mono text-stone-500"
          />
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

export default function MenusPage() {
  const [menu, setMenu] = useState<MenuContent | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "saved" | "error">("loading");

  useEffect(() => {
    fetch("/api/admin/menus")
      .then((r) => r.json())
      .then((data) => {
        setMenu(data);
        setStatus("idle");
      })
      .catch(() => setStatus("error"));
  }, []);

  async function save() {
    if (!menu) return;
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/menus", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menu),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  if (status === "loading") {
    return <div className="text-sm text-stone-400 py-8">Loading…</div>;
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Navigation Menus</h1>
          <p className="text-sm text-stone-500 mt-1">
            Edit the header navigation links. Changes go live within 60 seconds.
          </p>
        </div>
        <button
          onClick={save}
          disabled={status === "saving" || !menu}
          className="px-5 py-2.5 bg-stone-900 text-white text-sm font-medium rounded hover:bg-stone-700 disabled:opacity-40 transition-colors"
        >
          {status === "saving" ? "Saving…" : status === "saved" ? "✓ Saved" : status === "error" ? "Error — retry" : "Save Changes"}
        </button>
      </div>

      {menu && (
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">Left nav</h2>
            <NavLinkEditor
              links={menu.leftLinks}
              onChange={(links) => setMenu({ ...menu, leftLinks: links })}
            />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">Right nav</h2>
            <NavLinkEditor
              links={menu.rightLinks}
              onChange={(links) => setMenu({ ...menu, rightLinks: links })}
            />
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-stone-50 border border-stone-200 rounded text-sm text-stone-500">
        <strong className="text-stone-700">Tip:</strong> Use up/down arrows to reorder links. The left nav appears on the left side of the header; the right nav on the right.
      </div>
    </div>
  );
}
