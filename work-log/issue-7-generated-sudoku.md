# Work Log — Issue #7: Generated sudoku

- Issue: https://github.com/dirkmarski/weaver/issues/7
- Lead: weaver-agents (lead agent, Claude Opus 5.5), session `21813484`
- Branch: `issue-7-generated-sudoku`

## Gate check
- 2026-10-16: Issue #7 is OPEN and authored by Dirk Marski (`dirkmarski`). No prior branch, PR or work log for #7 existed, so this is a fresh start. Work proceeds.

## Requirements (from issue)
- R1: When the page loads, the user chooses the difficulty before a sudoku is generated (no grid is generated or shown before the choice).
- R2: Sudokus are generated, not taken from a bank of known puzzles.
- R3: Difficulty levels: easy, medium, hard.
- R4: Time from choosing the difficulty to the rendered sudoku is under 2 seconds.

## Ambiguities and interpretation
- The issue does not define what makes a puzzle easy, medium or hard. Lead decides (D3).
- "Generated" is read as: a random complete grid is built at run time, then cells are removed. A fixed grid that is merely relabelled/shuffled would be close to a bank, so it is not allowed.
- The issue does not say whether a puzzle must have a unique solution. A proper sudoku has exactly one solution, so the lead requires it (D2).
- The issue does not mention starting a new puzzle after one is shown. See D6.

## Decisions
- D1: Generator, in plain JS, no dependencies:
  1. Build a full valid grid with randomised backtracking (random digit order per cell).
  2. Remove cells in random order; keep a removal only if the puzzle still has exactly one solution (solution counter that stops at 2).
  3. Difficulty grading per D3.
  The RNG is injectable (default `Math.random`) so tests can be deterministic.
- D2: Every generated puzzle has exactly one solution, and its givens agree with that solution.
- D3: Difficulty definition (givens count plus the logic needed to solve it):
  - Easy: 36-40 givens, solvable using naked singles only.
  - Medium: 30-35 givens, solvable using naked and hidden singles.
  - Hard: 22-29 givens, unique solution, no restriction on technique.
  The developer may tune within the spirit of this if a band proves hard to hit inside the time budget, and must record the final values in the README.
- D4: Time budget: generation must finish well inside 2 s on a normal laptop (target < 500 ms typical, hard internal cap so the 2 s limit is never exceeded; on cap, fall back to the best valid unique puzzle found so far for the level).
- D5: The fixed `PUZZLE` and `SOLUTION` are removed from gameplay. A known-valid grid may remain only as a test fixture inside `tests/`.
- D6: UI flow: on load, show a difficulty prompt (Easy / Medium / Hard buttons) and no grid. On choice, generate and render the grid, show the chosen level, and keep Verify working as today (rules only). A "New puzzle" button returns to the difficulty prompt — minimal and needed so the user is not forced to reload; recorded as a lead decision.
- D7: Commit and PR convention: `[<agent>][session 21813484] <message> (#7)`. Each agent uses the co-author trailer for its own model and version.
- D8: Gates:
  - developer (implementation + unit tests: validity, uniqueness, givens bands, technique grading, timing);
  - reviewer and tester in parallel (tester: headless Chrome, load flow, each level many times, measured click-to-render time, Verify regression);
  - lead check;
  - merge with a merge commit (no squash).

