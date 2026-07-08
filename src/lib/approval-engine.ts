import { db } from '../db/index.js';
import { approval_requests } from '../db/schema.js';
import { ApprovalPayload } from '../types/index.js';

export const approvalEngine = {
  createRequest: async (vendorId: string, action: string, payload: any, summary: string): Promise<ApprovalPayload> => {
    const [request] = await db.insert(approval_requests).values({
      vendorId,
      action,
      payload,
      summary,
      status: 'pending',
    }).returning();

    return {
      approvalRequired: true,
      action,
      payload: { requestId: request.id, ...payload },
      summary,
    };
  }
};
