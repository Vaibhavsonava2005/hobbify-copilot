import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const vendors = sqliteTable('vendors', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: "timestamp" }).default(new Date()).notNull(),
});

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  vendorId: text('vendor_id').references(() => vendors.id).notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  isActive: integer('is_active', { mode: "boolean" }).default(true).notNull(),
  createdAt: integer('created_at', { mode: "timestamp" }).default(new Date()).notNull(),
});

export const memberships = sqliteTable('memberships', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id).notNull(),
  vendorId: text('vendor_id').references(() => vendors.id).notNull(),
  planName: text('plan_name').notNull(),
  startDate: integer('start_date', { mode: "timestamp" }).notNull(),
  endDate: integer('end_date', { mode: "timestamp" }).notNull(),
  status: text('status').notNull(), // 'active', 'expired', 'cancelled'
  createdAt: integer('created_at', { mode: "timestamp" }).default(new Date()).notNull(),
});

export const attendance = sqliteTable('attendance', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id).notNull(),
  vendorId: text('vendor_id').references(() => vendors.id).notNull(),
  date: integer('date', { mode: "timestamp" }).default(new Date()).notNull(),
  status: text('status').notNull(), // 'present', 'absent'
});

export const sports = sqliteTable('sports', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  vendorId: text('vendor_id').references(() => vendors.id).notNull(),
  name: text('name').notNull(),
});

export const venues = sqliteTable('venues', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  vendorId: text('vendor_id').references(() => vendors.id).notNull(),
  name: text('name').notNull(),
  location: text('location').notNull(),
});

export const courts = sqliteTable('courts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  vendorId: text('vendor_id').references(() => vendors.id).notNull(),
  venueId: text('venue_id').references(() => venues.id).notNull(),
  name: text('name').notNull(), // e.g., 'Court 1', 'Field A'
  sportId: text('sport_id').references(() => sports.id).notNull(),
});

export const coaches = sqliteTable('coaches', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  vendorId: text('vendor_id').references(() => vendors.id).notNull(),
  name: text('name').notNull(),
  specialtyId: text('specialty_id').references(() => sports.id).notNull(),
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  vendorId: text('vendor_id').references(() => vendors.id).notNull(),
  coachId: text('coach_id').references(() => coaches.id).notNull(),
  venueId: text('venue_id').references(() => venues.id).notNull(),
  courtId: text('court_id').references(() => courts.id),
  sportId: text('sport_id').references(() => sports.id).notNull(),
  startTime: integer('start_time', { mode: "timestamp" }).notNull(),
  endTime: integer('end_time', { mode: "timestamp" }).notNull(),
});

export const bookings = sqliteTable('bookings', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id).notNull(),
  vendorId: text('vendor_id').references(() => vendors.id).notNull(),
  sessionId: text('session_id').references(() => sessions.id),
  courtId: text('court_id').references(() => courts.id),
  date: integer('date', { mode: "timestamp" }).notNull(),
  status: text('status').notNull(), // 'confirmed', 'cancelled', 'refunded'
  createdAt: integer('created_at', { mode: "timestamp" }).default(new Date()).notNull(),
});

export const payments = sqliteTable('payments', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id).notNull(),
  vendorId: text('vendor_id').references(() => vendors.id).notNull(),
  amount: real('amount').notNull(),
  method: text('method').notNull(), // 'upi', 'card', 'cash'
  service: text('service').notNull(), // 'membership', 'booking', 'trial'
  status: text('status').notNull(), // 'success', 'failed', 'refunded'
  createdAt: integer('created_at', { mode: "timestamp" }).default(new Date()).notNull(),
});

export const trials = sqliteTable('trials', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id).notNull(),
  vendorId: text('vendor_id').references(() => vendors.id).notNull(),
  startDate: integer('start_date', { mode: "timestamp" }).notNull(),
  endDate: integer('end_date', { mode: "timestamp" }).notNull(),
  status: text('status').notNull(), // 'active', 'completed', 'extended'
});

