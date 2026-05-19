import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts-db";
import { getPortfolioContent, PORTFOLIO_DEFAULTS } from "@/lib/page-content-db";
import { buildPortfolioSectionMap } from "@/components/sections/portfolio";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio — Karen Alexandra",
  description: "10+ years building luxury fashion and travel brands. Brand strategy, digital merchandising and growth.",
};

export default async function PortfolioPage() {
  const [posts, content] = await Promise.all([
    getAllPosts(),
    getPortfolioContent().catch(() => null),
  ]);
  const c = content ?? PORTFOLIO_DEFAULTS;
  const sectionMap = buildPortfolioSectionMap(c, { posts });
  const order = c.sectionOrder ?? PORTFOLIO_DEFAULTS.sectionOrder;
  const hidden = new Set(c.hiddenSections ?? []);

  return (
    <>
      {order.filter((id) => !hidden.has(id)).map((id) => (
        <div key={id} data-section-id={id}>{sectionMap[id] ?? null}</div>
      ))}
    </>
  );
}
