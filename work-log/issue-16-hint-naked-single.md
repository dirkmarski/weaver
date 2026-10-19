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
