// Setup verification — run with `npm run check` before the workshop.
import "dotenv/config";

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error("❌ ANTHROPIC_API_KEY is not set. Copy .env.example to .env and paste your key.");
  process.exit(1);
}

try {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 16,
      messages: [{ role: "user", content: "Say OK." }],
    }),
  });
  if (res.ok) {
    console.log("✅ Anthropic API is reachable.");
  } else if (res.status === 401) {
    console.error("❌ 401 Unauthorized — check your ANTHROPIC_API_KEY.");
  } else if (res.status === 429) {
    console.error("❌ 429 Rate limited — wait a moment, or use your own key.");
  } else {
    console.error(`❌ API ${res.status}: ${await res.text()}`);
  }
} catch (e) {
  console.error("❌ Network error reaching the API:", (e as Error).message);
}
