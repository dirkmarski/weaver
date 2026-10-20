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

## Developer

- Added `firstHolder(cells, p, digit)` (first of row, column, box holding the digit in another cell, first holder in reading order) and `namedClash(grid)` -> `{phrase, extra}` (exported) in `sudoku.js`; `notCounted` and `hintFor` both use them. `notCounted` order is now: own clash, broken grid, not a technique.
- Hint conflict text is plain: `render()` set class `fail` for kind `conflict`; now the class is always `''`. `kind` stays `conflict`.
- Extra sentence on text 2 and 3 only (lead note L0).
- Tests extended in place (hint conflict test, `creditEntry (c)`, `(b)`, pointing/classify tests); `fives()` helper builds two- and three-clash grids. 143 tests, about 0.6 s.
- Pinned examples 7/7 by a Node script and on the real page (headless, seed 1); example 3 also checked for no red class and no highlights.
- README updated (Hint, not-counted texts, named clash, summary sentence, Files).

## Review

---

## Test

---
