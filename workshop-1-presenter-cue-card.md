# Workshop 1 — Presenter Cue Card

> Glance, don't read. One page. Times are wall-clock from `:00`.

## Pre-flight (10 min before)

- Starter repo cloned on your machine, `.env` populated, `npm run check` passes
- Demo terminal font size cranked up (Cmd-+ a few times)
- Slack/notifications off
- Have the participant guide open in a second window
- Ask the room: "Everyone got `npm run check` passing?" — fix stragglers NOW, not during Step 1

---

## :00–:03 — Open

**Say:** "By the end of the next hour, you'll have written a working agent from scratch. No frameworks. ~80 lines. The point isn't the todo list — it's that 'agent' is a much smaller idea than the marketing makes it sound."

**Don't:** sell agents, give a history of LLMs, or define "agentic" abstractly. Land the first concept in code, fast.

---

## :03–:06 — Step 0: Orient (3 min)

- Walk through the starter repo structure (10 seconds per file)
- Confirm everyone has `src/agent.ts` open
- **Checkpoint:** "Thumbs up if you can see `src/agent.ts` in your editor."

---

## :06–:13 — Step 1: Hello, model (7 min)

- Type the code live. Don't paste. They need to see you type it.
- **Say while typing:** "Notice — no SDK. We're hitting an HTTPS endpoint with a JSON body. That's it."
- Run it. Show the output.
- **Checkpoint:** "Anyone NOT seeing a response?" Wait 15 sec. Move on.

---

## :13–:21 — Step 2: Why won't it DO anything? (8 min)

- Add the system prompt, the user message about adding todos, the `todos: []` array
- Run it. Read the output **out loud** — both the model's claim AND the empty `todos: []`
- **Big moment — say:** "The model is lying. Not maliciously. It generated plausible text. That's its only job. Acting on the world is not its job. The name for closing that gap is *tools*."
- **Don't rush this.** This is the conceptual pivot the whole workshop hangs on.

---

## :21–:36 — Step 3: First tool (15 min) ⚠️ DENSEST

- Most code in one step. Expect copy-paste lag.
- Type the tool schema first, **explain the JSON Schema shape** as you go ("name, description, parameters — that's what the model sees")
- Type `executeTool`, then the `tool_calls` parsing
- **Checkpoint at :30** — pause, ask "everyone's code matches mine?" — give 60 seconds of silence to catch up
- Run it. The `Todos: [ { ... } ]` line is the payoff. **Pause and let it land.**
- **Say:** "The model didn't add the todo. It *asked us* to add the todo. We added it. That distinction is the whole game."

---

## :36–:51 — Step 4: The agent loop (15 min) ⚠️ THE REVEAL

- Wrap in `while (true)`, add the other two tools, append tool results to `messages`
- **Slow down for the loop body.** It's three rules:
  1. Send everything so far
  2. If tool calls, execute and append
  3. If plain text, done
- **Checkpoint at :45** — pause, scan the room
- Run it with the one-todo task. Show the `[final]` line.
- **Say:** "That's the entire concept. Fifteen lines. Everything called 'agent framework' is built on this."

---

## :51–:56 — Step 5: Real task (5 min)

- Swap the prompt to the multi-step grocery one
- Run it. **Don't talk over the output.** Let people watch the tool calls scroll.
- **Say:** "You did not write that plan. The model planned it. The loop just kept calling it."
- This is your applause-line moment. Pause for it.

---

## :56–:60 — Step 6: Debrief (4 min)

- Hit the four things we skipped: persistence, streaming, error handling, loop limits
- **Land:** "Workshop 2: turning this into a *team* of agents that coordinate. Same loop, multiple participants."
- Take 1-2 questions. Hard stop at :60.

---

## Panic recovery

**5 min behind at :30?** Skip Step 3's `executeTool` polish — just hardcode the `add_todo` case inline.

**10 min behind at :40?** Don't add `complete_todo`. Two tools is enough to show the loop.

**15 min behind anywhere?** Cut Step 5's grocery task. Step 4 already proves the point. Go straight to debrief.

**Someone's `npm run check` fails mid-workshop?** Don't debug live. Tell them to pair with a neighbor and move on. Debug in the break.

---

## FAQ ammunition

**"Why not use the OpenAI SDK / LangChain / Mastra?"**
Because the loop is the lesson. Frameworks hide the loop. Once you understand the loop, the frameworks make sense in five minutes.

**"Is this how real agents work?"**
Yes. Claude Code, Cursor agent mode, the OpenAI Agents SDK — all variations of this loop with more tools, better prompts, and production hardening.

**"What about MCP / function calling standards?"**
MCP is a protocol for *how tools are exposed* to a model. The loop is the same. We'll cover MCP in a later workshop.

**"How do we stop it looping forever?"**
Great question — add `let i = 0; while (i++ < 10)`. Always do this in production. Cover briefly in Step 6 if time.

**"What about cost?"**
GitHub Models has free-tier rate limits. For real use, org-attributed billing applies. Refer them to GitHub's pricing page.

---

## End-of-workshop CTA

- Drop the participant guide link in Slack
- Point them at the Workshop 2 signup
- Tell them: "Best thing you can do this week — swap the three todo tools for tools that touch something you actually care about. Same loop. New superpower."
