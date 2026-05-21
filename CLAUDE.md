# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

InsForge project named **Karen-Alexandra**. This folder is the single source of truth for the project.

- Dashboard: https://insforge.dev/dashboard/project/920e1f0c-6261-4331-8e7b-aadabd6287ab
- Backend URL: `https://5xkq5mmr.us-east.insforge.app` (also in `NEXT_PUBLIC_INSFORGE_URL`)
- Live site: https://karenalexandra.com (custom domain on Vercel via InsForge)
- Preview: https://5xkq5mmr.insforge.site

## Next.js Site

This is a Next.js 16 + TypeScript + Tailwind CSS app.

### Commands

```bash
npm run dev      # start dev server on localhost:3000
npm run build    # production build (also type-checks)
npm run lint     # ESLint
npx @insforge/cli deployments deploy .   # deploy to Vercel
```

**Deploy note:** `uploads.zip` (289 MB) must be moved out of the project directory before deploying — InsForge CLI scans the filesystem and the file exceeds the 100 MB limit. Move it out, deploy, move it back.

```bash
mv uploads.zip /tmp/ && npx @insforge/cli deployments deploy . && mv /tmp/uploads.zip .
```

### Architecture

- **App Router** with `src/` directory layout
- Route groups: `(public)` for public-facing pages, `admin/(dashboard)` for admin panel
- Static pages with ISR: `/` (1 min), `/watch` (1 min), `/llms.txt` (1 hr)
- Dynamic pages are SSR (server-rendered on demand): `/admin/*`, `/api/*`
- Fonts: Cormorant Garamond (display), Jost (body), JetBrains Mono (mono)
- Images served from `karenalexandra.com` via `next/image` (configured in `next.config.ts`)

### Routes

| Route | File | Notes |
|-------|------|-------|
| `/` | `src/app/(public)/page.tsx` | ISR 1 min |
| `/portfolio` | `src/app/(public)/portfolio/page.tsx` | |
| `/about` | `src/app/(public)/about/page.tsx` | Redirects → `/portfolio` |
| `/contact` | `src/app/(public)/contact/page.tsx` | DB-driven editorial contact page |
| `/services` | `src/app/(public)/services/page.tsx` | Consulting + brand partnerships |
| `/media-kit` | `src/app/(public)/media-kit/page.tsx` | Audience stats, past partners, CTA |
| `/watch` | `src/app/(public)/watch/page.tsx` | ISR 1 min; nav label: "On Film" |
| `/blog` | `src/app/(public)/blog/page.tsx` | Redirects → `/journal` |
| `/blog/[slug]` | `src/app/(public)/blog/[slug]/page.tsx` | Redirects → `/journal/[slug]` |
| `/case-studies` | `src/app/(public)/case-studies/page.tsx` | |
| `/case-studies/[slug]` | `src/app/(public)/case-studies/[slug]/page.tsx` | |
| `/journal` | `src/app/(public)/journal/page.tsx` | Nav label: "The Edit" |
| `/journal/[slug]` | `src/app/(public)/journal/[slug]/page.tsx` | |
| `/privacy` | `src/app/(public)/privacy/page.tsx` | |
| `/login` | `src/app/(public)/login/page.tsx` | Admin login (magic link) |
| `/auth/callback` | `src/app/auth/callback/page.tsx` | Magic link callback |
| `/admin` | `src/app/admin/(dashboard)/page.tsx` | Protected by `admin_session` cookie |
| `/admin/blog` | `src/app/admin/(dashboard)/blog/page.tsx` | |
| `/admin/posts` | `src/app/admin/(dashboard)/posts/page.tsx` | Case studies |
| `/admin/pages` | `src/app/admin/(dashboard)/pages/page.tsx` | |
| `/admin/pages/[page]` | `src/app/admin/(dashboard)/pages/[page]/page.tsx` | Content editor |
| `/admin/pages/[page]/builder` | `src/app/admin/(dashboard)/pages/[page]/builder/page.tsx` | Visual builder |
| `/admin/menus` | `src/app/admin/(dashboard)/menus/page.tsx` | |
| `/sitemap.xml` | `src/app/sitemap.ts` | Auto-generated |
| `/robots.txt` | `src/app/robots.ts` | |
| `/llms.txt` | `src/app/llms.txt/route.ts` | ISR 1 hr |
| `/manifest.webmanifest` | `src/app/manifest.ts` | PWA manifest |

### Navigation Labels vs URL Paths

The display labels differ from URL paths in two places — do not change the paths:

| Display label | URL path | Where set |
|---------------|----------|-----------|
| The Edit | `/journal` | `MENU_DEFAULTS` in `page-content-db.ts`, Footer, journal page eyebrow |
| On Film | `/watch` | `MENU_DEFAULTS` in `page-content-db.ts`, Footer, watch page title |

### Content & Database

Content is stored in InsForge Postgres (not hardcoded). Tables:

- `blog_posts` — blog posts (markdown body, SEO fields, published flag)
- `case_studies` — portfolio case studies (`case-study-little-black-shell` fashion, `case-study-lifestyle-traveler` travel)
- `page_content` — JSON content for each editable page (home, portfolio, about, contact, watch)
- `nav_items` — header/footer navigation menu items

Admin panel at `/admin` (requires magic-link auth via karendelgadoc2@gmail.com).

### Section Components

Reusable section components extracted from each page to allow sharing with the visual builder:

- `src/components/sections/home.tsx`
- `src/components/sections/portfolio.tsx`
- `src/components/sections/contact.tsx`
- `src/components/sections/watch.tsx`
- `src/components/sections/about.tsx`

