# Phase 6 CC Handoff Spec — Kids Portal + Genealogy Suite

> **Date:** 2026-03-31
> **From:** CChat (Research & Architecture)
> **To:** CC (Claude Code CLI)
> **Depends on:** Phase 5 COMPLETE (merch, mercantile, fundraising, Twilio, crons)
> **Reference:** Hearthstone Academy Phase 6A (gamification), 6B (virtual labs), 4A (accessibility)
> **Reference:** Frederick's Ancestry.com tree (Tronboll family, 100+ persons, Scotland/Germany/Wisconsin/Washington/California)
> **Checkpoint location:** `docs/checkpoints/`

---

## 0. What Phase 6 Delivers

The final frontier. Two features that make MVVCSO unlike any other rural
nonprofit platform in the country:

1. **Kids Portal** — COPPA-compliant, gamified learning environment where
   Ranchita's youngest residents explore desert ecology, community safety,
   and creative expression with the Rancheti Yeti as their guide.

2. **Build Your Ranchita Legacy** — A community genealogy suite that gives
   families tools rivaling Ancestry.com, localized to the Montezuma Valley.
   Family trees, oral histories, historical photos, property records, and
   inter-family connections.

These are the features that make people share the link and say "you have
to see what this little nonprofit in the desert built."

### NOT in Phase 6:
- Fine art gallery (Phase 7 — roadmapped separately)
- LiveKit video (deferred — standalone task)
- Community Center concept art (Phase 7+)

---

## PART A: KIDS PORTAL

---

## A1. COPPA Compliance — Non-Negotiable Foundation

The Children's Online Privacy Protection Act (COPPA) applies to any online
service directed at children under 13 that collects personal information.
This is federal law, not a guideline.

### What COPPA Requires

| Requirement | Our Implementation |
|-------------|-------------------|
| Verifiable parental consent before collecting any child data | Parent (existing resident account) creates child account. Parent confirms via email link. |
| Clear, prominent privacy policy | Dedicated `/kids/privacy` page in plain English + Spanish |
| Minimize data collection | Child account stores ONLY: display name, age range, parent ID. No email, no real name, no location, no photos of child. |
| No behavioral advertising | Zero ads on the platform, period |
| Parent can review and delete child's data | Parent dashboard: view all child data, one-click delete |
| Secure data storage | Same encryption as rest of platform |
| No data sharing with third parties | No analytics, no tracking, no third-party scripts on kids pages |
| Allow children to participate without unnecessary data | Child can play all games with just a display name |

### Age Gating

| Age Range | Access Level | Notes |
|-----------|-------------|-------|
| Under 5 | Not allowed | Too young for meaningful interaction |
| 5–8 | Guided mode | Simplified UI, parent-selected activities only |
| 9–12 | Explorer mode | Full kids portal access, can browse and choose activities |
| 13+ | Resident account | Standard community account (not the kids portal) |

Age is self-reported by parent during child account creation. We store age
range (e.g., "5-8" or "9-12"), NOT birthdate — minimizes PII.

---

## A2. Schema

```ts
export const childAccounts = pgTable('child_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  parentId: uuid('parent_id').notNull().references(() => authUsers.id),
  displayName: text('display_name').notNull(), // "RanchitaExplorer42" — NOT real name
  ageRange: text('age_range').notNull(), // '5-8' | '9-12'
  avatarId: text('avatar_id').default('yeti-default'), // Pre-built avatar selection
  consentDate: timestamp('consent_date').notNull(), // When parent approved
  consentMethod: text('consent_method').notNull().default('email'),
  language: text('language').notNull().default('en'),
  isActive: boolean('is_active').notNull().default(true),
  lastActiveAt: timestamp('last_active_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const kidsBadges = pgTable('kids_badges', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  nameEs: text('name_es'),
  description: text('description').notNull(),
  descriptionEs: text('description_es'),
  iconId: text('icon_id').notNull(), // Maps to a pre-built badge SVG
  category: text('category').notNull(),
  // 'explorer' | 'learner' | 'creator' | 'helper' | 'streak'
  criteria: text('criteria').notNull(), // JSON: { type: 'games_completed', count: 5 }
  xpReward: integer('xp_reward').notNull().default(10),
  sortOrder: integer('sort_order').default(0),
});

export const kidsProgress = pgTable('kids_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  childId: uuid('child_id').notNull().references(() => childAccounts.id),
  activityType: text('activity_type').notNull(),
  // 'game' | 'cartoon' | 'quiz' | 'explore' | 'create'
  activityId: text('activity_id').notNull(), // Which specific game/activity
  score: integer('score'), // If scored
  completed: boolean('completed').notNull().default(false),
  timeSpentSeconds: integer('time_spent_seconds'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const kidsEarnedBadges = pgTable('kids_earned_badges', {
  id: uuid('id').primaryKey().defaultRandom(),
  childId: uuid('child_id').notNull().references(() => childAccounts.id),
  badgeId: uuid('badge_id').notNull().references(() => kidsBadges.id),
  earnedAt: timestamp('earned_at').notNull().defaultNow(),
});

export const kidsXp = pgTable('kids_xp', {
  id: uuid('id').primaryKey().defaultRandom(),
  childId: uuid('child_id').notNull().references(() => childAccounts.id),
  amount: integer('amount').notNull(),
  source: text('source').notNull(), // 'game_complete' | 'badge_earned' | 'daily_login' | 'cartoon_created'
  sourceId: text('source_id'), // Reference to the specific activity
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const kidsCartoons = pgTable('kids_cartoons', {
  id: uuid('id').primaryKey().defaultRandom(),
  childId: uuid('child_id').notNull().references(() => childAccounts.id),
  title: text('title').notNull(),
  sceneDataJson: text('scene_data_json').notNull(), // JSON: character positions, props, backgrounds
  thumbnailUrl: text('thumbnail_url'), // Auto-generated preview
  isPublic: boolean('is_public').notNull().default(false), // Parent must approve for gallery
  parentApproved: boolean('parent_approved').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
```

