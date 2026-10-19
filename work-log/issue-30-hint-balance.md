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

## Lead check after developer round 1 (head cdf7d7a)
- The developer is Claude Sonnet 5.5. It made commits d6d1ba7, c5acfeb, 0a4a99e and cdf7d7a.
- `node --test` passes 122/122 (lead re-ran it).
- Diff read in full. It stays in scope: sudoku.js, README, tests, and a new frozen test oracle file.
- Questions for the review:
  - (Q1) The frozen 750-line copy of the old sudoku.js is committed under tests/. Is that an acceptable oracle, or a maintenance hazard?
  - (Q2) After "New puzzle", `currentLevel` keeps the old value. Can Hint be clicked then, or before any level is chosen (null gives 'hidden' on a tie)?
- Reviewer and tester launched in parallel.

## Test round 1
- Tester: Claude Sonnet 5.5, session 246ca1dd-69c1-44b3-80a4-65e176ec6193. Tested head 27650b2 in a detached worktree. No code on the branch was edited.
- **Verdict: PASS.** No defects found.
- Unit tests: `node --test` gives 122 tests, 122 pass, 0 fail, 0 skipped.
- Independent oracle (E1-E4), `/private/tmp/claude-502/-Users-dirk-Code-weaver-team/246ca1dd-69c1-44b3-80a4-65e176ec6193/scratchpad/oracle30.js` (helpers in `/private/tmp/claude-502/-Users-dirk-Code-weaver-team/246ca1dd-69c1-44b3-80a4-65e176ec6193/scratchpad/lib30.js`; main's `sudoku.js` loaded from `git show e81999c:sudoku.js` into `/private/tmp/claude-502/-Users-dirk-Code-weaver-team/246ca1dd-69c1-44b3-80a4-65e176ec6193/scratchpad/main-sudoku.js`). The oracle uses brute-force candidate sets, not the branch code or the developer's test oracle. Run: `node /private/tmp/claude-502/-Users-dirk-Code-weaver-team/246ca1dd-69c1-44b3-80a4-65e176ec6193/scratchpad/oracle30.js`.
  - 330 seeded puzzles (110 Easy, 110 Medium, 110 Hard, generated with main's generator), 12368 positions walked (alternating naked-preferred and hidden-preferred hints to advance), 230552 checks, 0 mismatches.
  - E1: all 3 levels x 4^4 tally combinations (own/hint 0-3 for each technique) against my own formula, covers every tie and mixed counts, and tally inputs unchanged.
  - E2: `hintFor(g, s)`, `(g, s, 'naked')` and `(g, s, undefined)` deep-equal to main's `hintFor` for steps 1 and 2 at every position.
  - E3: with 'hidden' a pure hidden single existed 20064 times (step 1 and 2): result equals my first-in-reading-order, box/row/column, digit 1-9 choice (cell, digit, unit, kind, technique), and the cell is not a naked single. The other 4232 cases (fallback) deep-equal main's `hintFor`. Conflict and full grids also checked.
  - E4: `findHiddenSingle(g)`, `(g, {})` and `(g, {notNaked: false})` equal main's; `{notNaked: true}` equals my pure hidden single. Inputs never mutated (grid compared before and after every call).
- Browser (E5), `/private/tmp/claude-502/-Users-dirk-Code-weaver-team/246ca1dd-69c1-44b3-80a4-65e176ec6193/scratchpad/browser30.js` (headless Google Chrome via CDP, real index.html, `Math.random` replaced by the seeded generator). Run: `node /private/tmp/claude-502/-Users-dirk-Code-weaver-team/246ca1dd-69c1-44b3-80a4-65e176ec6193/scratchpad/browser30.js`. Screenshots in `/private/tmp/claude-502/-Users-dirk-Code-weaver-team/246ca1dd-69c1-44b3-80a4-65e176ec6193/scratchpad/shots30/` (I looked at the step 2 hidden hint, hidden reward and Medium step 1 pictures). Desktop 1280x900 and 375x800.
  - 24 scenario checks PASS (12 per viewport): Easy start naked first (cell equals my oracle, tint present); step 2 same cell; Notes toggled between the clicks keeps the hint; entering the digit gives "Well done! You applied a naked single: ..." and "Naked single: 0 on your own, 1 with a hint"; after that the next Hint is the pure hidden single (cell equals oracle, not a naked single, today's text with "in its box", 8 cells tinted, no purple rings at step 1); step 2 same cell with purple rings on exactly all cells holding the digit; Notes toggle keeps it; entering the digit gives "Well done! You applied a hidden single: row 1, column 2 is 5." and "Hidden single: 0 on your own, 1 with a hint" with the tint gone; Medium start hidden first and step 2 same cell; New puzzle then Easy: naked first (new level used, tally reset); New puzzle then Hard: hidden first.
  - Full-game walks: 6 Easy/Medium/Hard puzzles on desktop and 3 on mobile each (18 walks to a filled grid or "none"): 971 Hint clicks. At every step the expected cell and technique were derived from the tally read from the DOM and my oracle; all matched (449 naked by preference, 383 pure hidden, 130 naked by fallback while hidden was preferred, 9 walks ended at the "No naked or hidden single" text). Step 2 targeted the same cell as step 1 at every step, and every entry gave a Well done text.
  - 0 console errors or exceptions in the whole run.
  - Not run as separate cases: a Hard run ending in a fallback to a non-pure hidden single (covered by the unit tests and the oracle), and Safari (not automated).
- README (checked by hand against behaviour): the Order bullet (fewer applied first, own plus hint together, tie rule by level, "the two counts in the block below the message" is the tally block, same cell on both clicks) is true as observed; the fallback sentence (naked, then any hidden) matches the 130 fallback steps and the unit tests; the first-click hidden parenthesis is true; the Files list entries (`preferredTechnique`, `notNaked`, `prefer`) match the exports and signatures. No untrue sentence found.
- Answer to lead question Q2: after "New puzzle" the game section is hidden (`game.hidden = true`) until a level is chosen, which sets `currentLevel` first. So Hint cannot be clicked with a stale or null level; my New puzzle to another level checks confirm the new level is used.
- Observations (not defects): none.
