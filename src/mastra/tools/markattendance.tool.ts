import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js';

export const markAttendance = createTool({
  id: 'markAttendance',
  description: 'Performs markAttendance operation. Generates an approval request.',
  inputSchema: z.object({
    vendorId: z.string(),
    targetId: z.string().optional(),
    reason: z.string().optional(),
  }),
  execute: async (inputData) => {
    const actionId = crypto.randomUUID();
    const payload = { action: 'markAttendance', params: inputData };
    
    await db.insert(schema.approval_requests).values({
      id: actionId,
      vendorId: inputData.vendorId,
      action: 'markAttendance',
      payload: JSON.stringify(payload),
      summary: `Requested markAttendance`,
      status: 'pending'
    });
    
    return {
      status: 'requires_approval',
      approvalId: actionId,
      message: `I have prepared the markAttendance action. Please approve it in the UI.`
    };
  }
});
