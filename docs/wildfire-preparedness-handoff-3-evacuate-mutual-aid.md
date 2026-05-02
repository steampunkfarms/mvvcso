# MVVCSO Wildfire Preparedness Resource — Handoff 3: Evacuate + Mutual Aid

> **Local copy of the canonical handoff.** Source of truth lives at:
> `/Users/ericktronboll/Projects/bts-governance/strategist/handoffs/2026-05-01-mvvcso-wildfire-prep-h3-evacuate-mutual-aid.md`
> If the two diverge, the bts-governance copy wins.

---

**Family:** BFOS
**Repo:** `steampunkfarms/mvvcso`
**Priority:** P2 — community-safety resource
**CChat session:** 2026-05-01
**Predecessor:** `2026-05-01-mvvcso-wildfire-prep-h2-prepare-animals.md`
**Successor planned:** none — final handoff in the wildfire-prep series

---

## What this handoff ships

Full content build-out of the final two spoke stubs:

- **Evacuate** — Set, Go, and Return phases with the day-of action
  detail; routes-from-Ranchita framing (S22 west toward Julian/Warner
  Springs, east toward Borrego, with the explicit note that live
  routing comes from authorities via Genasys/AlertSanDiego — no
  invented turn-by-turn); trigger points to leave during the watch
  rather than the warning; what-to-do-if-trapped (vehicle, home, on
  foot); apps and alerts deep dive (Genasys Protect, AlertSanDiego,
  SDG&E Alerts, Watch Duty, PulsePoint, AirNow); PSPS preparedness
  (notification cadence, Community Resource Centers, 211 enhanced
  support); smoke and air quality (AirNow, AQI categories, indoor
  protection, NIOSH N95/P100 mask guidance); re-entry safety;
  printable evacuate-phase checklist.
- **Mutual Aid** — the voice page. Ranchita ethos established in H1's
  hub neighbor-ethos paragraph, deepened here. How residents support
  firefighters without becoming obstacles. Year-round community work
  (pre-clearing roads, chipping days, water-source mapping, driveway
  access readiness). Neighbor check-in lists for at-risk households.
  Communications during incidents (phone trees, FRS/GMRS, ham radio,
  central rally point — because cell service is unreliable in Santa
  Anas). The help-vs-interference line. After-fire community
  recovery, including the long mental-health tail. Printable mutual-
  aid checklist.

Plus ~95 new translation keys across EN+ES (ES placeholder-prefixed
per the H1 pattern), and optional component extractions
(`<PhaseStageCard />`, `<AlertAppCard />`) at CC's discretion.

Approximately 4–6 files. No DB migrations. No env vars. No new
dependencies.

---

## Operator constraints carried forward

1. No Station 58 direct phone line — emergencies use 911.
2. No reference to Puerta La Cruz women's correctional firefighters,
   the Conservation Camp, CDCR, "Fox Fire," or any nearby
   correctional facility.
3. Standalone resource — no cross-site references.
4. No specific S22 turn-by-turn directions. Routes section describes
   the framework only; live routing is authority-set during incidents.

---

For the full handoff (sections §0 through §13), see the canonical copy
at:
`bts-governance/strategist/handoffs/2026-05-01-mvvcso-wildfire-prep-h3-evacuate-mutual-aid.md`

This BFOS-local stub exists for discoverability next to other mvvcso
planning docs. Full content is intentionally single-sourced in
bts-governance.

---

## Resource complete after this handoff ships

H3 closes out the wildfire-preparedness resource. The structure after
ship: hub plus four spokes (Prepare, Animals & Livestock, Evacuate,
Mutual Aid). Approximately 5 pages, 6 component primitives, 1 SVG
diagram, ~180 translation keys, fully standalone, fully i18n-structured,
fully print-aware, line-art only, elder-friendly palette, AAA-contrast,
no cross-site references. Ship-as-draft for MVVCSO Board review per the
H1 decision.

After H3 ships:
1. Frederick walks the full resource end-to-end at
   `/en/resources/wildfire-preparedness/...`.
2. Frederick decides on the lived-experience anecdote (H1 hub or H3
   mutual aid intro).
3. Frederick coordinates board review. Board-driven content edits
   become a v1.1 handoff.
4. Operator-led Spanish translation pass — search by `__TODO_ES__`
   prefix and translate.
