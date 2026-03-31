# Phase 2c/2d Gap Fill — CC Handoff Spec

> **Date:** 2026-03-31
> **From:** CChat (Research & Architecture)
> **To:** CC (Claude Code CLI)
> **Priority:** Execute before Phase 4
> **Depends on:** Phase 2a/2b + Phase 3a-c all COMPLETE
> **Checkpoint location:** `docs/checkpoints/`

---

## 0. Context

CC jumped from Phase 2b directly to Phase 3 (Secretary/Treasurer/Compliance).
Good call — higher impact. But Phase 2c/2d items are needed before the board
can self-serve on content and documents. This spec fills those gaps.

### What exists already (from Phase 2a/3a):
- Auth system with magic links + role-based permissions ✅
- Admin layout with sidebar ✅
- `documents` and `documentFolders` tables in schema ✅ (created in Phase 2a)
- `blogPosts` table ✅ (from Phase 1)
- `subscribers` table ✅ (from Phase 1)
- `donations` table ✅ (from Phase 1)
- `activityLog` table ✅ (from Phase 2a)
- Resend email helper `src/lib/email.ts` ✅ (from Phase 2a)
- Board seed script with 9 pre-created document folders ✅

### What needs to be built:
1. Admin document vault / filing cabinet (upload, browse, search)
2. Public /resources page (public documents)
3. Admin blog management (create/edit posts without touching DB)
4. Admin newsletter management (subscriber list, compose, send)
5. Admin donations page (donation log, stats)
6. Public /bylaws page (interactive explainer)
7. Admin settings page (user management for president)
8. Activity log wiring (log actions across all modules)

---

## 1. Filing Cabinet (`/admin/documents`)

### What's already in DB:
The schema has `documents` and `documentFolders` tables. The seed script
created 9 top-level folders: Bylaws, Meeting Minutes, Financial Reports,
Grants, Insurance, Policies & SOPs, Correspondence, Legal, Templates.

### Build:
- **Folder tree** — Left panel showing hierarchical folder structure
- **File list** — Right panel showing documents in selected folder
- **Upload** — Drag-and-drop file upload → Vercel Blob → creates `documents` record
  - Accept: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, TXT
  - Max: 10MB per file (Vercel Blob limit is 500MB, but be reasonable)
  - Auto-detect mimeType from file extension
- **Document detail** — Click a document to see:
  - Inline preview (PDF via iframe, images via next/image, others show download link)
  - Metadata: title, category, version, access level, uploaded by, date
  - Edit metadata (title, description, tags, access level)
  - Version history (if same title re-uploaded)
- **Search** — Full-text search across document titles, descriptions, tags
- **Access level selector** — public | member | board | officer
- **Bulk actions** — Select multiple → change access level, move to folder, delete

### API Routes:
```
GET    /api/admin/documents              — List documents (filterable by folder, search)
POST   /api/admin/documents              — Create document record
PATCH  /api/admin/documents/[id]         — Update metadata
DELETE /api/admin/documents/[id]         — Delete document
POST   /api/admin/documents/upload       — Upload file to Vercel Blob, return URL
GET    /api/admin/documents/folders      — List folder tree
POST   /api/admin/documents/folders      — Create subfolder
```

### Permissions:
- President, Secretary, Treasurer, Content Manager: full CRUD
- Board Member: view board-level + public docs only
- Volunteer Coordinator: view public docs only

---

## 2. Public Resources (`/resources`)

### Build:
- New public route: `/resources`
- Shows only documents where `accessLevel = 'public'`
- Grouped by folder/category
- Each document: title, description, file type icon, download link
- Inline PDF preview for PDFs (click to expand)
- Search bar
- Bilingual (EN/ES) page chrome; document titles use `title` or `titleEs`
- Add "Resources" / "Recursos" to nav bar

---

## 3. Public Bylaws Explainer (`/bylaws`)

### Build:
- New public route: `/bylaws`
- **Table of contents** — Clickable, scrolls to section
- **Full bylaws text** — Rendered from Markdown
  - Source: the MVVCSO bylaws already exist in Google Drive
  - Store as a document in the filing cabinet OR as a dedicated content file
  - For now: hardcode the bylaws content as a Markdown string or MDX file
    that CC can populate. Frederick will provide the actual text.
- **Section-by-section accordion** — Each article/section is collapsible
- **Plain-English explainer** — Each section has a "What does this mean?"
  expandable panel with simplified explanation
  - AI-generated or CC-written summaries are fine as placeholders
