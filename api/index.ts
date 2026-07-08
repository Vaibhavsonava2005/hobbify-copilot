import { handle } from 'hono/vercel';
import { Hono } from 'hono';
import { chatRouter } from '../src/api/routes/chat.route.js';
import { approvalRouter } from '../src/api/routes/approval.route.js';
import { auditRouter } from '../src/api/routes/audit.route.js';
import { authMiddleware } from '../src/api/middleware/auth.middleware.js';
import { rateLimitMiddleware } from '../src/api/middleware/rateLimit.middleware.js';

const app = new Hono().basePath('/api');

// Global Middlewares
app.use('*', rateLimitMiddleware);
app.use('/*', authMiddleware);

app.route('/copilot', chatRouter);
app.route('/copilot', approvalRouter);
app.route('/copilot', auditRouter);

export default handle(app);
