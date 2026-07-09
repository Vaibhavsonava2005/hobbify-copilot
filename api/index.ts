import { handle } from 'hono/vercel';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { readFileSync } from 'fs';
import { join } from 'path';

// ═══════════════════════════════════════════════════════════════
// HOBBYFI COPILOT — VERCEL SERVERLESS FUNCTION
// No basePath — routes ALL traffic (static + API) directly
// ═══════════════════════════════════════════════════════════════

function generateId() {
  return 'id_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + 60000 });
    return true;
  }
  entry.count++;
  return entry.count <= 60;
}

// ═══════════════════════════════════════════════════════════════
// NO basePath — root-level Hono app handles everything
// ═══════════════════════════════════════════════════════════════

const app = new Hono();

app.use('*', cors());

app.use('*', async (c, next) => {
  const ip = c.req.header('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(ip)) {
    return c.json({ error: 'Too many requests' }, 429);
  }
  await next();
});

// ═══════════════════════════════════════════════════════════════
// STATIC UI FILES — served from project root
// ═══════════════════════════════════════════════════════════════

function tryReadFile(filename: string): string | null {
  const paths = [
    join(process.cwd(), filename),
    join(__dirname, '..', filename),
    join(__dirname, filename),
  ];
  for (const p of paths) {
    try { return readFileSync(p, 'utf-8'); } catch {}
  }
  return null;
}

app.get('/', (c) => {
  const html = tryReadFile('index.html');
  if (html) return c.html(html);
  return c.html('<html><body><h1>HobbyFi Copilot</h1><p>UI files not bundled. API is live at <a href="/api/health">/api/health</a></p></body></html>');
});

app.get('/style.css', (c) => {
  const css = tryReadFile('style.css');
  if (css) return new Response(css, { headers: { 'Content-Type': 'text/css', 'Cache-Control': 'public, max-age=31536000' } });
  return c.text('', 404);
});

app.get('/app.js', (c) => {
  const js = tryReadFile('app.js');
  if (js) return new Response(js, { headers: { 'Content-Type': 'application/javascript', 'Cache-Control': 'public, max-age=31536000' } });
  return c.text('', 404);
});

// ═══════════════════════════════════════════════════════════════
// API ROUTES — all under /api/ prefix
// ═══════════════════════════════════════════════════════════════

