# Work Log — Issue #3: Sudoku completion

- Issue: https://github.com/dirkmarski/weaver/issues/3
- Lead: weaver-agents (lead agent), session `9f58280f`
- Branch: `issue-3-sudoku-completion`

## Gate check
- 2026-10-16: Issue #3 is OPEN and authored by Dirk Marski (`dirkmarski`). There was no prior branch, PR or work log for #3, so this is a fresh start. Work proceeds.

## Requirements (from issue)
- R1: The page loads with an easy sudoku, i.e. some cells are empty.
- R2: Pre-filled numbers cannot be changed.
- R3: The user can enter digits themselves.
- R4: A "Verify" button checks the grid.
  - If the grid is complete, it checks the solution is correct.
  - If the grid is incomplete, it checks that the current numbers break no rule.
- R5: A digit in the wrong place is flagged red.
- R6: Solved means filled in correctly by the rules. If a puzzle has two solutions, both are accepted.
- Out of scope: smart hints or tips, and on-the-fly verification and feedback.

## Decisions
- D1: Keep the dependency-free static site from #1 (`index.html`, `style.css`, `sudoku.js`, `node --test`). The page becomes the playable puzzle. The completed-grid display from #1 is superseded, but the 3x3 box shading is kept.
- D2: Puzzle: a hard-coded easy puzzle. It is the widely published Wikipedia example: 30 givens, solvable by singles only. Its unique solution is the `SOLUTION` grid already in `sudoku.js`. There is no generator (MVP).
- D3: Verification follows the rules only. It never compares against a stored solution, which satisfies R6. `SOLUTION` is kept only as a test fixture and reference.
- D4: "Wrong place" (R5) means a digit that conflicts with another digit in the same row, column or 3x3 box.
  - Only user-entered digits are flagged red. Givens are fixed, so in a conflict between a given and a user digit, only the user digit is wrong.
  - When two user digits conflict, both are flagged, because either could be the wrong one.
- D5: There is no on-the-fly feedback (out of scope). Red flags and the status message appear only when the user clicks Verify. Any edit clears all flags and the status, so stale results never show.
- D6: Status messages:
  - complete and valid: solved;
  - incomplete with no conflicts: no mistakes so far, with the count of empty cells;
  - any conflicts: mistakes found.
- D7: Input: each editable cell accepts one digit, 1–9. Anything else is rejected, and Backspace or Delete clears the cell. Givens are not editable, and they look visibly different from user digits.
- D8: Commit and PR convention: `[<agent>][session 9f58280f] <message> (#3)`. Each agent uses the co-author trailer for its own model and version, from its own harness guidance.
- D9: Desktop browser is the target, as in #1. Mobile layout is not in scope.

## Assumptions
- A1: "Easy" means a puzzle solvable with basic techniques. 30 givens, solvable by naked and hidden singles, qualifies.
- A2: The issue does not ask for a "new game" or "reset" control, so none is built.

## Progress
- Developer agent (Claude Sonnet 5.5, session 9f58280f) delivered commit 7fb2280:
  - pure logic: `PUZZLE`, `findConflicts`, `verify`, `sanitizeDigit`;
  - input-based UI with a Verify button;
  - 22/22 tests, including a digit-permuted solution accepted as solved, which proves the check is rules-based;
  - README updated.
  - It did not test real typing or paste, only synthetic events.
- Lead check: `node --test` passes 22/22, and the code matches D2–D7.
  - Lead-spotted suspect (L1): the `keydown` path sets `inp.value` without updating `dataset.prev`, so a rejected paste after typing restores a stale value. I am holding this to see whether the reviewer and tester find it independently.
- Lead opened PR #4: https://github.com/dirkmarski/weaver/pull/4. The reviewer and tester run in parallel on 7fb2280.
- Reviewer agent (Claude Sonnet 5.5, session 9f58280f) verdict: REQUEST CHANGES.
  - Independently verified:
    - The puzzle is the published Wikipedia puzzle, has a unique solution (by backtracking) and is solvable by singles only.
    - The check is rules-only.
    - Only user cells are flagged.
    - Givens cannot be edited.
    - The conflict tests are isolated.
  - Triage:
    - B1 (blocking): stale `dataset.prev`, the same bug as L1, confirmed independently. Fix.
    - S2: `maxLength=1` truncates a pasted "12" to "1", which is then accepted. This contradicts D7 and the README. Fix by dropping `maxLength` and relying on `sanitizeDigit`.
    - S3: no tests of the input layer. Fix by extracting the cell-input state transition into a pure function, with a unit regression test for B1. Browser-level coverage comes from the tester.
    - N4: guard against an undefined `e.key`. Fix, cheap.
    - N5: tests for two user digits clashing and for a cell reported once across several groups. Fix, cheap.
    - N6: the `window.isValidSolution` global left over from #1. Won't fix, harmless.
    - N7: arrow-key navigation. Won't fix, not required by the issue.
  - Fixes are held until the tester reports, so they go out in one batch.
- Tester agent (Claude Sonnet 5.5, session 9f58280f) verdict: FAIL on paste handling only. Tested in headless Chrome over file:// with real CDP input events.
  - PASS:
    - load: 30 givens, 51 inputs, 0 errors;
    - givens immutable and not in the tab order;
    - typing rules;
    - every Verify scenario: untouched, partial, row/column/box conflicts, two user digits in conflict, solved, wrong complete grid;
    - clearing on edit, with no live checking;
    - rules-only acceptance of other valid grids;
    - 22/22 unit tests;
    - performance: load about 41 ms, Verify under 1 ms.
  - D-1 is the same bug as L1 and B1, confirmed by a real repro: type 4, select it, paste "x", and the cell empties.
  - D-2 is the same as S2: a pasted "12" becomes "1".
  - Concern: red on box 0 (pink) has lower contrast but is still visible. Decision: ask the developer to make the conflict style more distinct, e.g. a red outline or border, so it does not depend on the box shade. This is cheap and supports R5.
  - Lead could not view the tester's screenshots: the read outside the working directories was denied. I did not work around this. I will take my own screenshot in the session scratchpad at the final check.
- Rework round 1 sent to the developer: B1/D-1, S2/D-2, S3, N4, N5, and the conflict-contrast tweak.
