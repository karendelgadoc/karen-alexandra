import type { Metadata } from "next";
import { getWatchContent, WATCH_DEFAULTS } from "@/lib/page-content-db";
import { buildWatchSectionMap } from "@/components/sections/watch";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Watch — Karen Alexandra",
  description: "Travel, fashion and wellness films by Karen Alexandra.",
};

export default async function WatchPage() {
  const content = await getWatchContent().catch(() => null);
  const c = content ?? WATCH_DEFAULTS;
  const sectionMap = buildWatchSectionMap(c);
  const order = c.sectionOrder ?? WATCH_DEFAULTS.sectionOrder;
  const hidden = new Set(c.hiddenSections ?? []);

  return (
    <>
      {order.filter((id) => !hidden.has(id)).map((id) => (
        <div key={id} data-section-id={id}>{sectionMap[id] ?? null}</div>
      ))}
    </>
  );
}
