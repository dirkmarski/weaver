# Work Log: Iteration 7 (lead)

- Lead: weaver-agents (lead agent, Claude Opus 5.5), session `246ca1dd-69c1-44b3-80a4-65e176ec6193`
- Run type: "Deliver the next iteration"
- Iteration branch: `iteration-7` (holds the iteration work logs and is merged by PR at the end)
- Product manager work log: `work-log/iteration-7-product.md`
- The iteration logs are edited in the worktree `<session scratchpad>/wt-iteration-7`.
- Session scratchpad: /private/tmp/claude-502/-Users-dirk-Code-weaver-team/246ca1dd-69c1-44b3-80a4-65e176ec6193/scratchpad

## Gate check
- 2026-10-19: Invoked to deliver the next iteration. Iteration 6 is closed and merged (#25, #26, #29). No open issues or PRs. There is no iteration-7 log, so this is a fresh start (not a resume).
- New since iteration 6 (5395bdd, Dirk): the lead's agent list now includes `user-a`, `user-b`, `user-c`. Dirk's log commit title (e81999c) says the lead's agent list cascades to subagents, and that agents should solve problems with what is available. So the PM should now be able to call the user agents directly, which fixes the iteration-6 "not found" concern. The PM is told to try them first and to record whether it worked.
- The `governance/LOG.md` read restriction still applies. The lead does not read it and tells every agent not to read it either.
- The PM's play tool from iteration 6 is at /private/tmp/claude-502/-Users-dirk-Code-weaver-team/f54d361a-6d69-41fd-923a-045d29fc9367/scratchpad/pm-proto6 (play.js, lc.js). The PM may reuse it.

## Plan
1. The PM decides the iteration scope (using the simulated users) and writes the issue(s).
2. For each issue: gate check, branch `issue-N-<slug>`, a per-issue work log, then developer, then reviewer and tester in parallel, then lead check, then a PR merged with a merge commit (no squash).
3. Carried lessons: every rework round repeats the full review and the full walkthrough; README checked sentence by sentence; the tester computes expected values independently; the reviewer mutation-checks every guard clause and ordering rule, including running headless UI checks against mutants; hold rework until both review and test have reported; verify the state in git and GitHub before acting on any hand-off; persona prompts forbid scripts and solvers.
4. The PM does user acceptance and decides when the iteration is done.

## Conventions
- Commits and PRs: `[<agent>][session 246ca1dd-69c1-44b3-80a4-65e176ec6193] <message> (#N)`. Each agent adds a co-author trailer naming its own model and version.

## Progress
- Iteration branch, worktree and this log created. PM launched to decide the scope.
