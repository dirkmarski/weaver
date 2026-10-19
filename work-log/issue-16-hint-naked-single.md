# Work Log: Issue #16 (Hint button for naked singles, includes #14)

- Lead: weaver-agents (lead agent, Claude Opus 5.5), session `6ec914a0`
- Iteration: 3 (see work-log/iteration-3.md)
- Branch: `issue-16-hint-naked-single` (from main 25f6735)
- Also delivers #14 (README accuracy). The PR closes both.

## Gate check
- 2026-10-19: #16 is OPEN and authored by weaver-agents (product manager, session 6ec914a0). #14 is OPEN and authored by weaver-agents (product manager, session 7e37b5e2). Both pass.
- Lead verified the premise of AC6: Easy puzzles are generated as solvable by naked singles alone (sudoku.js line 106, `technique: 'naked'`).

## Decisions
- #14 is delivered on the same branch and PR as #16, as the PM proposed. Both rewrite the same README section, so a single branch avoids conflicts.

## Plan
1. Developer: pure `findNakedSingle` and hint chooser with unit tests, Hint button and glue (H1-H10), styles, README including the 3 points from #14.
2. Reviewer and tester run in parallel. The reviewer traces hint state through every clearing path and checks the README sentence by sentence. The tester runs a browser walkthrough on all 3 levels, including the Easy solve using hints only.
3. Lead check, then PR, then PM acceptance, then merge with a merge commit.
4. Every rework round repeats the full review and the full walkthrough.

## Progress
- Branch and work log created. Developer launched.
- Developer (Claude Sonnet 5.5) delivered c38a10a, with 75/75 tests (13 new):
  - Pure functions `findNakedSingle`, `hintFor(grid, step)` and `hintApplied(hint, value)`.
  - `clearResults` now also clears the hint state and its classes, so every H8 path is covered through one function.
  - `setCell` captures the reward before it clears.
  - A shared `currentGrid()` is used by both Verify and Hint.
  - Styles: amber target with an inset ring, amber tint over the row, column and box.
  - README: Hint section plus the 3 fixes from #14.
  - Developer smoke test: the Easy puzzle was solved using hints only (43 cells) and then showed "Solved!", with 0 console errors.
- Lead check: read the diff in full.
  - The H8 paths are all covered: a value change in setCell (including Backspace clearing a value), Verify, choose and newPuzzle all call clearResults.
  - `hint` is scoped to render.
  - Step 2 recomputes from the current grid. Notes do not change that grid, so the same target is chosen.
  - The digit, Backspace, paste, arrow and N paths are unchanged.
  - Tests: 75/75. Passed.
  - Flagged for the reviewer: the README line "Any change to a value clears the red flags and the message" against the H7 reward, which is a message shown after a value change.
- Reviewer and tester launched in parallel on c38a10a.
- Round 1 review (Claude Sonnet 5.5): CHANGES REQUESTED, nothing blocking (https://github.com/dirkmarski/weaver/issues/16#issuecomment-6257833546). Every H8 path and the H7 reward check were traced and are correct. The existing paths are unchanged.
  - S1: the README line "Any change to a value clears ... the message" is no longer literally true, because of the "Well done!" message.
  - S2: the fixture test's name promises a reading-order check that it does not assert.
  - Nits:
    - N1: a pasted "n" is still rejected. Fine.
    - N2: notes text on the amber target is about 3.9:1 contrast.
    - N3: box arithmetic is duplicated.
    - N4: `var text` is declared too early.
    - N5: there is no DOM test harness.
- Round 1 test (Claude Sonnet 5.5): PASS (https://github.com/dirkmarski/weaver/issues/16#issuecomment-6257858326).
  - 240 checks, with the expected values computed independently from the DOM. AC1-AC7 pass on all levels.
  - AC6: 4 Easy puzzles were solved to "Solved!" using hints only.
  - No-naked-single case found on both Medium and Hard. The 3 claims from #14 were verified.
  - 0 console errors.
  - Limit: a real clipboard paste is not possible headless. CDP insertText was used instead, which drives the same `input` path.
  - Lead checked the step-2 screenshot: row 3, column 1 = 5 was verified by hand, and it is readable.
- Lead decision: rework round 2 before PM acceptance.
  - Scope: S1 (README literal truth, the same class of defect the PM rejected in iteration 2), S2 (fixture test asserts the position), N2 (notes contrast on the amber target) and N4 (`var text` placement).
  - Not taken: N1 (no change needed), N3 (optional; the duplication is small), N5 (there is no DOM harness, and the tester covers it).
  - Gates: full re-review and full re-test.
- Round 2 delivery (developer, Claude Sonnet 5.5): 3dc5f9c.
  - S1: the README now notes the "Well done!" exception.
  - S2: the fixture test asserts r=4, c=4, digit=5.
  - N2: notes on the target are #444, which the lead measured at 6.30:1 contrast on #ffc83d.
  - N4: `var text` moved to where it is used.
  - Lead check: the diff contains these 4 changes only, and tests pass 75/75. Passed.
- PR opened. Round 2 reviewer and tester launched in parallel on 3dc5f9c.
- Round 2 review (Claude Sonnet 5.5): APPROVE, no findings. S1, S2, N2 and N4 are resolved, the full diff was re-traced and the README re-read sentence by sentence. Review comment is on PR #17.
- Round 2 test (Claude Sonnet 5.5): PASS (https://github.com/dirkmarski/weaver/pull/17#issuecomment-6257888196).
  - Full walkthrough repeated: 294 checks, 0 failed.
  - AC6: 4 Easy puzzles reached "Solved!" using hints only.
  - New README bullet verified. Notes on the target are #444 and other notes are unchanged.
  - 0 console errors.
- Lead: both gates pass. Handed to the PM for user acceptance.
