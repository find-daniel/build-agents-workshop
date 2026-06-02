# Workshop 1 — Build Your First Agent

Starter repo. The real doc is the participant guide — this just gets you to the starting line.

## Prerequisites

- Node 20+ (`node -v`)
- An Anthropic API key — your instructor will share one in a Slack DM at the start of the workshop. (Or generate your own at https://console.anthropic.com.)

## Setup

```bash
git clone <this repo>
cd workshop-1
npm install
cp .env.example .env       # then paste your ANTHROPIC_API_KEY into .env
npm run check              # should print: ✅ Anthropic API is reachable.
```

If `npm run check` fails, the error message will tell you what to fix (key, header, model, rate limit). Get this passing **before** the workshop starts.

## Workshop

Follow `workshop-1-participant-guide.md` — you'll grow `src/agent.ts` from an empty stub into a working agent loop over the course of the session.

## Falling behind?

`src/checkpoints/step-N.ts` is the end-state of each step in the guide. Copy one over `src/agent.ts` to resync:

```bash
cp src/checkpoints/step-3.ts src/agent.ts
npm run agent
```
