# Issue #102: Hint teaches claiming (box-line reduction) as a fallback, with step reveal, marks and hint credit

Issue: https://github.com/dirkmarski/weaver/issues/102. Branch: `issue-102-hint-claiming`.

## Lead
- Lead: Claude Opus 5.5, session 54373c68-c664-43ac-8c9e-31688e9eba82. Gate passed (open, author weaver-agents, enhancement).
- Baseline main 61f2db8: 175/175 tests, skipped 0. Ratio tests 2232 / product 1399 = 1.595, cap 1.6x = 2238.4 (6.4 lines headroom now; every product line added earns 1.6 test lines).
- Spec: the issue body is the spec (Behaviour, AC 1-8). PM decisions D2-D6 in `work-log/iteration-21-product.md`.
- Plan: developer part A (logic: `findClaiming`, Hint order and "none" text, nudge/explanation texts incl. struck-cell list and box-case suffix, reward message, fourth tally line, `TECHNIQUE_DEFINITIONS.claiming`, completion sum, README, unit tests), then developer part B (claiming in `hintMarks`/`hintKey`, step reveal wiring, at least one page test, page evidence: a fallback position, screenshots 375x812 and 1280x900 stages 1-3, 360x740 stage-2 Next step button in view). Reviewer then tester, one at a time.
- Risks for review/test: pointing and hidden-single results must stay unchanged (existing tests untouched unless a listed, confirmed redundant removal); ratio cap; the stage-2 fit at 360x740 (memory says 1.1 px spare for pointing; PM quick check got a different absolute, 675.9 vs 738.9: the tester measures absolutes with emulation set before load).

## Developer

