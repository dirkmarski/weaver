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
