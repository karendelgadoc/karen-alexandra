#!/bin/bash
# Upload raw photos from KA DESIGN folder to InsForge storage and seed the photos table
# Run from the project root: bash scripts/upload-raw-photos.sh

BUCKET="blog-images"
PREFIX="library"
UPLOADS_DIR="/Users/karen/Desktop/KA DESIGN/Karen Alexandra/uploads"
BASE_URL="https://5xkq5mmr.us-east.insforge.app/storage/v1/object/public/${BUCKET}/${PREFIX}"

echo "Uploading raw photos to InsForge storage..."

for filepath in "$UPLOADS_DIR"/*; do
  filename=$(basename "$filepath")
  ext="${filename##*.}"
  extlower=$(echo "$ext" | tr '[:upper:]' '[:lower:]')

  # Skip non-image files
  case "$extlower" in
    jpg|jpeg|png|webp|gif|avif) ;;
    *) echo "Skipping non-image: $filename"; continue ;;
  esac

  # Sanitize filename: lowercase, replace spaces with hyphens, normalize extension
  sanitized=$(echo "$filename" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g' | sed 's/\.jpeg$/.jpg/')
  key="${PREFIX}/${sanitized}"
  url="${BASE_URL}/${sanitized}"

  echo "  Uploading: $filename → $key"
  npx @insforge/cli storage upload "$filepath" --bucket "$BUCKET" --key "$key" 2>&1 | tail -1

  # Derive a human title from filename
  title=$(echo "$sanitized" | sed 's/\.[^.]*$//' | sed 's/[-_]/ /g' | sed 's/img //' | sed 's/\b\(.\)/\u\1/g')

  # Insert into DB
  npx @insforge/cli db query "
    INSERT INTO photos (storage_key, url, filename, title, source)
    VALUES ('$key', '$url', '$sanitized', '$title', 'library')
    ON CONFLICT (storage_key) DO NOTHING;
  " 2>&1 | grep -v "^$" | grep -v "No rows"
done

echo ""
echo "Done uploading raw photos."
