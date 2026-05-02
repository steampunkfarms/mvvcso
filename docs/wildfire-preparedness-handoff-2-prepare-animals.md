# MVVCSO Wildfire Preparedness Resource — Handoff 2: Prepare + Animals/Livestock

> **Local copy of the canonical handoff.** Source of truth lives at:
> `/Users/ericktronboll/Projects/bts-governance/strategist/handoffs/2026-05-01-mvvcso-wildfire-prep-h2-prepare-animals.md`
> If the two diverge, the bts-governance copy wins.

---

**Family:** BFOS
**Repo:** `steampunkfarms/mvvcso`
**Priority:** P2 — community-safety resource
**CChat session:** 2026-05-01
**Predecessor:** `2026-05-01-mvvcso-wildfire-prep-h1-foundation.md` (shipped)
**Successor planned:** Handoff 3 (Evacuate + Mutual Aid spokes)

---

## What this handoff ships

Full content build-out of two of the four spoke stubs from H1:

- **Prepare** — defensible space (Zone 0/1/2 with SD County's 50-ft Zone 1
  layered in), home hardening (roof, vents, eaves, windows, siding, decks,
  chimney, garage, fences) per the 2026 California Wildland-Urban Interface
  Code, rural-property specifics (outbuildings, propane, wells, driveways,
  solar), chaparral considerations, seasonal maintenance calendar, and
  printable inspection checklist.
- **Animals & Livestock** — fully standalone coverage (no cross-site
  references): multi-pet households, pet evacuation kit (food/water/meds/
  records/comfort/first-aid/transport), horses, goats/sheep/llamas,
  poultry, pigs, shelter-in-place protocols for animals when humans must
  leave first, pre-identified evacuation destinations (Dianne Jacob
  Lakeside Equestrian Park, Lakeside Rodeo Grounds, Iron Oak Canyon Ranch,
  Del Mar Fairgrounds, SD Humane Society Emergency Response), trailer
  practice calendar, insurance documentation, hay storage safety,
  dual-use water sources, evacuation triggers, and a printable animals
  pre-fire checklist.

Plus a new shared component (`<ZoneDiagram />` SVG) and a substantial
expansion of the `wildfire_prep` translation namespace (~80 new keys
across EN+ES, ES placeholder-prefixed per the H1 pattern).

Approximately 5–7 files. No DB migrations. No env vars. No new
dependencies.

---

## Operator constraints carried forward (must read before drafting)

1. No Station 58 direct phone line — emergencies use 911.
2. No reference to Puerta La Cruz women's correctional firefighters,
   the Conservation Camp, CDCR, "Fox Fire," or any nearby correctional
   facility.
3. **Standalone resource — no cross-site references.** Confirmed
   2026-05-01. The animals page is fully self-contained; no links,
   mentions, or crosslinks to Steampunk Farms, the rescuebarn
   evacuation-go-bag page, or any other non-government external site.

---

For the full handoff (sections §0 through §12), see the canonical copy at:
`bts-governance/strategist/handoffs/2026-05-01-mvvcso-wildfire-prep-h2-prepare-animals.md`

This BFOS-local stub exists for discoverability next to other mvvcso
planning docs. Full content is intentionally single-sourced in
bts-governance for Computer's strategist index.
