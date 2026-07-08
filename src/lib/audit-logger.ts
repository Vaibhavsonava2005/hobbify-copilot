import { db } from '../db/index.js';
import { audit_logs } from '../db/schema.js';

export const auditLogger = {
  log: async (vendorId: string, action: string, resourceType: string, resourceId: string, details?: any) => {
    try {
      await db.insert(audit_logs).values({
        vendorId,
        action,
        resourceType,
        resourceId,
        details,
      });
      console.log(`[Audit] ${action} on ${resourceType} ${resourceId}`);
    } catch (err) {
      console.error('Failed to write audit log:', err);
    }
  },
};
