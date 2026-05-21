/**
 * JSON-LD structured data. Helps Google rich results AND helps generative
 * engines (ChatGPT, Perplexity, Claude) parse the page content reliably.
 */

const SITE = "https://karenalexandra.com";

interface BaseLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

export function JsonLd({ data }: BaseLdProps) {
  return (
    <script
      type="application/ld+json"
      // Next allows inline JSON-LD via dangerouslySetInnerHTML — the JSON is
      // serialized server-side, no user input flows in.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ── Pre-built schema generators ──────────────────────────────────────────────

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE}/#karen`,
    name: "Karen Alexandra",
    url: SITE,
    image: `${SITE}/photos/portrait-lavender.jpg`,
    jobTitle: "Brand Marketing Director",
    description:
      "Brand Marketing Director with 10+ years building luxury fashion, travel and tech brands. Editor and founder.",
    sameAs: [
      "https://www.instagram.com/karenalexandrac",
      "https://www.pinterest.com/karenalexandra__/",
      "https://www.youtube.com/@KarenAlexandra",
    ],
    knowsAbout: [
      "Brand marketing",
      "Luxury fashion",
      "E-commerce strategy",
      "Digital merchandising",
      "Editorial storytelling",
      "Travel content",
    ],
    worksFor: { "@type": "Organization", name: "Karen Alexandra Studio" },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE}/#org`,
    name: "Karen Alexandra",
    url: SITE,
    logo: `${SITE}/logo-wordmark.png`,
    founder: { "@id": `${SITE}/#karen` },
    sameAs: [
      "https://www.instagram.com/karenalexandrac",
      "https://www.pinterest.com/karenalexandra__/",
      "https://www.youtube.com/@KarenAlexandra",
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}/#site`,
    url: SITE,
    name: "Karen Alexandra",
    description:
      "Brand strategist and editor. A correspondence on the quiet luxuries — fashion, travel, and the art of living well.",
    publisher: { "@id": `${SITE}/#org` },
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE}/journal?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function articleSchema(opts: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  keywords?: string[];
  category?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    image: opts.image ? [opts.image] : undefined,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    author: {
      "@type": "Person",
      name: opts.authorName ?? "Karen Alexandra",
      "@id": `${SITE}/#karen`,
      url: SITE,
    },
    publisher: { "@id": `${SITE}/#org` },
    mainEntityOfPage: { "@type": "WebPage", "@id": opts.url },
    keywords: opts.keywords?.join(", "),
    articleSection: opts.category,
  };
}

export function faqSchema(items: Array<{ question: string; answer: string }>) {
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  };
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}