---

## A3. Parental Consent Flow

```
1. Parent logs into their resident account
2. Goes to /kids/setup (or Profile → My Children)
3. Clicks "Add Child Account"
4. Enters: child's display name, age range, language preference
   — NO real name, NO email, NO photo
5. Reviews and accepts COPPA privacy notice
6. Verification email sent to parent's email:
   "You're creating a kids account for [display name]. Click to confirm."
7. Parent clicks → child account created
8. Parent receives unique child login code (6-digit PIN)
   — Child logs in at /kids with display name + PIN
   — No email-based auth for children
```

### Child Login

- `/kids` — Landing page with "Enter your explorer name and secret code"
- Display name + 6-digit PIN (generated by system, shown to parent only)
- Session stored as httpOnly cookie, expires after 2 hours of inactivity
- No "remember me" — child must re-enter PIN each session
- Parent can reset PIN from their dashboard

---

## A4. Kids Portal Routes

```
/kids                          — Landing page + login
/kids/home                     — Dashboard (after login)
/kids/games                    — Learning games library
/kids/games/[gameId]           — Play a specific game
/kids/create                   — Build Your Own Cartoon
/kids/create/[id]              — Edit a saved cartoon
/kids/gallery                  — Community cartoon gallery (approved only)
/kids/explore                  — Virtual Ranchita explorer (simplified PCT)
/kids/badges                   — My badge collection + XP level
/kids/privacy                  — COPPA privacy policy (public)
```

Parent-side:
```
/community/profile/children    — Manage child accounts
/community/profile/children/[id] — View child's progress, badges, cartoons
```

---

## A5. Learning Games

All games are self-contained React components. No external scripts,
no tracking, no third-party APIs. Built with HTML5 Canvas or React state.

### Game Library

| Game | Category | Age | Description |
|------|----------|-----|-------------|
| **Desert Creature Match** | Nature | 5-12 | Memory card game with Ranchita animals (rattlesnake, roadrunner, bobcat, mountain lion, coyote, jackrabbit, tarantula, hawk). Bilingual animal names. |
| **Fire Safety Quiz** | Safety | 5-12 | Interactive quiz about wildfire preparedness. "What do you do if you see smoke?" Multiple choice with Rancheti explanations. |
| **Star Finder** | Science | 9-12 | Night sky identification game. Ranchita has incredible dark skies — learn constellations visible from the valley. Drag stars to form constellations. |
| **Desert Plant Explorer** | Nature | 5-12 | Identify chaparral plants: sage, manzanita, yucca, cactus. Drag labels to photos. Learn which are edible, which to avoid. |
| **Trail Tracker** | Geography | 9-12 | Simplified PCT map. Click waypoints in order. Learn elevations, distances, landmarks. |
| **Weather Watcher** | Science | 5-12 | Match weather icons to descriptions. Learn about desert weather patterns, monsoons, snow in the mountains. |
| **Community Helper** | Social | 5-8 | Sort activities into categories: firefighter, volunteer, neighbor helper. Learn what MVVCSO does. |
| **Rancheti's Word Search** | Language | 5-12 | Bilingual word search with Ranchita vocabulary (desert, mountain, trail, community, volunteer). EN and ES modes. |

### Game Architecture

Each game is a React component that:
1. Renders entirely client-side (no server calls during gameplay)
2. Reports completion + score to server on finish (`POST /api/kids/progress`)
3. Awards XP based on score
4. Checks for badge criteria and awards if met
5. Shows celebratory animation (Rancheti dancing) on completion
6. Works offline (service worker cached) — critical for Starlink outages

### Ported from Hearthstone Academy

From HA Phase 6A (Gamification):
- **Badge system** — Auto-award engine checks criteria after each activity
- **XP progression** — 7 levels: Desert Seed → Desert Sprout → Trail Scout →
  Mountain Explorer → Wildlife Watcher → Community Champion → Rancheta Ranger
- **Leaderboard** — Display name only (NEVER real names). Opt-in by parent.
  Weekly reset. Top 3 get special badge.

From HA Phase 6B (Virtual Labs):
- **Embedded simulation framework** — p5.js sketches for the star finder and
  weather watcher games. Scratch-style block coding if we want to get ambitious.

From HA Phase 4A (Accessibility):
- **Sensory-friendly mode** — Muted colors, no animations, reduced motion.
  Parent can enable per child in settings.
- **Large touch targets** — Minimum 48px tap areas. All games playable on tablet.
- **Screen reader support** — Alt text on all game elements. ARIA labels.

---

## A6. Build Your Own Cartoon

### Concept

A drag-and-drop scene builder where kids create cartoons set in Ranchita.
Pre-built character sprites (Rancheti, desert animals, community members),
background scenes (mountains, desert, PCT, community center), and props
(cacti, boulders, fire truck, windmill, stars).

### Implementation

