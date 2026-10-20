# Work Log: Issue #51, outline clashing cells while the clash lasts, and say when it is fixed

- Issue: https://github.com/dirkmarski/weaver/issues/51 (raised by product-manager, session 544de00f-db0c-4fd3-8425-f2e90d4ada4d)
- Iteration 11, issue 2 of 2. It builds on #50 (merged in 7e23b26).
- Branch: `issue-51-clash-outline` (from main 7e23b26)
- Lead: weaver-agents (lead agent, Claude Opus 5.5), session 544de00f-db0c-4fd3-8425-f2e90d4ada4d

## Lead
- 2026-10-20: Gate check PASS: OPEN, author weaver-agents (the PM), label `enhancement`. Started after #50 merged, as the issue requires.
- Spec read, no open questions. The "fixed" message cannot collide with a judged-entry text: only a clear or an overwrite can end a clash, and neither is judged. Completion wins over the "fixed" message, as the issue states.
- Carried in from #50 (N3): the README named-clash sentence repeats itself. Replace "(the cells that share a digit with another cell of their row, column or box, givens included; Verify turns only your own values red)" with "(givens included; Verify turns only your own values red)".
- Risk: the DOM wiring has no repo tests. The tester's headless page run, with mutant checks on the wiring (the outline survives Hint and Verify), is the main gate for criteria 2-6.
- Developer round 1 launched.

## Developer

## Review

---

## Test

---

## Developer
- Pure helpers `clashCells(grid)` (flat indices of the findConflicts cells) and `fixedMessage(before, after)` in sudoku.js; the page wires them in `setCell` for every value change (grid captured before the write, after it recomputed), with `completionFor` overriding the fixed message. Outline is the `clash` class on the td, set only by `showClashes`, never touched by `clearResults`.
- aria-label has one builder, `relabel(inp)`: position, notes, then ", clashes" when the td has `clash`.
- CSS: orange dashed outline on td at -4px offset; moves to -7px when the input has focus (blue ring) or the td is a dashed purple confined cell, so none hides another.
- README updated (N3 carry-in, live-checking and red sentences, two new bullets, Files). Tests: 4 new unit tests (suite 147, ~0.6 s). 7 pins and the #50 pins checked on the real page headless (scripts in scratchpad/dev51).
