// Shared "journal entry" shape used by both /journal and the homepage's
// "From the Journal" preview: a local letter stored in InsForge
// (`blog_posts`) or a letter synced live from the Substack RSS feed
// (src/lib/substack.ts). Substack entries are never copied into the
// database — they're fetched fresh on every revalidation window, and their
// cards link straight out to Substack, the same way "On Film" cards link
// out to YouTube.

import { getAllBlogPosts } from "./blog-db";
import type { BlogPost } from "./blog-db";
import { getLatestSubstackPosts } from "./substack";
import type { SubstackPost } from "./substack";

export interface JournalEntry {
  key: string;
  href: string;
  external: boolean;
  title: string;
  date: string;
  category: string;
  heroImage: string;
  heroAlt: string;
  excerpt: string;
}

export function fromBlogPost(post: BlogPost): JournalEntry {
  return {
    key: `local-${post.slug}`,
    href: `/journal/${post.slug}`,
    external: false,
    title: post.title,
    date: post.date,
    category: post.category,
    heroImage: post.heroImage,
    heroAlt: post.heroAlt,
    excerpt: post.excerpt,
  };
}

export function fromSubstackPost(post: SubstackPost): JournalEntry {
  return {
    key: `substack-${post.slug}`,
    href: post.url,
    external: true,
    title: post.title,
    date: post.date,
    category: post.category,
    heroImage: post.heroImage,
    heroAlt: post.heroAlt,
    excerpt: post.excerpt,
  };
}

// The latest entries across both sources, newest first — local letters and
// synced Substack posts merged into one feed. Backs the homepage's "From
// the Journal" preview (top 3) and, filtered/sorted further, /journal's
// own collage.
export async function getLatestJournalEntries(limit: number): Promise<JournalEntry[]> {
  const [localPosts, substackPosts] = await Promise.all([
    getAllBlogPosts().catch(() => []),
    getLatestSubstackPosts(limit).catch(() => []),
  ]);
  return [...localPosts.map(fromBlogPost), ...substackPosts.map(fromSubstackPost)]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}
