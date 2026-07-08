import { ollama } from 'ollama-ai-provider';
import { Agent } from '@mastra/core/agent';

export const supervisorAgent = new Agent({
  name: 'SupervisorAgent',
  id: 'supervisorAgent',
  instructions: `You are the Master Supervisor Agent for HobbyFi Copilot.
Your job is to receive the user's intent and decide which specialized agent to route to.
Route to AnalyticsAgent for reading data (e.g., revenue, bookings).
Route to ActionAgent for mutations (e.g., cancel booking, extend trial).`,
  model: ollama('llama3'),
});