- **Bilingual toggle** — EN/ES versions
  - English bylaws: primary
  - Spanish: placeholder "[Traducción pendiente]" until real translation available
- **Search** — Ctrl+F style search within the bylaws text
- Add "Bylaws" / "Estatutos" to nav bar

### Stretch (if time):
- Visual flowcharts for voting procedures (quorum rules, election process)
- Version comparison toggle (2020 vs 2025 bylaws side-by-side)

---

## 4. Admin Blog Management (`/admin/blog`)

### What exists:
- `blogPosts` table with bilingual fields (titleEn/titleEs, contentEn/contentEs)
- 3 seeded posts from Phase 1
- Public blog pages already render from DB

### Build:
- **Post list** — Data table: title, status (draft/published), category, date
- **Create post** — Form:
  - Title (EN + ES fields)
  - Content (Markdown editor with live preview — EN + ES tabs)
  - Excerpt (EN + ES)
  - Category dropdown
  - Cover image upload (Vercel Blob)
  - Published toggle + publish date
  - Slug (auto-generated from title, editable)
- **Edit post** — Same form, pre-populated
- **Delete post** — Soft delete or hard delete with confirmation

### API Routes:
```
GET    /api/admin/blog                   — List posts
POST   /api/admin/blog                   — Create post
PATCH  /api/admin/blog/[id]              — Update post
DELETE /api/admin/blog/[id]              — Delete post
```

### Permissions:
- President, Secretary, Content Manager: full CRUD
- Others: no access

---

## 5. Admin Newsletter Management (`/admin/newsletter`)

### What exists:
- `subscribers` table with email, name, language, status, source
- `/api/newsletter/subscribe` route (public)
- Resend integration in `src/lib/email.ts`

### Build:
- **Subscriber list** — Data table: email, name, language, status, source, date
  - Search by email/name
  - Filter by status (active/unsubscribed), language (en/es)
  - Export to CSV
  - Bulk unsubscribe
