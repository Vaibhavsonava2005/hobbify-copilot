import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js';

export const refundBooking = createTool({
  id: 'refundBooking',
  description: 'Performs refundBooking operation. Generates an approval request.',
  inputSchema: z.object({
    vendorId: z.string(),
    targetId: z.string().optional(),
    reason: z.string().optional(),
  }),
  execute: async (inputData) => {
    const actionId = crypto.randomUUID();
    const payload = { action: 'refundBooking', params: inputData };
    
    await db.insert(schema.approval_requests).values({
      id: actionId,
      vendorId: inputData.vendorId,
      action: 'refundBooking',
      payload: JSON.stringify(payload),
      summary: `Requested refundBooking`,
      status: 'pending'
    });
    
    return {
      status: 'requires_approval',
      approvalId: actionId,
      message: `I have prepared the refundBooking action. Please approve it in the UI.`
    };
  }
});
