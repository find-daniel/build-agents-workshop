// A tiny in-memory "file system" so the workshop runs anywhere — no real disk
// writes. Pre-provided; you don't need to edit this.
const files = new Map<string, string>();

export function readFile(path: string): string {
  return files.has(path)
    ? files.get(path)!
    : JSON.stringify({ error: `no such file: ${path}` });
}

export function writeFile(path: string, contents: string): void {
  files.set(path, contents);
}

export function listFiles(): string[] {
  return [...files.keys()];
}
