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

## Reviewer
- Model Claude Sonnet 5.5, session 8dc2d34a-b5fc-44f3-9327-5bb6bd0c4608, head b8c54f1. Verdict: request changes (no blocker; two should-fix test gaps).
1. should fix: the multi-box list branch ("the A and B boxes") is pinned by no test or spec; mutant ' boxes' -> ' box' survives (hints.js:43). Add one case.
2. should fix: sort of column numbers for a box unit is unpinned (encounter order can be non-ascending in a box); mutant removing both numeric sorts (hints.js:44-46) survives. Add a hiddenStep3 case with columns met in descending order.
3. nit: tests/page.test.js:299 is now 354 characters (main's file max 320); split the array over lines.
4. nit: `k !== kU` and `|| s.removed.indexOf(q) >= 0` in the holder loop and the box-list sort are unreachable guards (U holds no D; struck cells have no holder); mutants survive as equivalent. Spec text says "never U itself", so keeping is defensible.
5. nit: exporting hiddenStep3 for one test: no ADR 003 breach (no re-export, owner module); memory architecture Exports lists hints.js exports without it; curator to note.
Suite 237/237 pass, spec-implementation 28/28; ratio 2489/1581 = 1.574 (cap 2529); hints.js longest line 248 (= main). Not checked: page layout (tester).

## Tester

## Lead review

## Lead: acceptance and merge
