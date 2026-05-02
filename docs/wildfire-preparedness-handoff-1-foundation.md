# MVVCSO Wildfire Preparedness Resource — Handoff 1: Foundation + Hub

> **Local copy of the canonical handoff.** Source of truth lives at:
> `/Users/ericktronboll/Projects/bts-governance/strategist/handoffs/2026-05-01-mvvcso-wildfire-prep-h1-foundation.md`
> If the two diverge, the bts-governance copy wins.

---

**Family:** BFOS
**Repo:** `steampunkfarms/mvvcso`
**Priority:** P2 — community-safety resource, no live revenue or compliance
exposure
**CChat session:** 2026-05-01
**Author:** CChat (BFOS project space)
**Predecessor:** none — first handoff in the wildfire-prep series
**Successors planned:** Handoff 2 (Prepare + Animals/Livestock spokes) and
Handoff 3 (Evacuate + Mutual Aid spokes)
**Checkpoint:** `mvvcso/docs/checkpoints/20260501-wildfire-preparedness-resource.md`

---

## 0. Read first

This handoff stands up a new community-facing resource section on the
mvvcso site at `/resources/wildfire-preparedness`. It is a Ranchita-
tailored layer on top of CAL FIRE's *Ready for Wildfire* program and San
Diego County Fire's customized *Ready, Set, Go! Wildland Fire Action
Guide*. It is modeled structurally on the rescuebarn evacuation-go-bag
page (`steampunk-rescuebarn/src/app/resources/evacuation-go-bag/page.tsx`),
but built fresh against mvvcso's elder-friendly tokens, Tailwind v4
syntax, and `next-intl` translation system. **Do not copy-paste from
rescuebarn.** Patterns are reusable; tokens and primitives must be native
to mvvcso.

The full resource is a hub + four spokes. **Handoff 1 ships the hub and
the shared component primitives only.** The four spokes ship in Handoffs
2 and 3. After Handoff 1 lands, the hub page is publicly viewable with
its own content; spoke links resolve to "Coming soon" pages or 404 (CC's
choice — see §6.4). The hub is intentionally usable on its own.

**Two operator constraints baked into this handoff that CC must honor in
all draft content and ALL subsequent handoffs:**

1. **No Station 58 direct phone line.** Emergency reporting is 911.
   MVVCSO's general number is `(760) 782-8449` (already keyed at
   `messages/en.json contact.phone`). Do not invent or fetch any direct
   station line.
2. **No reference to Puerta La Cruz women's correctional firefighters,
   the Puerta La Cruz Conservation Camp, CDCR fire crews, "Fox Fire,"
   or any nearby correctional facility.** This is a deliberate omission
   pending operator-led permission outreach. If CC encounters this topic
   in a CAL FIRE source while researching, exclude it from generated
   copy. This rule applies to v1 and every subsequent handoff in this
   series.

---

## 1. Context

The mvvcso site already hosts a "Resources & Transparency" hub at
`src/app/[locale]/resources/page.tsx`, currently scoped to governance
documents (bylaws, policies, SOPs, forms, maps, minutes). The
`RESOURCE_CATEGORIES` array in `src/lib/transparency-docs.ts` drives the
hub's category cards. Adding wildfire preparedness expands this into
community-safety content alongside governance — a natural broadening, not
a new section.

The rescuebarn go-bag page is the structural reference for how to build
in-depth, checklist-heavy, print-aware resource pages. Its primitives
(`CriticalCallout`, `RequiredAction`, `TipCallout`, `NeverRule`,
`TopicJumpGrid`, `PrintButton`) do not exist in mvvcso. Handoff 1 builds
mvvcso-native versions of them, properly themed against the elder-
friendly palette and AAA contrast targets in `globals.css`.

Operator decisions (locked 2026-05-01):

- IA: hub + 4 spokes (this handoff: hub only)
- i18n: structural EN+ES from day 1, ES content pass before public
  announce (this handoff: hub keys only, ES placeholder = EN fallback)
- Print: CSS only at v1
- Visuals: line-art SVG only — no stock photos, no AI faces
- Sources: CAL FIRE *Ready for Wildfire* + SD County Fire *Ready, Set,
  Go!* are primary; MVVCSO board layers firsthand input post-build

---

## 2. Scope summary

### In scope (Handoff 1)

1. New component primitives (`callouts.tsx`, `topic-jump-grid.tsx`,
   `print-button.tsx`) under `src/components/resources/`.
2. New phase data lib (`src/lib/wildfire-phases.ts`) typed and ready
   for spoke pages to consume.
3. New hub page at `src/app/[locale]/resources/wildfire-preparedness/page.tsx`
   with full content draft (overview, Ranchita risk profile, ethos
   paragraph, Ready–Set–Go overview, contacts card, spoke index).
