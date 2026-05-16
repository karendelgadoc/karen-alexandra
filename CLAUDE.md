# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

InsForge blank project named **Karen-Alexandra**. This folder is the single source of truth for the project.

- Dashboard: https://insforge.dev/dashboard/project/920e1f0c-6261-4331-8e7b-aadabd6287ab
- Backend URL: `https://5xkq5mmr.us-east.insforge.app` (also in `NEXT_PUBLIC_INSFORGE_URL`)

## Next.js Site

This is a Next.js 16 + TypeScript + Tailwind CSS app.

### Commands

```bash
npm run dev      # start dev server on localhost:3000
npm run build    # production build (also type-checks)
npm run lint     # ESLint
```

### Architecture

- **App Router** with `src/` directory layout
- All pages are statically generated (`generateStaticParams` for dynamic routes)
- No server components fetch data at runtime — content lives in `src/lib/posts.ts`
- Images served from `karenalexandra.com` via `next/image` (configured in `next.config.ts`)

### Routes

| Route | File |
|-------|------|
| `/` | `src/app/page.tsx` |
| `/about` | `src/app/about/page.tsx` |
| `/blog` | `src/app/blog/page.tsx` |
| `/blog/[slug]` | `src/app/blog/[slug]/page.tsx` |
| `/contact` | `src/app/contact/page.tsx` |

### Content

All case study content is in `src/lib/posts.ts` as a typed `Post[]` array. To add a new case study, add an entry there — no database needed.

### Design

- Font: Archivo (Google Fonts via `next/font`)
- Colors: CSS custom properties in `globals.css` — `--cream`, `--charcoal`, `--taupe`, `--beige`, `--muted`
- Layout: `src/components/Header.tsx` and `src/components/Footer.tsx` wrap all pages via `layout.tsx`

## Source Data

- `karenalexandra.WordPress.2026-05-15.xml` — original WordPress export (already converted)
- `uploads.zip` — WordPress media uploads

## InsForge MCP

The InsForge MCP server (`@insforge/mcp`) is pre-configured in `.mcp.json` for when backend features (auth, database, storage) are needed.