```
Canvas-based scene editor:
  - Background selector (6 scenes: desert day, desert night, mountains,
    PCT trail, community center, Rancheti's cave)
  - Character palette (drag to place):
    - Rancheti (multiple poses: waving, pointing, laughing, thinking)
    - Desert animals (bobcat, coyote, roadrunner, hawk, jackrabbit)
    - Community figures (firefighter, hiker, volunteer, child)
  - Prop palette: cacti, boulders, trees, clouds, sun, moon, stars,
    fire truck, windmill, PCT sign, Ranchita welcome sign
  - Text bubbles: add speech/thought bubbles to characters
  - Save / Load: serialized to JSON, stored in kidsCartoons table
  - Export: download as PNG image
  - Gallery: parent-approved cartoons shown in community gallery
```

### Tech

Use **Konva.js** (React wrapper: `react-konva`) for the canvas scene editor.
It handles drag-and-drop, layering, rotation, scaling, and PNG export natively.

Sprites stored as SVGs in `/public/images/kids/sprites/`. Pre-built, not
user-uploaded (no UGC from children per COPPA minimization).

```bash
npm install konva react-konva
```

---

## A7. XP & Badge System

### XP Levels (Ported from HA Phase 6A)

| Level | Title | XP Required | Badge Color |
|-------|-------|-------------|-------------|
| 1 | Desert Seed | 0 | Green |
| 2 | Desert Sprout | 50 | Green |
| 3 | Trail Scout | 150 | Blue |
| 4 | Mountain Explorer | 350 | Blue |
| 5 | Wildlife Watcher | 600 | Purple |
| 6 | Community Champion | 1000 | Gold |
| 7 | Rancheta Ranger | 1500 | Gold + Star |

### XP Sources

| Action | XP |
|--------|-----|
| Complete any game | 10-25 (based on score) |
| First time completing a game | 15 bonus |
| Daily login | 5 |
| Create a cartoon | 15 |
| Cartoon approved for gallery | 25 |
| Earn a badge | Badge-specific XP reward |

### Badges (Seed Data)

```ts
const kidsBadgeSeed = [
  // Explorer badges
  { name: "First Steps", category: "explorer", criteria: { type: "games_completed", count: 1 }, xp: 10 },
  { name: "Trailblazer", category: "explorer", criteria: { type: "games_completed", count: 5 }, xp: 25 },
  { name: "Desert Expert", category: "explorer", criteria: { type: "games_completed", count: 15 }, xp: 50 },
  { name: "All-Star Explorer", category: "explorer", criteria: { type: "unique_games_completed", count: 8 }, xp: 100 },

  // Creator badges
  { name: "First Cartoon", category: "creator", criteria: { type: "cartoons_created", count: 1 }, xp: 15 },
  { name: "Cartoon Artist", category: "creator", criteria: { type: "cartoons_created", count: 5 }, xp: 30 },
  { name: "Gallery Star", category: "creator", criteria: { type: "cartoons_in_gallery", count: 1 }, xp: 50 },

  // Learner badges
  { name: "Fire Safe", category: "learner", criteria: { type: "game_score", gameId: "fire-safety", minScore: 80 }, xp: 20 },
  { name: "Star Gazer", category: "learner", criteria: { type: "game_score", gameId: "star-finder", minScore: 80 }, xp: 20 },
  { name: "Desert Naturalist", category: "learner", criteria: { type: "game_score", gameId: "desert-plants", minScore: 80 }, xp: 20 },

  // Streak badges
  { name: "3-Day Streak", category: "streak", criteria: { type: "login_streak", days: 3 }, xp: 15 },
  { name: "Week Warrior", category: "streak", criteria: { type: "login_streak", days: 7 }, xp: 30 },
  { name: "Monthly Mountain", category: "streak", criteria: { type: "login_streak", days: 30 }, xp: 100 },

  // Helper badges
  { name: "Community Helper", category: "helper", criteria: { type: "game_score", gameId: "community-helper", minScore: 100 }, xp: 20 },
];
```

---

## A8. Kids Portal UI Design

### Visual Style
- **Rancheti as mascot/guide** — Appears throughout. Waving on homepage,
  pointing to games, celebrating on achievements. Use the SVG sprite system.
- **Color palette:** Warmer, more saturated version of Ranchita Dusk.
  Gold-200 backgrounds, rounded everything, larger fonts (18px body).
- **No scary imagery.** Rattlesnakes and mountain lions are drawn as friendly
  cartoon characters, not realistic. Think nature documentary for kids.
- **Bilingual throughout.** Every string through i18n. Games have language toggle.
- **Sound effects optional.** Toggle in settings. Default: off. Minimal, gentle
  sounds only (ding on correct, soft buzz on wrong).

### Navigation
- Simple top bar: Home, Games, Create, Explore, Badges
- Rancheti avatar in corner showing current XP level
- No hamburger menu — everything visible. Large touch targets.
- Back button always visible
- "Exit to Parent" button returns to parent dashboard

### Responsive
- Designed for tablet first (iPad in landscape = primary use case)
- Works on phone (portrait) with stacked layout
- Works on desktop for families using a shared computer

---

## A9. Admin — Kids Portal Management (`/admin/kids`)

- **Stats:** Active child accounts, games played this week, cartoons created
- **Cartoon moderation:** Approve cartoons for the public gallery
- **Badge management:** View/edit badges, see award history
- **Activity log:** Which games are most popular, engagement metrics
- **COPPA audit log:** Parental consent records, data access requests

---

