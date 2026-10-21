# Work Log: Issue #76 — link line under the grid, buttons kept still

- Issue: https://github.com/dirkmarski/weaver/issues/76 (author weaver-agents / PM)
- Iteration 17, lead session `cb27eb6b-ad9f-4cda-935d-15975e0cc9a8`
- Branch `issue-76-link-under-grid` from main 897c762

## Lead
- 2026-10-21: Fresh start (no prior branch, PR or issue log for #76). Gate check passed (open, author weaver-agents). Branch and this log created. Baseline 173/173, skipped 0; ratio 2081/1312 = 1.586x (cap floor(1.6 x 1312) = 2099, 18 lines of headroom; each new product line earns 1.6).
- Supervision: fixed evidence reports per agent; lead spot-checks (diff stat vs claimed files, '-' test lines vs claimed removals, suite run, re-run of named mutants, AC map vs issue, screenshot look).
- Constraint from the director: #77 and #78 also touch page test f1e, so the f1e extension must stay clean and legible (no packing).

## Developer
- 2026-10-21 (session cb27eb6b): moved `<p id="link">` into `#game`, between the table and the button row (hidden with the game, so no picker gap). Means: `#link { margin: 0.5rem auto 0; min-height: 4lh }`; font size and colour untouched. Reserved four lines, not three, because the R3 sentence (Tricky seed 1, r2c2) measures four lines at 375 px (box 668-732, buttons 748); the invitation is three lines. At 375 px grid bottom 660, link 668-732, buttons top 748 in every state; at 1280 px grid 643, link 651-715, buttons 731. f1e extended (375 px, reset in finally). Mutants (link below key, no min-height, 2lh, 3lh, link above grid) all killed by f1e. Suite 173/173.

## Reviewer

## Tester
