# Work Log: Issue #19 (Hidden-single hint)

- Lead: weaver-agents (lead agent, Claude Opus 5.5), session `be31ef20-6bb6-42ee-8172-b7e2d9801847`
- Iteration: 4 (see work-log/iteration-4.md)
- Branch: `issue-19-hidden-single` (from main 8e75d54)

## Gate check
- 2026-10-19: #19 is OPEN and authored by weaver-agents (product manager, session be31ef20). Passed.
- Lead spec check:
  - The D5 reasoning is sound. For U = box, D is not in the box, so the only thing that excludes each other empty cell of the box is a D in its row or column. The same logic applies to row (column or box) and column (row or box).
  - D3 is fully deterministic.
  - Baseline on main: `node --test` 75/75.

## Decisions
- PM question 3 has been accepted: the existing "no naked single" unit test changes as AC9 requires. The developer and reviewer are told that this is not a regression.

## Plan
1. Developer: `findHiddenSingle` and the extended `hintFor`/`hintApplied` with a technique field, refactored unit/peer helpers, D marks in `clearResults`, style, README, unit tests (AC10), and a Medium hint-only smoke test.
2. Lead check (diff read, tests), then reviewer and tester in parallel.
3. Every rework round repeats the full review and the full walkthrough.
4. PR, then PM acceptance, then merge with a merge commit.

## Progress
- Branch and work log created. Developer launched.
- Developer (Claude Sonnet 5.5) delivered 3fd3739 (logic, refactor, tests), fd98421 (style) and 4a7aa93 (README). `node --test` 87/87 (12 new).
  - Design: `findHiddenSingle` built on the shared `spotsFor`, `UNITS`/`CELL_UNITS`/`usedMask` and the new `UNIT_NAMES`. `hintFor` results carry `technique` and `unit`. `hintApplied` is technique-aware. The hint-digit marks are cleared in `clearResults`. The marks are a purple ring with a bold digit.
  - Developer smoke test: 4 Medium puzzles solved by hints only (box and column units seen, no row), Easy solved with naked singles only, Hard reached the D1.5 text. 0 console errors.
- Lead check: read the diff in full. Passed.
  - `findHiddenSingle` matches D2/D3. "Can take D" via `usedMask` implies D is not in the unit. A single spot that includes p means p is the only spot.
  - The `solvableBy` refactor is equivalent: `spotsFor` is empty when D is already in the unit, because every other empty cell of that unit then sees D.
  - The naked-single texts are unchanged, and `findNakedSingle` is equivalent via `usedMask`.
  - Step 2 recomputes from the same grid (notes excluded), so it lands on the same target.
  - The reward is captured before `clearResults`.
  - Flagged for the reviewer and tester:
    - (a) The ascending-digit order has no unit test. A wrong but non-conflicting entry can make one cell the only spot for two digits, so it is testable.
    - (b) Generator time under the 1 s cap after the refactor (`spotsFor` allocates arrays).
    - (c) The README, sentence by sentence.
- Reviewer and tester launched in parallel on 4a7aa93.
- Round 1 review (reviewer agent): CHANGES REQUESTED, nothing blocking (https://github.com/dirkmarski/weaver/issues/19#issuecomment-6258403453).
  - Confirmed correct:
    - D2/D3 logic, every clearing path, the reward for both techniques, and the naked path byte-identical.
    - Generated puzzles are identical between main and the branch (md5, seeds 1-40, all levels). Medium generation is about 1.7x slower (avg 2.5 ms, max 9.3 ms), far under the 1 s cap.
    - D8 contrast is OK.
  - S1: the ascending-digit order is untested. A descending mutation passes all tests. The reviewer gave a constructible grid, and the lead checked it by hand.
  - S2: README:36 "(and tint, for a hidden single)" wrongly implies the naked tint does not stay.
  - Nits: N3 the section heading sudoku.js:145, N4 README:64 is ambiguous about `unit`, N5 the README:30 definition is dense (optional).
  - Lead: waiting for the tester before scoping the rework, so a single round covers both reports.
