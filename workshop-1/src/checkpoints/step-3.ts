// Step 3 — Your first tool. Model emits a tool_use block; we execute it; todos actually grows.
import "dotenv/config";

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) throw new Error("Set ANTHROPIC_API_KEY in .env");

const ENDPOINT = "https://api.anthropic.com/v1/messages";

type Todo = { id: string; text: string; done: boolean };
const todos: Todo[] = [];

const tools = [
  {
    name: "add_todo",
    description: "Add a new todo item to the list.",
    input_schema: {
      type: "object",
      properties: {
        text: { type: "string", description: "What needs to be done." },
      },
      required: ["text"],
    },
  },
];

function executeTool(name: string, args: any): string {
  if (name === "add_todo") {
    const todo: Todo = {
      id: crypto.randomUUID(),
      text: args.text,
      done: false,
    };
    todos.push(todo);
    return JSON.stringify({ success: true, id: todo.id });
  }
  return JSON.stringify({ error: `unknown tool: ${name}` });
}

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
      system: "You are a todo list assistant. Use tools to manage the user's todos.",
      messages: [{ role: "user", content: "Add 'buy milk' to my list." }],
      tools,
    }),
  });

  const data = await response.json();

  for (const block of data.content) {
    if (block.type === "tool_use") {
      console.log(`[tool] ${block.name}(${JSON.stringify(block.input)})`);
      const result = executeTool(block.name, block.input);
      console.log(`[result] ${result}`);
    } else if (block.type === "text") {
      console.log("Model said:", block.text);
    }
  }

  console.log("Todos:", todos);
}

main();