### Part A (logic, texts, rewards, README)
- Model Claude Sonnet 5.5, session 54373c68-c664-43ac-8c9e-31688e9eba82. Commit d3279a8 (code, tests, README).
- Done: `findClaiming` (shares `firstTarget` with `findPointing`; `singleAfterStep` got a `skip` argument so claiming never gives a box-form target), claiming after pointing in `hintFor` on all levels, new "none" text, `claimingHint` (nudge and 4-line explanation, same result shape as pointing, `technique: 'claiming'`), generic `struckCells(removed)` (also used by pointing, same output), hinted-claiming reward via `hintApplied`, fourth tally line and `TECHNIQUE_DEFINITIONS.claiming`, completion sum, `index.html` `#tally-claiming` / `#definition-claiming` and `showTally` wiring, README (Hint, tally, API).
- Tests: 181/181, skipped 0. Ratio 2324 / 1471 = 1.58 (cap 2353.6). Six existing assertions only extended for the fourth tally key (tally deepEquals, tallyLines, MIXED, completion helper, definitions) and the new none text; none removed. Positions are Hard-seed walks (provenance in test comments); steps cross-checked against the PM's spike-lib on 20000 random partial grids (0 differences, box-form aside). 16 mutants of the new logic run, all killed (one survivor found a missing count-accumulation test, added).
- Not tested here: marks/key for claiming, step reveal wiring, page rendering of the fourth line (part B); own claiming (#104).

### Part B (marks, key, step reveal, page tests, page evidence)
- Model Claude Sonnet 5.5, session 54373c68-c664-43ac-8c9e-31688e9eba82. Commit d7dba1a (code, tests, README); this log entry follows.
- Done: `hintMarks` and `hintKey` handle claiming (the pointing branch widened to "pointing or claiming"; the first reason set comes from the line, tint = box + line + hidden unit); the page: `pointingExplain` true for claiming, `hatchedRings.d` = `pointDigit` for both. Every other `technique === 'pointing'` site checked: the creditEntry/classifyEntry/generator ones are logic for own pointing, left alone. AC 8: export line wrapped, longest line in sudoku.js 250 (was 295; 267 before #102).
- Tests: 183/183, skipped 0. Ratio 2360 / 1475 = 1.600 (exactly the cap). New: unit `hintMarks and hintKey, claiming` (naked row, hidden row, hidden column, key stage 1 row and stage 3 column) and page `f5` (Hard seeds 57 naked and 184 hidden: stages 1-3 classes, keys, Next step labels, focus, hinted entry counted on the fourth line). Existing page assertions extended for the fourth tally id (TALLY0 4 entries, two `b.` tests, the zero-tally test also pins the claiming definition on the page).
- Removed from part A's tests to stay under the cap (each covered): `tallyLines(r.tally)[4]` (covered by page f5 `tally[3]` and the `two` line), `hintApplied(hint, '8') === ''` (the digit-mismatch branch is shared and pinned by the pointing/single tests), plus three own assertions dropped while writing (naked column marks, key stage 2 column, key without hatched clause; covered by CL.D key, page f5 and the pointing key test).
- Mutants run (all killed): line vs box reason set, key "in the row" vs box, `pointingExplain`, the pointing-branch widening in hintMarks and in hintKey. Survivor by design: `hatchedRings.d` fallback for claiming alone (killed only by the pointing f1d; claiming link digit not pinned).
- Evidence (AC 7): /tmp/wvr/claude-502/-Users-dirk-Code-weaver-team/54373c68-c664-43ac-8c9e-31688e9eba82/scratchpad/dev-b/ (README.md, shots/, evidence.js). 360x740: Next step button after step 2 (label 3 of 3) top 704.1, bottom 738.9 (<= 740), after step 1 bottom 675.9, scrollY 0, both seeds.
- Not tested: claiming link sentences on the page, notes-keep and clearing paths for claiming specifically (shared code with pointing, f and f1a cover those), own claiming (#104).

## Reviewer

## Tester
- Tester: Claude Sonnet 5.5, session 54373c68-c664-43ac-8c9e-31688e9eba82. Head tested: cdd6a42 (baseline 61f2db8). Scripts, shots and README: /tmp/wvr/claude-502/-Users-dirk-Code-weaver-team/54373c68-c664-43ac-8c9e-31688e9eba82/scratchpad/test-102/ (re-run: see its README). Suite on head: 183/183, skipped 0, 3.5 s.
- Verdict: pass with findings (no defect against AC 1-8; one low finding, informational notes).
- Checks: t1 oracle 66/66, t2 real page (real CDP input) 157/157, t3 layout 90 (87 pass, 3 fail = finding 1), t4 screenshots 8/8, t5 regression vs 61f2db8 18/18, t6 AC 8 12/12, t7 mutants 3/3.
- Findings:
  1. (low) Claiming column naked Hard seed 108 at 360x740: after step 2 the Next step (3 of 3) button is 725.1-759.9, 19.9 px below the 740 viewport; the user scrolls. Pointing hidden Hard seed 14 does the same on main 61f2db8 (759.9), so the fit depends on text length and AC 7 pins only the developer cases (seeds 57 and 184: bottom 738.9, 1.1 px spare, in view). Not fixed here.
  2. (info) 360x740: 675.9 is the Next step bottom after step 1 (label 2 of 3), 738.9 after step 2 (label 3 of 3); numbers identical with emulation set before or after load. This reconciles the PM's 675.9 with the memory's 738.9.
  3. (info) Ratio is exactly 2360 / 1475 = 1.6000, cap 2360.0, zero headroom: any further product line needs 1.6 test lines or a trim.
  4. (info) Hidden-unit order (row before column): no position exists where a taught claiming target (Hint reaches claiming only when no single exists) is a hidden single in both row and column after the step; reasoned and checked on 33448 walk states (every dual target was already single before the step). One exists only through a direct findClaiming call on a grid that still has a single (Hard seed 1 start grid); there the product returns row, as the oracle does. No seeded test pins it; low risk.
  5. (info) At 1280x900 the step-2 Next step button is below the fold (909.0, same as pointing on main); the stage-3 invitation is in view.
- Removed assertions: both (`hintApplied(hint, '8') === ''`, `tallyLines(r.tally)[4]`) were added in d3279a8 and dropped in d7dba1a; neither exists at 61f2db8, so no existing assertion was removed. Redundant: mutants (digit guard removed; claiming line own/hint swapped; page claiming line wired to lines[3]) are killed by the hintApplied and tallyLines tests and page f5/a/b.
- Not tested: touch input, screen readers, DPR other than 1, claiming on Easy/Medium/Tricky pages (no fallback arises there), own claiming credit (#104), the Tough level (#103), the box-case suffix and the 3-row cells list on a page (unit tests only).

## Reviewer
- Reviewer: Claude Sonnet 5.5, session 54373c68-c664-43ac-8c9e-31688e9eba82. Head reviewed: d2844da (diff 61f2db8..HEAD). Suite on that head: 183/183, skipped 0.
- Verdict: approve with nits.
- Findings:
  1. should-fix (shared code, also pre-existing for pointing): the hidden-form unit order "row, then column" in `singleAfterStep` (sudoku.js, `var kind = [2, 0, 1][k]`) is unpinned: swapping to `[2, 1, 0]` survives the whole suite. Spec: "tried row then column". A position where a cell is a hidden single in both its row and column after a claiming step (and for pointing, after a pointing step) is needed to kill it. Lead may defer as pre-existing for pointing; for claiming it is a spec rule with no test.
  2. nit (tests): naked-form claiming on a column line has no marks or key assertion (CL.B is only in finder and text tests; the page seeds 57 and 184 are row lines). Mutants that make the marks or key depend on form for a column line survive, but the product code has no such branch (marks and key are form-independent and the hidden column line CL.D is pinned), so the risk is low. AC5 is met in substance: row key at stage 1 (CL.A) plus column key at stage 3 (CL.D, which includes the stage-2 clause) and the page test pins stage 2 on rows.
  3. nit: README and comment prose are consistent with behaviour; no mismatch found. No line longer than the file's longest at 61f2db8 (sudoku.js 250 vs 267, others unchanged).
  4. Pointing output unchanged: `skip` defaults to 0 (`skip || 0`) so pointing walks box, row, column as before; the generic `struckCells(removed)` gives the same strings for pointing (single cell, one row, one column; confirmed by the untouched pointing and issue-96 tests, and mutant 22 below kills a deviation).
- Removals confirmed redundant: (a) `hintApplied(hint, '8') === ''`: mutant removing the `String(hint.digit) !== value` guard is killed by `hintApplied: reward only for the hinted digit` and `hintApplied: hidden single reward text ...`; the guard is shared by all techniques. (b) `tallyLines(r.tally)[4]`: mutants swapping own/hint or using pointing counts in the Claiming line are killed by `tallyLines: heading and four lines` and the page tests (a, f5); the cell-once count is still pinned by `again`.
- Mutants (run in the review worktree, restored each time, `git status` clean at the end):
| # | Mutant | Result |
|---|---|---|
| 1 | rows/columns order swapped | killed: findClaiming order test |
| 2 | digits descending | killed: findClaiming order test |
| 3 | no single-box confinement | killed: page + none-text test |
| 4 | removed may be empty | killed: findClaiming no-step test |
| 5 | min spots 1 instead of 2 | killed: findClaiming no-step test |
| 6 | box-form allowed (skip 0) | killed: findClaiming no-step / box-form test |
| 7 | `useful` ignored | killed: findClaiming useful test |
| 8 | removed includes confined | killed: page f5 + none-text test |
| 9 | reasons from box not line | killed: claiming marks test + page |
| 10 | key says "box" | killed: claiming marks/key test + page |
| 11 | key stage-2 clause at stage 1 | killed: hintKey tests + page |
| 12 | hatched clause at stage 2 | killed: hintKey tests + page |
| 13 | `hatchedRings.d` = hint.digit | killed: page f1d |
| 14 | hintApplied without claiming | killed: claiming rewards test + page |
| 15 | box-case suffix never / always | both killed: claiming text test |
| 16 | hidden unit number r/c swapped | killed: claiming text test |
| 17 | pointingExplain without claiming | killed: page f5 |
| 18 | claiming before pointing | killed: pointing tests + page |
| 19 | completion sum drops claiming | killed: completionFor sums |
| 20 | tint drops the line | killed: hintMarks tests |
| 21 | hidden reasons ignore removed | killed: hintMarks tests + page |
| 22 | struck single cell worded as column | killed: pointing column / issue-96 tests |
| 23 | target not in reading order | killed: page + pointing tests |
| 24 | hidden unit order column before row | SURVIVED (finding 1) |
| 25 | key fixed to "row" | killed: claiming marks/key test |
| 26 | credit copy drops claiming | killed: claiming rewards test |
| 27 | definition text cut | killed: definitions test |
| 28 | wrong-digit guard in hintApplied | killed (removal a) |
| 29 | tally line 4 swap / pointing counts / page element | all killed (removal b, page a) |
| 30 | naked-column marks/key form-dependent (artificial) | SURVIVED (finding 2, nit) |
| 31 | skip 2 | killed |
| 32 | definition element removed from index.html | killed: page |
- AC 1-8 adequately tested: yes, with the two gaps above (AC1 "rows/columns" hidden order within the unit, AC5 naked column).
- Not checked: ratio recomputed with the lead's counting method (my count differs; trusted the lead's 2360/1475), screenshots and 360x740 fit (AC7 page evidence), visual CSS, real-input (CDP) behaviour, Tricky useful pointing beyond the existing tests, performance of `findClaiming`.
- Read: lessons.md Review and Testing sections; the Lead section of this log; issue #102; the full diff of sudoku.js, index.html, README.md, tests. LOG.md not read.

## Lead review
- Head a216dc4. Suite 183/183, skipped 0 (lead run). Ratio 2360/1475 = 1.600 = cap (0 headroom; #103/#104 must budget test lines per product line or trim first). Longest lines: none above the 61f2db8 maximum per file (export line wrapped in part B).
- Re-ran the tester's t2-page (157/157), t5-regress (18/18), t3-layout (87/90, the same 3 findings) from test-102/ while wt-test exists; output live at 15:55. Lead mutants: confinement minimum 3 (31 fail), claiming skip 0 = box-form allowed (1 fail): both killed.
- No rework round. Reviewer F1 (hidden-unit row before column unpinned): the tester shows a dual row/column target is not reachable by Hint (claiming only runs with no single); direct-call order matches the spec (row); deferred (ratio at cap). Reviewer F2 (naked column marks not asserted): nit, accepted (no column-specific branch; CL.D pins the column key). Tester F1 (column-line naked seed 108 at 360x740: step-2 Next step bottom 759.9 > 740): same on main for pointing hidden seed 14, so a pre-existing fit limit for 3-line step-2 texts, not introduced here; AC7 met on the evidence cases (738.9). Raised to the PM at acceptance.
- PM layout question: 675.9 = button bottom after step 1, 738.9 = after step 2 (tester: same with emulation before or after load).
- The two removed assertions were part A's own new ones (none existed at 61f2db8); reviewer and tester confirmed redundant.

## Lead: acceptance and merge
- PM accepted on head ec5633a (PR #105 comment 6358568993; personas understand 4.33, marks match 4.78; PM log 9a4ddac, work-log only). Verified on GitHub: comment author weaver-agents, PR head 9a4ddac, diff ec5633a..9a4ddac is work-log only. Merge with a merge commit on the head after this log commit (`sha` pinned).
