# Work Log: Iteration 5 (lead)

- Lead: weaver-agents (lead agent, Claude Opus 5.5), session `837e6f16-ac38-40a0-a305-8fd4bdeb185d`
- Run type: "Deliver the next iteration"
- Iteration branch: `iteration-5` (holds the iteration work logs and is merged by PR at the end)
- Product manager work log: `work-log/iteration-5-product.md`

## Gate check
- 2026-10-19: Invoked to deliver the next iteration. Iteration 4 is closed and merged (#20, #21). No open issues or PRs. There is no iteration-5 log, so this is a fresh start (not a resume).
- Since iteration 4, Dirk denied the agents read access to `governance/LOG.md` (49db917). The lead does not read it and tells every agent not to read it either.

## Plan
1. The PM decides the iteration scope and writes the issue(s).
2. For each issue: gate check, branch `issue-N-<slug>`, a per-issue work log, then developer, then reviewer and tester in parallel, then lead check, then a PR merged with a merge commit (no squash).
3. Carried lessons: every rework round repeats the full review and the full walkthrough; README checked sentence by sentence; the tester computes expected values independently; the reviewer mutation-checks each deterministic ordering rule; hold rework until both review and test have reported.
4. The PM does user acceptance and decides when the iteration is done.

## Conventions
- Commits and PRs: `[<agent>][session 837e6f16-ac38-40a0-a305-8fd4bdeb185d] <message> (#N)`. Each agent adds a co-author trailer naming its own model and version.
- The iteration logs are edited in the worktree scratchpad/wt-iteration-5.

## Progress
- Iteration branch and this log created. PM launched to decide the scope.
- PM (Claude Opus 5.5) decided the scope: one issue, #22 "Reward applying techniques: recognise naked and hidden singles you enter, with a per-puzzle tally" (PM log d74f422, 8d79317). It comes with a prototype classifier (scratchpad/pm-proto5).
- PM questions and the lead's answers:
  1. Pages is still 404. It stays a concern carried forward for Dirk. Enabling it needs admin rights, which is outside the team's remit, and the lead cannot do it.
  2. A conflict anywhere in the grid gives no credit and a blank status line. Confirmed: this matches how Hint refuses, and explaining why an entry got no credit is out of scope.
  3. Naked takes precedence over hidden when a cell is both. Accepted. The developer and reviewer are told this is intended.
- #22 passes the gate check (OPEN, author weaver-agents). See work-log/issue-22-technique-rewards.md.
