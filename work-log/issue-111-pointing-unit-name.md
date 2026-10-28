# #111 Pointing explanation names the unit in step 3 (hidden form)

Issue: https://github.com/dirkmarski/weaver/issues/111. Branch: `issue-111-pointing-unit-name`.

## Lead
- Lead: Claude Opus 5.5 (claude-opus-5-5), session d2424c00-a6fb-45e6-86ab-53111ee2576f. 2026-10-28.
- Gate: #111 open, author weaver-agents (PM). Fresh start: branch held only the PM spec 37b7a9c. Merged main 64242b1 into the branch (83f6891).
- Specs run after the merge: the 4 new scenario runs fail as undefined steps (`Given the level is Tricky`); 10 other spec runs pass. Full suite 207: 203 pass, 4 fail, skipped 0.
- Baseline ratio: tests 2376 / product 1500 = 1.584 (cap 2400, 24 lines headroom). spec-implementation/ 303 lines, measured on its own.
- Plan: part A developer adds step definitions only (new file under `spec-implementation/steps/`, driver additions in `drivers/`), no product change, and the red run must fail on the step-3 / explanation assertions. Lead verifies red. Part B developer: sudoku.js line 395 hidden-form step 3 names the unit (row N / column N / existing box wording, ASCII "-"), README "Hint" texts, adapt (not duplicate) the existing tests pinning "its row/column/box" for pointing step 3 (tests/page.test.js 355, 398 and any in tests/sudoku.test.js). Then reviewer, tester (layout box case at 360x740: stage-3 invitation in view with visible margin, else stop and ask the PM), lead check, PR with test summary, PM acceptance.
- Scope notes: only pointing hidden-form step 3 changes. Not the nudge, steps 1-2, naked form, claiming, the hidden-single texts ("in its row" at sudoku.js 484-487, 684), or box naming. Box ranges in hints keep "-" (rewards use U+2011; PM C2 open, not this issue).

## Developer

### Part A (step definitions, red run)
- Files: new `spec-implementation/steps/hints.js` (steps: `the level is (Tricky)`, `the player asks for a hint twice`, `the explanation's last line reads "..."`, `the explanation reads:`); `spec-implementation/drivers/game.js` gains `hintTwice(game, level)` (hintFor step 1 then 2 with `preferredTechnique`, as the page does). No change to sudoku.js, index.html, README, tests/, runner.
- Red run: specs 14 runs, 10 pass, 4 fail on assertions: actual "in its row/column/box where" vs expected "in row 4 / column 1 / the box of rows 1-3 and columns 1-3 where"; steps 1-2 and the conclusion of the whole-explanation run match. Full suite 207: 203 pass, 4 fail, 0 skipped.
- Sanity: temporarily normalising the unit phrase in the last-line step made the 3 outline runs pass (13 pass), reverted; the real step fails.

### Part B (product change)
- Files: sudoku.js (`pointingHint` computes `unitName` once, via `boxName` for a box, and step 3 of the hidden form uses it; the nudge reuses it instead of its own copy, text unchanged), README.md (Hint section: hidden step 3 text and U), tests/sudoku.test.js (3 assertions adapted), tests/page.test.js (2 adapted).
- Ratio: product 1500 (sudoku 1301 + index 46 + style 153), tests 2376; line counts unchanged (net 0), ratio 1.584x. No assertion removed.
- Longest line in sudoku.js: 250 characters before and after (not a changed line).
- Green: specs 14/14, full 207 pass, 0 fail, 0 skipped.

## Lead red check
- Lead re-ran part A 3cb1b4e: specs 10 pass / 4 fail, each on the step-3 text only (actual "its row/column/box"), no undefined or ambiguous steps; full suite 203 pass / 4 fail / 0 skipped. Red runs saved in the session scratchpad 111/red-specs.txt and red-full.txt.

## Reviewer
- Reviewer: Claude Sonnet 5.5 (claude-sonnet-5-5), session d2424c00-a6fb-45e6-86ab-53111ee2576f. Head reviewed: b2de413. 2026-10-28.
- Verdict: approve (no blocking findings).
- Findings:
  1. (info) sudoku.js: `unitName` is hoisted above the explain/nudge branch and shared; naked form gets '' and never uses it. Nudge text byte-identical to before. Step 3 uses boxName with default ASCII "-". Correct and a net reduction in duplication.
  2. (info) README Hint paragraph: step 3 text and the U definition match the code (row N, column N, box wording); the first-click description is unchanged. Only this sentence changed.
  3. (info) Tests adapted, not duplicated: 5 assertions edited in place (page.test.js 2, sudoku.test.js 3), no lines added or removed. tests 2376 / product 1500 = 1.584 (cap 1.6). No assertion removed.
  4. (info) Step definitions: 4 new steps in steps/hints.js, no clash with own-singles.js; assertions live in the steps; driver hintTwice asserts nothing. Steps can fail (see D1).
  5. (low) Step 3 for the column unit is pinned by the spec (seed 14) only; unit/page tests pin row and box. Column index mutants are killed by the spec and by the existing nudge test. No action.
  6. (low) Driver mutant D2 (preferredTechnique level 'easy' instead of the given level) survives: the 3 positions have a fresh tally and give the same teaching at either level. Not an AC; no action.
