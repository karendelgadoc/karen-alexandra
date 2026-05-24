import Link from "next/link";
import { PAGE_KEYS, PAGE_LABELS } from "@/lib/page-content-db";

export const dynamic = "force-dynamic";

const PAGE_DESCRIPTIONS: Record<string, string> = {
  home:      "Hero headline, portrait, intro paragraphs, marquee, pull quote",
  portfolio: "Stats, capabilities, press quotes, CTA copy",
  contact:   "Hero headline, sidebar quote, studio info, closing quote",
  watch:     "Hero headline and subhead",
  about:     "Hero copy, portrait image, gallery images",
};

const EXTRA_PAGES = [
  {
    key: "fashion-news",
    label: "Fashion News",
    description: "Articles, calendar events, and the Madrid fashion digest — managed in the Fashion News section",
    editHref: "/admin/fashion-news",
    editLabel: "Manage Articles →",
    builderHref: null,
  },
];

export default function PagesListPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-900">Pages</h1>
        <p className="text-sm text-stone-500 mt-1">
          Edit content and layout of each page. Use the Builder to reorder or hide sections.
        </p>
      </div>

      <div className="space-y-3">
        {PAGE_KEYS.map((key) => (
          <div
            key={key}
            className="flex items-center justify-between p-5 bg-white border border-stone-200 rounded-lg"
          >
            <div className="flex-1 min-w-0 mr-6">
              <p className="font-medium text-stone-900">{PAGE_LABELS[key]}</p>
              <p className="text-sm text-stone-400 mt-0.5">{PAGE_DESCRIPTIONS[key]}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link
                href={`/admin/pages/${key}/builder`}
                className="text-sm px-4 py-2 border border-stone-300 rounded hover:bg-stone-50 text-stone-700 transition-colors font-medium"
              >
                Builder ⊞
              </Link>
              <Link
                href={`/admin/pages/${key}`}
                className="text-sm px-4 py-2 bg-stone-900 text-white rounded hover:bg-stone-700 transition-colors font-medium"
              >
                Edit Content →
              </Link>
            </div>
          </div>
        ))}

        {EXTRA_PAGES.map((p) => (
          <div
            key={p.key}
            className="flex items-center justify-between p-5 bg-white border border-stone-200 rounded-lg"
          >
            <div className="flex-1 min-w-0 mr-6">
              <p className="font-medium text-stone-900">{p.label}</p>
              <p className="text-sm text-stone-400 mt-0.5">{p.description}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link
                href={p.editHref}
                className="text-sm px-4 py-2 bg-stone-900 text-white rounded hover:bg-stone-700 transition-colors font-medium"
              >
                {p.editLabel}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
