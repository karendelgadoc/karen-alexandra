import { getServicesContent, SERVICES_DEFAULTS } from "@/lib/page-content-db";
import { buildServicesSectionMap } from "@/components/sections/services";
import { getAllPosts } from "@/lib/posts-db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SERVICES_ENABLED } from "@/lib/site-flags";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services — Karen Alexandra",
  description:
    "Four ways to begin a correspondence. Selectively-offered engagements for fashion houses, hospitality groups, and independent labels.",
  robots: SERVICES_ENABLED ? undefined : { index: false, follow: false },
};

export default async function ServicesPage() {
  // Hidden from the public site — see SERVICES_ENABLED in src/lib/site-flags.ts.
  // The content stays in the database and is still editable at /admin/pages/services.
  if (!SERVICES_ENABLED) notFound();

  const [content, allPosts] = await Promise.all([
    getServicesContent().catch(() => null),
    getAllPosts().catch(() => []),
  ]);
  const c = content ?? SERVICES_DEFAULTS;
  const posts = allPosts.slice(0, 3);

  const hidden = new Set(c.hiddenSections ?? []);
  const order = c.sectionOrder ?? SERVICES_DEFAULTS.sectionOrder;
  const sectionMap = buildServicesSectionMap(c, { posts });

  return (
    <>
      {order.filter((id) => !hidden.has(id)).map((id) => (
        <div key={id} data-section-id={id}>{sectionMap[id] ?? null}</div>
      ))}
    </>
  );
}
