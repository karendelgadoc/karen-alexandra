import { getServerClient } from "./insforge";

// ── Section registry ──────────────────────────────────────────────────────────

export const PAGE_SECTIONS = {
  home: [
    { id: "hero",             label: "Hero" },
    { id: "marquee",          label: "Marquee Strip" },
    { id: "featured-stories", label: "Featured Stories" },
    { id: "editor-note",      label: "Editor's Note" },
    { id: "from-the-reel",    label: "From the Reel" },
    { id: "categories",       label: "Categories" },
    { id: "newsletter",       label: "Newsletter" },
  ],
  portfolio: [
    { id: "hero",          label: "Hero" },
    { id: "facts",         label: "Stats" },
    { id: "logos",         label: "Client Logos" },
    { id: "capabilities",  label: "Capabilities" },
    { id: "selected-work", label: "Selected Work" },
    { id: "press",         label: "Press" },
    { id: "cta",           label: "CTA" },
  ],
  contact: [
    { id: "hero",        label: "Hero" },
    { id: "form",        label: "Contact Form" },
    { id: "close-quote", label: "Closing Quote" },
  ],
  watch: [
    { id: "hero",       label: "Hero" },
    { id: "featured",   label: "Featured Video" },
    { id: "filters",    label: "Filters" },
    { id: "video-grid", label: "Video Grid" },
    { id: "meta",       label: "Footer Note" },
  ],
  about: [
    { id: "hero",             label: "Hero" },
    { id: "bio",              label: "Bio" },
    { id: "credentials",      label: "By the Numbers" },
    { id: "case-studies-preview", label: "Case Studies Preview" },
    { id: "gallery",          label: "Gallery" },
  ],
} as const;

// ── Types ─────────────────────────────────────────────────────────────────────

interface SectionLayout {
  sectionOrder: string[];
  hiddenSections: string[];
}

export interface HomeContent extends SectionLayout {
  hero: {
    eyebrow: string;
    headline: string;
    headlineItalic: string;
    subhead1: string;
    subhead2: string;
    ctaLabel: string;
    ctaNote: string;
    portraitUrl: string;
    letterCardTitle: string;
  };
  quote: { text: string };
  marquee: { items: string[] };
}

export interface PortfolioContent extends SectionLayout {
  hero: {
    eyebrow: string;
    headline: string;
    accentText: string;
  };
  stats: Array<{ value: string; label: string; note: string }>;
  capabilities: Array<{ title: string; desc: string }>;
  press: Array<{ publication: string; quote: string; date: string }>;
  cta: { headline: string; buttonLabel: string };
  galleryImages: string[];
}

export interface ContactContent extends SectionLayout {
  hero: { eyebrow: string; headlineLine1: string; headlineLine2: string; subhead: string };
  sidebar: { quote: string; location: string; availability: string; responseNote: string };
  close: { quote: string };
}

export interface WatchContent extends SectionLayout {
  hero: { eyebrow: string; headline: string; subhead: string };
}

export interface AboutContent extends SectionLayout {
  hero: { eyebrow: string; headline: string };
  portraitUrl: string;
  galleryImages: string[];
}

export interface MenuContent {
  leftLinks: Array<{ label: string; href: string }>;
  rightLinks: Array<{ label: string; href: string }>;
}

// ── Defaults ──────────────────────────────────────────────────────────────────

export const HOME_DEFAULTS: HomeContent = {
  sectionOrder: PAGE_SECTIONS.home.map((s) => s.id),
  hiddenSections: [],
  hero: {
    eyebrow: "— By Karen Alexandra",
    headline: "The Art",
    headlineItalic: "of Well",
    subhead1:
      "A correspondence on the quiet luxuries — the cashmere worth keeping, the suite worth flying for, the morning ritual worth protecting.",
    subhead2:
      "Authored by a luxury fashion e-commerce lead and lifestyle correspondent based between New York and the Côte d'Azur.",
    ctaLabel: "Begin Reading",
    ctaNote: "— 48 dispatches, all year long",
    portraitUrl: "/photos/portrait-lavender.jpg",
    letterCardTitle: "On dressing for the life you want.",
  },
  quote: {
    text: "The art of living well is knowing what to keep and what to leave behind.",
  },
  marquee: {
    items: [
      "Cashmere weather",
      "Capri in May",
      "Corfu for dinner",
      "Mykonos, always",
      "What I wore in Rome",
    ],
  },
};

