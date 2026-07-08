const fs = require('fs');
const path = require('path');

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src').concat(walk('./api'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  
  // Replace ../../db.js with ../../db/index.js
  content = content.replace(/['"](\.\.\/\.\.\/db)\.js['"]/g, "'$1/index.js'");
  // Replace ../db.js with ../db/index.js
  content = content.replace(/['"](\.\.\/db)\.js['"]/g, "'$1/index.js'");
  
  // Replace ../../mastra.js with ../../mastra/index.js
  content = content.replace(/['"](\.\.\/\.\.\/mastra)\.js['"]/g, "'$1/index.js'");
  // Replace ../mastra.js with ../mastra/index.js
  content = content.replace(/['"](\.\.\/mastra)\.js['"]/g, "'$1/index.js'");
  
  // Replace ../tools.js with ../tools/index.js
  content = content.replace(/['"](\.\.\/tools)\.js['"]/g, "'$1/index.js'");
  
  // Replace ../types.js with ../types/index.js
  content = content.replace(/['"](\.\.\/types)\.js['"]/g, "'$1/index.js'");
  content = content.replace(/['"](\.\.\/\.\.\/types)\.js['"]/g, "'$1/index.js'");
  
  fs.writeFileSync(file, content, 'utf-8');
});

console.log('Fixed index imports!');
