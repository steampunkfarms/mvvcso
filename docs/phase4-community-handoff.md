# Phase 4 CC Handoff Spec — Community Engagement

> **Date:** 2026-03-31
> **From:** CChat (Research & Architecture)
> **To:** CC (Claude Code CLI)
> **Depends on:** Phase 2c/2d gap fill COMPLETE (or at minimum: auth + admin sidebar are stable)
> **Checkpoint location:** `docs/checkpoints/`

---

## 0. What Phase 4 Delivers

This is the phase that transforms MVVCSO from a board tool into a community
platform. For the first time, Ranchita *residents* — not just board members —
get accounts and interact with the system.

### Features:
1. **Community accounts** — Resident self-registration (magic link, no passwords)
2. **Ranchita Commons** — Internal social platform (posts, comments, reactions)
3. **Community marketplace** — Craigslist/FB Marketplace-style buy/sell/trade/free
4. **Secure balloting** — Electronic voting for non-in-person elections
5. **Social media auto-posting** — Internal posts → Facebook/IG via AI repurposing

### NOT in Phase 4:
- Merch / artisan marketplace with Stripe Connect (Phase 5 — requires payment flows)
- Kids portal (Phase 6 — requires COPPA compliance)
- Genealogy suite (Phase 6)

---

## 1. Community Accounts — Auth Expansion

### The Big Change
Phases 1–3 used an allowlist-only auth system: only pre-approved board emails
could log in. Phase 4 adds **self-registration** for residents while keeping
the board allowlist for admin access.

### New role: `resident`
Add to the existing role system:

| Role | How They Get In | What They Can Do |
|------|----------------|-----------------|
| `resident` | Self-register with email (magic link) | Commons, marketplace, ballots, public pages |
| `voting_member` | Admin promotes resident | Everything resident + vote on ballots |
| `volunteer_coordinator` | Admin assigns | Resident access + VMS |
| `content_manager` | Admin assigns | Resident access + blog/newsletter |
| `board_member` | Admin assigns | All above + board pages |
| `secretary` | Admin assigns | Board + Secretary's Desk |
| `treasurer` | Admin assigns | Board + Treasurer's Suite |
| `president` | Admin assigns | Everything |

### Registration flow:
1. Visitor clicks "Create Account" / "Crear Cuenta"
2. Enters: name, email, language preference (EN/ES)
3. Magic link sent via Resend
4. Click link → account created with `role: 'resident'`
5. Redirect to `/community` (Ranchita Commons)

### Schema changes:
No new tables needed — the existing `authUsers` table handles it. Just:
- Allow `role: 'resident'` and `role: 'voting_member'` as valid values
- Add a new field `displayName` (optional, for Commons profile)
- Add `bio` (text, optional)
- Add `avatarUrl` (text, optional — Vercel Blob)
- Registration is open but admin can deactivate bad actors (`isActive: false`)

```ts
// Add columns to authUsers (migration)
displayName: text('display_name'),
bio: text('bio'),
avatarUrl: text('avatar_url'),
```

### Public registration route:
- `/register` — public form: name, email, language
- `/register/verify` — magic link verification → create account → redirect

### Profile route:
- `/community/profile` — edit display name, bio, avatar, language

### Admin user management update:
- `/admin/settings` user list now shows residents too
- Filter: Board / Staff / Residents
- Promote resident → voting_member
- Deactivate bad actors

---

## 2. Ranchita Commons — Internal Social Platform

### 2.1 Concept

A private-ish community social feed that serves three purposes:
1. Community connection (residents talk to each other)
2. Org communications (board posts reach all residents)
3. Content engine (posts get repurposed for FB/IG via AI)

Think: a cozy town square, not Twitter. Moderated, bilingual, warm.

### 2.2 Schema

