import "dotenv/config";
import { readFile, writeFile, listFiles } from "../mockFiles";

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

// Crude token estimate — just enough to make context size visible.
const tokensOf = (msgs: any[]) => Math.round(JSON.stringify(msgs).length / 4);

const tools = [
  { name: "read_file", description: "Read a file's contents by path.",
    input_schema: { type: "object", properties: { path: { type: "string" } }, required: ["path"] } },
  { name: "write_file", description: "Write contents to a file at path.",
    input_schema: { type: "object", properties: { path: { type: "string" }, contents: { type: "string" } }, required: ["path", "contents"] } },
  { name: "list_files", description: "List all file paths.",
    input_schema: { type: "object", properties: {} } },
];

async function executeTool(name: string, args: any): Promise<string> {
  switch (name) {
    case "read_file":  return readFile(args.path);
    case "write_file": writeFile(args.path, args.contents); return JSON.stringify({ ok: true });
    case "list_files": return JSON.stringify(listFiles());
    default: return JSON.stringify({ error: `unknown tool: ${name}` });
  }
}

const SYSTEM = "You are a coding assistant. Use the tools to read and write files to complete the task.";

type Execute = (name: string, args: any) => Promise<string> | string;
async function runAgent(agent: string, system: string, tools: any[], task: string, execute: Execute): Promise<string> {
  const messages: Message[] = [{ role: "user", content: task }];
  let turn = 0;
  while (true) {
    console.log(`[ctx] ${agent} turn ${++turn}: ${messages.length} msgs, ~${tokensOf(messages)} tok`);
    const data = await callClaude(system, messages, tools);
    messages.push({ role: "assistant", content: data.content });
    if (data.stop_reason !== "tool_use") {
      return data.content.find((b: ContentBlock) => b.type === "text")?.text ?? "";
    }
    const results: ToolResult[] = [];
    for (const block of data.content) {
      if (block.type !== "tool_use") continue;
      const out = await execute(block.name, block.input);
      results.push({ type: "tool_result", tool_use_id: block.id, content: out });
    }
    messages.push({ role: "user", content: results });
  }
}

const TASK =
  "Implement parseQuery(qs) in query.ts (empty input, repeated keys as arrays, percent-encoded " +
  "chars). Then write query.test.ts. Then review both files and list any bugs.";

const result = await runAgent("agent", SYSTEM, tools, TASK, executeTool);
console.log("\n[final]\n" + result);
