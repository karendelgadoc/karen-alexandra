-- SEO + GEO fields for blog posts
-- All nullable so existing rows keep working. UI falls back to defaults.

alter table blog_posts add column if not exists seo_title         text;
alter table blog_posts add column if not exists seo_description   text;
alter table blog_posts add column if not exists focus_keyword     text;
alter table blog_posts add column if not exists og_image          text;
alter table blog_posts add column if not exists canonical_url     text;
alter table blog_posts add column if not exists noindex           boolean not null default false;

-- GEO (generative-engine optimization) fields
alter table blog_posts add column if not exists key_takeaway      text;
alter table blog_posts add column if not exists faq_items         jsonb not null default '[]'::jsonb;
alter table blog_posts add column if not exists author_name       text;
alter table blog_posts add column if not exists author_bio        text;
