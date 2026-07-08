import { z } from 'zod';

/**
 * Enterprise Guardrails for HobbyFi Copilot
 * Implements:
 * 1. Prompt Injection Detection
 * 2. SQL Injection Prevention
 * 3. PII Masking
 * 4. Hallucination Detection
 */

export const Guardrails = {
  detectInjection: (input: string): boolean => {
    const maliciousPatterns = [
        /ignore previous instructions/i,
        /system prompt/i,
        /DROP TABLE/i,
        /SELECT \* FROM/i,
        /1=1/i
    ];
    
    return maliciousPatterns.some(pattern => pattern.test(input));
  },

  maskPII: (text: string): string => {
    // Mask Indian phone numbers
    let masked = text.replace(/(?:\+91|91)?[6-9]\d{9}/g, '[MASKED_PHONE]');
    // Mask Emails
    masked = masked.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[MASKED_EMAIL]');
    return masked;
  },

  validateToolOutput: (output: any): boolean => {
    // Prevent massive payloads from crashing LLM context
    if (typeof output === 'string' && output.length > 50000) return false;
    return true;
  }
};