export const invoices = sqliteTable('invoices', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id).notNull(),
  vendorId: text('vendor_id').references(() => vendors.id).notNull(),
  amount: real('amount').notNull(),
  status: text('status').notNull(), // 'paid', 'pending'
  createdAt: integer('created_at', { mode: "timestamp" }).default(new Date()).notNull(),
});

export const coupons = sqliteTable('coupons', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  vendorId: text('vendor_id').references(() => vendors.id).notNull(),
  code: text('code').notNull(),
  discount: real('discount').notNull(),
  expiresAt: integer('expires_at', { mode: "timestamp" }).notNull(),
  isActive: integer('is_active', { mode: "boolean" }).default(true).notNull(),
});

export const discounts = sqliteTable('discounts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  vendorId: text('vendor_id').references(() => vendors.id).notNull(),
  name: text('name').notNull(),
  percentage: real('percentage').notNull(),
  isActive: integer('is_active', { mode: "boolean" }).default(true).notNull(),
  createdAt: integer('created_at', { mode: "timestamp" }).default(new Date()).notNull(),
});

export const community_groups = sqliteTable('community_groups', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  vendorId: text('vendor_id').references(() => vendors.id).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: "timestamp" }).default(new Date()).notNull(),
});

export const community_events = sqliteTable('community_events', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  groupId: text('group_id').references(() => community_groups.id).notNull(),
  vendorId: text('vendor_id').references(() => vendors.id).notNull(),
  name: text('name').notNull(),
  eventDate: integer('event_date', { mode: "timestamp" }).notNull(),
});

export const community_posts = sqliteTable('community_posts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  groupId: text('group_id').references(() => community_groups.id).notNull(),
  userId: text('user_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: "timestamp" }).default(new Date()).notNull(),
});

export const swipe_matches = sqliteTable('swipe_matches', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userA: text('user_a').references(() => users.id).notNull(),
  userB: text('user_b').references(() => users.id).notNull(),
  vendorId: text('vendor_id').references(() => vendors.id).notNull(),
  status: text('status').notNull(), // 'matched', 'pending', 'rejected'
  createdAt: integer('created_at', { mode: "timestamp" }).default(new Date()).notNull(),
});

export const audit_logs = sqliteTable('audit_logs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  vendorId: text('vendor_id').references(() => vendors.id).notNull(),
  action: text('action').notNull(),
  resourceType: text('resource_type').notNull(),
  resourceId: text('resource_id').notNull(),
  details: text('details', { mode: "json" }),
  createdAt: integer('created_at', { mode: "timestamp" }).default(new Date()).notNull(),
});

export const tool_logs = sqliteTable('tool_logs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  vendorId: text('vendor_id').references(() => vendors.id).notNull(),
  toolName: text('tool_name').notNull(),
  input: text('input', { mode: "json" }),
  output: text('output', { mode: "json" }),
  executionTimeMs: integer('execution_time_ms'),
  createdAt: integer('created_at', { mode: "timestamp" }).default(new Date()).notNull(),
});

export const ai_conversations = sqliteTable('ai_conversations', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  vendorId: text('vendor_id').references(() => vendors.id).notNull(),
  title: text('title'),
  createdAt: integer('created_at', { mode: "timestamp" }).default(new Date()).notNull(),
});

export const approval_requests = sqliteTable('approval_requests', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  vendorId: text('vendor_id').references(() => vendors.id).notNull(),
  action: text('action').notNull(),
  payload: text('payload', { mode: "json" }).notNull(),
  summary: text('summary').notNull(),
  status: text('status').notNull(), // 'pending', 'approved', 'rejected'
  createdAt: integer('created_at', { mode: "timestamp" }).default(new Date()).notNull(),
});

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  vendorId: text('vendor_id').references(() => vendors.id).notNull(),
  userId: text('user_id').references(() => users.id).notNull(),
  message: text('message').notNull(),
  sentAt: integer('sent_at', { mode: "timestamp" }).default(new Date()).notNull(),
});
