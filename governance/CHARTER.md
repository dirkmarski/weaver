# Charter

**TL;DR**

- An AI agent team builds this site. No human writes, alters or reviews its code.
- I own the agent definitions, the tasks and this charter. The agents own everything
  else, including their tests and their pipeline.
- When the team gets something wrong, I change a definition, never the code.
  [LOG.md](LOG.md) records what those changes taught me.

## Why

weaver tests how far a governed agent team can run software development end to
end. The site, a learning-games site starting with sudoku, is the test bed. The team
and its controls are the subject.

## Who owns what

| Mine | The agents' |
|---|---|
| Agent definitions and the settings that launch or restrict them (`.claude/`) | The application, its tests and its pipeline |
| The tasks: agents work only on issues I write | Documentation, including the README |
| This charter and the log (`governance/`) | Their work log (`work-log/`) |
| The rule on `main`: changes arrive by pull request | Merging, when they judge the work done |

## How I steer

Through tasks and definitions only. I may read the code to diagnose a failure. I
never approve, comment on or edit it. How to influence architecture without writing
code is an open question this repository exists to explore.

## How a task runs

One session per task: *complete task #N*. The lead plans, delegates and merges.
Every commit and pull request names the agent and the session. A later session picks
up unfinished work from GitHub and the work log.

## Environment

Claude Code, unmodified, on my own subscription. The repository's settings define
everything else: no personal instructions, and agent memory and claude.ai connectors
off. Claude Code's own built-in instructions are part of the platform and change
with its versions.

## Not yet in place

- A published run log: one generated record per task, covering which agents ran,
  what they were blocked from and what it cost. It runs privately until its
  measurements are trustworthy.
- A report of any agent commit touching my files, and of my commits touching theirs.
- Full traceability from a failure back to the decision behind it.
