# Workshop 2 — Presenter Cue Card

> Glance, don't read. One page. Times are wall-clock from `:00`. ~105 min incl. a break.

## Pre-flight (10 min before)

- `workshop-2` cloned, `.env` populated, `npm run check` passes
- **Pre-run `npx tsx src/checkpoints/step-5.ts` once today** so you've seen what this room's model does — numbers and the exact bugs vary run to run.
- Demo terminal font cranked up; notifications off
- Participant guide open in a second window
- Ask the room: "Everyone on Workshop 1's concepts? Everyone got `npm run check` green?" — fix stragglers NOW
- ⚠️ If someone's `check` says "key not set" but their `.env` looks right: they have `ANTHROPIC_API_KEY` already set in their shell, and `dotenv` won't override it. Have them run `unset ANTHROPIC_API_KEY` (or open a fresh shell).

---

## :00–:05 — Open + Step 0: Orient

**Say:** "Last time you built one agent. Today you'll turn it into a team — an orchestrator that delegates to specialists. The twist: it's the *same loop*. An agent is just a function, and you already know how to give a function to an agent."

**Don't:** sell "multi-agent" as magic. The honest pitch is *context*, not intelligence.

- Walk the starter: `src/agent.ts` is a W1-shaped coding agent over `mockFiles`. **Checkpoint:** "Thumbs up if it's open."

---

## :05–:20 — Step 1: The wall (15) ⚠️ THE SETUP

- Add the `[ctx]` instrumentation + the fat task (implement → test → review). Run it live.
- **Narrate the SHAPE, not exact numbers:** watch `[ctx]` climb (it ends near ~7k tok), and read the final review out loud — it's shallow ("Looks good!") and waves real bugs through.
- **Say:** "It's not that the model is weak. We gave one model too much to hold at once. By the time it reviews, the files are buried under its own output."
- If your live run's review happens to catch something: pivot to the `[ctx]` balloon — that's always visible.

---

## :20–:32 — Step 2: Generalize the loop (12)

- Refactor `runAgent(task)` → `runAgent(agent, system, tools, task, execute)`, and **return** the text.
- **Say:** "Three things fully describe an agent: who it is, what it can do, what to do. The loop never changes."

---

## :32–:47 — Step 3: Zod (15)

- Replace hand-written schemas with Zod; `toJSONSchema` for the API, `safeParse` for validation.
- **Say:** "Zod is a validation library, not a framework. One object: the schema you send AND the check on what comes back. We are not hiding the loop."
- **Checkpoint at :44** — 60 sec of silence to catch up.

---

## :47–:65 — Step 4: A sub-agent is a tool (18) ⚠️ THE REVEAL

- Define the implementer specialist; expose it as a tool whose handler runs a **fresh** `runAgent`.
- **Big moment — say:** "`add_todo` was a function we gave the agent as a tool. `runAgent` is also a function. So an agent can be a tool for another agent. That's the whole idea — recursion over the same loop."
- Show the Delegation diagram in the guide: each specialist's context **inflates, then collapses to one line**. The caller never sees the mess.

---

## :65–:75 — BREAK (10)

- Hard break. Concept has landed; the orchestrator build is the second half. Tell them the exact return time.

---

## :75–:95 — Step 5: The orchestrator (20) ⚠️ THE PAYOFF

- Add tester + reviewer. Orchestrator gets read/list + the three delegate tools — **and deliberately no `write_file`.**
- **Say:** "The manager literally cannot write code. It can only delegate. That asymmetry is the lesson."
- Run the **same task from Step 1**. Narrate: orchestrator `[ctx]` stays far lower (~2k vs ~7k), each specialist spikes then is discarded, and the reviewer — in a clean room — names real bugs (often prototype pollution via `__proto__`).
- **Land it:** "You didn't make the model smarter. You gave each step a clean place to think."
- **Be honest if asked:** the token gap is ~3–4×, not 100×. The reliable win is *review quality from a clean context* — and that you can see every run.

---

## :95–:105 — Step 6: Debrief (10)

- Skipped on purpose: parallelism (rate limits + interleaving → W4), retries/loop guards (W4).
- **The W3 hook:** "We keep *saying* this is better. One run isn't proof. To know three agents beat one well-prompted agent, you measure — that's evals, Workshop 3."
- Take 1–2 questions. Hard stop.

---

## Panic recovery

**Behind at :47?** Make Step 3 (Zod) a paste, not a live-type — keep the concept, skip the syntax.

**Behind at :75?** Ship the orchestrator with **two** specialists (implementer + reviewer). Drop the tester. The payoff still lands.

**A live run flops** (model stops early / no bug found)? Don't debug live. Show the example output in the guide and narrate the shape. Re-run in the break.

**429s on a shared key?** Expected — multi-agent fans out into many calls. Keep delegation sequential (no `Promise.all`). For a live room, per-developer keys.

---

## FAQ ammunition

**"Isn't multi-agent overkill for this?"**
Often, yes. A well-prompted single agent is strong. Reach for delegation when context isolation or specialization actually helps — and prove it with evals (W3). Honesty here builds trust.

**"Why sequential, not parallel?"**
Parallel specialists multiply your request rate and add `tool_result` interleaving headaches. Real, but a W4 topic.

**"Is the bug-catch guaranteed?"**
No — the model is non-deterministic. The *reliable* claim is that a clean, focused context reviews better than a polluted one. That's what the `[ctx]` numbers show every time.

**"How is this different from LangGraph / CrewAI swarms?"**
Same move: agent → function → tool → agent. Frameworks add ergonomics and orchestration sugar on top of exactly this loop.

---

## End-of-workshop CTA

- Drop the guide link + Workshop 3 (evals) signup in Slack.
- Tell them: "This week — take the orchestrator and give it a real task from your own work. Watch where one agent would have drowned."
