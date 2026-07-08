import { ollama } from 'ollama-ai-provider';
import { Agent } from '@mastra/core/agent';
import * as tools from '../tools';

export const actionAgent = new Agent({
  name: 'ActionAgent',
  id: 'actionAgent',
  instructions: `You are the Action Agent. You perform write operations. ALL write operations return an ApprovalPayload. You must NEVER promise an action is complete; always state that an approval request has been generated for the vendor to review.`,
  model: ollama('llama3'),
  tools: {
    extendTrial: tools.extendTrial,
    updateMembership: tools.updateMembership,
    cancelBooking: tools.cancelBooking,
    createCoupon: tools.createCoupon,
    sendReminder: tools.sendReminder,
    assignCoach: tools.assignCoach,
    markAttendance: tools.markAttendance,
    generateInvoice: tools.generateInvoice,
    blockUser: tools.blockUser,
    refundBooking: tools.refundBooking,
  }
});
