# Phase 7+ Roadmap: Fine Art Gallery & Print Shop

> **Date:** 2026-03-31
> **Status:** ROADMAPPED — Build after Phase 6 complete
> **From:** CChat (Research & Architecture)
> **Codename:** "Ranchita Light" (working title for the gallery)

---

## Concept

A fine art photography gallery and print shop integrated into the MVVCSO
platform. Two tracks:

1. **Frederick's Collection** — Professional landscape, wildlife, and
   community photography shot with high-end equipment. Curated, premium.

2. **Community Submissions** — Resident-submitted photos (mountain lions,
   bobcats, wildflower blooms, PCT vistas, storms, sunsets). Juried by
   admin. Revenue split: MVVCSO fundraiser cut + photographer credit.

### Print Fulfillment: Artelo + Printful (Dual Provider)

| Provider | Product Tier | Use Case |
|----------|-------------|----------|
| **Artelo** | Gallery-quality fine art prints | Canvas wraps, giclée, metal prints, framed. Museum-quality. $80-300+ price points. |
| **Printful** | Casual photo products | Posters, photo mugs, phone cases, postcards. $15-50 price points. Already integrated from Phase 5. |

This dual approach covers the full spectrum — serious art buyers get
gallery-grade product from Artelo, casual shoppers get affordable photo
merch from Printful. Same source photo feeds both.

---

## Revenue Model

| Item | Cost to Produce | Retail Price | MVVCSO Margin |
|------|----------------|-------------|---------------|
| 24x36 Canvas (Artelo) | ~$40-60 | $150-250 | $90-190 |
| 16x20 Giclée (Artelo) | ~$25-35 | $80-120 | $45-85 |
| Metal Print 12x18 (Artelo) | ~$35-50 | $100-175 | $50-125 |
| Framed 11x14 (Artelo) | ~$30-45 | $90-150 | $45-105 |
| Poster 18x24 (Printful) | ~$8-12 | $25-40 | $13-28 |
| Photo Mug (Printful) | ~$6-8 | $20-30 | $12-22 |
| Postcard Set (Printful) | ~$3-5 | $12-18 | $7-13 |

### Community Submission Revenue Split

| Scenario | Photographer | MVVCSO |
|----------|-------------|--------|
| Resident submission (fundraiser) | 0% (donation) or 30% (revenue share) | 100% or 70% |
| Featured photographer | 50% | 50% |
| Frederick's photos | 0% (it's his org) | 100% |

Admin configures split per photographer. Default: 100% to MVVCSO
(resident voluntarily donates the image for the cause). Option for
revenue share if the photographer prefers.

---

## Feature Set

### Public Gallery (`/gallery`)

- **Curated collections:**
  - "Ranchita Skies" — Sunrise, sunset, storm, star photography
  - "Wildlife of the Backcountry" — Mountain lions, bobcats, coyotes, raptors, rattlesnakes
  - "The Hard Land" — Desert landscapes, chaparral, boulders, the valley
  - "PCT Through Our Backyard" — Trail photography
  - "Community Life" — Events, gatherings, the Rancheti, Station 58
  - "Seasons" — Wildflower blooms, snow on mountains, summer heat, fall color
- **Photo detail page:**
  - Full-resolution preview (watermarked)
  - Photographer credit + bio
  - Location and story (where/when/how the shot was captured)
  - Print options: size selector, medium (canvas/giclée/metal/framed/poster)
  - Live price calculator based on selections
  - "Buy Print" → Stripe Checkout
  - "This purchase supports MVVCSO community programs" trust badge
- **Lightbox viewer** — Full-screen browse through collection
- **Bilingual** — Descriptions in EN/ES

### Community Photo Submissions (`/gallery/submit`)

- Resident uploads high-res photo (minimum 3000px on long edge for print quality)
- Metadata form: title, description, location, date taken, category
- Release agreement: grants MVVCSO permission to sell prints
- Revenue split selection: "Donate 100% to MVVCSO" or "50/50 revenue share"
- Photo enters moderation queue
- Admin reviews: approve (with quality check for print resolution), reject, request higher res
- Approved photos appear in gallery with photographer credit

