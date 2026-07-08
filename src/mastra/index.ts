import { Mastra } from '@mastra/core/mastra';
import { supervisorAgent } from './agents/supervisor.agent';
import { analyticsAgent } from './agents/analytics.agent';
import { actionAgent } from './agents/action.agent';
import { plannerAgent } from './agents/planner.agent';

export const mastra = new Mastra({
  agents: { supervisorAgent, analyticsAgent, actionAgent, plannerAgent },
});
