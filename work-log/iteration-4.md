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
- PM (Claude Opus 5.5) decided the scope: one issue, #19 "Teach the second technique: hidden singles in the Hint button" (PM log 89db64b).
  - It reuses the #16 flow: naked first, then hidden (box, then row, then column), a unit-only tint, step-2 marks on the D cells, and a reward.
  - The PM prototyped it: hints alone solved 40/40 Medium puzzles.
- PM questions and the lead's answers:
  1. Pages is still 404 and needs admin rights. Carried forward as a concern for Dirk. The lead cannot enable it: the charter puts repository settings outside the team's remit, and the token belongs to weaver-agents.
  2. Learning progress for iteration 5: this is the PM's call. The lead does not steer it, and has no objection.
  3. The update to the "no naked single" test is accepted as AC9 requires. The developer and reviewer are told it is not a regression.
- #19 passes the gate check. Branch `issue-19-hidden-single`, work log created, developer launched.
- Developer (Claude Sonnet 5.5) delivered round 1 (4a7aa93). Lead check passed.
  - Review: CHANGES REQUESTED, nothing blocking. S1: the ascending-digit order was untested (a descending mutation survived all tests). S2: a README sentence was not literally true.
  - Test: PASS (about 17k checks, 10 Medium hint-only solves).
- The lead chose to rework before PM acceptance (S1, S2 and two nits). Round 2 (1b9418d): review APPROVE with the mutation check confirmed, full re-test PASS (17,145 checks, 0 console errors).
- PR #20: **PM ACCEPTED**, backed by the PM's own brute-force oracle and hand checks.
- Merged with a merge commit (3c2c79f), individual commits kept. #19 closed. main: `node --test` 88/88.
- Iteration 4 is complete, as confirmed by the PM.

## Outcome and lessons
- Delivered: the second taught technique. Hint now teaches hidden singles after naked singles, with a unit-only tint, step-2 marks on the digit, and a reward. Medium can be finished by a learner using hints alone. The shared unit/peer arithmetic was refactored (#16 N3 closed). Generated puzzles are unchanged.
- Lesson 1: the reviewer used a mutation check (flipping the digit order) to find an ordering rule that no test covered. The randomized oracle test could not catch it: the case did not occur in 20,000 random grids. For deterministic tie-break rules, ask the reviewer to mutation-check each one.
- Lesson 2: three independent oracles agreed on the selection logic (the developer's cross-check, the tester's solver and the PM's brute force). That gave high confidence for logic-heavy teaching features. Keep requiring the tester to compute expected values independently.
- Lesson 3: holding the rework until both review and test had reported kept it to a single round.
- Lesson 4: the new fixed `WEAVER_SESSION_ID` was used in full in every commit, PR and comment this iteration.
- Carried-forward concern for Dirk: GitHub Pages is still not enabled (404). That makes four iterations of teaching assumptions judged only by the PM. The lead cannot enable it (admin rights, outside the team's remit).
- Next-iteration candidates (PM, not yet decided): learning rewards and progress (leading), rewarding unaided application, a technique explainer, the next technique tier (so Hard can be learned), marking only the blocking digits, a fixed status-line height, and Pages.