### Admin Gallery Management (`/admin/gallery`)

- **Submissions queue** — Review, approve, reject community photos
- **Collections** — Create/manage curated collections
- **Photographers** — List of contributors, their photos, total revenue generated
- **Products** — Map photos to print options (which sizes available per photo)
- **Orders** — Print orders from both Artelo and Printful
- **Revenue** — Per-photo revenue, per-photographer payouts, total gallery revenue

### Print Ordering Flow

```
Customer selects photo + print options (size, medium, framing)
    ↓
Calculate price based on Artelo/Printful cost + MVVCSO markup
    ↓
Stripe Checkout (MVVCSO is merchant of record)
    ↓ webhook: checkout.session.completed
If gallery-quality (canvas, giclée, metal, framed):
    → Submit order to Artelo API (or manual fulfillment if no API)
If casual (poster, mug, postcard):
    → Submit order to Printful API (existing Phase 5 integration)
    ↓
Track fulfillment → send shipping notification
    ↓
If revenue share: calculate photographer payout → queue for payment
```

### Artelo Integration

Research needed on Artelo's API capabilities:
- If Artelo has an API: integrate like Printful (automated order submission)
- If Artelo is manual-only: admin receives order notification, manually
  submits to Artelo, enters tracking number. Still works — just not automated.
- Alternative fine art print providers to evaluate:
  - **Fine Art America / Pixels** — has API, large catalog of print options
  - **Prodigi** — has REST API, museum-quality prints, global fulfillment
  - **Gooten** — has API, good print quality, competitive pricing
  - **WHCC (White House Custom Colour)** — pro-grade, no public API but great quality

CC should research which provider has the best API + quality + pricing
combination at build time.

---

## Schema (Draft)

```ts
export const galleryPhotos = pgTable('gallery_photos', {
  id: uuid('id').primaryKey().defaultRandom(),
  photographerId: uuid('photographer_id').references(() => authUsers.id),
  photographerName: text('photographer_name').notNull(), // For non-registered contributors
  title: text('title').notNull(),
  titleEs: text('title_es'),
  description: text('description'),
  descriptionEs: text('description_es'),
  category: text('category').notNull(),
  // 'skies' | 'wildlife' | 'landscape' | 'pct' | 'community' | 'seasons'
  originalUrl: text('original_url').notNull(), // Full-res in Vercel Blob
  previewUrl: text('preview_url').notNull(), // Watermarked preview
  thumbnailUrl: text('thumbnail_url').notNull(),
  width: integer('width'), // pixels
  height: integer('height'), // pixels
  location: text('location'),
  dateTaken: timestamp('date_taken'),
  camera: text('camera'), // EXIF: camera model
  lens: text('lens'), // EXIF: lens
  settings: text('settings'), // EXIF: ISO, aperture, shutter speed
  collectionId: uuid('collection_id').references(() => galleryCollections.id),
  revenueShare: integer('revenue_share').default(0), // photographer's % (0 = full donation)
  status: text('status').notNull().default('pending'),
  // 'pending' | 'approved' | 'featured' | 'rejected' | 'archived'
  totalRevenue: integer('total_revenue').default(0), // cents — total sales from this photo
  printsSold: integer('prints_sold').default(0),
  isFeatured: boolean('is_featured').default(false),
  approvedBy: uuid('approved_by').references(() => authUsers.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const galleryCollections = pgTable('gallery_collections', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  nameEs: text('name_es'),
  description: text('description'),
  descriptionEs: text('description_es'),
  coverPhotoId: uuid('cover_photo_id'),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const galleryPrintOptions = pgTable('gallery_print_options', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(), // "24x36 Canvas Wrap"
  provider: text('provider').notNull(), // 'artelo' | 'printful' | 'prodigi'
  medium: text('medium').notNull(), // 'canvas' | 'giclee' | 'metal' | 'framed' | 'poster' | 'mug'
  size: text('size').notNull(), // "24x36" | "16x20" | etc.
  baseCost: integer('base_cost').notNull(), // cents — what provider charges
  retailPrice: integer('retail_price').notNull(), // cents — what customer pays
  providerProductId: text('provider_product_id'), // ID in Artelo/Printful catalog
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').default(0),
});

export const galleryOrders = pgTable('gallery_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  photoId: uuid('photo_id').notNull().references(() => galleryPhotos.id),
  printOptionId: uuid('print_option_id').notNull().references(() => galleryPrintOptions.id),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  shippingAddress: text('shipping_address_json').notNull(),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  subtotal: integer('subtotal').notNull(), // cents
  shipping: integer('shipping').notNull(), // cents
  total: integer('total').notNull(), // cents
  providerCost: integer('provider_cost').notNull(), // cents
  mvvcsoRevenue: integer('mvvcso_revenue').notNull(), // cents
  photographerPayout: integer('photographer_payout').default(0), // cents
  status: text('status').notNull().default('pending'),
  providerOrderId: text('provider_order_id'),
  trackingNumber: text('tracking_number'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
```

