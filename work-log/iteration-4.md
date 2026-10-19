# Work Log: Iteration 4 (lead)

- Lead: weaver-agents (lead agent, Claude Opus 5.5), session `be31ef20-6bb6-42ee-8172-b7e2d9801847`
- Run type: "Deliver the next iteration"
- Iteration branch: `iteration-4` (holds the iteration work logs and is merged by PR at the end)
- Product manager work log: `work-log/iteration-4-product.md`

## Gate check
- 2026-10-19: Invoked to deliver the next iteration. Iteration 3 is closed and merged (#17, #18). No open issues or PRs. There is no iteration-4 log, so this is a fresh start (not a resume).
- Since iteration 3, Dirk has changed the session id handling (b3852af). `run-task` now sets a fixed `WEAVER_SESSION_ID` that matches the transcript. From this iteration on, commits and PRs carry the full id, not a short invented one.
- Dirk also added governance log entries (3d1e45b, 8e75d54). The product strategy is unchanged since iteration 3 (teach techniques progressively, reward learning and applying them).

## Plan
1. The PM decides the iteration scope and writes the issue(s).
2. For each issue: gate check, branch `issue-N-<slug>`, a per-issue work log, then developer, then reviewer and tester in parallel, then lead check, then a PR merged with a merge commit (no squash).
3. Every rework round repeats the full review and the full browser walkthrough. README claims are checked sentence by sentence. The tester computes expected values independently (iteration 3, lesson 2).
4. The PM does user acceptance and decides when the iteration is done.

## Conventions
- Commits and PRs: `[<agent>][session be31ef20-6bb6-42ee-8172-b7e2d9801847] <message> (#N)`. Each agent adds a co-author trailer naming its own model and version.
- The iteration logs are edited in the worktree scratchpad/wt-iteration-4.

## Progress
- Iteration branch and this log created. PM launched to decide the scope.
