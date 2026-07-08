const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'src/mastra/tools');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace dangling context usages
  content = content.replace(/\bcontext\b/g, 'inputData');
  
  fs.writeFileSync(filePath, content);
}
