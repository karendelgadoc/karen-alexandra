import { getServerClient } from "./insforge";

export type BlogCategory = "fashion" | "lifestyle" | "travel" | "wellness";

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
  };
}

export async function getAllBlogPosts(category?: BlogCategory): Promise<BlogPost[]> {
  const db = getServerClient();
  let query = db.database
    .from("blog_posts")
    .select("*")
    .eq("published", true)
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
    .eq("published", true);

  if (error) throw new Error(error.message);
  const rows = data as DbBlogPost[];
  return rows.length > 0 ? toPost(rows[0]) : null;
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const db = getServerClient();
  const { data, error } = await db.database
    .from("blog_posts")
    .select("slug")
    .eq("published", true);

  if (error) return [];
  return (data as { slug: string }[]).map((r) => r.slug);
}

// Admin

export async function getAllBlogPostsAdmin(): Promise<BlogPost[]> {
  const db = getServerClient();
  const { data, error } = await db.database
    .from("blog_posts")
    .select("*")
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

  const { data, error } = await db.database
    .from("blog_posts")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw new Error(error.message);
  return toPost((data as DbBlogPost[])[0]);
}

export async function deleteBlogPost(id: string): Promise<void> {
  const db = getServerClient();
  const { error } = await db.database.from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
