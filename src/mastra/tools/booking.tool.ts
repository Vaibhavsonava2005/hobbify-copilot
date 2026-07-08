import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { db } from '../../db/index.js';
import { bookings } from '../../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { approvalEngine } from '../../lib/approval-engine.js';

export const listBookingsTool = createTool({
  id: 'list_bookings',
  description: 'List bookings for a vendor',
  inputSchema: z.object({
    vendorId: z.string().uuid(),
    limit: z.number().int().positive().default(10),
  }),
  execute: async (inputData) => {
    const data = await db.select().from(bookings).where(eq(bookings.vendorId, inputData.vendorId)).limit(inputData.limit);
    return { success: true, data };
  }
});

export const cancelBookingTool = createTool({
  id: 'cancel_booking',
  description: 'Cancel a booking (requires approval)',
  inputSchema: z.object({
    vendorId: z.string().uuid(),
    bookingId: z.string().uuid(),
  }),
  execute: async (inputData) => {
    const payload = await approvalEngine.createRequest(
      inputData.vendorId,
      'CANCEL_BOOKING',
      { bookingId: inputData.bookingId },
      `Cancel booking ${inputData.bookingId}`
    );
    return { success: true, approvalPayload: payload };
  }
});

export const refundBookingTool = createTool({
  id: 'refund_booking',
  description: 'Refund a cancelled booking (requires approval)',
  inputSchema: z.object({
    vendorId: z.string().uuid(),
    bookingId: z.string().uuid(),
  }),
  execute: async (inputData) => {
    const payload = await approvalEngine.createRequest(
      inputData.vendorId,
      'REFUND_BOOKING',
      { bookingId: inputData.bookingId },
      `Refund booking ${inputData.bookingId}`
    );
    return { success: true, approvalPayload: payload };
  }
});

export const getBusiestSlotsTool = createTool({
  id: 'get_busiest_slots',
  description: 'Get busiest booking slots',
  inputSchema: z.object({
    vendorId: z.string().uuid(),
  }),
  execute: async (inputData) => {
    // Simplified stub
    return { success: true, data: { busiestTime: '18:00 - 20:00', totalBookings: 150 } };
  }
});
