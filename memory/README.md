# Memory

Implements `governance/memory-architecture.md`. The curator manages this directory at iteration closes; the lead keeps WIP current in between.

| Tier | Where | Purpose | Rule of thumb |
|---|---|---|---|
| LLM wiki | `memory/wiki/` (start at `index.md`) | Persistent facts: product, architecture, process, lessons, backlog snapshot, glossary | Current state only. When a fact changes, edit the page; do not append history. Cite the work log for evidence. |
| WIP | `memory/wip/` (start at `current.md`) | What is in flight right now: streams, status, next step, where things are | Read it first on any (re)start. Overwrite freely; clear an entry when its work is merged or abandoned. |
| Work log | `work-log/` | Audit trail: what happened, when, by whom, why | Append-only history. Not the restart point. |
| Session | the agent's context | Working memory of one run | Anything worth keeping goes to WIP (in flight) or the wiki (durable) before the session ends. |

## Who updates what
- Curator: closes each iteration: folds the session learnings into the wiki, refreshes the backlog snapshot, prunes, resets `wip/current.md` and reviews agents' read lists against `wiki/index.md` (tightening the index where agents over-read).
- Lead: keeps the wiki correct during an iteration; keeps `wip/current.md` up to date at every hand-off; records learnings as "Memory notes for the closing lead" in its log for the curator (or folds them in itself on a single-issue run).
- Other agents: read the wiki pages relevant to their task. They propose wiki changes in their reply to the lead and do not edit the wiki directly. They keep their own work-log entries.
- PM: owns the product backlog content; `wiki/backlog.md` is the curator's snapshot of it.

## Restart procedure (lead)
1. Read `memory/wip/current.md`.
2. Check it against GitHub (open issues and PRs, branch heads). GitHub wins on conflict.
3. Read `memory/wiki/index.md` and the pages you need.
4. Use `work-log/` only for diagnosis or to check how something was decided.
