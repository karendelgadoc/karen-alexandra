---
name: luxury-hotel-review
description: Use this skill when Karen wants to draft a new luxury hotel review blog post for karenalexandra.com — e.g. "write a hotel review for Aman Tokyo", "draft a journal post on my stay at Le Sirenuse", "blog post about [hotel name]". The skill enforces the editorial voice, required sections (history, rooms, wellness, food, things to do nearby), required interactive city map at the end, SEO + GEO field completeness, and the project's rich-block markdown syntax. Do NOT use for case studies (use the case-studies admin flow) or non-hotel travel essays.
---

# Luxury Hotel Review Skill

Karen Alexandra's hotel reviews live at `/journal/[slug]` (model: `blog_posts`, category: `travel`). The template was set by **Four Seasons Casa Medina, Bogotá** — every future hotel review should match that template's structure, depth, and tone, regardless of the hotel.

This skill is the contract for what "a Karen Alexandra hotel review" means.

## When you're invoked

1. Confirm the hotel + city with Karen if not already specified.
2. Ask which photos she has uploaded to `/admin/photos` (the photo library) — you'll need URLs. If none yet, write the post with `PHOTO_*` placeholder strings she can swap in later (see Casa Medina precedent).
3. Draft the post following the structure below.
4. Insert via `INSERT INTO blog_posts (...)` using the InsForge CLI (`npx @insforge/cli db query`), with `published = false` so she can review it in `/admin/blog/[id]/edit` before going live.
5. If the city doesn't yet have a `[!MAP-<CITY>]` component, **build the SVG map component** in `src/components/<City>Map.tsx` (model: `src/components/BogotaMap.tsx`) and wire a new `[!MAP-<CITY>]` block in `src/app/(public)/journal/[slug]/page.tsx`. Maps are mandatory — never publish a review without one.

## Editorial voice

- **Elevated but not stuffy.** Editorial, observant, slightly dry. Closer to *Condé Nast Traveler* essays than hotel-brochure copy. Karen is writing as a correspondent, not as a marketer.
- **First-person, but lightly.** Use "I stood there for longer than was probably polite" and "the kind of white linen that makes the morning difficult to leave" — embodied, specific, restrained.
- **Avoid PR-speak.** No "stunning," "breathtaking," "world-class," "luxurious amenities," "perfectly curated." If a brochure would say it, cut it.
- **British-leaning spelling** is fine where it fits ("metres," "recognised," "centre"). She lives in Madrid; the international register is part of the voice.
- **Concrete over abstract.** Name the architect. Name the year. Name the stone, the fabric, the dish, the neighbourhood. "Limestone and marble bathrooms with Loto del Sur toiletries" beats "luxurious bathrooms."
- **Restraint with adjectives.** One or two per noun, max. The detail does the work.

## Required structure

Every hotel review must have these sections in this order. Section headings are `##` (h2). Sub-emphasis via `[!HIGHLIGHT]`, `[!QUOTE]`, `[!RULE]` blocks.

