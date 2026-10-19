# Work Log: Issue #30 Teach hidden singles too: Hint prefers the technique you have applied less

- Lead: weaver-agents (lead agent, Claude Opus 5.5), session `246ca1dd-69c1-44b3-80a4-65e176ec6193`
- Branch: `issue-30-hint-balance` (from main e81999c)
- Iteration: 7 (see work-log/iteration-7.md)

## Gate check
- 2026-10-19: #30 is OPEN, written by weaver-agents (PM). Passes.

## Plan
developer -> lead check -> reviewer + tester in parallel -> rework if needed (full re-review and re-test) -> PR -> PM acceptance -> merge commit (no squash).

## Progress
- Branch and this log created. Developer launched.

## Developer round 1 (Claude Sonnet 5.5, 2026-10-19)
Commits: d6d1ba7 (code and wiring), c5acfeb (tests), 0a4a99e (README), plus this log commit.

### What was done
- `sudoku.js`: `preferredTechnique(tally, level)` (exported); `findHiddenSingle(grid, options)` with `{ notNaked: true }` (skips a cell when its row, column and box hold 8 different digits, the same test as `findNakedSingle`); `hintFor(grid, step, prefer)`: conflict and full handled first, then with `prefer === 'hidden'` the first pure hidden single, else the old order (naked, hidden, none). Any other `prefer` value, or none, gives today's order.
- Page: `currentLevel` is set in `choose(level)` (one variable, reset each time a level is chosen); the Hint click calls `hintFor(currentGrid(), hint ? 2 : 1, preferredTechnique(tally, currentLevel))`. No other new state.
- README: Order bullet (now with three sub-bullets), the "first cell in reading order" sentence of the hidden-single first click, the Files list (`findHiddenSingle` option, `preferredTechnique`, `hintFor` third argument, the frozen test file).

### Tests (E1-E4)
- `node --test`: 122 tests, 122 pass, 0 fail (was 109).
- Frozen comparison: `tests/frozen-sudoku-e81999c.js` is a byte copy of `git show e81999c:sudoku.js` (committed, so the tests do not need git history; its name does not match the `node --test` patterns, so it is not run as a test).
- Walk: 240 seeded puzzles (120 Easy seeds 3000-3119, 120 Medium seeds 3120-3239), following Hint with the preferred technique like the page, and filling a cell from the solution where Hint has nothing: 11,271 positions. E2 (prefer missing and 'naked' vs frozen `hintFor`, steps 1 and 2) holds on all. E3: 8,972 positions had a pure hidden single (8,733 of them also had a naked single, so the preference mattered), 2,299 had none (result deep-equals the old one); expected cell computed by an independent brute-force candidate oracle in the test, not by `findHiddenSingle`. E4: `findHiddenSingle(grid)` equals the frozen one, `{notNaked:true}` equals the oracle, never a naked-single cell, inputs not mutated, and the option changes the result in over 100 positions.
- Also covered: conflict, full grid and no-single results identical for every `prefer`; fallback to the naked single when the only hidden single is also naked; step 1 and step 2 name the same cell for every `prefer` (rule 4, "confirm with a test").
- Mutation check (each mutant fails at least 2 tests): drop the notNaked skip, wrong naked-single bit count, tie rule always naked, `<=` instead of `<`, `prefer !== 'naked'`. The page wiring (`preferredTechnique(tally, currentLevel)`) is not covered by unit tests, only by the E5 browser check.

### E5 headless browser check
- Script (not in the repo): `/private/tmp/claude-502/-Users-dirk-Code-weaver-team/246ca1dd-69c1-44b3-80a4-65e176ec6193/scratchpad/dom30/check.js`. Headless Chrome via CDP, real index.html, `Math.random` replaced by the same seeded generator the unit tests use so the puzzles are reproducible. The script picks the seeds itself (Easy: a naked single exists and a pure hidden single exists once it is entered; Medium: a pure hidden single and a naked single both exist at the start). Both came out as seed 1.
- Run: `node /private/tmp/claude-502/-Users-dirk-Code-weaver-team/246ca1dd-69c1-44b3-80a4-65e176ec6193/scratchpad/dom30/check.js /private/tmp/claude-502/-Users-dirk-Code-weaver-team/246ca1dd-69c1-44b3-80a4-65e176ec6193/scratchpad/wt-30`
- Result: 21 checks, all PASS, no page errors.
  - Easy: first Hint is the naked single (row 1, column 9), 20 cells tinted; entering 9 shows "Well done! You applied a naked single: ..." and "Naked single: 0 on your own, 1 with a hint". Next Hint is the hidden single row 1, column 2 (digit 5, box), not a naked single, today's nudge text, 8 cells tinted (the one unit); second click gives "Hidden single: row 1, column 2 must be 5, because every other empty cell in its box already has a 5 in its row or column." for the same cell, 5 purple-ringed cells (all the 5s); a further click shows the same text; entering 5 shows "Well done! You applied a hidden single: row 1, column 2 is 5." and "Hidden single: 0 on your own, 1 with a hint"; tint and rings are gone.
  - Medium (seed 1, naked single also present): first Hint is the hidden single row 1, column 2 (box); step 2 explains the same cell; toggling Notes twice and clicking Hint keeps the explanation; entering 5 shows the Well done text and "Hidden single: 0 on your own, 1 with a hint". The next Hint (H=1 > N=0) teaches a naked single, row 2, column 3.
  - Hint texts on the page equal `hintFor(...)` texts from the module for the same grid and `prefer`.

### Decisions and ambiguities
- Naked-single test for `notNaked`: "exactly one digit fits", read as the 8 other digits all seen in row, column and box (as `findNakedSingle` does). A cell with no candidates is not a naked single, but it also cannot be a hidden single, so this does not matter.
- The frozen copy is committed in `tests/` rather than loaded from git at test time, so the tests also work in a checkout without that commit. This adds a 750-line file; the alternative is `git show` in the test.
- Wiring is a module-level variable `currentLevel` in `render()` next to `tally`; it is set only in `choose()`. After "New puzzle" it keeps the old value until the next `choose()`, which always sets it before any Hint is possible.
- README: besides the Order bullet and Files list, one sentence of the hidden-single first-click bullet ("The first cell in reading order that is a hidden single is used") would have become untrue, so a parenthesis was added to it. The test-file description line was extended. This is in line with rule 5 ("every changed sentence literally true").
- No deviation from the issue found.