4. Hub icon SVG asset in `/public`.
5. Extension of `RESOURCE_CATEGORIES` (or carved-out parallel "Community
   Safety" section — see §6.5 for the decision tree) so the new
   resource is discoverable from the existing resources hub.
6. Translation keys for the hub in `messages/en.json` and `messages/es.json`.
7. Sitemap update to include `/resources/wildfire-preparedness`.

### Out of scope (DO NOT add in Handoff 1)

- ❌ **Spoke pages.** `prepare`, `animals-and-livestock`, `evacuate`,
  `mutual-aid` ship in Handoffs 2 and 3. Stub routes are fine; full pages
  are not.
- ❌ **Defensible-space zone SVG diagram** — that ships in Handoff 2 with
  the prepare spoke.
- ❌ **Hosted PDF downloads.** Print CSS only.
- ❌ **Any reference to a direct fire station line, Station 58 phone,
  Puerta La Cruz crew, Fox Fire, CDCR conservation camps, or nearby
  correctional facilities.** See §0.
- ❌ **Stock photography or AI-generated faces.** Line-art SVG only.
- ❌ **Reorganization of the existing resources hub layout** beyond
  surfacing the new category. Don't touch the governance category cards.
- ❌ **A new top-level nav entry.** Wildfire prep is reachable from
  Resources, not from the main nav. (If CC believes a main-nav entry is
  warranted, file a Sanity Delta — do not add unilaterally.)
- ❌ **Anonymized real-incident anecdote.** The hub copy uses a generic
  neighbor-ethos paragraph by default. Frederick will swap in a specific
  anecdote post-build only after he secures comfort/permission from the
  involved neighbor. CC must not invent or pull a specific anecdote from
  the operator's notes into shipping copy.
- ❌ **Translation of full English content into Spanish.** Spanish keys
  exist (per i18n requirement) but values may equal English fallback
  text marked with a `__TODO_ES__` prefix in the value, OR mirror the
  English string verbatim. CC's choice — be consistent. The full ES pass
  is operator-led, post-build.

---

## 3. Files Changed Summary

| File | Action | Notes |
|------|--------|-------|
| `src/components/resources/callouts.tsx` | Create | Four primitives: `CriticalCallout`, `RequiredAction`, `TipCallout`, `NeverRule`. Server components. |
| `src/components/resources/topic-jump-grid.tsx` | Create | `TopicJumpGrid` — array of `{ id, title, description, icon, href }` items rendered as cards. Server component. |
| `src/components/resources/print-button.tsx` | Create | Client component. `'use client'`. Calls `window.print()`. |
| `src/lib/wildfire-phases.ts` | Create | Typed array `WILDFIRE_PHASES` of `{ id, slug, label, summary }`. Used by hub jump grid; spoke pages will deepen in H2/H3. |
| `src/app/[locale]/resources/wildfire-preparedness/page.tsx` | Create | Hub page. Server component. Full content draft per §6. |
| `src/app/[locale]/resources/wildfire-preparedness/prepare/page.tsx` | Create | "Coming soon" stub (decision in §6.4). |
| `src/app/[locale]/resources/wildfire-preparedness/animals-and-livestock/page.tsx` | Create | "Coming soon" stub. |
| `src/app/[locale]/resources/wildfire-preparedness/evacuate/page.tsx` | Create | "Coming soon" stub. |
| `src/app/[locale]/resources/wildfire-preparedness/mutual-aid/page.tsx` | Create | "Coming soon" stub. |
| `src/lib/transparency-docs.ts` | Edit | Extend `RESOURCE_CATEGORIES` per §6.5 OR add a parallel `COMMUNITY_SAFETY_CATEGORIES` array — CC decides; document the choice in commit message and ship report. |
| `src/app/[locale]/resources/page.tsx` | Edit | Surface the new resource. Minimal change — add a card or section header. |
| `messages/en.json` | Edit | Add `wildfire_prep` namespace. |
| `messages/es.json` | Edit | Same keys, ES placeholder values. |
| `src/app/sitemap.ts` | Edit | Add `/resources/wildfire-preparedness` and the four spoke URLs. |
| `public/images/wildfire-preparedness-hero.svg` | Create | Line-art hero icon. ~64x64 viewBox, recoloured via CSS `currentColor` so it inherits the page palette. Subject: stylized shield with flame inside (recommended) or pine-and-flame motif. |

Approximately 14 files. No DB migrations. No env vars. No new dependencies.

---

For sections §4 through §13 (component shapes, phase data, hub page
structure, draft body copy, translation keys, hero icon, Sanity Pass,
acceptance criteria, commit order, out-of-scope reminders, and operator
action block), see the canonical copy at
`bts-governance/strategist/handoffs/2026-05-01-mvvcso-wildfire-prep-h1-foundation.md`.

This BFOS-local stub exists so the handoff is discoverable next to other
mvvcso planning docs (`docs/phase1-handoff.md`, etc.) without forcing CC
to navigate out of the repo. The full handoff content is intentionally
single-sourced in bts-governance to keep the strategist's view canonical.
