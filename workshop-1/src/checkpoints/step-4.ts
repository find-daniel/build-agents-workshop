// Step 4 — The agent loop. while(true) around the model + tools, exit when stop_reason != "tool_use".
import "dotenv/config";

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) throw new Error("Set ANTHROPIC_API_KEY in .env");

const ENDPOINT = "https://api.anthropic.com/v1/messages";

type Todo = { id: string; text: string; done: boolean };
const todos: Todo[] = [];

const tools = [
  {
    name: "add_todo",
    description: "Add a new todo item.",
    input_schema: {
      type: "object",
      properties: { text: { type: "string" } },
      required: ["text"],
    },
  },
  {
    name: "list_todos",
    description: "Get all todos with their ids and status.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "complete_todo",
    description: "Mark a todo as done by id.",
    input_schema: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
    },
  },
];

function executeTool(name: string, args: any): string {
  switch (name) {
    case "add_todo": {
      const todo: Todo = {
        id: crypto.randomUUID(),
        text: args.text,
        done: false,
      };
      todos.push(todo);
      return JSON.stringify({ success: true, id: todo.id });
    }
    case "list_todos":
      return JSON.stringify(todos);
    case "complete_todo": {
      const t = todos.find((t) => t.id === args.id);
      if (!t) return JSON.stringify({ error: "not found" });
      t.done = true;
      return JSON.stringify({ success: true });
    }
    default:
      return JSON.stringify({ error: `unknown tool: ${name}` });
  }
}

async function runAgent(userMessage: string) {
  const messages: any[] = [{ role: "user", content: userMessage }];

  while (true) {
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
        system:
          "You are a todo list assistant. Use tools to manage the user's todos. When the user's request is fully complete, reply with a short natural-language summary instead of calling a tool.",
        messages,
        tools,
      }),
    });

    const data = await response.json();

    // Append the model's full response (text + tool_use blocks) as one assistant turn.
    messages.push({ role: "assistant", content: data.content });

    // Termination: the model stopped without asking for a tool.
    if (data.stop_reason !== "tool_use") {
      const textBlock = data.content.find((b: any) => b.type === "text");
      console.log("\n[final]", textBlock?.text);
      return;
    }

    // Execute every tool the model asked for, collect results.
    const toolResults: any[] = [];
    for (const block of data.content) {
      if (block.type !== "tool_use") continue;
      console.log(`[tool] ${block.name}(${JSON.stringify(block.input)})`);
      const result = executeTool(block.name, block.input);
      console.log(`[result] ${result}`);
      toolResults.push({
        type: "tool_result",
        tool_use_id: block.id,
        content: result,
      });
    }

    // Tool results all come back in a single user turn.
    messages.push({ role: "user", content: toolResults });
  }
}

runAgent("Add 'buy milk' to my list.");
