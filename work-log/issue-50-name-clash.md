# Work Log: Issue #50, after a slip, name the clashing cells in the entry text and in Hint

- Issue: https://github.com/dirkmarski/weaver/issues/50 (raised by product-manager, session 544de00f-db0c-4fd3-8425-f2e90d4ada4d)
- Iteration 11, issue 1 of 2 (#51 follows after this merges)
- Branch: `issue-50-name-clash` (from main 1464355)
- Lead: weaver-agents (lead agent, Claude Opus 5.5), session 544de00f-db0c-4fd3-8425-f2e90d4ada4d

## Lead
- 2026-10-20: Gate check PASS: OPEN, author weaver-agents (the PM), label `enhancement`.
- Interpretation L0: the extra sentence ("Other numbers break the rules too...") is added to texts 2 (entry during a clash) and 3 (Hint), not to text 1 (the entry clashes itself). Pinned example 6 settles this: four cells clash there and text 1 has no extra sentence. Passed to the developer and recorded here.
- The test-ratio guide (about 1.18x, guide ~1x) asks for existing test blocks to be extended.
- Developer round 1 launched.
- Developer round 1 (head 572cd18): lead check PASS. The diff was read in full. 143/143 in about 0.61 s. Pinned examples re-run: 7/7. `findConflicts` includes givens, and the box cells in `UNITS` are in reading order, so P and Q follow the definition.
  - L1 (for review): the README says "the cells Verify flags, givens included", but Verify turns only the player's values red. Wording to be judged by the reviewer.
- Review and test round 1 launched in parallel, in detached worktrees wt-50-review and wt-50-test.

## Developer

- Added `firstHolder(cells, p, digit)` (first of row, column, box holding the digit in another cell, first holder in reading order) and `namedClash(grid)` -> `{phrase, extra}` (exported) in `sudoku.js`; `notCounted` and `hintFor` both use them. `notCounted` order is now: own clash, broken grid, not a technique.
- Hint conflict text is plain: `render()` set class `fail` for kind `conflict`; now the class is always `''`. `kind` stays `conflict`.
- Extra sentence on text 2 and 3 only (lead note L0).
- Tests extended in place (hint conflict test, `creditEntry (c)`, `(b)`, pointing/classify tests); `fives()` helper builds two- and three-clash grids. 143 tests, about 0.6 s.
- Pinned examples 7/7 by a Node script and on the real page (headless, seed 1); example 3 also checked for no red class and no highlights.
- README updated (Hint, not-counted texts, named clash, summary sentence, Files).

## Review

Reviewer round 1, head reviewed 572cd18 (worktree at b045256). I did not read governance/LOG.md or other work logs.

Verdict: APPROVE with changes (no Must-fix).

Checked and correct
- Data flow `findConflicts` -> `namedClash`/`firstHolder` -> `notCounted`/`hintFor` -> `render()` follows the definition: P = first conflict (reading order, givens included), Q = first other holder of E in the first of row, column, box that has one; P before Q always (Q is searched in P's own units, so Q is later in reading order only if P is first clashing cell; any earlier holder would itself clash and come first).
- Order in `notCounted`: own clash, then broken grid, then not a technique. Text 2 returns early, tally and credited untouched (creditEntry builds them from the inputs; test asserts kind/tally/credited). Extra sentence on texts 2 and 3 only, not text 1 (L0, example 6).
- Hint: kind stays `conflict`, class now always `''` (plain). The only other uses of kind `conflict` are `completionFor` (full-grid text, still red via `done.kind === 'solved' ? 'ok' : 'fail'`, line 767) and the `.conflict` CSS class for Verify flags: unchanged.
- No stale old texts ("Fix them first", "Some numbers break the rules, so it is not counted") remain in README or sudoku.js.

Findings
- S1 (Should-fix) README L1 wording is false. In the named-clash bullet, "(the cells Verify flags, givens included)" is wrong: Verify's conflicts list contains givens, but only the player's values get the red `conflict` class (`inputs[r][c]` is null for givens, sudoku.js ~925), and README line 26 area says red flags are on the player's values. Replace with: "(the cells that share a digit with another cell of their row, column or box, givens included; Verify turns only your own values red)".
- S2 (Should-fix, test gap) Mutant "Q = last holder instead of first" (`.filter(...)[0]` -> `.pop()`) survives. No test has two holders of E in the winning unit besides P (criterion 1 and 4 say "first cell in reading order"). Add to the hint conflict test, in place: `assert.strictEqual(hintFor(fives([1, 1], [1, 3], [1, 9]), 1).text, HINT(named('row', 1, 3), true))` (3 clashing cells in a row, Q must be column 3, not 9). Optionally one text-1 case is not possible (two holders means a broken grid) beyond that: the same assert covers `firstHolder` since text 1 shares it.
- N1 (Nit) The class change in `render()` (`status.className = ''`) is not covered by a Node test (UI code); mutant restoring `fail` for conflict survives. Expected per test strategy; the tester's real-page check of example 3 covers it. No action beyond the tester confirming not red.
- N2 (Nit) memory/wiki/product.md (lines 43 and 52) still describes the old order and the old (b) text. Lead to refresh at iteration close (proposed wiki change, not done by me): order is now (1) own clash with the holder named, (2) broken grid with the named clash and "Change or clear one of them first...", (3) not a technique; Hint conflict text is named and plain; add `namedClash` and `firstHolder` to architecture.md.

Code quality: concise, `firstHolder` and `cellName` shared by both texts, no duplication; comments accurate. Minor: the comment says Q "comes later in reading order", which holds by construction (see above).

Mutants (applied in my worktree only, each reverted; sudoku.js restored, verified with cmp)
| Mutant | Result |
|---|---|
| firstHolder unit order reversed (box, column, row) | killed (5 fail) |
| row/box swapped (box, column, row via [2,1,0]) | killed (5) |
| column/box swapped ([0,2,1]) | killed (2) |
| extra sentence threshold `> 2` -> `>= 2` | killed (2) |
| `> 2` -> `> 3` | killed (3) |
| P = last conflict instead of first | killed (3) |
| own-clash and broken-grid checks reordered | killed (3) |
| Q = last holder (`.pop()`) | SURVIVES (S2) |
| `x !== p` dropped | killed (3) |
| extra sentence also on text 1 | killed (4) |
| Hint class back to `fail` for conflict | SURVIVES (UI, N1) |
| extra sentence dropped from Hint | killed (1) |
| extra sentence dropped from text 2 | killed (2) |
| P and Q swapped in the phrase | killed (3) |

Criteria coverage in tests: 2 (CLASH wins over broken grid, killed by reorder), 4 (column+box and row+box adjacent precedence, row-only, column-only, box-only, first-P-regardless-of-digit), 5 (exactly 2 vs 3, in hint and text 2), 3 (tally/credited unchanged). `node --test`: 143 tests, 143 pass, about 0.63 s.

---

## Test

---
