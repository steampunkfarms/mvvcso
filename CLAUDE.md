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

## Brand: Elder-Friendly Palette (WCAG AAA)
See src/app/globals.css for CSS custom properties.
Warm cream base, soft-saturated, elder-first — all section backgrounds ≥ 85% lightness.
No dark mode. No glare. No harsh contrasts. Designed for Ranchita seniors in bright sunlight.
Background: #F8F4EE (warm cream) | Surface: #FFFFFF (white cards/hero sections/modals)
Primary Accent: #E07F5C (sunset terracotta — Donate/Volunteer buttons, hover states)
Secondary Accent: #3D8C9E (sky teal — icons, progress bars, "Learn More")
Warm Highlight: #EFC9A0 (golden cloud glow — badges, ribbons, subtle borders)
Headings: #1C2B2F on #F8F4EE → 14:1 (AAA) | Body: #2F3E44 on #F8F4EE → 10:1 (AAA)
Muted text: #6B6355 (warm taupe) | Footer: #6B6355 on #F0EDE6
Links: #3D8C9E (teal) underlined, hover to #E07F5C (sunset) — never blue-only
Primary buttons: #E07F5C bg + white text | Secondary: #3D8C9E border + #2F3E44 text
Font sizes: Body 18px (1.125rem), Headings 28–36px, Mobile +2px everywhere

## i18n
- English = default locale
- Spanish = co-primary (not secondary)
- All user-facing strings in translation files from day 1
- Spanish content can be placeholder text initially, but the STRUCTURE must support it

## Handoff Sanity Check — MANDATORY

CChat (Strategist) designs from outside the codebase and does not follow execution
protocols. CC (Executor) sees production state and is the last line of defense
before changes hit live systems. **Every CChat handoff is a design, not a law.**

Before implementing any handoff, CC must run a Pre-Edit Sanity Pass:

1. **Data state check:** Query existing DB records, sent invoices, live assignments,
   and any state the handoff assumes or modifies. The handoff describes intent —
   the actual production data may have diverged.
2. **Conflict check:** Validate that the handoff does not contradict existing
   architecture, naming conventions, unique constraints, FK relationships, or
   live data (e.g., already-sent invoices tied to a record the handoff renames).
3. **Reversibility check:** Identify which steps affect already-sent, already-paid,
   or already-deployed records. Flag these for extra scrutiny.

- If clean: proceed with execution as mapped.
- If conflicts found: emit a **Sanity Delta** before proceeding:
  - What the handoff says vs. what production state shows
  - Minimal correction with file/anchor evidence
  - Risk if the handoff were followed as-written
  - Adjusted acceptance criteria (if needed)
  - Present the delta to the operator for approval before executing

### Bounded Deviation Rule

CC may deviate from handoff instructions only when ALL are true:

1. Evidence is file-anchored and reproducible
2. Deviation is minimal and risk-reducing
3. Scope does not expand materially

If scope expands, stop and request human confirmation.
All deviations must be logged as "Sanity Delta Applied" in the completion summary.

---

## Phase 1 Scope
Public site only. No admin dashboard.
Pages: Home, About/History, Programs, Blog, Donate, Contact, PCT
Newsletter signup, AI chatbot (placeholder OK), Stripe donations
