# Work Log: Iteration 11 (lead)

- Lead: weaver-agents (lead agent, Claude Opus 5.5), session `544de00f-db0c-4fd3-8425-f2e90d4ada4d`
- Run type: "Deliver the next iteration"
- Iteration branch: `iteration-11` (holds the iteration work logs and the memory updates; merged by PR at the end)
- Product manager work log: `work-log/iteration-11-product.md`
- Iteration files are edited in the worktree `<session scratchpad>/wt-iteration-11`.
- Session scratchpad: /private/tmp/claude-502/-Users-dirk-Code-weaver-team/544de00f-db0c-4fd3-8425-f2e90d4ada4d/scratchpad

## Gate check
- 2026-10-20: Invoked to deliver the next iteration. Restart procedure (memory/README.md) followed: WIP says "no active run". GitHub agrees: no open issues or PRs, and main is at 1464355. There is no iteration-11 log, so this is a fresh start, not a resume.
- Dirk changed governance after it10 in one commit, 1464355: governance/memory-architecture.md now says "Do not read the worklog unless specifically needed". Nothing changed in `.claude/` or `governance/context/`. governance/LOG.md was not read, per the standing convention.
- Baseline on main: 143/143 tests, about 0.63 s.

## Decisions
- D1 (applying 1464355): agents start from the memory tiers (WIP, wiki) and do not read the work log unless they need it for diagnosis. The PM scopes from `memory/wiki/backlog.md`. The it10 live list at the bottom of iteration-10-product.md was folded into that snapshot at the it10 close, so the PM need not read the old log. Every brief passes this rule on. Follow-up for the close: the PM's live candidate list should live in memory (the wiki backlog), not only in the product work log.

## Plan
1. The PM decides the iteration scope (from the backlog snapshot, with personas as needed) and writes the issue(s).
2. Per issue: gate check, branch `issue-N-<slug>`, per-issue log, developer, then reviewer and tester in parallel (proportionate), lead check, PR merged with a merge commit (no squash). The flow is in memory/wiki/process.md.
3. The PM accepts; the lead closes the iteration (wiki, WIP, log) and merges the iteration PR.

## Conventions
- Commits and PRs: `[<agent>][session 544de00f-db0c-4fd3-8425-f2e90d4ada4d] <message> (#N)`. Each agent adds a co-author trailer naming its own model and version.
- No agent reads governance/LOG.md.
- After merging main into iteration-11, use `git pull --no-rebase`, never `--rebase`.

## Progress
- Iteration branch, worktree and this log created.
- PM (product-manager agent) launched to scope iteration 11 from memory/wiki/backlog.md, with personas at its discretion. It was told about the new work-log rule (D1) and the LOG.md rule.
- The PM (Claude Opus 5.5) scoped two issues, to be delivered in sequence (PM log a0eb86c):
  - #50 "After a slip, name the clashing cells in the entry text and in Hint" (first);
  - #51 "Outline clashing cells while the clash lasts, and say when it is fixed" (second; it builds on #50).
  - The texts were settled with personas over three rounds (a mock-up, a play check on a prototype, then a wording check). No spec questions are open.
- Gate check: #50 and #51 are OPEN, by weaver-agents, label `enhancement`. PASS.
- D2: two issues is acceptable. They touch the same README section and the same `sudoku.js` text paths, so they are strictly sequential: #51 branches from main after #50 merges.
- D3: #51 changes the README's "no live checking" stance (the outline is a live mark). The PM decided this and it is in scope by its criterion 9. The lead accepts it, and the reviewer must check the README sentences on that point.
- #50: branch issue-50-name-clash (38d7381), per-issue log created, interpretation L0 recorded (the extra sentence goes on texts 2 and 3 only, per pinned example 6). Developer round 1 launched.
