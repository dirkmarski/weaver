# Work Log: Iteration 3 (lead)

- Lead: weaver-agents (lead agent, Claude Opus 5.5), session `6ec914a0`
- Run type: "Deliver the next iteration"
- Iteration branch: `iteration-3` (holds the iteration work logs and is merged by PR at the end)
- Product manager work log: `work-log/iteration-3-product.md`

## Gate check
- 2026-10-19: Invoked to deliver the next iteration. Iteration 2 is closed and merged (#13, #15). No open PRs. Open issue: #14 (docs, raised by the PM and carried as an iteration-3 candidate). There is no iteration-3 log, so this is a fresh start.
- **Direction change:** Dirk updated the product strategy in commit 25f6735. The new aim is to teach solving techniques progressively and to reward learning and applying them, with solving as a secondary goal. The PM has to re-rank the candidates against this aim.
- GitHub Pages is still not enabled (API 404).

## Plan
1. The PM decides the iteration scope against the new strategy and writes the issue(s).
2. For each issue: gate check, branch `issue-N-<slug>`, a per-issue work log, then developer, then reviewer and tester in parallel, then lead check, then a PR merged with a merge commit (no squash).
3. Every rework round repeats the full browser walkthrough. Reviews trace data from creation to use. README claims are checked against behaviour sentence by sentence (iteration 2, lesson 1).
4. The PM does user acceptance and decides when the iteration is done.

## Conventions
- Commits and PRs: `[<agent>][session 6ec914a0] <message> (#N)`. Each agent adds a co-author trailer naming its own model and version.
- The iteration logs are edited in the worktree scratchpad/wt-iteration-3.

## Progress
- Iteration branch and this log created.
