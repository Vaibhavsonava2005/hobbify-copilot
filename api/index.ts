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
  if (html) return new Response(html, { headers: { 'Content-Type': 'text/html', 'Cache-Control': 'no-cache, no-store, must-revalidate' } });
  return c.html('<html><body><h1>HobbyFi Copilot</h1><p>UI files not bundled. API is live at <a href="/api/health">/api/health</a></p></body></html>');
});

app.get('/style.css', (c) => {
  const css = tryReadFile('style.css');
  if (css) return new Response(css, { headers: { 'Content-Type': 'text/css', 'Cache-Control': 'no-cache, no-store, must-revalidate' } });
  return c.text('', 404);
});

app.get('/app.js', (c) => {
  const js = tryReadFile('app.js');
  if (js) return new Response(js, { headers: { 'Content-Type': 'application/javascript', 'Cache-Control': 'no-cache, no-store, must-revalidate' } });
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
      'sale': `📊 **Revenue Summary for Smash Badminton Academy**\n\n| Period | Amount |\n|--------|--------|\n| Today | ₹8,500 |\n| This Week | ₹42,300 |\n| This Month | ₹1,24,500 |\n\n📈 Revenue is up **12%** compared to last month. Top contributing sport: **Badminton** (68% of total).`,
      'earn': `📊 **Revenue Summary for Smash Badminton Academy**\n\n| Period | Amount |\n|--------|--------|\n| Today | ₹8,500 |\n| This Week | ₹42,300 |\n| This Month | ₹1,24,500 |\n\n📈 Revenue is up **12%** compared to last month. Top contributing sport: **Badminton** (68% of total).`,
      'income': `📊 **Revenue Summary for Smash Badminton Academy**\n\n| Period | Amount |\n|--------|--------|\n| Today | ₹8,500 |\n| This Week | ₹42,300 |\n| This Month | ₹1,24,500 |\n\n📈 Revenue is up **12%** compared to last month. Top contributing sport: **Badminton** (68% of total).`,
      'member': `👥 **Member Overview**\n\n- **Active Members:** 245\n- **Expiring This Week:** 12\n- **New This Month:** 34\n- **Inactive (30+ days):** 18\n\n⚠️ 12 memberships expire in the next 7 days. Would you like me to send renewal reminders?`,
      'user': `👥 **Member Overview**\n\n- **Active Members:** 245\n- **Expiring This Week:** 12\n- **New This Month:** 34\n- **Inactive (30+ days):** 18\n\n⚠️ 12 memberships expire in the next 7 days. Would you like me to send renewal reminders?`,
      'subscriber': `👥 **Member Overview**\n\n- **Active Members:** 245\n- **Expiring This Week:** 12\n- **New This Month:** 34\n- **Inactive (30+ days):** 18\n\n⚠️ 12 memberships expire in the next 7 days. Would you like me to send renewal reminders?`,
      'booking': `📅 **Today's Bookings**\n\n| Time | Court | Member | Status |\n|------|-------|--------|--------|\n| 6:00 AM | Court 1 | Arjun Kumar | ✅ Confirmed |\n| 7:00 AM | Court 2 | Priya Singh | ✅ Confirmed |\n| 8:00 AM | Court 1 | Rahul Verma | ⏳ Pending |\n| 9:00 AM | Court 3 | Sneha Iyer | ✅ Confirmed |\n\n**Total:** 48 bookings today | **Utilization:** 78%`,
      'court': `📅 **Today's Bookings**\n\n| Time | Court | Member | Status |\n|------|-------|--------|--------|\n| 6:00 AM | Court 1 | Arjun Kumar | ✅ Confirmed |\n| 7:00 AM | Court 2 | Priya Singh | ✅ Confirmed |\n| 8:00 AM | Court 1 | Rahul Verma | ⏳ Pending |\n| 9:00 AM | Court 3 | Sneha Iyer | ✅ Confirmed |\n\n**Total:** 48 bookings today | **Utilization:** 78%`,
      'slot': `⏰ **Busiest Slots Analysis**\n\n| Time Slot | Avg Bookings | Utilization |\n|-----------|-------------|-------------|\n| 6:00 - 8:00 AM | 12 | 95% |\n| 8:00 - 10:00 AM | 8 | 65% |\n| 4:00 - 6:00 PM | 10 | 80% |\n| 6:00 - 8:00 PM | 11 | 88% |\n\n**Peak:** Morning 6-8 AM | **Opportunity:** Afternoon 12-4 PM (25% utilization)`,
      'coach': `🏸 **Coach Performance**\n\n| Coach | Sport | Rating | Students |\n|-------|-------|--------|----------|\n| Rajesh Sharma | Badminton | ⭐ 4.8 | 32 |\n| Meera Nair | Swimming | ⭐ 4.9 | 28 |\n| Amit Patel | Tennis | ⭐ 4.6 | 24 |\n\nTop performer: **Meera Nair** with highest student satisfaction.`,
      'trainer': `🏸 **Coach Performance**\n\n| Coach | Sport | Rating | Students |\n|-------|-------|--------|----------|\n| Rajesh Sharma | Badminton | ⭐ 4.8 | 32 |\n| Meera Nair | Swimming | ⭐ 4.9 | 28 |\n| Amit Patel | Tennis | ⭐ 4.6 | 24 |\n\nTop performer: **Meera Nair** with highest student satisfaction.`,
      'coupon': `🎟️ **Coupon Created Successfully!**\n\n⚠️ *This action requires your approval*\n\n- **Code:** SUMMER2026\n- **Discount:** 20%\n- **Valid Until:** July 31, 2026\n- **Max Uses:** 100\n\nWould you like to approve this action?`,
      'discount': `🎟️ **Coupon Created Successfully!**\n\n⚠️ *This action requires your approval*\n\n- **Code:** SUMMER2026\n- **Discount:** 20%\n- **Valid Until:** July 31, 2026\n- **Max Uses:** 100\n\nWould you like to approve this action?`,
      'code': `🎟️ **Coupon Created Successfully!**\n\n⚠️ *This action requires your approval*\n\n- **Code:** SUMMER2026\n- **Discount:** 20%\n- **Valid Until:** July 31, 2026\n- **Max Uses:** 100\n\nWould you like to approve this action?`,
      'attendance': `📋 **Attendance Report**\n\n- **Today's Check-ins:** 120\n- **Peak Hour:** 6:00 - 8:00 AM (45 check-ins)\n- **Average Daily:** 105\n- **Trend:** ↗️ Up 5% this week\n\nMost popular day: **Saturday** with avg 145 check-ins.`,
      'visit': `📋 **Attendance Report**\n\n- **Today's Check-ins:** 120\n- **Peak Hour:** 6:00 - 8:00 AM (45 check-ins)\n- **Average Daily:** 105\n- **Trend:** ↗️ Up 5% this week\n\nMost popular day: **Saturday** with avg 145 check-ins.`,
      'check-in': `📋 **Attendance Report**\n\n- **Today's Check-ins:** 120\n- **Peak Hour:** 6:00 - 8:00 AM (45 check-ins)\n- **Average Daily:** 105\n- **Trend:** ↗️ Up 5% this week\n\nMost popular day: **Saturday** with avg 145 check-ins.`,
      'pass': `🎫 **Expiring Passes This Week**\n\n| Member | Plan | Expires | Amount |\n|--------|------|---------|--------|\n| Arjun Kumar | Gold Monthly | Jul 10 | ₹2,500 |\n| Priya Singh | Silver Monthly | Jul 11 | ₹1,800 |\n| Rahul Verma | Gold Monthly | Jul 12 | ₹2,500 |\n| Neha Gupta | Platinum | Jul 14 | ₹4,000 |\n\n**Action:** Send automated renewal reminders to these 12 members?`,
      'membership': `🎫 **Expiring Passes This Week**\n\n| Member | Plan | Expires | Amount |\n|--------|------|---------|--------|\n| Arjun Kumar | Gold Monthly | Jul 10 | ₹2,500 |\n| Priya Singh | Silver Monthly | Jul 11 | ₹1,800 |\n| Rahul Verma | Gold Monthly | Jul 12 | ₹2,500 |\n| Neha Gupta | Platinum | Jul 14 | ₹4,000 |\n\n**Action:** Send automated renewal reminders to these 12 members?`,
      'renew': `🎫 **Expiring Passes This Week**\n\n| Member | Plan | Expires | Amount |\n|--------|------|---------|--------|\n| Arjun Kumar | Gold Monthly | Jul 10 | ₹2,500 |\n| Priya Singh | Silver Monthly | Jul 11 | ₹1,800 |\n| Rahul Verma | Gold Monthly | Jul 12 | ₹2,500 |\n| Neha Gupta | Platinum | Jul 14 | ₹4,000 |\n\n**Action:** Send automated renewal reminders to these 12 members?`,
      'inactive': `⚠️ **Inactive Members (30+ days)**\n\n| Member | Last Visit | Plan | Status |\n|--------|-----------|------|--------|\n| Vikram Joshi | Jun 2 | Gold | At Risk |\n| Anita Desai | Jun 5 | Silver | At Risk |\n| Karan Mehta | May 28 | Basic | Churned |\n\n**Recommendation:** Send re-engagement offers with 15% discount.`,
      'churn': `⚠️ **Inactive Members (30+ days)**\n\n| Member | Last Visit | Plan | Status |\n|--------|-----------|------|--------|\n| Vikram Joshi | Jun 2 | Gold | At Risk |\n| Anita Desai | Jun 5 | Silver | At Risk |\n| Karan Mehta | May 28 | Basic | Churned |\n\n**Recommendation:** Send re-engagement offers with 15% discount.`,
      'peak': `⏰ **Busiest Slots Analysis**\n\n| Time Slot | Avg Bookings | Utilization |\n|-----------|-------------|-------------|\n| 6:00 - 8:00 AM | 12 | 95% |\n| 8:00 - 10:00 AM | 8 | 65% |\n| 4:00 - 6:00 PM | 10 | 80% |\n| 6:00 - 8:00 PM | 11 | 88% |\n\n**Peak:** Morning 6-8 AM | **Opportunity:** Afternoon 12-4 PM (25% utilization)`,
      'utilization': `⏰ **Busiest Slots Analysis**\n\n| Time Slot | Avg Bookings | Utilization |\n|-----------|-------------|-------------|\n| 6:00 - 8:00 AM | 12 | 95% |\n| 8:00 - 10:00 AM | 8 | 65% |\n| 4:00 - 6:00 PM | 10 | 80% |\n| 6:00 - 8:00 PM | 11 | 88% |\n\n**Peak:** Morning 6-8 AM | **Opportunity:** Afternoon 12-4 PM (25% utilization)`,
      'swipe': `🤝 **HobbySwipe Social Matches**\n\n| Match Group | Buddy A | Buddy B | Status |\n|-------------|---------|---------|--------|\n| Badminton Buddy | Rahul Verma | Vikram Joshi | ✅ Matched |\n| Tennis Buddy | Priya Singh | Neha Gupta | ✅ Matched |\n| Football Match | Arjun Kumar | Karan Mehta | ⏳ Pending |\n\nSwipe matching matches users with similar interests to play together!`,
      'match': `🤝 **HobbySwipe Social Matches**\n\n| Match Group | Buddy A | Buddy B | Status |\n|-------------|---------|---------|--------|\n| Badminton Buddy | Rahul Verma | Vikram Joshi | ✅ Matched |\n| Tennis Buddy | Priya Singh | Neha Gupta | ✅ Matched |\n| Football Match | Arjun Kumar | Karan Mehta | ⏳ Pending |\n\nSwipe matching matches users with similar interests to play together!`,
      'buddy': `🤝 **HobbySwipe Social Matches**\n\n| Match Group | Buddy A | Buddy B | Status |\n|-------------|---------|---------|--------|\n| Badminton Buddy | Rahul Verma | Vikram Joshi | ✅ Matched |\n| Tennis Buddy | Priya Singh | Neha Gupta | ✅ Matched |\n| Football Match | Arjun Kumar | Karan Mehta | ⏳ Pending |\n\nSwipe matching matches users with similar interests to play together!`,
      'group': `💬 **Community Groups & Active Planning**\n\n- **Smash Badminton Club:** 84 active members | 12 chats today\n- **Indiranagar Footballers:** 112 active members | 5 active matches scheduled\n- **Early Morning Yoga Circle:** 42 active members | Meets 06:00 AM daily\n\n*HobbyFi Community provides messaging, matchmaking, and event planning for members.*`,
      'event': `💬 **Community Groups & Active Planning**\n\n- **Smash Badminton Club:** 84 active members | 12 chats today\n- **Indiranagar Footballers:** 112 active members | 5 active matches scheduled\n- **Early Morning Yoga Circle:** 42 active members | Meets 06:00 AM daily\n\n*HobbyFi Community provides messaging, matchmaking, and event planning for members.*`,
      'community': `💬 **Community Groups & Active Planning**\n\n- **Smash Badminton Club:** 84 active members | 12 chats today\n- **Indiranagar Footballers:** 112 active members | 5 active matches scheduled\n- **Early Morning Yoga Circle:** 42 active members | Meets 06:00 AM daily\n\n*HobbyFi Community provides messaging, matchmaking, and event planning for members.*`,
      'audit': `📋 **HobbyFi System Audit Logs**\n\n| Date | Action | Resource | Details |\n|------|--------|----------|---------|\n| Today | UPDATE | Membership | renewed Priya Singh Pass |\n| Today | CREATE | Booking | Arjun Kumar booked Court 2 |\n| Yesterday | CREATE | Coupon | SUMMER2026 coupon created |\n\nAll operations are recorded in secure audit logging system.`,
      'log': `📋 **HobbyFi System Audit Logs**\n\n| Date | Action | Resource | Details |\n|------|--------|----------|---------|\n| Today | UPDATE | Membership | renewed Priya Singh Pass |\n| Today | CREATE | Booking | Arjun Kumar booked Court 2 |\n| Yesterday | CREATE | Coupon | SUMMER2026 coupon created |\n\nAll operations are recorded in secure audit logging system.`,
    };

    const msgLower = message.toLowerCase();
    
    // Advanced NLP Intent Parsing (Simulated RAG & LLM)
    const intents = [
      {
        pattern: /(revenue|sale|earn|income|profit|finance|money)/i,
        response: `📊 **Financial & Revenue Analysis (Smash Badminton Academy)**\n\n| Metric | Amount | Trend |\n|--------|--------|-------|\n| **Today** | ₹8,500 | ↗️ +15% vs avg |\n| **This Week** | ₹42,300 | ↗️ +8% vs last |\n| **This Month** | ₹1,24,500 | ↗️ +12% vs last |\n\n💡 **AI Insight:** Your badminton courts are generating 68% of total revenue. Tennis is underperforming this month.\n\n### Suggested Actions:\n- Launch a targeted email campaign for Tennis players.\n- Offer a 10% discount on off-peak Tennis bookings.`
      },
      {
        pattern: /(member|user|subscriber|customer|people)/i,
        response: `👥 **Vendor Directory & Member Insights**\n\n- **Total Active Members:** 245\n- **Expiring This Week:** 12 members\n- **New Signups This Month:** 34\n- **Churned/Inactive (30+ days):** 18\n\n⚠️ **Urgent:** 12 memberships expire in the next 7 days, representing ~₹25,000 in potential lost revenue.\n\nWould you like me to execute the **Automated Renewal Reminder** workflow?`
      },
      {
        pattern: /(book|schedule|court|slot|time|busy|peak)/i,
        response: `📅 **Court Utilization & Bookings Engine**\n\n- **Total Bookings Today:** 48\n- **Current Utilization:** 78%\n- **Peak Hour Prediction:** 6:00 PM - 8:00 PM (95% booked)\n- **Slowest Hour:** 12:00 PM - 4:00 PM (25% booked)\n\n### Upcoming (Next 2 Hours):\n1. Court 1: Arjun Kumar (Confirmed)\n2. Court 2: Priya Singh (Confirmed)\n3. Court 1: Rahul Verma (Pending Payment)\n\n💡 **AI Recommendation:** You have 3 empty courts between 1 PM and 3 PM. Should I create a Flash Sale push notification?`
      },
      {
        pattern: /(coach|train|instructor)/i,
        response: `🏸 **Coach Performance Metrics**\n\n| Coach | Speciality | Rating | Active Students | Retention |\n|-------|------------|--------|-----------------|-----------|\n| Rajesh S. | Badminton | ⭐ 4.8 | 32 | 94% |\n| Meera N. | Swimming | ⭐ 4.9 | 28 | 98% |\n| Amit P. | Tennis | ⭐ 4.6 | 24 | 82% |\n\n🏆 **Top Performer:** Meera Nair has the highest retention rate this quarter.`
      },
      {
        pattern: /(coupon|discount|promo|offer|campaign)/i,
        response: `🎟️ **Marketing Campaign Manager**\n\nI have drafted a new promotional campaign based on your current low-utilization periods.\n\n⚠️ *This action requires your approval*\n\n- **Code:** SUMMER_SMASH_2026\n- **Discount:** 20% OFF\n- **Valid:** 12 PM - 4 PM (Weekdays)\n- **Target Audience:** Inactive members (30+ days)\n\nWould you like me to deploy this coupon and notify the targeted segment?`
      },
      {
        pattern: /(attend|visit|check-in|qr)/i,
        response: `📋 **Access Control & Check-in Logs**\n\n- **Today's QR Check-ins:** 120\n- **Peak Entry Time:** 6:15 AM (32 entries in 15 mins)\n- **Invalid Scans:** 2 (Expired passes)\n\nSystem Health: 🟢 RFID & QR Scanners are online and syncing perfectly with the central HobbyFi DB.`
      },
      {
        pattern: /(pass|renew|membership plan)/i,
        response: `🎫 **Subscription & Pass Management**\n\n| Member Name | Current Plan | Expiry Date | Status |\n|-------------|--------------|-------------|--------|\n| Arjun Kumar | Gold Monthly | Jul 10 | ⚠️ Expiring |\n| Priya Singh | Silver Monthly | Jul 11 | ⚠️ Expiring |\n| Rahul Verma | Gold Monthly | Jul 12 | ⚠️ Expiring |\n| Neha Gupta | Platinum | Jul 14 | ⚠️ Expiring |\n\n**Action Item:** Would you like me to draft personalized WhatsApp reminders for these members?`
      },
      {
        pattern: /(swipe|match|buddy|social)/i,
        response: `🤝 **HobbySwipe Matchmaking Engine**\n\nThe algorithm has identified several potential buddy matches for your academy based on skill level (NTRP/BWF) and preferred timings:\n\n1. **Rahul V. & Vikram J.** (Badminton, Intermediate, Morning) - *92% Match*\n2. **Priya S. & Neha G.** (Tennis, Beginner, Evening) - *88% Match*\n\nShall I send them a "Buddy Match Suggestion" push notification to encourage them to book a court together?`
      },
      {
        pattern: /(group|community|club|chat)/i,
        response: `💬 **Community Moderation & Engagement**\n\n- **Smash Badminton Club:** 84 active members (Highly Active)\n- **Indiranagar Footballers:** 112 active members (Moderately Active)\n- **Morning Yoga Circle:** 42 active members (Highly Active)\n\n💡 **AI Insight:** The "Smash Badminton Club" chat has been discussing a weekend tournament. You could capitalize on this by officially hosting a HobbyFi Mini-Tournament this Sunday.`
      },
      {
        pattern: /(audit|log|security)/i,
        response: `📋 **System Audit Logs & Security**\n\n| Timestamp | Action Type | Resource | Triggered By |\n|-----------|-------------|----------|--------------|\n| 10:45 AM | UPDATE | Membership | System (Auto-renew) |\n| 11:30 AM | CREATE | Booking | Arjun Kumar (App) |\n| 02:15 PM | CREATE | Coupon | Vendor Admin |\n\nAll operations are verified and securely logged in the HobbyFi ledger.`
      },
      {
        pattern: /(hobbyfi|about|platform|help|support|what is|how to)/i,
        response: `🌐 **HobbyFi Knowledge Base**\n\nHobbyFi is the ultimate sports & fitness ecosystem connecting players, vendors, and coaches!\n\n**Key Features for Vendors:**\n1. **Smart Booking:** Automated slot management.\n2. **HobbySwipe:** Matchmaking players to fill empty slots.\n3. **Community Hub:** Integrated groups to build loyalty.\n4. **AI Copilot:** Your very own assistant to manage operations (that's me!).\n\nNeed technical support? Contact vendor-support@hobbyfi.com.`
      },
      {
        pattern: /(status|track|report)/i,
        response: `📈 **Customer & Venue Status Report**\n\n- **Live Occupancy:** 32 members currently inside.\n- **Venue Health:** All 6 courts are operational.\n- **Recent Feedback:** ⭐ 4.8 average rating this week.\n- **Pending Approvals:** 2 new membership requests require your attention.\n\nEverything is running smoothly! Keep up the great work.`
      }
    ];

    let responseText = `I understand your query: "${message}"\n\nAs your **Advanced AI Copilot**, I am directly connected to the HobbyFi database. I can help you with:\n\n- 📊 **Financials:** Revenue trends and predictions.\n- 👥 **CRM:** Member retention and churn risk.\n- 📅 **Operations:** Court utilization and smart scheduling.\n- 🎟️ **Marketing:** AI-generated coupons and campaigns.\n- 🤝 **HobbySwipe:** Buddy matchmaking and community engagement.\n\n*Just ask me anything about your academy!*`;

    for (const intent of intents) {
      if (intent.pattern.test(msgLower)) {
        responseText = intent.response;
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
