# Work Log: Issue #61 Pointing explanation: clearer ring clause and a legible strike on the struck badge

Iteration 13. Branch `issue-61-ring-clause-strike`. Session `5034fe53-a839-46a5-807a-40a5b44d5158`.

## Lead
- Lead: weaver-agents (lead agent, Claude Opus 5.5).
- 2026-10-21: Gate check passed: #61 is open, authored by weaver-agents (PM), label enhancement. Delivered after #60 (merged in 44e3123); the PM re-checked the pins (seeds 1, 76, 8, 44) against #60's head 5f13f84 and tightened AC 9 (ratio at most 1.6x, bounded removal of redundant assertions) in the Change log.
- Branch created from main at 44e3123. Developer works in worktree `<scratchpad>/wt-61`.
- Gates: developer -> reviewer and tester in parallel (own detached worktrees) -> one rework round -> lead check -> PR -> PM acceptance on a stated head -> merge commit. This issue changes CSS: the tester measures the strike numerically at 375 and 1280 px and takes screenshots.

## Developer
- Developer: Claude Sonnet 5.5 (claude-sonnet-5-5). Did not read governance/LOG.md or other work logs.
- Ring clause: `pointingKey(step, ringCount)` now takes the pointing hint (`pointDigit`, `form`, `unit`, `r`, `c`); the page passes `res`. New helper `aDigit(d)` ("an 8"/"a D") is shared with the hidden-single explanation. n = 0 unchanged.
- Strike: gradient now `#fff 44%, #6b6b6b 44% 56%, #fff 56%` (band colour #6b6b6b, 5.33:1 vs white; digit #333 12.6:1). Padding box 11.36 x 16.80 px (375) and 15.36 x 16.80 px (1280); thickness = 12% x 2wh/hypot(w,h) = 2.26 px (375), 2.72 px (1280). #595959 was not used: under the digit (#333) it would be only about 1.8:1, #6b6b6b gives about 2.4:1 where the strike crosses a glyph.
- Tests changed: pointingKey unit test (per form/count), new page test f1b (seeds 1, 76, 8, 44 literal clauses), f4 extended with the struck chip stops/colour/thickness guard (mutants 46-54% and #8a8a8a fail it), page f/f2b now call the helper with the hint.
- Removed assertions (ratio room): unit test 'hintFor: any step other than 2 is the nudge; the grid is not changed' (nudge/explain kinds covered by the step 1 and step 2 hintFor tests; no-mutation by 'hintFor and findHiddenSingle do not mutate their input'); unit test 'hintFor: conflicts and a full grid still come before a hidden single' (covered by 'hintFor: conflicts come first...', 'hintFor: full grid without conflicts' and 'hintFor with hidden: conflict, full grid and no single...'); page f2 first-key match (the key's presence is covered by f, f1b and f2b).
- Ratio: tests 1944 / product 1215 = 1.5999.

## Reviewer
- Reviewer: Claude Sonnet 5.5 (claude-sonnet-5-5), head b982c38 vs main 44e3123. Did not read governance/LOG.md; read only the Lead section of this log. Own detached worktree; private TMPDIR.
- Verdict: APPROVE. No must-fix. 167/167 pass, 0 skipped.
- Recount: tests/*.js 1944 (chrome 100, fixture 27, generator 155, page 397, sudoku 1265) / product 1215 (sudoku.js 1045, index.html 41, style.css 129) = exactly 1.6000, so "at most 1.6x" holds with zero headroom.
- Strike formula: `to top right` is a corner keyword; the 50% line runs through the other two corners (the strike is that diagonal) and the gradient line is 2wh/hypot(w,h) long. So thickness = 0.12 x 2wh/hypot(w,h). Recomputed: 2.26 px (11.36 x 16.8) and 2.72 px (15.36 x 16.8). Contrast of #6b6b6b on white 5.33:1. Correct. The f4 guard reads the computed gradient (Chrome serialises `#6b6b6b 44% 56%` as two grey stops, the regex takes the second as `to`; correct).
- README and style.css comment: true sentence by sentence (colour, 12%, 2.3/2.7 px, 5.3:1, wording of the clause, W per form, "an 8", n = 0 clause dropped, pointingKey signature).
- Code: concise, `aDigit` shared, no duplication.

### Mutants (all reverted)
| # | Mutant | Result |
|---|---|---|
| M1 | plural at ringCount >= 1 | killed: pointingKey unit, f1b |
| M2 | plural at ringCount > 2 | killed: pointingKey unit, f1b |
| M3 | aDigit "an" for 1 instead of 8 | killed: hidden-single "an" test, pointingKey unit, f1b |
| M4 | aDigit "an" for d >= 8 | killed: hidden-single "an" test only (9 not used in ring clause tests; shared helper, fine) |
| M5 | row/column N swapped | killed: pointingKey unit, f1b |
| M6 | row N not +1 | killed: pointingKey unit, f1b |
| M6b | column N not +1 | killed: pointingKey unit only (no page seed has a hidden column; unit test pins it) |
| M7 | form check dropped (naked gets unit text) | killed: pointingKey unit, f1b |
| M8 | "both boxes" -> "the box" | killed: pointingKey unit, f1b |
| M9 | page passes ringCount 1 / 0 | killed: f, f1b, f2b (1); f, f1b (0) |
| M10 | ring clause also at ringCount 0 | killed: pointingKey unit, f2b |
| M11 | "keeps" -> "keep" | killed: pointingKey unit, f1b |
| M12 | box/row-column condition inverted | killed: pointingKey unit, f1b |
| P1 | page passes a fake step {pointDigit, form:'naked'} | killed: f1b (seeds 8, 44) |
| P2 | helper reads step.digit instead of pointDigit | killed: pointingKey unit, f1b |
| C1 | stops 46-54 | killed: f4 |
| C2 | colour #8a8a8a | killed: f4 |
| C6 | colour #777 (3.9:1... below 4.5) | killed: f4 |
| C7 | hard stop broken (`#6b6b6b 56%`) | killed: f4 |
| C3 | stops 44-55 (11%, still 2.07 px) | survived; equivalent for AC 6 (still >= 2 px) |
| C4 | band 45-57 (off-centre) | survived; centring is not an AC and not guarded (nit) |
| C5 | `to bottom right` (strike mirrors to "/") | survived; direction not pinned before or after, not in any AC (nit) |

### Removals (AC 9)
1. "hintFor: any step other than 2 is the nudge; the grid is not changed": the test only called steps 1 and 2 on blank([4,7]) (despite its title), so no step 3/0/undefined was ever covered; the page only sends 1 or 2 (sudoku.js:989), so those are unreachable. Step 1 nudge / step 2 explain: "hintFor: step 1 nudge..." and "step 2 explains..." (mutant `step >= 1` explain is killed by the step 1 test). No mutation of the grid: "hintFor and findHiddenSingle do not mutate their input" (prefer x steps 1, 2). Verdict: OK, no coverage lost.
2. "hintFor: conflicts and a full grid still come before a hidden single": conflict first: "hintFor: conflicts come first, even on a full grid" and "hintFor with hidden: conflict, full grid and no single are the same for every prefer" (PUZZLE with a clash, prefer hidden); full grid: "hintFor: full grid without conflicts" (a full grid has no hidden single, so the ordering is trivially the same). Mutant R2 (conflict check after hidden single) is still killed by 4 tests. Verdict: OK.
3. page f2 first-key regex line: key presence on click 2 is pinned by f (equals pointingKey of the hint), f1b (literal clauses) and f2b. Verdict: OK. Remark: f and f2b build their expected key from the helper (hintFor(grid, 2) without level), so they check wiring, not wording; f1b carries the wording on the page.

### Findings
- must-fix: none.
- should-fix: none.
- nit 1: the two removals left a double blank line each in tests/sudoku.test.js (after the 'step 2 explains' test, line 375, and after the 'naked single before hidden' test, line 451). Deleting them gives 2 lines of headroom (1942/1215 = 1.598); at exactly 1.6000 any rework line would pass the limit.
- nit 2: the strike centring (44-56) and direction (`to top right`) are not guarded (C4, C5); not required by an AC.
- nit 3: f4 adds hint-removed to a cell of the live page and does not remove it; harmless because later tests reopen the page, but it is state left behind.
- note for the lead: memory/wiki (architecture.md pointingKey/ratio, product.md key line, backlog.md "ring clause" item) still describe the old clause; update at the close.


## Tester
