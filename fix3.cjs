const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'src/mastra/tools');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace the entire signature line
  content = content.replace(/execute:\s*async\s*\(.*?=>\s*\{/, 'execute: async (inputData) => {');
  
  fs.writeFileSync(filePath, content);
}