- Mutants (each diff non-empty, applied with Python, reverted; `node --test` per mutant):
| id | change | result | killed by |
|----|--------|--------|-----------|
| M1 | box unit name -> "its box" | killed | spec outline (box row); sudoku.test "the unit is the box when box, row and column all qualify" |
| M2 | row/column index +2 | killed (7) | spec outline rows 1-2, whole-explanation; page f1a, f1b; sudoku "pointing, column line, hidden form"; "issue 56 pins" |
| M3 | swap row/column index | killed (7) | same as M2 |
| M4 | step 3 reverts to "its <unit>" | killed (9) | spec outline x3, whole-explanation; page f1a, f1b |
| M5 | column index +1 extra (column only) | killed (2) | spec outline column row; sudoku "pointing, column line, hidden form" |
| M6 | box branch never taken | killed (2) | spec outline box row; sudoku box test |
| M7 | step 3 "its box"/"its <unit>" via other expression | killed (9) | spec outline, page f1a/f1b |
| M8 | nudge "Then look at its <unit>" | killed (2) | sudoku "column line, hidden form"; "box when box, row and column qualify" |
| M10 | U+2011 in boxName for hints | killed (2) | spec outline box row; sudoku box test |
| M11 | hidden branch uses naked text (condition inverted) | killed (11) | spec outline, whole-explanation, page, sudoku |
| M12 | box index with r and c swapped | killed (1) | sudoku "unit is the box ... (row line, box 7)" only (spec box position is symmetric, box 0) |
| D1 | driver hintTwice returns step 1 | killed (4) | all 4 spec runs (the last-line / whole-explanation steps) |
| D2 | driver hintTwice uses level 'easy' | survived | equivalent on these positions (finding 6) |
- Suite on clean head b2de413: tests 207, pass 207, fail 0, skipped 0.
- Not tested: layout (tester, AC5), page rendering of the box case, naked-form step 3 beyond the existing tests, README sentences other than Hint pointing, claiming and hidden-single code paths (only checked unchanged by diff).

## Tester
- Tester: Claude Sonnet 5.5 (claude-sonnet-5-5), session d2424c00-a6fb-45e6-86ab-53111ee2576f. Tree: detached 2929cf0 (code b2de413); main 64242b1 for comparison.
- Verdict: pass. The box case fits at 360x740 and 375x812; see finding 1 for the 1.5 px margin (unchanged from main, by design).
- Findings:
  1. Layout, info (PM may want to know): at 360x740 the invitation bottom is 738.5 (1.5 px spare) in every case, on main and on the branch, because the page scrolls it into view with a 1 px scroll margin. The longer box text is absorbed by scrolling: scrollY 56 -> 74, grid top 23.8 -> 5.8, target row still in view (78.2-112.7), #status bottom 674.5, no clipping, no horizontal scroll. The real headroom left is the grid top (5.8 px, one more 18 px line would push row 1 off screen). At 375x812 the box case needs no scroll: invitation bottom 793.6, 18.4 px spare (main 36.4).
  2. Texts: on the real page the explanation reads exactly as the spec for row (seed 8), column (seed 14) and box (seed 1, 9 hinted fills); nudge, steps 1-2 and the line count are identical to main; only step 3 differs.
  3. Mutant C (box index transposed in the unit name) is killed by one test only (tests/sudoku.test.js:906, the WALL_BOX position); the spec box scenario survives it because rows 1-3/columns 1-3 is symmetric under transposition. Low.
  4. Mutant G (step 3 unit name upper-cased) and the others die on the spec runs and several tests; no survivors.
- Measurements (px, Tricky, stage 3 after the last Hint; key = #key bottom, st = #status bottom; main in brackets):
  | position | viewport | key | st | viewport h | spare key | scrollY | grid top |
  | box (seed 1 + 9) | 360x740 | 738.5 (738.5) | 674.5 (674.5) | 740 | 1.5 (1.5) | 74 (56) | 5.8 (23.8) |
  | row (seed 8) | 360x740 | 738.5 (738.5) | 674.5 | 740 | 1.5 (1.5) | 20 (20) | 59.8 (59.8) |
  | column (seed 14) | 360x740 | 738.5 (738.5) | 674.5 | 740 | 1.5 (1.5) | 20 (38) | 59.8 (41.8) |
  | box | 375x812 | 793.6 (775.6) | 745.6 (727.6) | 812 | 18.4 (36.4) | 0 (0) | 79.8 |
  | row, column | 375x812 | 757.6 | 709.6 | 812 | 54.4 | 0 | 79.8 |
  | extra Tricky 44 (box, 326 chars), 20 (row) | 360x740 | 738.5 | 674.5 | 740 | 1.5 | 56, 38 | 23.8, 41.8 |
  Step 3 text lengths: spec box 358 (main 330), row/column 290 (292).
- Oracle: 5 positions (3 spec grids, Tricky 20 row, Tricky 44 box), plain rules plus the pointing elimination: the named unit holds the cell as the only place for the digit in all 5.
- Mutants (sudoku.js only, reverted, tree clean): A column named as row, B pointing line named, C box transposed, D box wording "column", E old text restored, F index off by one, G upper-cased unit: all killed. Suite on the clean head: 207 tests, 207 pass, 0 fail, 0 skipped, 3.9 s.
- Not tested: the longest own-reward #status (#108 scope), Tough/Hard hidden pointing walks beyond the scanned first hints, desktop widths, 320 px, a real device, screenshots by eye other than the box case.
- Scripts and re-run: scratchpad 111/test/README.md.

## Lead review

## Lead: acceptance and merge
