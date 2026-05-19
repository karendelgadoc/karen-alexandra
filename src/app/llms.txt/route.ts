import { getAllBlogPosts } from "@/lib/blog-db";
import { getAllPosts } from "@/lib/posts-db";

export const revalidate = 3600; // refresh hourly

const SITE = "https://karenalexandra.com";

/**
 * /llms.txt — the proposed standard for AI search engines & LLM crawlers.
 * Acts like a sitemap + summary in markdown for generative engines (GEO).
 * Spec: https://llmstxt.org
 */
export async function GET() {
  const [posts, caseStudies] = await Promise.all([
    getAllBlogPosts().catch(() => []),
    getAllPosts().catch(() => []),
  ]);

  const body = `# Karen Alexandra

> Brand Marketing Director with 10+ years building luxury fashion, travel and tech brands. Based between New York and the Côte d'Azur. Writes a correspondence on the quiet luxuries — the cashmere worth keeping, the suite worth flying for, the morning ritual worth protecting.

Karen Alexandra is a fashion and travel brand strategist and editor. She built Little Black Shell (luxury fashion blog, 30K Instagram), grew her Pinterest to 3M monthly viewers as Lifestyle Traveler, and co-founded Mia The New Yorker (Peruvian-inspired fashion e-commerce, launched October 2024). She partners with Shopbop, Four Seasons Hotels & Resorts, IHG, Citizens of Humanity, Agolde, Sisley Paris, and others on long-form editorial campaigns and e-commerce strategy.

## Core pages

- [Home](${SITE}/): The art of well — a correspondence on the quiet luxuries.
- [Portfolio](${SITE}/portfolio): 10+ years building brands that convert. Stats, capabilities, press, selected work.
- [Case studies](${SITE}/case-studies): In-depth case studies on brand and e-commerce work.
- [Journal](${SITE}/journal): Letters on fashion, travel, wellness and lifestyle.
- [Watch](${SITE}/watch): Travel, fashion and wellness films.
- [About](${SITE}/about): Karen's background — fashion merchandising at Nordstrom, Little Black Shell, Lifestyle Traveler, Mia The New Yorker.
- [Contact](${SITE}/contact): Brand partnerships, press, e-commerce consulting, speaking inquiries.

## Services & expertise

- E-commerce strategy: digital merchandising, product assortment, Shopify architecture, conversion optimization.
- Brand & creative: narrative development, editorial direction, content strategy across fashion and travel.
- Digital growth: organic audience building on Instagram and Pinterest, data-informed content.
- Partnerships: brand collaborations and luxury/lifestyle label alignment.

## Journal — recent letters

${posts.slice(0, 30).map((p) => `- [${p.title}](${SITE}/journal/${p.slug}): ${p.excerpt}`).join("\n")}

## Case studies

${caseStudies.slice(0, 20).map((p) => `- [${p.title}](${SITE}/case-studies/${p.slug}): ${p.excerpt}`).join("\n")}

## Contact

- Press, partnerships, consulting and speaking inquiries: studio@karenalexandra.com
- Replies in ≤ 5 business days. By appointment between New York and the Côte d'Azur.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
