import { pgTable, text, timestamp, uuid, boolean, integer, jsonb } from 'drizzle-orm/pg-core';

export const subscribers = pgTable('subscribers', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  language: text('language').notNull().default('en'),
  status: text('status').notNull().default('active'),
  source: text('source').default('website'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  unsubscribedAt: timestamp('unsubscribed_at'),
});

export const contactSubmissions = pgTable('contact_submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  message: text('message').notNull(),
  language: text('language').notNull().default('en'),
  status: text('status').notNull().default('new'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const donations = pgTable('donations', {
  id: uuid('id').primaryKey().defaultRandom(),
  stripeSessionId: text('stripe_session_id').unique(),
  stripeCustomerId: text('stripe_customer_id'),
  donorName: text('donor_name'),
  donorEmail: text('donor_email'),
  amount: integer('amount').notNull(),
  currency: text('currency').notNull().default('usd'),
  type: text('type').notNull().default('one-time'),
  status: text('status').notNull().default('completed'),
  campaign: text('campaign').default('general'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const blogPosts = pgTable('blog_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  titleEn: text('title_en').notNull(),
  titleEs: text('title_es'),
  contentEn: text('content_en').notNull(),
  contentEs: text('content_es'),
  excerptEn: text('excerpt_en'),
  excerptEs: text('excerpt_es'),
  author: text('author').default('MVVCSO'),
  category: text('category'),
  coverImage: text('cover_image'),
  published: boolean('published').notNull().default(false),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ── Phase 2: Auth ────────────────────────────────────────────────

export const authUsers = pgTable('auth_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').notNull().default('board_member'),
  language: text('language').notNull().default('en'),
  isActive: boolean('is_active').notNull().default(true),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const authSessions = pgTable('auth_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => authUsers.id),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const magicLinks = pgTable('magic_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull(),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ── Phase 2: Volunteers ──────────────────────────────────────────

export const volunteers = pgTable('volunteers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  address: text('address'),
  language: text('language').notNull().default('en'),
  skills: text('skills'),
  availability: text('availability'),
  status: text('status').notNull().default('pending'),
  backgroundCheck: text('background_check').default('not_started'),
  backgroundCheckDate: timestamp('background_check_date'),
  totalHours: integer('total_hours').default(0),
  notes: text('notes'),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const volunteerHours = pgTable('volunteer_hours', {
  id: uuid('id').primaryKey().defaultRandom(),
  volunteerId: uuid('volunteer_id').notNull().references(() => volunteers.id),
  eventId: uuid('event_id').references(() => events.id),
  date: timestamp('date').notNull(),
  hours: integer('hours').notNull(),
  description: text('description'),
  approvedBy: uuid('approved_by').references(() => authUsers.id),
  approvedAt: timestamp('approved_at'),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ── Phase 2: Events ──────────────────────────────────────────────

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  titleEn: text('title_en').notNull(),
  titleEs: text('title_es'),
  descriptionEn: text('description_en'),
  descriptionEs: text('description_es'),
  date: timestamp('date').notNull(),
  endDate: timestamp('end_date'),
  location: text('location'),
  maxRsvp: integer('max_rsvp'),
  isPublic: boolean('is_public').notNull().default(true),
  category: text('category'),
  createdBy: uuid('created_by').references(() => authUsers.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const eventRsvps = pgTable('event_rsvps', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').notNull().references(() => events.id),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  status: text('status').notNull().default('attending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ── Phase 2: Documents ───────────────────────────────────────────

export const documentFolders = pgTable('document_folders', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  parentId: uuid('parent_id'),
  accessLevel: text('access_level').notNull().default('board'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  titleEs: text('title_es'),
  description: text('description'),
  category: text('category').notNull(),
  folderId: uuid('folder_id').references(() => documentFolders.id),
  fileUrl: text('file_url').notNull(),
  fileName: text('file_name').notNull(),
  fileSize: integer('file_size'),
  mimeType: text('mime_type'),
  version: integer('version').notNull().default(1),
  accessLevel: text('access_level').notNull().default('board'),
  language: text('language').default('en'),
  tags: text('tags'),
  uploadedBy: uuid('uploaded_by').references(() => authUsers.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ── Phase 2: Activity Log ────────────────────────────────────────

export const activityLog = pgTable('activity_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: text('type').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  entityId: text('entity_id'),
  entityType: text('entity_type'),
  userId: uuid('user_id').references(() => authUsers.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
