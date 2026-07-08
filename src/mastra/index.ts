import { Mastra } from '@mastra/core/mastra';
import { supervisorAgent } from './agents/supervisor.agent.js';
import { analyticsAgent } from './agents/analytics.agent.js';
import { actionAgent } from './agents/action.agent.js';
import { plannerAgent } from './agents/planner.agent.js';

export const mastra = new Mastra({
  agents: { supervisorAgent, analyticsAgent, actionAgent, plannerAgent },
});