```ts
export const communityPosts = pgTable('community_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  authorId: uuid('author_id').notNull().references(() => authUsers.id),
  content: text('content').notNull(), // Plain text or Markdown
  photosJson: text('photos_json'), // JSON array of Vercel Blob URLs
  language: text('language').default('en'),
  channel: text('channel').notNull().default('general'),
  // 'general' | 'weather' | 'trail_reports' | 'lost_found'
  // | 'events' | 'announcements' | 'marketplace_promo'
  isPinned: boolean('is_pinned').default(false), // Admin can pin
  isAnnouncement: boolean('is_announcement').default(false), // Board-only
  status: text('status').notNull().default('active'),
  // 'active' | 'flagged' | 'hidden' | 'removed'
  crossPostedTo: text('cross_posted_to'), // 'facebook' | 'instagram' | 'both' | null
  crossPostedAt: timestamp('cross_posted_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const communityComments = pgTable('community_comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id').notNull().references(() => communityPosts.id),
  authorId: uuid('author_id').notNull().references(() => authUsers.id),
  content: text('content').notNull(),
  status: text('status').notNull().default('active'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const communityReactions = pgTable('community_reactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id').notNull().references(() => communityPosts.id),
  userId: uuid('user_id').notNull().references(() => authUsers.id),
  type: text('type').notNull().default('like'),
  // 'like' | 'heart' | 'celebrate' | 'helpful'
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
```

### 2.3 Routes

**Public-facing (requires resident+ auth):**
- `/community` — Main feed (latest posts, pinned at top)
- `/community/channel/[channel]` — Filtered by channel
- `/community/post/[id]` — Single post with comments
- `/community/new` — Create post form
- `/community/profile` — Edit own profile

**Add "Community" / "Comunidad" to nav bar** — shows for authenticated
residents. Unauthenticated visitors see "Join" / "Únete" linking to /register.

### 2.4 Feed Page (`/community`)

**Layout:**
- Left sidebar (desktop): channel list, your profile card
- Main feed: posts in reverse chronological order
- Right sidebar (desktop): upcoming events widget, quick stats

**Post card:**
- Author avatar + display name + timestamp
- Post content (text, expandable if long)
- Photos (grid layout, lightbox on click)
- Reaction buttons (like, heart, celebrate, helpful) with counts
- Comment count + "Comment" button
- Channel badge
- For board members: Flag / Pin / Hide buttons
- For post author: Edit / Delete

**Pinned posts:** Board announcements stick to top, styled differently
(gold border accent, announcement badge).

### 2.5 Create Post (`/community/new`)

- Text area (Markdown support, 2000 char limit)
- Photo upload (up to 4 photos, drag-and-drop, Vercel Blob)
- Channel selector dropdown
- Language indicator (auto-detected or manual)
- "Post" button
- Board members get additional toggle: "Post as announcement"

### 2.6 Channels

| Channel | Icon | Description |
|---------|------|-------------|
| General | MessageCircle | Community chat, questions, neighbor hellos |
| Weather & Outages | Cloud | Storm reports, power outages, road conditions |
| Trail Reports | Mountain | PCT + local trail conditions |
| Lost & Found | Search | Lost pets, found items |
| Events | Calendar | Event discussion + community-organized gatherings |
| Announcements | Megaphone | Board/official announcements (board members only to post) |

### 2.7 Moderation

- Any resident can **flag** a post
- Flagged posts: admin sees in `/admin/moderation` queue
- Admin actions: dismiss flag, hide post, remove post, warn user
- 3 removed posts → auto-deactivate account (admin override available)
- AI pre-screening (optional stretch): run post content through Claude
  to check for spam, hate speech, or inappropriate content before publishing

### 2.8 API Routes

```
GET    /api/community/posts              — Feed (paginated, filterable by channel)
POST   /api/community/posts              — Create post
PATCH  /api/community/posts/[id]         — Edit post (author only)
DELETE /api/community/posts/[id]         — Delete post (author or admin)
POST   /api/community/posts/[id]/react   — Add/remove reaction
GET    /api/community/posts/[id]/comments — Get comments
POST   /api/community/posts/[id]/comments — Add comment
POST   /api/community/posts/[id]/flag    — Flag for moderation
PATCH  /api/community/posts/[id]/moderate — Admin: hide/remove/dismiss
POST   /api/community/photos/upload      — Upload photos to Vercel Blob
```

