import { spawn } from 'child_process';


async function run() {
  console.log("Starting vercel logs...");
  const logsProcess = spawn('npx.cmd', ['vercel', 'logs', 'hobbyfi-copilot-alpha.vercel.app'], {
    shell: true
  });
  
  logsProcess.stdout.on('data', (data) => {
    console.log(`[VERCEL LOG]: ${data.toString()}`);
  });
  
  logsProcess.stderr.on('data', (data) => {
    console.error(`[VERCEL ERR]: ${data.toString()}`);
  });
  
  console.log("Waiting 5 seconds for stream to connect...");
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  console.log("Hitting the endpoint...");
  try {
    const res = await fetch('https://hobbyfi-copilot-alpha.vercel.app/api/copilot/chat', { method: 'POST' });
    console.log(`Endpoint returned status: ${res.status}`);
  } catch (err) {
    console.error("Endpoint hit failed:", err);
  }
  
  console.log("Waiting 5 seconds to capture incoming logs...");
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  logsProcess.kill();
  console.log("Done.");
}

run();
