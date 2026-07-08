async function run() {
  console.log("Hitting health endpoint...");
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch('https://hobbyfi-copilot-alpha.vercel.app/api/health', { signal: controller.signal });
    clearTimeout(timeout);
    console.log(`Status: ${res.status}`);
    const text = await res.text();
    console.log(`Body: ${text}`);
  } catch (err) {
    console.error("Health error:", err.message);
  }

  console.log("\nHitting chat endpoint...");
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch('https://hobbyfi-copilot-alpha.vercel.app/api/copilot/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vendorId: 'v_demo', message: 'revenue' }),
      signal: controller.signal
    });
    clearTimeout(timeout);
    console.log(`Status: ${res.status}`);
    const text = await res.text();
    console.log(`Body: ${text}`);
  } catch (err) {
    console.error("Chat error:", err.message);
  }

  console.log("\nHitting root page...");
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch('https://hobbyfi-copilot-alpha.vercel.app/', { signal: controller.signal });
    clearTimeout(timeout);
    console.log(`Status: ${res.status}`);
    const text = await res.text();
    console.log(`Body (first 200 chars): ${text.substring(0, 200)}`);
  } catch (err) {
    console.error("Root error:", err.message);
  }

  console.log("\nDone.");
}

run();
