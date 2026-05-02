# Checkpoint: MVVCSO Wildfire Preparedness Resource

**Date:** 2026-05-01
**Session:** Handoff 1 execution — COMPLETE
**Status:** DEPLOYED — 8 commits pushed to origin/main (a771ace → 6f88729)

## Goal

Build a Ranchita-tailored, in-depth wildfire preparedness resource on the
mvvcso site, modeled on the rescuebarn evacuation-go-bag page
(`steampunk-rescuebarn/src/app/resources/evacuation-go-bag/page.tsx`,
~61KB / 17 sections, single-page, print-optimized, callout-heavy).

Layered onto official CAL FIRE / SD County Fire Ready–Set–Go guidance, with
Ranchita specifics: S22 summit position, chaparral fuels, downhill canyon
runs, Santa Ana wind season, Station 58 volunteer realities, and the multi-
animal/livestock reality of the area. Ethos: neighbor-helping-neighbor,
without becoming an obstacle to firefighters.

## Plan

### Architecture decisions — DECIDED 2026-05-01

1. ✅ **Hub + 4 spokes.** Confirmed.
2. ✅ **Structural i18n at v1.** All strings keyed in `messages/{en,es}.json`
   from Handoff 1; Spanish content is placeholder/EN-fallback at v1; full
   ES content pass before public announce.
3. ✅ **Ship as draft for board review.** This is not yet on the production
   domain. Frederick (former Board President) leads the build; the current
   board reviews after build and may request changes (he expects few
   substantive ones).
4. ✅ **Print CSS only at v1.** Hosted PDFs deferred to v1.1.
5. ✅ **Line-art SVG visuals only.** No stock photos, no AI faces. Defensible-
   space zone diagram will be hand-built SVG (Handoff 2).
6. ✅ **No Station 58 direct line — emergency reporting uses 911.** MVVCSO
   contact is `(760) 782-8449` (already in `messages/en.json contact.phone`).
   **Puerta La Cruz women's correctional firefighters: DO NOT REFERENCE.**
   Frederick wants permission before the page draws community attention to
   the nearby correctional facility — fickle public sentiment risk
   (community loves them during fires, may stigmatize them otherwise).
   Treat as out-of-scope for v1 and all subsequent handoffs until
   Frederick explicitly clears it.
7. ✅ **Sources:** CAL FIRE Ready for Wildfire program + SD County Fire's
   customized Ready, Set, Go! Wildland Fire Action Guide as primary
   sources; MVVCSO board may layer firsthand-experience input post-build.

### Proposed IA — hub + 4 spokes

- `/resources/wildfire-preparedness` — **Hub.** Why this matters in
  Ranchita; risk profile (S22, chaparral, single-egress, Santa Ana,
  volunteer Station 58); the neighbor-ethos paragraph (Frederick's
  flare-up anecdote, anonymized); Ready–Set–Go framework overview;
  index of sub-resources; emergency contacts card.
- `/resources/wildfire-preparedness/prepare` — **Prepare phase.**
  Defensible Space Zones 0/1/2 with slope adjustments and Ranchita
  large-parcel realities; home hardening (roofs, vents, eaves, decks,
  fences); rural-property specifics (propane, wells, solar, water tanks,
  outbuildings, driveway/access for fire trucks); seasonal maintenance
  calendar; printable inspection checklist.
