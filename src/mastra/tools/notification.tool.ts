import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { approvalEngine } from '../../lib/approval-engine.js';

export const sendReminderTool = createTool({
  id: 'send_reminder',
  description: 'Send a notification reminder to a user (requires approval)',
  inputSchema: z.object({
    vendorId: z.string().uuid(),
    userId: z.string().uuid(),
    message: z.string().min(5),
  }),
  execute: async (inputData) => {
    const payload = await approvalEngine.createRequest(
      inputData.vendorId,
      'SEND_REMINDER',
      { userId: inputData.userId, message: inputData.message },
      `Send reminder to user ${inputData.userId}: ${inputData.message}`
    );
    return { success: true, approvalPayload: payload };
  }
});
