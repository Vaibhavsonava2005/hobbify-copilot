import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { db } from '../../db/index.js';
import { users } from '../../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { approvalEngine } from '../../lib/approval-engine.js';

export const getUsersTool = createTool({
  id: 'get_users',
  description: 'Get all users for a vendor',
  inputSchema: z.object({
    vendorId: z.string().uuid(),
  }),
  execute: async (inputData) => {
    const vendorUsers = await db.select().from(users).where(eq(users.vendorId, inputData.vendorId));
    return { success: true, data: vendorUsers };
  }
});

export const blockUserTool = createTool({
  id: 'block_user',
  description: 'Block a user (requires approval)',
  inputSchema: z.object({
    vendorId: z.string().uuid(),
    userId: z.string().uuid(),
    reason: z.string(),
  }),
  execute: async (inputData) => {
    const payload = await approvalEngine.createRequest(
      inputData.vendorId,
      'BLOCK_USER',
      { userId: inputData.userId, reason: inputData.reason },
      `Block user ${inputData.userId} for reason: ${inputData.reason}`
    );
    return { success: true, approvalPayload: payload };
  }
});