## PART B: BUILD YOUR RANCHITA LEGACY — GENEALOGY SUITE

---

## B1. Concept

A community genealogy platform purpose-built for Ranchita. Not trying to be
Ancestry.com for the whole world — focused on families who have lived in,
passed through, or are connected to the Montezuma Valley.

What makes this different from Ancestry:
- **Community connections:** See how your family connects to other Ranchita
  families. "The Walters and the Footes both homesteaded here in 1962."
- **Oral histories:** Record and preserve stories in residents' own voices.
- **Property history:** Who lived on your parcel before you? Timeline overlay.
- **PCT connection:** "Your grandfather maintained the water cache at Barrel
  Spring for 20 years."
- **Local history integration:** Family events interwoven with MVVCSO timeline
  events (fires, floods, community milestones).

### Reference: Frederick's Existing Tree
Frederick has an Ancestry.com tree (tree ID 25113430) with 100+ persons
spanning Scotland, Germany, Poland, Wisconsin, Washington, and California.
He has Ahnentafel, Descendancy, Register, and Family Group Sheet reports.
The genealogy suite should support GEDCOM import so he can migrate this
data in and demonstrate the feature from day one.

---

## B2. Schema

```ts
export const familyTrees = pgTable('family_trees', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id').notNull().references(() => authUsers.id),
  name: text('name').notNull(), // "The Tronboll Family"
  description: text('description'),
  privacy: text('privacy').notNull().default('private'),
  // 'private' | 'family' | 'community' | 'public'
  coverImageUrl: text('cover_image_url'),
  personCount: integer('person_count').default(0), // Denormalized count
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const familyTreeCollaborators = pgTable('family_tree_collaborators', {
  id: uuid('id').primaryKey().defaultRandom(),
  treeId: uuid('tree_id').notNull().references(() => familyTrees.id),
  userId: uuid('user_id').notNull().references(() => authUsers.id),
  role: text('role').notNull().default('viewer'),
  // 'viewer' | 'editor' | 'admin'
  invitedAt: timestamp('invited_at').notNull().defaultNow(),
  acceptedAt: timestamp('accepted_at'),
});

export const familyPersons = pgTable('family_persons', {
  id: uuid('id').primaryKey().defaultRandom(),
  treeId: uuid('tree_id').notNull().references(() => familyTrees.id),
  firstName: text('first_name').notNull(),
  middleName: text('middle_name'),
  lastName: text('last_name').notNull(),
  maidenName: text('maiden_name'),
  nickname: text('nickname'),
  gender: text('gender'), // 'male' | 'female' | 'other' | null
  birthDate: text('birth_date'), // Stored as text for partial dates: "1842", "Aug 1858", "17 Dec 1836"
  birthPlace: text('birth_place'),
  deathDate: text('death_date'),
  deathPlace: text('death_place'),
  bio: text('bio'), // Markdown
  photoUrl: text('photo_url'), // Primary photo
  photosJson: text('photos_json'), // JSON array of additional photos
  isLiving: boolean('is_living').default(false),
  // Living persons: restricted visibility per privacy settings
  ranchitaConnection: text('ranchita_connection'),
  // Freeform text: "Homesteaded on Montezuma Valley Rd, 1962"
  // "Maintained PCT water cache at Barrel Spring, 1985-2005"
  externalLinks: text('external_links_json'),
  // JSON: [{ label: "Ancestry.com", url: "..." }, { label: "FindAGrave", url: "..." }]
  gedcomId: text('gedcom_id'), // Original GEDCOM INDI identifier for import mapping
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const familyRelations = pgTable('family_relations', {
  id: uuid('id').primaryKey().defaultRandom(),
  treeId: uuid('tree_id').notNull().references(() => familyTrees.id),
  personId: uuid('person_id').notNull().references(() => familyPersons.id),
  relatedPersonId: uuid('related_person_id').notNull().references(() => familyPersons.id),
  type: text('type').notNull(),
  // 'parent' | 'child' | 'spouse' | 'sibling'
  // Stored bidirectionally: if A is parent of B, also store B is child of A
  marriageDate: text('marriage_date'), // For spouse relations
  marriagePlace: text('marriage_place'),
  divorceDate: text('divorce_date'),
  relationOrder: integer('relation_order'), // For multiple marriages: 1st, 2nd, etc.
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const oralHistories = pgTable('oral_histories', {
  id: uuid('id').primaryKey().defaultRandom(),
  treeId: uuid('tree_id').references(() => familyTrees.id),
  personId: uuid('person_id').references(() => familyPersons.id),
  recordedById: uuid('recorded_by_id').references(() => authUsers.id),
  title: text('title').notNull(),
  description: text('description'),
  audioUrl: text('audio_url').notNull(), // Vercel Blob
  transcript: text('transcript'), // AI-generated or manual
  transcriptLanguage: text('transcript_language').default('en'),
  duration: integer('duration'), // seconds
  recordedDate: timestamp('recorded_date'),
  location: text('location'),
  tags: text('tags'), // comma-separated
  privacy: text('privacy').notNull().default('family'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const propertyHistories = pgTable('property_histories', {
  id: uuid('id').primaryKey().defaultRandom(),
  parcelId: text('parcel_id'), // County APN if available
  address: text('address'),
  lat: text('lat'),
  lng: text('lng'),
  description: text('description'),
  timelineJson: text('timeline_json'),
  // JSON array: [{ year: 1955, owner: "Smith family", event: "Homesteaded 40 acres", personId: "..." }]
  currentOwnerId: uuid('current_owner_id').references(() => authUsers.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const familyPhotos = pgTable('family_photos', {
  id: uuid('id').primaryKey().defaultRandom(),
  treeId: uuid('tree_id').notNull().references(() => familyTrees.id),
  uploadedById: uuid('uploaded_by_id').references(() => authUsers.id),
  imageUrl: text('image_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  title: text('title'),
  description: text('description'),
  dateTaken: text('date_taken'), // Partial dates OK
  location: text('location'),
  taggedPersonsJson: text('tagged_persons_json'), // JSON array of personIds
  privacy: text('privacy').notNull().default('family'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
```

