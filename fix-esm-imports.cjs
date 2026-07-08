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
let count = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  const original = content;
  
  // Match relative imports that don't end in .js
  content = content.replace(/(import|export)([\s\S]*?)from\s+['"](\.[^'"]+?)['"]/g, (match, p1, p2, p3) => {
    if (p3.endsWith('.js') || p3.endsWith('.ts') || p3.endsWith('.json')) {
      return match;
    }
    return `${p1}${p2}from '${p3}.js'`;
  });
  
  // also dynamic imports: import('./...')
  content = content.replace(/import\(['"](\.[^'"]+?)['"]\)/g, (match, p1) => {
    if (p1.endsWith('.js') || p1.endsWith('.ts') || p1.endsWith('.json')) {
      return match;
    }
    return `import('${p1}.js')`;
  });

  if (original !== content) {
    fs.writeFileSync(file, content, 'utf-8');
    count++;
  }
});

console.log(`Fixed imports in ${count} files!`);
