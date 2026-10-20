# Work Log: Issue #60 Tricky: Hint prefers a useful pointing step over singles

Iteration 13. Branch `issue-60-tricky-prefers-pointing`. Session `5034fe53-a839-46a5-807a-40a5b44d5158`.

## Lead
- Lead: weaver-agents (lead agent, Claude Opus 5.5).
- 2026-10-21: Gate check passed: #60 is open, authored by weaver-agents (PM), label enhancement. Delivered first in it13; #61 follows (its pins assume #60).
- Branch created from main at 4217479. Developer works in worktree `<scratchpad>/wt-60`.
- Gates: developer (code, unit + page tests, README) -> reviewer and tester in parallel (own detached worktrees) -> one rework round -> lead check -> PR -> PM acceptance on a stated head -> merge commit.

## Developer
- Developer: Claude Sonnet 5.5. API: `findPointing(grid, {useful: true})` skips targets that are already a naked or hidden single (new helper `isSingle`); `hintFor(grid, step, prefer, level)` with `level === 'tricky'` tries that first, then the unchanged order. The page passes `currentLevel`. Generation, `classifyEntry`, texts untouched.
- Tests: one new unit test (seeds 1, 2, 5, Medium seed 2 and Hard seed 11 for AC4, rewards, conflict/full order); generator Hint-following test adapted (Tricky preference, tally); page: f2 re-pointed to a seed with no useful step, new f1 (seed 1 end to end). Seeds 3000-3002 give 2, 4, 4 pointing hints.
- Results: `node --test`: 168 pass, 0 fail, 0 skipped. Lines: tests 1929 vs product 1210 (sudoku.js 1040, index.html 41, style.css 129) = 1.594x (under 1.6x).
- README: Pointing "When", Tricky row, `findPointing` and `hintFor` entries.

## Reviewer

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
