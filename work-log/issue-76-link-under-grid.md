# Work Log: Issue #76 — link line under the grid, buttons kept still

- Issue: https://github.com/dirkmarski/weaver/issues/76 (author weaver-agents / PM)
- Iteration 17, lead session `cb27eb6b-ad9f-4cda-935d-15975e0cc9a8`
- Branch `issue-76-link-under-grid` from main 897c762

## Lead
- 2026-10-21: Fresh start (no prior branch, PR or issue log for #76). Gate check passed (open, author weaver-agents). Branch and this log created. Baseline 173/173, skipped 0; ratio 2081/1312 = 1.586x (cap floor(1.6 x 1312) = 2099, 18 lines of headroom; each new product line earns 1.6).
- Supervision: fixed evidence reports per agent; lead spot-checks (diff stat vs claimed files, '-' test lines vs claimed removals, suite run, re-run of named mutants, AC map vs issue, screenshot look).
- Constraint from the director: #77 and #78 also touch page test f1e, so the f1e extension must stay clean and legible (no packing).
- Developer 8c6e944: diff stat matched the report (README 2, index.html 1, style.css 1, page.test.js +18, log); no '-' test lines. 173/173 skipped 0. Ratio 2099/1312 = 1.600x, exactly at the cap (0 headroom): +18 test lines against the issue's ~5. Concern: leaves nothing for #77/#78, which also edit f1e.
- Deviation found: developer reserved 4lh, not the suggested 3, because the suite measured R3 at 4 lines. Lead measurement (scratch /tmp/wvr/cb27eb6b/lead/m2.js): the suite's 375 px override (mobile: false) has a 15 px classic scrollbar, content width 360; with phone emulation (mobile: true, content 375) invitation 2 lines and R3 3 lines; at 360 content R3 4 lines and a 3lh reserve moves the buttons 16 px (732 -> 748). At 1280 all 2 lines.
- Asked the PM (product call: 3lh vs 4lh). PM decision: option B, keep 4lh (buttons still on 360 px phones at the core R3 tap; 16 px blank cost accepted). AC3 and AC7 amended in the issue Change log; comment https://github.com/dirkmarski/weaver/issues/76#issuecomment-6311346409. Verified on GitHub.
- Rework round 1 (before review, tests only): shrink the f1e extension to at most 10 added lines, legibly, so #77/#78 keep headroom.

## Developer
- 2026-10-21 (session cb27eb6b): moved `<p id="link">` into `#game`, between the table and the button row (hidden with the game, so no picker gap). Means: `#link { margin: 0.5rem auto 0; min-height: 4lh }`; font size and colour untouched. Reserved four lines, not three, because the R3 sentence (Tricky seed 1, r2c2) measures four lines at 375 px (box 668-732, buttons 748); the invitation is three lines. At 375 px grid bottom 660, link 668-732, buttons top 748 in every state; at 1280 px grid 643, link 651-715, buttons 731. f1e extended (375 px, reset in finally). Mutants (link below key, no min-height, 2lh, 3lh, link above grid) all killed by f1e. Suite 173/173.

## Reviewer

## Tester
