"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog-db";
import type { MadridEvent } from "@/lib/madrid-events-db";

// ── Articles section ───────────────────────────────────────────────────────────

function ArticlesSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/fashion-news")
      .then((r) => r.json())
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    await fetch(`/api/admin/fashion-news/${id}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-light">Articles</h2>
          <p className="text-xs text-stone-400 mt-0.5">Editorial articles for /fashion-news</p>
        </div>
        <Link
          href="/admin/fashion-news/new"
          className="text-xs tracking-[0.15em] uppercase bg-[var(--charcoal)] text-[var(--cream)] px-5 py-2.5 hover:opacity-80 transition-opacity"
        >
          + New Article
        </Link>
      </div>

      {loading ? (
        <p className="text-[var(--muted)] text-sm">Loading…</p>
      ) : posts.length === 0 ? (
        <div className="text-sm text-[var(--muted)] py-8 text-center border border-dashed border-stone-200">
          <p>No fashion news articles yet.</p>
          <p className="mt-1 text-xs">Move a blog post here using the "→ Fashion News" button in Blog Posts, or create a new article above.</p>
        </div>
      ) : (
        <div className="divide-y divide-[var(--beige)]">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center justify-between py-4 gap-4">
              <div className="min-w-0">
                <p className="text-sm font-light truncate">{post.title}</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  {post.date}
                  {!post.published && <span className="ml-2 text-amber-600">Draft</span>}
                  {post.featured && <span className="ml-2 text-emerald-600">Featured</span>}
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <Link href={`/fashion-news/${post.slug}`} className="text-xs tracking-[0.1em] uppercase text-stone-400 hover:text-stone-600 transition-colors" target="_blank">View</Link>
                <Link href={`/admin/fashion-news/${post.id}/edit`} className="text-xs tracking-[0.1em] uppercase text-[var(--taupe)] hover:text-[var(--charcoal)] transition-colors">Edit</Link>
                <button onClick={() => handleDelete(post.id, post.title)} className="text-xs tracking-[0.1em] uppercase text-red-400 hover:text-red-600 transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ── Calendar section ───────────────────────────────────────────────────────────

const MONTH_ABBR = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

function toDisplayDate(iso: string): string {
  try {
    const d = new Date(iso + "T00:00:00");
    return `${MONTH_ABBR[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")}`;
  } catch { return iso; }
}

const BLANK_EVENT: Partial<MadridEvent> = { name: "", rawDate: "", date: "", venue: "", type: "Event", url: "" };

function CalendarSection() {
  const [auto, setAuto] = useState<MadridEvent[]>([]);
  const [manual, setManual] = useState<MadridEvent[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // Import form state
  const [importUrl, setImportUrl] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState<MadridEvent[]>([]);
  const [importError, setImportError] = useState("");

  // Manual-edit overlay for a single event (used after extraction or for custom add)
  const [editing, setEditing] = useState<Partial<MadridEvent> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/calendar")
      .then((r) => r.json())
      .then((d: { auto: MadridEvent[]; manual: MadridEvent[] }) => {
        setAuto(d.auto ?? []);
        setManual(d.manual ?? []);
      })
      .finally(() => setLoadingList(false));
  }, []);

  async function handleExtract() {
    if (!importUrl) return;
    setExtracting(true);
    setImportError("");
    setExtracted([]);
    try {
      const res = await fetch("/api/admin/calendar/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: importUrl }),
      });
      const data = await res.json() as { events?: MadridEvent[]; error?: string };
      if (!res.ok || data.error) {
        setImportError(data.error ?? "Extraction failed");
      } else if (!data.events || data.events.length === 0) {
        setImportError("No upcoming fashion events found on that page. Try editing manually below.");
        // Open blank editor pre-filled with the URL so the user can type it in
        setEditing({ ...BLANK_EVENT, url: importUrl });
      } else {
        setExtracted(data.events);
      }
    } catch {
      setImportError("Network error — try again.");
    } finally {
      setExtracting(false);
    }
  }

  async function handleSaveEvent(ev: Partial<MadridEvent>) {
    if (!ev.name || !ev.rawDate || !ev.venue || !ev.url) {
      alert("Please fill in Name, Date, Venue, and URL.");
      return;
    }
    setSaving(true);
    const payload: MadridEvent = {
      id: ev.id ?? `manual-${Date.now()}`,
      name: ev.name,
      rawDate: ev.rawDate,
      date: toDisplayDate(ev.rawDate),
      venue: ev.venue,
      type: ev.type ?? "Event",
      url: ev.url,
      isNext: false,
    };
    const res = await fetch("/api/admin/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: payload }),
    });
    if (res.ok) {
      setManual((prev) => {
        const without = prev.filter((e) => e.id !== payload.id);
        return [...without, payload].sort((a, b) => a.rawDate.localeCompare(b.rawDate));
      });
      setEditing(null);
      setExtracted((prev) => prev.filter((e) => e.id !== payload.id));
    } else {
      alert("Failed to save event.");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this event from the calendar?")) return;
    await fetch(`/api/admin/calendar?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    setManual((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <section className="mt-12 pt-10 border-t border-[var(--beige)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-light">Madrid Calendar</h2>
          <p className="text-xs text-stone-400 mt-0.5">Events shown on /fashion-news — auto-scraped daily + your manual additions</p>
        </div>
        <button
          onClick={() => setEditing({ ...BLANK_EVENT })}
          className="text-xs tracking-[0.15em] uppercase border border-[var(--charcoal)] text-[var(--charcoal)] px-4 py-2 hover:bg-[var(--charcoal)] hover:text-[var(--cream)] transition-colors"
        >
          + Add manually
        </button>
      </div>

      {/* Import from URL */}
      <div className="mb-8 p-5 bg-stone-50 border border-stone-200">
        <p className="text-xs tracking-[0.12em] uppercase text-stone-500 mb-3">Import event from any URL</p>
        <p className="text-xs text-stone-400 mb-3">Paste a link to any webpage — a brand&apos;s events page, an Instagram post, a school announcement. Claude will read it and extract the event details.</p>
        <div className="flex gap-2">
          <input
            type="url"
            value={importUrl}
            onChange={(e) => setImportUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleExtract()}
            placeholder="https://www.instagram.com/p/… or any event URL"
            className="flex-1 text-sm border border-stone-300 px-3 py-2 focus:outline-none focus:border-stone-500 bg-white"
          />
          <button
            onClick={handleExtract}
            disabled={extracting || !importUrl}
            className="text-xs tracking-[0.12em] uppercase bg-[var(--charcoal)] text-[var(--cream)] px-5 py-2 hover:opacity-80 transition-opacity disabled:opacity-40"
          >
            {extracting ? "Extracting…" : "Extract →"}
          </button>
        </div>
        {importError && (
          <p className="text-xs text-red-500 mt-2">{importError}</p>
        )}

        {/* Extracted event previews */}
        {extracted.length > 0 && (
          <div className="mt-4 space-y-3">
            <p className="text-xs text-stone-500">Found {extracted.length} event{extracted.length > 1 ? "s" : ""}. Review and add:</p>
            {extracted.map((ev) => (
              <div key={ev.id} className="flex items-start justify-between gap-4 p-3 bg-white border border-stone-200">
                <div className="min-w-0">
                  <p className="text-sm font-light">{ev.name}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{ev.date} · {ev.venue} · <span className="italic">{ev.type}</span></p>
                  <a href={ev.url} target="_blank" rel="noopener noreferrer" className="text-xs text-stone-400 hover:text-stone-600 truncate block max-w-xs">{ev.url}</a>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setEditing({ ...ev })}
                    className="text-xs tracking-[0.1em] uppercase text-stone-500 hover:text-stone-700"
                  >Edit</button>
                  <button
                    onClick={() => handleSaveEvent(ev)}
                    className="text-xs tracking-[0.1em] uppercase text-emerald-600 hover:text-emerald-800"
                  >Add →</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit / create overlay */}
      {editing && (
        <div className="mb-6 p-5 border border-stone-300 bg-white">
          <p className="text-xs tracking-[0.12em] uppercase text-stone-500 mb-4">{editing.id ? "Edit event" : "Add event manually"}</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs text-stone-400 block mb-1">Event name *</label>
              <input type="text" value={editing.name ?? ""} onChange={(e) => setEditing((p) => ({ ...p, name: e.target.value }))}
                className="w-full text-sm border border-stone-300 px-3 py-2 focus:outline-none focus:border-stone-500" />
            </div>
            <div>
              <label className="text-xs text-stone-400 block mb-1">Date (YYYY-MM-DD) *</label>
              <input type="date" value={editing.rawDate ?? ""} onChange={(e) => setEditing((p) => ({ ...p, rawDate: e.target.value }))}
                className="w-full text-sm border border-stone-300 px-3 py-2 focus:outline-none focus:border-stone-500" />
            </div>
            <div>
              <label className="text-xs text-stone-400 block mb-1">Venue *</label>
              <input type="text" value={editing.venue ?? ""} onChange={(e) => setEditing((p) => ({ ...p, venue: e.target.value }))}
                className="w-full text-sm border border-stone-300 px-3 py-2 focus:outline-none focus:border-stone-500" />
            </div>
            <div>
              <label className="text-xs text-stone-400 block mb-1">Type</label>
              <select value={editing.type ?? "Event"} onChange={(e) => setEditing((p) => ({ ...p, type: e.target.value }))}
                className="w-full text-sm border border-stone-300 px-3 py-2 focus:outline-none focus:border-stone-500 bg-white">
                {["Show","Fair","Expo","Bridal","Talk","Pop-up","Festival","Event"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs text-stone-400 block mb-1">URL (link on the calendar card) *</label>
              <input type="url" value={editing.url ?? ""} onChange={(e) => setEditing((p) => ({ ...p, url: e.target.value }))}
                className="w-full text-sm border border-stone-300 px-3 py-2 focus:outline-none focus:border-stone-500" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => handleSaveEvent(editing)} disabled={saving}
              className="text-xs tracking-[0.12em] uppercase bg-[var(--charcoal)] text-[var(--cream)] px-5 py-2 hover:opacity-80 transition-opacity disabled:opacity-40">
              {saving ? "Saving…" : "Save to calendar"}
            </button>
            <button onClick={() => setEditing(null)} className="text-xs tracking-[0.12em] uppercase text-stone-400 hover:text-stone-600">Cancel</button>
          </div>
        </div>
      )}

      {/* Event lists */}
      {loadingList ? (
        <p className="text-sm text-[var(--muted)]">Loading…</p>
      ) : (
        <div className="space-y-8">
          {/* Manual (user-curated) */}
          <div>
            <p className="text-xs tracking-[0.12em] uppercase text-stone-400 mb-3">Your additions</p>
            {manual.length === 0 ? (
              <p className="text-xs text-stone-400 italic">None yet — import from a URL or add manually above.</p>
            ) : (
              <div className="divide-y divide-[var(--beige)]">
                {[...manual].sort((a, b) => a.rawDate.localeCompare(b.rawDate)).map((ev) => (
                  <div key={ev.id} className="flex items-center justify-between py-3 gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-light">{ev.name}</p>
                      <p className="text-xs text-stone-400 mt-0.5">{ev.date} · {ev.venue} · <span className="italic">{ev.type}</span></p>
                    </div>
                    <div className="flex gap-4 shrink-0">
                      <button onClick={() => setEditing({ ...ev })} className="text-xs tracking-[0.1em] uppercase text-stone-400 hover:text-stone-600">Edit</button>
                      <button onClick={() => handleDelete(ev.id)} className="text-xs tracking-[0.1em] uppercase text-red-400 hover:text-red-600">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Auto-scraped (read-only) */}
          <div>
            <p className="text-xs tracking-[0.12em] uppercase text-stone-400 mb-3">Auto-scraped (updated daily at 6am UTC)</p>
            {auto.length === 0 ? (
              <p className="text-xs text-stone-400 italic">No auto-scraped events yet — cron runs at 6am UTC.</p>
            ) : (
              <div className="divide-y divide-[var(--beige)] opacity-70">
                {[...auto].sort((a, b) => a.rawDate.localeCompare(b.rawDate)).map((ev) => (
                  <div key={ev.id} className="flex items-center justify-between py-3 gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-light">{ev.name}</p>
                      <p className="text-xs text-stone-400 mt-0.5">{ev.date} · {ev.venue} · <span className="italic">{ev.type}</span></p>
                    </div>
                    <span className="text-xs text-stone-300 shrink-0">auto</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function AdminFashionNewsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-light">Fashion News</h1>
        <p className="text-xs text-stone-400 mt-1">Articles and Madrid calendar for /fashion-news</p>
      </div>
      <ArticlesSection />
      <CalendarSection />
    </div>
  );
}
