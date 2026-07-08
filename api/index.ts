import { handle } from 'hono/vercel';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { eq, desc, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

// ═══════════════════════════════════════════════════════════════
// DATABASE SCHEMA (inlined from src/db/schema.ts)
// ═══════════════════════════════════════════════════════════════

const vendors = sqliteTable('vendors', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  city: text('city'),
  businessType: text('business_type'),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
});

const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  vendorId: text('vendor_id'),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  status: text('status').default('active'),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
});

const memberships = sqliteTable('memberships', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  userId: text('user_id'),
  vendorId: text('vendor_id'),
  plan: text('plan'),
  status: text('status').default('active'),
  startDate: text('start_date'),
  endDate: text('end_date'),
  amount: real('amount'),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
});

const bookings = sqliteTable('bookings', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  userId: text('user_id'),
  vendorId: text('vendor_id'),
  courtName: text('court_name'),
  date: text('date'),
  timeSlot: text('time_slot'),
  status: text('status').default('confirmed'),
  amount: real('amount'),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
});

const payments = sqliteTable('payments', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  vendorId: text('vendor_id'),
  userId: text('user_id'),
  amount: real('amount'),
  type: text('type'),
  status: text('status').default('completed'),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
});

const coaches = sqliteTable('coaches', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  vendorId: text('vendor_id'),
  name: text('name').notNull(),
  sport: text('sport'),
  rating: real('rating'),
  status: text('status').default('active'),
});

const sports = sqliteTable('sports', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  vendorId: text('vendor_id'),
  name: text('name').notNull(),
  category: text('category'),
});

const attendance = sqliteTable('attendance', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  userId: text('user_id'),
  vendorId: text('vendor_id'),
  date: text('date'),
  checkInTime: text('check_in_time'),
  checkOutTime: text('check_out_time'),
});

const ai_conversations = sqliteTable('ai_conversations', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  vendorId: text('vendor_id'),
  messages: text('messages'),
  summary: text('summary'),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
});

const approval_requests = sqliteTable('approval_requests', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  vendorId: text('vendor_id'),
  action: text('action'),
  payload: text('payload'),
  status: text('status').default('pending'),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
});

const audit_logs = sqliteTable('audit_logs', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  vendorId: text('vendor_id'),
  action: text('action'),
  resourceType: text('resource_type'),
  resourceId: text('resource_id'),
  details: text('details'),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
});

// ═══════════════════════════════════════════════════════════════
// DATABASE CONNECTION
// ═══════════════════════════════════════════════════════════════

function getDb() {
  let dbUrl = 'file:sqlite.db';
  
  if (process.env.VERCEL) {
    // On Vercel, use /tmp for writable SQLite
    const fs = require('fs');
    const path = require('path');
    const tmpDbPath = '/tmp/sqlite.db';
    if (!fs.existsSync(tmpDbPath)) {
      try {
        const srcPath = path.join(process.cwd(), 'sqlite.db');
        if (fs.existsSync(srcPath)) {
          fs.copyFileSync(srcPath, tmpDbPath);
        }
      } catch (e) {
        console.error('Failed to copy sqlite.db to /tmp', e);
      }
    }
    dbUrl = `file:${tmpDbPath}`;
  }

  const client = createClient({ url: dbUrl });
  return drizzle(client);
}

// ═══════════════════════════════════════════════════════════════
// IN-MEMORY RATE LIMITER (no Redis dependency)
// ═══════════════════════════════════════════════════════════════

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + 60000 });
    return true;
  }
  
  entry.count++;
  if (entry.count > 60) {
    return false;
  }
  return true;
}

// ═══════════════════════════════════════════════════════════════
// HONO APP + ROUTES
// ═══════════════════════════════════════════════════════════════

const app = new Hono().basePath('/api');

// CORS
app.use('*', cors());

// Rate limiting middleware
app.use('*', async (c, next) => {
  const ip = c.req.header('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(ip)) {
    return c.json({ error: 'Too many requests' }, 429);
  }
  await next();
});

// ─── Health Check ─────────────────────────────────────────────
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'HobbyFi Copilot API',
    version: '1.0.0',
    environment: process.env.VERCEL ? 'production' : 'development',
    timestamp: new Date().toISOString(),
  });
});

