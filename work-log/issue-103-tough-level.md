# Issue #103: Tough level: practise claiming (Hint prefers a useful claiming step)

Issue: https://github.com/dirkmarski/weaver/issues/103. Branch: `issue-103-tough-level`.

## Lead
- Lead: Claude Opus 5.5, session 54373c68-c664-43ac-8c9e-31688e9eba82 (new lead run in the #102 session). Gate passed (open, author weaver-agents). Fresh start (no branch, PR or log existed).
- Baseline main 9ccab0c: 183/183 tests, skipped 0. Ratio tests 2360 / product 1475 = 1.600, at the cap (0 headroom): every product line added earns 1.6 test lines; anything beyond that needs listed redundant removals in touched test files (process.md "Test strategy applied").
- Spec: the issue body is the spec (Behaviour, AC 1-6). PM decision D1 in `work-log/iteration-21-product.md`; pins come from the PM spike (`pm-it21/pins.js`).
- Plan: one developer (LEVELS.tough, Hint preference on Tough, picker button, level text, README, unit tests AC 1-2, one page test with a pin AC 3, picker and stage-2 measurements AC 4-5, ratio plan with removals listed first). Then reviewer, tester (all four pins on the real page, picker at 360/375/1280, stage-2 Next step bottom at 360x740 for seeds 1, 3, 4, 7), lead check, PR, PM acceptance.
- Risks for review/test: other levels unchanged (AC 6: existing generation and Hint order tests untouched); `findClaiming(grid, {useful: true})` already exists (#102), so the logic diff should be small; ratio cap; picker wrap at 360/375 (five buttons); 3-line step-2 texts overflow 360x740 (D7, pre-existing): AC 5 measures seeds 1, 3, 4, 7. On Tough claiming comes first, so naked targets with a struck badge will show often (PM watch item). `classifyEntry` and the grading solver stay pointing-only (#104 / out of scope).

## Developer
- Developer: Claude Sonnet 5.5, session 54373c68-c664-43ac-8c9e-31688e9eba82. Commits b1d9c62 (feature, tests, README), 0144447 (CSS rule, page test, removals); the log entry is a third commit.
- What: `LEVELS.tough` (Tricky's band and rules; same puzzle for the same rng); `hintFor(..., 'tough')`: useful claiming, then useful pointing, then Tricky's order; picker button Tough between Tricky and Hard (level text "Difficulty: Tough" via the existing code); README (intro, how to play, Hint order, Pointing/Claiming "When", levels table, generation, API). Added `#status.steps { font-size: 1rem; }` below 560 px: Tough seed 4 step 2 (5 struck cells over three rows) put the stage-2 Next step button at bottom 759.9 on 360x740 (AC 5 FAIL); with the rule 719.3 (seeds 1/7: 701.3, seed 3: 719.3).
- Tests: unit (generator: tough joins the LEVELS loop with seeds 3000-3009 = Tricky's, equality test, tricky/tough pointing-not-singles test; sudoku: one Issue 103 test: CL_X claiming before a single, CL_PC before pointing, seed 1 first Hint, seed 2 passed over = Tricky, a one-gap grid with no claiming = Tricky, full grid and conflict first); page g1 (picker order, Tough seed 1 and seed 3 pins, seed 4 stage-2 Next step in view at 360x740). 183/183, skipped 0. Spot mutants: dropping `{useful: true}` and putting claiming after pointing each fail the unit test; removing the CSS rule fails g1.
- Ratio: tests 2364 / product 1480 (sudoku.js 1281 + index.html 46 + style.css 153) = 1.597, cap 2368. Removed (each covered): `incomplete correct grid has no conflicts` (verify of PUZZLE and of SOLUTION tests); `puzzle givens have no conflicts` (verify(PUZZLE).conflicts); the `filter` assertion in `cell in conflict in both row and box is reported once` (the deepStrictEqual above it); `nextCell returns null when only givens are left` (surrounded-by-givens and no-wrap tests); `findNakedSingle: PUZZLE fixture first naked single` (picks-first and finds-single tests); the step-1 line of `hintFor: naked single results carry technique naked` (hint-order and hintApplied tests); `hard is graded against pointing` (constant; covered by `hard is NOT solvable by singles plus pointing`); `findHiddenSingle: does not change the grid` (`hintFor and findHiddenSingle do not mutate their input`). Changed (extended, 0 lines): the tricky pointing test now loops over tricky and tough batches.
- Evidence: /tmp/wvr/claude-502/-Users-dirk-Code-weaver-team/54373c68-c664-43ac-8c9e-31688e9eba82/scratchpad/dev-103/ (README.md; pins 29/29, picker 13/13, stage2 8/8; shots/).
- Not tested: classifyEntry on Tough claiming (out of scope, #104); a full Hint walk to the end on Tough (only to the first claiming Hint); wider Tough batches than 10 seeds; Chrome other than headless; real touch input on the picker.

## Reviewer

## Tester

## Lead review

## Lead: acceptance and merge
