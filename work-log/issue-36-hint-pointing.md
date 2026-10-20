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
- Reviewer round 1 (Claude Sonnet 5.5): APPROVE at 8cd4236 (comment 6280434094). 12 mutation spot checks, 11 caught. The survivor was the digit loop reversed to 9..1. S1: no test pins the digits-1-to-9 order within a box. N1: stale hintFor doc comment. N2: two adjacent parentheses in the README 'with a hint' bullet. N3: dense lines in pointingHint/findPointing. N4: the WALL_COL comment names steps that no assertion backs. Rework is held until the tester reports.
- Tester round 1 (Claude Sonnet 5.5): PASS at 8cd4236 (comment 6280458742), no defects. The UI was run at all four seeds: texts byte-exact against an independent template oracle, tint, rings, focus, repeat clicks, Well done with an unchanged tally, a different digit, Notes on. Edge/error checks: a single exists, the none text at a real wall (seed 1), conflict, Easy/Medium unchanged. 375 px has no horizontal scroll. The tester showed that a pointing entry can never fill the grid (at least 3 empty cells are needed), so that case cannot happen.
- Lead decision: round 2 for S1 (the digit order is a spec rule with no test) plus N1, N2 and N4. N3 is optional, at the developer's judgment. Round 2 is test, comment and README only, with no behaviour change. So, per the new test strategy, the re-check is proportionate: the reviewer re-reviews the round-2 delta and re-runs the digit-order mutation, and the tester re-runs the suite plus one UI smoke run at one seed. This deliberately re-scopes the iteration-7 lesson "every rework round repeats the full review and walkthrough", which predates the test strategy. If round 2 touches behaviour, the full re-review and re-test apply again.
- Developer round 2 (Claude Sonnet 5.5): 99ccf0a (comment 6280476478). S1 test added (seed-339 wall literal: digit 2 beats digit 5 in box 0; the reversed loop fails it). N1, N2 and N4 fixed. N3 skipped by choice (accepted). sudoku.js changes one comment line only. 130/130 tests pass. Lead check of the delta: PASS.
- Re-review round 2 (Claude Sonnet 5.5): APPROVE (comment 6280489364). The S1 mutation was re-run: 1 test fails and the revert is clean. N5 (optional): the README sentence "counts as done with a hint ... a pointing hint is not counted" reads slightly against itself. Lead decision: no round 3 for an optional sentence. It goes to the PM at acceptance, to fold into #37 or accept as is.
- Re-test round 2 (Claude Sonnet 5.5): PASS (comment 6280491153). The sudoku.js change is comment-only, and index.html and style.css are unchanged. 130/130 tests pass. The seed-3 UI smoke run is byte-exact (both clicks, Well done, tally unchanged). PR opened for PM acceptance.
