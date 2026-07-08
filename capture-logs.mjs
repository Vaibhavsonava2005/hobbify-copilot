import { spawn } from 'child_process';

async function run() {
  const logsProcess = spawn('npx.cmd', ['vercel', 'logs', 'hobbyfi-copilot-alpha.vercel.app', '--output', 'raw'], {
    shell: true,
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  let output = '';
  logsProcess.stdout.on('data', (data) => { output += data.toString(); console.log(data.toString()); });
  logsProcess.stderr.on('data', (data) => { output += data.toString(); console.log(data.toString()); });
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Hit the endpoint to trigger logs
  console.log("\\n--- Hitting endpoint ---");
  try {
    const res = await fetch('https://hobbyfi-copilot-alpha.vercel.app/api/health');
    console.log(`Status: ${res.status}`);
    const text = await res.text();
    console.log(`Body: ${text.substring(0, 500)}`);
  } catch (err) {
    console.error("Fetch error:", err.message);
  }
  
  await new Promise(resolve => setTimeout(resolve, 10000));
  logsProcess.kill();
  console.log("\\n--- Done ---");
}

run();
