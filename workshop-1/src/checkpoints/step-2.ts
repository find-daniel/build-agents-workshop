import "dotenv/config";

const API_KEY = process.env.ANTHROPIC_API_KEY!;
if (!API_KEY) throw new Error("Set ANTHROPIC_API_KEY in .env");

const ENDPOINT = "https://api.anthropic.com/v1/messages";

type Todo = { id: string; text: string; done: boolean };
const todos: Todo[] = [];

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
      system: "You are a todo list assistant. Help the user manage their todos.",
      messages: [
        {
          role: "user",
          content: "Add 'buy milk' and 'walk the dog' to my list.",
        },
      ],
    }),
  });

  const data = await response.json();
  console.log("Model said:", data.content[0].text);
  console.log("Actual todos:", todos);
}

main();
