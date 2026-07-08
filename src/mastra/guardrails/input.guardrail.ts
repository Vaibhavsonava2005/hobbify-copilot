export const inputGuardrail = (input: string) => {
  // Simple check for prompt injection keywords
  const suspiciousKeywords = ['ignore previous', 'system prompt', 'bypass', 'drop table'];
  const lowerInput = input.toLowerCase();

  for (const word of suspiciousKeywords) {
    if (lowerInput.includes(word)) {
      throw new Error(`Input blocked: Potential malicious intent detected (${word})`);
    }
  }

  if (input.length > 1000) {
    throw new Error('Input blocked: Exceeds maximum length of 1000 characters');
  }

  return input;
};
