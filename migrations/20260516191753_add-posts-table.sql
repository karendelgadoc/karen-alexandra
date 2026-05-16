CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  date date NOT NULL,
  category text NOT NULL,
  hero_image text NOT NULL,
  hero_alt text NOT NULL,
  excerpt text NOT NULL,
  sections jsonb NOT NULL DEFAULT '[]',
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Public can read published posts
CREATE POLICY "Public read published posts"
  ON posts FOR SELECT
  TO anon
  USING (published = true);

-- Authenticated users have full access
CREATE POLICY "Authenticated full access"
  ON posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Auto-update updated_at on row changes
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
