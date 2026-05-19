CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_key TEXT,
  url TEXT NOT NULL,
  filename TEXT NOT NULL,
  title TEXT,
  alt_text TEXT,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  location TEXT,
  photographer TEXT,
  width INTEGER,
  height INTEGER,
  source TEXT NOT NULL DEFAULT 'library',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS photos_source_idx ON photos(source);
CREATE INDEX IF NOT EXISTS photos_created_at_idx ON photos(created_at DESC);

CREATE OR REPLACE FUNCTION update_photos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS photos_updated_at ON photos;
CREATE TRIGGER photos_updated_at
  BEFORE UPDATE ON photos
  FOR EACH ROW EXECUTE FUNCTION update_photos_updated_at();
