import "dotenv/config";
import { readFile, writeFile, listFiles } from "./mockFiles";

const API_KEY = process.env.ANTHROPIC_API_KEY!;
if (!API_KEY) throw new Error("Set ANTHROPIC_API_KEY in .env");

const ENDPOINT = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-6";

// Minimal shapes for the Anthropic Messages API — just enough for autocomplete.
type ContentBlock = { type: string; text: string; id: string; name: string; input: any };
type Message = { role: "user" | "assistant"; content: string | ContentBlock[] | ToolResult[] };
type ToolResult = { type: "tool_result"; tool_use_id: string; content: string };

async function callClaude(system: string, messages: Message[], tools: any[]): Promise<{ content: ContentBlock[]; stop_reason: string }> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({ model: MODEL, max_tokens: 4096, system, messages, tools }),
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json();
}

const tools = [
  { name: "read_file", description: "Read a file's contents by path.",
    input_schema: { type: "object", properties: { path: { type: "string" } }, required: ["path"] } },
  { name: "write_file", description: "Write contents to a file at path.",
    input_schema: { type: "object", properties: { path: { type: "string" }, contents: { type: "string" } }, required: ["path", "contents"] } },
  { name: "list_files", description: "List all file paths.",
    input_schema: { type: "object", properties: {} } },
];

function executeTool(name: string, args: any): string {
  switch (name) {
    case "read_file":  return readFile(args.path);
    case "write_file": writeFile(args.path, args.contents); return JSON.stringify({ ok: true });
    case "list_files": return JSON.stringify(listFiles());
    default: return JSON.stringify({ error: `unknown tool: ${name}` });
  }
}

const SYSTEM = "You are a coding assistant. Use the tools to read and write files to complete the task.";

async function runAgent(task: string) {
  const messages: Message[] = [{ role: "user", content: task }];
  while (true) {
    const data = await callClaude(SYSTEM, messages, tools);
    messages.push({ role: "assistant", content: data.content });
    if (data.stop_reason !== "tool_use") {
      console.log("\n[final]", data.content.find((b: ContentBlock) => b.type === "text")?.text);
      return;
    }
    const results: ToolResult[] = [];
    for (const block of data.content) {
      if (block.type !== "tool_use") continue;
      results.push({ type: "tool_result", tool_use_id: block.id, content: executeTool(block.name, block.input) });
    }
    messages.push({ role: "user", content: results });
  }
}

runAgent("Create hello.ts that exports a function add(a, b).");
