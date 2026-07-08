import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { db } from '../../db';
import * as schema from '../../db/schema';

export const assignCoach = createTool({
  id: 'assignCoach',
  description: 'Performs assignCoach operation. Generates an approval request.',
  inputSchema: z.object({
    vendorId: z.string(),
    targetId: z.string().optional(),
    reason: z.string().optional(),
  }),
  execute: async (inputData) => {
    const actionId = crypto.randomUUID();
    const payload = { action: 'assignCoach', params: inputData };
    
    await db.insert(schema.approval_requests).values({
      id: actionId,
      vendorId: inputData.vendorId,
      action: 'assignCoach',
      payload: JSON.stringify(payload),
      summary: `Requested assignCoach`,
      status: 'pending'
    });
    
    return {
      status: 'requires_approval',
      approvalId: actionId,
      message: `I have prepared the assignCoach action. Please approve it in the UI.`
    };
  }
});
