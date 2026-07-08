const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'src/mastra/tools');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/execute: async \(data\) => \{/g, 'execute: async (inputData) => {');
  
  const properties = [
    'vendorId', 'targetId', 'reason', 'limit', 'bookingId', 'userId', 'status', 'date',
    'coachId', 'sessionId', 'code', 'discount', 'expiresInDays', 'amount', 'membershipId',
    'newStatus', 'days', 'message', 'startDate', 'endDate', 'period1Start', 'period1End',
    'period2Start', 'period2End', 'trialId'
  ];
  
  for (const prop of properties) {
    const regex = new RegExp(`data\\.${prop}`, 'g');
    content = content.replace(regex, `inputData.${prop}`);
  }
  
  fs.writeFileSync(filePath, content);
}
