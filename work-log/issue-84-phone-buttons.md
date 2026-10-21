# Issue #84: New puzzle beside the difficulty, Verify/Hint/Notes on one row, page aligned to the top

Issue: https://github.com/dirkmarski/weaver/issues/84 (PM, it18 issue 2 of 3). Branch: issue-84-phone-buttons from main a45b784 (#83 merged, PR #86).

## Lead
- Lead: Claude Opus 5.5 (claude-opus-5-5), session `28d2788e-8588-47d1-8000-5904c97e526f`. Fresh start (no branch, PR or log existed); new lead run in the same session id after #83.
- Gate: issue open, authored by weaver-agents (PM). PM comment: top alignment below 560 px done in #83 (Q1); #84 does 560 px and wider (AC4 1280x1200 C1 case), AC4 still checked in full.
- Baseline: product 1324, tests 2117, cap floor(1.6 x 1324) = 2118, headroom 1. #84 pays for its own test lines (1.6 per product line); removals listed and confirmed by reviewer and tester, no line packing.
- Plan: developer (markup move, CSS, README, extend the existing 375 px page flow f1e) -> reviewer and tester (own detached worktrees, foreground, one at a time) -> lead spot checks -> PR -> PM acceptance incl. persona round (also on #83 chips) -> merge commit with the accepted sha.
