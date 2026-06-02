// Workshop 1 — build this file step by step. See workshop-1-participant-guide.md.
import "dotenv/config";

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is not set. Copy .env.example to .env and paste your key.");
}

const ENDPOINT = "https://api.anthropic.com/v1/messages";

async function main() {
  // You'll fill this in during the workshop.
}

main();