## Progress
- Branch `issue-7-generated-sudoku` created from main (74bfefa). Work log created.
- Developer agent launched (session 21813484) to implement D1–D6 with unit tests and README update.
- Developer agent (Claude Sonnet 5.5, session 21813484) delivered commit ffd8ada:
  - Generator in `sudoku.js`: bitmask backtracking (most-constrained cell first) for full grid and solution counting; random-order removal to a random target in the level band; easy keeps removals only if solvable by naked singles, medium by naked+hidden singles (both imply uniqueness), hard by solution count = 1. Retries until in band; 1000 ms internal cap with fallback to best valid unique puzzle.
  - API: `generatePuzzle(level, {rng, maxMs})`, `generateSolution`, `seededRng` (mulberry32), `countSolutions`, `solvableBy`, `LEVELS`.
  - `PUZZLE`/`SOLUTION` removed from `sudoku.js`; known grid kept only in `tests/fixture.js` (D5).
  - UI: difficulty prompt on load (no grid), level label, New puzzle button; `[hidden]` CSS rule added.
  - D3 bands unchanged (no tuning needed); 200 puzzles/level all in band per developer.
  - Tests: 50/50 (`tests/generator.test.js` new, 19 tests). Node timing max: easy 1.2 ms, medium 2.3 ms, hard 6.4 ms.
  - Developer notes: cap path only covered by `maxMs: 1` test; hard puzzles may sometimes be solvable by singles (consistent with D3); cosmetic naming nit `PEERS_MASK_UNITS`.
- Lead check: diff in scope, `node --test` 50/50 locally, generator code reviewed at a glance (sound).
- Lead opened PR #8: https://github.com/dirkmarski/weaver/pull/8. Reviewer and tester launched in parallel on ffd8ada.
- Reviewer agent (Claude Sonnet 5.5, session 21813484) verdict: APPROVE (PR comment). No blocking/should-fix.
  - Independent solver, 400 puzzles/level: all in band, all unique, consistent. Hard max 53 ms.
  - Soundness of `solvableBy` ⇒ uniqueness confirmed; no infinite loops; fallback always unique, may exceed band max (documented).
  - Nits: (1) ~56% of Medium puzzles are solvable by naked singles alone and ~56% of Hard by singles alone, so levels can overlap technically; (2) tiny `maxMs` can return the full grid, `maxMs: 0` falls back to default via `||`; (3) `maxMs: 1` test does not prove cap path ran; (4) `PEERS_MASK_UNITS` naming; (5) 1500 ms test threshold lax.
- Tester agent (Claude Sonnet 5.5, session 21813484) verdict: PASS (PR comment).
  - Headless Chrome, 90 puzzles/level (loop + fresh loads): all distinct, unique, in band; Math.random not called before choice.
  - Click-to-render max 33.6 ms (all levels), far below 2 s. Regression (input, Verify, conflicts, Solved, New puzzle, no duplicate handlers, no console errors) OK.
  - Screenshots in session scratchpad: issue7-prompt.png, issue7-hard.png, issue7-conflict.png. Lead viewed prompt and hard screenshots: correct.
- Lead decision D9 (amends D3): reviewer nit 1 is accepted as a should-fix. Distinct difficulty levels are the core of the issue, so each level must require something the level below does not:
  - Easy: 36-40 givens, solvable by naked singles only (unchanged).
  - Medium: 30-35 givens, solvable by naked + hidden singles, and NOT solvable by naked singles alone.
  - Hard: 22-29 givens, unique, and NOT solvable by naked + hidden singles.
  - Within the 1000 ms cap; fallback behaviour stays documented. Nits 3 and 4 also fixed (cheap); nits 2 and 5 won't-fix (internal option, generous margin is intentional against flakiness).
- Rework launched with the developer; reviewer and tester re-run afterwards.
- Developer agent (Claude Sonnet 5.5, session 21813484) delivered rework commit c177c1c:
  - `LEVELS` gain `beyond` (medium: 'naked', hard: 'singles'); in-band puzzles still solvable by `beyond` are discarded and regenerated until the 1000 ms cap.
  - Result carries `capped` and `attempts`; `maxMs: 0` honoured; cap test asserts `capped === true`. `PEERS_MASK_UNITS` → `CELL_UNITS`. README updated.
  - Tests 53/53. Node, 200 seeded puzzles/level: easy max 1 ms; medium max 7 ms (avg 2.13 attempts); hard max 35 ms (avg 2.27 attempts); cap never hit.
  - Fallback on cap is only guaranteed unique (may be out of band / easier); documented.
- Lead check: diff reviewed (logic correct), `node --test` 53/53 locally. Second-round reviewer and tester launched on c177c1c.