---

## Content Pipeline

The gallery feeds from and into the rest of the platform:

```
Resident takes photo of mountain lion
    ↓
Uploads to /gallery/submit
    ↓ (admin approves)
Photo appears in Gallery (for sale as prints)
    ↓ (simultaneously)
Auto-posted to Ranchita Commons ("New gallery photo!")
    ↓ (AI repurpose from Phase 4)
Cross-posted to Facebook/Instagram
    ↓ (if featured)
Featured in next newsletter ("Photo of the Month")
    ↓ (if purchased as print)
Revenue tracked in Treasurer's suite
    ↓ (if photographer has revenue share)
Photographer payout calculated and queued
```

---

## Technical Notes

### Image Quality Requirements
- Minimum 3000px on long edge for fine art prints
- Accept: JPEG, TIFF, PNG (TIFF preferred for print quality)
- Auto-extract EXIF data (camera, lens, settings, GPS if available)
- Generate watermarked preview (overlay "MVVCSO" or Rancheti logo diagonally)
- Generate thumbnail (400px) for grid display
- Store originals in Vercel Blob (or S3 if files get large)

### Watermarking
- Server-side watermark generation on upload (sharp or Jimp)
- Subtle, semi-transparent diagonal text + Rancheti logo
- Watermark on preview/web display only — original stays clean for print fulfillment

### Print Quality Check
- AI or rule-based check: is the image high enough resolution for the requested print size?
- Minimum DPI by size: 300 DPI for up to 16x20, 200 DPI for larger
- Warn customer if selected size may result in lower quality
- Block orders below minimum quality threshold

---

## Estimated Build Effort

- **Phase 7a:** Gallery core — collections, photo management, public gallery page (1-2 sessions)
- **Phase 7b:** Community submissions + moderation queue (1 session)
- **Phase 7c:** Print ordering + Artelo/Printful fulfillment integration (1-2 sessions)
- **Phase 7d:** Photographer payouts + revenue tracking integration (1 session)

Total: ~5-6 CC sessions. Standalone — doesn't block or depend on Phase 6 (kids/genealogy).

---

## Frederick Actions (When Ready)

1. Research Artelo API availability (or choose alternative: Prodigi, Fine Art America)
2. Curate initial photo collection (10-20 best landscape/wildlife shots)
3. Set standard pricing tiers per print size/medium
4. Decide default community submission split (100% donation vs. revenue share)
5. Create Artelo account + get API credentials (if API available)

---

## Why This Works for MVVCSO

- **Revenue with zero inventory** — Same print-on-demand model as merch, higher margins
- **Community engagement** — Residents become invested contributors, not just consumers
- **Tourism appeal** — PCT hikers + backcountry visitors = customers for landscape prints
- **Grant amplification** — "Our community art gallery generates revenue while celebrating local culture" looks incredible in applications
- **Content multiplier** — Every photo feeds Commons, social, newsletter, AND the store
- **Ranchita brand** — Establishes the community as a place with visual identity and artistic culture, not just "a remote area with bad internet"

---

*The Rancheti stands guard over the gallery too.*
*Mountain lions sold separately.*
