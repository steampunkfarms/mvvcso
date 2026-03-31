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

// ── Phase 3: Board Meetings ─────────────────────────────────────

export const boardMeetings = pgTable('board_meetings', {
  id: uuid('id').primaryKey().defaultRandom(),
  meetingDate: timestamp('meeting_date').notNull(),
  meetingType: text('meeting_type').notNull().default('regular'),
  location: text('location').default('MVVCSO Community Center'),
  calledBy: text('called_by'),
  calledToOrderAt: timestamp('called_to_order_at'),
  adjournedAt: timestamp('adjourned_at'),
  quorumPresent: boolean('quorum_present'),
  agendaJson: text('agenda_json'), // JSON array of AgendaItem
  status: text('status').notNull().default('draft'),
  createdBy: uuid('created_by').references(() => authUsers.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const meetingAttendance = pgTable('meeting_attendance', {
  id: uuid('id').primaryKey().defaultRandom(),
  meetingId: uuid('meeting_id').notNull().references(() => boardMeetings.id),
  memberId: uuid('member_id').notNull().references(() => authUsers.id),
  status: text('status').notNull().default('present'),
});

export const meetingMinutes = pgTable('meeting_minutes', {
  id: uuid('id').primaryKey().defaultRandom(),
  meetingId: uuid('meeting_id').notNull().references(() => boardMeetings.id).unique(),
  audioUrl: text('audio_url'),
  rawNotes: text('raw_notes'),
  aiDraft: text('ai_draft'),
  aiDraftGeneratedAt: timestamp('ai_draft_generated_at'),
  editedDraft: text('edited_draft'),
  editedBy: uuid('edited_by').references(() => authUsers.id),
  editedAt: timestamp('edited_at'),
  approvedVersion: text('approved_version'),
  approvedAt: timestamp('approved_at'),
  approvalMethod: text('approval_method'),
  pdfUrl: text('pdf_url'),
  pdfGeneratedAt: timestamp('pdf_generated_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const meetingApprovals = pgTable('meeting_approvals', {
  id: uuid('id').primaryKey().defaultRandom(),
  meetingId: uuid('meeting_id').notNull().references(() => boardMeetings.id),
  memberId: uuid('member_id').notNull().references(() => authUsers.id),
  vote: text('vote').notNull(),
  comment: text('comment'),
  votedAt: timestamp('voted_at').notNull().defaultNow(),
});

export const meetingResolutions = pgTable('meeting_resolutions', {
  id: uuid('id').primaryKey().defaultRandom(),
  meetingId: uuid('meeting_id').notNull().references(() => boardMeetings.id),
  resolutionNumber: text('resolution_number'),
  title: text('title').notNull(),
  description: text('description'),
  motionBy: text('motion_by'),
  secondedBy: text('seconded_by'),
  votesFor: integer('votes_for').default(0),
  votesAgainst: integer('votes_against').default(0),
  abstentions: integer('abstentions').default(0),
  passed: boolean('passed'),
  effectiveDate: timestamp('effective_date'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ── Phase 3: Treasurer / Financials ─────────────────────────────

export const financialTransactions = pgTable('financial_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  date: timestamp('date').notNull(),
  type: text('type').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  amount: integer('amount').notNull(),
  fund: text('fund').notNull().default('general'),
  vendor: text('vendor'),
  checkNumber: text('check_number'),
  receiptUrl: text('receipt_url'),
  reconciled: boolean('reconciled').default(false),
  reconciledAt: timestamp('reconciled_at'),
  donationId: uuid('donation_id').references(() => donations.id),
  grantId: uuid('grant_id').references(() => grants.id),
  enteredBy: uuid('entered_by').references(() => authUsers.id),
  approvedBy: uuid('approved_by').references(() => authUsers.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const budgets = pgTable('budgets', {
  id: uuid('id').primaryKey().defaultRandom(),
  fiscalYear: integer('fiscal_year').notNull(),
  category: text('category').notNull(),
  fund: text('fund').notNull().default('general'),
  plannedAmount: integer('planned_amount').notNull(),
  notes: text('notes'),
  createdBy: uuid('created_by').references(() => authUsers.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const grants = pgTable('grants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  funder: text('funder').notNull(),
  amount: integer('amount'),
  requestedAmount: integer('requested_amount'),
  status: text('status').notNull().default('identified'),
  isRestricted: boolean('is_restricted').default(false),
  restrictionNotes: text('restriction_notes'),
  applicationDeadline: timestamp('application_deadline'),
  reportDeadline: timestamp('report_deadline'),
  grantPeriodStart: timestamp('grant_period_start'),
  grantPeriodEnd: timestamp('grant_period_end'),
  contactName: text('contact_name'),
  contactEmail: text('contact_email'),
  notes: text('notes'),
  documentsJson: text('documents_json'),
  createdBy: uuid('created_by').references(() => authUsers.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ── Phase 3: Compliance ─────────────────────────────────────────

export const complianceTasks = pgTable('compliance_tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  titleEs: text('title_es'),
  description: text('description'),
  category: text('category').notNull(),
  dueDate: timestamp('due_date').notNull(),
  completedDate: timestamp('completed_date'),
  assignedTo: uuid('assigned_to').references(() => authUsers.id),
  priority: text('priority').notNull().default('normal'),
  recurrence: text('recurrence'),
  status: text('status').notNull().default('pending'),
  notes: text('notes'),
  documentId: uuid('document_id').references(() => documents.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
