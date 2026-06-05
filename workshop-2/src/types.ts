// Minimal shapes for the Anthropic Messages API — just enough for autocomplete.
export type ContentBlock = { type: string; text: string; id: string; name: string; input: any };
export type Message = { role: "user" | "assistant"; content: string | ContentBlock[] | ToolResult[] };
export type ToolResult = { type: "tool_result"; tool_use_id: string; content: string };
