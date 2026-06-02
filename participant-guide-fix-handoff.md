# Participant Guide Fix — Handoff

> Copy everything below the `---` into the other Claude chat as your first message. It's self-contained.

---

I need you to make a one-character fix to `workshop-1-participant-guide.md` across every code block where it reads the API key from env.

## The bug

The guide uses this pattern at the top of `src/agent.ts` in Steps 1, 2, 3, and 4:

```ts
const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) throw new Error("Set ANTHROPIC_API_KEY in .env");
```

This runs fine under `tsx` (which doesn't typecheck), but our `tsconfig.json` has `strict: true`. TypeScript's control-flow narrowing for a `const` read of `process.env.X` **does not propagate into async closures**. So later in the same file, when participants type:

```ts
async function main() {
  await fetch(ENDPOINT, {
    headers: {
      "x-api-key": API_KEY,   // ← TS thinks this is string | undefined
      // ...
    },
    // ...
  });
}
```

…their editor lights up with red squigglies on every `"x-api-key": API_KEY` line — right in the middle of a live workshop. Confirmed with a minimal repro under TS 5.5 strict + ES2022 + NodeNext.

## The fix

Add a non-null assertion (`!`) to the env read. One character per code block:

```ts
const API_KEY = process.env.ANTHROPIC_API_KEY!;
if (!API_KEY) throw new Error("Set ANTHROPIC_API_KEY in .env");
```

The `!` tells TS "trust me, this is a string." The runtime `if` check still catches missing or empty values, so nothing about the behavior changes — only the editor experience.

## What to change

In `workshop-1-participant-guide.md`, find every occurrence of:

```ts
const API_KEY = process.env.ANTHROPIC_API_KEY;
```

and change it to:

```ts
const API_KEY = process.env.ANTHROPIC_API_KEY!;
```

This should appear in the code blocks for Steps 1, 2, 3, and 4. Don't touch the surrounding `if (!API_KEY) throw ...` line — that stays exactly as-is.

## What NOT to change

- Don't rewrite the env-read into a helper function or pattern. The whole pedagogy is "look how few lines this is." A helper adds explaining overhead.
- Don't disable `strict` mode in tsconfig. It's helpful elsewhere.
- Don't touch the Troubleshooting section. This isn't a runtime failure mode.

## Optional: one-sentence explanation in the guide

If you want to pre-empt the question, you can add a single line in Step 1 right after the code block, something like:

> The `!` after `process.env.ANTHROPIC_API_KEY` tells TypeScript "trust me, this is a string." We immediately check it on the next line, so it's safe.

But honestly, nobody asks. Leaving it unexplained is fine too — your call.

## Done means

```bash
grep -n "process.env.ANTHROPIC_API_KEY" workshop-1-participant-guide.md
```

returns lines that all end with `!;` (not `;`).
