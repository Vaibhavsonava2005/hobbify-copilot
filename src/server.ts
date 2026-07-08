import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { chatRouter } from './api/routes/chat.route';
import { approvalRouter } from './api/routes/approval.route';
import { auditRouter } from './api/routes/audit.route';
import { authMiddleware } from './api/middleware/auth.middleware';
import { rateLimitMiddleware } from './api/middleware/rateLimit.middleware';
import { env } from './config/env';

const app = new Hono();

// Global Middlewares
app.use('*', rateLimitMiddleware);
app.use('/api/*', authMiddleware);

// Static files (Frontend UI)
app.use('/*', serveStatic({ root: './public' }));

// Routes
app.route('/api/copilot', chatRouter);
app.route('/api/copilot', approvalRouter);
app.route('/api/copilot', auditRouter);

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const port = parseInt(env.PORT, 10);

console.log(`Starting HobbyFi Copilot server on port ${port}...`);

serve({
  fetch: app.fetch,
  port
});