---

## 3. Community Marketplace

### 3.1 Concept

Ranchita's own Craigslist. Residents list items for sale, trade, free, or
post wanted ads. No payment processing — transactions happen locally
(cash, barter, neighborly goodwill). This is Phase 4. Stripe Connect
for the artisan mercantile comes in Phase 5.

### 3.2 Schema

```ts
export const marketplaceListings = pgTable('marketplace_listings', {
  id: uuid('id').primaryKey().defaultRandom(),
  sellerId: uuid('seller_id').notNull().references(() => authUsers.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  // 'tools' | 'furniture' | 'vehicles' | 'livestock' | 'produce'
  // | 'services' | 'free' | 'wanted' | 'housing' | 'other'
  type: text('type').notNull().default('for_sale'),
  // 'for_sale' | 'for_trade' | 'free' | 'wanted'
  price: integer('price'), // cents — null for free/trade/wanted
  photosJson: text('photos_json'), // JSON array of Vercel Blob URLs
  condition: text('condition'), // 'new' | 'like_new' | 'good' | 'fair' | 'parts'
  location: text('location').default('Ranchita area'),
  language: text('language').default('en'),
  status: text('status').notNull().default('active'),
  // 'active' | 'sold' | 'expired' | 'flagged' | 'removed'
  expiresAt: timestamp('expires_at'), // Auto-expire after 30 days
  views: integer('views').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const marketplaceMessages = pgTable('marketplace_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  listingId: uuid('listing_id').notNull().references(() => marketplaceListings.id),
  senderId: uuid('sender_id').notNull().references(() => authUsers.id),
  recipientId: uuid('recipient_id').notNull().references(() => authUsers.id),
  content: text('content').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
```

### 3.3 Routes

- `/marketplace` — Listing grid with category filters + search
- `/marketplace/[id]` — Listing detail + contact seller
- `/marketplace/new` — Create listing form
- `/marketplace/my-listings` — Manage your own listings
- `/marketplace/messages` — Inbox for marketplace conversations

Add "Marketplace" / "Mercado" to nav bar (authenticated only).

### 3.4 Listing Grid (`/marketplace`)

- **Filter bar:** Category dropdown, type (for sale/trade/free/wanted), search
- **Listing cards:** Photo thumbnail (first photo or placeholder), title, price
  (or "Free" / "Trade" / "Wanted"), category badge, posted date, view count
- **Sort:** Newest, price low-high, price high-low
- Pagination or infinite scroll
- Mobile: single-column cards

### 3.5 Create Listing (`/marketplace/new`)

- Title
- Description (plain text, 1000 char limit)
- Category dropdown
- Type (For sale / For trade / Free / Wanted)
- Price (shown only for "For sale", in dollars)
- Condition (shown only for sale/trade)
- Photos (up to 6, drag-and-drop, Vercel Blob)
- Location (default "Ranchita area", editable)
- Post button

### 3.6 Listing Detail (`/marketplace/[id]`)

- Photo carousel (or grid)
- Title, price, type badge, condition badge
- Description
- Seller info: display name (linked to profile), member since date
- "Message Seller" button → opens inline messaging panel
- Seller's other active listings (sidebar)
- Flag listing button

### 3.7 Messaging

Simple threaded messaging per listing:
- Buyer clicks "Message Seller" → writes message
- Seller sees message in `/marketplace/messages` inbox
- Reply thread per listing
- No phone/email exposed — all communication through platform
- Unread count badge on nav

### 3.8 Listing Lifecycle

- Created → active (visible immediately)
- Auto-expires after 30 days (cron job sets `status: 'expired'`)
- Seller can mark as "Sold" manually
- Seller can renew expired listing
- Flagged → admin reviews in moderation queue
- Removed by admin → seller notified

### 3.9 API Routes

