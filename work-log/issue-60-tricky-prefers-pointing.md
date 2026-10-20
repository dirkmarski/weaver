# Work Log: Issue #60 Tricky: Hint prefers a useful pointing step over singles

Iteration 13. Branch `issue-60-tricky-prefers-pointing`. Session `5034fe53-a839-46a5-807a-40a5b44d5158`.

## Lead
- Lead: weaver-agents (lead agent, Claude Opus 5.5).
- 2026-10-21: Gate check passed: #60 is open, authored by weaver-agents (PM), label enhancement. Delivered first in it13; #61 follows (its pins assume #60).
- Branch created from main at 4217479. Developer works in worktree `<scratchpad>/wt-60`.
- Gates: developer (code, unit + page tests, README) -> reviewer and tester in parallel (own detached worktrees) -> one rework round -> lead check -> PR -> PM acceptance on a stated head -> merge commit.
- 2026-10-21: Reviewer approve (S1 M6 survivor, N1, N2) and tester PASS (no defects) both in; one rework round sent for S1 + N1 + N2 (tests/README only).
- Lead delta re-check at b5613fc: sudoku.js unchanged since d1a1dfe; README delta (Hint intro, preference Order bullet) true to the code; M6 re-run by the lead: killed (167 pass, 1 fail; the issue-60 test), reverted 168/168, skipped 0. Ratio 1932/1210 = 1.597x (under 1.6x, ~4 lines headroom). Ready for PR.

## Developer
- Developer: Claude Sonnet 5.5. API: `findPointing(grid, {useful: true})` skips targets that are already a naked or hidden single (new helper `isSingle`); `hintFor(grid, step, prefer, level)` with `level === 'tricky'` tries that first, then the unchanged order. The page passes `currentLevel`. Generation, `classifyEntry`, texts untouched.
- Tests: one new unit test (seeds 1, 2, 5, Medium seed 2 and Hard seed 11 for AC4, rewards, conflict/full order); generator Hint-following test adapted (Tricky preference, tally); page: f2 re-pointed to a seed with no useful step, new f1 (seed 1 end to end). Seeds 3000-3002 give 2, 4, 4 pointing hints.
- Results: `node --test`: 168 pass, 0 fail, 0 skipped. Lines: tests 1929 vs product 1210 (sudoku.js 1040, index.html 41, style.css 129) = 1.594x (under 1.6x).
- README: Pointing "When", Tricky row, `findPointing` and `hintFor` entries.
- Rework round 1: S1 fixed with a 3-line pin in the issue 60 unit test (seed 26 after hinted entries r1c3=7, r2c9=8: the step r8c9=1 targets a naked single, so `findPointing(useful)` is null). M6 (`bitCount(used >> 1) === 8` -> false): before, survived; after, the issue 60 test fails (167 pass, 1 fail); reverted, 168 pass. N1/N2 fixed in README (Hint intro; technique-preference Order bullet). Tests 1932 / product 1210 = 1.597x (under 1.6x).

## Reviewer
- Reviewer: Claude Sonnet 5.5 (claude-sonnet-5-5), detached worktree at d1a1dfe. Did not read governance/LOG.md; read only the Lead section of this log.
- Verdict: approve with one should-fix and two README nits (no must-fix).
- Verified: suite 168 pass, 0 fail, 0 skipped. Ratio 1929/1210 = 1.594x (sudoku.js 1040 + index.html 41 + style.css 129 = 1210), under 1.6x. Seeds 3000-3002: 2/4/4 pointing hints (53/53/54 entries), never `none`. Data followed from `findPointing({useful})` / `isSingle` / `hintFor` to the page (`currentLevel` passed as 4th arg). AC 1-11 met; `undefined`/other levels take the old path; conflict and full-grid still first (findPointing on a full grid is null anyway).
- should-fix S1: mutant M6 survives (naked branch of `isSingle`, `bitCount(used >> 1) === 8`, replaced by false). It is reachable, not equivalent: a naked-single cell that is also the target of a hidden-form step (the pointing digit D is its only candidate and becomes the only spot in a unit) is then wrongly called useful. Across Tricky seeds 1-150 following hints, 58 puzzles hit a state where `findPointing(g,{useful:true})` differs under the mutant (e.g. Tricky seed 26 after 2 followed hints, seed 17 after 26, seed 21 after 14). Add one pin: a grid where the first step's only target is a naked single (hidden form) and is passed over, or the seed 26 state. Mutating the naked branch otherwise goes unnoticed.
- nit N1 (README line 30): "Hint ... and, when there is no single, pointing" is stale for Tricky; say "(on Tricky, a useful pointing step comes first, see Pointing)" or similar.
- nit N2 (README line 33, Order): the technique preference is described as always deciding; on Tricky it only applies when no useful pointing step exists (stated in the Pointing "When" bullet, not here). Optional one-clause pointer. Also the Pointing "Order" bullet still says "The first step that makes at least one cell a single is used" without "(not already a single)"; the "When" bullet covers it, so optional.
- README sentence check for the changed sections (Pointing "When", Tricky row, `findPointing`, `hintFor`): true to the code, including "single preference is then not used" and "a step whose only targets are already singles is passed over". The `hintFor` entry (level optional, page passes the chosen level) is accurate.
- Code quality: small and legible. `isSingle` reuses `usedMask`/`spotsFor`, same notion as `findNakedSingle`/`findHiddenSingle` but not shared with them (naked/hidden finders scan for the first cell, so reuse would add churn; not worth a change). One new unit test adapted from existing patterns; f2 re-pointed with a guard; generator test adapted, not duplicated.
- Mutants (each run with the full `node --test`):
  - M1 drop the useful filter: killed (issue 60 unit test).
  - M2 drop the level check (always useful-pointing first): killed (8 tests: single-hint texts etc.).
  - M3 level check `!== 'easy'`: killed (same 8 tests).
  - M4 useful pointing only after naked/hidden singles are absent (order swap): killed (issue 60 unit, page f1, generator Hint-following).
  - M5 page passes 'medium' as level: killed (page f1).
  - M5b page omits the level: killed (page f1).
  - M6 `isSingle` naked branch off: SURVIVED (S1).
  - M7 `isSingle` hidden branch off: killed (issue 60 unit).
  - M8 `isSingle` hidden checks box only: killed (issue 60 unit).
  - M9 `continue` -> `break` (later target of the same step lost): killed (issue 60 unit).
  - M10 useful pointing before the conflict check: killed (issue 60 unit, broken grid).
  - M11 naked threshold `>= 7`: killed (unit, f1, f2b).
  - M12 hintFor calls `findPointing(grid)` without useful: killed (unit, f2).
  - M13 `isSingle` hidden loop without the used-digit skip: killed (unit, f1).

