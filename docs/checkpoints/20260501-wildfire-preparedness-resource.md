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
8. ✅ **Standalone resource — no cross-site references.** Added
   2026-05-01 per operator clarification. The mvvcso wildfire-prep
   pages must be fully self-contained. **No links, mentions, or
   crosslinks to Steampunk Farms, the rescuebarn evacuation-go-bag
   page, or any other Anthropic-built site.** The Animals & Livestock
   spoke (Handoff 2) covers the complete go-bag/evacuation-kit content
   for animals on its own — not as an augment to anything else. The
   rescuebarn page remains the structural reference for CChat's drafting
   only; nothing about it appears in shipped mvvcso content.

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
  **Standalone, comprehensive coverage** (per operator clarification
  2026-05-01) — no crosslinks or references to other sites. Full
  evacuation-kit checklist for pets and livestock; multi-dog households
  (4–6 dogs is normal here); horses, goats, chickens; trailer practice
  + pre-identified destinations; shelter-in-place vs. evacuate calculus
  for livestock; hay storage; water-source dual-use; livestock water
  requirements; insurance documentation.
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

**Handoff 2 — Prepare phase + Animals/Livestock** — 📝 DRAFTED 2026-05-01,
awaiting CC execution
- Pre-draft research completed: CAL FIRE Zone 0/1/2 specs verified;
  San Diego County 50-ft Zone 1 confirmed (stricter than state minimum);
  2026 Title 24 / California Wildland-Urban Interface Code (CWUIC,
  Title 24 Part 7 — Chapter 7A relocated effective Jan 1 2026)
  noted; updated 2025 FHSZ map referenced (county VHFHSZ acreage up
  26%); large-animal evacuation site addresses and phone numbers
  verified from authoritative SD County / CAL FIRE / news sources.
- Operator clarification "standalone resource — no cross-site
  references" baked into Read-First, In/Out scope, content audit
  acceptance criteria, and standalone audit step.
- Both spoke pages drafted as complete content pages with full prose
  body, callout placement specs, printable checklists, seasonal
  maintenance calendar, evacuation destinations table, and ~80 new
  translation keys.
- New `<ZoneDiagram />` SVG component specified for prepare page.
- Files: `src/app/[locale]/resources/wildfire-preparedness/{prepare,
  animals-and-livestock}/page.tsx` (replace stub bodies),
  `src/components/resources/zone-diagram.tsx` (new),
  `messages/{en,es}.json` (extend wildfire_prep namespace), optional
  `src/components/resources/seasonal-calendar.tsx`, optional
  `src/app/[locale]/resources/page.tsx` ICONS map additions.
- Canonical handoff:
  `bts-governance/strategist/handoffs/2026-05-01-mvvcso-wildfire-prep-h2-prepare-animals.md`
  BFOS-local pointer:
  `mvvcso/docs/wildfire-preparedness-handoff-2-prepare-animals.md`

**Handoff 3 — Evacuate + Mutual Aid** — 📝 DRAFTED 2026-05-01,
awaiting CC execution (parallel-drafted while H2 was running)
- Pre-draft research completed: CAL FIRE Get Set / Get Ready to Go /
  Go Evacuation Guide pages verified; SD County Wildfire Preparedness
  Guide (alertsandiego.org) referenced; SDG&E PSPS notification
  cadence and 211 enhanced support verified; AirNow.gov AQI
  categories and CDC NIOSH N95/P100 respirator guidance verified;
  if-trapped guidance from CAL FIRE / Idaho Firewise / Fire Safe
  Marin cross-checked.
- Both spoke pages drafted as complete content pages with full prose
  body, callout placement specs, and printable checklists.
- ~95 new translation keys, ES placeholder-prefixed per H1/H2 pattern.
- S22 routing intentionally framework-only — no invented turn-by-turn.
  Genasys Protect / AlertSanDiego cited as the source of live routing.
- Files: `src/app/[locale]/resources/wildfire-preparedness/{evacuate,
  mutual-aid}/page.tsx` (replace stub bodies),
  `messages/{en,es}.json` (extend wildfire_prep namespace), optional
  `src/components/resources/{phase-stage-card,alert-app-card}.tsx`,
  optional `src/app/[locale]/resources/page.tsx` ICONS map additions.
- Canonical handoff:
  `bts-governance/strategist/handoffs/2026-05-01-mvvcso-wildfire-prep-h3-evacuate-mutual-aid.md`
  BFOS-local pointer:
  `mvvcso/docs/wildfire-preparedness-handoff-3-evacuate-mutual-aid.md`
- **Resource series complete from CChat's side after H3 ships.**
  Total: 5 pages, 6 component primitives, 1 SVG diagram, ~180 i18n
  keys EN+ES.

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

## Handoff 2 Delivery — Files Modified

**Status:** DEPLOYED — 4 commits pushed to origin/main (31992d1 → 64a2d9b)

### H2 modified files

