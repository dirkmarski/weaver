# Work Log: Issue #25 Announce a finished puzzle automatically

- Lead: weaver-agents (Claude Opus 5.5), session `f54d361a-6d69-41fd-923a-045d29fc9367`
- Branch: `issue-25-completion-message` (worktree scratchpad/wt-25)
- Iteration: 6 (see work-log/iteration-6.md)

## Gate check
- 2026-10-19: #25 is OPEN, written by weaver-agents (PM). Pass.

## Plan
Developer, then reviewer and tester in parallel, then lead check, then PR, then PM acceptance, then a merge commit.

## Progress
- Branch and log created. Developer launched.

## Developer round 1
Session `f54d361a-6d69-41fd-923a-045d29fc9367`, model Claude Sonnet 5.5. I did not read governance/LOG.md.

### What was done
- `sudoku.js`: added pure `completionFor(grid, tally)` (exported in `module.exports` and `window.Sudoku`). Order of checks: any 0 cell gives `null`; then `findConflicts` gives `conflict`; otherwise `solved` with O = naked.own + hidden.own and H = naked.hint + hidden.hint. No mutation.
- UI: in `setCell`, inside the existing `if (changed)` block, after the credit has been applied to `tally`, `completionFor(currentGrid(), tally)` is evaluated when the new cell value is a digit. `solved` sets class `ok`, `conflict` sets class `fail` (no cell flags); the text replaces the reward text. `null` leaves today's behaviour.
- Paths: both the keydown path and the paste/drop (`input` event) path reach `setCell` through `enter`. The input handler restores the old value before calling `enter`, but `setCell` writes `inp.value = cell.value` before the check, so `currentGrid()` is the grid after the entry on both paths (the credit still uses the grid before the entry, as in iteration 5, because it is computed before the write). Notes, clearing, rejected input, Verify, Hint and arrows never reach the check: notes and clears have `cell.value === ''`, rejected input is `changed === false`, the rest do not call `setCell`.
- README: "Filling the grid" bullet, qualifiers on the sentences that said the message is blank or shows Well done/Well spotted, "no live checking" reworded, Files list gets `completionFor`.

### Tests
- `node --test`: 107 tests, all pass (100 before, 7 new `completionFor` tests): null for an empty cell at each of the 81 positions and for an empty puzzle, null wins over a conflict, exact solved texts (0/0, mixed naked 3/2 + hidden 1/4 = 4 and 6, each of the four counters separately, 40/0, 26/28), conflict exact text for row and column clashes with two tallies, no mutation, and that the final single counts only if the tally is taken after `creditEntry`.
- Mutation spot checks (each made a test fail): loop bounds r<8 and c<8, `continue` instead of `return null`, conflict check disabled, `own` missing the hidden count, `hint` missing the naked count.

### Headless Chrome check (E2/E3/E4 in the real page)
Script: scratchpad `wt25-check.js` (not committed; Chrome via DevTools protocol, real key events and `Input.insertText`). Solves the shown Easy puzzle in the page, types every cell, and for the last cell uses a key press (run 1) or a single-digit paste (run 2). Results, all as expected, no page errors:
- Last entry typed: tally before 33 + 8, after 34 + 8, message `Puzzle solved! Singles applied: 42 on your own, 0 with a hint.` class `ok` (so the last entry is counted first). Paste: 29 + 7 before, 30 + 7 after, message with 37.
- Before the last entry there is no completion message.
- Verify afterwards: `Solved! Every row, column and box is correct.`; Hint: `Every cell is filled. Click Verify to check the grid.`
- Overwriting the last cell with a wrong digit: red `Every cell is filled, but some numbers break the rules. Click Verify to see which.`, zero `.conflict` cells; Verify then shows `Mistakes found: the red numbers break the rules.` with red cells.
- Clearing the cell gives a blank message; a note on the empty cell (Notes on) gives a blank message; re-entering the right digit shows solved again; paste overwrite with a wrong digit shows the conflict text; rejected input (`x`) leaves the message.

### Assumptions and notes
- "Value change" is taken as `changed` in `setCell` with a non-empty new value. Overwriting with the same digit is not a change, so it does not re-announce.
- Entering a hinted digit that fills the last cell shows the solved/conflict text instead of "Well done!", per E3.

## Lead check, round 1 (2026-10-19)
- Developer (Claude Sonnet 5.5) round 1: fd8bd7c, 47be363, a3f6c1b. `node --test` 107/107.
- Code read: the completion check is in `setCell` inside `if (changed)`, after `tally = credit.tally`, with `currentGrid()` read after `inp.value` is written, and only when `cell.value` is non-empty. This meets E2 on both the keydown and paste paths. The credit still uses the grid from before the write.
- Minor: `completionFor` was inserted between the comment "The heading and the two lines shown for a tally." and `tallyLines`, so that comment now sits above the wrong function. Passed to the reviewer.
- Passed. Reviewer and tester launched in parallel.

## Review and test, round 1 (2026-10-19)
- Review (Claude Sonnet 5.5): **APPROVE**. Mutation sweep: every pure guard was killed by the unit tests, and the DOM ordering was killed by the headless script. Survivors: the `cell.value ?` guard (an equivalent mutant, redundant but harmless) and the check moved outside `if (changed)` (DOM-only). Findings:
  - S1: document a headless non-trigger check for retyping the same digit on a full grid after Verify, and for a notes toggle on a filled cell.
  - N1: the misplaced tallyLines comment (sudoku.js:304).
  - N2: the README "Well done!" sentence and the tally "shown again" sentence lack the fill-the-grid qualifier.
  - N3: the Files list test description does not mention the completion tests.
- Test (Claude Sonnet 5.5): **PASS**. Independent oracle: 72,736 checks, 0 mismatches. Browser: 50 checks on Medium 101/303 and Hard 202/404, including a hinted final entry and a paste final entry, with 0 console errors. Point (f) already shows no trigger for a notes toggle on a full grid or for retyping the identical digit. The same two README notes as N2 and N3.
- Lead decision: rework round 2 before PM acceptance for S1, N1, N2 and N3 (all small). The full review and full test are then repeated, as per the carried lessons.
