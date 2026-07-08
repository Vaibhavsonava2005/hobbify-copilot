import { Hono } from 'hono';
import { db } from '../../db';
import { audit_logs } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';

const auditRouter = new Hono();

auditRouter.get('/logs/:vendorId', async (c) => {
  const vendorId = c.req.param('vendorId');
  const logs = await db.select()
    .from(audit_logs)
    .where(eq(audit_logs.vendorId, vendorId))
    .orderBy(desc(audit_logs.createdAt))
    .limit(50);

  return c.json({ success: true, data: logs });
});

export { auditRouter };
