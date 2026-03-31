# PRIORITY: Demo-Ready Push — Gatekeeper Presentation

> **Date:** 2026-03-31
> **From:** CChat
> **To:** CC
> **Context:** Frederick needs to demonstrate the platform to the MVVCSO
> gatekeeper who controls the GoDaddy account. Once convinced, the gatekeeper
> hands over DNS control → we point mvvcso.org → Vercel, set MX records → 
> Resend is live → board gets @mvvcso.org emails → board votes on cutover.
>
> **Strategy:** BREADTH OVER DEPTH. Every major section should be navigable
> and look intentional. Features that aren't fully wired yet get a polished
> "launching soon" treatment, not a broken state. The gatekeeper is evaluating
> "should I trust this team with our domain?" not "does the ballot crypto work?"

---

## Read Order

1. **This file first** — sets the priorities
2. Then continue with `phase5-marketplace-handoff.md` and
   `phase6-kids-genealogy-handoff.md` as implementation references
3. Phase 4 deferred items come AFTER the demo push

---

## Priority 1: Finish Phase 4 Surface Polish (1 session)

These are visible holes that hurt the demo. Fix before adding new features.

```
⬜ 1.  Build /community/post/[id] — single post view with comment thread
       (The feed works but clicking a post goes nowhere)
⬜ 2.  Build /marketplace/[id] — listing detail page with photos + seller info
       (Grid shows listings but clicking goes nowhere)
⬜ 3.  Build /community/profile — display name, bio, avatar editor
       (Users register but can't set up their profile)
⬜ 4.  Build marketplace messaging — basic thread per listing
       (Seller needs a way to be contacted)
⬜ 5.  Wire "Message Seller" button on listing detail
⬜ 6.  Add unread message indicator to nav
```

Skip for now (do after DNS handover):
- Ballot create form + voting UI + crypto voterHash
- Social media AI repurposing + Facebook API
- Bylaws interactive explainer (needs bylaws content)
- Activity log wiring (invisible to gatekeeper)

---

## Priority 2: Phase 5 — Merch Shop Scaffold (1-2 sessions)

The merch shop is the "wow" moment. Even without Printful API keys,
CC can build the full shop UI with placeholder products.

### What to build:

```
⬜ 7.  Add shop schema tables (shopProducts, shopVariants, shopOrders, shopOrderItems)
⬜ 8.  Build /shop page — product grid with category tabs
⬜ 9.  Build /shop/[id] — product detail with variant selector
⬜ 10. Build cart drawer (slide-out from header, localStorage state)
⬜ 11. Seed 6-8 demo products with placeholder Rancheti mockup images:
       - "Rancheti Guardian Tee" (S/M/L/XL, 3 colors) — $29.99
       - "I Survived the Ranchita Yeti Hoodie" — $49.99
       - "MVVCSO Community Mug" (11oz/15oz) — $18.99/$22.99
       - "Rancheti Die-Cut Sticker Pack" — $8.99
       - "Backcountry Strong Trucker Hat" — $24.99
       - "Ranchita Desert Tote Bag" — $19.99
       Use the Rancheti Yeti photos + AI-generated mockup descriptions.
       Mark all as "Coming Soon — Printful integration in progress"
       OR show full buy flow that gracefully says "Shop launching soon!"
       at checkout if Stripe/Printful keys aren't set.
⬜ 12. Build /admin/shop — orders list + product list + revenue stats
       (empty state with "Connect Printful to start selling" message)
⬜ 13. Add "Shop" to public nav bar
```

### Artisan Mercantile (scaffold only):

```
⬜ 14. Build /mercantile landing page — "Ranchita's Own Marketplace"
       Hero explaining the concept: local artisans sell handmade goods,
       MVVCSO takes a small commission to fund programs.
       "Apply to Sell" CTA button.
⬜ 15. Build /mercantile/apply — vendor application form
       (saves to artisanVendors table with status 'pending')
⬜ 16. Build /admin/mercantile — vendor applications list
⬜ 17. Seed 3-4 demo artisan products with placeholder data:
       - "Hand-Thrown Desert Sage Bowl" — $65 (pottery)
       - "Ranchita Wildflower Honey (16oz)" — $14 (preserves)
       - "Mesquite Wood Cutting Board" — $85 (woodwork)
       - "PCT Trail Marker Earrings" — $28 (jewelry)
⬜ 18. Build /mercantile product grid showing demo products
       Each card: "Featured Artisan Preview — Vendor portal launching soon"
⬜ 19. Add "Mercantile" to public nav bar
```

