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

### The two rules that override everything else

**1. Never invent anything.** Not a detail, not a scene, not a sensory impression, not a number. Write only from what Karen actually told you, what's in her photos, and what you verified from a real source. If you don't know whether the hotel serves a particular dish, don't recommend it. If you don't know which herbs are in the steam room, say "herbal steam sauna" and stop. If she didn't say the drive was beautiful, don't write that the car went quiet.

This is the single most common failure. It shows up as scene-setting that reads well and never happened: roadside fruit stalls, a bus overtaking on a curve, "everyone stopped talking," a named dish she never ate, a treatment duration nobody gave you. Fabricated texture is worse than thin texture — it's a real person's byline on something she didn't experience. When you have less material than the section seems to want, write the shorter section.

If a fact would genuinely improve the piece, go find it (the hotel's own site, a reputable write-up) and cite it accurately, or ask Karen. Never fill the gap yourself.

**2. Write how people actually talk.** Casual, plain, first-person. Short sentences are good. Contractions are good. "It sounds like a hassle and it really isn't" is the register. If you wouldn't say a phrase out loud to a friend who asked about the trip, cut it.

### What that means in practice

- **Plain words over elevated ones.** *Beautiful*, *quiet*, *worth it*, *easy*, *cold at night* beat *breathtaking*, *sublime*, *world-class*, *perfectly curated*, *exceptional*. If a sentence sounds like a brochure or a press release, rewrite it.
- **Plain words, not thin observations.** Casual vocabulary is the style; it is not permission to say nothing. "The rooms are simple and I liked that" is flat — it describes without telling the reader anything. Keep the easy words and raise what you're actually saying with them.
- **No writerly performance.** Cut constructions that exist to sound literary: "the highway did what highways do," "it is that kind of view," "there is no fourth option," "which is the whole point" as a closer on every paragraph, personified objects ("the volcano hasn't finished having opinions"), and stacked em-dash asides. One good observation beats three ornamental ones.
- **First person, matter-of-fact.** "We spent most of the weekend on the terrace." "I spent an entire afternoon there and would do it again." Say what happened and whether it was good. Skip the performed reverie.
- **Opinions are welcome, adjectives are not a substitute for them.** "I liked that there's no Mayan textile styling anywhere" is more useful than "a perfectly curated aesthetic."
- **Concrete facts do the work.** Name the year, the neighborhood, the elevation, the cooperative, the price of entry. Those carry the piece; adjectives don't. But only name what you actually know.
- **American English.** Use *neighborhood, center, traveler, gray, meters, recognized, color, program, optimize, summarize, prioritize*. Not the British forms — Karen is American.
- **Aesthetic over inventory.** Give the feeling and look of a room — palette, light, mood — not a list of furniture. Skip bathrooms entirely.
- **Say why the design is the way it is.** This is the difference between a description and a review. Every good hotel's look is answering something: where it is, what the weather does, what the building used to be, what the place expects you to spend your day doing. Connect the two. *"Pale walls, wood floors, bamboo behind the beds — it's the palette outside brought indoors, and it fits how the place works, since you're outside from breakfast on"* does real work. *"The rooms are simple"* doesn't. A material, a color or a layout is only worth naming if you then say what it's doing there.
- **Captions say what's happening, not what's in frame.** The reader can see the photo. A caption that labels the contents — "the lawn between the rooms and the water", "the main pool" — is wasted space. Use it for the moment, the timing, or the tip: *"A cocktail before heading back out to explore more of Paracas"*, *"Midday, when the pool actually fills up"*. Alt text is the opposite job — that one stays plainly descriptive, for people who can't see the image.
- **Nouns need a reason to be on the page.** Before naming a thing, ask what it tells the reader. Bamboo panelling matters because it ties the room to the coast; a firewood bowl matters because the nights get cold. If you can't say what it's doing, cut it — that's how a paragraph turns into "the room has a bed."
- **One adjective per noun, usually zero.** Never stack them.

### Quick self-check before delivering

Read the opening paragraph out loud. Does it sound like Karen telling a friend where she went, or like a hotel's website? If it's the second, rewrite it.

Then go through every concrete detail and ask: *do I actually know this?* Delete anything you can't source to Karen, her photos, or a real reference.

## Required structure

Every hotel review must have these sections in this order. Section headings are `##` (h2). Sub-emphasis via `[!HIGHLIGHT]`, `[!QUOTE]`, `[!RULE]` blocks.

1. **Lead image + opening section** — a hero `[!IMG]` block followed by a plain `##` heading ("Getting there", "The hotel", or the one thing that actually defines the place). Cover how you get there and what the place is: location, how to arrive and how hard it is, size, setting, and the one fact that makes it distinctive. 2–4 short paragraphs.

   If the hotel has a real, verifiable history — a founder, an architect, a documented origin — use it. If it doesn't, **do not manufacture one**, and do not write an "essay opening" to fill the space. Most hotels don't have a dramatic origin story, and a plain, useful opening beats an invented tension every time. Never open with a fabricated travel scene.

2. **The rooms** — `## The rooms`. One full-width `[!GRID]` block (image right, text left) and one `[!GRID-LEFT]` block (image left, text right) showing two different room views. Focus on **overall aesthetic and atmosphere**: the design sensibility (mid-century, colonial, minimalist, maximalist, beachy, etc.), the color palette, the quality of light, the mood. Do *not* enumerate every item in the room (bed, desk, chair, lamp, trunk, drapes). Skip the bathroom entirely — no plumbing, no toiletries, no tile.

   Name the sensibility, then say what it's responding to. A beach resort, a city hotel in a converted bank and a mountain lodge are all making different arguments, and the room is where you can read them. Tie the palette and materials to the landscape outside, the climate, the building's past life, or what the hotel expects you to do all day. End on the destination's atmospheric quirk — altitude, humidity, ocean air, wind, street noise — and how the room handles it.

3. **Wellness** — *mandatory*, never skip. `## Wellness` or a plain contextual title. Spa, treatments, pool, sauna, gym, yoga, anything ritual. Use one `[!HIGHLIGHT label="..." text="..."]` block for the thing most worth booking.

   Include treatment names, durations, and ingredients **only if you actually have them**. Do not invent a duration, a list of herbs, or a local-ingredient story because the block looks better with one. "An herbal steam sauna and a massage, booked directly with the hotel" is a complete and honest highlight. If the wellness offering is small, say it's small — that's a real observation and often a compliment.

4. **Food** — *mandatory*. `## Food` (or the restaurant name). Cover how eating there works — restaurant or house kitchen, breakfast, the bar, room service — and what's good about it. One `[!IMG]` of food or the setting.

   Name the chef and specific dishes **only when you know them**. Never recommend a dish you can't confirm is served, and never describe a meal Karen didn't report eating. If all you know is "à la carte, ordered ahead, produce from the garden," write that — it's genuinely useful and it's true. A second `[!HIGHLIGHT]` is optional; use it for something practical (how to book, private dining, dietary notes) rather than inventing a tasting-menu pairing.

5. **Beyond the hotel** — *mandatory*. `## Beyond the hotel` or `## The neighborhood` or similar. 3–6 specific things to do in the destination that Karen would actually prioritize, with neighborhood context. Examples: a museum + which floor to skip to; a coffee bar + what to order; a walk + the time of day; a market + the stall. Use `[!COLLAGE]` for a 3-image grid of the destination if photos exist. Each item is a short paragraph or bulleted under bolded sub-headings — be specific, no generic "Visit the cathedral" entries.

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
3. Replace the SVG layer with a hand-illustrated outline of the destination's recognisable shape (neighborhood blocks, harbour, river, mountain ridge — whatever defines it visually). Cream / lilac palette to match the site (`var(--ka-bg)`, `var(--ka-accent-deep)`).
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
| `seo_description` | 140–160 chars. Promise + payoff. Mention hotel, city, neighborhood, and one specific lure (spa, suite, neighborhood) |
| `focus_keyword` | Hotel name in canonical form. `"Four Seasons Casa Medina"`, `"Aman Tokyo"`. The post body and seo_title must use this string verbatim at least once |
| `key_takeaway` | 1–2 sentences answering "if I only read one paragraph, what do I learn?" This powers the AI-overview / Google generative answers — write it for an LLM summary as much as a human skim |
| `og_image` | Full URL, 1.91:1 aspect. Can be the hero re-cropped or a different hero shot. Used for Twitter / Open Graph / link unfurls |
| `author_name` | `"Karen Alexandra"` |
| `published` | `false` until Karen approves in the admin |
| `featured` | `true` if she wants it in the homepage "Featured stories" rail |

### GEO (generative engine optimization) considerations

LLM-driven search is now a meaningful traffic source. Optimize for both:

- **Concrete facts up front**: founding year, architect, room count, neighborhood, altitude/elevation, distinguishing physical feature. AI overviews extract these eagerly.
- **Named entities**: name the architect, the chef, the spa program, the local brand (Loto del Sur, etc.). Entities are how LLMs link your content to wider knowledge graphs.
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
- Item-by-item room inventories. Don't list "the bed, the lamp, the desk, the trunk, the curtains" — give the *feeling and aesthetic* of the room instead.
- **Anything about bathrooms.** No tile, no marble, no rain shower, no toiletries, no double vanity. Skip it entirely.
- Adjective stacking — and be sparing even with one. *Stunning, exquisite, breathtaking* in a row reads as desperate; so does *stunning* in every third sentence.
- Closing line that summarizes ("In conclusion, Aman Tokyo is…"). End on an image, a quote, a moment.
- **Invented scene-setting.** No fruit stalls, no chicken buses, no "everyone went quiet," no weather or roadside detail Karen didn't report. If she said "3 hour drive, worth it," you have exactly that much material — use it and move on.
- **Invented specifics.** Named dishes she didn't eat, treatment durations nobody gave you, herb lists, thread counts, invented founders or architects. A vaguer true sentence always beats a precise false one.
- Press-release vocabulary: *nestled, boasts, oasis, hidden gem, sanctuary, curated, elevated, effortless, unparalleled, world-class, a feast for the senses*.
- Literary throat-clearing: "there is something about…", "it is the kind of place that…", "what surprised me most was…", "and that is the point."
- **Describing without interpreting.** "The rooms are simple." "The walls are white." "There's a pool." Facts with no read on them. Every description should leave the reader knowing something they couldn't have guessed from a booking page.
- **Leaning on *simple*, *plain*, *understated* or *minimal* as the whole observation.** Minimalism is a choice made for a reason — say the reason. These words are fine as a starting point and useless as an ending one.

## Checklist before declaring done

- [ ] **Fabrication check (do this first).** Go line by line. Every concrete detail — a dish, a duration, a scene, a number, a name — traces to Karen, her photos, or a verified source. Delete anything that doesn't.
- [ ] Voice check: read the opening paragraph out loud. Does it sound like Karen telling a friend about the trip? If it sounds like a magazine essay or a hotel website, rewrite it.
- [ ] No press-release vocabulary and no literary throat-clearing (see Anti-patterns)
- [ ] All 7 required sections present + map block at the end
- [ ] At least one `[!HIGHLIGHT]` in Wellness, one `[!HIGHLIGHT]` or `[!QUOTE]` somewhere in Food/Closing
- [ ] At least 2 `[!IMG]` / `[!GRID]` / `[!GRID-LEFT]` blocks (image-text variety, not all single column)
- [ ] Hero image is vertical 4:5
- [ ] `focus_keyword` appears in body, title, and seo_title verbatim
- [ ] `key_takeaway` reads as a complete citation-ready sentence
- [ ] `faq_items` has 3–5 pairs
- [ ] City map component exists and renders pannable/zoomable
- [ ] `published = false`, Karen reviews in admin before going live
