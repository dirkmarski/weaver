# Work Log — Iteration 2 (lead)

- Lead: weaver-agents (lead agent, Claude Opus 5.5), session `7e37b5e2`
- Run type: "Deliver the next iteration"
- Iteration branch: `iteration-2` (carries the iteration work logs; merged by PR at the end)
- Product manager work log: `work-log/iteration-2-product.md`

## Gate check
- 2026-10-19: Invoked to deliver the next iteration. Iteration 1 closed and merged (#10, #11). No open issues, no open PRs, no iteration-2 log. Fresh start.
- GitHub Pages still not enabled (API 404), so the PM's top candidate is still blocked.

## Plan
1. Product manager decides the iteration scope and writes the issue(s).
2. Per issue: gate check (open, authored by dirkmarski or weaver-agents), branch `issue-N-<slug>`, per-issue work log, developer → reviewer + tester in parallel → lead check → PR merged with merge commit (no squash).
3. Every rework round repeats the full browser walkthrough (iteration 1 lesson 1). Reviews trace data from creation to use (lesson 2).
4. Product manager does user acceptance and decides whether the iteration is done.

## Conventions
- Commits/PRs: `[<agent>][session 7e37b5e2] <message> (#N)`; each agent adds a co-author trailer naming its own model and version.
- Iteration logs are edited in worktree scratchpad/wt-iteration-2.

## Progress
- Iteration branch and this log created.
- PM (Claude Opus 5.5) decided the scope: one issue, #12 "Keyboard play: arrow-key movement and N shortcut for Notes" (PM log commit 3ba01fa). It combines next-iteration candidates 2 and 3. Pages is still blocked, and saving progress is the PM's top candidate for iteration 3.
- PM concern: the change touches the same keydown wiring as iteration 1's D1 regression, so the reviewer must trace each key and the tester must repeat the full walkthrough after every rework.
- #12 gate check passed (OPEN, authored by weaver-agents). Branch `issue-12-keyboard-play` and work log created. Developer launched.
- #12 delivered on PR #13 in two rounds (details in work-log/issue-12-keyboard-play.md):
  - Round 1 (4813e5a): lead check passed, review APPROVE (nits), test PASS. **PM NOT ACCEPTED**:
    - R1: holding N flipped Notes repeatedly. This was the open product question the lead raised.
    - R2: the README said arrows go to the "nearest empty cell". Both gates missed it.
  - Round 2 (883ccb3): review APPROVE, test PASS (held-N with a negative control, held arrows, player-value targets). **PM ACCEPTED.**
- The PM raised #14 (docs-only README accuracy fixes found by the round-2 audit). It is not part of iteration 2 and is a candidate for iteration 3.
- PR #13 merged with a merge commit (a6fe459), individual commits kept; #12 closed. main: `node --test` 62/62.
- Iteration 2 complete, as confirmed by the PM.

## Outcome and lessons
- Delivered: keyboard play (#12), i.e. arrow-key movement skipping givens and the N shortcut for Notes.
- Lesson 1: the PM gate caught a documentation inaccuracy that review and test both passed. Gates now check README claims sentence by sentence against behaviour, which is how the round-2 audit found the three older inaccuracies (#14).
- Lesson 2: raising open behavioural questions (held-key repeat) to the PM before acceptance worked. A product decision is cheaper than a guess.
- Lesson 3: a negative control (running the test against the pre-fix commit) proves a new test can detect the defect. Keep it for regression fixes.
- Process note: `gh pr merge` failed once with "not mergeable" right after a push because GitHub was still computing mergeability. A retry succeeded.
- Carried-forward concern for Dirk: GitHub Pages is still not enabled (it needs admin), so there is no route to real users for early testing.
