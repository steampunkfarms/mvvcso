# Phase 5 CC Handoff Spec — Marketplace & Revenue

> **Date:** 2026-03-31
> **From:** CChat (Research & Architecture)
> **To:** CC (Claude Code CLI)
> **Depends on:** Phase 4 COMPLETE (community accounts, commons, marketplace, balloting)
> **Checkpoint location:** `docs/checkpoints/`

---

## 0. What Phase 5 Delivers

Phase 5 turns MVVCSO into a revenue-generating platform. Two storefronts
under one roof: Rancheti-branded merch via print-on-demand, and a local
artisan marketplace with split payments. Plus fundraising automation that
makes campaigns and donor management self-service.

### Features:
1. **Rancheti Merch Shop** — Print-on-demand via Printful API. T-shirts, mugs, stickers, hats.
2. **Artisan Mercantile** — Local craftspeople sell through the platform. Stripe Connect for split payments.
3. **Fundraising Automation** — Campaign builder, pledge tracking, impact reports, automated thank-yous.
4. **Twilio Integration** — Layer SMS on Google Voice for hot lead alerts + event reminders.
5. **Cron Automation Suite** — Newsletters, social scheduling, volunteer summaries, donor reports.

### NOT in Phase 5:
- Kids portal (Phase 6)
- Genealogy suite (Phase 6)
- LiveKit video (deferred — standalone task)

---

## 1. Rancheti Merch Shop (`/shop`)

### 1.1 Architecture

```
Customer browses /shop
    ↓ (product data cached from Printful API)
Selects product + variant (size, color)
    ↓
Stripe Checkout (MVVCSO is merchant of record)
    ↓ (checkout.session.completed webhook)
Order created in Printful API (auto-fulfilled)
    ↓ (Printful prints, packs, ships)
Customer gets tracking email
    ↓
MVVCSO keeps markup (product price - Printful base cost)
```

Printful handles production, packaging, and shipping. MVVCSO never
touches inventory. Customer pays MVVCSO (via Stripe), MVVCSO pays
Printful (via billing method on Printful account). The margin is the
revenue.

### 1.2 Printful Setup (Frederick action)