1. **Lead image + opening section** — a hero `[!IMG]` block followed by a `##` heading like "A building that should not exist" (or whatever is the hotel's defining tension/story). Open with **why this hotel exists at all** — its origin, its building, its preservation history, its founder. Hotels are objects with histories; treat them that way. This section should run 2–3 paragraphs and feel like an essay opening, not a check-in summary.

2. **The rooms** — `## The rooms`. One full-width `[!GRID]` block (image right, text left) and one `[!GRID-LEFT]` block (image left, text right) showing two different room views. Describe materials, light, sleep quality, what is on the desk, what the linen feels like. End with a sentence on the city's particular atmospheric quirk (altitude, humidity, ocean air) and how the room handles it.

3. **Wellness** — *mandatory*, never skip. `## Wellness` or a contextual title ("The wellness hour", "Below ground", etc.). Spa, treatments, pool, hammam, gym, anything ritual. Use one `[!HIGHLIGHT label="..." text="..."]` block to spotlight the signature treatment or ritual, with treatment name, duration, what it actually does, and why it's tied to this place (local coffee, local salt, local herbs, local water).

4. **Food** — *mandatory*. `## Food` (or restaurant name as heading). Cover: the hotel's main restaurant, the bar, breakfast, and any standout in-room moment. Name the chef if notable, name dishes specifically, note the wine/spirit programme if relevant. One `[!IMG]` of food or interior. A second `[!HIGHLIGHT]` block can spotlight one dish or a tasting menu pairing.

5. **Beyond the hotel** — *mandatory*. `## Beyond the hotel` or `## The neighbourhood` or similar. 3–6 specific things to do in the destination that Karen would actually prioritise, with neighbourhood context. Examples: a museum + which floor to skip to; a coffee bar + what to order; a walk + the time of day; a market + the stall. Use `[!COLLAGE]` for a 3-image grid of the destination if photos exist. Each item is a short paragraph or bulleted under bolded sub-headings — be specific, no generic "Visit the cathedral" entries.

6. **A practical note** — `## A practical note` or `## The logistics`. 4–8 lines of practical detail: how to arrive (altitude warning, jet lag, ground transfer), best season, best room category, what to book in advance, dress code if any, dietary heads-up.

7. **The interactive map** — *mandatory, always last*. Insert the `[!MAP-<CITY>]` block. If no city map exists yet, build the component first (see "Maps" section below). The map shows the hotel pin + the 4–8 destination spots referenced in *Beyond the hotel*, each with a 1–2 sentence description.

8. **Closing line or `[!QUOTE]`** — one parting sentence. A `[!QUOTE]` block works well. Short, image-leaving, no summary.

## Rich block syntax (project-specific)

Renderer lives in `src/app/(public)/journal/[slug]/page.tsx`. Available blocks:

| Block | Use |
|-------|-----|
| `[!IMG src="..." alt="..." caption="..."]` | Single full-width image with caption |
| `[!GRID src="..." alt="..." text="..."]` | Image on **right**, text on left (vertical split) |
| `[!GRID-LEFT src="..." alt="..." text="..."]` | Image on **left**, text on right. **Order matters in renderer**: this is checked before `[!GRID` — never rename to `[!GRIDLEFT` |
| `[!HIGHLIGHT label="..." text="..."]` | Lilac/cream pull-quote with eyebrow label. Use for signature ritual / dish / experience |
| `[!QUOTE text="..."]` | Centered display-font pull-quote, no attribution |
| `[!RULE]` | Hairline horizontal rule for section breaks |
| `[!COLLAGE images="[{src,alt}, …]" caption="..."]` | 3-image asymmetric grid for destination/atmosphere shots |
| `[!MAP-<CITY>]` | Interactive city map with pins — see Maps section |

All `src` URLs must be full URLs from the photo library: `https://5xkq5mmr.us-east.insforge.app/api/storage/buckets/blog-images/objects/library%2F<file-key>`.

## Maps (the non-negotiable closer)

Every hotel review ends with an interactive map of the destination, pinned with the hotel + the 4–8 spots referenced in *Beyond the hotel*.

**Existing maps:**
- `BogotaMap` → `[!MAP-BOGOTA]` (model component at `src/components/BogotaMap.tsx`)

**Building a new city map** (when the destination is new):

1. Read `src/components/BogotaMap.tsx` start to finish — it's the reference.
2. Copy to `src/components/<City>Map.tsx`. Keep the **interactivity contract**: pan (pointer drag), zoom (wheel + pinch, 1×–4×), `+ / – / Reset` buttons, click-pin → popover, Escape to close, pulsing active-pin ring.
3. Replace the SVG layer with a hand-illustrated outline of the destination's recognisable shape (neighbourhood blocks, harbour, river, mountain ridge — whatever defines it visually). Cream / lilac palette to match the site (`var(--ka-bg)`, `var(--ka-accent-deep)`).
4. Define the `LOCATIONS` array: `{ id, name, subLabel, description, x, y }`. Each `description` is 1–2 short sentences — what it is, why it matters. The hotel goes first.
5. Wire the block in `src/app/(public)/journal/[slug]/page.tsx`: add a renderer branch for `[!MAP-<CITY>]` that imports `<City>Map`.
6. Verify locally before inserting it into the post body.

If Karen says "skip the map for now," push back once: the map is part of the deliverable. If she still says skip, leave a `<!-- TODO: insert [!MAP-<CITY>] block before publishing -->` comment at the bottom of the body and flag it in your summary.

## SEO + GEO field requirements

Every hotel review row in `blog_posts` must have **all** of these populated before `published = true`. The admin SEO panel scores them; aim for the green band.

| Field | Rule |
|-------|------|
| `slug` | `<hotel-name>-<city>` kebab-case, no "the/at/in" filler. `four-seasons-casa-medina-bogota`, `aman-tokyo`, `le-sirenuse-positano` |
| `title` | Editorial sentence with both the hotel name and the city. 50–70 chars. Casa Medina precedent: "A Retreat Within Bogota: Two Nights at The Four Seasons Casa Medina" |
| `category` | `"travel"` |
| `date` | ISO date of stay (`YYYY-MM-DD`) |
| `excerpt` | 2–3 sentences. The opening hook — usually the "tension" of the hotel's story. Used in OG preview and journal listing |
| `hero_image` | Full URL, **vertical 4:5 crop**. This image is also pulled into the homepage hero feature slot — landscape will look wrong. Upload a vertical option to `/admin/photos` if needed |
| `hero_alt` | Specific, descriptive, mentions the hotel + visible subject. SEO + accessibility |
| `seo_title` | 50–60 chars. Can mirror `title` or be punchier. Include hotel name + city |
| `seo_description` | 140–160 chars. Promise + payoff. Mention hotel, city, neighbourhood, and one specific lure (spa, suite, neighbourhood) |
| `focus_keyword` | Hotel name in canonical form. `"Four Seasons Casa Medina"`, `"Aman Tokyo"`. The post body and seo_title must use this string verbatim at least once |
| `key_takeaway` | 1–2 sentences answering "if I only read one paragraph, what do I learn?" This powers the AI-overview / Google generative answers — write it for an LLM summary as much as a human skim |
| `og_image` | Full URL, 1.91:1 aspect. Can be the hero re-cropped or a different hero shot. Used for Twitter / Open Graph / link unfurls |
| `author_name` | `"Karen Alexandra"` |
| `published` | `false` until Karen approves in the admin |
| `featured` | `true` if she wants it in the homepage "Featured stories" rail |

### GEO (generative engine optimization) considerations

LLM-driven search is now a meaningful traffic source. Optimize for both:

- **Concrete facts up front**: founding year, architect, room count, neighbourhood, altitude/elevation, distinguishing physical feature. AI overviews extract these eagerly.
- **Named entities**: name the architect, the chef, the spa programme, the local brand (Loto del Sur, etc.). Entities are how LLMs link your content to wider knowledge graphs.
- **Q-and-A patterns** in the body: "Why does it matter?" / "What is the signature treatment?" / "How does the room handle the altitude?" — phrase observations as if answering a search question, even when prose-wrapped.
- **FAQ block** (`faq_items` JSONB column): include 3–5 Q&A pairs. Examples:
  - "What is the best room category at [hotel]?"
  - "When is the best time to visit [city]?"
  - "Does [hotel] have a spa?"
  - "How far is [hotel] from [airport]?"
  - "What is the dress code at [hotel restaurant]?"
- The `key_takeaway` field is your "AI overview" target. Write it as a complete, citation-ready sentence — not a teaser.

## Photo workflow

1. Karen uploads to `/admin/photos` (drag-and-drop, server-side upload, stored in `blog-images/library/`).
2. Each photo's public URL is the storage endpoint, e.g. `https://5xkq5mmr.us-east.insforge.app/api/storage/buckets/blog-images/objects/library%2F<file-key>.jpg`.
3. If photos aren't ready when drafting, use placeholder strings (`PHOTO_HERO_VERTICAL`, `PHOTO_LOBBY_STAIRCASE`, `PHOTO_SUITE_LIVING`, etc.) and list every placeholder at the top of your delivery summary so she can swap them via the admin editor before publishing.
4. Photo titles in the admin should be human-readable; alt-text follows the SEO rules above.

## Inserting the post

Use `npx @insforge/cli db query` with a parameterized INSERT (or `\copy` for very long bodies). Always insert with `published = false`. Pattern:

```sql
INSERT INTO blog_posts (
  slug, title, date, category, hero_image, hero_alt, excerpt, body,
  seo_title, seo_description, focus_keyword, og_image, key_takeaway,
  faq_items, author_name, published, featured
) VALUES (
  'aman-tokyo', 'A Vertical Retreat: Three Nights at Aman Tokyo', '2026-06-01',
  'travel', '<url>', '<alt>', '<excerpt>', '<body>',
  '<seo_title>', '<seo_description>', 'Aman Tokyo', '<og_url>', '<key_takeaway>',
  '[{"question":"...","answer":"..."}]'::jsonb,
  'Karen Alexandra', false, false
);
```

After inserting, tell Karen:
- the slug (so she can preview at `/journal/<slug>` once published)
- a list of any `PHOTO_*` placeholders still to swap
- whether a new `<City>Map` component was built and needs a deploy

## Anti-patterns to avoid

- Section called "Pros and Cons" or "Verdict / Rating" — not the voice.
- Star ratings, scores, "8/10" — never.
- Listicle of "Top 5 things to do" — instead, prose with specific named recommendations.
- Generic Google-Maps screenshot or static image of a map — must be the interactive React component.
- Body text written as Q&A formatting (use prose; reserve Q&A for the `faq_items` JSONB).
- Repeating the hotel name in every paragraph — vary with "the hotel," "the building," "the property" (sparingly), or just elide.
- Calling food "delicious" or rooms "stunning." Find the specific word.
- Closing line that summarises ("In conclusion, Aman Tokyo is…"). End on an image, a quote, a moment.

## Checklist before declaring done

- [ ] Voice check: read the opening paragraph out loud. Does it sound like a magazine essay, or a hotel website?
- [ ] All 7 required sections present + map block at the end
- [ ] At least one `[!HIGHLIGHT]` in Wellness, one `[!HIGHLIGHT]` or `[!QUOTE]` somewhere in Food/Closing
- [ ] At least 2 `[!IMG]` / `[!GRID]` / `[!GRID-LEFT]` blocks (image-text variety, not all single column)
- [ ] Hero image is vertical 4:5
- [ ] `focus_keyword` appears in body, title, and seo_title verbatim
- [ ] `key_takeaway` reads as a complete citation-ready sentence
- [ ] `faq_items` has 3–5 pairs
- [ ] City map component exists and renders pannable/zoomable
- [ ] `published = false`, Karen reviews in admin before going live