## Tester
- Tester: Claude Sonnet 5.5 (claude-sonnet-5-5). Head d1a1dfe against main 4217479. Did not read governance/LOG.md; read only the "## Lead" section of this log. Scratch scripts: `<scratchpad>/test-60/` (oracle.js, pagecheck.js), not in the repo.

### Plan (AC -> check)
1. Seed 1: real page, first click = pointing nudge (box rows 1-3/cols 7-9, digit 2 row 1, target r1c5), second click explains with marks and key line; unit oracle.
2. Seed 2 and 3. Seed 5: hintFor and page at head equal to main (hidden single r2c9=3, r1c1=7).
4. hintFor on Easy/Medium/Hard compared with 4217479 along full hint walks (step 1 and 2, with the tally preference), seeds 1-5 per level.
5. Independent oracle on 5 Tricky seeds: follow Hint to the end, compare every hint with my own check, no `none`, solution reached.
6. Real page: enter 7 at r1c5, check the Well done text and the tally.
7. Generated puzzles at head equal to main: 4 levels x 7 seeds, plus the seed 1 grid.
8-9. Read the test/README diff; page tests run.
10. Count lines.  11. `node --test`.

### Results
- `node --test` (Node 24, no path): 168 tests, 168 pass, 0 fail, 0 skipped, 2.9 s. (AC11 pass)
- AC1 pass (page): first click target r1c5, status "Hint: try pointing. In the box of rows 1-3 and columns 7-9, the digit 2 fits only in row 1 ...", box tinted; second click: "... Row 1, column 5 could only take 2 or 7, so it must be 7.", confined r1c8-9, removed r1c5-6, key line shown. At main the same grid nudges the hidden single r1c9 = 1. Screenshot: /private/tmp/claude-502/-Users-dirk-Code-weaver-team/5034fe53-a839-46a5-807a-40a5b44d5158/scratchpad/test-60/seed1-explained-pointing.png
- AC2, AC3 pass: Tricky seeds 2 and 5 page states (both clicks, marks, tally) are identical to main; hidden single r2c9 and r1c1 as stated.
- AC4 pass: 1118 hintFor comparisons on Easy/Medium/Hard (steps 1 and 2 along full hint walks) with 0 differences against main. Page: Medium seeds 2 and 7 identical to main. The unit test adds Medium seed 2 and Hard seed 11.
- AC5 pass: see oracle. Seeds 3000-3002 give 2, 4, 4 pointing hints (developer's numbers; reproduced with my walk script).
- AC6 pass: entering 7 at r1c5 gives "Well done! You applied pointing: row 1, column 5 is 7." and "Pointing: 0 on your own, 1 with a hint".
- AC7 pass: 28 generated puzzles (easy/medium/hard/tricky x seeds 1,2,5,9,33,100,3000) are deep-equal to main, solutions too.
- AC8 pass (read): f2 re-pointed with a "no useful step" predicate, new f1 is the seed 1 end-to-end test; all page tests ran (Chrome found, none skipped).
- AC9 pass (read): README Pointing "When", Tricky row, findPointing and hintFor entries updated; the diff touches only behaviour for Tricky.
- AC10: tests 1929 (chrome 100, fixture 27, generator 155, page 380, sudoku 1267) vs product 1210 (sudoku.js 1040, index.html 41, style.css 129) = 1.594x, matches the developer; under 1.6x but only by 0.006 (about 7 lines of tests).

### Oracle (own candidate-set check of "useful pointing step", not using findPointing's option)
Seeds 1, 3, 17, 42, 77 (Tricky). Every hint on the walk compared with my oracle (box, digit, target); Hint followed to the end:

| seed | entries | pointing hints | first pointing at entry (0-based) | mismatch | wrong digit | stuck/none | solved |
|---|---|---|---|---|---|---|---|
| 1 | 54 | 5 | 0 | 0 | 0 | 0 | yes |
| 3 | 51 | 2 | 3 | 0 | 0 | 0 | yes |
| 17 | 53 | 4 | 0 | 0 | 0 | 0 | yes |
| 42 | 53 | 6 | 4 | 0 | 0 | 0 | yes |
| 77 | 50 | 3 | 11 | 0 | 0 | 0 | yes |

### Defects
None (critical 0, major 0, minor 0, trivial 0).

### Notes
- Observation: AC10 margin is thin (1.594x); any added test line in the rework pushes past 1.6x.
- Not tested (outside the criteria): mutation testing of the new unit tests (the reviewer appears to be doing it).
- Chrome: my runs used private TMPDIR profiles, all removed; no leftover processes of mine. Other weaver-chrome processes seen belong to the reviewer's run.