---

## B3. GEDCOM Import/Export

### GEDCOM Overview
GEDCOM (Genealogical Data Communication) is the universal standard for
exchanging family tree data. Every major genealogy platform exports it.
Frederick's Ancestry.com tree exports as `.ged` file.

### Import Flow (`/legacy/import`)

```
1. User uploads .ged file (drag-and-drop)
2. Server parses GEDCOM (npm package: gedcom.js or parse-gedcom)
3. Preview screen: "Found 142 individuals, 58 families"
   - Show first 10 names as sample
   - Warn about any parsing issues
4. User confirms → create familyTree + bulk insert familyPersons + familyRelations
5. Progress bar during import
6. Done: redirect to tree viewer
```

### Export Flow

- User clicks "Export as GEDCOM" on their tree
- Server generates `.ged` file from tree data
- Download as `{tree-name}.ged`

### Implementation

```bash
npm install gedcom               # GEDCOM parser
# Or use parse-gedcom — evaluate which handles edge cases better
```

GEDCOM parsing is well-defined but messy in practice. Key fields to map:

| GEDCOM Tag | Our Field |
|-----------|-----------|
| `0 @I1@ INDI` | `familyPersons.gedcomId = "I1"` |
| `1 NAME John /Smith/` | `firstName = "John"`, `lastName = "Smith"` |
| `1 BIRT` → `2 DATE 17 Dec 1836` | `birthDate = "17 Dec 1836"` |
| `1 BIRT` → `2 PLAC New York` | `birthPlace = "New York"` |
| `1 DEAT` → `2 DATE 3 Feb 1894` | `deathDate = "3 Feb 1894"` |
| `0 @F1@ FAM` | Family unit |
| `1 HUSB @I1@` | Spouse relation |
| `1 WIFE @I2@` | Spouse relation |
| `1 CHIL @I3@` | Parent-child relation |
| `1 MARR` → `2 DATE ...` | `familyRelations.marriageDate` |

---

## B4. Interactive Family Tree Viewer

### The Core Experience

A visual, interactive tree that users can zoom, pan, and click through.

### Implementation Options

**Option A: D3.js Force-Directed Graph (Recommended)**
- Most flexible for large, complex trees
- Zoom/pan built-in
- Nodes = persons, edges = relations
- Click a person → detail panel slides in
- Color-coding: living (green), deceased (gray), Ranchita-connected (gold)

**Option B: Custom SVG Layout**
- Classic family tree layout (generations as rows)
- More traditional look, harder to handle complex trees
- Works well for smaller trees (< 50 people)

**Option C: React Flow**
- Pre-built node/edge rendering
- Good zoom/pan performance
- Drag to rearrange

Recommendation: **D3.js for the main tree view** + a **traditional pedigree
chart** view as an alternative (Ahnentafel-style ancestor chart).

### View Modes

| Mode | Description |
|------|-------------|
| **Network** | D3 force-directed — all persons connected, zoom/pan, click to explore |
| **Pedigree** | Classic ancestor chart — selected person at left, ancestors branching right |
| **Descendancy** | Selected person at top, descendants flowing down |
| **Timeline** | Persons on a horizontal timeline by birth year |
| **Map** | Persons placed on a map by birth/death/residence location |

### Person Detail Panel

When you click a person in any view:
- Slide-in panel with photo, full name, dates, places
- Bio/description (Markdown rendered)
- Ranchita connection note (highlighted in gold)
- Relations: parents, spouse(s), children, siblings
- Oral histories linked to this person (audio player)
- Photos tagged with this person (gallery)
- External links (Ancestry.com, FindAGrave)
- Edit button (if user has editor access)

---

## B5. Oral History Recording

### In-Browser Recording

```
1. User navigates to /legacy/oral-history/record
2. Selects or creates the person they're recording about
3. Clicks "Start Recording" → browser requests microphone access
4. Records audio via MediaRecorder API (WebM or WAV)
5. On stop: upload audio to Vercel Blob
6. Optionally: "Generate Transcript" → send audio to Claude for transcription
7. Edit transcript in a text editor
8. Save with metadata: title, description, date, location, tags
```

### Tech

```ts
// Browser-side recording
const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
// Chunks → Blob → upload to /api/legacy/oral-history/upload
```

### Transcription

Use Claude (via existing Anthropic API key) to transcribe:
- Upload audio → convert to base64 → send to Claude with prompt:
  "Transcribe this oral history recording. Preserve the speaker's voice
  and dialect. Note [inaudible] sections. Include timestamps for major
  topic changes."
- Alternative: OpenAI Whisper API if Claude audio transcription isn't
  available or affordable

### Player

Custom audio player component with:
- Play/pause, scrub bar, speed control (0.75x, 1x, 1.25x, 1.5x)
- Synchronized transcript highlighting (if transcript has timestamps)
- Download button
- Share button (generates link with privacy check)

