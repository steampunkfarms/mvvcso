# MVVCSO — CLAUDE.md

## Identity Guard

> **THIS IS THE MVVCSO PROJECT.**
> Parent protocol: `/Users/ericktronboll/Projects/Backcountry Tech Solutions/CLAUDE.md` (BFOS family)
> Global routing: `~/.claude/CLAUDE.md`
> This project follows BFOS family protocol with the overrides listed below.

## Changelog

- 2026-03-30: Initial project CLAUDE.md created per Phase 1 handoff spec.

## Project
- **Name:** MVVCSO (Montezuma Valley Volunteer Community Service Organization)
- **Stack:** Next.js (App Router) + TypeScript + Tailwind v4 + Drizzle ORM + Neon Postgres
- **Hosting:** Vercel (Backcountry-Tech team, Pro)
- **Repo:** steampunkfarms/mvvcso
- **Domain:** mvvcso.vercel.app (production) → mvvcso.org later

## Conventions
- All env vars: `.trim()` before use
- All API routes: validate input with zod
- All cron routes: use `verifyCronAuth()` middleware
- Commit messages: conventional commits (feat:, fix:, chore:, docs:)
- No `any` types — strict TypeScript
- Prefer server components; use `'use client'` only when needed
- i18n: every user-facing string goes through the translation system from day 1
- Images: use `next/image` with proper width/height/alt
- Links: use `next/link`
- File naming: kebab-case for files, PascalCase for components
- CSS: Tailwind utility classes — no custom CSS files except globals.css for tokens

## Env Vars
- DATABASE_URL — Neon Postgres connection string
- BLOB_READ_WRITE_TOKEN — Vercel Blob storage
- RESEND_API_KEY — Email (newsletter, transactional)
- STRIPE_SECRET_KEY — Payments (server)
- STRIPE_PUBLISHABLE_KEY — Payments (client)
- STRIPE_WEBHOOK_SECRET — Stripe webhook verification
- NEXT_PUBLIC_SITE_URL — Base URL for absolute links
- ANTHROPIC_API_KEY — AI chatbot

## Brand: Ranchita Dusk Palette
See src/app/globals.css for CSS custom properties.
Cool blue dominant with warm gold accents — like the last light over Ranchita mountains.
Primary (Dusk sky): #ECEEF5 → #1A2340 (10-stop gradient)
Accent (Cloud gold): #FEF8F0 → #5C3A10 (CTAs are gold-400 #E0A040)
Secondary (Terra earth): #FAF0EC → #4A2010
Success (Sage): #EEF2E8 → #243418
Neutrals (Stone): #F8F6F4 page bg → #1C1A18 darkest
Text: Warm stone (#2C2824 primary, #6A6460 secondary) — never pure black

## i18n
- English = default locale
- Spanish = co-primary (not secondary)
- All user-facing strings in translation files from day 1
- Spanish content can be placeholder text initially, but the STRUCTURE must support it

## Phase 1 Scope
Public site only. No admin dashboard.
Pages: Home, About/History, Programs, Blog, Donate, Contact, PCT
Newsletter signup, AI chatbot (placeholder OK), Stripe donations
