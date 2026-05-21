---
name: fashion-news
description: Use this skill when Karen wants to write a luxury fashion news article for karenalexandra.com — e.g. "write a piece about [brand] launching [thing]", "fashion news post on [trend/collection/move]", "article about [luxury brand] doing X". This skill enforces the hybrid Business-of-Fashion-meets-personal-editorial structure, Karen's exact tone of voice, the project's rich-block syntax, SEO + GEO field completeness, editorial image sourcing from media coverage, and publishing via InsForge. Do NOT use for hotel reviews (use luxury-hotel-review), travel essays, or lifestyle posts with no news hook.
---

# Fashion News Skill

Karen Alexandra's fashion news articles live at `/journal/[slug]` (model: `blog_posts`, category: `fashion`). The template was set by **"When Dior Designed the Yoga Mat: Haute Wellness and the New Language of Luxury"** — every future fashion news article should match that piece's structure, depth, and hybrid register.

This skill is the contract for what "a Karen Alexandra fashion news article" means.

---

## When you're invoked

1. Confirm the brand, news event, and angle with Karen if not already specified.
2. Search the web for the news: what launched, when, by whom, what it costs, where it's available, what the brand said about it. Get specifics — product names, prices, designers, collaborators, distribution strategy.
3. **Always use euro (€) prices.** Pull pricing from French, Italian, Spanish, or other EU editorial sources first (Purepeople, Journal du Luxe, Vogue France, Grazia IT, etc.). If only GBP or USD prices are available, note that in the article and convert approximately — but flag it clearly in your delivery summary so Karen can verify before the post goes live.
4. Search for editorial images from media coverage. For EU sources, try French and Italian fashion press first (they often have better-quality press imagery than UK outlets). Get actual image file URLs from those articles. Do **not** attempt to pull directly from the brand's own website — brand CDNs typically block crawlers.
5. Draft the article following the structure and voice below. **Write in American English throughout** — see the Language section below.
6. Update `next.config.ts` CSP `img-src` and `images.remotePatterns` to allow any new image domains before inserting.
7. Insert via `npx @insforge/cli db import <file>.sql` with `published = true` (fashion news is time-sensitive — goes live immediately unless Karen says otherwise).
8. Ping Karen with the live URL and flag any image hotlink concerns or unverified price conversions.

---

## Editorial voice

The article is **two things at once**, and they must coexist without jarring:

**1. Fashion news reporting** (Business of Fashion register):
- Factual, authoritative, specific. Name the designer, the price, the launch date, the distribution channel.
- Report the industry context: what came before this, who else is doing it, what the market data says.
- Use third person for the brand: "Dior unveiled," "Hermès extended," "the house positions."
- Crisp, declarative sentences. No hedging.

**2. Karen's personal editorial voice** (closer to a magazine essay):
- First-person sparingly and precisely — one or two anchored personal observations, not a running diary.
- Observational and cultural, not enthusiastic. Karen has *perspective*, not *excitement*.
- Literary sentence construction: layered, building, with the payoff at the end of the clause — not front-loaded.
- Never sounds like a press release, a brand email, or a sponsored Instagram caption.
- The "I find this…" or "I have thought about…" move: stating a position with quiet confidence, not hedging.

---

## Language

**American English only.** This is non-negotiable throughout the body, headings, captions, SEO fields, FAQ answers, and key takeaway.

Common traps to watch:
- **-ize not -ise**: *recognize, organize, emphasize, prioritize, categorize* — never *recognise, organise, emphasise*
- **-or not -our**: *color, flavor, behavior, honor, glamour* — wait, *glamour* is the exception; everything else takes *-or*
- **-er not -re**: *center, theater, fiber* — never *centre, theatre, fibre*
- **-ment not -ment(UK)**: *fulfillment* (American) vs *fulfilment* (British) — use the double-l American form
- **Verb forms**: *practice* (American uses the same spelling for noun and verb) vs British *practise* (verb) / *practice* (noun)
- **No serial-comma exceptions**: use the Oxford comma consistently (*fashion, wellness, and lifestyle*, not *fashion, wellness and lifestyle*)
- **Dates**: Month DD, YYYY format (*May 14, 2026* not *14 May 2026*)

**Prices:** All prices must be in euros (€) — source from EU editorial coverage (French, Italian, Spanish press preferred); convert from GBP/USD if needed and flag any unverified conversions in your summary.

