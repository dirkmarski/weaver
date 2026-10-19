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
- Developer (Claude Sonnet 5.5) delivered round 1 (9eba5d6, 6474e31). Lead check passed: E2 is exact, and the grid used is the one from before the entry on both the keydown and paste paths.
  - Review: APPROVE with S1 (the filled-cell rule was not pinned by a test; the mutation survived), N1 (`bitCount`) and N2 (a README count sentence was not literally true on its own).
  - Test: PASS (8,848 checks, independent oracle on all levels).
- The lead chose to rework before PM acceptance (S1, N1, N2). Round 2 (a89675a): review APPROVE with no findings and all mutations caught; full re-test on new seeds PASS (8,958 checks, 0 console errors).
- PR #23: **PM ACCEPTED**, with no conditions, backed by the PM's own oracle (620,841 classification checks, 0 mismatches) and hand checks.
- Merged with a merge commit (051663c), individual commits kept. #22 closed. main: `node --test` 100/100.
- Iteration 5 is complete, as confirmed by the PM.

## Outcome and lessons
- Delivered: the first reward for applying techniques. Entering a naked or hidden single on your own now says so ("Well spotted! ..."), naming the unit for a hidden single. A per-puzzle tally counts each technique on your own and with a hint, once per cell. The hint-aided "Well done!" is unchanged. All logic is pure and unit tested.
- Lesson 1: the reviewer's mutation sweep went beyond the ordering rules (filled cell, once-per-cell, empty-before). It found a guard that no test covered, although the code was correct. Keep asking for mutation checks on every guard clause, not just the ordering rules.
- Lesson 2: the developer's N1 refactor would have been wrong without the existing tests (`usedMask` sets bit 0 for empty cells). Small "nit" refactors still need the full gates, and they got them.
- Lesson 3: as in iteration 4, holding the rework until both review and test had reported kept it to a single round. Delivery went from the issue to the merge with no blocking findings.
- Lesson 4: Dirk's governance-log read restriction was passed to every agent, and every agent confirmed it did not read the file.
- Carried-forward concern for Dirk: GitHub Pages is still not enabled. That makes five iterations of teaching and reward assumptions judged only by the PM. The lead cannot enable it (admin rights, outside the team's remit).
- Next-iteration candidates (PM, not yet decided): progress saved across puzzles with a per-technique "learned" state, the next technique tier (pointing pairs, then naked pairs), a stable status-line height (more visible now that the tally sits below it), a technique explainer, and Pages.