app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'HobbyFi Copilot API',
    version: '1.0.0',
    environment: 'production',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.post('/api/copilot/chat', async (c) => {
  try {
    const body = await c.req.json();
    const { vendorId, message, conversationId } = body;

    if (!vendorId || !message) {
      return c.json({ error: 'vendorId and message are required' }, 400);
    }

    const responses: Record<string, string> = {
      'revenue': `📊 **Revenue Summary for Smash Badminton Academy**\n\n| Period | Amount |\n|--------|--------|\n| Today | ₹8,500 |\n| This Week | ₹42,300 |\n| This Month | ₹1,24,500 |\n\n📈 Revenue is up **12%** compared to last month. Top contributing sport: **Badminton** (68% of total).`,
      'member': `👥 **Member Overview**\n\n- **Active Members:** 245\n- **Expiring This Week:** 12\n- **New This Month:** 34\n- **Inactive (30+ days):** 18\n\n⚠️ 12 memberships expire in the next 7 days. Would you like me to send renewal reminders?`,
      'booking': `📅 **Today's Bookings**\n\n| Time | Court | Member | Status |\n|------|-------|--------|--------|\n| 6:00 AM | Court 1 | Arjun Kumar | ✅ Confirmed |\n| 7:00 AM | Court 2 | Priya Singh | ✅ Confirmed |\n| 8:00 AM | Court 1 | Rahul Verma | ⏳ Pending |\n| 9:00 AM | Court 3 | Sneha Iyer | ✅ Confirmed |\n\n**Total:** 48 bookings today | **Utilization:** 78%`,
      'coach': `🏸 **Coach Performance**\n\n| Coach | Sport | Rating | Students |\n|-------|-------|--------|----------|\n| Rajesh Sharma | Badminton | ⭐ 4.8 | 32 |\n| Meera Nair | Swimming | ⭐ 4.9 | 28 |\n| Amit Patel | Tennis | ⭐ 4.6 | 24 |\n\nTop performer: **Meera Nair** with highest student satisfaction.`,
      'coupon': `🎟️ **Coupon Created Successfully!**\n\n⚠️ *This action requires your approval*\n\n- **Code:** SUMMER2026\n- **Discount:** 20%\n- **Valid Until:** July 31, 2026\n- **Max Uses:** 100\n\nWould you like to approve this action?`,
      'attendance': `📋 **Attendance Report**\n\n- **Today's Check-ins:** 120\n- **Peak Hour:** 6:00 - 8:00 AM (45 check-ins)\n- **Average Daily:** 105\n- **Trend:** ↗️ Up 5% this week\n\nMost popular day: **Saturday** with avg 145 check-ins.`,
      'pass': `🎫 **Expiring Passes This Week**\n\n| Member | Plan | Expires | Amount |\n|--------|------|---------|--------|\n| Arjun Kumar | Gold Monthly | Jul 10 | ₹2,500 |\n| Priya Singh | Silver Monthly | Jul 11 | ₹1,800 |\n| Rahul Verma | Gold Monthly | Jul 12 | ₹2,500 |\n| Neha Gupta | Platinum | Jul 14 | ₹4,000 |\n\n**Action:** Send automated renewal reminders to these 12 members?`,
      'inactive': `⚠️ **Inactive Members (30+ days)**\n\n| Member | Last Visit | Plan | Status |\n|--------|-----------|------|--------|\n| Vikram Joshi | Jun 2 | Gold | At Risk |\n| Anita Desai | Jun 5 | Silver | At Risk |\n| Karan Mehta | May 28 | Basic | Churned |\n\n**Recommendation:** Send re-engagement offers with 15% discount.`,
      'slot': `⏰ **Busiest Slots Analysis**\n\n| Time Slot | Avg Bookings | Utilization |\n|-----------|-------------|-------------|\n| 6:00 - 8:00 AM | 12 | 95% |\n| 8:00 - 10:00 AM | 8 | 65% |\n| 4:00 - 6:00 PM | 10 | 80% |\n| 6:00 - 8:00 PM | 11 | 88% |\n\n**Peak:** Morning 6-8 AM | **Opportunity:** Afternoon 12-4 PM (25% utilization)`,
    };

    const msgLower = message.toLowerCase();
    let responseText = `I understand your query: "${message}"\n\nAs the HobbyFi Copilot, I can help you with:\n- 📊 Revenue analytics & trends\n- 👥 Member management & insights\n- 📅 Booking operations & scheduling\n- 🏸 Coach performance tracking\n- 🎟️ Coupon creation & management\n- 📋 Attendance tracking & reports\n- 🎫 Pass & membership renewals\n- ⏰ Slot utilization analysis\n\nTry asking about any of these topics!`;

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
        conversationId: conversationId || generateId(),
        timestamp: new Date().toISOString(),
        agent: 'supervisorAgent',
      }
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

app.get('/api/copilot/conversations/:vendorId', (c) => {
  return c.json({ success: true, data: [] });
});

app.post('/api/copilot/approve/:requestId', (c) => {
  const requestId = c.req.param('requestId');
  return c.json({ success: true, message: `Action ${requestId} approved successfully` });
});

app.post('/api/copilot/reject/:requestId', (c) => {
  const requestId = c.req.param('requestId');
  return c.json({ success: true, message: `Action ${requestId} rejected` });
});

app.get('/api/copilot/approvals/:vendorId', (c) => {
  return c.json({ success: true, data: [] });
});

app.get('/api/copilot/logs/:vendorId', (c) => {
  return c.json({ success: true, data: [] });
});

app.get('/api/metrics/overview/:vendorId', (c) => {
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

// ═══════════════════════════════════════════════════════════════
// EXPORT — Named HTTP method exports for Vercel Web Standard
// ═══════════════════════════════════════════════════════════════

const handler = handle(app);
export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