---

**The tonal contract** (non-negotiable):
- Elegant restraint. The response to something genuinely exciting is a cooler observation, not a warmer one.
- Concrete detail earns the adjective. "A yoga mat in blue and ivory cannage" works. "A stunning yoga mat" does not.
- History and cultural context before trend commentary. Understand the brand's DNA before describing the departure.
- One strong declarative to open a section or paragraph, then earned elaboration. Not the reverse.
- Never use: "game-changer," "revolutionary," "groundbreaking," "must-have," "iconic" (unless citing a brand's own historical vocabulary), "we," "you" (in body text), or rhetorical questions.
- American English throughout.

**Voice calibration example** (from the Dior article — this is the register):
> "When Christian Dior opened his salon on Avenue Montaigne in 1947, the gesture was more than commercial. It was architectural — the construction of a world in which dressing was treated as an act of consequence."

> "Dior's move is sophisticated because it does not treat this as adjacency. The Haute Wellness line is not branded merchandise in couture colors. It is the application of the house's complete design grammar — the cannage motif, the blue and ivory palette, the gold thread, the material standards — to a new set of objects."

> "I find this evolution both commercially intelligent and aesthetically appropriate."

---

## Required structure

Every fashion news article must follow this arc. Headings are `##` (h2). Length: 900–1,400 words of body prose.

### 1. Opening (no heading)
2–3 paragraphs. Open with the brand's history or founding logic — what the house has always stood for, how that instinct has defined it. Then introduce the news: what launched, when, who designed it, what it includes. Then the reframe: what does this really mean beyond the product? End the opening section with a sharp declarative that names the article's thesis.

The opening must not begin with the news. Begin with context, history, or a cultural observation. The news is the second paragraph.

### 2. A thematic analysis section (## heading)
1–2 paragraphs analyzing the cultural or industry logic behind the move. Why now? What trend, generation, or value shift made this possible or necessary? Use data where available (market size, demographic statistics) but embed it in prose, not bullet points. This is the Business of Fashion layer — authoritative, informed, specific.

### 3. A personal perspective section or continuation (may blend with #2)
1–2 paragraphs where Karen's voice becomes more prominent — a specific observation about what this means aesthetically or culturally, what it signals for the industry. This is where "I find…" or "I have thought about…" can appear. Keep it to one clear personal stake; don't overload with first-person.

### 4. A second thematic section (## heading — different angle)
Usually the brand's strategy or distribution approach — how they're going to market with this, what makes it different from previous moves. For example: the experiential marketing angle, the hotel/spa distribution, the collaboration structure, the pricing architecture. This should reveal something non-obvious about the brand's playbook.

### 5. Closing (no heading or [!RULE] break)
1–2 paragraphs. Synthesis: what does this tell us about where luxury fashion is going? End with a precise, image-leaving sentence — a specific detail, a restatement of the thesis at a higher register, or a quiet provocation. Never a summary. Never "in conclusion."

### 6. Availability line
One short paragraph at the end (after a `[!RULE]`): where to find it, when it launched, price range. Embed a link to the brand's official page using the `<a href="...">` tag (the sanitizer allows it).

---

## Rich block placement

Use the project's rich blocks to create editorial rhythm. Minimum: 1 `[!HIGHLIGHT]`, 1 `[!QUOTE]`, 2–3 images (`[!IMG]` or `[!GRID]`), 1 `[!RULE]` before the availability line.

| Block | When to use |
|-------|-------------|
| `[!HIGHLIGHT label="..." text="..."]` | Lift a thesis sentence out of the body. Label is the eyebrow (2–4 words). Use once near the top of the analysis section, once near the experiential/strategy section. |
| `[!QUOTE text="..."]` | A single stand-alone observation — Karen's most distilled take, or the most striking factual reframe. Use once, mid-article. |
| `[!IMG src="..." alt="..." caption="..."]` | Full-width editorial image. Use after the opening section and again in the strategy section. Caption format: `Image: © [Brand Name], via [Publication Name]` |
| `[!GRID src="..." alt="..." text="..."]` | Image right, text left. Use for a specific product detail or close-up with a short editorial note in the text column. No double quotes inside `text="..."`. |
| `[!GRID-LEFT src="..." alt="..." text="..."]` | Image left, text right. Same rules as [!GRID]. Alternate layouts for visual variety. |
| `[!RULE]` | One hairline break before the availability line. Optionally one mid-article to separate the opening from the analysis. |

---

## Image sourcing

**Never pull directly from the brand's website** — brand CDNs block crawlers. Instead:

1. Search for editorial coverage of the launch across fashion/lifestyle media.
2. Fetch the article pages and extract `img src` URLs from the HTML.
3. Prioritize: well-named image files that clearly correspond to specific products (e.g. `Dior-Wellness-Circle.jpg`, `Dior-Haute-Wellness-001.jpeg`). Avoid screenshots, GIFs, or avatars.
4. Use 3–4 images total: one hero, two inline, optionally one for a `[!GRID]` block.
5. Add every new image domain to `next.config.ts` CSP `img-src` and — if used as hero image — to `images.remotePatterns`.
6. Caption every image as: `Image: © [Brand] Couture/Maison/etc., via [Publication]`

**Reliable sources for editorial images** (try in this order):
- `livingetc.com` → images on `cdn.mos.cms.futurecdn.net`
- `theimpression.com` → usually has press kit images
- `factmagazines.com` → API/CMS hosted, well-named files
- `businesstoday.com.my` → wp-content uploads, descriptively named
- `runwaymagazines.com` → full-quality press imagery
- `wellworthy.com` → wp-content uploads (wellness-adjacent stories)

---

## SEO + GEO field requirements

All fields must be populated before `published = true`.

| Field | Rule |
|-------|------|
| `slug` | `[brand]-[news-topic]-[optional-angle]` kebab-case. E.g. `dior-haute-wellness-luxury-fashion-wellness`, `hermes-metaverse-launch`, `chanel-fine-jewelry-expansion` |
| `title` | Editorial sentence, 50–70 chars. Leads with intrigue, not the brand name. E.g. "When Dior Designed the Yoga Mat: Haute Wellness and the New Language of Luxury" |
| `category` | `"fashion"` |
| `date` | ISO date of publication (`YYYY-MM-DD`) |
| `excerpt` | 1–2 sentences. The article's thesis as a hook. Used in OG preview and journal listing. Must make someone want to read the full piece. |
| `hero_image` | Full URL, 16:9 or wider crop preferred for editorial news pieces |
| `hero_alt` | Specific and descriptive. Mentions the brand, the product, and the visual subject. |
| `seo_title` | 50–60 chars. Include brand name + the news hook + optional category signal. E.g. "Dior Haute Wellness: Why Wellness Is Now a Pivotal Part of Luxury Fashion Brands" |
| `seo_description` | 140–160 chars. Promise + payoff. Mention brand, what they did, and why it matters. |
| `focus_keyword` | The most searchable form of the news. E.g. `"Dior Haute Wellness collection"`. Must appear verbatim in body, title, and seo_title. |
| `key_takeaway` | 1–2 sentences. The full thesis as a citation-ready statement — written for LLM summarization as much as human skimming. |
| `author_name` | `"Karen Alexandra"` |
| `author_bio` | `"Karen Alexandra writes on fashion, culture, and the aesthetics of daily life."` |
| `faq_items` | 3–5 Q&A pairs in JSONB. Target: factual questions a reader or AI would ask about the news. E.g. "What is the [collection name]?", "Why are luxury fashion brands moving into [category]?", "Where can I buy [product]?", "How does [brand move] connect to [trend]?" |
| `published` | `true` for fashion news (time-sensitive). Unless Karen says otherwise. |

### GEO writing tips for fashion news

- Put concrete facts (launch date, price range, designer name, product count) in the first or second paragraph — AI overviews extract these eagerly.
- Use named entities throughout: the designer, the collection name, the collaboration partner, the price point, the distribution channel.
- Write `key_takeaway` as a complete sentence that could stand alone as a news summary. Test: if this appeared as a Google AI overview snippet, would it accurately represent the article?
- FAQ questions should address what readers Google after seeing the news headline: "what is it," "how much does it cost," "where to buy," "why did [brand] do this."

---

## Anti-patterns to avoid

- **GBP or USD prices.** Always euros. If you can't find the EU price, convert and flag it — never silently publish a pound or dollar figure.
- **British English spellings.** Run a mental check before declaring done: -ise endings, -our endings, -re endings, *practise* as a verb, *fulfilment* with one l — all wrong. American forms only.
- **Opening with the news.** The news is never the first sentence. History, context, or a cultural observation always comes first.
- **Press-release prose.** Phrases like "the iconic maison," "at the forefront of innovation," "cementing their legacy" — cut on sight.
- **Excessive enthusiasm.** If you find yourself writing "stunning," "breathtaking," or "incredible," delete and describe the specific thing instead.
- **Rhetorical questions.** "But what does this really mean?" — no. State the meaning.
- **Summary closings.** Never end with "In summary, [brand] has proven once again that…" End on a specific image, a restatement at a higher register, or a quiet provocation.
- **Overloading first-person.** Karen's voice appears in precise, well-chosen moments — not throughout. One or two "I find…" or "I have thought about…" moves per article, maximum.
- **Treating every brand move as historic.** Fashion houses make moves constantly. Calibrate: is this a strategic shift (worth analysis), a product launch (worth reporting + light POV), or marketing noise (not worth a full article)?
- **Bullet-point body sections.** Body prose is continuous. Reserve lists for the FAQ block or the availability line only.
- **Vague cultural claims.** "Wellness is everywhere now" is not a sentence. "The Global Wellness Institute values the wellness economy at over $6 trillion" is.

---

## Inserting the post

Write a SQL file to `scripts/insert-[slug].sql`, then run:

```bash
npx @insforge/cli db import scripts/insert-[slug].sql
```

Use `$body$...$body$` dollar-quoting for the body and any other long strings (avoids single-quote escaping). Use `$faq$...$faq$::jsonb` for the FAQ array. Pattern:

```sql
INSERT INTO blog_posts (
  slug, title, date, category,
  hero_image, hero_alt, excerpt, body,
  key_takeaway,
  seo_title, seo_description, focus_keyword,
  author_name, author_bio,
  faq_items,
  published, featured
) VALUES (
  'brand-topic-angle',
  'Editorial Title: Subtitle With Depth',
  '2026-MM-DD',
  'fashion',
  'https://image-cdn.com/hero.jpg',
  'Brand Collection — specific visual description',
  'Excerpt sentence one. Excerpt sentence two.',
  $body$[article body]$body$,
  'Key takeaway as a complete, citation-ready sentence.',
  'SEO Title 50–60 Chars | Brand + Hook',
  'SEO description 140–160 chars. Brand, what they did, why it matters.',
  'Brand Collection Name focus keyword',
  'Karen Alexandra',
  'Karen Alexandra writes on fashion, culture, and the aesthetics of daily life.',
  $faq$[{"question":"...","answer":"..."}]$faq$::jsonb,
  true,
  false
);
```

After inserting, verify the row:
```bash
npx @insforge/cli db query "SELECT slug, title, category, published, length(body) as body_len, hero_image IS NOT NULL as has_hero FROM blog_posts WHERE slug = '[slug]';"
```

Then confirm live on the preview site: `https://5xkq5mmr.insforge.site/journal/[slug]`

---

## Checklist before declaring done

- [ ] All prices in euros (€) — no £ or $ in body, excerpt, FAQ, or key takeaway
- [ ] American English throughout — spot-check: *-ize*, *-or*, *-er*, *center*, *color*, *organize*, *fulfillment*
- [ ] Opens with history/context, not the news announcement
- [ ] News facts are specific: date, price, designer, product names, distribution
- [ ] Two distinct thematic sections (##) with different angles
- [ ] "I find…" or personal position appears exactly once or twice — never more
- [ ] At least 1 `[!HIGHLIGHT]`, 1 `[!QUOTE]`, 2 `[!IMG]` or `[!GRID]` blocks, 1 `[!RULE]`
- [ ] 3–4 images with `Image: © [Brand], via [Publication]` captions
- [ ] New image domains added to `next.config.ts` CSP and `remotePatterns`
- [ ] All SEO/GEO fields populated (`seo_title`, `seo_description`, `focus_keyword`, `key_takeaway`, `faq_items` with 3–5 pairs, `author_name`, `author_bio`)
- [ ] `focus_keyword` appears verbatim in body, title, and `seo_title`
- [ ] `key_takeaway` reads as a standalone, citation-ready sentence
- [ ] No press-release language, no rhetorical questions, no bullet-point body sections
- [ ] No summary closing — ends on image, restatement, or provocation
- [ ] Verified live at `https://5xkq5mmr.insforge.site/journal/[slug]`