### Fundraising (scaffold):

```
⬜ 20. Build /admin/fundraising — campaign list (seed with "Ranchita Roots"
       campaign using existing data from the Zeffy/Ranchita Roots initiative)
⬜ 21. Build /donate/campaign/ranchita-roots — public campaign page with
       progress bar, impact framing, donate button (links to existing /donate)
```

---

## Priority 3: Phase 6 — Kids Portal Scaffold (1 session)

The kids portal is the single most impressive thing to show a gatekeeper.
No other rural nonprofit has anything like it. Even a scaffold with 2-3
working games and the cartoon creator demo is a knockout.

### What to build:

```
⬜ 22. Add kids schema tables (childAccounts, kidsBadges, kidsProgress,
       kidsEarnedBadges, kidsXp, kidsCartoons)
⬜ 23. Build /kids landing page — bright, warm, Rancheti as mascot
       "Welcome to Rancheti's Explorer Club!" with login form
       For demo: skip full COPPA consent flow, use a demo child account
⬜ 24. Build /kids/home — dashboard with XP bar, badge count, game grid
⬜ 25. Build /kids/games — game library with 8 game cards
⬜ 26. Build 2-3 WORKING games (pick the fastest to implement):
       - Desert Creature Match (memory card game — classic, fast to build)
       - Fire Safety Quiz (multiple choice — data-driven, fast)
       - Rancheti's Word Search (grid generator — moderate complexity)
⬜ 27. Remaining 5 games: show card with "Coming Soon!" badge + description
⬜ 28. Build /kids/badges — badge collection page with earned/unearned display
⬜ 29. Seed badge data (the 15 badges from Phase 6 spec)
⬜ 30. Build basic XP award on game completion
⬜ 31. Build /kids/create — cartoon creator with Konva.js
       Even a basic version (3 backgrounds, Rancheti + 4 animal sprites,
       text bubbles, save/load) is impressive
⬜ 32. Build /kids/privacy — COPPA privacy policy page
⬜ 33. Add "Kids" to nav bar (for demo — can gate behind auth later)
```

### Genealogy (scaffold only):

```
⬜ 34. Build /legacy landing page — "Build Your Ranchita Legacy"
       Hero with concept description, family tree illustration
       "Create Your Family Tree" + "Import from Ancestry" CTAs
⬜ 35. Build /legacy/my-trees — create tree form + empty tree list
⬜ 36. Build basic person editor (add first name, last name, dates, places)
⬜ 37. Build basic tree viewer — even a simple list/outline view of added
       persons is fine for demo. D3.js interactive graph is Phase 6d.
⬜ 38. If time: build GEDCOM import (this is the "holy shit" moment —
       Frederick imports his 100+ person Ancestry tree live during the demo)
⬜ 39. Build /legacy/oral-history landing — concept page with
       "Record an Oral History" button (functional recorder is Phase 6e)
⬜ 40. Add "Legacy" to nav bar (for demo)
```

---

## Priority 4: Cron Jobs + Twilio (quick wins)

```
⬜ 41. Set up vercel.json with cron definitions (even if routes are stubs)
⬜ 42. Build /api/cron/marketplace-expire (30-day listing expiry)
⬜ 43. Build src/lib/twilio.ts with graceful fallback
       (Log to console if keys not set — but the code is there)
⬜ 44. Add Twilio env var documentation to CLAUDE.md
```

---

## "Launching Soon" Pattern

For any feature that's scaffolded but not fully wired, use this consistent
treatment across the site:

```tsx
// components/shared/launching-soon.tsx
export function LaunchingSoon({ feature, description }: {
  feature: string;
  description: string;
}) {
  return (
    <div className="text-center py-12 px-6">
      {/* Rancheti illustration or icon */}
      <div className="text-4xl mb-4">🏔️</div>
      <h3 className="text-lg font-medium text-stone-800 mb-2">
        {feature} — Launching Soon
      </h3>
      <p className="text-sm text-stone-500 max-w-md mx-auto">
        {description}
      </p>
    </div>
  );
}
```

