# Issue #83: square grid cells below 560 px, chips kept inside the cell

Issue: https://github.com/dirkmarski/weaver/issues/83 (PM, it18 issue 1 of 3). Branch: issue-83-square-cells from main 7fdc9a2.

## Lead
- Lead: Claude Opus 5.5 (claude-opus-5-5), session `28d2788e-8588-47d1-8000-5904c97e526f`.
- Baseline: product 1319, tests 2110, ratio 1.600x, headroom 0. Each product line earns 1.6 test lines; removals listed and confirmed by reviewer and tester, no line packing (issue test-ratio note).
- Plan: developer (CSS + README + extend f4/f3 page tests) -> reviewer and tester (own detached worktrees, foreground, one at a time) -> lead spot checks -> PR -> PM acceptance on a stated head -> merge commit with the accepted sha.
- Note for testers: the suite's 375 px override uses mobile:false (15 px classic scrollbar, 360 px content); the ACs use mobile emulation content widths 360/375/390.

## Developer

## Reviewer

## Tester

## PM acceptance
