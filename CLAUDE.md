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
| `/about` | `src/app/(public)/about/page.tsx` | |
| `/contact` | `src/app/(public)/contact/page.tsx` | |
| `/watch` | `src/app/(public)/watch/page.tsx` | ISR 1 min |
| `/blog` | `src/app/(public)/blog/page.tsx` | |
| `/blog/[slug]` | `src/app/(public)/blog/[slug]/page.tsx` | |
| `/case-studies` | `src/app/(public)/case-studies/page.tsx` | |
| `/case-studies/[slug]` | `src/app/(public)/case-studies/[slug]/page.tsx` | |
| `/journal` | `src/app/(public)/journal/page.tsx` | |
| `/journal/[slug]` | `src/app/(public)/journal/[slug]/page.tsx` | |
| `/privacy` | `src/app/(public)/privacy/page.tsx` | |
| `/login` | `src/app/(public)/login/page.tsx` | Admin login |
| `/auth/callback` | `src/app/auth/callback/page.tsx` | Magic link callback |
| `/admin` | `src/app/admin/(dashboard)/page.tsx` | Protected |
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

### Content & Database

Content is stored in InsForge Postgres (not hardcoded). Tables:

- `blog_posts` — blog posts (markdown body, SEO fields, published flag)
- `case_studies` — portfolio case studies (same schema as blog_posts essentially)
- `page_content` — JSON content for each editable page (home, portfolio, about, contact, watch)
- `nav_items` — header/footer navigation menu items

Admin panel at `/admin` (requires magic-link auth, email: karendelgadoc2@gmail.com).

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
- `src/lib/page-content-db.ts` — page content CRUD + section ordering
- `src/lib/admin-guard.ts` — `requireAdmin()` middleware for API routes
- `src/lib/indexnow.ts` — fire-and-forget IndexNow pings on content changes
- `src/lib/sanitize.ts` — HTML sanitization for user inputs
- `src/lib/seo-analyzer.ts` — SEO scoring helper used in admin SEO panel

### Admin API Routes

All under `/api/admin/*`, all require the `X-Admin-Key` header (value: `ADMIN_SECRET` env var).

| Endpoint | Methods |
|----------|---------|
| `/api/admin/blog` | GET (list), POST (create) |
| `/api/admin/blog/[id]` | GET, PUT, DELETE |
| `/api/admin/posts` | GET (list), POST (create) |
| `/api/admin/posts/[id]` | GET, PUT, DELETE |
| `/api/admin/pages/[page]` | GET, PUT |
| `/api/admin/menus` | GET, POST, PUT, DELETE |
| `/api/contact` | POST (sends email via Resend) |
| `/api/auth/set-session` | POST (sets HttpOnly admin cookie) |

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

- Security headers in `next.config.ts` (CSP, HSTS, X-Frame-Options, etc.)
- Admin access: HttpOnly cookie set via `/api/auth/set-session`
- `requireAdmin()` in `src/lib/admin-guard.ts` checks the cookie on all admin API routes
- GDPR cookie banner (`src/components/CookieBanner.tsx`) with localStorage consent
- Privacy policy at `/privacy`
- HTML sanitization on all user-submitted content via `src/lib/sanitize.ts`

### Design

- Fonts: Cormorant Garamond (editorial display), Jost (clean body), JetBrains Mono (code/details)
- Colors: CSS custom properties in `globals.css` — `--cream (#f7f4ee)`, `--ink`, `--muted`, etc.
- Layout: Header + Footer in `src/components/Header.tsx` / `src/components/Footer.tsx`
- Components: `src/components/KaComponents.tsx` — shared editorial primitives

## Source Data

- `karenalexandra.WordPress.2026-05-15.xml` — original WordPress export (already converted; ignore)
- `uploads.zip` — WordPress media uploads (ignore; images are on the live domain)

## InsForge MCP

The InsForge MCP server (`@insforge/mcp`) is pre-configured in `.mcp.json` for when backend features (auth, database, storage) are needed.
