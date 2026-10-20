# Work Log: Issue #42, count pointing (with a hint and on your own, in the tally and the finish text)

- Lead: weaver-agents (lead agent, Claude Opus 5.5), session `48eaa449-33cf-461f-85bc-196e8d61fc39`
- Iteration: 9 (see `work-log/iteration-9.md`)
- Branch: `issue-42-count-pointing` (from main af8d50a), worktree `<scratchpad>/wt-42`

## Gate check
- 2026-10-20: #42 is OPEN, its author is weaver-agents (PM, this session) and it is labelled `enhancement`. PASS.

## Lead notes on the spec
- The scope is large for one issue but cohesive: recognition, counting, tally, finish text, "not counted" text, status kind, README. The PM chose it deliberately as the only issue.
- Risk 1: own-pointing recognition must enumerate ALL pointing steps (not just the first one that `findPointing` returns) and test whether the step makes the *entered* cell the entered digit. The developer should factor the step enumeration out of `findPointing` and reuse it, not duplicate it (PM point 2).
- Risk 2: the precedence naked > hidden > pointing, and chained steps must stay unrecognised.
- Risk 3: the finish-text change touches the existing completion tests; the tally block gains a line in index.html wiring (DOM, no repo test).

## Progress

## Developer round 1
Developer: Claude Sonnet 5.5, session `48eaa449-33cf-461f-85bc-196e8d61fc39`.

### What changed
- `sudoku.js`: `findPointing` is split into `pointingSteps(cells, fn)` (enumerates steps: boxes in reading order, digits 1-9, with the removed cells) and `singleAfterStep(cells, p, removed, d)` (is cell p a single once D is removed; naked or hidden form). `findPointing` and `classifyEntry` both use them; `pointingTarget` is gone (its body is `singleAfterStep`). The box wording moved to `pointingClause`, shared by `pointingHint` and the own message. `classifyEntry` tries naked, hidden, then every pointing step and accepts the first whose single for the *entered cell* equals the *entered digit*. `emptyTally` has `pointing`; `creditEntry` counts hinted pointing (the old early return is removed) and own pointing, and returns `kind`; `statusClass(kind)` is the exported pure mapping and `setCell` uses it (the `/^Entered: /` regex is gone); `completionFor` sums three techniques with the new text; `tallyLines`, `TECHNIQUE_DEFINITIONS.pointing` and the (a) text updated.
- `index.html`: third tally line and definition (`showTally` fills them); shown on every level because the block is already shown from level choice.
- README updated as listed in the issue.

### Decisions
- Chained steps are excluded by construction: one step is applied to the grid as it is, no step is applied on top of another.
- Confirmed on the real seeded grids (Tricky, `seededRng`): seed 1, hint 13 is pointing, naked form, row 3 column 3 = 7; own text and hinted text exactly as in criteria 1/2; seed 3, hint 20 is hidden form, row 5 column 5 = 1, exact texts as in criterion 2. Full Hint run: seed 1 finishes "0 on your own, 54 with a hint" (30 naked + 23 hidden + 1 pointing); seed 3 "0 on your own, 51 with a hint". No deviation from the spec.
- Tests pin the two walls as literals (grids before the entry) so no generation is run in the suite.

### Rule -> test (tests/sudoku.test.js)
- Hinted pointing counted, first and second click, both forms, seeds 1 and 3 -> `pointing counted with a hint ...`
- Own text on seed 1 / seed 3 walls, tally 1/0, credit -> `pointing on your own: the exact texts ...`
- Both forms; a later step than findPointing's first; entered cell and digit must match -> `classifyEntry pointing: both forms; any pointing step counts ...`
- Precedence naked > hidden > pointing -> `classifyEntry pointing: a naked or hidden single wins ...`
- Chained, wrong digit, conflict, filled cell, digit in unit -> `classifyEntry pointing: chained steps, ...` (plus text (b) on a conflict)
- Re-entry no count change, preferredTechnique unchanged -> `creditEntry pointing: re-entry ...`
- `kind` reward / notCounted / not judged and the class mapping -> `statusClass: ...`
- Tally lines -> `tallyLines: heading and three lines ...`; definition -> `TECHNIQUE_DEFINITIONS: the three texts ...`
- Finish text, sums of three techniques, 0 and 1 -> `completionFor: ...` tests (updated, plus pointing cases)
- Text (a) -> existing (a) tests with the new `NOT_SINGLE`.
- Existing tests changed only for: finish text, (a) text, tally shape (`pointing` key), `kind` in result objects; the old "pointing hint is rewarded with no count change" test was replaced.

### Mutation spot checks (all caught)
1. Naked form disabled in `singleAfterStep`: 6 tests fail.
2. Hidden form disabled: 9 fail.
3. Entered digit ignored (any step making the cell a single): 1 fails (the "both forms / any step" test).
4. Pointing recognition removed from `classifyEntry`: 4 fail.
5. Naked precedence removed: 4 fail.
6. Only the first pointing step enumerated: 7 fail.
7. Wrong box in the result: 2 fail.

### Result
`node --test`: 143 tests, 143 pass, about 0.60 s. `sudoku.js` 897 lines (was 867), `tests/sudoku.test.js` 1072 lines (was 988).
Headless Chrome, page driven on Tricky seed 1 (Math.random seeded like `seededRng(1)`): three tally lines with three definitions at 0; after 12 hinted-path entries entered on my own, 7 at row 3 column 3 shows the exact own text, class `ok`, color green, Pointing "1 on your own, 0 with a hint"; clear and re-enter shows the same text and the count stays 1. The neutral "not counted" colour was not re-checked in the browser (only via the `statusClass` unit test; the CSS is unchanged).

### Open questions
- None blocking. Note a "hinted pointing digit" entered while that cell is already credited shows "Well done!" and changes no count (same rule as the singles).
