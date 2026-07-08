import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { db } from '../../db';
import { coaches } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { approvalEngine } from '../../lib/approval-engine';

export const getTopCoachesTool = createTool({
  id: 'get_top_coaches',
  description: 'Get top performing coaches',
  inputSchema: z.object({
    vendorId: z.string().uuid(),
  }),
  execute: async (inputData) => {
    const data = await db.select().from(coaches).where(eq(coaches.vendorId, inputData.vendorId));
    return { success: true, data };
  }
});

export const assignCoachTool = createTool({
  id: 'assign_coach',
  description: 'Assign coach to a session (requires approval)',
  inputSchema: z.object({
    vendorId: z.string().uuid(),
    coachId: z.string().uuid(),
    sessionId: z.string().uuid(),
  }),
  execute: async (inputData) => {
    const payload = await approvalEngine.createRequest(
      inputData.vendorId,
      'ASSIGN_COACH',
      { coachId: inputData.coachId, sessionId: inputData.sessionId },
      `Assign coach ${inputData.coachId} to session ${inputData.sessionId}`
    );
    return { success: true, approvalPayload: payload };
  }
});
