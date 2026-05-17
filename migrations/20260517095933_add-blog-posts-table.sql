-- Blog posts (separate from case studies in the `posts` table)
CREATE TABLE IF NOT EXISTS blog_posts (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         text        UNIQUE NOT NULL,
  title        text        NOT NULL,
  date         date        NOT NULL,
  category     text        NOT NULL CHECK (category IN ('fashion','lifestyle','travel','wellness')),
  hero_image   text        NOT NULL DEFAULT '',
  hero_alt     text        NOT NULL DEFAULT '',
  excerpt      text        NOT NULL DEFAULT '',
  body         text        NOT NULL DEFAULT '',
  published    boolean     NOT NULL DEFAULT true,
  featured     boolean     NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION set_blog_posts_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION set_blog_posts_updated_at();

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "blog_public_read"
  ON blog_posts FOR SELECT
  USING (published = true);

CREATE POLICY "blog_service_all"
  ON blog_posts FOR ALL
  USING (true)
  WITH CHECK (true);
