import { Hono } from 'hono';
import { db } from '../../db/index.js';
import { approval_requests } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import { auditLogger } from '../../lib/audit-logger.js';

const approvalRouter = new Hono();

approvalRouter.post('/approve/:requestId', async (c) => {
  const requestId = c.req.param('requestId');

  const [request] = await db.select().from(approval_requests).where(eq(approval_requests.id, requestId));
  
  if (!request) return c.json({ error: 'Request not found' }, 404);
  if (request.status !== 'pending') return c.json({ error: 'Request already processed' }, 400);

  // Update status to approved
  await db.update(approval_requests).set({ status: 'approved' }).where(eq(approval_requests.id, requestId));

  // Log action
  await auditLogger.log(request.vendorId, `APPROVED_ACTION: ${request.action}`, 'approval_requests', requestId, request.payload);

  return c.json({ success: true, message: 'Action approved successfully' });
});

approvalRouter.post('/reject/:requestId', async (c) => {
  const requestId = c.req.param('requestId');

  const [request] = await db.select().from(approval_requests).where(eq(approval_requests.id, requestId));
  
  if (!request) return c.json({ error: 'Request not found' }, 404);
  if (request.status !== 'pending') return c.json({ error: 'Request already processed' }, 400);

  await db.update(approval_requests).set({ status: 'rejected' }).where(eq(approval_requests.id, requestId));
  await auditLogger.log(request.vendorId, `REJECTED_ACTION: ${request.action}`, 'approval_requests', requestId);

  return c.json({ success: true, message: 'Action rejected successfully' });
});

approvalRouter.get('/approvals/:vendorId', async (c) => {
  const vendorId = c.req.param('vendorId');
  const requests = await db.select().from(approval_requests).where(eq(approval_requests.vendorId, vendorId));
  return c.json({ success: true, data: requests });
});

export { approvalRouter };
