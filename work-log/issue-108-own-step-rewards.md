# #108 Own pointing and claiming rewards state every step

Issue: https://github.com/dirkmarski/weaver/issues/108. Branch `issue-108-own-step-rewards`.

## Lead
- Lead Claude Opus 5.5, session d2424c00-a6fb-45e6-86ab-53111ee2576f. Gate passed (open, PM-authored, it22 item 2). Fresh start: branch held only the PM spec 3a20022.
- Merged main (ac40aa5, #110 runner) into the branch: c746a63. Red run (AC1): specs 9 run, 5 pass, 4 fail; the 4 failures are exactly the 4 scenarios of `specs/rewards/own-pointing-claiming.feature`, each on `the message reads` (feature :23, :40, :57, :74), with actual = today's "..., so row R, column C is V." text. No undefined or ambiguous steps (every step text already exists in `spec-implementation/steps/own-singles.js`). Full suite 202 run, 198 pass, 4 fail, 0 skipped, 3.9 s. Output: session scratchpad `lead-108/red-specs.txt`, `red-full.txt`.
- Baseline ratio: product 1484 (sudoku.js 1285 + index.html 46 + style.css 153), tests/ 2374 (cap 1.6x = 2374.4). spec-implementation/ 303 lines (measured apart, PM D2/D5).
- Plan: developer changes the own pointing/claiming texts in `sudoku.js` (lines ~660-667; `classifyEntry` exposes form and unit from `singleAfterStep`), README texts, and adapts the 6 unit assertions of the old texts in `tests/sudoku.test.js` (+1 in page.test.js if it pins one); no new step file expected (no step text may be redefined). Removals listed with the covering scenario, mutant-confirmed by reviewer and tester. Then reviewer, then tester (independent red/green, mutants on `sudoku.js`, layout at 360x740 and 375x812 at the pointing-hidden position, >=8 px spare, button row fixed). Then lead check, PR with test summary report, PM acceptance with personas (gate mean >=4.0 over 12, no case <3.5).
- Rule for all agents: `specs/` is PM-only, never edited, not even in a worktree copy or temp copy.

## Developer
- Developer Claude Sonnet 5.5, session d2424c00-a6fb-45e6-86ab-53111ee2576f. Code commits 8df2a46 (change) and a6430cb (wrap 3 over-long test lines to the file's longest).
- `sudoku.js`: `classifyEntry` pointing/claiming results now carry `form` ('naked'|'hidden') and, for hidden, `unit` (kind) from `singleAfterStep`; `creditEntry` builds the two-sentence texts (naked: "so D cannot go in row R, column C. That leaves V as the only digit there."; hidden: "so D cannot go anywhere else in <line L | that box>. That leaves row R, column C as the only cell in <unit> where D fits."). Counts, colour, single and hinted texts unchanged. README lines 44 and 51 updated.
- Specs: 9 run, 9 pass (the 4 scenarios green). Full: 202 run, 202 pass, 0 fail, 0 skipped, 3.8 s. No change to spec-implementation/ (303 lines) or specs/.
- Ratio: product 1491 (sudoku.js 1292), tests/ 2376, 1.594x (cap 2385.6).
- Removed: tests/sudoku.test.js creditEntry own claiming test, old line 1395 (Tough seed 1 r1c5 = 7 own pointing text), covered by scenario "Own pointing, naked form". Adapted (not removed): old-text assertions at sudoku.test.js 1011, 1012, 1238, 1392, 1393 and page.test.js 293 (new texts); classifyEntry deepStrictEqual shapes at 1017, 1021, 1022, 1025, 1387-1388 gained `form`/`unit`.
- Not tested by me: layout at 360x740/375x812 (tester), persona rating (PM).

## Reviewer
- Reviewer Claude Sonnet 5.5, session d2424c00-a6fb-45e6-86ab-53111ee2576f. Head reviewed f60491b. Verdict: approve.
- Baseline at f60491b: `node --test` 202 run, 202 pass, 0 fail, 0 skipped.
1. (nit) sudoku.js:614 `if (found && res.unit)` is a second statement after the `found =` assignment; works (res is non-null whenever found is set) but could be one expression. No action needed.
2. (info) The `box` key of `cellUnit` (sudoku.js ~line 670) is reachable for pointing only; for claiming a box unit cannot occur (a box single after a claiming step is already a hidden single in the line, so classifyEntry returns hidden first). README says so and matches.
3. (info) classifyEntry callers: only creditEntry (sudoku.js:659) and tests; the added `form`/`unit` keys affect no other consumer. README lines 44 and 51 match the code texts; counts, colour, single and hinted texts untouched.
4. (info) Removal of old sudoku.test.js:1395 (Tough seed 1 r1c5 = 7): the spec grid for "Own pointing, naked form" is identical to generatePuzzle('tough', seededRng(1)); the scenario carries it. No other assertion removed: the other 13 `-` lines are the same assertions adapted to the new texts/shapes. No packing: added lines are at most 241 chars (file max 255), long texts wrapped with `+`.
5. Ratio: product 1491 (sudoku.js 1292 + index.html 46 + style.css 153), tests/ 2376, 1.594x (cap 2385.6).
Mutants (sudoku.js only, Python-applied, restored; diff non-empty each time):
| Mutant | Killed by |
|---|---|
| M1 naked/hidden branch swapped | all 4 scenarios, unit 1011, 1238, 1390ff, page g1 |
| M2 pointing hidden names "that box" | scenarios hidden-box, hidden-row(claiming text shared), unit 1011, 1238, 1390ff, page |
| M3 cellUnit row -> box name | scenario claiming hidden row, unit 1238 |
| M4 cellUnit column uses row number | unit 1390ff, page g1 (spec scenarios do not: unit row/box only) |
| M5 `form` dropped | naked scenarios, unit 1011, classifyEntry 1017ff and 1387ff, 1390ff |
| M6 `unit` not set | hidden scenarios, unit and page |
| M7 naked D = entered digit | both naked scenarios, unit 1011, 1390ff |
| M8 naked V = pointDigit | both naked scenarios, unit 1011, 1390ff |
| M9 hidden r/c swapped | both hidden scenarios, unit 1238, 1390ff, page |
| M10 box unit name uses swapped indices | hidden-box scenario only (sole guard of the box unit) |
| M11 claiming hidden names the line | claiming hidden scenario, unit 1390ff, page |
Paired removal mutants (own-pointing text; old tree b7c409b in a temp worktree, branch f60491b): T1 (pointing "Well spotted" -> "Well done") main killed by unit 1011/1216/1237/1389(1395) and the (red) specs; branch killed by pointing naked and hidden scenarios + unit 1011, 1238. T2 (row/column swapped in pointing tail; r1c5 is asymmetric, s1 r3c3 and s3 r5c5 are not): main killed by 1237 (r4c1) and 1395; branch killed by the naked scenarios (same grid and position) and the claiming unit test 1395 (b, r2c3). In both trees other tests kill it as well as the removed assertion, and on the branch the spec carries the same position: the removal is redundant.
Not tested: layout and screenshots (tester), persona ratings (PM), claiming-box-unit unreachability by exhaustive search (argued only), Chrome versions other than the local one.

## Tester
- Tester Claude Sonnet 5.5, session d2424c00-a6fb-45e6-86ab-53111ee2576f. Head tested d3f5622 (code f60491b). Verdict: pass. Scratch: session scratchpad `test-108/` (README.md there).
1. AC1/AC2: at b7c409b the specs run is 9 run, 5 pass, 4 fail (feature :23, :40, :57, :74, all `the message reads`, no undefined/ambiguous steps); full 202/198/4, skipped 0. At d3f5622 specs 9/9 and full 202/202, skipped 0, 3.8 s.
2. Oracle: the 4 spec positions on the real page (Tricky via the level button, seeded Math.random, real CDP mouse click plus key events; the cells filled beyond the generated puzzle entered the same way) give exactly the feature texts, class `ok`, tally line 1 on your own. Page generates Tricky and Tough identically for these seeds (grid 1 = tricky seed 1 = tough seed 1).
3. Mutants (sudoku.js only, restored, diff non-empty): naked text "only digit there" changed (killed by feature :23, :40 and unit tests); hidden pointing "that box" (feature :57, unit); box unit name wrong (feature :57 only); column unit uses row number (unit test creditEntry own claiming and page g1; no spec scenario covers the column unit); pointDigit replaced by digit (feature :23, :40, unit); naked cell row/column swapped (feature :23, :40, unit). One mutant survived and is equivalent (`res.form === 'naked'` -> `res.unit === undefined`: naked has no unit).
4. AC3 removal (old tests/sudoku.test.js:1395, Tough seed 1 r1c5 = 7): pointing-only row/column swap of the named cell is killed on b7c409b by that assertion (plus others) and on d3f5622 by the scenario "Own pointing, naked form" (feature :23) alone.
5. AC4: 360x740 pointing-hidden: #status bottom 715.5, 24.5 px spare, 7 lines, not clipped (scrollHeight = clientHeight = 147), button row 517.7 before and after; 375x812: bottom 730.6, 81.4 spare. Longest message is pointing-hidden (262 chars); others at 360x740: 673.5 / 694.5. Document scrolls (1064 > 740; tally below the fold, as the issue says) but scrollY stays 0 and no horizontal overflow.
6. Screenshots of the 4 positions at 375x812 saved in the scratch shots/ folder.
7. Spec grids for seeds 2 and 4 differ from the generated puzzle by 3, 2 and 8 cells (the "filled singles"), counts differ from the issue wording ("2 filled singles" for the 3-cell diff); the feature grids were used.
Not tested: personas (PM), touch input, other Chrome versions, the real (unpatched) random generation without seeding, mobile browsers other than Chrome emulation.

## Lead review
- Lead check at 8746be1 (code head f60491b): diff stat matches the developer's list (README, sudoku.js, tests/page.test.js, tests/sudoku.test.js); specs/ and spec-implementation/ diff empty; `git diff | grep '^-'` in tests: 1 removed assertion (old sudoku.test.js:1395), the rest adapted. Full suite 202/202, skipped 0, 3.9 s. Ratio tests/ 2376 / product 1491 = 1.594 (cap 2385.6). spec-implementation/ 303 (unchanged).
- Re-ran tester's layout.js and oracle.js (start 17:49:18, shots rewritten 17:49:20): LAYOUT PASS (360x740 pointing-hidden: bottom 715.5, 24.5 px spare; 375x812: 81.4 px; button row fixed), ORACLE PASS. Re-ran one mutant (hidden column unit uses the row number): killed by sudoku.test.js:1390/1393 and page.test.js:293, worktree clean. Screenshot checked.
- Concerns for PM: (1) the hidden column unit has no spec scenario (guarded by unit and page tests only; tester d1, reviewer M4); (2) the issue's position wording ("seed 2 after 2 filled singles", etc.) does not match the grids (3, 2 and 8 cells differ); the grids are the source of truth and the tester entered them as real entries. Neither blocks. No rework round needed.

### Rework 1 (developer, 2026-10-28)
- sudoku.js: classifyEntry now also returns the step's confined and removed cells; the own pointing/claiming text names the confined cells in the clause (pointing: the hint's struckCells; claiming: "rows/columns ..." plus box) and, in the hidden form, the removed cells that lie in the entered cell's unit (struckCells). boxName takes an optional dash; these two texts pass U+2011, hints and singles keep "-".
- README and unit/page assertions adapted (the exact texts, plus confined/removed in the classifyEntry deepStrictEqual). No assertion removed. All 5 scenarios, full suite 203/203, skipped 0.
- Unreachable rules (no unit test invented): a single confined cell (pointing and claiming need 2 or more spots); removed cells in two rows ("; ") in the entered unit (pointing removes along one line, claiming along one box row/column intersected with a row or column unit: always one row or one column).

## Lead: acceptance and merge
- 2026-10-28 PM rejected at 402f93f (a0c033b, PR comment): AC1-5 pass, AC6 fails (makes sense 3.92 < 4.0; case means 4.17/3.67/4.17/3.67). The cause is the spec wording, not the delivery (PM D7). Rework round 1: the PM runs a persona A/B and revises the spec (unbroken box ranges, the confined cells named, an explicit claiming-hidden link, a column-unit scenario). Then the lead runs red again on the revised spec, the developer, reviewer and tester re-run, and the layout is re-measured (24.5 px spare at 360x740 today, 8 px minimum).
- 2026-10-28 rework 1: PM spec 6e6b477 (D8: confined cells named, hidden form names removed cells, U+2011 in reward box ranges, 5th scenario with a column unit; A/B V1 4.67 against 3.27). Lead red run at 6e6b477 with code f60491b: specs 10 run, 5 pass, 5 fail, all on `the message reads` (:27 :44 :61 :78 :95), 0 undefined or ambiguous. Next: developer rework, then a full re-review and re-test (behaviour change).
