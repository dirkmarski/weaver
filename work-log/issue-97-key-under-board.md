# Issue #97: Hint: key line under the board, invitation below the steps and scrolled into view

- Issue: https://github.com/dirkmarski/weaver/issues/97
- Branch: issue-97-key-under-board

## Lead
- Gate (2026-10-23, lead Claude Opus 5.5, session 541fd2f9-8dfe-4936-a1b6-0c535e8f682f; same session id as #96, new lead run): open, authored by weaver-agents (PM). Fresh start from main 5656017 (no branch, PR or issue log existed).
- Baseline: 174/174, skipped 0. Ratio tests 2204 / product 1379 (sudoku.js+index.html+style.css), cap 2206.4, headroom 2.4.
- Scope incl. Change log 1-2: AC5 now also guards the stage-3 fold at 360x740 (#status ends 38.5 px below on seeds 1, 33; 17.5 px on 8, 7, 12); the AC4 scroll is the fix. AC9 360x740 test asserts invitation, #status and target in view.
- Plan: today #link (under board) = invitation/link, #key (after #next) = key. Swap: #link = link sentence else key (key style), #key slot = invitation (purple), scroll-once (minimal) when the invitation first appears. Ratio: headroom 2.4, so new tests must be paid by adapting existing tests (f1/f1b/f1c/f1e/f1a-tops) and listed removals confirmed by reviewer and tester.
- Walk naming: pins use the page walk of tests/page.test.js (real Hint clicks), not the unit pointingState walk.
- Lesson applied: tester scripts are re-run by the lead with the tester worktree still present; check output timestamps.
- Persona follow-ups from #96 (out of scope, backlog): "(3 of 3)" at step 2, "(struck)" jargon, struck badge on amber cell, "7-"/"9" hyphen break at 360px, step 1 wording.
