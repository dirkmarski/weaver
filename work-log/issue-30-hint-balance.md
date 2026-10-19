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

## Review round 1 (reviewer, Claude Sonnet 5.5, head 27650b2)
Verdict: APPROVE (no Blocking, no Should-fix; four nits).

### Checks done
- Rules 1-5 and edge cases read line by line against the diff of `sudoku.js`: `preferredTechnique` (strict `<`, tie by level, own+hint added, input untouched), `findHiddenSingle` option (skip is placed before the unit loops, so order box/row/column and digits 1-9 are unchanged), `hintFor` (conflict and full first, `prefer === 'hidden'` tries the pure hidden single, then naked, then hidden, then `none`), wiring (`currentLevel` set in `choose()`, Hint passes `preferredTechnique(tally, currentLevel)`), export. All match the issue. E1-E4 are covered by tests, E5 by the headless script, E6: `node --test` 122/122 pass (reviewer re-ran).
- Frozen file: `git show e81999c:sudoku.js | diff - tests/frozen-sudoku-e81999c.js` is empty (byte-identical).
- Mutation check, 33 mutants of the tip. Each was run against `tests/sudoku.test.js` and against the headless script (re-run on the mutant tree). Script: `/private/tmp/claude-502/-Users-dirk-Code-weaver-team/246ca1dd-69c1-44b3-80a4-65e176ec6193/scratchpad/mut.js`.
  - Unit tests: every one of the 33 mutants fails at least 1 unit test (none survives): notNaked skip dropped / option ignored / always on; bitCount 8->7, no shift, `>=`; tie always naked / always hidden / hard-only / medium-only / easy inverted; `<=` in either comparison; results swapped; only own or only hint counted; `prefer !== 'naked'`, prefer always/never hidden, plain `findHiddenSingle` instead of notNaked; naked fallback removed; plain hidden fallback removed; unit order changed; export removed.
  - Headless script: all 12 UI-wiring mutants die (currentLevel not set / always easy / always medium; no prefer passed; empty tally; prefer always hidden / always naked; step always 1; level argument missing; wrong level). The 21 non-UI mutants that survive the script are the ones the script cannot see (pure functions) and the unit tests kill them. Not covered by the script: the Hard tie through the page (covered at unit level only), which is acceptable.
- Q2 traced: Hint button is inside `#game`, which is `hidden` (CSS `[hidden] { display: none !important; }`) before the first `choose()` and after `newPuzzle()`; the only keydown handler is on the grid inputs, which are removed with the table. So Hint cannot be clicked by a user while `currentLevel` is null or stale. Every path to a clickable Hint goes through `choose(level)`, which sets `currentLevel` and resets `tally`/`credited`/hint (`clearResults`). Only a programmatic `click()` on the hidden button could reach it, and then `puzzle` is null and `currentGrid()` would already fail today.
- Q1: acceptable. See finding N3.
- Test independence: E3 and the `findHiddenSingle` option tests compare against `oracleHidden`/`candidates`, a brute-force candidate model that does not call `findHiddenSingle`, `findNakedSingle` or `usedMask`; not self-referential. E2 compares against the frozen module (independent code). The walk follows the new `hintFor` only to choose which positions to visit, which does not weaken the comparison. 240 puzzles (120 Easy, 120 Medium), more than 5,000 positions, steps 1 and 2; guard thresholds (pure > 500, fallback > 50, naked also present > 200) show the preference is exercised.
- README, sentence by sentence: Order bullet, the three sub-bullets, the hidden first-click parenthesis, the Files list entries and the frozen-file line are true of the code (frozen copy is unchanged; page never loads it; tests `require` it, README says "not run as a test", which is true of the file itself). Nits below.

