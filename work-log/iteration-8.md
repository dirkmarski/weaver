# Work Log: Iteration 8 (lead)

- Lead: weaver-agents (lead agent, Claude Opus 5.5), session `46a62a2f-31a7-4db9-8c77-8e3d5044bf18`
- Run type: "Deliver the next iteration"
- Iteration branch: `iteration-8` (holds the iteration work logs and is merged by PR at the end)
- Product manager work log: `work-log/iteration-8-product.md`
- The iteration logs are edited in the worktree `<session scratchpad>/wt-iteration-8`.
- Session scratchpad: /private/tmp/claude-502/-Users-dirk-Code-weaver-team/46a62a2f-31a7-4db9-8c77-8e3d5044bf18/scratchpad

## Gate check
- 2026-10-20: Invoked to deliver the next iteration. Iteration 7 is closed and merged (#30, #31, #34). No open issues or PRs. There is no iteration-8 log, so this is a fresh start (not a resume).
- New since iteration 7 (Dirk):
  - daa3c5a, a governance/LOG.md entry titled "Log that testing grows out of proportion to the product". The lead still does not read LOG.md, and only the commit title is used.
  - 6807c23, "Add test strategy": `governance/context/test-strategy.md`. Testing is planned like development, weighed for pros and cons and maintained. It is reasonable: golden path, edge cases and error conditions, **no brute-forcing across all values**. There are three levels. Developers do unit tests (developer.md), the tester tests the product (tester.md), and the PM does acceptance testing, "sufficient testing to accept the feature" (product-manager.md).
- Measured: tests are about 2,025 lines (tests/sudoku.test.js 1125, tests/frozen-sudoku-e81999c.js 752, tests/generator.test.js 121, tests/fixture.js 27), against about 912 lines of product code (sudoku.js 781, index.html 37, style.css 94). Iteration 7 used oracle sweeps of 230k to 4.1M checks and mutation sweeps of 33 mutants. These conflict with the new strategy.
- Decision (lead): the carried lessons on "the tester computes expected values independently" and "the reviewer mutation-checks every guard clause" are re-scoped to fit the strategy:
  - The tester designs a test plan (golden path, edge cases, error conditions) and runs targeted checks. There are no exhaustive or brute-force oracle sweeps.
  - The reviewer may do a few targeted mutation spot checks on risky logic, not sweeps.
  - The PM accepts on sufficient evidence (persona sessions plus a check of the acceptance criteria), with no multi-million-check oracles.
  - A test-suite right-sizing (for example removing the frozen oracle) is a PM scoping decision. The lead raises it with the PM as candidate tech debt.

## Plan
1. The PM decides the iteration scope (with the simulated users) and writes the issue(s). The PM is told about the test strategy.
2. For each issue: gate check, branch `issue-N-<slug>`, a per-issue work log, then developer (unit tests per strategy), then reviewer and tester in parallel (tester: a proportionate test plan), then lead check, then a PR merged with a merge commit (no squash).
3. The PM does acceptance and decides when the iteration is done.

## Conventions
- Commits and PRs: `[<agent>][session 46a62a2f-31a7-4db9-8c77-8e3d5044bf18] <message> (#N)`. Each agent adds a co-author trailer naming its own model and version.
- No agent reads governance/LOG.md.

## Progress
- Iteration branch, worktree and this log created. PM launched to decide the scope.
- PM (Claude Opus 5.5) scoped three issues, to be delivered in sequence: #35 right-size the test suite (first; it removes the frozen oracle before hintFor changes), #36 Hint teaches pointing (not counted yet), #37 a new level Tricky (singles plus pointing). Gate check: all OPEN, by weaver-agents, labelled enhancement. PASS.
- #35 started: branch issue-35-right-size-tests, developer round 1.
- #35: developer round 1. Lead check passed. Review APPROVE (nits N1-N3, folded into #36). Test PASS. PR #38 **PM ACCEPTED**, no conditions. Merged with a merge commit (4c3e30b). Tests 128 -> 123, ~14.9 s -> ~0.22 s, test lines 2025 -> 1041.
- #36: PM clarification (the forms are mutually exclusive). Developer round 1. Lead check passed. Review APPROVE (S1: the digit order was unpinned). Test PASS (4 seeds, 375 px).
  - Round 2 (test, comment and README only) got a proportionate re-review and re-test. This deliberately re-scopes the iteration-7 "full re-run every round" lesson to fit the test strategy.
  - PR #39 **PM ACCEPTED**, no conditions; personas could explain pointing in their own words. Merged (12f4a63).
  - The uncounted "Well done!" was noticed by all personas. Counting pointing is PM candidate 1 for iteration 9.
- #37: developer round 1. Lead check passed. Review APPROVE with S1 (the mutant "Hard beyond back to 'singles'" survived, because the Hard test seeds never exercised it). Test PASS (an independent solver check; Hint followed to the end on Tricky seeds 1-4).
  - Round 2 (tests and README only) moved Hard to test seeds where the mutant is caught. The lead re-ran the mutant: 2 tests fail. The proportionate re-review gave APPROVE and the re-test PASS.
  - PR #40 **PM ACCEPTED**, no conditions (personas B and C: "the next step after Medium"; both explained pointing). Merged (30cf3ba). #37 closed.
- main after the three merges: `node --test` 137/137 in about 0.6 s. Individual commits are kept (merge commits 4c3e30b, 12f4a63, 30cf3ba).
- The PM confirmed that iteration 8 is complete from the product side.

## Outcome and lessons
- Delivered:
  - #35, test suite right-sized: the frozen oracle and the sweeps were removed. Tests 2025 -> 1041 lines and ~14.9 s -> ~0.22 s, with a rule -> test mapping. 25 mutation spot checks across the developer and reviewer were all caught.
  - #36, Hint teaches pointing when there is no single (two clicks, naked and hidden forms, an uncounted "Well done!", a new "none" text). New pure exports findPointing and hintMarks; the hint marking is now unit-tested, which closes the iteration-7 carry-forward.
  - #37, new level Tricky (singles plus pointing), and Hard now needs more than pointing. Following Hint always solves a Tricky puzzle.
- Lesson 1 (test strategy): applying Dirk's strategy worked. Each level kept to its role. Developers wrote targeted unit tests. Testers wrote a plan and ran real-page checks on a few fixed seeds, with small independent oracles on 4-5 seeds only. Reviewers ran 6-13 targeted mutation spot checks. The PM accepted with criteria, a play-through and personas, with no multi-million-check oracles. The suite ends at 137 tests and about 0.6 s, against 128 tests and about 15 s at the start.
- Lesson 2: targeted mutation spot checks still find real gaps without sweeps: #36 S1 (digit order unpinned) and #37 S1 (a rule unguarded by the chosen seeds). A seeded generator test only guards a rule if one of its seeds would actually break under the mutant. Choose the seeds on purpose.
- Lesson 3: rework re-checks are scaled to the change. Rounds that touch only tests, comments or the README get a delta re-review (with the specific mutant re-run) and a suite plus smoke re-test. This replaces the iteration-7 rule "full re-run every round", which predates the strategy. Behaviour changes still get the full re-check.
- Lesson 4: one spec question went to the PM before development (#36: can both forms apply?). The answer, mutually exclusive by definition, removed a branch of code and tests.
- Lesson 5: delivering in sequence, and folding wording nits into the next issue on the same section, again avoided conflicts and avoided extra rounds (#35 nits went into #36, #36 N5 into #37).
- Lesson 6: the lead verified every PM hand-off on GitHub (head, comment) before merging. No discrepancies.
- Tech debt / carry-forwards:
  - test code is about 1.1x the product code (above the ~1x guide; the reviewer judged it justified).
  - findPointing on its own may return a step where a single already existed (documented; callers check singles first).
  - The tester's and PM's headless play tools live in the session scratchpad, not the repo.
- Concerns carried forward for Dirk:
  - Pointing is taught but not counted, and every persona noticed (5/5). It is PM candidate 1.
  - GitHub Pages is still not checked, and all user evidence is simulated.
- Next-iteration candidates (PM, ordered):
  1. Count pointing (own recognition, a tally line and definition, the finish text; plus the status-class testability carry-forward).
  2. A clearer pointing hint.
  3. More pointing practice on Tricky (two or more steps).
  4. Uncounted-entry feedback v2.
  5. Claiming, then pairs, each with a level.
  6. Smaller items (mobile 2x2 level buttons, a middle hint level, unit wording, progress).