```
GET    /api/marketplace/listings         — List (paginated, filterable)
POST   /api/marketplace/listings         — Create listing
PATCH  /api/marketplace/listings/[id]    — Update listing
DELETE /api/marketplace/listings/[id]    — Delete listing (seller or admin)
POST   /api/marketplace/listings/[id]/flag — Flag listing
GET    /api/marketplace/messages         — Get inbox threads
POST   /api/marketplace/messages         — Send message
PATCH  /api/marketplace/messages/[id]/read — Mark as read
```

---

## 4. Secure Balloting

### 4.1 Concept

Electronic voting for any MVVCSO decision that doesn't require in-person
voting per the bylaws. Board elections, bylaw amendments, program approvals,
budget ratification, etc.

### 4.2 Schema

```ts
export const ballots = pgTable('ballots', {
  id: uuid('id').primaryKey().defaultRandom(),
  titleEn: text('title_en').notNull(),
  titleEs: text('title_es'),
  descriptionEn: text('description_en'),
  descriptionEs: text('description_es'),
  type: text('type').notNull(),
  // 'yes_no' | 'single_choice' | 'multi_choice' | 'ranked_choice' | 'election'
  eligibility: text('eligibility').notNull().default('voting_member'),
  // 'voting_member' | 'board_member' | 'all_residents'
  isAnonymous: boolean('is_anonymous').notNull().default(true),
  openDate: timestamp('open_date').notNull(),
  closeDate: timestamp('close_date').notNull(),
  status: text('status').notNull().default('draft'),
  // 'draft' | 'open' | 'closed' | 'certified'
  resultPublic: boolean('result_public').notNull().default(true),
  // Whether results visible to non-board after close
  totalEligible: integer('total_eligible'), // Computed when ballot opens
  createdBy: uuid('created_by').references(() => authUsers.id),
  certifiedBy: uuid('certified_by').references(() => authUsers.id),
  certifiedAt: timestamp('certified_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const ballotOptions = pgTable('ballot_options', {
  id: uuid('id').primaryKey().defaultRandom(),
  ballotId: uuid('ballot_id').notNull().references(() => ballots.id),
  labelEn: text('label_en').notNull(),
  labelEs: text('label_es'),
  descriptionEn: text('description_en'),
  descriptionEs: text('description_es'),
  sortOrder: integer('sort_order').default(0),
});

export const ballotVotes = pgTable('ballot_votes', {
  id: uuid('id').primaryKey().defaultRandom(),
  ballotId: uuid('ballot_id').notNull().references(() => ballots.id),
  optionId: uuid('option_id').notNull().references(() => ballotOptions.id),
  // Anonymous voting: hash the voter's userId so we can enforce
  // one-person-one-vote without revealing who voted for what
  voterHash: text('voter_hash').notNull(),
  // SHA-256(ballotId + usersId + ballot-specific-salt)
  // This prevents: same person voting twice on same ballot
  // This allows: admin can verify vote count matches voter count
  // This hides: which user voted for which option
  rank: integer('rank'), // For ranked_choice ballots
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Voter roll — tracks WHO voted (not WHAT they voted for) for audit
export const ballotVoterRoll = pgTable('ballot_voter_roll', {
  id: uuid('id').primaryKey().defaultRandom(),
  ballotId: uuid('ballot_id').notNull().references(() => ballots.id),
  userId: uuid('user_id').notNull().references(() => authUsers.id),
  votedAt: timestamp('voted_at').notNull().defaultNow(),
  // UNIQUE constraint on (ballotId, userId) — one vote per person
});
```

### 4.3 Admin — Create Ballot (`/admin/ballots/new`)

- Title (EN/ES)
- Description (EN/ES) — what's being decided
- Type: Yes/No, Single choice, Multiple choice, Ranked choice, Election
- Options: dynamic list of choices (add/remove/reorder)
- Eligibility: voting members only, board only, all residents
- Anonymous: toggle (default yes)
- Open date + close date
- Results visibility: public or board-only
- Preview before publishing

### 4.4 Admin — Ballot Management (`/admin/ballots`)

