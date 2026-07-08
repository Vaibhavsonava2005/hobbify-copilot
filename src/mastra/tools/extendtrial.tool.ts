import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { db } from '../../db';
import * as schema from '../../db/schema';

export const extendTrial = createTool({
  id: 'extendTrial',
  description: 'Performs extendTrial operation. Generates an approval request.',
  inputSchema: z.object({
    vendorId: z.string(),
    targetId: z.string().optional(),
    reason: z.string().optional(),
  }),
  execute: async (inputData) => {
    const actionId = crypto.randomUUID();
    const payload = { action: 'extendTrial', params: inputData };
    
    await db.insert(schema.approval_requests).values({
      id: actionId,
      vendorId: inputData.vendorId,
      action: 'extendTrial',
      payload: JSON.stringify(payload),
      summary: `Requested extendTrial`,
      status: 'pending'
    });
    
    return {
      status: 'requires_approval',
      approvalId: actionId,
      message: `I have prepared the extendTrial action. Please approve it in the UI.`
    };
  }
});
