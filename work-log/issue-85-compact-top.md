# Issue #85: Phone layout, compact page top below 560 px

Issue: https://github.com/dirkmarski/weaver/issues/85 (PM, it18 issue 3 of 3). Branch: issue-85-compact-top from main 638c0fa (#84 merged, PR #87).

## Lead
- Lead: Claude Opus 5.5 (claude-opus-5-5), session `28d2788e-8588-47d1-8000-5904c97e526f`. Fresh start (no branch, PR or log existed); new lead run in the same session id after #84.
- Gate: issue open, authored by weaver-agents (PM), no comments.
- Baseline: product 1324, tests 2118, cap floor(1.6 x 1324) = 2118, headroom 0. #85 pays for its own test lines (1.6 per product line); removals listed and confirmed by reviewer and tester, no line packing. If the ratio or feasibility blocks an AC: report to the director (who asks the PM), no own scope cut.
- Plan: developer (CSS in the existing max-width 559px rule, one assertion in an existing 375 px page test) -> reviewer and tester (own worktrees, foreground, one at a time; tester reuses $WEAVER_SCRATCHPAD/test-84 scripts) -> lead spot checks -> PR -> PM acceptance incl. persona round (AC6) -> merge commit with the accepted sha.

## Developer
- Developer: Claude Sonnet 5.5 (claude-sonnet-5-5), session `28d2788e-8588-47d1-8000-5904c97e526f`. Commits: CSS 63fe51e, test 03ed19b, this log.
- Means (4 lines in the existing max-width 559px rule): h1 1.4rem, margin 0 0 0.25rem; caption 0.8rem (12.8 px) with padding-bottom 0.25rem; #level margin 0 0 0.25rem; #status margin-top 0.5rem. The spike values alone left Tricky seed 8 at 740.5 px (0.5 px short) with status margin 0.5rem; the caption padding-bottom 0.5rem -> 0.25rem closes it (status bottom 736.5).
- Measured (headless Chrome, mobile emulation, main 638c0fa vs branch): grid top 106.8 -> 79.8 at 360/375/390 (27 px higher, AC1 needs 18). 360x740 seed 8: #status 568.5-736.5 (<= 740). Seed 1: conclusion and steps 1-2 end at 673.5; #status bottom 757.5 (step 3 cut, as intended). Caption 12.8 px, not clipped; h1 22.4 px. Button row top constant across states (no hint, 2 hints, Verify, New puzzle + Easy): 517.7 (360), 532.8 (375), 729.8 (1280, unchanged). 1280x900 picker and Tricky seed 1 after Hint twice screenshots byte-identical to main.
- Test: one assertion in f1e (375 px): grid top <= 88. Mutant (main style.css) fails it with 106.8. Suite: 172 pass, 0 fail, 0 skipped.
- Ratio: product 1324 -> 1328 (index 42, style 148, sudoku.js 1138); tests 2118 -> 2119 (page.test.js 549); cap floor(1.6 x 1328) = 2124, headroom 5; ratio 1.596 (before 1.600). No removals, no line packing.
- Known limits: the 30 px digits typed in the grid cells are larger than the 22.4 px title (on main the title was 32 px, so it was the largest); a title of 30 px would cost about 9 px of the gain and break AC2 seed 8. README and style.css header comment do not describe the phone header; unchanged.
