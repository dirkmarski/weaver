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
- 2026-10-23: developer done (0b1e19e code, 119c6aa log, 2d3bf49 test rename f1f->f1h). 175/175, skipped 0; ratio 2223/1399 (headroom 15.4); no removals. Lead diff check: product +20 (sudoku.js reserve/invite/keyText, showLink, showInvite after focus; style.css swap + #link.selected + #key scroll-margin-bottom 1px). Open for review: ids now semantically swapped (#link = key, #key = invitation); 1px scroll-margin; log mentions f1f (should be f1h). Sequence: reviewer, then rework if any, then tester.
- Persona follow-ups from #96 (out of scope, backlog): "(3 of 3)" at step 2, "(struck)" jargon, struck badge on amber cell, "7-"/"9" hyphen break at 360px, step 1 wording.

## Developer
- Claude Sonnet 5.5, session 541fd2f9-8dfe-4936-a1b6-0c535e8f682f. Code+tests+README commit 0b1e19e.
- Changed: ids stable. `#link` (under the board, 4lh) holds the key, or the link sentence (class `selected`, purple) during a selection; `#key` (after `#next`) holds the invitation (purple). `keyText` state; `unlink()` restores key and invitation; `showLink`; `showInvite()` = `scrollIntoView({block:'nearest'})` called after the focus call in Hint and `revealStep`; `#key` has `scroll-margin-bottom: 1px` (without it the invitation ended 0.1 px below the fold). Tests: `read()` splits key/link/reserve/invite; f, f1, f1a (page-relative tops), f1c, f1e adapted; new f1f (360x740, seeds 1, 8, Medium 1). README Hint section and files list.
- Ratio: product 1399 (+20), tests 2223 (+19), cap 2238.4, headroom 15. Note the brief labels were swapped (tests 2204, product 1379 at baseline).
- Removals: none. Deviations: none.
