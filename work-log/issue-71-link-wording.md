# Work Log: Issue #71 — explanation wording: hatched-cell link lead-in and naked-form reason

- Issue: https://github.com/dirkmarski/weaver/issues/71 (author weaver-agents / PM, label enhancement)
- Iteration 16, lead session `5094a0cd-ce46-4292-89b5-76375233fea2`
- Branch `issue-71-link-wording` from main 8b6cbc7

## Lead
- 2026-10-21: Gate check passed (open, author weaver-agents, label enhancement). Branch and this log created. Baseline 170/170, skipped 0; ratio 2012/1277 = 1.575x (cap 2043).
- Supervision: fixed evidence reports per agent; lead spot-checks (diff stat vs claimed files, removed-assertion list vs test diff, suite run, re-run of named mutants, AC map vs issue).
- Developer f4942c8: diff stat matched the report; product diff = exactly the AC 1/2 strings; 170/170 skipped 0; ratio 2012/1277 unchanged; no assertion removed.
- Reviewer APPROVE (6/6 mutants killed), tester PASS (4150 replay snapshots vs main, 1763 diffs all the two intended texts, 0 unexplained; oracle 11/11; pins P1-P3 exact). Log commits cherry-picked (602771c, a1fd36f).
- Lead check: re-ran a mutant (drop "now" in the naked sentence): killed by 3 tests (unit naked-form, #56 pins, page); restored. Looked at naked-375.png: sentence wraps 6 lines, readable, no overlap. No leftover headless Chrome. No rework needed. Ready for PR.

## Developer
- Changed two text lines in sudoku.js (ringLink lead-in; naked-form pointing sentence) and README (link example, naked-form sentence); edited 9 existing pins in place (3 page, 6 unit). No new tests, no assertions removed. Suite 170/170, skipped 0. Ratio 2012/1277 unchanged.

## Reviewer
- Reviewed f4942c8 vs 8b6cbc7 (diff, README word-diff). VERDICT: APPROVE. Suite 170/170, skipped 0.
- AC 1-2: sudoku.js ringLink and naked-form sentence match the issue text exactly (incl. "With D now ruled out there", D then X). AC 3: only 2 product lines differ in sudoku.js; no other product file touched; hidden form, nudges, key/invitation untouched. AC 4: P1/P2 in ringLink unit pins and f1c, P3 in f1d (link) and the page naked `endsWith` (second sentence), P4 in the WALL_ROW unit pin and the #56 P(4) pin. AC 5: README has two link examples and one naked sentence, all updated; no old text left. AC 6: 9 pins edited in place, no new tests.
- Old-text grep (git grep for "cannot be D", "could only take", "so it must be", "Row R, column C") leaves only new text and the unchanged hidden-form sentence. memory/wiki/product.md and backlog.md still describe the old wording (not in scope; for close-out wiki update).
- Mutants (each full `node --test`, restored): M1 swap D/X in naked sentence killed (unit naked-form pin, #56 pin, page); M2 drop "now" killed (same); M3 change ": no D here, because" killed (ringLink pins, f1c, page); M4 revert lead-in to "Row" killed (same); M5 drop "and box" from reason clause killed; M6 ". With" to ", with" killed. 6/6 killed.
- Legibility: sudoku.js:344 is 257 chars, same style as the sibling line 345; a split is not warranted (nit at most).
- Not checked: on-screen rendering, persona wording quality, the page f1d explanation's first sentence (unchanged, not asserted in full by the page test beyond the prefix).

## Tester
- 2026-10-21, tested f4942c8 vs main 8b6cbc7, headless Chrome, scripts in scratchpad test-71 (run.sh). AC1 and AC2: 4 pin strings plus 1 one-partner and 1 two-partner link exact (8 checks). P1-P3 exact match (y,y,y). AC3 replay: 4150 snapshots (1167 hint/focus/verify walk + 2983 play-through with rewards, clash, verify, solved), 1763 diffs, all classified: 1636 link lead-in only, 31 naked-form sentence only, 96 both; 0 unexplained (all other text, classes, marks, badges, tally identical). Oracle: Tricky seeds 1-5, 11 naked-form cases, 0 mismatches. 375 px: no horizontal overflow; naked sentence wraps to 6 lines, link line 3 lines (screenshots naked-375.png, link-375.png). README has new wording, no old wording left. Suite 170 pass, 0 fail, 0 skipped. No defects.

## Change log (spec changes, from the PM)
