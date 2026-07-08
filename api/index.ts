import { handle } from 'hono/vercel';
import { Hono } from 'hono';
import { chatRouter } from '../src/api/routes/chat.route';
import { approvalRouter } from '../src/api/routes/approval.route';
import { auditRouter } from '../src/api/routes/audit.route';
import { authMiddleware } from '../src/api/middleware/auth.middleware';
import { rateLimitMiddleware } from '../src/api/middleware/rateLimit.middleware';

const app = new Hono().basePath('/api');

// Global Middlewares
app.use('*', rateLimitMiddleware);
app.use('/*', authMiddleware);

app.route('/copilot', chatRouter);
app.route('/copilot', approvalRouter);
app.route('/copilot', auditRouter);

export default handle(app);
