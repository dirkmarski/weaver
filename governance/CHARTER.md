# Charter

**TL;DR**

- An AI agent team builds this site. No human writes, alters or reviews its code.
- I own the agent definitions, the product context and this charter. The agents own
  everything else, including what each iteration delivers, their tests and their
  pipeline.
- When the team gets something wrong, I change a definition, never the code.
  [LOG.md](LOG.md) records what those changes taught me.

## Why

weaver tests how far a governed agent team can run software development end to
end. The site, a puzzle-games site starting with sudoku, is the test bed. The team
and its controls are the subject.

## Who owns what

| Mine | The agents' |
|---|---|
| Agent definitions and the settings that launch or restrict them (`.claude/`) | The application, its tests and its pipeline |
| The context the team works within, including the architecture decision records and the rules every agent follows (`governance/context/`) | What goes into each iteration: the product manager decides it and writes the issues |
| Any issue I write directly | Documentation, including the README |
| This charter and the log (`governance/`) | Their curated memory (`memory/`) and their work log (`work-log/`) |
| The rule on `main`: changes arrive by pull request | Merging, when they judge the work done |

## How I steer

Through definitions and the product context only. I can still write an issue
directly, but the default is to set direction and let the product manager decide
what follows from it. I may read the code to diagnose a failure. I never approve,
comment on or edit it. How to influence architecture without writing code is an open
question this repository exists to explore.

## How a run works

One session per run, started one of two ways. *Deliver the next iteration*: a
director has the product manager decide what the iteration is and write its issues,
then launches one lead per issue, one at a time, and the product manager accepts each
result. *Complete task #N*: a lead delivers one issue I wrote. Either way the lead
plans, delegates and merges its issue. At the end of the session a curator folds the
learnings into the team's memory and a closing lead reviews that and finalises git.
Every commit and pull request names the agent and the session.

The context in `governance/context/` comes first: where it and the curated memory disagree, the context wins. Within that, the curated memory is the agents' source of truth. A later session picks up
unfinished work from GitHub and that memory. The work log is the audit trail, not a
source to learn from.

## Environment

Claude Code, unmodified, on my own subscription. The repository's settings define
everything else: no personal instructions, and Claude Code's auto-memory and claude.ai
connectors off. Claude Code's own built-in instructions are part of the platform and change
with its versions.

## Not yet in place

- A published run log: one generated record per run, covering which agents ran,
  what they were blocked from and what it cost. It runs privately until its
  measurements are trustworthy.
- A report of any agent commit touching my files, and of my commits touching theirs.
- Full traceability from a failure back to the decision behind it.