- List all ballots: draft, open, closed, certified
- For each open ballot: live vote count (anonymous — just totals)
- Close ballot manually or auto-close at deadline
- Certify results: Secretary/President clicks "Certify" → locks results
- Export: voter roll (who voted, not what), results (option tallies)

### 4.5 Resident — Vote (`/community/ballots` + `/community/ballots/[id]`)

- List open ballots relevant to the voter's role
- Ballot detail: title, description, options
- Vote form:
  - Yes/No: two buttons
  - Single choice: radio buttons
  - Multi choice: checkboxes (with "select up to N" if applicable)
  - Ranked choice: drag-to-rank
  - Election: radio or ranked per position
- Confirmation screen: "You voted for [X]. This cannot be changed."
- After voting: shows "You have voted" badge, no option to see results until close
- After close: shows results (if public)

### 4.6 Cryptographic One-Person-One-Vote

```ts
// When a user votes:
import { createHash } from 'crypto';

function getVoterHash(ballotId: string, userId: string, salt: string): string {
  return createHash('sha256')
    .update(`${ballotId}:${userId}:${salt}`)
    .digest('hex');
}

// Salt is generated per ballot and stored only in a server-side env/secret
// This means: given a voterHash, you can't reverse-engineer the userId
// But given a userId + ballotId, the server can check if they already voted
```

The voter roll records WHO voted (for audit — "23 of 45 eligible members voted").
The votes table records WHAT was chosen (linked by voterHash, not userId).
No join between the two reveals individual choices.

### 4.7 API Routes

```
# Admin
GET    /api/admin/ballots                — List all ballots
POST   /api/admin/ballots                — Create ballot
PATCH  /api/admin/ballots/[id]           — Update/publish ballot
POST   /api/admin/ballots/[id]/close     — Close ballot
POST   /api/admin/ballots/[id]/certify   — Certify results
GET    /api/admin/ballots/[id]/results   — Get results (admin)

# Resident
GET    /api/community/ballots            — List open ballots for current user
GET    /api/community/ballots/[id]       — Ballot detail + options
POST   /api/community/ballots/[id]/vote  — Cast vote
GET    /api/community/ballots/[id]/results — Results (after close, if public)
```

---

## 5. Social Media Auto-Posting

### 5.1 Concept

Board members or content managers can take any Commons post and repurpose
it for Facebook and Instagram. AI rewrites the post for each platform's
format and tone. Admin approves before it goes live.

### 5.2 Schema

```ts
export const socialPosts = pgTable('social_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  sourcePostId: uuid('source_post_id').references(() => communityPosts.id),
  platform: text('platform').notNull(), // 'facebook' | 'instagram'
  content: text('content').notNull(), // AI-generated platform-specific text
  imageUrls: text('image_urls'), // JSON array
  hashtags: text('hashtags'),
  status: text('status').notNull().default('draft'),
  // 'draft' | 'approved' | 'scheduled' | 'published' | 'failed'
  scheduledFor: timestamp('scheduled_for'),
  publishedAt: timestamp('published_at'),
  platformPostId: text('platform_post_id'), // ID returned by FB/IG API
  engagementJson: text('engagement_json'), // {likes, comments, shares} from API
  createdBy: uuid('created_by').references(() => authUsers.id),
  approvedBy: uuid('approved_by').references(() => authUsers.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
```

### 5.3 Workflow

1. Board member browses Commons feed, sees a great post
2. Clicks "Share to Social" on the post
3. AI generates two versions:
   - **Facebook:** Longer, conversational, community-focused. Includes relevant hashtags.
   - **Instagram:** Shorter, punchier, image-focused. Includes hashtag block.
4. Admin reviews drafts in `/admin/social` — can edit before approving
5. Schedule for specific time or publish immediately
6. Cron job publishes at scheduled time via Facebook Pages API / Instagram Graph API
7. Engagement metrics pulled back periodically

### 5.4 AI Prompt for Repurposing

