import pino from 'pino';
import { env } from '../config/env.js';

/**
 * Structured JSON logger using pino.
 * Production logs are JSON; development uses pretty-printing.
 */
export const logger = pino({
  name: 'hobbyfi-copilot',
  level: (process.env.LOG_LEVEL || 'info'),
  ...((process.env.NODE_ENV || 'development') === 'development'
    ? {
        transport: {
          target: 'pino/file',
          options: { destination: 1 },
        },
      }
    : {}),
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  serializers: {
    err: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },
});

/**
 * Create a child logger scoped to a specific module.
 */
export function createModuleLogger(module: string): pino.Logger {
  return logger.child({ module });
}
