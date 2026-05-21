UPDATE blog_posts SET
  body = replace(
    body,
    'text="The sculptural Pilates ring — €680. The same couture instinct applied to a new surface."]',
    'text="The sculptural Pilates ring — €680. The same couture instinct applied to a new surface." caption="Image: © Christian Dior Couture, via Business Today Malaysia"]'
  )
WHERE slug = 'dior-haute-wellness-luxury-fashion-wellness';
