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

## Lead review

## Lead: acceptance and merge
