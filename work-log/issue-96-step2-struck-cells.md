# Issue #96: Hint: pointing step 2 names every struck cell

- Issue: https://github.com/dirkmarski/weaver/issues/96
- Branch: issue-96-step2-struck-cells

## Lead
- Gate (2026-10-23, lead Claude Opus 5.5, session 541fd2f9-8dfe-4936-a1b6-0c535e8f682f): open, authored by weaver-agents (PM), label enhancement. Fresh start from main 8ed9eee.
- Baseline: 173/173 tests, skipped 0. Ratio tests 2187 / product 1371 (sudoku.js + index.html + style.css), cap 1.6x = 2193, headroom 6.
- Plan: developer changes step 2 text in sudoku.js (pointing explanation, ~line 345) to name every removed cell per AC1, adapts existing step-2 literals (sudoku.test.js 933/1230, page.test.js 260/269), adds unit pins for 1 / 2 / 3+ cells (AC4), README "Second click" paragraph (AC7). Ratio pressure: any new test lines beyond headroom need listed redundant removals in touched files (reviewer and tester confirm).
- Risk to check: stage-2 fit at 360x740 / 375x812 (AC6); PM flagged 1.1 px spare on seeds 1 and 8; tester also checks other seeds with 3+ struck cells at stage 2.
- Then reviewer, tester (one at a time, detached worktrees), lead check, PR, PM acceptance (AC9 persona round).

## Developer

## Reviewer

## Tester

## Lead review

## Lead: acceptance and merge
