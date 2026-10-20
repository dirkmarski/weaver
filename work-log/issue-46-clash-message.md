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