// ─── Copilot Chat ─────────────────────────────────────────────
app.post('/copilot/chat', async (c) => {
  try {
    const body = await c.req.json();
    const { vendorId, message, conversationId } = body;

    if (!vendorId || !message) {
      return c.json({ error: 'vendorId and message are required' }, 400);
    }

    // Demo AI response — production would route through Mastra agent
    const responses: Record<string, string> = {
      'revenue': `📊 **Revenue Summary for Smash Badminton Academy**\n\n| Period | Amount |\n|--------|--------|\n| Today | ₹8,500 |\n| This Week | ₹42,300 |\n| This Month | ₹1,24,500 |\n\n📈 Revenue is up **12%** compared to last month. Top contributing sport: **Badminton** (68% of total).`,
      'member': `👥 **Member Overview**\n\n- **Active Members:** 245\n- **Expiring This Week:** 12\n- **New This Month:** 34\n- **Inactive (30+ days):** 18\n\n⚠️ 12 memberships expire in the next 7 days. Would you like me to send renewal reminders?`,
      'booking': `📅 **Today's Bookings**\n\n| Time | Court | Member | Status |\n|------|-------|--------|--------|\n| 6:00 AM | Court 1 | Arjun Kumar | ✅ Confirmed |\n| 7:00 AM | Court 2 | Priya Singh | ✅ Confirmed |\n| 8:00 AM | Court 1 | Rahul Verma | ⏳ Pending |\n| 9:00 AM | Court 3 | Sneha Iyer | ✅ Confirmed |\n\n**Total:** 48 bookings today | **Utilization:** 78%`,
      'coach': `🏸 **Coach Performance**\n\n| Coach | Sport | Rating | Students |\n|-------|-------|--------|----------|\n| Rajesh Sharma | Badminton | ⭐ 4.8 | 32 |\n| Meera Nair | Swimming | ⭐ 4.9 | 28 |\n| Amit Patel | Tennis | ⭐ 4.6 | 24 |\n\nTop performer: **Meera Nair** with highest student satisfaction.`,
      'coupon': `🎟️ **Coupon Created Successfully!**\n\n⚠️ *This action requires your approval*\n\n- **Code:** SUMMER2026\n- **Discount:** 20%\n- **Valid Until:** July 31, 2026\n- **Max Uses:** 100\n\nWould you like to approve this action?`,
      'attendance': `📋 **Attendance Report**\n\n- **Today's Check-ins:** 120\n- **Peak Hour:** 6:00 - 8:00 AM (45 check-ins)\n- **Average Daily:** 105\n- **Trend:** ↗️ Up 5% this week\n\nMost popular day: **Saturday** with avg 145 check-ins.`,
    };

    const msgLower = message.toLowerCase();
    let responseText = `I understand your query: "${message}"\n\nAs the HobbyFi Copilot, I can help you with:\n- 📊 Revenue analytics\n- 👥 Member management\n- 📅 Booking operations\n- 🏸 Coach performance\n- 🎟️ Coupon creation\n- 📋 Attendance tracking\n\nPlease ask me about any of these topics!`;

    for (const [key, value] of Object.entries(responses)) {
      if (msgLower.includes(key)) {
        responseText = value;
        break;
      }
    }

    return c.json({
      success: true,
      data: {
        text: responseText,
        conversationId: conversationId || uuidv4(),
        timestamp: new Date().toISOString(),
        agent: 'supervisorAgent',
      }
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

// ─── Conversations ────────────────────────────────────────────
app.get('/copilot/conversations/:vendorId', async (c) => {
  try {
    const db = getDb();
    const vendorId = c.req.param('vendorId');
    const conversations = await db.select().from(ai_conversations).where(eq(ai_conversations.vendorId, vendorId));
    return c.json({ success: true, data: conversations });
  } catch (error: any) {
    return c.json({ success: true, data: [] });
  }
});

// ─── Approval Routes ──────────────────────────────────────────
app.post('/copilot/approve/:requestId', async (c) => {
  try {
    const db = getDb();
    const requestId = c.req.param('requestId');
    const [request] = await db.select().from(approval_requests).where(eq(approval_requests.id, requestId));
    
    if (!request) return c.json({ error: 'Request not found' }, 404);
    if (request.status !== 'pending') return c.json({ error: 'Already processed' }, 400);

    await db.update(approval_requests).set({ status: 'approved' }).where(eq(approval_requests.id, requestId));
    return c.json({ success: true, message: 'Action approved successfully' });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.post('/copilot/reject/:requestId', async (c) => {
  try {
    const db = getDb();
    const requestId = c.req.param('requestId');
    const [request] = await db.select().from(approval_requests).where(eq(approval_requests.id, requestId));
    
    if (!request) return c.json({ error: 'Request not found' }, 404);
    if (request.status !== 'pending') return c.json({ error: 'Already processed' }, 400);

    await db.update(approval_requests).set({ status: 'rejected' }).where(eq(approval_requests.id, requestId));
    return c.json({ success: true, message: 'Action rejected' });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.get('/copilot/approvals/:vendorId', async (c) => {
  try {
    const db = getDb();
    const vendorId = c.req.param('vendorId');
    const requests = await db.select().from(approval_requests).where(eq(approval_requests.vendorId, vendorId));
    return c.json({ success: true, data: requests });
  } catch (error: any) {
    return c.json({ success: true, data: [] });
  }
});

// ─── Audit Logs ───────────────────────────────────────────────
app.get('/copilot/logs/:vendorId', async (c) => {
  try {
    const db = getDb();
    const vendorId = c.req.param('vendorId');
    const logs = await db.select().from(audit_logs)
      .where(eq(audit_logs.vendorId, vendorId))
      .orderBy(desc(audit_logs.createdAt))
      .limit(50);
    return c.json({ success: true, data: logs });
  } catch (error: any) {
    return c.json({ success: true, data: [] });
  }
});

// ─── Dashboard Metrics ────────────────────────────────────────
app.get('/metrics/overview/:vendorId', async (c) => {
  return c.json({
    success: true,
    data: {
      revenue: { today: 8500, week: 42300, month: 124500, trend: '+12%' },
      bookings: { today: 48, week: 312, utilization: '78%' },
      attendance: { today: 120, average: 105, trend: '+5%' },
      members: { active: 245, expiring: 12, new: 34, inactive: 18 },
      topSport: 'Badminton',
      topCoach: 'Meera Nair',
      timestamp: new Date().toISOString(),
    }
  });
});

// ─── Catch-all for unknown API routes ─────────────────────────
app.all('/*', (c) => {
  return c.json({
    error: 'Not found',
    available_endpoints: [
      'POST /api/copilot/chat',
      'GET /api/copilot/conversations/:vendorId',
      'POST /api/copilot/approve/:requestId',
      'POST /api/copilot/reject/:requestId',
      'GET /api/copilot/approvals/:vendorId',
      'GET /api/copilot/logs/:vendorId',
      'GET /api/metrics/overview/:vendorId',
      'GET /api/health',
    ],
  }, 404);
});

export default handle(app);
