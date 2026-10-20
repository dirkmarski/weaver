# Work Log: Issue #65 Hint explanation: hatch the cells the rings rule out, and a key line for hidden singles

Iteration 14. Branch `issue-65-hatch-ruled-out`. Session `c0f6ffb1-d246-448a-942e-3cfd5baa05e4`.

## Lead
- Lead: weaver-agents (lead agent, Claude Opus 5.5).
- 2026-10-21: Gate check passed: #65 is open, authored by weaver-agents (PM), label enhancement. Only issue of iteration 14.
- Branch created from main at 9c5542b. Developer works in worktree `<scratchpad>/wt-65`.
- Gates: developer -> reviewer and tester in parallel (own detached worktrees) -> one rework round -> lead check -> PR -> PM acceptance on a stated head -> merge commit. CSS change: the tester measures the hatch layers numerically at 375 and 1280 px, with and without notes, and takes screenshots. Ratio at most 1.6x on the PR head (AC 9); any removed assertion is listed with its remaining coverage and confirmed by reviewer (mutant) and tester.

## Developer
- Developer: Claude Sonnet 5.5 (claude-sonnet-5-5). Did not read governance/LOG.md or any work log other than this issue log.
- Design: `hintMarks` returns a new field `hatched` (the existing `reasons`, de-duplicated and sorted ascending; empty on a nudge and for a naked single, as the `d && explain` gate was already there). The page adds class `hint-hatched` to those cells; `clearResults` removes it with the other hint classes (no `data-d`, no badge). CSS `td.hint-hatched` lists both layers: `repeating-linear-gradient(135deg, rgba(106,31,181,.3) 0 1.5px, transparent 1.5px 8px)` first, then the amber tint. `pointingKey(step, ringCount)` is generalised and renamed `hintKey(hint, hatchedCount)`: pointing = fixed head plus the hatched clause when count > 0; hidden single = hatched clause alone; the W variants are gone. The page shows a key for every explain that is not naked.
- Tests changed (adapted, none added beside): sudoku.test.js: "hintMarks: tint ..." (hatched for nudge, explain pointing, hidden-form pointing, naked, hidden single), "hintMarks, hidden single ..." and "hintMarks, pointing: reason cells ..." now assert `hatched` (ringsOf became marksOf), "pointingKey: ..." became "hintKey: ..." (pointing with/without hatching, hidden single, "an 8"). page.test.js: `read` and `noHint` carry hatched; f asserts hatched and the key; f1b became literal pins P1 (hatched, key, computed background-image has stripe and tint layers) and P3 (hatched, key, a value change clears both); f2 now expects the hidden-single key and none for naked; f2b: no hatched cell and no hatched clause; the pointing-state picker uses the hatched count.
- Removals: none (the W-clause cases of the old pointingKey test and the old f1b by-form ring clause cases were replaced by the new text cases, not trimmed assertions).
- Pins: P1-P5 checked: hatched sets, rings and key texts equal the issue on seeds via `hintFor`/`hintMarks`/`hintKey` (P5 with the 8 rounds simulated; hatched and rings empty), P1 and P3 pinned on the real page by f1b; P2 seen in a 375 px screenshot (stripes on top of amber, notes/digits intact).
- Mutants tried: dropping `hint-hatched` from the clearResults removal list fails 3 tests; dropping the tint layer from the hatched rule fails the computed-style guard.
- Ratio: tests 1952 / product 1220 (index 41, style 131, sudoku.js 1048) = 1.600x.
- Counts: `node --test`: 167 tests, 167 pass, 0 fail, 0 skipped.

## Reviewer

## Tester
