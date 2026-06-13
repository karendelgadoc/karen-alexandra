import { getMediaKitContent, MEDIA_KIT_DEFAULTS } from "@/lib/page-content-db";
import { buildMediaKitSectionMap } from "@/components/sections/media-kit";
import { getAllBlogPosts } from "@/lib/blog-db";
import { getLatestVideos } from "@/lib/youtube";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Media Kit — Karen Alexandra",
  description:
    "A small, considered audience. Karen Alexandra — luxury fashion e-commerce lead and lifestyle correspondent. For press and brand partners.",
};

export default async function MediaKitPage() {
  const [content, blogPosts, videos] = await Promise.all([
    getMediaKitContent().catch(() => null),
    getAllBlogPosts().catch(() => []),
    getLatestVideos(2).catch(() => []),
  ]);
  const c = content ?? MEDIA_KIT_DEFAULTS;
  const recentPosts = blogPosts.slice(0, 2);
  const recentVideos = videos.slice(0, 2);

  const hidden = new Set(c.hiddenSections ?? []);
  const order = c.sectionOrder ?? MEDIA_KIT_DEFAULTS.sectionOrder;
  const sectionMap = buildMediaKitSectionMap(c, { recentPosts, recentVideos });

  return (
    <>
      {order.filter((id) => !hidden.has(id)).map((id) => (
        <div key={id} data-section-id={id}>{sectionMap[id] ?? null}</div>
      ))}
    </>
  );
}
