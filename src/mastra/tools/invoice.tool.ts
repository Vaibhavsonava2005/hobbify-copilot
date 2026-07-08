import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { approvalEngine } from '../../lib/approval-engine';

export const generateInvoiceTool = createTool({
  id: 'generate_invoice',
  description: 'Generate an invoice for a user (requires approval)',
  inputSchema: z.object({
    vendorId: z.string().uuid(),
    userId: z.string().uuid(),
    amount: z.number().positive(),
  }),
  execute: async (inputData) => {
    const payload = await approvalEngine.createRequest(
      inputData.vendorId,
      'GENERATE_INVOICE',
      { userId: inputData.userId, amount: inputData.amount },
      `Generate invoice for user ${inputData.userId} of amount ${inputData.amount}`
    );
    return { success: true, approvalPayload: payload };
  }
});
