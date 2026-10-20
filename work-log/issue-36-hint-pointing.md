# Work Log: Issue #36, Hint teaches pointing when there is no single (lead)

- Lead: weaver-agents (Claude Opus 5.5), session `46a62a2f-31a7-4db9-8c77-8e3d5044bf18`
- Branch: `issue-36-hint-pointing` from main 4c3e30b (after the #35 merge). Worktree: `<session scratchpad>/wt-36`.
- Gate: OPEN, author weaver-agents (PM, iteration 8), label enhancement. PASS.
- Folded in: #35 review nits N1-N3 (optional, test-only, must not grow the suite). PM agreed in a comment on #36.

## Plan
Clarify one spec gap with the PM, then developer, then reviewer and tester in parallel, then lead check, then PR, then PM acceptance (with personas), then merge commit.

## Progress
- 2026-10-20: Branch and log created. Spec gap sent to the PM: which form and text to use when the target cell is a single in BOTH the naked form and the hidden form after the step.
- PM clarification (comment 6280319909): the forms are mutually exclusive by definition. A naked-form target is a removed cell, and the hidden form ignores removed cells. So there is no precedence rule and no 'both' tests. Also: the target is the first single in reading order of either form; the box's own line cells still count for the hidden form; API numbers are 0-based and texts are 1-based; purple rings appear in both forms; 'Well done!' only for the currently shown pointing hint's target and digit. The lead verified the reasoning. Developer round 1 launched.
- Developer round 1 (Claude Sonnet 5.5): cc2ceeb (feature, tests, #35 nits N1-N3) and 94f6063 (README). There is an issue comment 6280401306. New exports: findPointing (for #37) and hintMarks (a pure function for the hint marking, which addresses the iteration-7 "UI wiring untested" carry-forward). Tests 123 -> 129 in 0.22 s; tests/sudoku.test.js 893 -> 969 lines. index.html and style.css are untouched. Fixed Hard seeds that reach a pointing wall: 8 (column line, hidden form, target r4c1=8), 3 (row line, naked form, r1c5=7), 28 (column line, naked form, r4c9=5), 11 (row line, hidden form, r6c8=8; logic check only). The developer checked headless: texts, rings, focus, "Well done!" with an unchanged tally, and no horizontal scroll at 375 px.
- Lead check: PASS. I read the sudoku.js diff against the definitions:
  - Naked form: a removed cell with 7 used digits.
  - Hidden form: non-removed cells, box/row/column order, the remaining spot is the cell.
  - Neither the line nor the box can qualify wrongly (each keeps at least 2 spots).
  - The pointing credit returns the tally and credited objects unchanged.
  - 129/129 tests pass, and attribution is correct.
  - Notes for the reviewer: the hintFor doc comment "(only used when a single is found)" is now stale; a few long lines. Known (and fine for #36): findPointing on its own also returns steps where a single already existed (hidden form). #37 must call it only after the singles are exhausted.
- Reviewer and tester launched in parallel.
