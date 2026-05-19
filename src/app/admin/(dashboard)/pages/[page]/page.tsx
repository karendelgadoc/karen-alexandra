import { notFound } from "next/navigation";
import {
  PAGE_KEYS,
  PAGE_LABELS,
  getHomeContent,
  getPortfolioContent,
  getContactContent,
  getWatchContent,
  getAboutContent,
  type PageKey,
} from "@/lib/page-content-db";
import PageEditor from "./PageEditor";
import Link from "next/link";

export const dynamic = "force-dynamic";

const FETCHERS = {
  home: getHomeContent,
  portfolio: getPortfolioContent,
  contact: getContactContent,
  watch: getWatchContent,
  about: getAboutContent,
};

export default async function PageEditorPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  if (!PAGE_KEYS.includes(page as PageKey)) notFound();

  const content = await FETCHERS[page as PageKey]().catch(() => null);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/admin/pages" className="text-sm text-stone-400 hover:text-stone-600 mb-1 inline-block">
            ← Pages
          </Link>
          <h1 className="text-2xl font-semibold text-stone-900">
            {PAGE_LABELS[page as PageKey]}
          </h1>
        </div>
        <a
          href={page === "home" ? "/" : `/${page}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-stone-400 hover:text-stone-600"
        >
          View live →
        </a>
      </div>

      <PageEditor page={page as PageKey} initialData={content} />
    </div>
  );
}
