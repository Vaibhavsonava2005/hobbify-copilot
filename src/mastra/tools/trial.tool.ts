import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { db } from '../../db/index.js';
import { trials } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import { approvalEngine } from '../../lib/approval-engine.js';

export const getTrialUsersTool = createTool({
  id: 'get_trial_users',
  description: 'Get users currently on trial',
  inputSchema: z.object({
    vendorId: z.string().uuid(),
  }),
  execute: async (inputData) => {
    const data = await db.select().from(trials).where(eq(trials.vendorId, inputData.vendorId));
    return { success: true, data };
  }
});

export const extendTrialTool = createTool({
  id: 'extend_trial',
  description: 'Extend trial for a user (requires approval)',
  inputSchema: z.object({
    vendorId: z.string().uuid(),
    trialId: z.string().uuid(),
    days: z.number().int().positive(),
  }),
  execute: async (inputData) => {
    const payload = await approvalEngine.createRequest(
      inputData.vendorId,
      'EXTEND_TRIAL',
      { trialId: inputData.trialId, days: inputData.days },
      `Extend trial ${inputData.trialId} by ${inputData.days} days`
    );
    return { success: true, approvalPayload: payload };
  }
});
