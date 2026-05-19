/**
 * Yoast-style SEO + GEO analyzer.
 * Pure functions — given a blog post input, return a list of checks.
 *
 * SEO = traditional search engines (Google, Bing).
 * GEO = generative engines (ChatGPT, Perplexity, Claude, Google AI Overviews).
 */

import type { BlogPostInput, FaqItem } from "./blog-db";

export type CheckStatus = "good" | "ok" | "bad";

export interface Check {
  id: string;
  label: string;
  status: CheckStatus;
  message: string;
  group: "seo" | "geo" | "readability";
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function countWords(s: string): number {
  return (s.match(/\b[\p{L}\p{N}'-]+\b/gu) ?? []).length;
}

function countSentences(s: string): number {
  return (s.match(/[.!?]+\s|[.!?]+$/g) ?? []).length || 1;
}

function avgWordsPerSentence(s: string): number {
  const w = countWords(s);
  const sents = countSentences(s);
  return sents === 0 ? 0 : w / sents;
}

function flesch(s: string): number {
  // Flesch Reading Ease. ~60-70 = plain English. Higher = easier.
  const words = countWords(s);
  if (words === 0) return 0;
  const sentences = countSentences(s);
  const syllables = (s.toLowerCase().match(/[aeiouy]+/g) ?? []).length;
  return 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
}

function lc(s: string | null | undefined): string {
  return (s ?? "").toLowerCase();
}

function containsKeyword(haystack: string, kw: string): boolean {
  if (!kw.trim()) return false;
  return lc(haystack).includes(lc(kw));
}

function countLinks(body: string): { internal: number; external: number } {
  // crude — counts URLs in the body
  const urls = body.match(/https?:\/\/[^\s)]+/g) ?? [];
  let internal = 0, external = 0;
  for (const u of urls) {
    if (u.includes("karenalexandra.com")) internal++;
    else external++;
  }
  // also count markdown-style links
  const mdLinks = body.match(/\[[^\]]+\]\(([^)]+)\)/g) ?? [];
  for (const m of mdLinks) {
    if (m.includes("karenalexandra.com") || (m.includes("](/") && !m.includes("http"))) internal++;
    else external++;
  }
  return { internal, external };
}

function countHeadings(body: string): number {
  return (body.match(/^#{1,6}\s/gm) ?? []).length;
}

// ── Main analyzer ────────────────────────────────────────────────────────────

export function analyzePost(p: BlogPostInput): Check[] {
  const checks: Check[] = [];
  const focus = p.focusKeyword ?? "";
  const title = p.seoTitle?.trim() || p.title;
  const description = p.seoDescription?.trim() || p.excerpt;
  const body = p.body ?? "";
  const wordCount = countWords(body);
  const faqs = p.faqItems ?? [];

  // ── SEO checks ─────────────────────────────────────────────────────────────

  // Focus keyword set?
  if (!focus.trim()) {
    checks.push({ id: "focus-kw", label: "Focus keyword", status: "bad",
      message: "Set a focus keyword — what people would search to find this post.", group: "seo" });
  } else {
    checks.push({ id: "focus-kw", label: "Focus keyword set", status: "good",
      message: `Targeting "${focus}".`, group: "seo" });
  }

  // SEO title length
  const titleLen = title.length;
  if (!title.trim()) {
    checks.push({ id: "title", label: "SEO title", status: "bad", message: "Title is empty.", group: "seo" });
  } else if (titleLen < 30) {
    checks.push({ id: "title", label: "SEO title length", status: "ok",
      message: `${titleLen} chars — try 50–60 for best results.`, group: "seo" });
  } else if (titleLen > 60) {
    checks.push({ id: "title", label: "SEO title length", status: "ok",
      message: `${titleLen} chars — Google may truncate after ~60.`, group: "seo" });
  } else {
    checks.push({ id: "title", label: "SEO title length", status: "good",
      message: `${titleLen} chars — perfect.`, group: "seo" });
  }

  // Focus keyword in title
  if (focus.trim()) {
    if (containsKeyword(title, focus)) {
      checks.push({ id: "kw-title", label: "Keyword in title", status: "good",
        message: "Focus keyword appears in the title.", group: "seo" });
    } else {
      checks.push({ id: "kw-title", label: "Keyword in title", status: "bad",
        message: "Add the focus keyword to your title.", group: "seo" });
    }
  }

  // Meta description length
  const descLen = description.length;
  if (!description.trim()) {
    checks.push({ id: "desc", label: "Meta description", status: "bad",
      message: "Add a meta description (or excerpt) — this is what appears in search results.", group: "seo" });
  } else if (descLen < 120) {
    checks.push({ id: "desc", label: "Description length", status: "ok",
      message: `${descLen} chars — aim for 140–160.`, group: "seo" });
  } else if (descLen > 160) {
    checks.push({ id: "desc", label: "Description length", status: "ok",
      message: `${descLen} chars — Google truncates after ~160.`, group: "seo" });
  } else {
    checks.push({ id: "desc", label: "Description length", status: "good",
      message: `${descLen} chars — perfect.`, group: "seo" });
  }

  // Keyword in description
  if (focus.trim() && description.trim()) {
    if (containsKeyword(description, focus)) {
      checks.push({ id: "kw-desc", label: "Keyword in description", status: "good",
        message: "Focus keyword appears in the meta description.", group: "seo" });
    } else {
      checks.push({ id: "kw-desc", label: "Keyword in description", status: "ok",
        message: "Add the focus keyword to the description for better relevance.", group: "seo" });
    }
  }

  // Slug
  if (!p.slug.trim()) {
    checks.push({ id: "slug", label: "URL slug", status: "bad", message: "Slug is empty.", group: "seo" });
  } else if (focus.trim() && !lc(p.slug).split("-").join(" ").includes(lc(focus))) {
    checks.push({ id: "slug-kw", label: "Keyword in slug", status: "ok",
      message: "Add the focus keyword to the URL slug — short and lowercase.", group: "seo" });
  } else if (p.slug.length > 75) {
    checks.push({ id: "slug-len", label: "Slug length", status: "ok",
      message: `${p.slug.length} chars — keep slugs under 75 chars.`, group: "seo" });
  } else {
    checks.push({ id: "slug", label: "URL slug", status: "good", message: `/${p.slug}`, group: "seo" });
  }

  // Hero image alt
  if (!p.heroImage?.trim()) {
    checks.push({ id: "img", label: "Hero image", status: "ok",
      message: "No hero image — social shares may look bland.", group: "seo" });
  } else if (!p.heroAlt?.trim()) {
    checks.push({ id: "alt", label: "Image alt text", status: "bad",
      message: "Add alt text to the hero image — required for accessibility & SEO.", group: "seo" });
  } else if (focus.trim() && !containsKeyword(p.heroAlt, focus)) {
    checks.push({ id: "alt-kw", label: "Keyword in alt text", status: "ok",
      message: "Try working the focus keyword into the hero alt text.", group: "seo" });
  } else {
    checks.push({ id: "alt", label: "Image alt text", status: "good",
      message: "Hero image has descriptive alt text.", group: "seo" });
  }

  // Body length
  if (wordCount === 0) {
    checks.push({ id: "body", label: "Article body", status: "bad", message: "Body is empty.", group: "seo" });
  } else if (wordCount < 300) {
    checks.push({ id: "body-len", label: "Article length", status: "ok",
      message: `${wordCount} words — aim for 600+ for ranking power.`, group: "seo" });
  } else {
    checks.push({ id: "body-len", label: "Article length", status: "good",
      message: `${wordCount} words.`, group: "seo" });
  }

  // Keyword in first paragraph
  if (focus.trim() && body) {
    const firstPara = body.split(/\n\n+/)[0] ?? "";
    if (containsKeyword(firstPara, focus)) {
      checks.push({ id: "kw-intro", label: "Keyword in intro", status: "good",
        message: "Focus keyword appears in the first paragraph.", group: "seo" });
    } else {
      checks.push({ id: "kw-intro", label: "Keyword in intro", status: "ok",
        message: "Mention the focus keyword in the first paragraph.", group: "seo" });
    }
  }

  // Keyword density
  if (focus.trim() && wordCount > 50) {
    const matches = lc(body).split(lc(focus)).length - 1;
    const density = (matches / wordCount) * 100;
    if (density < 0.3) {
      checks.push({ id: "kw-density", label: "Keyword density", status: "ok",
        message: `Keyword used ${matches}× (${density.toFixed(1)}%) — aim for 0.5–2%.`, group: "seo" });
    } else if (density > 3) {
      checks.push({ id: "kw-density", label: "Keyword density", status: "ok",
        message: `Keyword used ${matches}× (${density.toFixed(1)}%) — sounds spammy. Reduce.`, group: "seo" });
    } else {
      checks.push({ id: "kw-density", label: "Keyword density", status: "good",
        message: `Keyword used ${matches}× (${density.toFixed(1)}%).`, group: "seo" });
    }
  }

  // Internal links
  const { internal, external } = countLinks(body);
  if (wordCount > 300 && internal === 0) {
    checks.push({ id: "links-int", label: "Internal links", status: "ok",
      message: "Add a link to another post or page on your site.", group: "seo" });
  } else if (internal > 0) {
    checks.push({ id: "links-int", label: "Internal links", status: "good",
      message: `${internal} internal link${internal === 1 ? "" : "s"}.`, group: "seo" });
  }

  if (wordCount > 600 && external === 0) {
    checks.push({ id: "links-ext", label: "Outbound links", status: "ok",
      message: "Cite an outside source to build trust (and helps GEO).", group: "seo" });
  } else if (external > 0) {
    checks.push({ id: "links-ext", label: "Outbound links", status: "good",
      message: `${external} outbound link${external === 1 ? "" : "s"} — good for credibility.`, group: "seo" });
  }

  // ── GEO checks ─────────────────────────────────────────────────────────────

  // Key takeaway / TL;DR — biggest GEO win. AI engines grab the direct answer.
  if (!p.keyTakeaway?.trim()) {
    checks.push({ id: "tldr", label: "Key takeaway (GEO)", status: "bad",
      message: "Add a 1–2 sentence TL;DR. AI search engines (ChatGPT, Perplexity) heavily favor direct answers.", group: "geo" });
  } else if (p.keyTakeaway.length < 40) {
    checks.push({ id: "tldr", label: "Key takeaway length", status: "ok",
      message: `${p.keyTakeaway.length} chars — aim for one full sentence (60–200 chars).`, group: "geo" });
  } else if (p.keyTakeaway.length > 300) {
    checks.push({ id: "tldr", label: "Key takeaway length", status: "ok",
      message: `${p.keyTakeaway.length} chars — keep it tight, AI engines extract the first sentence.`, group: "geo" });
  } else {
    checks.push({ id: "tldr", label: "Key takeaway (GEO)", status: "good",
      message: "Direct-answer block set — AI engines love this.", group: "geo" });
  }

  // FAQs — pure GEO gold
  if (faqs.length === 0) {
    checks.push({ id: "faq", label: "FAQ section (GEO)", status: "ok",
      message: "Add 2–5 Q&A pairs. AI search engines surface FAQ blocks directly.", group: "geo" });
  } else if (faqs.length < 2) {
    checks.push({ id: "faq", label: "FAQ section", status: "ok",
      message: `Only ${faqs.length} FAQ — add 1–2 more for a richer FAQPage schema.`, group: "geo" });
  } else {
    checks.push({ id: "faq", label: "FAQ section (GEO)", status: "good",
      message: `${faqs.length} Q&A pairs — perfect for AI surface.`, group: "geo" });
    // Check FAQ quality
    const badFaq = faqs.find((f: FaqItem) => !f.question?.trim() || !f.answer?.trim() || f.answer.length < 30);
    if (badFaq) {
      checks.push({ id: "faq-q", label: "FAQ quality", status: "ok",
        message: "One or more FAQs have empty or thin answers — aim for ≥40 chars.", group: "geo" });
    }
  }

  // Headings — structure helps AI parse
  const headings = countHeadings(body);
  if (wordCount > 600 && headings === 0) {
    checks.push({ id: "headings", label: "Headings (GEO)", status: "bad",
      message: "Long post with no headings. Use ## subheadings to break it up — AI parses these.", group: "geo" });
  } else if (headings > 0) {
    checks.push({ id: "headings", label: "Headings (GEO)", status: "good",
      message: `${headings} heading${headings === 1 ? "" : "s"}.`, group: "geo" });
  }

  // Author bio — E-E-A-T signal for both Google AND AI engines
  if (!p.authorName?.trim()) {
    checks.push({ id: "author", label: "Author name (E-E-A-T)", status: "ok",
      message: "Set the author name. Trust signals matter to both Google and AI engines.", group: "geo" });
  } else if (!p.authorBio?.trim()) {
    checks.push({ id: "author-bio", label: "Author bio (E-E-A-T)", status: "ok",
      message: "Add a 1–2 sentence author bio. Shows expertise to AI engines.", group: "geo" });
  } else {
    checks.push({ id: "author", label: "Author + bio (E-E-A-T)", status: "good",
      message: `Author bio set for ${p.authorName}.`, group: "geo" });
  }

  // ── Readability ────────────────────────────────────────────────────────────

  if (wordCount > 100) {
    const fk = flesch(body);
    if (fk < 50) {
      checks.push({ id: "read", label: "Reading ease", status: "ok",
        message: `Flesch ${fk.toFixed(0)}/100 — fairly difficult. Shorten sentences.`, group: "readability" });
    } else if (fk > 80) {
      checks.push({ id: "read", label: "Reading ease", status: "good",
        message: `Flesch ${fk.toFixed(0)}/100 — very easy to read.`, group: "readability" });
    } else {
      checks.push({ id: "read", label: "Reading ease", status: "good",
        message: `Flesch ${fk.toFixed(0)}/100 — solid.`, group: "readability" });
    }

    const awps = avgWordsPerSentence(body);
    if (awps > 25) {
      checks.push({ id: "sent-len", label: "Sentence length", status: "ok",
        message: `Avg ${awps.toFixed(0)} words/sentence — try shorter sentences.`, group: "readability" });
    } else {
      checks.push({ id: "sent-len", label: "Sentence length", status: "good",
        message: `Avg ${awps.toFixed(0)} words/sentence.`, group: "readability" });
    }
  }

  return checks;
}

// ── Overall score ────────────────────────────────────────────────────────────

export function overallScore(checks: Check[]): { score: number; grade: "A" | "B" | "C" | "D" | "F" } {
  if (checks.length === 0) return { score: 0, grade: "F" };
  let total = 0;
  for (const c of checks) {
    if (c.status === "good") total += 2;
    else if (c.status === "ok") total += 1;
  }
  const score = Math.round((total / (checks.length * 2)) * 100);
  let grade: "A" | "B" | "C" | "D" | "F";
  if (score >= 90) grade = "A";
  else if (score >= 75) grade = "B";
  else if (score >= 60) grade = "C";
  else if (score >= 40) grade = "D";
  else grade = "F";
  return { score, grade };
}
