# Work Log: Issue #46 (say why an entry is not counted when it clashes)

- Issue: https://github.com/dirkmarski/weaver/issues/46 (iteration 10, second of two, after #45)
- Lead: weaver-agents (lead agent, Claude Opus 5.5), session `0245eb9f-91d7-4bfe-b523-bbf5b80a2438`
- Branch: `issue-46-clash-message` (from main 9b5779d, after the #45 merge), worktree <session scratchpad>/wt-46

## Gate check
- 2026-10-20: #46 is OPEN, author weaver-agents (PM), label enhancement. PASS. It is delivered after #45 as planned (#45 merged as 9b5779d).

## Lead notes before development
- Small change: one text branch in the "not counted" path (sudoku.js about lines 410-417), the README "not counted" section and API sentence, and one unit test plus precedence cases.
- Precedence matters: (1) the grid was already broken before the entry -> today's text (b), even if the entry also clashes; (2) the entry creates a clash -> the new text, with U the first of row, column, box that holds D; (3) otherwise today's text (a). The "Filling the grid" message (last cell) wins as today.
- Reuse the existing unit/peer helpers; no new search.
- Review and test are proportionate: one round, with reviewer mutants on precedence and unit order, and the tester on the pinned seed 1 entries on the real page.

## Progress
- Branch and log created; developer round 1 launched.

## Developer round 1
- Changes: `notCounted` in `sudoku.js` now checks, after the already-broken-grid case (b), whether D is in the cell's row, column or box (loop over `CELL_UNITS[p]`/`UNITS`, naming `UNIT_NAMES[k]`; first hit wins), else text (a). `creditEntry`, `kind` ('notCounted'), tally, credited, "Filling the grid" and the hint path are untouched. README: the "not counted" section now lists (b), the new clash text with U and its order, then (a) (the "does not point out a clash" sentence is gone), plus the "Any change to a value..." paragraph and the `creditEntry` API sentence.
- Decisions: the cell itself is empty in the pre-entry grid, so scanning whole units is safe. Precedence is (b), then clash, then (a).
- Tests: `node --test` 143/143, about 0.59 s. New test `creditEntry (c)` replaces the old "(a): a digit already in..." test (whose texts changed): row, column, box, row-and-column names row, no-clash falls to (a), kind/tally/credited unchanged, clash into a broken grid gives (b). Two other tests had one expected text each changed (digit 1 in H_BOX cell (5,6) and digit 3 at (3,3), both now "row").
- Line counts (before -> after): sudoku.js 922 -> 929 (+7); tests/sudoku.test.js 1084 -> 1091 (+7).
- Rule -> test: new text and U order (row, column, box), row-and-column -> row: `creditEntry (c)`; (b) wins: same test, last assertion and the existing `creditEntry (b)`; (a) kept: `creditEntry (c)` digit 8 and existing (a) tests; neutral kind and no count change: `creditEntry (c)` and `statusClass` test.
- Mutants (all killed): reversed unit order (2 failing), (b) check removed (3), box skipped (1).
- Page (headless Chrome, seed 1 Tricky, fresh puzzle, harness `scratchpad/dev46/pg.js`): the three pinned entries give the exact pinned texts; status class '' (neutral); no `.conflict` cells; tally lines unchanged. With (3,1)=2 entered (grid now broken), entering 4 at (2,1) gives "Some numbers break the rules, so it is not counted. Click Verify to see which."

## Lead check round 1 (head c4b48f4)
- Developer: Claude Sonnet 5.5 per its trailer. Suite: 143/143, about 0.59 s. sudoku.js +7, tests +7.
- Diff read:
  - `notCounted` order is (b), then the clash text (loop over CELL_UNITS with UNIT_NAMES, no new search), then (a);
  - the entry cell is empty when judged, so it cannot match itself;
  - `kind`, tally and credit are untouched;
  - README "not counted" section reordered (b), clash, (a); the "does not point out a clash" sentence is removed; the "Any change to a value" paragraph and the creditEntry sentence are updated. They read true.
  - The old clash-as-(a) test was replaced; text (a) is still covered by "creditEntry (a): not a single".
- PASS, with L1 for the reviewer to confirm: no unit test has a digit in the column AND the box but not the row. A unit-order mutant [row, box, column] probably survives. The issue pins exactly that case (4 at row 2, column 1 on seed 1).
- Review and test round 1 launched in parallel on c4b48f4.

## Review round 1 (reviewer)
- (pending)

<!-- separator: keep the review and test sections apart -->

## Test round 1 (tester)
- Tester: Claude Sonnet 5.5. Head tested c4b48f4 (worktree at c84b726, log-only on top). I did not read governance/LOG.md.
- Plan: criterion 1 = three pinned texts on fresh seed 1 Tricky; criterion 2 = status class '', neutral computed colour, no `.conflict`/`aria-invalid`/red input, no hint classes or `data-d`, tally text and hidden state unchanged; criterion 3 = (a), (b) incl. self-clashing entry, overwrite, clear, Notes on, last cell, plus Verify still red. Optional: clash while a hint shows, and in the hinted cell.
- Tool: `scratchpad/ts46/run46.js` (`node run46.js`; reuses `scratchpad/ts45/lib.js`, headless Chrome, seeded Math.random; set `WT=` to the worktree). Screenshots `pinned_*.png` in `scratchpad/ts46/`.
- Results, all PASS (35 page checks, 0 failures):
  - Pinned 2@r2c1 (row), 4@r2c1 (column), 3,1=2 (box): text exact; no 'ok' class; colour rgb(29,29,31) same as fresh; no conflict/red/highlight; tally unchanged.
  - (a) legal non-technique (r1c2=3): today's text. (b): after Verify flagged (2,1)=2, entering (3,1)=2, which itself clashes, gives "...Some numbers break the rules, so it is not counted. Click Verify to see which."
  - Overwrite, clear and Notes on with a clashing digit: no message, no red.
  - Last cell (all other cells filled with the solution, then a clashing digit): "Every cell is filled, but some numbers break the rules. Click Verify to see which." not the clash text; Verify then flags red.
  - Hint showing: clash in another cell gives the clash text and clears the hint; clash in the hinted cell gives the clash text, not the reward, neutral, no highlight.
- Suite: `node --test` 143/143, about 0.64 s wall.
- Defects: none. Note: the unit-order mutant [row, box, column] (lead's L1) is covered on the page by the pinned 4@r2c1 check, not by a unit test.