1. Create Printful account at printful.com
2. Create store → select "Manual order platform / API"
3. Design products (upload Rancheti artwork, select product types):
   - T-shirts (unisex, women's, youth)
   - Hoodies
   - Mugs (11oz, 15oz)
   - Stickers (die-cut)
   - Hats (trucker, beanie)
   - Tote bags
   - Phone cases (stretch)
4. For each product: set design, choose mockup images, name the product
5. Go to Settings → API → create Private Token (all permissions)
6. Add billing method so Printful can charge for order fulfillment
7. Configure shipping (US domestic standard + express)

### 1.3 Schema

```ts
// Products are cached from Printful API, not stored as source of truth
export const shopProducts = pgTable('shop_products', {
  id: uuid('id').primaryKey().defaultRandom(),
  printfulSyncProductId: integer('printful_sync_product_id').notNull().unique(),
  name: text('name').notNull(),
  nameEs: text('name_es'),
  description: text('description'),
  descriptionEs: text('description_es'),
  category: text('category').notNull(),
  // 'apparel' | 'accessories' | 'drinkware' | 'stickers' | 'bags'
  thumbnailUrl: text('thumbnail_url'),
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').default(0),
  lastSyncedAt: timestamp('last_synced_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const shopVariants = pgTable('shop_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => shopProducts.id),
  printfulVariantId: integer('printful_variant_id').notNull().unique(),
  name: text('name').notNull(), // "Black / XL"
  sku: text('sku'),
  retailPrice: integer('retail_price').notNull(), // cents — what customer pays
  printfulPrice: integer('printful_price').notNull(), // cents — what Printful charges
  // Margin = retailPrice - printfulPrice
  currency: text('currency').notNull().default('USD'),
  imageUrl: text('image_url'),
  inStock: boolean('in_stock').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const shopOrders = pgTable('shop_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  stripeSessionId: text('stripe_session_id').unique(),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  printfulOrderId: integer('printful_order_id'),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  shippingAddress: text('shipping_address_json').notNull(), // JSON
  subtotal: integer('subtotal').notNull(), // cents
  shipping: integer('shipping').notNull(), // cents
  tax: integer('tax').default(0), // cents
  total: integer('total').notNull(), // cents
  printfulCost: integer('printful_cost'), // cents — what Printful charges us
  margin: integer('margin'), // cents — our take
  status: text('status').notNull().default('pending'),
  // 'pending' | 'paid' | 'submitted_to_printful' | 'in_production'
  // | 'shipped' | 'delivered' | 'cancelled' | 'failed'
  trackingNumber: text('tracking_number'),
  trackingUrl: text('tracking_url'),
  printfulStatusJson: text('printful_status_json'), // Raw status from Printful
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const shopOrderItems = pgTable('shop_order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => shopOrders.id),
  variantId: uuid('variant_id').notNull().references(() => shopVariants.id),
  quantity: integer('quantity').notNull().default(1),
  unitPrice: integer('unit_price').notNull(), // cents
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
```

### 1.4 Printful Product Sync

Cron job or manual trigger that:
1. Calls `GET https://api.printful.com/store/products` with auth header
2. For each product: fetch variants via `GET /store/products/{id}`
3. Upsert into `shopProducts` + `shopVariants` tables
4. Update prices, images, availability
5. Flag any products that disappeared from Printful (deactivate locally)

### 1.5 Public Shop Page (`/shop`)

- Product grid with category filter tabs (All, Apparel, Accessories, Drinkware, Stickers)
- Product card: mockup image, name, price range ("$24.99 - $39.99"), category badge
- Mobile: 2-column grid

### 1.6 Product Detail (`/shop/[id]`)

- Large product image (mockup from Printful)
- Product name + description (bilingual)
- Variant selector: color swatches + size dropdown
- Price (updates based on variant)
- Quantity selector
- "Add to Cart" button
- "MVVCSO keeps 100% of proceeds" trust message
- Size chart (pulled from Printful product data)

### 1.7 Cart + Checkout

Two options. Recommendation: **Option A** for simplicity.

**Option A: Stripe Checkout (simpler)**
- Cart stored in localStorage (or React state with persistence)
- "Checkout" → creates Stripe Checkout session with line items
- On `checkout.session.completed` webhook:
  - Create `shopOrders` record
  - Call Printful `POST /orders` to submit for fulfillment
  - Send confirmation email via Resend

**Option B: Custom cart page (more control)**
- `/shop/cart` page with editable quantities
- Shipping address form
- Stripe Elements for payment
- More code, more maintenance

### 1.8 Order Fulfillment Flow

```
Stripe webhook: checkout.session.completed
    ↓
Create shopOrders record (status: 'paid')
    ↓
POST https://api.printful.com/orders
  Body: { recipient: address, items: [{ sync_variant_id, quantity }] }
    ↓
Printful returns order ID → save to shopOrders.printfulOrderId
  Status → 'submitted_to_printful'
    ↓
Printful webhook (or polling): order status updates
  'in_production' → 'shipped' (with tracking number)
    ↓
Update shopOrders with tracking info
Send shipping notification email to customer
```

### 1.9 Admin — Shop Management (`/admin/shop`)

- **Orders list** — Status, customer, total, date. Filter by status.
- **Order detail** — Items, shipping info, Printful status, tracking.
- **Products** — List synced products, toggle active/inactive, edit descriptions.
- **Sync button** — Manual trigger to re-sync products from Printful.
- **Revenue stats** — Total sales, total margin, orders by month (Recharts chart).

### 1.10 API Routes

```
# Public
GET    /api/shop/products                — List active products
GET    /api/shop/products/[id]           — Product detail + variants
POST   /api/shop/checkout                — Create Stripe Checkout session
POST   /api/shop/webhook/stripe          — Stripe payment webhook
POST   /api/shop/webhook/printful        — Printful status webhook

# Admin
GET    /api/admin/shop/orders            — List orders
GET    /api/admin/shop/orders/[id]       — Order detail
POST   /api/admin/shop/sync              — Sync products from Printful
PATCH  /api/admin/shop/products/[id]     — Update product (descriptions, active state)
GET    /api/admin/shop/stats             — Revenue statistics
```

---

## 2. Artisan Mercantile (`/mercantile`)

### 2.1 Architecture

```
Artisan applies to sell → admin approves → Stripe Connect Express onboarding
    ↓
Artisan creates listings (pottery, honey, woodwork, etc.)
    ↓
Customer browses /mercantile → buys item
    ↓
Stripe Checkout with destination charge:
  - Customer pays $50
  - MVVCSO takes 10% ($5) application fee
  - Artisan receives $45 (minus Stripe's ~2.9%+30¢)
    ↓
Artisan handles fulfillment (local pickup or shipping)
```

### 2.2 Stripe Connect Setup

**Account type:** Express (recommended)
- Stripe handles onboarding, KYC, identity verification
- Artisan gets a lightweight Stripe dashboard for their payouts
- MVVCSO stays merchant of record

**Charge type:** Destination charges
- Customer payment goes to MVVCSO's Stripe account
- MVVCSO specifies `application_fee_amount` (commission)
- Stripe automatically transfers the rest to the artisan's connected account

### 2.3 Schema

```ts
export const artisanVendors = pgTable('artisan_vendors', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => authUsers.id).unique(),
  shopName: text('shop_name').notNull(),
  shopNameEs: text('shop_name_es'),
  bio: text('bio'),
  bioEs: text('bio_es'),
  avatarUrl: text('avatar_url'),
  bannerUrl: text('banner_url'),
  stripeConnectId: text('stripe_connect_id'), // acct_xxx from Stripe Connect
  stripeOnboardingComplete: boolean('stripe_onboarding_complete').default(false),
  commissionRate: integer('commission_rate').notNull().default(10), // percentage
  status: text('status').notNull().default('pending'),
  // 'pending' | 'approved' | 'active' | 'suspended' | 'closed'
  // pending → approved (admin approves) → active (Stripe onboarding done)
  categories: text('categories'), // JSON array of categories they sell
  location: text('location').default('Ranchita area'),
  contactMethod: text('contact_method'), // 'platform' | 'email' | 'phone'
  approvedBy: uuid('approved_by').references(() => authUsers.id),
  approvedAt: timestamp('approved_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const artisanProducts = pgTable('artisan_products', {
  id: uuid('id').primaryKey().defaultRandom(),
  vendorId: uuid('vendor_id').notNull().references(() => artisanVendors.id),
  title: text('title').notNull(),
  titleEs: text('title_es'),
  description: text('description').notNull(),
  descriptionEs: text('description_es'),
  category: text('category').notNull(),
  // 'pottery' | 'jewelry' | 'preserves' | 'honey' | 'art' | 'woodwork'
  // | 'textiles' | 'soap' | 'candles' | 'plants' | 'other'
  price: integer('price').notNull(), // cents
  compareAtPrice: integer('compare_at_price'), // cents — for "was $X" strikethrough
  photosJson: text('photos_json'), // JSON array of Vercel Blob URLs
  inventory: integer('inventory'), // null = unlimited (made-to-order)
  weight: text('weight'), // for shipping estimates
  dimensions: text('dimensions'),
  fulfillment: text('fulfillment').notNull().default('local_pickup'),
  // 'local_pickup' | 'seller_ships' | 'both'
  isActive: boolean('is_active').notNull().default(true),
  isFeatured: boolean('is_featured').default(false), // Admin can feature
  views: integer('views').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const artisanOrders = pgTable('artisan_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  vendorId: uuid('vendor_id').notNull().references(() => artisanVendors.id),
  buyerId: uuid('buyer_id').references(() => authUsers.id),
  buyerName: text('buyer_name').notNull(),
  buyerEmail: text('buyer_email').notNull(),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  subtotal: integer('subtotal').notNull(), // cents
  commission: integer('commission').notNull(), // cents — MVVCSO's cut
  vendorPayout: integer('vendor_payout').notNull(), // cents — artisan receives
  fulfillmentMethod: text('fulfillment_method').notNull(),
  shippingAddress: text('shipping_address_json'),
  status: text('status').notNull().default('pending'),
  // 'pending' | 'paid' | 'confirmed' | 'shipped' | 'delivered'
  // | 'picked_up' | 'cancelled' | 'refunded'
  trackingNumber: text('tracking_number'),
  vendorNotes: text('vendor_notes'), // Vendor communication to buyer
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const artisanOrderItems = pgTable('artisan_order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => artisanOrders.id),
  productId: uuid('product_id').notNull().references(() => artisanProducts.id),
  quantity: integer('quantity').notNull().default(1),
  unitPrice: integer('unit_price').notNull(), // cents
});
```

### 2.4 Vendor Onboarding Flow (Deferred Pattern)

The key insight from research: don't force full Stripe onboarding upfront.
Use deferred onboarding so artisans can list products immediately, then
complete Stripe verification when they get their first sale.

```
1. Resident applies at /mercantile/apply
   → Creates artisanVendors record (status: 'pending')
   → Admin notified

2. Admin approves at /admin/mercantile
   → Status → 'approved'
   → Creates minimal Stripe Connect Express account (country only)
   → Artisan notified: "You're approved! Start listing products."

3. Artisan creates listings at /mercantile/dashboard
   → Can list products immediately, no Stripe verification yet

4. First sale arrives → Artisan must complete Stripe onboarding
   → Redirect to Stripe-hosted onboarding (identity, bank, tax)
   → On completion: stripeOnboardingComplete = true, status → 'active'
   → Payout released
```

### 2.5 Public Mercantile (`/mercantile`)

- **Vendor spotlight** — Featured artisan at top (rotating or admin-picked)
- **Product grid** — All active artisan products, filterable by category
- **Product card** — Photo, title, price, vendor name, category badge
- **Search** — By product name, vendor name, category
- **Vendor profiles** — `/mercantile/vendor/[id]` — shop name, bio, all their products

### 2.6 Product Detail (`/mercantile/product/[id]`)

- Photo gallery (carousel or grid)
- Title, price, description (bilingual)
- Vendor info card (name, avatar, "member since", link to profile)
- Fulfillment info: "Local pickup in Ranchita" or "Seller ships"
- "Buy Now" button → Stripe Checkout with destination charge
- Quantity selector (respects inventory if set)
- "10% of your purchase supports MVVCSO programs" trust badge

### 2.7 Vendor Dashboard (`/mercantile/dashboard`)

Accessible to approved artisan vendors:

- **My Products** — List, create, edit, deactivate products
- **My Orders** — Orders to fulfill, status management
- **My Earnings** — Total earned, pending payouts, payout history
- **Shop Settings** — Edit shop name, bio, avatar, banner
- **Stripe Connect** — Link to Stripe Express dashboard, onboarding status

### 2.8 Admin — Mercantile Management (`/admin/mercantile`)

- **Vendor applications** — Pending applications to approve/reject
- **Active vendors** — List with status, products count, total sales
- **Vendor detail** — Profile, products, orders, Stripe Connect status
- **Products** — All artisan products across vendors (moderation)
- **Orders** — All artisan orders (oversight)
- **Commission settings** — Default rate (10%), per-vendor override
- **Featured artisan** — Pick who shows in the spotlight
- **Revenue stats** — Total GMV, total commission, top vendors

### 2.9 API Routes

```
# Public
GET    /api/mercantile/products          — List active artisan products
GET    /api/mercantile/products/[id]     — Product detail
GET    /api/mercantile/vendors           — List active vendors
GET    /api/mercantile/vendors/[id]      — Vendor profile + products
POST   /api/mercantile/checkout          — Stripe Checkout with Connect destination
POST   /api/mercantile/webhook           — Stripe webhook for artisan payments

# Vendor
POST   /api/mercantile/apply             — Apply to become vendor
GET    /api/mercantile/dashboard         — Vendor dashboard data
POST   /api/mercantile/products          — Create product
PATCH  /api/mercantile/products/[id]     — Update product
DELETE /api/mercantile/products/[id]     — Deactivate product
PATCH  /api/mercantile/orders/[id]       — Update order status (confirm, ship)
GET    /api/mercantile/onboarding        — Get Stripe onboarding link

# Admin
GET    /api/admin/mercantile/vendors     — List vendors (all statuses)
PATCH  /api/admin/mercantile/vendors/[id] — Approve/suspend vendor
GET    /api/admin/mercantile/orders      — All artisan orders
GET    /api/admin/mercantile/stats       — Revenue statistics
```

---

## 3. Fundraising Automation

### 3.1 Schema

```ts
export const campaigns = pgTable('campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  nameEs: text('name_es'),
  description: text('description'),
  descriptionEs: text('description_es'),
  goalAmount: integer('goal_amount'), // cents — null = no goal
  raisedAmount: integer('raised_amount').notNull().default(0), // cents — computed
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  coverImage: text('cover_image'),
  isActive: boolean('is_active').notNull().default(true),
  fund: text('fund').notNull().default('general'), // Links to Treasurer's fund tracking
  createdBy: uuid('created_by').references(() => authUsers.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const pledges = pgTable('pledges', {
  id: uuid('id').primaryKey().defaultRandom(),
  campaignId: uuid('campaign_id').references(() => campaigns.id),
  donorName: text('donor_name').notNull(),
  donorEmail: text('donor_email').notNull(),
  amount: integer('amount').notNull(), // cents
  frequency: text('frequency').notNull().default('one-time'),
  // 'one-time' | 'monthly' | 'quarterly' | 'annual'
  status: text('status').notNull().default('pledged'),
  // 'pledged' | 'fulfilled' | 'partially_fulfilled' | 'cancelled'
  fulfilledAmount: integer('fulfilled_amount').default(0), // cents
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
```

### 3.2 Campaign Builder (`/admin/fundraising`)

- **Campaign list** — Active and past campaigns with progress bars
- **Create campaign** — Name (EN/ES), description, goal, dates, cover image, linked fund
- **Campaign detail** — Progress bar, donor list, pledge list, impact metrics
- **Donation assignment** — Link incoming Stripe donations to campaigns
- **Impact report generator** — One-click: "This campaign raised $X, funding Y programs, serving Z families"
- **Email templates** — Thank-you, receipt, pledge reminder, campaign update

### 3.3 Public Campaign Pages (`/donate/campaign/[id]`)

- Campaign hero with cover image
- Progress bar (raised vs. goal) with animation
- Description (bilingual)
- Donor wall (first names only, opt-in)
- Donate button (pre-selects campaign in Stripe Checkout)
- Social sharing buttons
- Impact framing ("$25 = one emergency supply kit")

### 3.4 Automated Thank-Yous

When donation received (from existing Stripe webhook):
1. Immediate: Thank-you email with tax receipt
2. Day 3: Impact update email ("Here's what your donation is doing")
3. Day 30: Follow-up ("It's been a month since your gift. Here's the impact.")

Configurable per campaign in admin.

---

## 4. Twilio Integration

### 4.1 Setup

Layer Twilio on existing Google Voice number: (760) 782-8449.

**Env vars needed:**

| Var | Value |
|-----|-------|
| `TWILIO_ACCOUNT_SID` | From Twilio console |
| `TWILIO_AUTH_TOKEN` | From Twilio console |
| `TWILIO_PHONE_NUMBER` | Twilio number (or forward from Google Voice) |
| `TWILIO_MESSAGING_SERVICE_SID` | Optional — for branded messaging |

### 4.2 Use Cases

| Trigger | Action | Message |
|---------|--------|---------|
| Hot donation ($100+) | SMS to Treasurer | "MVVCSO: $100 donation from [name]" |
| New volunteer signup | SMS to Vol. Coordinator | "New volunteer application: [name]" |
| Event reminder (1 day before) | SMS to all RSVPs | "[Event] is tomorrow at [time]. See you there!" |
| Compliance deadline (7 days) | SMS to assigned officer | "Reminder: [task] due in 7 days" |
| Emergency announcement | SMS to all board members | Admin-triggered from dashboard |

### 4.3 Implementation

```ts
// src/lib/twilio.ts
import twilio from 'twilio';

const client = twilio(env.twilioSid, env.twilioToken);

export async function sendSMS(to: string, body: string) {
  if (!env.hasTwilio) {
    console.log(`[Twilio stub] To: ${to} — ${body}`);
    return;
  }
  await client.messages.create({
    to,
    from: env.twilioPhoneNumber,
    body,
  });
}
```

Graceful fallback: if Twilio keys aren't set, log the message and continue.

### 4.4 Admin SMS Settings (`/admin/settings/notifications`)

- Toggle SMS notifications per trigger type
- Configure phone numbers for each officer (stored on authUsers)
- Test SMS button ("Send test message to my phone")

---

## 5. Cron Automation Suite

### 5.1 Vercel Cron Jobs

Add to `vercel.json`:

```json
{
  "crons": [
    { "path": "/api/cron/newsletter-scheduled", "schedule": "0 9 * * MON" },
    { "path": "/api/cron/social-publish", "schedule": "*/15 * * * *" },
    { "path": "/api/cron/volunteer-summary", "schedule": "0 8 * * MON" },
    { "path": "/api/cron/donor-monthly-report", "schedule": "0 9 1 * *" },
    { "path": "/api/cron/compliance-reminders", "schedule": "0 9 * * *" },
    { "path": "/api/cron/marketplace-expire", "schedule": "0 3 * * *" },
    { "path": "/api/cron/ballot-lifecycle", "schedule": "0 * * * *" },
    { "path": "/api/cron/printful-sync", "schedule": "0 6 * * *" }
  ]
}
```

### 5.2 Cron Route Details

| Route | Schedule | What It Does |
|-------|----------|-------------|
| `newsletter-scheduled` | Mon 9 AM | Send any newsletters scheduled for today |
| `social-publish` | Every 15 min | Publish any social posts scheduled for now |
| `volunteer-summary` | Mon 8 AM | Email weekly volunteer hours summary to coordinators |
| `donor-monthly-report` | 1st of month 9 AM | Email monthly donation report to Treasurer |
| `compliance-reminders` | Daily 9 AM | Send SMS/email for tasks due in 30/14/7 days |
| `marketplace-expire` | Daily 3 AM | Expire listings older than 30 days |
| `ballot-lifecycle` | Hourly | Open/close ballots at scheduled times |
| `printful-sync` | Daily 6 AM | Sync product data from Printful API |

All cron routes use `verifyCronAuth()` middleware (Vercel's `CRON_SECRET` header).

---

## 6. Updated Navigation

### Public nav additions:
```
(existing) ... | Shop | Mercantile
```

### Authenticated nav additions:
```
(existing) ... | Shop | Mercantile | [Vendor Dashboard if vendor]
```

### Admin sidebar additions:
```
(existing)
🛍️ Shop               /admin/shop              ← NEW
🏪 Mercantile          /admin/mercantile        ← NEW
🎯 Fundraising         /admin/fundraising       ← NEW
```

---

## 7. File Tree (Phase 5 Additions)

```
src/app/
├── shop/
│   ├── page.tsx                    # Merch product grid
│   ├── [id]/
│   │   └── page.tsx                # Product detail
│   └── cart/
│       └── page.tsx                # Cart (if Option B)
├── mercantile/
│   ├── page.tsx                    # Artisan product grid
│   ├── product/
│   │   └── [id]/
│   │       └── page.tsx            # Artisan product detail
│   ├── vendor/
│   │   └── [id]/
│   │       └── page.tsx            # Vendor profile + products
│   ├── apply/
│   │   └── page.tsx                # Vendor application form
│   └── dashboard/
│       ├── page.tsx                # Vendor dashboard
│       ├── products/
│       │   ├── page.tsx            # My products
│       │   └── new/
│       │       └── page.tsx        # Create product
│       ├── orders/
│       │   └── page.tsx            # My orders
│       └── earnings/
│           └── page.tsx            # My earnings + payouts
├── donate/
│   └── campaign/
│       └── [id]/
│           └── page.tsx            # Public campaign page
├── admin/(protected)/
│   ├── shop/
│   │   ├── page.tsx                # Shop orders + products
│   │   └── [id]/
│   │       └── page.tsx            # Order detail
│   ├── mercantile/
│   │   ├── page.tsx                # Vendor management
│   │   └── [id]/
│   │       └── page.tsx            # Vendor detail
│   └── fundraising/
│       ├── page.tsx                # Campaign list
│       └── new/
│           └── page.tsx            # Create campaign
├── api/
│   ├── shop/                       # Merch API routes
│   ├── mercantile/                 # Artisan API routes
│   ├── admin/shop/                 # Admin shop routes
│   ├── admin/mercantile/           # Admin mercantile routes
│   ├── admin/fundraising/          # Campaign CRUD
│   └── cron/                       # All cron jobs

src/components/
├── shop/
│   ├── product-card.tsx
│   ├── variant-selector.tsx
│   ├── cart-widget.tsx             # Mini cart in header
│   └── cart-drawer.tsx             # Slide-out cart
├── mercantile/
│   ├── artisan-product-card.tsx
│   ├── vendor-card.tsx
│   ├── vendor-application-form.tsx
│   └── vendor-dashboard-nav.tsx
├── fundraising/
│   ├── campaign-card.tsx
│   ├── progress-bar.tsx
│   ├── donor-wall.tsx
│   └── impact-stat.tsx

src/lib/
├── printful.ts                     # Printful API client
├── stripe-connect.ts               # Stripe Connect helpers
├── twilio.ts                       # SMS helpers
└── cron-auth.ts                    # verifyCronAuth() middleware
```

---

## 8. New Dependencies

```bash
npm install twilio                   # SMS
npm install stripe                   # Already installed — just adding Connect usage
# Printful API is REST — use fetch(), no SDK needed
```

---

## 9. Env Vars (Frederick to add)

| Var | Service | Blocking? |
|-----|---------|-----------|
| `PRINTFUL_API_KEY` | Printful | Yes — for merch shop |
| `STRIPE_CONNECT_CLIENT_ID` | Stripe Connect | Yes — for artisan marketplace |
| `TWILIO_ACCOUNT_SID` | Twilio | No — graceful fallback |
| `TWILIO_AUTH_TOKEN` | Twilio | No — graceful fallback |
| `TWILIO_PHONE_NUMBER` | Twilio | No — graceful fallback |
| `CRON_SECRET` | Vercel | Yes — for cron auth |

---

## 10. Phase 5 Task Checklist

### Phase 5a: Merch Shop (Session 1-2)

```
⬜ 1.  Add shop tables to schema (shopProducts, shopVariants, shopOrders, shopOrderItems)
⬜ 2.  Run drizzle-kit generate + push
⬜ 3.  Build src/lib/printful.ts (API client: list products, get product, create order)
⬜ 4.  Build product sync route (/api/admin/shop/sync + /api/cron/printful-sync)
⬜ 5.  Build /shop page — product grid with category tabs
⬜ 6.  Build /shop/[id] — product detail with variant selector
⬜ 7.  Build cart (localStorage or React state + cart drawer in header)
⬜ 8.  Build /api/shop/checkout — Stripe Checkout session with line items
⬜ 9.  Build /api/shop/webhook/stripe — create order + submit to Printful
⬜ 10. Build /api/shop/webhook/printful — receive status updates
⬜ 11. Build order confirmation email (Resend)
⬜ 12. Build /admin/shop — orders list + products list + sync button + revenue stats
⬜ 13. Add "Shop" to nav bar
⬜ 14. Write checkpoint
```

### Phase 5b: Artisan Mercantile (Session 2-3)

```
⬜ 15. Add artisan tables (artisanVendors, artisanProducts, artisanOrders, artisanOrderItems)
⬜ 16. Run drizzle-kit generate + push
⬜ 17. Build src/lib/stripe-connect.ts (create account, onboarding link, destination charge)
⬜ 18. Build /mercantile/apply — vendor application form
⬜ 19. Build /admin/mercantile — vendor approval + management
⬜ 20. Build Stripe Connect Express onboarding flow (deferred pattern)
⬜ 21. Build /mercantile page — artisan product grid with category filter
⬜ 22. Build /mercantile/product/[id] — product detail + buy now
⬜ 23. Build /mercantile/vendor/[id] — vendor profile + their products
⬜ 24. Build /api/mercantile/checkout — Stripe Checkout with destination charge
⬜ 25. Build /api/mercantile/webhook — payment confirmation + vendor notification
⬜ 26. Build /mercantile/dashboard — vendor dashboard (products, orders, earnings)
⬜ 27. Build vendor product CRUD (create/edit/deactivate)
⬜ 28. Build vendor order management (confirm, ship, mark delivered)
⬜ 29. Add "Mercantile" to nav bar
⬜ 30. Write checkpoint
```

### Phase 5c: Fundraising + Twilio + Crons (Session 3-4)

```
⬜ 31. Add campaigns + pledges tables to schema
⬜ 32. Run drizzle-kit generate + push
⬜ 33. Build /admin/fundraising — campaign list + create/edit
⬜ 34. Build /donate/campaign/[id] — public campaign page with progress bar
⬜ 35. Build donation → campaign assignment logic
⬜ 36. Build automated thank-you email sequence (immediate + day 3 + day 30)
⬜ 37. Build impact report generator
⬜ 38. Install + configure Twilio (src/lib/twilio.ts)
⬜ 39. Wire SMS triggers (hot donation, volunteer signup, event reminder, compliance)
⬜ 40. Build admin notification settings (/admin/settings/notifications)
⬜ 41. Build all cron routes (§5.2 — 8 cron jobs)
⬜ 42. Add crons to vercel.json
⬜ 43. Build verifyCronAuth middleware
⬜ 44. Add Shop, Mercantile, Fundraising to admin sidebar
⬜ 45. Activity log: wire all Phase 5 actions
⬜ 46. Responsive QA: shop + mercantile on mobile
⬜ 47. Final checkpoint: Phase 5 COMPLETE
```

---

## 11. Revenue Model Summary

| Stream | Mechanism | Est. Annual |
|--------|-----------|-------------|
| Donations (Stripe direct) | Existing — enhanced with campaigns | $5K–15K |
| Merch (Rancheti swag) | Markup over Printful base cost | $2K–5K |
| Artisan commissions | 10% of artisan GMV via Stripe Connect | $1K–3K |
| Grants | Enabled by platform professionalism | $10K–50K+ |

**Key point:** MVVCSO keeps 100% of merch markup (no vendor split — it's their brand).
Artisan mercantile uses the 10% commission model. Both feed into the Treasurer's
fund tracking system from Phase 3.

---

## 12. Reminders for CC

1. **Two separate Stripe webhook endpoints.** `/api/shop/webhook/stripe` for merch,
   `/api/mercantile/webhook` for artisan orders. Don't mix them — the payment
   flows are different (direct charge vs. destination charge).

2. **Printful API rate limits.** 120 requests/minute. The sync cron should
   batch requests and respect rate limiting.

3. **Stripe Connect Express onboarding** returns a URL. Redirect the vendor
   there. When they complete it, Stripe sends `account.updated` webhook.
   Check `charges_enabled` and `payouts_enabled` to confirm onboarding complete.

4. **Cart state.** Use localStorage for the merch cart. Don't put it in the
   database — it's a public storefront, not a logged-in experience
   (though logged-in users can also buy).

5. **Fulfillment is split.** Merch: Printful handles everything. Artisan:
   the vendor handles fulfillment (local pickup or they ship it themselves).
   The platform tracks status, the vendor updates it.

6. **Cron routes need CRON_SECRET.** Vercel passes this as a header.
   Use the `verifyCronAuth()` pattern from CLAUDE.md.

7. **Don't break anything.** Public site, admin, community, marketplace —
   all must continue working.

8. **Write checkpoints after every sub-phase.**

---

*Phase 5 makes the platform self-sustaining.*
*Phase 6 is the final frontier: kids portal + genealogy suite.*
*CC implements. CChat does not write code.*
*The Rancheti sells merch now.*