```
System prompt:

You repurpose community social media posts for MVVCSO's official Facebook Page
and Instagram account. The source is an internal community post from a Ranchita
resident or board member.

For Facebook:
- Warm, community-focused tone
- Can be 2-4 paragraphs
- Include a call to action where appropriate (visit our website, join an event)
- Add 3-5 relevant hashtags: #Ranchita #BackcountryStrong #MVVCSO etc.
- Mention MVVCSO's role when relevant

For Instagram:
- Shorter, more visual/emotional
- First line is the hook (no hashtags in first line)
- Include hashtag block at the end (8-15 hashtags)
- Include emoji sparingly (2-3 max)
- End with a community-building CTA

Always:
- Bilingual option if source is in English (add Spanish translation below)
- Never include personal information about residents unless they're the author
- Keep the authentic voice — don't make it corporate
- Credit the original poster if appropriate: "Our neighbor [first name] shares..."
```

### 5.5 Admin Social Dashboard (`/admin/social`)

- **Queue:** Drafted posts awaiting approval
- **Scheduled:** Approved posts with future publish dates
- **Published:** Published posts with engagement metrics
- **Create:** Manually create a social post (not from Commons)
- **Analytics:** Total reach, engagement, follower growth (if API provides)

### 5.6 API Routes

```
GET    /api/admin/social                 — List social posts (all statuses)
POST   /api/admin/social/generate        — AI generate from Commons post
PATCH  /api/admin/social/[id]            — Edit/approve/schedule
POST   /api/admin/social/[id]/publish    — Publish immediately
DELETE /api/admin/social/[id]            — Delete draft
```

### 5.7 Facebook/Instagram Integration

**Env vars needed (Frederick to provide):**

| Var | Service |
|-----|---------|
| `FACEBOOK_PAGE_ID` | Facebook Page ID |
| `FACEBOOK_PAGE_ACCESS_TOKEN` | Long-lived page access token |
| `INSTAGRAM_BUSINESS_ID` | Instagram Business account ID |

**Graceful fallback:** If FB/IG tokens aren't configured, the social
dashboard shows "Connect your Facebook Page to enable auto-posting"
with setup instructions. All draft/schedule features still work — they
just can't publish until tokens are provided.

**Phase 4 minimum:** Get Facebook posting working. Instagram can follow
in Phase 5 if the IG Business API setup is complex.

---

## 6. Admin Moderation Hub (`/admin/moderation`)

Unified moderation queue for both Commons and Marketplace:

- **Flagged posts** — Community posts flagged by residents
- **Flagged listings** — Marketplace listings flagged by residents
- **User reports** — Users with multiple flags
- **Actions:** Dismiss flag, hide content, remove content, warn user, deactivate user
- **Auto-flag rules:** (stretch) AI-scanned content that triggers auto-flag

---

## 7. Updated Navigation

### Public nav (unauthenticated):
```
Home | About | Programs | Events | Blog | Resources | Bylaws | Donate | Contact | PCT | Join
```

### Authenticated nav (resident+):
```
Home | About | Programs | Events | Blog | Resources | Bylaws | Donate | Contact | PCT
Community | Marketplace | [Ballots when open] | Profile
```

### Admin sidebar additions:
```
(existing Phase 2/3 items)
📣 Social Media       /admin/social           ← NEW
🗳️ Ballots            /admin/ballots          ← NEW
🛡️ Moderation         /admin/moderation       ← NEW
```

---

## 8. File Tree (Phase 4 Additions)

