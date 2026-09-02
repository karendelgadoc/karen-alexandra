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
  journal: [
    { id: "hero",       label: "Hero" },
    { id: "pull-quote", label: "Pull Quote" },
  ],
  about: [
    { id: "hero",      label: "Hero" },
    { id: "manifesto", label: "On This Place" },
    { id: "bio",       label: "Bio & Portrait" },
    { id: "map",       label: "World Map" },
    { id: "joys",      label: "Joys" },
    { id: "cta",       label: "CTA" },
  ],
  services: [
    { id: "hero",         label: "Hero" },
    { id: "principle",    label: "Principle Strip" },
    { id: "services",     label: "Service Cards" },
    { id: "process",      label: "Process" },
    { id: "case-links",   label: "Case Studies" },
    { id: "testimonials", label: "Testimonials" },
    { id: "faq",          label: "FAQ" },
    { id: "cta",          label: "CTA" },
  ],
  "media-kit": [
    { id: "hero",         label: "Hero" },
    { id: "bio",          label: "Bio & Portrait" },
    { id: "reach",        label: "Reach & Audience" },
    { id: "partners",     label: "Partners" },
    { id: "press",        label: "Press" },
    { id: "testimonials", label: "Testimonials" },
    { id: "instagram",    label: "Instagram" },
    { id: "cta",          label: "Download CTA" },
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
  clientLogos: string[];
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

export interface JournalContent extends SectionLayout {
  hero: { eyebrow: string; headline: string; subhead: string };
  pullQuote: string;
}

export interface AboutContent extends SectionLayout {
  hero: { eyebrow: string; headline: string; subhead: string };
  manifesto: { eyebrow: string; quote: string; para1: string; para2: string };
  bio: {
    portraitUrl: string;
    tagline: string;
    para1: string; para2: string; para3: string; para4: string;
    facts: Array<{ label: string; value: string }>;
  };
  joys: Array<{ n: string; title: string; desc: string }>;
  cta: { headline: string; subhead: string };
}

export interface ServicesContent extends SectionLayout {
  hero: { eyebrow: string; headline: string; headlineItalic: string; subhead: string };
  principle: { label: string; quote: string };
  services: Array<{
    n: string; title: string; italic: boolean; tag: string; summary: string;
    deliverables: string[]; proofStat: string; proofNote: string; proofCase: string; proofSlug: string;
  }>;
  process: Array<{ num: string; title: string; when: string; note: string }>;
  testimonials: Array<{ q: string; who: string }>;
  faq: Array<{ q: string; a: string }>;
  cta: { headline: string; subhead: string };
}

export interface MediaKitContent extends SectionLayout {
  hero: { eyebrowLeft: string; eyebrowRight: string; headline: string; headlineItalic: string; headlineLine3: string; subhead: string };
  bio: { eyebrow: string; headline: string; bioText: string; basedValue: string; languagesValue: string; workingWithValue: string; portraitUrl: string };
  reach: Array<{ v: string; l: string }>;
  audienceHeadline: string;
  audienceNote: string;
  demo: Array<{ label: string; pct: number }>;
  partners: string[];
  press: Array<{ p: string; q: string; d: string }>;
  testimonials: Array<{ q: string; who: string }>;
  instagram: { handle: string; followers: string; engagement: string };
  ctaSubhead: string;
}

export interface MenuContent {
  leftLinks: Array<{ label: string; href: string }>;
  rightLinks: Array<{ label: string; href: string }>;
}

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterContent {
  tagline: string;
  columns: FooterColumn[];
  bottomLinks: FooterLink[];
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
  // Rendered from a fixed array in CapabilitiesSection, not from this field —
  // see the comment above CAPABILITIES in components/sections/portfolio.tsx.
  // Kept in sync so the two don't contradict each other; edit both together.
  capabilities: [
    { title: "Fractional Brand Marketing Director", desc: "Hire me as your Fractional Brand Marketing Director to create and execute on your brand's marketing strategy." },
    { title: "Influencer Campaign Management",      desc: "Full influencer marketing management from strategy to day-to-day campaign management." },
    { title: "E-commerce & Blog Content",           desc: "Up-level your digital storefront through SEO/GEO optimized content, and curated digital merchandising." },
    { title: "Brand partnerships",                  desc: "Long-form collaborations either on my own channels or UGC for your brand's content." },
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
  clientLogos: [
    "SHOPBOP", "FOUR SEASONS", "IHG", "CITIZENS OF HUMANITY", "RIVER ISLAND",
    "AGOLDE", "SISLEY PARIS", "MAKEUP FOREVER", "ASOS", "NORDSTROM",
  ],
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
    // The contact hero's headline and subhead are rendered from fixed strings
    // in components/sections/contact.tsx, not from these values — a stored
    // page_content row would otherwise override whatever is set here. Kept in
    // sync so the two don't contradict each other; edit both together.
    eyebrow: "Inquiries · MMXXVI",
    headlineLine1: "Let's work",
    headlineLine2: "together",
    subhead:
      "Whether you're looking for a brand marketing strategy overhaul, an e-commerce revamp, or campaign management, my email is the best way to reach me.",
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

export const JOURNAL_DEFAULTS: JournalContent = {
  sectionOrder: PAGE_SECTIONS.journal.map((s) => s.id),
  hiddenSections: [],
  hero: {
    eyebrow: "The Edit",
    headline: "The Art of Well",
    subhead: "A global citizen's guide to well living — fashion, travel, wellness and the life that happens in between.",
  },
  pullQuote: "To dress well is to live well — both require intention.",
};

export const ABOUT_DEFAULTS: AboutContent = {
  sectionOrder: PAGE_SECTIONS.about.map((s) => s.id),
  hiddenSections: [],
  hero: {
    eyebrow: "About · The author & the project",
    headline: "Hello, I'm Karen.",
    subhead: "Peruvian by birth, Spanish by choice, Californian in summer. A correspondent on a long, looping life — and the editor of the letters you find on this site.",
  },
  manifesto: {
    eyebrow: "N° 01 — On this place",
    quote: "This site is a slow correspondence — a Saturday letter on luxury fashion, considered travel, and the rituals that hold a beautiful life together.",
    para1: "I started writing here in 2019, the year I returned to Barcelona for the second time. The premise has not changed since: fewer letters, written more carefully, in a register the trade press tends to skip.",
    para2: "What you'll find: a journal of long-form essays, a weekly briefing on fashion news, a film reel of dispatches, and the occasional reader letter I've answered in public. What you won't find: a tour of my routines, an affiliate-bait roundup, a content calendar.",
  },
  bio: {
    portraitUrl: "https://5xkq5mmr.us-east.insforge.app/api/storage/buckets/blog-images/objects/site%2FIMG_4534.jpg",
    tagline: "Karen Alexandra — writer, e-commerce lead, and the long Sunday lunch most of my friends are waiting for.",
    para1: "I have a job and I have a journal, and most weeks I think the two have begun to write each other. The day job is in luxury fashion e-commerce — strategy, merchandising, the unsexy work of compounding return rates. I lead direct-to-consumer for an independent shoe house, and I consult for a handful of fashion and hospitality brands whose work I'd recommend without the brief.",
    para2: "The other half is this site. I write a Saturday letter for an audience of readers I quietly know by first name; I make small films on YouTube about the rooms, wardrobes, and rituals I want to write about; I post quietly on Instagram about whatever happens to be on the table. The phrase \"influencer\" gives me a small allergic reaction — though I'll cop to being one, because the alternative is pretending the work is something it isn't.",
    para3: "Off the page, I am a dog mom to a maltipom named Mia, who has views about most things. I'm a triple citizen — Peru, the United States, Spain — which is mostly relevant at customs and very occasionally in conversation. I love coffee, yoga before the day starts, fashion that survives a second look, a long hike, dinners with family and friends that turn into breakfast, and a glass of wine well-poured on a Spanish terraza or chiringuito.",
    para4: "I write from Madrid, for the moment. By the time you read this I may have moved again — but the letters are sent from somewhere with a balcony, and that is the rule.",
    facts: [
      { label: "Reads as",  value: "Karen Alexandra" },
      { label: "Speaks",    value: "EN · ES · IT" },
      { label: "Currently", value: "Madrid, Spain" },
      { label: "Born",      value: "Lima, Peru — 2 April 1992" },
      { label: "With",      value: "Mia, a maltipom" },
      { label: "Cites",     value: "Joan Didion, Vivian Gornick, Lucia Berlin" },
    ],
  },
  joys: [
    { n: "I",    title: "Coffee",                   desc: "Cortado, double, never to go." },
    { n: "II",   title: "Yoga",                     desc: "Most mornings. Mat by the window." },
    { n: "III",  title: "Travel",                   desc: "Slowly. With a small bag and a real plan." },
    { n: "IV",   title: "Fashion",                  desc: "What I'd wear again next year." },
    { n: "V",    title: "Hiking",                   desc: "Sierra de Madrid. Most weekends." },
    { n: "VI",   title: "Family & friends",          desc: "The longest lunches you've ever sat through." },
    { n: "VII",  title: "A good wine, well-poured", desc: "Spanish terraza or chiringuito, ideally both." },
  ],
  cta: {
    headline: "Read along, write back, or simply lurk — all three are welcome.",
    subhead: "The Saturday letter arrives once a week. The journal updates most Wednesdays. The rest of the time I'm probably writing it or living it.",
  },
};

export const SERVICES_DEFAULTS: ServicesContent = {
  sectionOrder: PAGE_SECTIONS.services.map((s) => s.id),
  hiddenSections: [],
  hero: {
    eyebrow: "Services · The studio · MMXXVI",
    headline: "Four ways to",
    headlineItalic: "begin a correspondence",
    subhead: "Selectively-offered engagements for fashion houses, hospitality groups, and independent labels. Long-form by design — typically a season or more.",
  },
  principle: {
    label: "How the studio operates",
    quote: "Four engagements, taken on at a time. No discovery calls before a written brief. One thesis per project, repeated until it’s true.",
  },
  services: [
    { n: "I", title: "E-commerce strategy", italic: false, tag: "Most-requested · 3–6 mo engagement", summary: "Direct storefront positioning, merchandising calendars, season-launch playbooks, marketplace expansion — the work that compounds past the first quarter.", deliverables: ["Storefront audit & repositioning", "Twelve-month merchandising calendar", "Audience & retention plan", "Quarterly review"], proofStat: "+218%", proofNote: "Return-customer rate", proofCase: "Glent Shoes", proofSlug: "case-study-little-black-shell" },
    { n: "II", title: "Brand & creative direction", italic: true, tag: "Campaign or season-led", summary: "Editorial direction for campaigns, lookbooks, and shoppable storytelling — bridging the buying floor and the masthead. Bias toward fewer, better assets.", deliverables: ["Creative brief & mood", "Cast, location, photographer shortlist", "Edit & sequence", "Rollout calendar"], proofStat: "47", proofNote: "Properties profiled · ongoing", proofCase: "Four Seasons × KA", proofSlug: "case-studies" },
    { n: "III", title: "Editorial partnerships", italic: false, tag: "Ongoing · 12 mo minimum", summary: "A long-form correspondence between the brand and the Journal — Substack letters, films, and quietly-shoppable storytelling. The opposite of an activation.", deliverables: ["Annual editorial calendar", "Eight to twelve long-form pieces", "Two short films per year", "Distribution across owned + earned"], proofStat: "3.2×", proofNote: "Direct-bookings via editorial", proofCase: "Aman Resorts", proofSlug: "case-studies" },
    { n: "IV", title: "Audience & growth advisory", italic: true, tag: "Project-based · 6–8 weeks", summary: "An audience map and a written rollout — paid + organic, with a heavy hand for retention. For teams that already know the funnel matters and want it written down.", deliverables: ["Audience segmentation map", "CRM & email overhaul", "Channel matrix & cadence", "Measurement framework"], proofStat: "+62%", proofNote: "Engaged time on campaign hub", proofCase: "Loewe", proofSlug: "case-studies" },
  ],
  process: [
    { num: "01", title: "A first letter",   when: "Week 0",     note: "You write. I respond within five business days. If there’s a fit, we put a thirty-minute call on the calendar." },
    { num: "02", title: "Brief & proposal", when: "Week 1",     note: "I send a short proposal — scope, deliverables, fee, calendar. Two iterations included." },
    { num: "03", title: "Discovery",        when: "Weeks 2–3",  note: "Two weeks reading everything — your site, your last twelve months of communications, the rooms you’re not in." },
    { num: "04", title: "The work",         when: "Weeks 3–N",  note: "Weekly written notes, fortnightly working sessions, and a single end-of-engagement document you can hand to anyone." },
    { num: "05", title: "Close & handover", when: "Final week", note: "A written handover, two months of after-care, and an open door." },
  ],
  testimonials: [
    { q: "I so appreciated your time! And after our call, I already got started on our new TikTok posting strategy. You’re a rock star!", who: "Stacy Flax · Founder, Bored Rebel" },
    { q: "Had an insightful and inspiring chat with Karen today. We talked about my marketing strategy, pivots to a new ideal client, and emerging trends. I highly recommend connecting with her if you’re looking to scale or pivot — her expertise in brand marketing and her kindness are off the charts!", who: "Sandra Kaye · Consulting client" },
  ],
  faq: [
    { q: "How do you decide who to take on?",        a: "I look at three things: a real product (or experience), a team that respects the long arc of brand work, and a calendar that lets the work breathe. I take on a maximum of four engagements at a time." },
    { q: "What does an engagement typically cost?",  a: "Project work begins at a five-figure retainer. Long-form editorial partnerships are scoped annually. Detailed ranges are in the media kit, and exact figures live in the proposal." },
    { q: "Can you work with us in-house?",           a: "Selectively — and always under a written scope. I can sit with a team for a week per month for the length of a season. I don’t take full-time roles." },
    { q: "Do you offer one-off consults?",           a: "Yes — a single three-hour working session, with a written brief in advance and a follow-up document. Limited slots most quarters." },
    { q: "What’s your minimum engagement length?",  a: "Six weeks for advisory, three months for strategy, twelve months for editorial partnerships. Shorter than that and the work doesn’t compound." },
    { q: "How does this work with my existing team?", a: "I write for your team, not over them. The end-of-engagement document is designed to be handed off and lived with after I’m gone." },
  ],
  cta: {
    headline: "Begin with a letter.",
    subhead: "Brief responses within five business days. The contact form leads to a written exchange — there are no booking links here, by design.",
  },
};

export const MEDIA_KIT_DEFAULTS: MediaKitContent = {
  sectionOrder: PAGE_SECTIONS["media-kit"].map((s) => s.id),
  hiddenSections: [],
  hero: {
    eyebrowLeft: "Media Kit · Updated May MMXXVI",
    eyebrowRight: "For press & partners",
    headline: "A small,",
    headlineItalic: "considered",
    headlineLine3: "audience",
    subhead: "Karen Alexandra is a luxury fashion e-commerce lead and lifestyle correspondent. Read by a quietly compounding audience that prefers fewer letters, deeper.",
  },
  bio: {
    eyebrow: "N° 01 — Bio, in brief",
    headline: "A decade in luxury commerce.\nAn ongoing correspondence on the rest.",
    bioText: "Karen Alexandra is the Head of E-commerce at Glent Shoes, an editorial correspondent for Four Seasons, and the editor of The Saturday Letter — a weekly dispatch on luxury fashion, considered travel, and the rituals that hold a beautiful life together.",
    basedValue: "New York · Côte d’Azur",
    languagesValue: "EN · FR · IT",
    workingWithValue: "Houses, hotels, atéliers.",
    portraitUrl: "https://5xkq5mmr.us-east.insforge.app/api/storage/buckets/blog-images/objects/site%2FIMG_4534.jpg",
  },
  reach: [
    { v: "248K",  l: "Substack & email" },
    { v: "186K",  l: "Instagram · @karenalex" },
    { v: "94K",   l: "YouTube · The Reel" },
    { v: "12.4M", l: "Monthly impressions" },
  ],
  audienceHeadline: "Read by women who research before they buy.",
  audienceNote: "A first-party survey of 2,400 subscribers, conducted Q1 MMXXVI.",
  demo: [
    { label: "Women, 28–45",      pct: 78 },
    { label: "US · UK · EU",      pct: 84 },
    { label: "Avg. HHI > $180K",  pct: 71 },
    { label: "Returning readers",  pct: 62 },
  ],
  partners: ["FOUR SEASONS", "AMAN", "LOEWE", "MYTHERESA", "DIOR", "AESOP", "LE LABO", "JACQUEMUS", "BERGDORF", "HERMÈS", "GLENT SHOES", "THE ROW", "GOOP", "NET-A-PORTER", "MARGIELA"],
  press: [
    { p: "Vogue Business",       q: "Rewriting the playbook for independent luxury labels.",                  d: "Apr 2026" },
    { p: "Business of Fashion",  q: "The editor brands actually want to be read by.",                         d: "Feb 2026" },
    { p: "Condé Nast Traveler",  q: "On the rituals of arrival, and the case for the courtyard room.",        d: "Jan 2026" },
    { p: "Harper’s Bazaar",      q: "The slow wardrobe finds its most articulate voice.",                     d: "Nov 2025" },
  ],
  testimonials: [
    { q: "Karen provides feel good content from all over the spectrum — whether it’s a business hack, mindset tip, travel inspiration, or design. She knows how to capture an audience by being raw and providing insight we all love to hear.", who: "@alexmcguire · Community member" },
    { q: "She shows up all the time and I can really relate to what she’s going through and the adventures she’s choosing. She is not acting for the camera — she’s really sharing her journey.", who: "@elizabethmanette · Community member" },
    { q: "She has a ‘real girl in the real world’ vibe, hustling to bring her dreams to fruition in true, understandable and attainable ways.", who: "@deannanfox · Community member" },
  ],
  instagram: { handle: "@karenalexandra", followers: "186K followers", engagement: "9.2% avg. engagement" },
  ctaSubhead: "Twenty-page PDF with audience demographics, partnership formats, sample deliverables, and rate ranges. Updated quarterly.",
};

export const FOOTER_DEFAULTS: FooterContent = {
  tagline: "The art of well — stories from a life lived in cashmere, on marble lobbies, and at the front row.",
  columns: [
    {
      title: "Explore",
      links: [
        { label: "Home",          href: "/" },
        { label: "The Edit",      href: "/journal" },
        { label: "Fashion News",  href: "/fashion-news" },
        { label: "On Film",       href: "/watch" },
        { label: "About",         href: "/about" },
      ],
    },
    {
      title: "Work",
      links: [
        { label: "Portfolio",    href: "/portfolio" },
        { label: "Media Kit",    href: "/media-kit" },
        { label: "Services",     href: "/services" },
        { label: "Case Studies", href: "/case-studies" },
        { label: "Contact",      href: "/contact" },
      ],
    },
    {
      title: "Categories",
      links: [
        { label: "Fashion",   href: "/journal?category=fashion" },
        { label: "Travel",    href: "/journal?category=travel" },
        { label: "Wellness",  href: "/journal?category=wellness" },
        { label: "Lifestyle", href: "/journal?category=lifestyle" },
      ],
    },
    {
      title: "Elsewhere",
      links: [
        { label: "YouTube",   href: "https://www.youtube.com/@KarenAlexandra",          external: true },
        { label: "Pinterest", href: "https://www.pinterest.com/karenalexandra__/",       external: true },
        { label: "LinkedIn",  href: "https://www.linkedin.com/in/karenalexandrac",       external: true },
      ],
    },
  ],
  bottomLinks: [
    { label: "Privacy",    href: "/privacy" },
    { label: "Press",      href: "/contact" },
    { label: "Inquiries",  href: "/contact" },
  ],
};

export const MENU_DEFAULTS: MenuContent = {
  leftLinks: [
    { label: "The Edit",      href: "/journal" },
    { label: "Fashion News",  href: "/fashion-news" },
    { label: "On Film",       href: "/watch" },
  ],
  rightLinks: [
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

export const getFooterContent    = () => fetchPageContent<FooterContent>("footer", FOOTER_DEFAULTS);
export const getHomeContent      = () => fetchPageContent<HomeContent>("home", HOME_DEFAULTS);
export const getPortfolioContent = () => fetchPageContent<PortfolioContent>("portfolio", PORTFOLIO_DEFAULTS);
export const getContactContent   = () => fetchPageContent<ContactContent>("contact", CONTACT_DEFAULTS);
export const getWatchContent     = () => fetchPageContent<WatchContent>("watch", WATCH_DEFAULTS);
export const getJournalContent   = () => fetchPageContent<JournalContent>("journal", JOURNAL_DEFAULTS);
export const getAboutContent     = () => fetchPageContent<AboutContent>("about", ABOUT_DEFAULTS);
export const getServicesContent  = () => fetchPageContent<ServicesContent>("services", SERVICES_DEFAULTS);
export const getMediaKitContent  = () => fetchPageContent<MediaKitContent>("media-kit", MEDIA_KIT_DEFAULTS);
export async function getMenuContent(): Promise<MenuContent> {
  const stored = await fetchPageContent<MenuContent>("menu", MENU_DEFAULTS);
  // If DB has stale arrays that are missing new default links, merge them in
  const storedLeft  = new Set(stored.leftLinks.map((l) => l.href));
  const storedRight = new Set(stored.rightLinks.map((l) => l.href));
  return {
    leftLinks:  [...stored.leftLinks,  ...MENU_DEFAULTS.leftLinks.filter( (l) => !storedLeft.has(l.href))],
    rightLinks: [...stored.rightLinks, ...MENU_DEFAULTS.rightLinks.filter((l) => !storedRight.has(l.href))],
  };
}

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

export const PAGE_KEYS = ["home", "portfolio", "journal", "contact", "watch", "about", "services", "media-kit"] as const;
export type PageKey = (typeof PAGE_KEYS)[number];

export const PAGE_LABELS: Record<PageKey, string> = {
  home:        "Home",
  portfolio:   "Portfolio",
  journal:     "Journal (The Edit)",
  contact:     "Contact",
  watch:       "Watch",
  about:       "About",
  services:    "Services",
  "media-kit": "Media Kit",
};
