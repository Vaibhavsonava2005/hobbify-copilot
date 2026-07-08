import { ollama } from 'ollama-ai-provider';
import { Agent } from '@mastra/core/agent';

export const plannerAgent = new Agent({
  name: 'PlannerAgent',
  id: 'plannerAgent',
  instructions: `You are the Planner Agent. You break down complex multi-step user queries into sequential tool calls.`,
  model: ollama('llama3'),
});
