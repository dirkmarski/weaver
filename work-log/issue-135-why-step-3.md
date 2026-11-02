# Issue #135: hint step 3 says why the unit's other cells are out

Issue: https://github.com/dirkmarski/weaver/issues/135 . Branch: `issue-135-why-step-3` (PM spec 6186ae6).

## Lead
- Gate: open, author weaver-agents (PM), iteration 26. Lead Claude Opus 5.5, session 8dc2d34a-b5fc-44f3-9327-5bb6bd0c4608.
- Baseline at 07b55d1 (main merged): 236 tests, 10 fail (9 assertion, 1 undefined Tough level step); ratio 1.597x (2478/1552, cap 2483, headroom 5 lines); spec-implementation 483 lines.
- Plan: developer part A (extend the existing level step to accept Tough, no new text) as its own commit, lead red run at that sha; part B (hints.js step 3, adapt old step-3 unit tests in place, README Pointing/Claiming step 3). Then reviewer, then tester (AC4 13-case layout at 360x740/375x812/1280x900, AC5 mutants, PM concern C4: `node --test spec-implementation/specs.test.js` exit time).
- PM concerns to watch: C1 step 3 counts struck cells inside U only (step 2 lists all; numbers may differ, by spec); C2 375x812 fit is tight (AC4 hard gate); C3 "(struck)" vs "crossed out" (out of scope, by spec); undefined Tough step (extend existing step).

## Developer
- Claude Sonnet 5.5, session 8dc2d34a-b5fc-44f3-9327-5bb6bd0c4608.
- Part A 9010bb5: level step accepts `(Tricky|Tough)`. Red run: 236 tests, 226 pass, 10 fail, 0 skipped; all 10 fail on ERR_ASSERTION (no undefined or ambiguous step).
- Part B: `hints.js` new internal `hiddenStep3(s, grid)` used by pointingHint and claimingHint (hidden form); old step-3 assertions adapted in place in `tests/sudoku.test.js` (5 edits) and `tests/page.test.js` (3 edits); README Pointing and Claiming step 3 texts only.
- Green: 236 pass, 0 fail, 0 skipped, about 5.5 s. tests 2478 lines / product 1581 = 1.567x (cap 2529); spec-implementation 483.
- Mutants killed (full suite): has/have, n = all struck cells, fallback branch, first-holder order (box before row/column), box group dropped. Survives: swapping the row and column group order (no spec or test has rows and columns together in one step 3; none found in seeds 1-400 first hints or a 60-step walk of 60 seeds).
- Gap closed (second pass): one test 'hidden step 3 lists the holders as the box, then rows, then columns' in `tests/sudoku.test.js`: two hintFor grids (box+rows, box+columns, level tough) and one crafted rows+columns case via `hiddenStep3`, now exported from `hints.js` (box, row and column holders cannot all appear in one step: the unit's own kind is excluded, and no hintFor grid with box unit and both found by search).
- Mutants: rows/columns swap and box-last both now fail the new test (1 fail each). Green: 237 pass, 0 fail, about 6.8 s; tests 2489 / product 1581 = 1.574x (cap 2529).
- Rework (review F1-F3): added two `hiddenStep3` cases to the same test (row unit with holders in two boxes: 'the top‑middle and top‑right boxes'; box unit with columns met as 3 then 1: 'columns 1 and 3'), and split the page.test.js line (320 chars max). F4 no action.
- Mutants: ' boxes' -> ' box' and removing the row/column numeric sort each fail 1 test; hints.js unchanged. 237 pass, 0 fail; tests 2495 / product 1581 = 1.578x (cap 2529).

## Reviewer
- Model Claude Sonnet 5.5, session 8dc2d34a-b5fc-44f3-9327-5bb6bd0c4608, head b8c54f1. Verdict: request changes (no blocker; two should-fix test gaps).
1. should fix: the multi-box list branch ("the A and B boxes") is pinned by no test or spec; mutant ' boxes' -> ' box' survives (hints.js:43). Add one case.
2. should fix: sort of column numbers for a box unit is unpinned (encounter order can be non-ascending in a box); mutant removing both numeric sorts (hints.js:44-46) survives. Add a hiddenStep3 case with columns met in descending order.
3. nit: tests/page.test.js:299 is now 354 characters (main's file max 320); split the array over lines.
4. nit: `k !== kU` and `|| s.removed.indexOf(q) >= 0` in the holder loop and the box-list sort are unreachable guards (U holds no D; struck cells have no holder); mutants survive as equivalent. Spec text says "never U itself", so keeping is defensible.
5. nit: exporting hiddenStep3 for one test: no ADR 003 breach (no re-export, owner module); memory architecture Exports lists hints.js exports without it; curator to note.
Suite 237/237 pass, spec-implementation 28/28; ratio 2489/1581 = 1.574 (cap 2529); hints.js longest line 248 (= main). Not checked: page layout (tester).

## Tester
- Model Claude Sonnet 5.5, session 8dc2d34a-b5fc-44f3-9327-5bb6bd0c4608, tested head c311891 (main origin/main 0b916fe for comparison). Verdict: PASS (AC4, AC5 and the oracle hold; no product defect found). Scripts: scratch `test-135/README.md`.
1. AC4 layout, 13 cases x 360x740 / 375x812 / 1280x900, real page, mobile emulation before load, real CDP input: all gates hold. 360x740: max 10 lines (main 10), min grid top 5.8 px (the #111 D10 case and three others; main also 5.8), reserve (#link) and invitation (#key) bottoms <= 738.5 (main 738.5). 375x812: max reserve bottom 810.6 (Tough 14 h17 and h18; main 793.6), margin 1.4 px as the PM spike said; every other case <= 793.6. 1280x900: lines equal main in all 13 (6-7). No horizontal overflow or clipping, 0 split box names, 0 console errors. Every step 3 is the hidden-form new sentence.
2. The branch adds up to 2 lines at 360 (7->9, 8->10) but the grid top stays >= 5.8 px and the reserve never exceeds main's worst (738.5); at 375x812 the branch reserve is 17-18 px lower than main in 12 of 13 cases (equal in Tricky 4 h4), still <= 810.6.
3. Oracle (7 cases, independent holders/order/count/has-have/names from the page board): all equal the page text. The unit kind, D, struck and hatched marks are read from the page (marks include the step-1 box's hatched cells, filtered to U).
4. Mutants (hints.js, reverted): group order reversed, has/have by group count, struck = all removed, fallback always "the other empty cell", fallback never, holder order box-first, filled cells not skipped, duplicate holders kept: all 8 killed by `node --test`. The fallback wording mutant is killed by a spec only (1 failure).
5. C4: `node --test spec-implementation/specs.test.js` did not hang: 3 runs each on branch and main, summary and exit both at about 0.23 s (28 and 22 tests, 0 fail); plain `node --test` 5.3-5.7 s, exits with the summary (branch 237, main 230 tests); no process left on 8000 or elsewhere; with 8000 busy it fails in 0.2 s with the documented message. Not reproduced; a hang would come from the caller (a harness waiting on a pipe or Chrome from another job), not the runner.
6. `node --test` on the branch: 237 pass, 0 fail, 0 skipped, 6.5 s.
Not tested: personas (PM), other seeds beyond the 13, other viewports, Safari/Firefox, keyboard-only walk, unreachable census cases (U with no struck cell; three unit groups), the reviewer's two gaps (left to rework).

## Lead review

## Lead: acceptance and merge