- `/resources/wildfire-preparedness/animals-and-livestock` — **Animals.**
  Crosslink to Steampunk Farms go-bag page (augment, don't duplicate);
  multi-dog households (4–6 dogs is normal here); horses, goats,
  chickens; trailer practice + pre-identified destinations; shelter-in-
  place vs. evacuate calculus for livestock; hay storage; water-source
  dual-use.
- `/resources/wildfire-preparedness/evacuate` — **Set/Go phase.** S22
  routes (west toward Julian/Warner Springs, east toward Borrego);
  trigger points to leave early; what to do if trapped; alerts/apps
  (Genasys Protect, Watch Duty, AlertSanDiego, PulsePoint, SDG&E);
  SD County emergency phone list; re-entry safety.
- `/resources/wildfire-preparedness/mutual-aid` — **Community ethos.**
  How residents support firefighters without becoming obstacles;
  pre-clearing roads, chipping days, water-source mapping; neighbor
  check-in lists for elderly/disabled/many-animals households;
  communications during incidents; the boundaries of helpful vs.
  in-the-way.

Optional: `/resources/wildfire-preparedness/checklist` — print-only
condensed checklist if we want a single tear-off page.

### Implementation breakdown — three CC handoffs

**Handoff 1 — Foundation + Hub**
- New components: `src/components/resources/callouts.tsx` (Critical /
  Required / Tip / Never), `src/components/resources/topic-jump-grid.tsx`,
  `src/components/resources/print-button.tsx` — built fresh against
  mvvcso's elder-friendly tokens, NOT copy-pasted from rescuebarn.
- New data lib: `src/lib/wildfire-phases.ts` (Ready–Set–Go phase data).
- New hub page: `src/app/[locale]/resources/wildfire-preparedness/page.tsx`.
- Extend `src/lib/transparency-docs.ts` `RESOURCE_CATEGORIES` to include
  "Community Safety" alongside the governance docs (or carve out a
  parallel section — CC to decide based on the live IA).
- Translation keys in `messages/en.json` + `messages/es.json` (EN
  authored, ES placeholder).
- Update `src/app/sitemap.ts` and `src/app/[locale]/resources/page.tsx`
  surface card.
- Hero SVG icon asset in `/public`.

**Handoff 2 — Prepare phase + Animals/Livestock**
- `src/app/[locale]/resources/wildfire-preparedness/prepare/page.tsx`
- `src/app/[locale]/resources/wildfire-preparedness/animals-and-livestock/page.tsx`
- Defensible-space zone SVG diagram in `/public`.
- Translation keys.

**Handoff 3 — Evacuate + Mutual Aid**
- `src/app/[locale]/resources/wildfire-preparedness/evacuate/page.tsx`
- `src/app/[locale]/resources/wildfire-preparedness/mutual-aid/page.tsx`
- (Optional) `src/app/[locale]/resources/wildfire-preparedness/checklist/page.tsx`
- Translation keys.

Each handoff is self-contained; if a session times out mid-handoff, the
next session resumes from the most recent CC commit + this checkpoint.

## Context for Next Session

- The plan above is the planning-phase output; Frederick has NOT yet
  approved scope/IA. Open questions in the "Architecture decisions"
  list must be answered before any handoff is drafted.
- Rescuebarn page is the structural template (verified): metadata via
  `buildMetadata`, TOC + topic jump grid, `print:hidden` selectors,
  callout primitives, print-optimized checklist embedded as final
  section. Mvvcso doesn't have those primitives yet — Handoff 1 builds
  them.
- Mvvcso stack (verified from package.json): Next 16, Tailwind v4,
  next-intl, drizzle/Neon, Resend, Stripe. Locale routing under
  `[locale]`. Resources hub already exists at
  `src/app/[locale]/resources/page.tsx` and uses
  `RESOURCE_CATEGORIES` from `src/lib/transparency-docs.ts`.
- Mvvcso brand: elder-friendly palette per CLAUDE.md (warm cream
  #F8F4EE, sunset terracotta #E07F5C, sky teal #3D8C9E, golden cloud
  #EFC9A0); WCAG AAA, 18px body, no dark mode. Live tokens in
  `globals.css` use Tailwind v4 `@theme` syntax — `terra-*`, `sage-*`,
  `gold-*`, `stone-*`. CC should validate live token names before
  finalizing component styling.
- Rescuebarn callout component shapes (verified import): `CriticalCallout`,
  `NeverRule`, `RequiredAction`, `TipCallout` from
  `@/components/resources/callouts`. Mvvcso versions need to match
  contract but use mvvcso tokens.
- Voice: Frederick's own. "We" for team. First-responder calm in
  storm/outage sections; neighbor-to-neighbor in tech-tip equivalents.
  Sales lives in CTAs only — these are pure community-safety pages.
- "No photo placeholders" rule applies — line-art SVG only.

## Handoff 1 Delivery — Files Modified

### New files (8 commits, a771ace → 6f88729)
- `messages/en.json` — `wildfire_prep` namespace + `common.print` key
- `messages/es.json` — same namespace, all values `__TODO_ES__` prefixed
- `src/components/resources/callouts.tsx` — CriticalCallout, RequiredAction, TipCallout, NeverRule
- `src/components/resources/topic-jump-grid.tsx` — TopicJumpGrid + JumpItem type
- `src/components/resources/print-button.tsx` — 'use client' PrintButton
- `src/lib/wildfire-phases.ts` — WILDFIRE_PHASES typed array
- `public/images/wildfire-preparedness-hero.svg` — shield+flame line art, 64×64 viewBox
- `src/app/[locale]/resources/wildfire-preparedness/page.tsx` — hub page
- `src/app/[locale]/resources/wildfire-preparedness/prepare/page.tsx` — spoke stub
- `src/app/[locale]/resources/wildfire-preparedness/animals-and-livestock/page.tsx` — spoke stub
- `src/app/[locale]/resources/wildfire-preparedness/evacuate/page.tsx` — spoke stub
- `src/app/[locale]/resources/wildfire-preparedness/mutual-aid/page.tsx` — spoke stub

### Modified files
- `src/lib/transparency-docs.ts` — added COMMUNITY_SAFETY_CATEGORIES
- `src/app/[locale]/resources/page.tsx` — Community Safety section above governance grid; Flame icon added
- `src/app/sitemap.ts` — 5 new wildfire-prep URLs (hub + 4 spokes × en + es)

### Sanity Deltas Applied
- **Delta 1:** `Link` from `@/i18n/navigation` used (not `next/link`) for all internal links in topic-jump-grid and spoke stubs — matches live codebase locale-routing pattern.
- **Delta 2:** `Flame` icon added to ICONS map in resources/page.tsx (handoff assumed it existed; it did not).

### QA
- `tsc --noEmit`: PASS (zero errors)
- `eslint` on changed files: PASS (zero errors/warnings); 19 pre-existing errors in unrelated files
- Prohibited terms audit (Station 58, Puerta La Cruz, Fox Fire, CDCR, correctional facility): PASS (none found)
- All 8 commits pushed to origin/main

## Open for Frederick (post-Handoff 1)

- Lived-experience anecdote on the hub page: Frederick to confirm whether
  the flare-up story (anonymized) can be used, or whether v1 ships with a
  generic neighbor-ethos paragraph that he can later swap. Handoff 1 ships
  the generic version by default; the anecdote is a Frederick-edit-or-
  swap-in opportunity once he's comfortable.
- Board review timing — when Handoff 3 lands, Frederick coordinates board
  review. Any board-driven content edits become a v1.1 handoff.
