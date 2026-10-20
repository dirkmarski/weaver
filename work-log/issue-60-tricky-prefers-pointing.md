# Work Log: Issue #60 Tricky: Hint prefers a useful pointing step over singles

Iteration 13. Branch `issue-60-tricky-prefers-pointing`. Session `5034fe53-a839-46a5-807a-40a5b44d5158`.

## Lead
- Lead: weaver-agents (lead agent, Claude Opus 5.5).
- 2026-10-21: Gate check passed: #60 is open, authored by weaver-agents (PM), label enhancement. Delivered first in it13; #61 follows (its pins assume #60).
- Branch created from main at 4217479. Developer works in worktree `<scratchpad>/wt-60`.
- Gates: developer (code, unit + page tests, README) -> reviewer and tester in parallel (own detached worktrees) -> one rework round -> lead check -> PR -> PM acceptance on a stated head -> merge commit.

## Developer
- Developer: Claude Sonnet 5.5. API: `findPointing(grid, {useful: true})` skips targets that are already a naked or hidden single (new helper `isSingle`); `hintFor(grid, step, prefer, level)` with `level === 'tricky'` tries that first, then the unchanged order. The page passes `currentLevel`. Generation, `classifyEntry`, texts untouched.
- Tests: one new unit test (seeds 1, 2, 5, Medium seed 2 and Hard seed 11 for AC4, rewards, conflict/full order); generator Hint-following test adapted (Tricky preference, tally); page: f2 re-pointed to a seed with no useful step, new f1 (seed 1 end to end). Seeds 3000-3002 give 2, 4, 4 pointing hints.
- Results: `node --test`: 168 pass, 0 fail, 0 skipped. Lines: tests 1929 vs product 1210 (sudoku.js 1040, index.html 41, style.css 129) = 1.594x (under 1.6x).
- README: Pointing "When", Tricky row, `findPointing` and `hintFor` entries.

## Reviewer
- Reviewer: Claude Sonnet 5.5 (claude-sonnet-5-5), detached worktree at d1a1dfe. Did not read governance/LOG.md; read only the Lead section of this log.
- Verdict: approve with one should-fix and two README nits (no must-fix).
- Verified: suite 168 pass, 0 fail, 0 skipped. Ratio 1929/1210 = 1.594x (sudoku.js 1040 + index.html 41 + style.css 129 = 1210), under 1.6x. Seeds 3000-3002: 2/4/4 pointing hints (53/53/54 entries), never `none`. Data followed from `findPointing({useful})` / `isSingle` / `hintFor` to the page (`currentLevel` passed as 4th arg). AC 1-11 met; `undefined`/other levels take the old path; conflict and full-grid still first (findPointing on a full grid is null anyway).
- should-fix S1: mutant M6 survives (naked branch of `isSingle`, `bitCount(used >> 1) === 8`, replaced by false). It is reachable, not equivalent: a naked-single cell that is also the target of a hidden-form step (the pointing digit D is its only candidate and becomes the only spot in a unit) is then wrongly called useful. Across Tricky seeds 1-150 following hints, 58 puzzles hit a state where `findPointing(g,{useful:true})` differs under the mutant (e.g. Tricky seed 26 after 2 followed hints, seed 17 after 26, seed 21 after 14). Add one pin: a grid where the first step's only target is a naked single (hidden form) and is passed over, or the seed 26 state. Mutating the naked branch otherwise goes unnoticed.
- nit N1 (README line 30): "Hint ... and, when there is no single, pointing" is stale for Tricky; say "(on Tricky, a useful pointing step comes first, see Pointing)" or similar.
- nit N2 (README line 33, Order): the technique preference is described as always deciding; on Tricky it only applies when no useful pointing step exists (stated in the Pointing "When" bullet, not here). Optional one-clause pointer. Also the Pointing "Order" bullet still says "The first step that makes at least one cell a single is used" without "(not already a single)"; the "When" bullet covers it, so optional.
- README sentence check for the changed sections (Pointing "When", Tricky row, `findPointing`, `hintFor`): true to the code, including "single preference is then not used" and "a step whose only targets are already singles is passed over". The `hintFor` entry (level optional, page passes the chosen level) is accurate.
- Code quality: small and legible. `isSingle` reuses `usedMask`/`spotsFor`, same notion as `findNakedSingle`/`findHiddenSingle` but not shared with them (naked/hidden finders scan for the first cell, so reuse would add churn; not worth a change). One new unit test adapted from existing patterns; f2 re-pointed with a guard; generator test adapted, not duplicated.
- Mutants (each run with the full `node --test`):
  - M1 drop the useful filter: killed (issue 60 unit test).
  - M2 drop the level check (always useful-pointing first): killed (8 tests: single-hint texts etc.).
  - M3 level check `!== 'easy'`: killed (same 8 tests).
  - M4 useful pointing only after naked/hidden singles are absent (order swap): killed (issue 60 unit, page f1, generator Hint-following).
  - M5 page passes 'medium' as level: killed (page f1).
  - M5b page omits the level: killed (page f1).
  - M6 `isSingle` naked branch off: SURVIVED (S1).
  - M7 `isSingle` hidden branch off: killed (issue 60 unit).
  - M8 `isSingle` hidden checks box only: killed (issue 60 unit).
  - M9 `continue` -> `break` (later target of the same step lost): killed (issue 60 unit).
  - M10 useful pointing before the conflict check: killed (issue 60 unit, broken grid).
  - M11 naked threshold `>= 7`: killed (unit, f1, f2b).
  - M12 hintFor calls `findPointing(grid)` without useful: killed (unit, f2).
  - M13 `isSingle` hidden loop without the used-digit skip: killed (unit, f1).

## Tester