```
src/app/
├── register/
│   ├── page.tsx                    # Public registration form
│   └── verify/
│       └── page.tsx                # Registration verification
├── community/
│   ├── page.tsx                    # Commons feed
│   ├── channel/
│   │   └── [channel]/
│   │       └── page.tsx            # Channel-filtered feed
│   ├── post/
│   │   └── [id]/
│   │       └── page.tsx            # Single post + comments
│   ├── new/
│   │   └── page.tsx                # Create post
│   ├── profile/
│   │   └── page.tsx                # Edit profile
│   └── ballots/
│       ├── page.tsx                # Open ballots list
│       └── [id]/
│           └── page.tsx            # Vote + results
├── marketplace/
│   ├── page.tsx                    # Listing grid
│   ├── [id]/
│   │   └── page.tsx                # Listing detail
│   ├── new/
│   │   └── page.tsx                # Create listing
│   ├── my-listings/
│   │   └── page.tsx                # Manage own listings
│   └── messages/
│       └── page.tsx                # Message inbox
├── admin/(protected)/
│   ├── social/
│   │   └── page.tsx                # Social media dashboard
│   ├── ballots/
│   │   ├── page.tsx                # Ballot list
│   │   └── new/
│   │       └── page.tsx            # Create ballot
│   └── moderation/
│       └── page.tsx                # Moderation queue

src/components/
├── community/
│   ├── post-card.tsx               # Post in feed
│   ├── post-form.tsx               # Create/edit post
│   ├── comment-list.tsx
│   ├── comment-form.tsx
│   ├── reaction-bar.tsx
│   ├── channel-sidebar.tsx
│   └── profile-card.tsx
├── marketplace/
│   ├── listing-card.tsx
│   ├── listing-form.tsx
│   ├── listing-gallery.tsx         # Photo carousel
│   ├── message-thread.tsx
│   └── message-inbox.tsx
├── ballots/
│   ├── ballot-card.tsx
│   ├── vote-form.tsx               # Handles all vote types
│   ├── results-display.tsx
│   └── ranked-choice-input.tsx     # Drag-to-rank
└── social/
    ├── social-post-card.tsx
    ├── ai-repurpose-modal.tsx
    └── engagement-stats.tsx

src/lib/
├── community.ts                    # Commons helpers
├── marketplace.ts                  # Marketplace helpers
├── balloting.ts                    # Voting + hash helpers
└── social.ts                       # FB/IG API helpers
```

---

## 9. New Dependencies

```bash
npm install @dnd-kit/core @dnd-kit/sortable    # For ranked-choice drag-to-rank
# Facebook/IG SDK is REST API — no npm package needed, use fetch()
```

---

## 10. Phase 4 Task Checklist

### Phase 4a: Community Accounts + Commons (Session 1-2)

```
⬜ 1.  Add community tables to schema (communityPosts, communityComments,
       communityReactions) + authUsers column additions
⬜ 2.  Run drizzle-kit generate + push
⬜ 3.  Build /register page (name, email, language)
⬜ 4.  Build /register/verify page
⬜ 5.  Update auth system to handle self-registration (role: 'resident')
⬜ 6.  Update middleware to allow resident access to /community and /marketplace
⬜ 7.  Build /community page — main feed with post cards
⬜ 8.  Build post-card component (content, photos, reactions, comments)
⬜ 9.  Build /community/new — create post form with photo upload
⬜ 10. Build /community/post/[id] — single post with comment thread
⬜ 11. Build reaction system (like/heart/celebrate/helpful)
⬜ 12. Build channel sidebar + channel filtered view
⬜ 13. Build /community/profile — edit display name, bio, avatar
⬜ 14. Build announcement styling (board-only, pinned, gold border)
⬜ 15. Add Community to nav (authenticated only) + Join (unauthenticated)
⬜ 16. API routes for all community endpoints
⬜ 17. Write checkpoint
```

### Phase 4b: Marketplace (Session 2-3)

```
⬜ 18. Add marketplace tables to schema (marketplaceListings, marketplaceMessages)
⬜ 19. Run drizzle-kit generate + push
⬜ 20. Build /marketplace page — listing grid with filters + search
⬜ 21. Build listing-card component
⬜ 22. Build /marketplace/new — create listing form with photos
⬜ 23. Build /marketplace/[id] — listing detail + photo gallery + contact seller
⬜ 24. Build /marketplace/my-listings — manage own listings (edit, mark sold, renew)
⬜ 25. Build marketplace messaging system (/marketplace/messages)
⬜ 26. Build message thread component
⬜ 27. Add unread message count badge to nav
⬜ 28. Add Marketplace to nav (authenticated only)
⬜ 29. API routes for all marketplace endpoints
⬜ 30. Write checkpoint
```

