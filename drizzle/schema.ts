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
  displayName: text('display_name'),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
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

// ── Phase 4: Community (Ranchita Commons) ───────────────────────

export const communityPosts = pgTable('community_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  authorId: uuid('author_id').notNull().references(() => authUsers.id),
  content: text('content').notNull(),
  photosJson: text('photos_json'),
  language: text('language').default('en'),
  channel: text('channel').notNull().default('general'),
  isPinned: boolean('is_pinned').default(false),
  isAnnouncement: boolean('is_announcement').default(false),
  status: text('status').notNull().default('active'),
  crossPostedTo: text('cross_posted_to'),
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
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ── Phase 4: Marketplace ────────────────────────────────────────

export const marketplaceListings = pgTable('marketplace_listings', {
  id: uuid('id').primaryKey().defaultRandom(),
  sellerId: uuid('seller_id').notNull().references(() => authUsers.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  type: text('type').notNull().default('for_sale'),
  price: integer('price'),
  photosJson: text('photos_json'),
  condition: text('condition'),
  location: text('location').default('Ranchita area'),
  language: text('language').default('en'),
  status: text('status').notNull().default('active'),
  expiresAt: timestamp('expires_at'),
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

// ── Phase 4: Balloting ──────────────────────────────────────────

export const ballots = pgTable('ballots', {
  id: uuid('id').primaryKey().defaultRandom(),
  titleEn: text('title_en').notNull(),
  titleEs: text('title_es'),
  descriptionEn: text('description_en'),
  descriptionEs: text('description_es'),
  type: text('type').notNull(),
  eligibility: text('eligibility').notNull().default('voting_member'),
  isAnonymous: boolean('is_anonymous').notNull().default(true),
  openDate: timestamp('open_date').notNull(),
  closeDate: timestamp('close_date').notNull(),
  status: text('status').notNull().default('draft'),
  resultPublic: boolean('result_public').notNull().default(true),
  totalEligible: integer('total_eligible'),
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
  voterHash: text('voter_hash').notNull(),
  rank: integer('rank'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const ballotVoterRoll = pgTable('ballot_voter_roll', {
  id: uuid('id').primaryKey().defaultRandom(),
  ballotId: uuid('ballot_id').notNull().references(() => ballots.id),
  userId: uuid('user_id').notNull().references(() => authUsers.id),
  votedAt: timestamp('voted_at').notNull().defaultNow(),
});

// ── Phase 4: Social Media Auto-Posting ──────────────────────────

export const socialPosts = pgTable('social_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  sourcePostId: uuid('source_post_id').references(() => communityPosts.id),
  platform: text('platform').notNull(),
  content: text('content').notNull(),
  imageUrls: text('image_urls'),
  hashtags: text('hashtags'),
  status: text('status').notNull().default('draft'),
  scheduledFor: timestamp('scheduled_for'),
  publishedAt: timestamp('published_at'),
  platformPostId: text('platform_post_id'),
  engagementJson: text('engagement_json'),
  createdBy: uuid('created_by').references(() => authUsers.id),
  approvedBy: uuid('approved_by').references(() => authUsers.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ── Phase 5: Merch Shop ─────────────────────────────────────────

export const shopProducts = pgTable('shop_products', {
  id: uuid('id').primaryKey().defaultRandom(),
  printfulSyncProductId: integer('printful_sync_product_id').notNull().unique(),
  name: text('name').notNull(),
  nameEs: text('name_es'),
  description: text('description'),
  descriptionEs: text('description_es'),
  category: text('category').notNull(),
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
  name: text('name').notNull(),
  sku: text('sku'),
  retailPrice: integer('retail_price').notNull(),
  printfulPrice: integer('printful_price').notNull(),
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
  shippingAddress: text('shipping_address_json').notNull(),
  subtotal: integer('subtotal').notNull(),
  shipping: integer('shipping').notNull(),
  tax: integer('tax').default(0),
  total: integer('total').notNull(),
  printfulCost: integer('printful_cost'),
  margin: integer('margin'),
  status: text('status').notNull().default('pending'),
  trackingNumber: text('tracking_number'),
  trackingUrl: text('tracking_url'),
  printfulStatusJson: text('printful_status_json'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const shopOrderItems = pgTable('shop_order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => shopOrders.id),
  variantId: uuid('variant_id').notNull().references(() => shopVariants.id),
  quantity: integer('quantity').notNull().default(1),
  unitPrice: integer('unit_price').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ── Phase 5: Artisan Mercantile ─────────────────────────────────

export const artisanVendors = pgTable('artisan_vendors', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => authUsers.id).unique(),
  shopName: text('shop_name').notNull(),
  shopNameEs: text('shop_name_es'),
  bio: text('bio'),
  bioEs: text('bio_es'),
  avatarUrl: text('avatar_url'),
  bannerUrl: text('banner_url'),
  stripeConnectId: text('stripe_connect_id'),
  stripeOnboardingComplete: boolean('stripe_onboarding_complete').default(false),
  commissionRate: integer('commission_rate').notNull().default(10),
  status: text('status').notNull().default('pending'),
  categories: text('categories'),
  location: text('location').default('Ranchita area'),
  contactMethod: text('contact_method'),
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
  price: integer('price').notNull(),
  compareAtPrice: integer('compare_at_price'),
  photosJson: text('photos_json'),
  inventory: integer('inventory'),
  weight: text('weight'),
  dimensions: text('dimensions'),
  fulfillment: text('fulfillment').notNull().default('local_pickup'),
  isActive: boolean('is_active').notNull().default(true),
  isFeatured: boolean('is_featured').default(false),
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
  subtotal: integer('subtotal').notNull(),
  commission: integer('commission').notNull(),
  vendorPayout: integer('vendor_payout').notNull(),
  fulfillmentMethod: text('fulfillment_method').notNull(),
  shippingAddress: text('shipping_address_json'),
  status: text('status').notNull().default('pending'),
  trackingNumber: text('tracking_number'),
  vendorNotes: text('vendor_notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const artisanOrderItems = pgTable('artisan_order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => artisanOrders.id),
  productId: uuid('product_id').notNull().references(() => artisanProducts.id),
  quantity: integer('quantity').notNull().default(1),
  unitPrice: integer('unit_price').notNull(),
});

// ── Phase 5: Fundraising ────────────────────────────────────────

export const campaigns = pgTable('campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  nameEs: text('name_es'),
  description: text('description'),
  descriptionEs: text('description_es'),
  goalAmount: integer('goal_amount'),
  raisedAmount: integer('raised_amount').notNull().default(0),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  coverImage: text('cover_image'),
  isActive: boolean('is_active').notNull().default(true),
  fund: text('fund').notNull().default('general'),
  createdBy: uuid('created_by').references(() => authUsers.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const pledges = pgTable('pledges', {
  id: uuid('id').primaryKey().defaultRandom(),
  campaignId: uuid('campaign_id').references(() => campaigns.id),
  donorName: text('donor_name').notNull(),
  donorEmail: text('donor_email').notNull(),
  amount: integer('amount').notNull(),
  frequency: text('frequency').notNull().default('one-time'),
  status: text('status').notNull().default('pledged'),
  fulfilledAmount: integer('fulfilled_amount').default(0),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ── Phase 6: Kids Portal ────────────────────────────────────────

export const childAccounts = pgTable('child_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  parentId: uuid('parent_id').notNull().references(() => authUsers.id),
  displayName: text('display_name').notNull(),
  pin: text('pin').notNull(), // 6-digit PIN for child login
  ageRange: text('age_range').notNull(),
  avatarId: text('avatar_id').default('yeti-default'),
  consentDate: timestamp('consent_date').notNull(),
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
  iconId: text('icon_id').notNull(),
  category: text('category').notNull(),
  criteria: text('criteria').notNull(),
  xpReward: integer('xp_reward').notNull().default(10),
  sortOrder: integer('sort_order').default(0),
});

export const kidsProgress = pgTable('kids_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  childId: uuid('child_id').notNull().references(() => childAccounts.id),
  activityType: text('activity_type').notNull(),
  activityId: text('activity_id').notNull(),
  score: integer('score'),
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
  source: text('source').notNull(),
  sourceId: text('source_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const kidsCartoons = pgTable('kids_cartoons', {
  id: uuid('id').primaryKey().defaultRandom(),
  childId: uuid('child_id').notNull().references(() => childAccounts.id),
  title: text('title').notNull(),
  sceneDataJson: text('scene_data_json').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  isPublic: boolean('is_public').notNull().default(false),
  parentApproved: boolean('parent_approved').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ── Phase 6: Genealogy Suite ────────────────────────────────────

export const familyTrees = pgTable('family_trees', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id').notNull().references(() => authUsers.id),
  name: text('name').notNull(),
  description: text('description'),
  privacy: text('privacy').notNull().default('private'),
  coverImageUrl: text('cover_image_url'),
  personCount: integer('person_count').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const familyTreeCollaborators = pgTable('family_tree_collaborators', {
  id: uuid('id').primaryKey().defaultRandom(),
  treeId: uuid('tree_id').notNull().references(() => familyTrees.id),
  userId: uuid('user_id').notNull().references(() => authUsers.id),
  role: text('role').notNull().default('viewer'),
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
  gender: text('gender'),
  birthDate: text('birth_date'),
  birthPlace: text('birth_place'),
  deathDate: text('death_date'),
  deathPlace: text('death_place'),
  bio: text('bio'),
  photoUrl: text('photo_url'),
  photosJson: text('photos_json'),
  isLiving: boolean('is_living').default(false),
  ranchitaConnection: text('ranchita_connection'),
  externalLinks: text('external_links_json'),
  gedcomId: text('gedcom_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const familyRelations = pgTable('family_relations', {
  id: uuid('id').primaryKey().defaultRandom(),
  treeId: uuid('tree_id').notNull().references(() => familyTrees.id),
  personId: uuid('person_id').notNull().references(() => familyPersons.id),
  relatedPersonId: uuid('related_person_id').notNull().references(() => familyPersons.id),
  type: text('type').notNull(),
  marriageDate: text('marriage_date'),
  marriagePlace: text('marriage_place'),
  divorceDate: text('divorce_date'),
  relationOrder: integer('relation_order'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const oralHistories = pgTable('oral_histories', {
  id: uuid('id').primaryKey().defaultRandom(),
  treeId: uuid('tree_id').references(() => familyTrees.id),
  personId: uuid('person_id').references(() => familyPersons.id),
  recordedById: uuid('recorded_by_id').references(() => authUsers.id),
  title: text('title').notNull(),
  description: text('description'),
  audioUrl: text('audio_url').notNull(),
  transcript: text('transcript'),
  transcriptLanguage: text('transcript_language').default('en'),
  duration: integer('duration'),
  recordedDate: timestamp('recorded_date'),
  location: text('location'),
  tags: text('tags'),
  privacy: text('privacy').notNull().default('family'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const propertyHistories = pgTable('property_histories', {
  id: uuid('id').primaryKey().defaultRandom(),
  parcelId: text('parcel_id'),
  address: text('address'),
  lat: text('lat'),
  lng: text('lng'),
  description: text('description'),
  timelineJson: text('timeline_json'),
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
  dateTaken: text('date_taken'),
  location: text('location'),
  taggedPersonsJson: text('tagged_persons_json'),
  privacy: text('privacy').notNull().default('family'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
