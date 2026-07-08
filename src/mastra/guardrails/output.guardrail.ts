export const outputGuardrail = (output: string) => {
  // Ensure no raw SSNs or Credit Card numbers leak (basic pattern matching)
  const ccRegex = /\b(?:\d[ -]*?){13,16}\b/g;
  
  if (ccRegex.test(output)) {
    return output.replace(ccRegex, '[REDACTED_SENSITIVE_DATA]');
  }
  
  return output;
};
