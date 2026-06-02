// Step 1 — Hello, model. One fetch, one message, print the reply.
import "dotenv/config";

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) throw new Error("Set ANTHROPIC_API_KEY in .env");

const ENDPOINT = "https://api.anthropic.com/v1/messages";

async function main() {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        { role: "user", content: "Say hi in one short sentence." },
      ],
    }),
  });

  const data = await response.json();
  console.log(data.content[0].text);
}

main();
