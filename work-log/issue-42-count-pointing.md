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

## Lead check, round 1 (head 429e2d4)
- Head verified on origin; 3 developer commits (Sonnet 5.5 trailer); `node --test` 143/143, about 0.58 s.
- Diff read (sudoku.js, index.html): `findPointing` was split into `pointingSteps` + `singleAfterStep` and reused by `classifyEntry`, with no duplication (PM point 2 met). The `findPointing` loop semantics are preserved (the filled-cell skip moved into `singleAfterStep`). Hinted pointing is now counted; the status class comes from `statusClass(kind)`, and the regex is gone. Chained steps are excluded by construction (one step applied to the current grid).
- Concern L1 (criterion 3): the developer reports no test pins **hidden before pointing** precedence (a mutant that tries pointing before hidden would survive). The reviewer is asked to confirm; if it survives, it is a must-fix.
- PASS to review and test in parallel.

## Review round 1
Reviewer: Claude Sonnet 5.5 (claude-sonnet-5-5), session `48eaa449-33cf-461f-85bc-196e8d61fc39`. Head 3a84c1b. Posted as an issue comment.
**Verdict: APPROVE** (no must-fix; one should-fix, a test gap).

**Checked**
1. Recognition: `classifyEntry` tries naked, hidden, then `pointingSteps` in findPointing order and accepts the first step whose `singleAfterStep` for the entered cell equals the entered digit. Both forms, first-in-order, chained steps (one step applied to the grid as it is) and the null cases (conflict, filled cell, digit in unit, invalid digit) match the issue. `findPointing` keeps its loop semantics (first step, first target in reading order); `hintFor`/`pointingHint` output is unchanged (`pointingClause` is shared). No duplication: both callers use `pointingSteps` + `singleAfterStep`.
2. Counting: hinted and own pointing in `creditEntry`, re-entry (text again, no count, kind `reward`), `emptyTally`, `completionFor` sums, `tallyLines`, the definition, text (a), `kind`, `statusClass` and the index.html wiring are correct. Text (b) unchanged.
3. L1: the hidden-before-pointing mutant is CAUGHT (4 failures), as is pointing-before-naked-and-hidden (4). The developer's note was wrong on this: the precedence test pins both.
5. README: every changed sentence checked against the code; no stale text found ("not counted yet", "Singles applied", "two lines" and the old (a) text are gone).
6. Tests are targeted, on pinned literal walls, with no sweeps or oracles; the rule -> test mapping holds. 143 pass in about 0.6 s.

**Mutation spot checks (15, on a detached worktree, restored and removed)**
| # | Mutant | Result |
|---|---|---|
| 1 | pointing tried before hidden | caught, 4 fail |
| 2 | pointing tried before naked and hidden | caught, 4 fail |
| 3 | entered digit ignored | caught, 1 fail |
| 4 | completionFor drops pointing | caught, 2 fail |
| 5 | tallyLines pointing own/hint swapped | caught, 1 fail |
| 6 | statusClass inverted | caught, 1 fail |
| 7 | re-entry returns kind '' | caught, 1 fail |
| 8 | creditEntry tally copy loop drops `pointing` | **SURVIVED, 0 fail** |
| 9 | hidden form ignores the removed cells | caught, 8 fail |
| 10 | hidden unit order row-first in singleAfterStep | caught, 1 fail |
| 11 | clause row/column number off by one | caught, 3 fail |
| 12 | findPointing takes the last target cell | caught, 5 fail |
| 13 | own credit booked as hint | caught, 7 fail |
| 14 | `if (cells[p]) return null` removed from singleAfterStep | survived (redundant guard, see nit) |
| 15 | extra acceptance of step digit as entry digit | caught, 1 fail |

**Should-fix**
- S1 (mutant 8): no test carries a pointing count through a later credit. In the real code the copy loop keeps `pointing`; if it were dropped, any single credited after a pointing entry would reset the Pointing count to 0 and nothing fails. Add a short assertion, e.g. in the re-entry test: credit pointing on SEED1_WALL, then credit a naked or hidden single on another cell with that tally and expect `pointing: {own: 1, hint: 0}` and the single's count 1 (or two pointing entries giving 2).

**Nits**
- N1: the `if (cells[p]) return null;` guard in `singleAfterStep` is redundant (callers never pass a filled cell that can qualify; `removed` holds only empty cells and `spotsFor` skips filled cells). Dropping it saves a line; keeping it is harmless.
- N2: `creditEntry` builds the `where` string and the two texts inline; fine, but the long ternary line could be split for legibility.

Formatting is clean. Nothing out of scope was added.

## Test round 1 (head 3a84c1b)
Tester: Claude Sonnet 5.5, session `48eaa449-33cf-461f-85bc-196e8d61fc39`. Verdict: PASS, no defects. Full result in the #42 comment.
- `node --test`: 143/143, 588 ms.
- Real page, headless Chrome (CDP, real key events, seeded Math.random): seed 1 hint 13 (hinted: unchanged "Well done!", Pointing 0/1; own: exact text, green, 1/0); seed 3 hint 20 (hinted and own, exact text); wrong digit -> text (a), neutral, no count change; conflict grid -> text (b); re-entry -> text again, no count change; seed 1 Hint to the end -> "0 on your own, 54 with a hint"; tally block 3 lines + 3 grey definitions at 0 on all four levels, hidden on picker; singles regression and Hint order unchanged; 375 px layout fine (screenshot `ts42-tools/layout375.png`).
- Independent check on seeds 1 and 3 only: (3,3)=7 on seed 1 is pointing-only (candidates {1,7}, not hidden), (5,5)=1 on seed 3 is the hidden form after the row-9 pointing step.
- Note: re-entry after clearing a hinted cell shows the own "Well spotted!" text (the hint is gone), count unchanged; consistent with the credited-cell rule.
- Not retested: hidden-before-pointing precedence mutant (L1), left to the reviewer.

## Lead decision after round 1 (review APPROVE, test PASS)
- L1 closed: the lead re-ran "pointing tried before naked and hidden" independently, and 13 tests fail. The developer's note was wrong; the precedence is pinned.
- S1 confirmed by the lead: with `pointing` dropped from the creditEntry tally copy loop, 143/143 still pass. **Round 2 must add** an assertion that a Pointing count survives a later credit.
- N2 (split the own-text ternary in creditEntry): fold into round 2; it is cheap.
- N1 (redundant filled-cell guard in singleAfterStep): **keep**. It is harmless and keeps the helper safe without relying on the callers' contract. No change.
- Re-check scale (per the iteration-8 lesson): round 2 is a test plus a tiny legibility refactor, with no behaviour change. It gets a delta re-review (re-run mutant 8, read the N2 diff) and a re-test (suite plus the tester's existing run.js page smoke), not a full re-run.

## Developer round 2
Developer: Claude Sonnet 5.5, session `48eaa449-33cf-461f-85bc-196e8d61fc39`.
- S1: in the re-entry test, after crediting pointing at (3,3)=7 on the seed 1 wall, a hidden single at (5,1)=7 (grid with the 7 entered) is credited with the returned tally; expects `pointing` still `{own: 1, hint: 0}` and `hidden` `{own: 1, hint: 0}`. (The seed 1 wall itself has no single, so the entered grid is used.)
- Mutant (drop 'pointing' from the creditEntry tally copy loop): now fails the test (pointing 0/0 instead of 1/0). Restored.
- N2: the own-text ternary in creditEntry is now an if/else with a named `unit`; texts byte-identical, no behaviour change.
- `node --test`: 143/143 pass, 579 ms (no new test, one added assertion block).
