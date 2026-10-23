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
- Reviewer: Claude Sonnet 5.5, session 54373c68-c664-43ac-8c9e-31688e9eba82. Head reviewed 87f6fa6 (diff 9ccab0c..HEAD). Suite on head: 183/183, skipped 0. Verdict: approve with nits (two should-fix test gaps, one should-fix line length; no must-fix).
- Findings:
  1. should-fix, tests/sudoku.test.js:991-1004 (issue 103 test): AC 2 "with no useful claiming step it behaves like Tricky" is not pinned for a grid that HAS a useful pointing step. Mutant M3 (`level === 'tricky' || level === 'tough'` -> `level === 'tricky'`, Tough loses its pointing fallback) survived all 183 tests. The Tricky-equality loop uses pz(2) and blank([4,7]), neither of which has a useful pointing step. Fix: one Tough assertion on a grid with a useful pointing step and no useful claiming step (e.g. the Tricky seed 1 pin of issue 60) equal to the Tricky hint.
  2. should-fix, style.css:152 / tests/page.test.js g1: the CSS rule is only pinned from above (the 360x740 fit). Survivors: M12 (selector `#status.steps` -> `#status`, so Verify/other messages also change), M13 (`font-size: 0.9rem`), M9 (rule moved out of the 559 px media query: Desktop step text becomes 1rem instead of 1.1rem). Fix: a computed-style pin: `#status.steps` font-size 16 px at 360 px width (and 17.6 px at >= 560 px), and for a non-steps status at 360 px unchanged. f1a/f1h/f4 do not guard these.
  3. should-fix, README.md:41: the line grew to 8618 characters; the longest line at 9ccab0c was 8482 (brief rule). Move the added Tough sentences to a new line/bullet or shorten. Other touched files: no line longer than at base (sudoku.js 250, index.html 220, style.css 1347, tests 255/128/320).
  4. nit, README.md:33: "the hidden single on Medium, Tricky and Hard" omits Tough (code: preferredTechnique returns 'hidden' for every level but easy; the same paragraph already names Tough two sentences later).
  5. nit, tests/page.test.js g1: seed 1 pin checks the target cell and the start of the text but not the struck cells r1c5/r1c6; seeds 4 and 7 pins are not asserted (allowed: tester-checked per AC 3).
- Checked OK: Hint order on Tough (conflict, full, useful claiming, useful pointing, singles with preference, pointing, claiming, none) matches the issue; Tricky unchanged (M5 claiming-on-all-but-hard fails 25 tests); `LEVELS.tough` equals Tricky's entry (M6, M15 killed); same puzzle for the same seed pinned by a generator test; `classifyEntry`, tally, completion messages untouched in the diff; level text and picker handler are level-agnostic (`'Difficulty: ' + capitalised level`, `data-level` click); README picker, levels table, Hint order, API list consistent with the code. Tests/product = 2364/1480 = 1.597 (cap 1.6).
- Removals (all 8 confirmed redundant, each by a mutant on the covering test): (1) `puzzle givens have no conflicts` -> `unmodified puzzle: incomplete, no conflicts, not solved` (verify(PUZZLE) conflicts; R1 flag-all killed by 74 tests); (2) `incomplete correct grid has no conflicts` -> same test plus the verify/SOLUTION tests (no practical mutant survives; weakest of the eight, accepted); (3) `filter` count assertion -> the `deepStrictEqual(res, ['0,1','0,2'])` above it (a list with a duplicate cannot equal it); (4) `nextCell returns null ...givens` -> `nextCell from a cell surrounded by givens finds nothing` and the no-wrap test (R3 killed); (5) `findNakedSingle: PUZZLE fixture` -> `picks the first in reading order among several` and `hintFor: a naked single before a hidden single` (R4 reverse scan killed; R7 `seen` killed by the finds-single test); (6) step-1 technique naked line -> step-2 line and hintApplied/classifyEntry tests (R5 step-1 technique mutant killed by 6 tests); (7) `hard is graded against pointing` -> `hard is NOT solvable by singles plus pointing` (R6 beyond 'singles' and R6b 'naked' killed); (8) `findHiddenSingle does not change the grid` -> `hintFor and findHiddenSingle do not mutate their input` (toFlat copies; no mutant reachable). None is an AC-required test. No line packing found.
- Mutants (M = Tough/CSS/wiring, R = removals; each diff checked non-empty, restored by `git checkout`):
  | id | mutant | result |
  | M1 | pointing before claiming on Tough | killed: issue 103 unit test, g1 |
  | M2 | claiming without `{useful: true}` | killed: issue 103 unit test, g1 |
  | M3 | Tough loses useful pointing | SURVIVED (finding 1) |
  | M4 | claiming never fires (level typo) | killed: issue 103 unit test, g1 |
  | M5 | claiming for every level but hard | killed: 25 tests (f, f1, f1a, f1b ...) |
  | M6 | tough max 30 | killed: tough same puzzle as tricky |
  | M7 | picker order Hard before Tough | killed: g1 |
  | M8 / M11 | CSS 1.05rem / 1.08rem | killed: g1 (fit) |
  | M9 | CSS rule outside the media query | SURVIVED (finding 2) |
  | M12 | CSS selector `#status` | SURVIVED (finding 2) |
  | M13 | CSS 0.9rem | SURVIVED (finding 2) |
  | M14 | level text "Tricky" for Tough | killed: g1 |
  | M15 | Tough band/rules differ | killed: 4 tests |
  | M16 | Tough pointing without useful | killed: issue 103 unit test |
  | M10 | claiming only at step 2 | killed: issue 103 unit test, g1 |
  | R1-R7 | removal-cover mutants above | all killed |
- Not checked: tester-scope acceptance measurements (AC 4 screenshots at three sizes, AC 5 measured fit for seeds 1/3/7 and Hard 14/108, seed 4/7 pins by walk); Chrome other than the local one; README prose outside the sections named in the issue beyond a grep for Tricky/Hard lists; real touch input.

## Tester

## Lead review

## Lead: acceptance and merge
