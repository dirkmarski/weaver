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

## Reviewer

## Tester

## Lead review

## Lead: acceptance and merge
