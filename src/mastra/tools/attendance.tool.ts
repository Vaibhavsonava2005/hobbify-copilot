import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { db } from '../../db/index.js';
import { attendance } from '../../db/schema.js';
import { eq, and, gte, lte } from 'drizzle-orm';
import { approvalEngine } from '../../lib/approval-engine.js';

export const getAttendanceTool = createTool({
  id: 'get_attendance',
  description: 'Get attendance records for a specific date',
  inputSchema: z.object({
    vendorId: z.string().uuid(),
    date: z.string().describe('ISO date string'),
  }),
  execute: async (inputData) => {
    const targetDate = new Date(inputData.date);
    const nextDate = new Date(targetDate);
    nextDate.setDate(targetDate.getDate() + 1);

    const data = await db.select()
      .from(attendance)
      .where(
        and(
          eq(attendance.vendorId, inputData.vendorId),
          gte(attendance.date, targetDate),
          lte(attendance.date, nextDate)
        )
      );
    return { success: true, data };
  }
});

export const markAttendanceTool = createTool({
  id: 'mark_attendance',
  description: 'Mark user attendance (requires approval)',
  inputSchema: z.object({
    vendorId: z.string().uuid(),
    userId: z.string().uuid(),
    status: z.enum(['present', 'absent']),
  }),
  execute: async (inputData) => {
    const payload = await approvalEngine.createRequest(
      inputData.vendorId,
      'MARK_ATTENDANCE',
      { userId: inputData.userId, status: inputData.status },
      `Mark attendance ${inputData.status} for user ${inputData.userId}`
    );
    return { success: true, approvalPayload: payload };
  }
});
