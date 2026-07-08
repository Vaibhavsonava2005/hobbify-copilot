import { ollama } from 'ollama-ai-provider';
import { Agent } from '@mastra/core/agent';
import * as tools from '../tools/index.js';

export const analyticsAgent = new Agent({
  name: 'AnalyticsAgent',
  id: 'analyticsAgent',
  instructions: `You are the Analytics Agent. You specialize in reading data from the HobbyFi database and presenting it clearly. Use INR (₹) for currency.`,
  model: ollama('llama3'),
  tools: {
    getRevenue: tools.getRevenue,
    getBookings: tools.getBookings,
    getAttendance: tools.getAttendance,
    getVenueStats: tools.getVenueStats,
    getCoachPerformance: tools.getCoachPerformance,
    getTopSports: tools.getTopSports,
    getMembershipAnalytics: tools.getMembershipAnalytics,
    getTrialUsers: tools.getTrialUsers,
    getInactiveUsers: tools.getInactiveUsers,
    getPaymentSummary: tools.getPaymentSummary,
    getUpcomingRenewals: tools.getUpcomingRenewals,
  }
});
