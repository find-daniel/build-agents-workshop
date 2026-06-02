import "dotenv/config";
import { z, toJSONSchema } from "zod";
import { readFile, writeFile, listFiles } from "../mockFiles";

const API_KEY = process.env.ANTHROPIC_API_KEY!;
if (!API_KEY) throw new Error("Set ANTHROPIC_API_KEY in .env");

const ENDPOINT = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-6";

async function callClaude(system: string, messages: any[], tools: any[]) {
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

// One Zod object per tool — the single source of truth.
const schemas = {
  read_file: z.object({ path: z.string() }),
  write_file: z.object({ path: z.string(), contents: z.string() }),
  list_files: z.object({}),
};
const fileTools = [
  { name: "read_file",  description: "Read a file's contents by path.",   input_schema: toJSONSchema(schemas.read_file) },
  { name: "write_file", description: "Write contents to a file at path.",  input_schema: toJSONSchema(schemas.write_file) },
  { name: "list_files", description: "List all file paths.",               input_schema: toJSONSchema(schemas.list_files) },
];
function runFileTool(name: string, args: any): string {
  switch (name) {
    case "read_file":  return readFile(args.path);
    case "write_file": writeFile(args.path, args.contents); return JSON.stringify({ ok: true });
    case "list_files": return JSON.stringify(listFiles());
    default: return JSON.stringify({ error: `unknown tool: ${name}` });
  }
}

const IMPLEMENTER =
  "You are an implementation specialist. Write a single source file to satisfy the spec, " +
  "then stop. Return a ONE-SENTENCE summary naming the file and function — no code, no detail. Do not write tests.";

const delegateSchemas = {
  write_implementation: z.object({ spec: z.string().describe("Self-contained spec for the file to write.") }),
};
const allSchemas: Record<string, any> = { ...schemas, ...delegateSchemas };

type Execute = (name: string, args: any) => Promise<string> | string;
async function runAgent(agent: string, system: string, tools: any[], task: string, execute: Execute): Promise<string> {
  const messages: any[] = [{ role: "user", content: task }];
  let turn = 0;
  while (true) {
    console.log(`[ctx] ${agent} turn ${++turn}: ${messages.length} msgs, ~${tokensOf(messages)} tok`);
    const data = await callClaude(system, messages, tools);
    messages.push({ role: "assistant", content: data.content });
    if (data.stop_reason !== "tool_use") {
      return data.content.find((b: any) => b.type === "text")?.text ?? "";
    }
    const results: any[] = [];
    for (const block of data.content) {
      if (block.type !== "tool_use") continue;
      const schema = allSchemas[block.name];
      const parsed = schema ? schema.safeParse(block.input) : { success: true as const, data: block.input };
      const out = parsed.success
        ? await execute(block.name, parsed.data)
        : JSON.stringify({ error: "invalid tool input", detail: parsed.error.issues });
      results.push({ type: "tool_result", tool_use_id: block.id, content: out });
    }
    messages.push({ role: "user", content: results });
  }
}

async function delegate(name: string, args: any): Promise<string> {
  switch (name) {
    case "write_implementation":
      return runAgent("implementer", IMPLEMENTER, fileTools, args.spec, runFileTool);
    default:
      return JSON.stringify({ error: `unknown tool: ${name}` });
  }
}

const driverTools = [
  fileTools[0], fileTools[2], // read_file, list_files
  { name: "write_implementation", description: "Delegate writing a source file. Returns a summary.", input_schema: toJSONSchema(delegateSchemas.write_implementation) },
];
async function driverExecute(name: string, args: any): Promise<string> {
  if (name === "read_file" || name === "list_files") return runFileTool(name, args);
  return delegate(name, args);
}

const DRIVER =
  "You coordinate by delegating. Use write_implementation to create the file the task asks for, " +
  "then read it back to confirm, and summarize what was built.";
const TASK = "Create query.ts exporting parseQuery(qs) that parses a URL query string into an object.";

const result = await runAgent("driver", DRIVER, driverTools, TASK, driverExecute);
console.log("\n[final]\n" + result);
