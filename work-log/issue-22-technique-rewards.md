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
- Developer (Claude Sonnet 5.5) delivered 9eba5d6 (logic, tests, glue, style) and 6474e31 (README). `node --test` 100/100 (12 new).
  - Design: `classifyEntry`, `emptyTally`, `creditEntry(tally, credited, hint, grid, r, c, value)` returning `{tally, credited, text}` (pure, no mutation) and `tallyLines`. `hintApplied` is reused unchanged.
  - The glue sits in `setCell`, using the new `dataset.pos`. A `#tally` section holds an h2 and two p elements.
  - Developer mutation checks: each swapped order fails its targeted test, though other tests overlap.
  - Smoke test (Easy, headless Chrome): messages verbatim, tally correct, 0 console errors.
- Lead check: read the diff in full. Passed.
  - `classifyEntry` matches E2: conflict and filled cell give null, then naked via `usedMask`, then box, row, column via `spotsFor`, with the cell required to be the only spot.
  - Grid before the entry: the keydown path calls `currentGrid()` before `inp.value` is written. The input/paste path resets `inp.value` to `dataset.prev` before `enter`, so it holds too.
  - Credit happens before `clearResults`, which still clears the hint, rings and flags as before. The tally resets in `choose` and is hidden in `newPuzzle`.
  - Flagged for the reviewer and tester:
    - (a) The README sentences the developer changed, checked for literal truth.
    - (b) The developer did not check in the browser that a re-entered credited cell leaves the tally unchanged, or that unjudged entries leave the status line blank. The tester must cover both.
    - (c) The with-a-hint path skips the conflict check. It is unreachable because any value change clears the hint, but the reviewer should confirm.
- Reviewer and tester launched in parallel on 6474e31.
- Round 1 review (reviewer agent): APPROVE (https://github.com/dirkmarski/weaver/issues/22#issuecomment-6258935175).
  - Confirmed: E2 exact; every write path is judged only for E1 entries, on the grid from before the entry; the hint path skipping the conflict check is unreachable (a) (c); existing texts byte-identical; generator untouched; README true apart from N2.
  - Mutation checks: every ordering rule is caught (box/row 6 fails, row/column 2, hidden-first 3), as are once-per-cell, empty-before and the conflict check.
  - S1: removing the filled-cell check in `classifyEntry` survives all tests. The existing fixture is null for another reason. Fix: assert `classifyEntry(H_BOX, 0, 3, 3) === null`.
  - N1: use `bitCount(used) === 8` instead of the hand loop.
  - N2: the README sentence "Each rewarded entry adds 1 to the matching count." is false on its own. The Files entry for the tests does not mention the reward tests.
  - Lead: waiting for the tester before scoping the rework.
- Round 1 test (tester agent): PASS (https://github.com/dirkmarski/weaver/issues/22#issuecomment-6258981054).
  - 8,848 checks, 0 failures, 0 defects, 0 console errors, with 674 DOM entries driven through the page.
  - Independent oracle: 9 random-order puzzles across all levels, matching after every entry; 3 Medium hint-only solves (naked and hidden both seen); every edge case listed in the issue, including (b).
  - Hint/Verify regression recordings are byte-identical to main. Swapping the unit order in the harness gives 51 failures, so the oracle is sensitive.
  - Observation: note edits do not clear the status line or the hint. This is unchanged from main and out of scope.
- Lead checked two screenshots by hand. r8c5=5 is a hidden single in its box: columns 4 and 6 hold a 5, and the candidates are {5,8}, so it is not naked. r7c4=6 is a naked single: the peers hold 1-5 and 7-9. Both are correct, and the layout is clear.
- Lead decision: rework round 2 before PM acceptance.
  - Scope: S1 (pin the filled-cell rule with a test), N1 (`bitCount`), N2 (README count sentence literally true, plus the Files entry for the tests).
  - Not taken: the tester's notes observation (existing behaviour, out of scope).
  - Gates: full re-review and full re-test.
- Round 2 delivery (developer, Claude Sonnet 5.5): a89675a.
  - S1: new assertion `classifyEntry(H_BOX, 0, 3, 3) === null`. Mutation check: removing the filled check fails exactly that test.
  - N1: `bitCount(used & ~1) === 8`. `usedMask` sets bit 0 for empty cells, so a plain `bitCount(used)` would be wrong. The developer caught this through failing tests.
  - N2: the README count sentence now has once-per-cell built in, and the Files entry mentions the reward tests.
  - `node --test` 100/100.
- Lead check: diff read. `used & ~1` keeps bits 1-9 only, which is equivalent to the old loop. Only the in-scope items changed. Passed. Full re-review and full re-test launched in parallel.
- Round 2 review: APPROVE, with no open findings (https://github.com/dirkmarski/weaver/issues/22#issuecomment-6259008528). S1, N1 and N2 are resolved. The reviewer independently confirmed `used & ~1` is equivalent and re-ran all mutations: filled 1, box/row 6, row/column 2, naked-first 3, all caught. The full diff was re-checked.
- Round 2 test: PASS, with the full walkthrough repeated on new seeds (https://github.com/dirkmarski/weaver/issues/22#issuecomment-6259016929). 8,958 checks over 682 entries, 0 failures, 0 console errors, 100/100 unit tests. The Hint/Verify regression is byte-identical to main. Screenshots are in scratchpad/test-22b-shots.
- Lead: satisfied with the delivery against #22. PR opened for PM user acceptance.
- PR #23 opened.
- **PM ACCEPTED**, with no conditions (https://github.com/dirkmarski/weaver/issues/22#issuecomment-6259053689).
  - The PM's own oracle: 620,841 `classifyEntry` checks and 6,070 credit/tally decisions, 0 mismatches.
  - 7 entries checked by hand; 5 mutations, all caught; screenshots looked at as a learner; README sentence by sentence.
  - Note (not a condition): the status-line layout shift is more visible with the tally, so the PM moved it up the candidate list.
- Merging PR #23 with a merge commit (individual commits kept).
