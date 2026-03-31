import { pgTable, text, timestamp, uuid, boolean, integer } from 'drizzle-orm/pg-core';

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