export const PORTFOLIO_DEFAULTS: PortfolioContent = {
  sectionOrder: PAGE_SECTIONS.portfolio.map((s) => s.id),
  hiddenSections: [],
  hero: {
    eyebrow: "Selected work · 2014 – present",
    headline: "Fashion, travel and digital brand strategy.",
    accentText: "10+ years building brands that convert.",
  },
  stats: [
    { value: "30K", label: "Instagram", note: "Fashion & travel audience built organically" },
    { value: "3M", label: "Pinterest", note: "Monthly viewers at peak" },
    { value: "20+", label: "Brand Partners", note: "Shopbop, Four Seasons, IHG, Citizens of Humanity and more" },
    { value: "3", label: "Industries", note: "Fashion · Travel · Tech" },
  ],
  capabilities: [
    { title: "E-Commerce Strategy", desc: "Digital merchandising, product assortment curation, Shopify store architecture and conversion optimisation." },
    { title: "Brand & Creative", desc: "Narrative development, content direction, editorial storytelling across fashion and travel verticals." },
    { title: "Digital Growth", desc: "Audience building on Instagram and Pinterest. Data-informed content strategy and community engagement." },
    { title: "Partnerships", desc: "Brand collaboration, influencer outreach and partnership alignment with luxury and lifestyle labels." },
  ],
  press: [
    { publication: "Shopbop", quote: "A natural storyteller — Karen brings the kind of editorial eye that makes products feel aspirational.", date: "2019" },
    { publication: "Four Seasons Hotels", quote: "Her travel content elevated the conversation around luxury hospitality in a genuinely authentic way.", date: "2020" },
    { publication: "Citizens of Humanity", quote: "One of the clearest voices in the luxury denim space. Her audience trusts her completely.", date: "2018" },
  ],
  cta: {
    headline: "Begin a conversation.",
    buttonLabel: "Get in touch →",
  },
  galleryImages: [
    "https://5xkq5mmr.us-east.insforge.app/api/storage/buckets/blog-images/objects/site%2FIMG_4585-edited.jpg",
    "https://5xkq5mmr.us-east.insforge.app/api/storage/buckets/blog-images/objects/site%2FIMG_4593.jpg",
    "https://5xkq5mmr.us-east.insforge.app/api/storage/buckets/blog-images/objects/site%2FIMG_6819.jpg",
  ],
};

export const CONTACT_DEFAULTS: ContactContent = {
  sectionOrder: PAGE_SECTIONS.contact.map((s) => s.id),
  hiddenSections: [],
  hero: {
    eyebrow: "Inquiries · MMXXVI",
    headlineLine1: "Begin a",
    headlineLine2: "correspondence",
    subhead:
      "Whether you're writing about a season, a feature, or a long partnership — the door is open. Responses, considered, within five business days.",
  },
  sidebar: {
    quote:
      "I read every note that arrives. The ones I take on become long correspondences — fewer, deeper, the way the work is worth doing.",
    location: "New York · Côte d'Azur",
    availability: "By appointment",
    responseNote: "Replies in ≤ 5 business days",
  },
  close: {
    quote:
      "Considered always beats prompt. Write when you have something to say — not before.",
  },
};

export const WATCH_DEFAULTS: WatchContent = {
  sectionOrder: PAGE_SECTIONS.watch.map((s) => s.id),
  hiddenSections: [],
  hero: {
    eyebrow: "On film · The reel",
    headline: "On Film.",
    subhead: "Travel, fashion and the quiet moments in between — on camera.",
  },
};

