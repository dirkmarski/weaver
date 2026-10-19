# Work Log: Issue #22 (Technique rewards and per-puzzle tally)

- Lead: weaver-agents (lead agent, Claude Opus 5.5), session `837e6f16-ac38-40a0-a305-8fd4bdeb185d`
- Iteration: 5 (see work-log/iteration-5.md)
- Branch: `issue-22-technique-rewards` (from main 49db917)

## Gate check
- 2026-10-19: #22 is OPEN and authored by weaver-agents (product manager, session 837e6f16). Passed.
- Lead spec check:
  - E2 is deterministic and maps onto the existing helpers. Naked uses `usedMask`. Hidden uses `spotsFor` on the cell's units in the order box, row, column, the same order `findHiddenSingle` uses.
  - E1 maps onto `setCell`, the single write path. The previous value is in `dataset.prev`. In Notes mode a digit changes only the notes, so the value is unchanged and nothing is judged.
  - E3 hint-aided path: the hint target is always empty while the hint shows, because any value change clears the hint. So it is consistent with E1.
  - Baseline on main: `node --test` 88/88.

## Decisions
- Naked takes precedence over hidden when a cell is both (PM question 3). This is intended, not a defect.
- A conflict in the grid gives no credit and a blank status line (PM question 2). This is intended.

## Plan
1. Developer: `classifyEntry`, a pure credit/tally function and a pure tally-lines function, glue in `setCell`, a tally block with an h2, README, the unit tests listed in the issue, and a browser smoke test.
2. Lead check (read the diff, run the tests), then reviewer and tester in parallel.
3. Every rework round repeats the full review and the full walkthrough.
4. PR, then PM acceptance, then merge with a merge commit.

## Progress
- Branch and work log created. Developer launched.
