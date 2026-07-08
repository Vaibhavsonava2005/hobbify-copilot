import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { approvalEngine } from '../../lib/approval-engine';

export const createCouponTool = createTool({
  id: 'create_coupon',
  description: 'Create a new discount coupon (requires approval)',
  inputSchema: z.object({
    vendorId: z.string().uuid(),
    code: z.string().min(3),
    discount: z.number().positive().max(100),
    expiresInDays: z.number().int().positive(),
  }),
  execute: async (inputData) => {
    const payload = await approvalEngine.createRequest(
      inputData.vendorId,
      'CREATE_COUPON',
      { code: inputData.code, discount: inputData.discount, expiresInDays: inputData.expiresInDays },
      `Create coupon ${inputData.code} with ${inputData.discount}% discount`
    );
    return { success: true, approvalPayload: payload };
  }
});
