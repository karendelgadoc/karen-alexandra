import { getServerClient } from "./insforge";

export type BlogCategory = "fashion" | "lifestyle" | "travel" | "wellness" | "fashion-news";

export interface FaqItem { question: string; answer: string; }

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: BlogCategory;
  heroImage: string;
  heroAlt: string;
  excerpt: string;
  body: string;
  published: boolean;
  featured: boolean;
  // SEO
  seoTitle: string | null;
  seoDescription: string | null;
  focusKeyword: string | null;
  ogImage: string | null;
  canonicalUrl: string | null;
  noindex: boolean;
  // GEO
  keyTakeaway: string | null;
  faqItems: FaqItem[];
  authorName: string | null;
  authorBio: string | null;
}

interface DbBlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: BlogCategory;
  hero_image: string;
  hero_alt: string;
  excerpt: string;
  body: string;
  published: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
  seo_title?: string | null;
  seo_description?: string | null;
  focus_keyword?: string | null;
  og_image?: string | null;
  canonical_url?: string | null;
  noindex?: boolean | null;
  key_takeaway?: string | null;
  faq_items?: FaqItem[] | null;
  author_name?: string | null;
  author_bio?: string | null;
}

function toPost(row: DbBlogPost): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    date: row.date,
    category: row.category,
    heroImage: row.hero_image,
    heroAlt: row.hero_alt,
    excerpt: row.excerpt,
    body: row.body,
    published: row.published,
    featured: row.featured,
    seoTitle:       row.seo_title       ?? null,
    seoDescription: row.seo_description ?? null,
    focusKeyword:   row.focus_keyword   ?? null,
    ogImage:        row.og_image        ?? null,
    canonicalUrl:   row.canonical_url   ?? null,
    noindex:        row.noindex         ?? false,
    keyTakeaway:    row.key_takeaway    ?? null,
    faqItems:       Array.isArray(row.faq_items) ? row.faq_items : [],
    authorName:     row.author_name     ?? null,
    authorBio:      row.author_bio      ?? null,
  };
}

export async function getAllBlogPosts(category?: BlogCategory): Promise<BlogPost[]> {
  const db = getServerClient();
  let query = db.database
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .neq("category", "fashion-news")
    .order("date", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data as DbBlogPost[]).map(toPost);
}

