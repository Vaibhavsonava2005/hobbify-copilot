import { Hono } from 'hono';
import { mastra } from '../../mastra/index.js';
import { db } from '../../db/index.js';
import { ai_conversations } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const chatRouter = new Hono();

chatRouter.post('/chat', async (c) => {
  const body = await c.req.json();
  const { vendorId, message, conversationId } = body;

  if (!vendorId || !message) {
    return c.json({ error: 'vendorId and message are required' }, 400);
  }

  try {
    // If running on Vercel for the demo and Ollama is unreachable, return a mock success
    if (process.env.VERCEL) {
      return c.json({
        success: true,
        data: {
          text: "I am HobbyFi Copilot. This is a Vercel demo environment. Ollama is not available here, but I have prepared your request.",
          conversationId: conversationId || 'new-thread',
        }
      });
    }

    const supervisor = mastra.getAgent('supervisorAgent');
    
    // In a real app we might validate or inject guardrails here
    const response = await supervisor.generate(message);

    return c.json({
      success: true,
      data: {
        text: response.text,
        conversationId: conversationId || 'new-thread',
      }
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    return c.json({ error: error.message }, 500);
  }
});

chatRouter.get('/conversations/:vendorId', async (c) => {
  const vendorId = c.req.param('vendorId');
  const conversations = await db.select().from(ai_conversations).where(eq(ai_conversations.vendorId, vendorId));
  return c.json({ success: true, data: conversations });
});

chatRouter.get('/conversations/:vendorId/:conversationId', async (c) => {
  const { vendorId, conversationId } = c.req.param();
  const conversation = await db.select().from(ai_conversations).where(
    eq(ai_conversations.id, conversationId)
  ).limit(1);

  if (!conversation.length) {
    return c.json({ error: 'Not found' }, 404);
  }

  // Assuming we'd get messages from memory here
  return c.json({ success: true, data: conversation[0] });
});

export { chatRouter };
