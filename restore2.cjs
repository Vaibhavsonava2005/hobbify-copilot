const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logPath = 'C:\\Users\\vaibh\\.gemini\\antigravity\\brain\\47703d4d-a1a1-4058-93df-38ac0194a0ac\\.system_generated\\logs\\transcript.jsonl';

async function processLog() {
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({ input: fileStream });

  for await (const line of rl) {
    if (line.includes('write_to_file')) {
      try {
        const obj = JSON.parse(line);
        const calls = obj.tool_calls || [];
        for (const call of calls) {
          if (call.name === 'write_to_file' && call.arguments && call.arguments.TargetFile) {
            const file = call.arguments.TargetFile;
            if (file.includes('src\\\\mastra\\\\tools') || file.includes('src/mastra/tools')) {
               let newContent = call.arguments.CodeContent;
               
               newContent = newContent.replace(/execute:\s*async\s*\(\{\s*context\s*\}\s*:\s*\{\s*context\?\:\s*any\s*\}\)\s*=>\s*\{/g, 'execute: async (inputData) => {');
               newContent = newContent.replace(/execute:\s*async\s*\(\{\s*context\s*\}\)\s*=>\s*\{/g, 'execute: async (inputData) => {');
               
               const props = ['vendorId', 'targetId', 'reason', 'limit', 'bookingId', 'userId', 'status', 'date', 'coachId', 'sessionId', 'code', 'discount', 'expiresInDays', 'amount', 'membershipId', 'newStatus', 'days', 'message', 'startDate', 'endDate', 'period1Start', 'period1End', 'period2Start', 'period2End', 'trialId'];
               for (const prop of props) {
                 newContent = newContent.replace(new RegExp(`context\\.${prop}`, 'g'), `inputData.${prop}`);
               }
               
               const parts = file.replace(/\\\\/g, '\\').split('hobbyfi-copilot');
               if (parts.length > 1) {
                   const resolvedPath = parts[1].replace(/^\\/, '');
                   fs.writeFileSync(path.join('c:\\Users\\vaibh\\OneDrive\\Desktop\\hobbyfi-copilot', resolvedPath), newContent);
               }
            }
          }
        }
      } catch (e) {}
    }
  }
}
processLog();
