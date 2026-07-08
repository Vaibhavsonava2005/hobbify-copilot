const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logPath = 'C:\\Users\\vaibh\\.gemini\\antigravity\\brain\\47703d4d-a1a1-4058-93df-38ac0194a0ac\\.system_generated\\logs\\transcript.jsonl';

async function processLog() {
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (line.includes('write_to_file')) {
      const obj = JSON.parse(line);
      const calls = obj.tool_calls || [];
      for (const call of calls) {
        if (call.name === 'write_to_file') {
          const file = call.arguments.TargetFile;
          if (file && file.includes('src\\\\mastra\\\\tools') || (file && file.includes('src/mastra/tools'))) {
             const content = call.arguments.CodeContent;
             // Fix the tool signature!
             let newContent = content.replace(/execute:\s*async\s*\(\{\s*context\s*\}\s*(:\s*\{\s*context\?\:\s*any\s*\})?\)\s*=>\s*\{/g, 'execute: async (inputData) => {');
             newContent = newContent.replace(/context\./g, 'inputData.');
             
             fs.writeFileSync(file.replace(/\\\\/g, '\\'), newContent);
             console.log("Restored " + file);
          }
        }
      }
    }
  }
}

processLog();
