# Build Agents Workshop

A hands-on workshop series where you build AI agents **from scratch** with the Anthropic API — no frameworks, no SDKs, just `fetch` and a loop. The point is to demystify "agents": by the end you'll see that an agent is a small, understandable idea you can write yourself.

Each workshop is a self-contained ~60-minute code-along. Clone this repo once and work through them in order. This repo just gets you to the starting line — the walkthrough lives in the participant guide.

## Workshops

| # | Workshop | What you build |
|---|----------|----------------|
| **1** | [Build your first agent](workshop-1/) | A todo-list agent: one API call → your first tool → the agent loop. |
| **2** | [Multi-agent systems](workshop-2/) | An orchestrator that delegates to specialist sub-agents (implement → test → review). |

Each folder has its own `README.md` with setup and a link to the participant guide.

## Prerequisites

- **Node 20+** (`node -v`) — we use the built-in `fetch`.
- **An Anthropic API key** — your instructor shares one at the start of the workshop; afterward you can generate your own at <https://console.anthropic.com>.

## Quick start

```bash
git clone https://github.com/find-daniel/build-agents-workshop.git
cd build-agents-workshop/workshop-1   # or workshop-2
npm install
cp .env.example .env                  # paste your ANTHROPIC_API_KEY into .env
npm run check                         # should print: ✅ Anthropic API is reachable.
```

If `npm run check` fails, the error message tells you what to fix (key, header, model, rate limit). Get it passing **before** the session starts.

## Participant guides

- Workshop 1 — <https://agent-workshops.vercel.app/workshop-1>
- Workshop 2 — <https://agent-workshops.vercel.app/workshop-2>
