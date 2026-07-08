import { db } from '../db';
import { approval_requests } from '../db/schema';
import { ApprovalPayload } from '../types';

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