Each exports a `buildSectionMap(content, extras?)` helper returning `Record<sectionId, ReactNode>`.

### Key Libraries

- `src/lib/posts-db.ts` — case study CRUD (InsForge Postgres)
- `src/lib/blog-db.ts` — blog post CRUD (InsForge Postgres)
- `src/lib/page-content-db.ts` — page content CRUD + section ordering; also holds `MENU_DEFAULTS`
- `src/lib/admin-guard.ts` — `requireAdmin()` middleware for API routes (checks `admin_session` cookie + CSRF origin check)
- `src/lib/indexnow.ts` — fire-and-forget IndexNow pings on content changes
- `src/lib/sanitize.ts` — HTML allowlist sanitizer for blog/case-study body paragraphs
- `src/lib/seo-analyzer.ts` — SEO scoring helper used in admin SEO panel

### Key Components

- `src/components/Header.tsx` — async server component; fetches nav from DB via `getMenuContent()`
- `src/components/Footer.tsx` — 5-column grid: Brand · Explore · Work · Categories · Elsewhere
- `src/components/ContactForm.tsx` — client component; POSTs JSON to `/api/contact`
- `src/components/CalendlyPopup.tsx` — loads Calendly widget, opens popup on click
- `src/components/CookieBanner.tsx` — GDPR consent banner (localStorage)

### Footer Structure

Five-column grid (`grid-template-columns: 2fr 1fr 1fr 1fr 1fr`):

1. **Brand** — monogram logo + tagline
2. **Explore** — Home, The Edit (`/journal`), On Film (`/watch`), Contact
3. **Work** — Portfolio, Media Kit, Services, Case Studies
4. **Categories** — Fashion, Travel, Wellness, Lifestyle (filtered journal links)
5. **Elsewhere** — YouTube, Pinterest, LinkedIn (all `target="_blank"`)

### Admin API Routes

All under `/api/admin/*`, all require a valid `admin_session` cookie (set via `/api/auth/set-session`).

| Endpoint | Methods |
|----------|---------|
| `/api/admin/blog` | GET (list), POST (create) |
| `/api/admin/blog/[id]` | GET, PUT, DELETE |
| `/api/admin/posts` | GET (list), POST (create) |
| `/api/admin/posts/[id]` | GET, PUT, DELETE |
| `/api/admin/pages/[page]` | GET, PUT |
| `/api/admin/menus` | GET, POST, PUT, DELETE |
| `/api/admin/photos/upload` | POST (multipart; 4.4 MB limit; image/* only) |
| `/api/contact` | POST (sends email via Resend; rate-limited 3/IP/min) |
| `/api/auth/set-session` | POST (verifies InsForge token + email allowlist; sets HttpOnly cookie) |

### SEO & Discoverability

- **sitemap.xml** — auto-generated, includes all published posts + static pages
- **robots.txt** — allows all crawlers, points to sitemap
- **llms.txt** — for AI crawler context
- **IndexNow** — key file at `/e03e0e3336dffab74aaa938e98ffa26e.txt`; pings `api.indexnow.org` on every content write in admin
- **JSON-LD** — Person, Organization, WebSite schemas in layout; BlogPosting + BreadcrumbList on post pages
- **Open Graph + Twitter cards** — on all pages including dynamic posts
- **Web manifest** — `src/app/manifest.ts` with theme color `#6d28d9`
- **Viewport / theme-color** — exported from `layout.tsx` (`Viewport`), light `#f7f4ee` / dark `#1a1a1a`
- **Apple touch icon** — `/logo-monogram.png` via `appleWebApp` metadata
- **security.txt** — `public/.well-known/security.txt` per RFC 9116

### Security & GDPR

- **Security headers** in `next.config.ts`: HSTS (2yr + preload), X-Frame-Options (SAMEORIGIN), X-Content-Type-Options, Referrer-Policy, Permissions-Policy, CSP
- **CSP** allows: self + inline/eval (required by Next.js), Google Fonts, InsForge storage, YouTube thumbnails, Calendly (script + style + frame + connect)
- **Admin auth**: InsForge magic-link → token verified server-side → email allowlist check → HttpOnly `admin_session` cookie (Secure, SameSite=Lax, 7d)
- **Admin guard**: `requireAdmin()` checks cookie presence + validates Origin/Referer header on all state-changing requests (CSRF defense)
- **Contact form**: rate-limited (3/IP/60 s), honeypot field, length caps, email regex, CRLF injection check, all fields HTML-escaped before email send
- **Photo upload**: admin-only, MIME type checked (`image/*`), 4.4 MB ceiling, filename sanitized before storage key
- **HTML sanitization**: strict allowlist (`<b> <i> <em> <strong> <u> <br> <a> <p> <span>`) with `javascript:`/`data:` href blocking; applied to all blog/case-study body HTML
- **GDPR**: cookie consent banner, privacy policy at `/privacy`

### Design

- Fonts: Cormorant Garamond (editorial display), Jost (clean body), JetBrains Mono (code/details)
- Colors: CSS custom properties in `globals.css` — `--ka-bg`, `--ka-ink`, `--ka-muted`, `--ka-accent`, etc.
- Layout: Header + Footer in `src/components/Header.tsx` / `src/components/Footer.tsx`
- Components: `src/components/KaComponents.tsx` — shared editorial primitives

## Source Data

- `karenalexandra.WordPress.2026-05-15.xml` — original WordPress export (already converted; ignore)
- `uploads.zip` — WordPress media uploads (ignore; images are on the live domain)

## InsForge MCP

The InsForge MCP server (`@insforge/mcp`) is pre-configured in `.mcp.json` for when backend features (auth, database, storage) are needed.
