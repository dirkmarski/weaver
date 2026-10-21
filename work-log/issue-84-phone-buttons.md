# Issue #84: New puzzle beside the difficulty, Verify/Hint/Notes on one row, page aligned to the top

Issue: https://github.com/dirkmarski/weaver/issues/84 (PM, it18 issue 2 of 3). Branch: issue-84-phone-buttons from main a45b784 (#83 merged, PR #86).

## Lead
- Lead: Claude Opus 5.5 (claude-opus-5-5), session `28d2788e-8588-47d1-8000-5904c97e526f`. Fresh start (no branch, PR or log existed); new lead run in the same session id after #83.
- Gate: issue open, authored by weaver-agents (PM). PM comment: top alignment below 560 px done in #83 (Q1); #84 does 560 px and wider (AC4 1280x1200 C1 case), AC4 still checked in full.
- Baseline: product 1324, tests 2117, cap floor(1.6 x 1324) = 2118, headroom 1. #84 pays for its own test lines (1.6 per product line); removals listed and confirmed by reviewer and tester, no line packing.
- Plan: developer (markup move, CSS, README, extend the existing 375 px page flow f1e) -> reviewer and tester (own detached worktrees, foreground, one at a time) -> lead spot checks -> PR -> PM acceptance incl. persona round (also on #83 chips) -> merge commit with the accepted sha.

## Developer
- Developer: Claude Sonnet 5.5 (claude-sonnet-5-5), session `28d2788e-8588-47d1-8000-5904c97e526f`.
- New puzzle: moved into `<p id="level">` after a child `<span id="level-text">`; `choose` sets only the span (`levelLabel` now points at it), so the button survives every level choice. #level is a flex line (centred, gap 0.75rem, no wrap); button font 0.9rem, min-height 1.8rem.
- Play buttons: `#buttons` flex, centred, gap 0.75rem (12 px); padding 0.4rem 1rem, min-height 2.15rem (>= 34 px).
- Top alignment: `body { align-items: flex-start }` in the base rule; the #83 media-query copy removed.
- README: one sentence in How to play (New puzzle next to the level; Verify, Hint, Notes below the grid).
- Tests: f1e 375 px flow extended (New puzzle then second level, level text, New puzzle after the text/on the line/above the grid/>= 28 px, one top and gaps >= 8 for Verify/Hint/Notes, each >= 34 px). `read()` level now reads #level-text.
- Removed (redundant, same `length !== 9` branch / setup check): `isValidSolution([])`, the `new Set(g[0]).size` line in 'rejects duplicate in a row'. The 'rejects an extra 10th row' test is replaced by one line in 'rejects wrong shape' (see Rework 1).
- Rework 1: removal of the 10th-row test had left the outer `grid.length !== 9` guard untested (mutant survived); restored with one assertion in 'rejects wrong shape', mutant now fails. Tests 2118 lines, cap 2118; suite 172 pass, 0 fail, 0 skipped.
- Ratio: product 1324 -> 1324 (index 42, style 144, sudoku.js 1138 unchanged counts); tests 2117 -> 2117; cap 2118.
- Suite: 172 pass, 0 fail, 0 skipped.
- Tricky seed 1, Hint twice: 375x812 status 618.6-807.6, grid bottom 491.8, button row top 567.8; 360x740 status 603.5-792.5, grid bottom 476.7, row top 552.7 (steps 1 and 2 end at 709). 1280x1200 row top 729.8 in all four states (no hint, nudge, explanation, Verify).
- Known limits: seed 8 not measured; AC7 at 360x740 shows conclusion and steps 1-2 only (step 3 below the fold, as allowed).

## Lead review of the developer round
- Developer f6dfaed (product + README), e429342 (f1e extended), 7cce946 (3 unit-test removals), 6e0b790 (log). Product line counts unchanged (1324): markup move, CSS rule edits, `levelLabel` -> `#level-text`.
- Lead R1: removal 2 ('rejects an extra 10th row') was not redundant: `g[3].slice(1)` and `[]` both fail at the row check; mutant dropping the outer `grid.length !== 9` passed 152/152 unit tests. Rework 1 (2197782): one guard line in 'rejects wrong shape'; mutant now fails. Tests 2118 = cap (headroom 0). Developer's log ratio line still says 2117: the correct figure is 2118.
- Remaining removals for reviewer/tester confirmation: `isValidSolution([])` (covered by the row check path, same result) and `new Set(g[0]).size` (fixture sanity check). New f1e line is 297 chars; page.test.js on main already has lines to 320 (8 over 200): reviewer to judge packing.
