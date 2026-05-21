-- Replace GBP prices with EUR in body (ordered largest→smallest to avoid partial matches)
UPDATE blog_posts SET
  body = replace(replace(replace(replace(replace(replace(
    body,
    '£750', '€850'),
    '£600', '€680'),
    '£430', '€500'),
    '£400', '€450'),
    '£170', '€200'),
    '£140', '€160'),
  faq_items = faq_items::text::jsonb  -- trigger re-cast; actual FAQ price text replaced below
WHERE slug = 'dior-haute-wellness-luxury-fashion-wellness';

-- Patch the FAQ answer that mentions prices
UPDATE blog_posts SET
  faq_items = (
    SELECT jsonb_agg(
      CASE
        WHEN item->>'question' ILIKE '%where can%buy%'
        THEN jsonb_set(item, '{answer}',
          to_jsonb('The Haute Wellness Dior collection is available at select Dior boutiques worldwide, on dior.com, and at Dior spas and partner hotels globally from May 2026. Prices range from €160 for the yoga block to €850 for the yoga mat.'::text))
        ELSE item
      END
    )
    FROM jsonb_array_elements(faq_items) AS item
  )
WHERE slug = 'dior-haute-wellness-luxury-fashion-wellness';