### Findings
- N1 (Nit) README Order bullet: "(the two counts in the block below the message)". The block shows two lines with an own and a hint number each (four numbers). Suggest "(the numbers in the two lines of the block below the message)".
- N2 (Nit) README "falls back to the naked single, then to any hidden single" and the third step in `hintFor` (hidden single after naked) are literally true of the code but unreachable when `prefer === 'hidden'`: when no pure hidden single exists and no naked single exists, no hidden single exists either. No change needed; the third step is still needed for the default order. Optional: drop "then to any hidden single" from the README to avoid a promise about a path that cannot happen.
- N3 (Nit, Q1) Frozen 750-line copy: fine for this issue. It is the only truly independent E2 oracle and it is byte-identical to e81999c (verified). Hazards: a second copy of the logic in the repo that will never be updated (a future reader may mistake it for live code), and the file is named by commit hash. Alternatives considered: `git show` at test time (breaks in shallow checkouts, as the developer noted); a golden snapshot of results (a hash of `hintFor` results for the seeded walk, a few lines, but the oracle is then opaque and cannot show a diff on failure). Suggestion: keep it, and when a later issue changes `hintFor` again either delete it or replace by a golden file. The README line already says what it is.
- N4 (Nit) The E5 check script is outside the repo (scratchpad), so it cannot be re-run after the session. The issue only asks for "a test or recorded headless check", so this meets it; if the lead wants it reproducible later, add it under `tests/` with a note that it needs Chrome.

## Lead decision after review round 1 (APPROVE, N1-N4) and test round 1 (PASS)
- Both have reported. No Blocking or Should-fix items.
- Rework round 2 is README only, because README sentences must be literally true:
  - N1: "the two counts in the block" is inaccurate. The block has two lines with four numbers.
  - N2: drop or fix the unreachable "then to any hidden single" fallback phrase in the "prefer hidden" bullet. Keep every sentence literally true.
- N3 is accepted. The frozen copy is the only independent E2 oracle. Carried forward: replace or delete it the next time `hintFor` changes.
- N4 is accepted. The issue asked for a recorded headless check, and it is recorded in this log.
- Q1 and Q2 are answered. Hint is unreachable while `#game` is hidden, so `currentLevel` cannot be stale or null when Hint is clicked.
- After round 2: full re-review and full re-test, as the carried rule requires.

## Developer round 2 (Claude Sonnet 5.5)
- README only. N1: the Order bullet now says the "on your own" and "with a hint" numbers on each technique's line in the tally block are added together. N2: the hidden-preference bullet now ends "If there is none, it teaches a naked single as above." Checked against `preferredTechnique` and `hintFor` in sudoku.js. No code changes.

## Test round 2 (tester, Claude Sonnet 5.5) - head 12e8942
- Verdict: PASS.
- Scope: fresh worktree at origin/issue-30-hint-balance. Since 27650b2 the only non-work-log change is README.md (2 lines); no code or test change.
- `node --test`: 122 tests, 122 pass, 0 fail.
- Independent oracle (oracle30.js, pointed at the new worktree): 330 puzzles (110 per level), 12,368 positions, 230,552 checks, 0 mismatches (20,064 pure hidden finds, 4,232 naked fallbacks).
- Browser check (headless Chrome over CDP, real index.html, desktop and 375px): 26 checks pass (12 per viewport plus the full-game walk and the console check), 0 failures, 0 console errors. Full-game walk: 971 steps, 0 mismatches; 130 steps took the hidden-preferred-but-naked-fallback path, 383 pure hidden, 449 naked-preferred, 9 "none", 18 filled grids.
- README sentences checked against observed behaviour:
  - Order bullet: the preference in the browser always followed the sum of the "on your own" and "with a hint" numbers read from each tally line (the check parses the two on-screen lines); ties went naked on Easy and hidden on Medium/Hard, and the level used was the one chosen last (Medium then Easy gave naked first). True.
  - "If there is none, it teaches a naked single as above": when hidden was preferred and no non-naked hidden single existed, the page taught the naked single (first in reading order) in all 130 such steps. When no naked single exists either, the "No naked or hidden single" text shows, as the README says in its no-single bullet. True.
- Rest of the Hint section re-checked (naked/hidden definitions, first/second click highlights, same cell on both clicks, notes keep the hint, entering the digit gives "Well done!", reward and tally counts, tally block text, hint cleared on value change): consistent with the browser run and the oracle. No discrepancies.
