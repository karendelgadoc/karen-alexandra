import { getServerClient } from "./insforge";
import { Post, Section } from "./posts";

// DB row type (snake_case from Postgres)
interface DbPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  hero_image: string;
  hero_alt: string;
  excerpt: string;
  sections: Section[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminPost extends Post {
  id: string;
  published: boolean;
}

function toPost(row: DbPost): Post {
  return {
    slug: row.slug,
    title: row.title,
    date: row.date,
    category: row.category,
    heroImage: row.hero_image,
    heroAlt: row.hero_alt,
    excerpt: row.excerpt,
    sections: row.sections,
  };
}

function toAdminPost(row: DbPost): AdminPost {
  return { ...toPost(row), id: row.id, published: row.published };
}

// Public: only published posts, sorted by date desc
export async function getAllPosts(): Promise<Post[]> {
  const db = getServerClient();
  const { data, error } = await db.database
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("date", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as DbPost[]).map(toPost);
}

// Admin: all posts (published + drafts), sorted by date desc
export async function getAllPostsAdmin(): Promise<AdminPost[]> {
  const db = getServerClient();
  const { data, error } = await db.database
    .from("posts")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as DbPost[]).map(toAdminPost);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const db = getServerClient();
  const { data, error } = await db.database
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true);

  if (error) throw new Error(error.message);
  const rows = data as DbPost[];
  return rows.length > 0 ? toPost(rows[0]) : null;
}

export async function getPostById(id: string): Promise<AdminPost | null> {
  const db = getServerClient();
  const { data, error } = await db.database
    .from("posts")
    .select("*")
    .eq("id", id);

  if (error) throw new Error(error.message);
  const rows = data as DbPost[];
  return rows.length > 0 ? toAdminPost(rows[0]) : null;
}

export interface PostInput {
  slug: string;
  title: string;
  date: string;
  category: string;
  heroImage: string;
  heroAlt: string;
  excerpt: string;
  sections: Section[];
  published?: boolean;
}

function toDbRow(input: PostInput) {
  return {
    slug: input.slug,
    title: input.title,
    date: input.date,
    category: input.category,
    hero_image: input.heroImage,
    hero_alt: input.heroAlt,
    excerpt: input.excerpt,
    sections: input.sections,
    published: input.published ?? true,
  };
}

export async function createPost(input: PostInput): Promise<AdminPost> {
  const db = getServerClient();
  const { data, error } = await db.database
    .from("posts")
    .insert(toDbRow(input))
    .select();

  if (error) throw new Error(error.message);
  return toAdminPost((data as DbPost[])[0]);
}

export async function updatePost(
  id: string,
  input: Partial<PostInput>
): Promise<AdminPost> {
  const db = getServerClient();
  const updates: Partial<ReturnType<typeof toDbRow>> = {};
  if (input.slug !== undefined) updates.slug = input.slug;
  if (input.title !== undefined) updates.title = input.title;
  if (input.date !== undefined) updates.date = input.date;
  if (input.category !== undefined) updates.category = input.category;
  if (input.heroImage !== undefined) updates.hero_image = input.heroImage;
  if (input.heroAlt !== undefined) updates.hero_alt = input.heroAlt;
  if (input.excerpt !== undefined) updates.excerpt = input.excerpt;
  if (input.sections !== undefined) updates.sections = input.sections;
  if (input.published !== undefined) updates.published = input.published;

  const { data, error } = await db.database
    .from("posts")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw new Error(error.message);
  return toAdminPost((data as DbPost[])[0]);
}

export async function deletePost(id: string): Promise<void> {
  const db = getServerClient();
  const { error } = await db.database.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// Get all slugs — used for generateStaticParams
export async function getAllSlugs(): Promise<string[]> {
  const db = getServerClient();
  const { data, error } = await db.database
    .from("posts")
    .select("slug")
    .eq("published", true);

  if (error) return [];
  return (data as { slug: string }[]).map((r) => r.slug);
}