- **Subscriber stats** — Cards: total active, new this month, unsubscribed, by language
- **Compose newsletter** — Simple form:
  - Subject (EN + ES)
  - Body (Markdown editor — or rich text if feeling ambitious)
  - Preview (render as email)
  - Send to: All active / English only / Spanish only
  - Send test (to admin's own email)
  - Schedule or send immediately
- **Send via Resend** — Use Resend's batch send API
  - Rate limiting: max 100/batch for free tier
  - Track send status

### API Routes:
```
GET    /api/admin/newsletter/subscribers — List subscribers
POST   /api/admin/newsletter/send        — Send newsletter campaign
POST   /api/admin/newsletter/test        — Send test email
GET    /api/admin/newsletter/stats       — Subscriber statistics
```

### Permissions:
- President, Secretary, Content Manager: full access
- Others: view stats only

---

## 6. Admin Donations Page (`/admin/donations`)

### What exists:
- `donations` table populated by Stripe webhook
- Stripe integration from Phase 1

### Build:
- **Donation log** — Data table: donor name, email, amount, type, campaign, date
  - Sort by date, amount
  - Filter by type (one-time/recurring), campaign
  - Search by donor name/email
- **Stats cards** — Total this month, total this year, average donation, donor count
- **Monthly trend chart** — Recharts bar or line chart (last 12 months)
- **Export** — CSV download of all donations
- **Donor detail** — Click a row to see full info + donation history for that email

### API Routes:
```
GET    /api/admin/donations              — List donations
GET    /api/admin/donations/stats        — Donation statistics
```

### Permissions:
- President, Treasurer: full access
- Board Members: view totals only (no individual donor details)
- Others: no access

---

## 7. Admin Settings (`/admin/settings`)

### Build:
- **User management** (President only):
  - List all auth_users with name, email, role, status, last login
  - Edit user: change role, activate/deactivate
  - Add user: invite new board member (enter email → creates auth record)
  - Remove user: deactivate (never hard delete)
- **Org settings** (President only):
  - Organization name, address, phone, email
  - Fiscal year start month
  - Logo upload (when ready)
- **My profile** (all authenticated users):
  - Edit name, language preference
  - View login history

### API Routes:
```
GET    /api/admin/settings/users         — List users
POST   /api/admin/settings/users         — Create user
PATCH  /api/admin/settings/users/[id]    — Update user
```

### Permissions:
- President: full access to all settings
- Others: only "My profile" section

---

## 8. Activity Log Wiring

### What exists:
- `activityLog` table with type, title, description, entityId, entityType, userId
- Activity feed component on admin dashboard

### Wire up:
Every create/update/delete across all modules should log an entry:

| Action | Type | Title Template |
|--------|------|---------------|
| New subscriber | `subscriber_new` | "New subscriber: {email}" |
| Donation received | `donation_received` | "Donation: ${amount} from {name}" |
| Contact form | `contact_new` | "New inquiry from {name}" |
| Volunteer signup | `volunteer_signup` | "Volunteer application: {name}" |
| Volunteer approved | `volunteer_approved` | "Volunteer approved: {name}" |
| Event created | `event_created` | "Event created: {title}" |
| Event RSVP | `rsvp_new` | "RSVP for {event}: {name}" |
| Blog published | `blog_published` | "Blog post published: {title}" |
| Document uploaded | `document_uploaded` | "Document uploaded: {title}" |
| Meeting created | `meeting_created` | "Board meeting scheduled: {date}" |
| Minutes approved | `minutes_approved` | "Minutes approved for {date}" |
| Transaction added | `transaction_added` | "{type}: ${amount} — {description}" |
| Newsletter sent | `newsletter_sent` | "Newsletter sent to {count} subscribers" |
| Compliance completed | `compliance_completed` | "Completed: {task}" |
| User added | `user_added` | "User added: {name} ({role})" |

Add `logActivity()` helper calls to all existing API routes that don't already log.

---

## 9. Sidebar Navigation Updates

Add missing items to admin sidebar:

```
📊 Dashboard          /admin
👥 Volunteers         /admin/volunteers
📅 Events             /admin/events
📄 Documents          /admin/documents        ← NEW
📝 Blog               /admin/blog             ← NEW
📧 Newsletter         /admin/newsletter       ← NEW
💰 Donations          /admin/donations        ← NEW
📋 Bylaws             /admin/bylaws           ← NEW (links to public /bylaws)
🏛️ Secretary          /admin/secretary
💵 Treasurer          /admin/treasurer
✅ Compliance         /admin/compliance
⚙️ Settings           /admin/settings         ← NEW
```

---

## 10. Task Checklist

### Session 1: Documents + Resources + Bylaws

```
⬜ 1.  Build /admin/documents — folder tree + file list + upload
⬜ 2.  Build document detail view with inline preview
⬜ 3.  Build document search
⬜ 4.  Build /api/admin/documents routes (CRUD + upload)
⬜ 5.  Build public /resources page
⬜ 6.  Add "Resources" to nav bar
⬜ 7.  Build public /bylaws page (accordion + explainer + search)
⬜ 8.  Add "Bylaws" to nav bar
⬜ 9.  Write checkpoint
```

### Session 2: Blog + Newsletter + Donations Admin

```
⬜ 10. Build /admin/blog — post list + create/edit form + Markdown editor
⬜ 11. Build /api/admin/blog routes (CRUD)
⬜ 12. Build /admin/newsletter — subscriber list + stats + compose + send
⬜ 13. Build /api/admin/newsletter routes
⬜ 14. Build /admin/donations — donation log + stats + chart
⬜ 15. Build /api/admin/donations routes
⬜ 16. Write checkpoint
```

### Session 3: Settings + Activity Log + Polish

```
⬜ 17. Build /admin/settings — user management + org settings + my profile
⬜ 18. Build /api/admin/settings/users routes
⬜ 19. Wire activity logging across ALL existing API routes
⬜ 20. Add Documents, Blog, Newsletter, Donations, Settings to admin sidebar
⬜ 21. Permission enforcement QA across all new pages
⬜ 22. Final checkpoint: Phase 2c/2d Gap Fill COMPLETE
```

---

## 11. Reminders for CC

1. **Schema tables already exist.** documents, documentFolders, blogPosts, subscribers,
   donations, activityLog — all created in earlier phases. No new migrations needed
   unless a column is missing.

2. **Reuse existing components.** The data table, file upload, Markdown editor, and
   KPI card components from Phases 2b/3a should be reused here.

3. **Vercel Blob for document uploads.** Use the existing BLOB_READ_WRITE_TOKEN.
   Import from `@vercel/blob` — `put()` for uploads, `del()` for removals.

4. **Don't break existing pages.** Public site, secretary, treasurer, compliance
   must all continue working.

5. **Activity logging is the boring-but-critical task.** Go through every existing
   API route and add `logActivity()` calls where missing. This populates the
   dashboard feed that makes the admin feel alive.

---

*This fills the gaps between Phase 2b and Phase 3.*
*After this, the admin is fully self-service.*
*Phase 4 (community engagement) is next.*
*CC implements. CChat does not write code.*