---

## B6. Community Connections

### Cross-Tree Linking

The killer feature that Ancestry doesn't have for small communities.

When multiple families upload their trees, the system can find overlaps:
- "John Smith appears in both the Walter family tree and the Foote family tree"
- "Both families list 'Ranchita, CA' as a residence in the 1970s"

### Implementation

1. **Name + date matching:** When a new tree is imported, scan existing trees
   for persons with matching (lastName + approximate birthYear).
2. **Suggestion engine:** "Did you know? A 'James Walter' also appears in the
   Walter Family Tree. Could this be the same person?"
3. **User confirms/rejects:** If confirmed, trees are linked at that person.
4. **Community view:** `/legacy/community` — visualization of how all Ranchita
   families connect across generations.

### Privacy

- Only match against trees with `privacy: 'community'` or `privacy: 'public'`
- Never match against private trees
- Living persons: only match by surname, never show full details
- Users control what's visible about their family members

---

## B7. Property History

### Concept

"Who lived on your land before you?" A timeline of ownership and events
for parcels in the Ranchita area.

### Data Sources

- Community-contributed (residents add their property's history)
- Historical records (when available — county assessor data)
- Cross-referenced with family trees (link property events to persons)

### Property Page (`/legacy/property/[id]`)

- Map showing parcel location (Mapbox/Leaflet)
- Timeline: vertical scroll of events
  - "1955 — Homesteaded by the Smith family (40 acres)"
  - "1972 — Sold to the Walters. Built the first barn."
  - "1990 — Water well drilled. Connected to Ranchita community water."
  - "2005 — Current owners purchase property."
- Linked persons from family trees
- Historical photos of the property
- Current satellite view (Mapbox aerial)

---

## B8. Genealogy Reports (Classic Formats)

Based on Frederick's existing report formats from Ancestry.com:

| Report | Description |
|--------|-------------|
| **Ahnentafel** | Numbered ancestor list. Person 1, father 2, mother 3, paternal grandfather 4, etc. |
| **Descendancy** | All descendants of a selected ancestor, indented by generation. |
| **Register** | NEHGS Register format — narrative-style descendancy with biographical details. |
| **Family Group Sheet** | One-page summary of a nuclear family: parents + children with dates and places. |
| **Pedigree Chart** | Visual ancestor chart (4-5 generations). |

All exportable as PDF via the PDF generation engine from Phase 3.

---

## B9. Routes

```
/legacy                         — Landing page: "Build Your Ranchita Legacy"
/legacy/my-trees                — User's family trees
/legacy/tree/[id]               — Interactive tree viewer
/legacy/tree/[id]/person/[id]   — Person detail
/legacy/tree/[id]/edit          — Tree editor (add/edit persons + relations)
/legacy/import                  — GEDCOM import
/legacy/oral-history            — Oral history library
/legacy/oral-history/record     — Record new oral history
/legacy/oral-history/[id]       — Listen + read transcript
/legacy/property                — Property history map
/legacy/property/[id]           — Property timeline
/legacy/community               — Cross-family community connections
/legacy/reports/[treeId]        — Generate reports (Ahnentafel, etc.)
```

Admin:
```
/admin/legacy                   — Stats, moderation, cross-tree matching review
```

---

## B10. Privacy Model (Critical)

| Tree Privacy | Who Can See | Notes |
|-------------|------------|-------|
| `private` | Owner only | Default. No matching, no visibility. |
| `family` | Owner + invited collaborators | Collaborators can view, optionally edit. |
| `community` | All logged-in MVVCSO residents | Participates in cross-tree matching. |
| `public` | Anyone on the internet | For published family histories. |

**Living persons:** Even in `community` and `public` trees, living persons
show only first name + last initial. Full details visible only to tree
owner and editors. This protects privacy while still enabling connections.

---

## C. File Tree (Phase 6 Additions)

```
src/app/
├── kids/
│   ├── page.tsx                    # Landing + login
│   ├── home/
│   │   └── page.tsx                # Dashboard (after child login)
│   ├── games/
│   │   ├── page.tsx                # Game library
│   │   └── [gameId]/
│   │       └── page.tsx            # Play a game
│   ├── create/
│   │   ├── page.tsx                # New cartoon
│   │   └── [id]/
│   │       └── page.tsx            # Edit saved cartoon
│   ├── gallery/
│   │   └── page.tsx                # Approved cartoons gallery
│   ├── explore/
│   │   └── page.tsx                # Simplified virtual Ranchita
│   ├── badges/
│   │   └── page.tsx                # Badge collection + XP
│   └── privacy/
│       └── page.tsx                # COPPA privacy policy
├── legacy/
│   ├── page.tsx                    # Landing page
│   ├── my-trees/
│   │   └── page.tsx                # User's trees
│   ├── tree/
│   │   └── [id]/
│   │       ├── page.tsx            # Interactive tree viewer
│   │       ├── person/
│   │       │   └── [personId]/
│   │       │       └── page.tsx    # Person detail
│   │       ├── edit/
│   │       │   └── page.tsx        # Tree editor
│   │       └── reports/
│   │           └── page.tsx        # Generate reports
│   ├── import/
│   │   └── page.tsx                # GEDCOM import
│   ├── oral-history/
│   │   ├── page.tsx                # Library
│   │   ├── record/
│   │   │   └── page.tsx            # Record new
│   │   └── [id]/
│   │       └── page.tsx            # Listen + transcript
│   ├── property/
│   │   ├── page.tsx                # Property map
│   │   └── [id]/
│   │       └── page.tsx            # Property timeline
│   └── community/
│       └── page.tsx                # Cross-family connections
├── admin/(protected)/
│   ├── kids/
│   │   └── page.tsx                # Kids portal management
│   └── legacy/
│       └── page.tsx                # Genealogy management

src/components/
├── kids/
│   ├── game-card.tsx
│   ├── games/
│   │   ├── desert-creature-match.tsx
│   │   ├── fire-safety-quiz.tsx
│   │   ├── star-finder.tsx
│   │   ├── desert-plant-explorer.tsx
│   │   ├── trail-tracker.tsx
│   │   ├── weather-watcher.tsx
│   │   ├── community-helper.tsx
│   │   └── word-search.tsx
│   ├── cartoon-creator.tsx         # Konva.js scene editor
│   ├── badge-display.tsx
│   ├── xp-bar.tsx
│   ├── rancheti-mascot.tsx         # Animated Rancheti guide
│   └── child-login-form.tsx
├── legacy/
│   ├── tree-viewer.tsx             # D3.js interactive tree
│   ├── pedigree-chart.tsx          # Traditional ancestor chart
│   ├── person-card.tsx
│   ├── person-detail-panel.tsx
│   ├── person-editor.tsx           # Add/edit person form
│   ├── relation-editor.tsx         # Add/edit relations
│   ├── oral-history-player.tsx     # Audio player with transcript
│   ├── oral-history-recorder.tsx   # MediaRecorder integration
│   ├── gedcom-importer.tsx         # Upload + preview + confirm
│   ├── property-timeline.tsx
│   ├── community-network.tsx       # Cross-family D3 visualization
│   └── report-generator.tsx        # Ahnentafel, Descendancy, etc.

src/lib/
├── kids-auth.ts                    # Child login (PIN-based)
├── kids-gamification.ts            # Badge check + XP award engine
├── gedcom-parser.ts                # GEDCOM → our schema mapper
├── gedcom-exporter.ts              # Our schema → GEDCOM
├── genealogy.ts                    # Tree helpers, relation traversal
└── cross-tree-matching.ts          # Cross-family connection finder
```

---

## D. New Dependencies

```bash
npm install konva react-konva       # Cartoon creator canvas
npm install d3                      # Family tree visualization
npm install gedcom                  # GEDCOM parser (or parse-gedcom)
# MediaRecorder API is built into browsers — no package needed
```

---

## E. Phase 6 Task Checklist

### Phase 6a: Kids Portal Foundation (Session 1)

```
⬜ 1.  Add kids tables to schema (childAccounts, kidsBadges, kidsProgress,
       kidsEarnedBadges, kidsXp, kidsCartoons)
⬜ 2.  Run drizzle-kit generate + push
⬜ 3.  Build parental consent flow (parent dashboard → add child → email confirm)
⬜ 4.  Build child PIN-based auth (src/lib/kids-auth.ts)
⬜ 5.  Build /kids landing page + login
⬜ 6.  Build /kids/home dashboard (welcome, current level, recent badges, game shortcuts)
⬜ 7.  Build XP bar + level display component
⬜ 8.  Build badge display component
⬜ 9.  Build /kids/badges page (collection view)
⬜ 10. Build badge auto-award engine (src/lib/kids-gamification.ts)
⬜ 11. Seed badge data
⬜ 12. Build /kids/privacy (COPPA privacy policy page)
⬜ 13. Add "Kids" to nav bar (links to /kids)
⬜ 14. Write checkpoint
```

### Phase 6b: Learning Games (Session 2-3)

```
⬜ 15. Build game card component + /kids/games library page
⬜ 16. Build Desert Creature Match (memory card game)
⬜ 17. Build Fire Safety Quiz (interactive multiple choice)
⬜ 18. Build Desert Plant Explorer (drag label to photo)
⬜ 19. Build Community Helper (sorting game)
⬜ 20. Build Rancheti's Word Search (bilingual)
⬜ 21. Build Star Finder (constellation drawing — p5.js or Canvas)
⬜ 22. Build Trail Tracker (simplified PCT map click game)
⬜ 23. Build Weather Watcher (matching game)
⬜ 24. Wire all games to progress tracking + XP + badge engine
⬜ 25. Build Rancheti mascot animations (waving, celebrating, thinking)
⬜ 26. Write checkpoint
```

### Phase 6c: Cartoon Creator + Kids Polish (Session 3-4)

```
⬜ 27. Install konva + react-konva
⬜ 28. Create sprite library (SVGs: Rancheti poses, animals, backgrounds, props)
⬜ 29. Build cartoon creator canvas (drag-and-drop, text bubbles, layering)
⬜ 30. Build save/load (serialize to JSON → kidsCartoons table)
⬜ 31. Build PNG export (Konva.js toDataURL)
⬜ 32. Build /kids/gallery (parent-approved cartoons)
⬜ 33. Build parent approval flow (parent sees child's cartoons → approve for gallery)
⬜ 34. Build /kids/explore (simplified virtual Ranchita — reuse PCT map concepts)
⬜ 35. Build parent dashboard: manage children, view progress, toggle settings
⬜ 36. Build sensory-friendly mode toggle (muted colors, no animations)
⬜ 37. Build /admin/kids management page
⬜ 38. Responsive QA: all kids pages on tablet + phone
⬜ 39. Write checkpoint
```

### Phase 6d: Genealogy Core (Session 4-5)

```
⬜ 40. Add genealogy tables to schema (familyTrees, familyTreeCollaborators,
       familyPersons, familyRelations, oralHistories, propertyHistories, familyPhotos)
⬜ 41. Run drizzle-kit generate + push
⬜ 42. Build /legacy landing page
⬜ 43. Build /legacy/my-trees (create tree, list trees)
⬜ 44. Build person editor form (add/edit person with all fields)
⬜ 45. Build relation editor (link persons: parent, child, spouse, sibling)
⬜ 46. Build /legacy/tree/[id] — interactive D3.js tree viewer (network mode)
⬜ 47. Build person detail panel (slide-in with full info + relations)
⬜ 48. Build pedigree chart view (classic ancestor format)
⬜ 49. Build descendancy view
⬜ 50. Build timeline view (horizontal by birth year)
⬜ 51. Write checkpoint
```

### Phase 6e: GEDCOM + Oral History + Property (Session 5-6)

```
⬜ 52. Build GEDCOM parser (src/lib/gedcom-parser.ts)
⬜ 53. Build /legacy/import — upload + preview + confirm GEDCOM import
⬜ 54. Build GEDCOM exporter (src/lib/gedcom-exporter.ts)
⬜ 55. Build oral history recorder (MediaRecorder → upload → Vercel Blob)
⬜ 56. Build oral history player (custom audio player with speed control)
⬜ 57. Build transcript generation (audio → Claude → text)
⬜ 58. Build /legacy/oral-history library + record + detail pages
⬜ 59. Build property history map (/legacy/property — Leaflet/Mapbox)
⬜ 60. Build property timeline page (/legacy/property/[id])
⬜ 61. Write checkpoint
```

### Phase 6f: Community Connections + Reports + Polish (Session 6-7)

```
⬜ 62. Build cross-tree matching engine (src/lib/cross-tree-matching.ts)
⬜ 63. Build /legacy/community — D3 visualization of inter-family connections
⬜ 64. Build suggestion system ("Did you know? This person appears in another tree")
⬜ 65. Build report generator (Ahnentafel, Descendancy, Register, Family Group Sheet)
⬜ 66. Build PDF export for reports
⬜ 67. Build photo tagging (tag persons in family photos)
⬜ 68. Build family photo gallery with tagged-person filtering
⬜ 69. Build /admin/legacy management page
⬜ 70. Privacy enforcement QA: living persons restricted, tree privacy levels work
⬜ 71. Add "Legacy" to nav bar (authenticated residents)
⬜ 72. Activity log: wire all Phase 6 actions
⬜ 73. Responsive QA: all legacy pages on mobile + tablet + desktop
⬜ 74. Final checkpoint: Phase 6 COMPLETE — ALL PHASES COMPLETE
```

---

## F. Env Vars

No new env vars required for Phase 6. All existing services (Vercel Blob,
Resend, Anthropic, Stripe) are already configured from previous phases.

---

## G. Frederick Actions

| Action | Blocking? | Notes |
|--------|-----------|-------|
| Export GEDCOM from Ancestry.com | Helpful — seeds demo tree | Settings → Trees → Export Tree |
| Provide 5-10 family photos | Helpful — demo content | Historical + current Ranchita photos |
| Identify 2-3 Ranchita properties with known history | Helpful — seeds property feature | Who lived there, when, what happened |
| Approve kids game content | Not blocking — CC writes it | Review for accuracy (fire safety, plant ID) |
| Create kids character sprites (or approve AI-generated) | Phase 6c — needed for cartoons | SVG sprites for Rancheti + animals |

---

## H. Reminders for CC

1. **COPPA is federal law.** No shortcuts on the kids portal. Zero data collection
   beyond display name + age range. No third-party scripts. No tracking. No photos
   of children. PIN-based auth, not email.

2. **GEDCOM parsing is messy.** Real-world GEDCOM files have inconsistencies,
   non-standard extensions, and encoding issues. Test with Frederick's actual
   Ancestry.com export, not just spec-perfect files.

3. **D3.js force-directed graphs** need collision detection tuned for readability.
   Default force settings produce spaghetti. Tune: charge strength, link distance,
   collision radius. Test with 50+ person trees.

4. **Living person privacy** is a legal and ethical requirement. NEVER expose
   full details of living persons to anyone other than the tree owner. Even in
   cross-tree matching, use first name + last initial only.

5. **Oral history audio files can be large.** A 30-minute recording at decent
   quality is ~15-25MB. Use chunked upload. Compress client-side if possible.
   Vercel Blob max is 500MB — fine for individual files.

6. **Games must work offline.** Ranchita has Starlink. It drops. Every game should
   be playable offline after first load (service worker cache). Progress syncs
   when connection returns.

7. **Don't break anything.** Public site, admin, community, marketplace, merch,
   mercantile — all must continue working.

8. **Write checkpoints after every sub-phase.**

9. **Phase 6f task 74 marks ALL PHASES COMPLETE.** When that checkpoint is written,
   the MVVCSO platform is a fully-realized community operating system. Everything
   after that is Phase 7+ roadmap items.

---

*Phase 6 is the soul of the platform.*
*The kids learn from the desert. The families preserve their stories.*
*When task 74 ships, MVVCSO has no equal among rural nonprofits.*
*CC implements. CChat does not write code.*
*The Rancheti guides the children. The ancestors watch over the legacy.*
