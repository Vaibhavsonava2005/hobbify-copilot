import { Context, Next } from 'hono';
import { redis } from '../../lib/redis';

export const rateLimitMiddleware = async (c: Context, next: Next) => {
  const ip = c.req.header('x-forwarded-for') || '127.0.0.1';
  const key = `ratelimit:${ip}`;
  
  try {
    const current = await redis.incr(key);
    
    if (current === 1) {
      await redis.expire(key, 60); // 1 minute window
    }

    if (current > 50) { // 50 requests per minute
      return c.json({ error: 'Too many requests' }, 429);
    }
  } catch (err) {
    console.error('Rate limiting error:', err);
  }

  await next();
};