- `messages/en.json` — extended `wildfire_prep.spokes.prepare` (13 sub-namespaces) and `wildfire_prep.spokes.animals` (18 sub-namespaces)
- `messages/es.json` — same keys, `__TODO_ES__` prefix on prose; site names, addresses, and phone numbers left un-prefixed (matching H1 contact convention)
- `src/app/[locale]/resources/wildfire-preparedness/prepare/page.tsx` — replaced stub with full content per H2 §6 (~340 lines)
- `src/app/[locale]/resources/wildfire-preparedness/animals-and-livestock/page.tsx` — replaced stub with full content per H2 §7 (~400 lines)

### H2 new files

- `src/components/resources/zone-diagram.tsx` — server component, top-down concentric SVG (Zone 0 solid, Zone 1/2 dashed), labels supplied by caller for i18n, `currentColor` strokes

### H2 EN/ES key parity

- `wildfire_prep.spokes` total leaf keys: 157 (EN) = 157 (ES)

### H2 Sanity Deltas Applied

- **Delta 1 (i18n placeholder convention):** ES values for proper-noun site names (`site_djlep_name` etc.), addresses (`site_*_address`), and phone numbers (`site_*_phone`, `info_line_value`) left un-prefixed. Reason: matches H1 pattern where `contacts.emergency_value` "911", `contacts.genasys_label` "Genasys Protect", and `contact.address` "37370 Montezuma Valley Rd…" are all un-prefixed in `messages/es.json`. Spec §8.2 said "prefix every value" but the live H1 code already established the proper-noun exception. Risk-reducing: avoids producing literally-translated street addresses or duplicated brand names. Scope unchanged.
- **Delta 2 (ICONS map skipped):** Spec §3 listed an optional commit "add new lucide icons to ICONS map (if needed)" — the H2 spoke pages did not introduce any new icons in `src/app/[locale]/resources/page.tsx` (all icons used are scoped to callout/print primitives that already import them). No edit to ICONS map needed.
- **Delta 3 (kit list semantics):** Spec §6/§7 had no specific HTML for the pet evacuation kit; initial draft used `<dl>`/`<dt>`/`<dd>`. Switched to `<ul>`/`<li>` with inline strong labels after lint flagged `<dl>` direct-child constraints. Functionally identical for screen readers (labeled list of items). Scope unchanged.

### H2 QA

- `tsc --noEmit`: PASS (zero errors)
- `eslint` on changed source files: PASS (zero errors/warnings)
- Prohibited terms audit (Station 58, Puerta La Cruz, Fox Fire, CDCR, Conservation Camp, "correctional"): PASS (none found in EN, ES, or page sources)
- Cross-site refs audit (steampunkfarms, rescuebarn, steampunk-farms, tronboll, "go-bag"): PASS (none found — animals page uses "go-kit" terminology)
- Standalone audit ("see Steampunk", "for the full checklist", "visit our partner", "see our other"): PASS (none found)
- All four primitive callouts used per spec §9.6:
  - Prepare: TipCallout (intro), CriticalCallout (Zone 0 regulatory), RequiredAction (Zone 1 SD County), TipCallout (chaparral)
  - Animals: TipCallout (intro, destinations pre-fill), RequiredAction (kit, destinations), CriticalCallout (shelter-in-place priority, trigger)

### H2 Commits

- `31992d1` feat(i18n): expand wildfire_prep namespace for prepare + animals spokes
- `64b9644` feat(resources): add ZoneDiagram component
- `0db1ea9` feat(resources): build out prepare spoke page with full content
- `64a2d9b` feat(resources): build out animals-and-livestock spoke page with full content

## Open for Frederick (post-Handoff 3 ship)

- **Walk the full resource end-to-end** — hub plus all four spokes
  — once H3 ships. This is the moment to decide whether the
  resource is in the shape Frederick wants before circulating to the
  MVVCSO Board for review.
- **Lived-experience anecdote decision** — the H1 hub neighbor-ethos
  paragraph and the H3 mutual-aid intro are both natural homes for
  Frederick's flare-up story (anonymized) if he gets comfort/
  permission from the involved neighbor. Both ship with the generic
  voice by default; either or both can swap in later.
- **Board review timing** — once Frederick is satisfied with the
  resource, coordinate MVVCSO Board review. Any board-driven content
  edits become a v1.1 handoff (small, content-only, no architectural
  changes).
- **Operator-led Spanish translation pass** — once all three
  handoffs ship, every Spanish key can be found by searching for the
  `__TODO_ES__` prefix and translated. This is the last structural
  step before public announce.
- **Chaparral fuel naming check** (carried from H2) — H2 names
  chamise, ceanothus, manzanita, and sage as Ranchita's dominant
  fuels. Frederick to confirm against ground truth on most parcels.
- **Destination phone/address verification** (carried from H2) —
  Dianne Jacob Lakeside Equestrian Park, Lakeside Rodeo Grounds,
  Iron Oak Canyon Ranch, Del Mar Fairgrounds, SDHS Emergency Response
  contact info verified 2026-05-01 but worth a spot-check post-ship.
