# Issue #83: square grid cells below 560 px, chips kept inside the cell

Issue: https://github.com/dirkmarski/weaver/issues/83 (PM, it18 issue 1 of 3). Branch: issue-83-square-cells from main 7fdc9a2.

## Lead
- Lead: Claude Opus 5.5 (claude-opus-5-5), session `28d2788e-8588-47d1-8000-5904c97e526f`.
- Baseline: product 1319, tests 2110, ratio 1.600x, headroom 0. Each product line earns 1.6 test lines; removals listed and confirmed by reviewer and tester, no line packing (issue test-ratio note).
- Plan: developer (CSS + README + extend f4/f3 page tests) -> reviewer and tester (own detached worktrees, foreground, one at a time) -> lead spot checks -> PR -> PM acceptance on a stated head -> merge commit with the accepted sha.
- Note for testers: the suite's 375 px override uses mobile:false (15 px classic scrollbar, 360 px content); the ACs use mobile emulation content widths 360/375/390.
- Developer 0d613aa reviewed by lead (CSS diff, README word-diff, classic-scrollbar probe). PM decisions Q1 (top alignment below 560 px in #83) and Q2 (classic-scrollbar 500-559 px: accepted limit) are in the issue Change log; AC1 and AC6 amended.

## Developer
- Developer: Claude Sonnet 5.5 (claude-sonnet-5-5), session `28d2788e-8588-47d1-8000-5904c97e526f`.
- Means (style.css, inside `@media (max-width: 559px)`): td width and height = `calc((100vw - 32px) / 9 - 2px)` (32 = main padding, 2 = the td's 1 px borders; rect = content + 2); `td line-height: 0` plus `input { height: 1px; min-height: 100%; line-height: normal }` remove the 35 px content floor of the 30 px input line box that made 360 px cells 36.4 x 37 (1.56 off). Chips: `--tx`/`--ty` variables in the transform (wide screens unchanged: -50%, -50%); 1-3 `top: 0`, 7-9 `top: auto; bottom: 0`. Extra: `body { align-items: flex-start }` below 560 px, because with short square-cell content the vertically centred page moved the button row 1.9 px on the first Hint (AC6).
- Tests: f4 now uses mobile:true (phone overlay scrollbar), asserts all cells square within 1 px, corners 1/3/7/9 inside (0.5 px) and flush (0.25 px) on their edges; f1e's 375 step also uses mobile:true (mobile:false: 100vw includes the 15 px scrollbar, so width and height disagree by 1.7 px).
- Measurements (Tricky seed 1, Hint twice): 360 cell 36.44 x 36.44, 375 38.11 x 38.11, 390 39.77 x 39.77, max |w-h| over cells 1.0 (thick borders); #status top 375x812: 642.5 vs main 821.6. 1280x900 screenshot byte-identical to main. Chips D 1-9 x 3 kinds x 6 cells at 360/375/390/559: inside, flush, centred, font 14 px.
- Ratio: product 1324, tests 2114, cap 2118.
- Known limit: narrow desktop window with a classic scrollbar below 560 px: 100vw includes the scrollbar, cells about 1.7 px taller than wide.

## Reviewer

## Tester

## PM acceptance