Use this for:
- Checkout when Stripe/Printful keys aren't set
- Artisan vendor portal before Stripe Connect is live
- Remaining kids games that aren't built yet
- Genealogy advanced features (property history, oral history recorder)
- Newsletter compose/send before Resend is fully configured

The key: it should look like a deliberate phased rollout, not a broken feature.

---

## Demo Walkthrough Script

When Frederick presents to the gatekeeper, the flow should be:

1. **Homepage** — Big sky hero, mission, programs, impact counters, partners
2. **About** — History timeline (scroll through 50 years), board grid
3. **Events** — Upcoming events with RSVP
4. **Blog** — Published articles
5. **Donate** — Professional donation flow
6. **Resources** — Document library
7. **PCT Trail** — Interactive map (unique differentiator)
8. **Community** — "Residents can register and connect"
   - Show the feed, channels, create a post
9. **Marketplace** — "Buy/sell/trade right in the community"
   - Show listings, filters, detail page
10. **Shop** — "Rancheti merch funds our programs"
    - Show product grid, variant selector, cart
11. **Mercantile** — "Local artisans sell through us"
    - Show concept + demo products
12. **Kids Portal** — "For our youngest residents"
    - Play a game, show badge system, open cartoon creator
13. **Legacy** — "Preserve your family's Ranchita story"
    - Show tree builder, mention GEDCOM import
14. **Admin Dashboard** — "The board runs everything from here"
    - KPIs, volunteer CRM, events, documents, meeting minutes, financials
15. **Close** — "All we need is the domain pointed here, and the board
    gets @mvvcso.org email addresses within the hour."

That's a 15-20 minute walkthrough that leaves no doubt.

---

## What This Does NOT Include

These items are explicitly deferred until AFTER the DNS handover:

- Ballot voting UI + crypto voterHash
- Social media AI repurposing + Facebook API integration
- Full Printful API integration (needs Printful account + API key)
- Full Stripe Connect integration (needs Stripe Connect setup)
- LiveKit video conferencing (needs LiveKit Cloud signup)
- Bylaws interactive explainer (needs bylaws content from Frederick)
- Newsletter compose/send (needs Resend domain verification → needs DNS)
- Activity log wiring across all API routes
- Full COPPA consent flow (for demo, use a pre-created child account)
- Full GEDCOM import (nice to have for demo, not blocking)
- Oral history browser recording
- D3.js interactive family tree (basic list view is fine for demo)
- Cross-tree matching engine
- Report generation (Ahnentafel, etc.)

All of these have handoff specs already written. CC picks them up post-handover.

---

## Task Summary

| Priority | Tasks | Sessions | Goal |
|----------|-------|----------|------|
| P1: Phase 4 surface polish | 1-6 | 1 | No dead links |
| P2: Phase 5 scaffold | 7-21 | 1-2 | Shop + mercantile visible |
| P3: Phase 6 scaffold | 22-40 | 1-2 | Kids + legacy visible |
| P4: Crons + Twilio stubs | 41-44 | 0.5 | Infrastructure ready |
| **Total** | **44** | **~4-5 sessions** | **Demo-ready** |

---

## After the Gatekeeper Says Yes

1. Frederick gets GoDaddy DNS credentials
2. Point mvvcso.org A/CNAME to Vercel
3. Add mvvcso.org as custom domain in Vercel project settings
4. Set MX/DKIM/SPF records for Resend
5. Verify domain in Resend dashboard
6. Board gets @mvvcso.org email addresses
7. Board reviews the platform
8. Board votes on cutover (using the ballot system we'll build post-handover)
9. Old GoDaddy site goes dark
10. mvvcso.org is the new MVVCSO

---

*Breadth over depth. Every section navigable. Nothing broken.*
*The gatekeeper sees the future. Then they hand over the keys.*
*CC implements. CChat does not write code.*
*The Rancheti is ready for the spotlight.*