export const ABOUT_DEFAULTS: AboutContent = {
  sectionOrder: PAGE_SECTIONS.about.map((s) => s.id),
  hiddenSections: [],
  hero: {
    eyebrow: "Our Story",
    headline: "Brand strategy rooted in lived experience.",
  },
  portraitUrl:
    "https://5xkq5mmr.us-east.insforge.app/api/storage/buckets/blog-images/objects/site%2FIMG_4534.jpg",
  galleryImages: [
    "https://5xkq5mmr.us-east.insforge.app/api/storage/buckets/blog-images/objects/site%2FIMG_4585-edited.jpg",
    "https://5xkq5mmr.us-east.insforge.app/api/storage/buckets/blog-images/objects/site%2FIMG_4593.jpg",
    "https://5xkq5mmr.us-east.insforge.app/api/storage/buckets/blog-images/objects/site%2FIMG_6819.jpg",
  ],
};

export const MENU_DEFAULTS: MenuContent = {
  leftLinks: [
    { label: "Journal",      href: "/journal" },
    { label: "Portfolio",    href: "/portfolio" },
    { label: "Case Studies", href: "/case-studies" },
  ],
  rightLinks: [
    { label: "Watch",   href: "/watch" },
    { label: "About",   href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function deepMerge<T>(defaults: T, overrides: Partial<T>): T {
  if (!overrides || typeof overrides !== "object") return defaults;
  const result = { ...defaults };
  for (const key of Object.keys(overrides) as (keyof T)[]) {
    const def = defaults[key];
    const ov = overrides[key];
    if (ov === undefined || ov === null) continue;
    if (Array.isArray(def) && Array.isArray(ov)) {
      (result as Record<string, unknown>)[key as string] = ov;
    } else if (typeof def === "object" && !Array.isArray(def) && typeof ov === "object") {
      result[key] = deepMerge(def as object, ov as object) as T[keyof T];
    } else {
      result[key] = ov as T[keyof T];
    }
  }
  return result;
}

async function fetchPageContent<T>(page: string, defaults: T): Promise<T> {
  try {
    const db = getServerClient();
    const result = await db.database.from("page_content").select("content").eq("page", page);
    const rows = (result as { data?: Array<{ content: unknown }> }).data;
    if (!rows || rows.length === 0) return defaults;
    return deepMerge(defaults, rows[0].content as Partial<T>);
  } catch {
    return defaults;
  }
}

// ── Public read API ───────────────────────────────────────────────────────────

export const getHomeContent      = () => fetchPageContent<HomeContent>("home", HOME_DEFAULTS);
export const getPortfolioContent = () => fetchPageContent<PortfolioContent>("portfolio", PORTFOLIO_DEFAULTS);
export const getContactContent   = () => fetchPageContent<ContactContent>("contact", CONTACT_DEFAULTS);
export const getWatchContent     = () => fetchPageContent<WatchContent>("watch", WATCH_DEFAULTS);
export const getAboutContent     = () => fetchPageContent<AboutContent>("about", ABOUT_DEFAULTS);
export const getMenuContent      = () => fetchPageContent<MenuContent>("menu", MENU_DEFAULTS);

// ── Admin write API ───────────────────────────────────────────────────────────

export async function upsertPageContent(page: string, content: unknown): Promise<void> {
  const db = getServerClient();
  const result = await db.database.from("page_content").upsert({
    page,
    content,
    updated_at: new Date().toISOString(),
  });
  const err = (result as { error?: { message: string } }).error;
  if (err) throw new Error(err.message);
}

export const PAGE_KEYS = ["home", "portfolio", "contact", "watch", "about"] as const;
export type PageKey = (typeof PAGE_KEYS)[number];

export const PAGE_LABELS: Record<PageKey, string> = {
  home:      "Home",
  portfolio: "Portfolio",
  contact:   "Contact",
  watch:     "Watch",
  about:     "About",
};