### Phase 4c: Balloting (Session 3-4)

```
⬜ 31. Add ballot tables to schema (ballots, ballotOptions, ballotVotes, ballotVoterRoll)
⬜ 32. Run drizzle-kit generate + push
⬜ 33. Build /admin/ballots page — list all ballots
⬜ 34. Build /admin/ballots/new — create ballot with dynamic options
⬜ 35. Build voterHash cryptographic helper (src/lib/balloting.ts)
⬜ 36. Build /community/ballots — list open ballots for current user
⬜ 37. Build /community/ballots/[id] — vote form (yes/no, single, multi, ranked)
⬜ 38. Build ranked-choice-input with drag-to-rank (@dnd-kit)
⬜ 39. Build results-display component (bar charts, certified badge)
⬜ 40. Build admin ballot close + certify flow
⬜ 41. One-person-one-vote enforcement (voterHash + voter roll unique constraint)
⬜ 42. API routes for all ballot endpoints
⬜ 43. Write checkpoint
```

### Phase 4d: Social Auto-Posting + Moderation + Polish (Session 4-5)

```
⬜ 44. Add socialPosts table to schema
⬜ 45. Run drizzle-kit generate + push
⬜ 46. Build /admin/social page — queue, scheduled, published tabs
⬜ 47. Build AI repurpose flow: Commons post → Claude → FB/IG drafts
⬜ 48. Build Facebook Pages API integration (publish, fetch engagement)
⬜ 49. Build admin social post editor (edit AI draft before approve)
⬜ 50. Build schedule + publish flow
⬜ 51. Build /admin/moderation — unified flagged content queue
⬜ 52. Build flag/dismiss/hide/remove actions for posts + listings
⬜ 53. Add Social, Ballots, Moderation to admin sidebar
⬜ 54. Update admin settings: user management shows residents, promote to voting_member
⬜ 55. Cron: auto-expire marketplace listings after 30 days
⬜ 56. Cron: auto-open/close ballots at scheduled times
⬜ 57. Cron: publish scheduled social posts
⬜ 58. Activity log: wire all Phase 4 actions
⬜ 59. Responsive QA: community + marketplace on mobile
⬜ 60. Final checkpoint: Phase 4 COMPLETE
```

---

## 11. Frederick Actions

| Action | Blocking? | Notes |
|--------|-----------|-------|
| Facebook Page Access Token | For social posting | Long-lived token from FB Developer Console |
| Facebook Page ID | For social posting | Settings → Page → About |
| Confirm: are residents allowed to self-register? | Yes — for auth design | Assumed yes, admin can deactivate |
| Confirm: which votes can be anonymous? | For ballot config | Assumed default anonymous per bylaws |
| Confirm voting member criteria | For ballot eligibility | Who is a "voting member" per bylaws? |

---

## 12. Reminders for CC

1. **New auth scope.** Resident accounts are self-service. Update middleware
   to distinguish admin routes (board+) from community routes (resident+)
   from public routes (anyone).

2. **Marketplace messaging is NOT email.** It's in-platform only. No Resend.
   Keep phone numbers and emails private.

3. **Ballot anonymity is real.** The voterHash design means even a database
   admin cannot determine how a specific person voted. The voter roll proves
   they voted; the votes table proves what was chosen; no join connects them.
   Test this property explicitly.

4. **Channel-based posting for Announcements.** Only board_member+ roles can
   post in the Announcements channel. Residents can see but not post.

5. **Photo uploads reuse Vercel Blob.** Same BLOB_READ_WRITE_TOKEN. Consider
   client-side resize before upload (max 1200px wide) to save storage.

6. **Don't break anything.** Public site, admin dashboard, secretary, treasurer,
   compliance — all must continue working. Phase 4 is additive.

7. **Write checkpoints after every sub-phase.**

---

*Phase 4 opens the doors to the community.*
*Phase 5 adds the merch shop and artisan marketplace with payments.*
*CC implements. CChat does not write code.*
*The Rancheti welcomes everyone to the Commons.*
