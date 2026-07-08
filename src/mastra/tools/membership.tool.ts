import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { db } from '../../db/index.js';
import { memberships } from '../../db/schema.js';
import { eq, and, lte, gte } from 'drizzle-orm';
import { approvalEngine } from '../../lib/approval-engine.js';

export const updateMembershipTool = createTool({
  id: 'update_membership',
  description: 'Update a user membership (requires approval)',
  inputSchema: z.object({
    vendorId: z.string().uuid(),
    membershipId: z.string().uuid(),
    newStatus: z.enum(['active', 'expired', 'cancelled']),
  }),
  execute: async (inputData) => {
    const payload = await approvalEngine.createRequest(
      inputData.vendorId,
      'UPDATE_MEMBERSHIP',
      { membershipId: inputData.membershipId, status: inputData.newStatus },
      `Update membership ${inputData.membershipId} to ${inputData.newStatus}`
    );
    return { success: true, approvalPayload: payload };
  }
});

export const getExpiringMembershipsTool = createTool({
  id: 'get_expiring_memberships',
  description: 'Get memberships expiring within a date range',
  inputSchema: z.object({
    vendorId: z.string().uuid(),
    days: z.number().int().positive().default(7),
  }),
  execute: async (inputData) => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + inputData.days);

    const data = await db.select()
      .from(memberships)
      .where(
        and(
          eq(memberships.vendorId, inputData.vendorId),
          eq(memberships.status, 'active'),
          gte(memberships.endDate, today),
          lte(memberships.endDate, futureDate)
        )
      );

    return { success: true, data };
  }
});

export const cancelMembershipTool = createTool({
  id: 'cancel_membership',
  description: 'Cancel a user membership (requires approval)',
  inputSchema: z.object({
    vendorId: z.string().uuid(),
    membershipId: z.string().uuid(),
  }),
  execute: async (inputData) => {
    const payload = await approvalEngine.createRequest(
      inputData.vendorId,
      'CANCEL_MEMBERSHIP',
      { membershipId: inputData.membershipId },
      `Cancel membership ${inputData.membershipId}`
    );
    return { success: true, approvalPayload: payload };
  }
});
