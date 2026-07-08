const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'src/mastra/tools');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace execute signature
  content = content.replace(/execute:\s*async\s*\(\{\s*context\s*\}\s*:\s*\{\s*context\?\:\s*any\s*\}\)\s*=>\s*\{/g, 'execute: async (data) => {');
  
  // Replace `context.` with `data.` inside the execute function body
  // Since `context.` was exclusively used by me to reference inputs
  content = content.replace(/context\./g, 'data.');
  
  fs.writeFileSync(filePath, content);
}
