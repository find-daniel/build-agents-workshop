import "dotenv/config";

const ENDPOINT = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-6";

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error("❌ ANTHROPIC_API_KEY is not set. Copy .env.example to .env and paste your key.");
  process.exit(1);
}

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: {
    "x-api-key": apiKey,
    "anthropic-version": "2023-06-01",
    "content-type": "application/json",
  },
  body: JSON.stringify({
    model: MODEL,
    max_tokens: 64,
    messages: [{ role: "user", content: "ping" }],
  }),
});

if (res.ok) {
  console.log("✅ Anthropic API is reachable.");
  process.exit(0);
}

const body = await res.text();
console.error(`❌ Request failed: ${res.status} ${res.statusText}`);
console.error(body);

switch (res.status) {
  case 401:
    console.error(
      "\nHint: 401 — check your API key. It may have been revoked, mistyped when pasting, or sent under the wrong header (must be `x-api-key`, not `Authorization: Bearer`)."
    );
    break;
  case 400:
    console.error(
      "\nHint: 400 — likely a missing `max_tokens`, a bad model id, or a malformed body. The response body above has the details."
    );
    break;
  case 429:
    console.error(
      "\nHint: 429 — rate limited. Wait 30 seconds and retry. If the room is sharing one key during the workshop, flag it to your instructor."
    );
    break;
  case 529:
    console.error("\nHint: 529 — Anthropic is overloaded. Retry in a moment.");
    break;
  default:
    console.error("\nHint: see the response body above for details.");
}

process.exit(1);
