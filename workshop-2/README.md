# Workshop 2 — Multi-agent Workflows

Starter repo. The guide is the real doc — this just gets you to the starting line.

## Prerequisites

- **Workshop 1 finished** (or its concepts solid): an agent is a `while` loop around a model with tools.
- Node 20+ (`node -v`)
- An Anthropic API key — your instructor will share one in a Slack DM. (Or generate your own at https://console.anthropic.com.)

## Setup

```bash
git clone https://github.com/find-daniel/build-agents-workshop.git
cd build-agents-workshop/workshop-2
npm install
cp .env.example .env       # then paste your ANTHROPIC_API_KEY into .env
npm run check              # should print: ✅ Anthropic API is reachable.
```

Get `npm run check` passing **before** the workshop starts.

## Workshop

Follow the participant guide at https://agent-workshops.vercel.app/workshop-2 — you'll grow `src/agent.ts` from a single coding agent
into an **orchestrator** that delegates to specialist sub-agents (implementer, tester,
reviewer) — all powered by one `runAgent`. `src/mockFiles.ts` is a pre-provided in-memory
file system, so nothing touches your real disk.

## Falling behind?

`src/checkpoints/step-N.ts` is the end-state of each step. Run one directly:

```bash
npx tsx src/checkpoints/step-5.ts
```

(Checkpoints import `../mockFiles`; `src/agent.ts` imports `./mockFiles`. If you copy a
checkpoint over `src/agent.ts`, change that one import path.)

## Troubleshooting

- **`npm run check` says the key isn't set, but `.env` looks right.** You already
  have `ANTHROPIC_API_KEY` exported in your shell, and `dotenv` won't override an
  existing variable. Run `unset ANTHROPIC_API_KEY` (or open a fresh shell).
- **429 Too Many Requests.** Multi-agent fans out into many calls; on a shared key a
  room hits limits fast. Wait and retry, or use your own key.
- **`z.toJSONSchema is not a function`.** You're on Zod 3 — this repo pins Zod 4.
