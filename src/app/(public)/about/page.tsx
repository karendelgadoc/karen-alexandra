import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts-db";
import { getAboutContent, ABOUT_DEFAULTS } from "@/lib/page-content-db";
import { buildAboutSectionMap } from "@/components/sections/about";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About — Karen Alexandra",
  description: "Brand Marketing Director with a background in luxury fashion, travel, and tech.",
};

export default async function AboutPage() {
  const [posts, content] = await Promise.all([
    getAllPosts(),
    getAboutContent().catch(() => null),
  ]);
  const c = content ?? ABOUT_DEFAULTS;
  const sectionMap = buildAboutSectionMap(c, { posts });
  const order = c.sectionOrder ?? ABOUT_DEFAULTS.sectionOrder;
  const hidden = new Set(c.hiddenSections ?? []);

  return (
    <>
      {order.filter((id) => !hidden.has(id)).map((id) => (
        <div key={id} data-section-id={id}>{sectionMap[id] ?? null}</div>
      ))}
    </>
  );
}
