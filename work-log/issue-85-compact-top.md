# Issue #85: Phone layout, compact page top below 560 px

Issue: https://github.com/dirkmarski/weaver/issues/85 (PM, it18 issue 3 of 3). Branch: issue-85-compact-top from main 638c0fa (#84 merged, PR #87).

## Lead
- Lead: Claude Opus 5.5 (claude-opus-5-5), session `28d2788e-8588-47d1-8000-5904c97e526f`. Fresh start (no branch, PR or log existed); new lead run in the same session id after #84.
- Gate: issue open, authored by weaver-agents (PM), no comments.
- Baseline: product 1324, tests 2118, cap floor(1.6 x 1324) = 2118, headroom 0. #85 pays for its own test lines (1.6 per product line); removals listed and confirmed by reviewer and tester, no line packing. If the ratio or feasibility blocks an AC: report to the director (who asks the PM), no own scope cut.
- Plan: developer (CSS in the existing max-width 559px rule, one assertion in an existing 375 px page test) -> reviewer and tester (own worktrees, foreground, one at a time; tester reuses $WEAVER_SCRATCHPAD/test-84 scripts) -> lead spot checks -> PR -> PM acceptance incl. persona round (AC6) -> merge commit with the accepted sha.