export async function getFeaturedBlogPosts(limit = 3): Promise<BlogPost[]> {
  const db = getServerClient();
  const { data, error } = await db.database
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .eq("featured", true)
    .order("date", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  const rows = data as DbBlogPost[];
  // Fall back to latest posts if fewer than limit are marked featured
  if (rows.length < limit) {
    return getAllBlogPosts().then((all) => all.slice(0, limit));
  }
  return rows.map(toPost);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const db = getServerClient();
  const { data, error } = await db.database
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .neq("category", "fashion-news");

  if (error) throw new Error(error.message);
  const rows = data as DbBlogPost[];
  return rows.length > 0 ? toPost(rows[0]) : null;
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const db = getServerClient();
  const { data, error } = await db.database
    .from("blog_posts")
    .select("slug")
    .eq("published", true)
    .neq("category", "fashion-news");

  if (error) return [];
  return (data as { slug: string }[]).map((r) => r.slug);
}

// Admin

export async function getAllBlogPostsAdmin(): Promise<BlogPost[]> {
  const db = getServerClient();
  const { data, error } = await db.database
    .from("blog_posts")
    .select("*")
    .neq("category", "fashion-news")
    .order("date", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as DbBlogPost[]).map(toPost);
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const db = getServerClient();
  const { data, error } = await db.database
    .from("blog_posts")
    .select("*")
    .eq("id", id);

  if (error) throw new Error(error.message);
  const rows = data as DbBlogPost[];
  return rows.length > 0 ? toPost(rows[0]) : null;
}

export interface BlogPostInput {
  slug: string;
  title: string;
  date: string;
  category: BlogCategory;
  heroImage: string;
  heroAlt: string;
  excerpt: string;
  body: string;
  published?: boolean;
  featured?: boolean;
  // SEO
  seoTitle?: string | null;
  seoDescription?: string | null;
  focusKeyword?: string | null;
  ogImage?: string | null;
  canonicalUrl?: string | null;
  noindex?: boolean;
  // GEO
  keyTakeaway?: string | null;
  faqItems?: FaqItem[];
  authorName?: string | null;
  authorBio?: string | null;
}

function toDbRow(input: BlogPostInput) {
  return {
    slug: input.slug,
    title: input.title,
    date: input.date,
    category: input.category,
    hero_image: input.heroImage,
    hero_alt: input.heroAlt,
    excerpt: input.excerpt,
    body: input.body,
    published: input.published ?? true,
    featured: input.featured ?? false,
    seo_title:       input.seoTitle       ?? null,
    seo_description: input.seoDescription ?? null,
    focus_keyword:   input.focusKeyword   ?? null,
    og_image:        input.ogImage        ?? null,
    canonical_url:   input.canonicalUrl   ?? null,
    noindex:         input.noindex        ?? false,
    key_takeaway:    input.keyTakeaway    ?? null,
    faq_items:       input.faqItems       ?? [],
    author_name:     input.authorName     ?? null,
    author_bio:      input.authorBio      ?? null,
  };
}

export async function createBlogPost(input: BlogPostInput): Promise<BlogPost> {
  const db = getServerClient();
  const { data, error } = await db.database
    .from("blog_posts")
    .insert(toDbRow(input))
    .select();

  if (error) throw new Error(error.message);
  return toPost((data as DbBlogPost[])[0]);
}

export async function updateBlogPost(id: string, input: Partial<BlogPostInput>): Promise<BlogPost> {
  const db = getServerClient();
  const updates: Partial<ReturnType<typeof toDbRow>> = {};
  if (input.slug !== undefined) updates.slug = input.slug;
  if (input.title !== undefined) updates.title = input.title;
  if (input.date !== undefined) updates.date = input.date;
  if (input.category !== undefined) updates.category = input.category;
  if (input.heroImage !== undefined) updates.hero_image = input.heroImage;
  if (input.heroAlt !== undefined) updates.hero_alt = input.heroAlt;
  if (input.excerpt !== undefined) updates.excerpt = input.excerpt;
  if (input.body !== undefined) updates.body = input.body;
  if (input.published !== undefined) updates.published = input.published;
  if (input.featured !== undefined) updates.featured = input.featured;
  if (input.seoTitle !== undefined)        updates.seo_title       = input.seoTitle;
  if (input.seoDescription !== undefined)  updates.seo_description = input.seoDescription;
  if (input.focusKeyword !== undefined)    updates.focus_keyword   = input.focusKeyword;
  if (input.ogImage !== undefined)         updates.og_image        = input.ogImage;
  if (input.canonicalUrl !== undefined)    updates.canonical_url   = input.canonicalUrl;
  if (input.noindex !== undefined)         updates.noindex         = input.noindex;
  if (input.keyTakeaway !== undefined)     updates.key_takeaway    = input.keyTakeaway;
  if (input.faqItems !== undefined)        updates.faq_items       = input.faqItems;
  if (input.authorName !== undefined)      updates.author_name     = input.authorName;
  if (input.authorBio !== undefined)       updates.author_bio      = input.authorBio;

  const { data, error } = await db.database
    .from("blog_posts")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw new Error(error.message);
  const rows = data as DbBlogPost[] | null;
  if (rows && rows.length > 0) return toPost(rows[0]);

  // PostgREST returned no rows — re-fetch to confirm the update landed
  const refetched = await getBlogPostById(id);
  if (!refetched) throw new Error("Post not found after update");
  return refetched;
}

export async function deleteBlogPost(id: string): Promise<void> {
  const db = getServerClient();
  const { error } = await db.database.from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ── Fashion News ──────────────────────────────────────────────────────────────
// Fashion news articles live in the same blog_posts table with category="fashion-news".
// They are excluded from all regular blog/journal queries above.

export async function getAllFashionNewsAdmin(): Promise<BlogPost[]> {
  const db = getServerClient();
  const { data, error } = await db.database
    .from("blog_posts")
    .select("*")
    .eq("category", "fashion-news")
    .order("date", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as DbBlogPost[]).map(toPost);
}

export async function getAllFashionNewsPosts(): Promise<BlogPost[]> {
  const db = getServerClient();
  const { data, error } = await db.database
    .from("blog_posts")
    .select("*")
    .eq("category", "fashion-news")
    .eq("published", true)
    .order("date", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as DbBlogPost[]).map(toPost);
}

export async function getLatestFashionNewsPost(): Promise<BlogPost | null> {
  const db = getServerClient();
  const { data, error } = await db.database
    .from("blog_posts")
    .select("*")
    .eq("category", "fashion-news")
    .eq("published", true)
    .order("date", { ascending: false })
    .limit(1);
  if (error) return null;
  const rows = data as DbBlogPost[];
  return rows.length > 0 ? toPost(rows[0]) : null;
}

export async function getFashionNewsPostBySlug(slug: string): Promise<BlogPost | null> {
  const db = getServerClient();
  const { data, error } = await db.database
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("category", "fashion-news")
    .eq("published", true);
  if (error) throw new Error(error.message);
  const rows = data as DbBlogPost[];
  return rows.length > 0 ? toPost(rows[0]) : null;
}

export async function getAllFashionNewsSlugs(): Promise<string[]> {
  const db = getServerClient();
  const { data, error } = await db.database
    .from("blog_posts")
    .select("slug")
    .eq("category", "fashion-news")
    .eq("published", true);
  if (error) return [];
  return (data as { slug: string }[]).map((r) => r.slug);
}

export async function getFashionNewsPostById(id: string): Promise<BlogPost | null> {
  const db = getServerClient();
  const { data, error } = await db.database
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .eq("category", "fashion-news");
  if (error) throw new Error(error.message);
  const rows = data as DbBlogPost[];
  return rows.length > 0 ? toPost(rows[0]) : null;
}
