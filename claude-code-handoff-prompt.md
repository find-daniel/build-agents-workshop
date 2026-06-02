# Claude Code Handoff Prompt

> Copy everything below the `---` into Claude Code as your first message. It's self-contained.

---

I'm building a 60-minute hands-on workshop to teach my team how to write their first AI agent from scratch. I need you to build the **starter repo** that participants will clone at the start of the workshop.

## Context (read this first)

- **Audience:** developers on my team. Comfortable with TypeScript/Node but new to agents.
- **Stack:** TypeScript on Node 20+, no frameworks, no SDKs. We use the built-in `fetch`.
- **LLM provider:** [GitHub Models](https://docs.github.com/en/github-models) — REST API at `https://models.github.ai/inference/chat/completions`, authenticated with a GitHub PAT that has `models:read` scope. OpenAI-compatible chat completions schema.
- **The pedagogical arc** is "dumbest thing → wall → add the missing piece." Participants progressively grow `src/agent.ts` from a single API call into a real agent loop with three tools.

The participant guide (which dictates the *exact* code participants will end up writing) is in `workshop-1-participant-guide.md` — I'll attach it. **Treat that doc as the source of truth for the agent code.** Do not invent your own version.

## What I need you to build

A starter repo at `./workshop-1` with this structure:

```
workshop-1/
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
├── README.md
├── src/
│   ├── agent.ts        # stub — just imports + env check
│   └── check.ts        # the setup-verification script
```

### Specific requirements

**`package.json`**
- Node 20+ engines field
- Dependencies: `dotenv`
- Dev dependencies: `typescript`, `@types/node`, `tsx`
- Scripts: `"check": "tsx src/check.ts"` and `"agent": "tsx src/agent.ts"`
- No build step. We run TS directly with `tsx`.

**`tsconfig.json`**
- Strict mode on
- Target ES2022, module NodeNext, moduleResolution NodeNext
- `esModuleInterop: true`
- No emit (we use tsx)

**`src/check.ts`**
- Loads `GITHUB_PAT` from `.env`
- Makes one POST to `https://models.github.ai/inference/chat/completions` with model `openai/gpt-4.1` and a one-line user message
- Logs `✅ GitHub Models is reachable.` on 2xx
- On non-2xx, logs the status code + response body and a tailored hint (`401 → check PAT`, `403 → check org policy`, `429 → rate limit`, anything else → show body)
- Helpful for participants debugging access issues *before* the workshop starts

**`src/agent.ts`**
- Minimal stub: imports `dotenv/config`, reads `GITHUB_PAT`, throws if missing, defines the endpoint constant, has an empty `main()` they'll fill in
- Add a top-of-file comment: `// Workshop 1 — build this file step by step. See workshop-1-participant-guide.md.`

**`.env.example`**
- One line: `GITHUB_PAT=your_github_pat_here`
- Comment above: how to generate a PAT with `models:read` scope

**`.gitignore`**
- Standard Node + `.env`

**`README.md`**
- 3 sections: Prerequisites, Setup (clone / install / copy .env / `npm run check`), Workshop link
- Keep it short. The participant guide is the real doc.

## Testing requirement (important)

Once the repo is scaffolded, **actually test it**:

1. Ask me for a GitHub PAT with `models:read` scope (I'll paste one in)
2. Run `npm install`
3. Run `npm run check` and confirm it prints the success message
4. Then, as a sanity check, paste in the Step 4 final version of `src/agent.ts` from the participant guide and run `npm run agent` with the grocery-task user message. Confirm you see tool calls execute and a `[final]` summary.

If the end-to-end run works, you're done. If it doesn't, debug it — the most likely failure modes are PAT scope, header format, or model id.

## Out of scope

- Don't add testing libraries or CI
- Don't add ESLint/Prettier — opinions are a distraction during a workshop
- Don't pre-implement the agent. The starter file is intentionally empty.
- Don't create progressive checkpoint files (`step-1-complete.ts` etc) unless I ask later

## After you're done

Print:
1. The full file tree of what you built
2. The output of `npm run check` proving it works
3. Any deviations from this spec and why

Then ask me if I want progressive checkpoint files added, or if we're ready to ship.
