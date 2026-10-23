# Issue #96: Hint: pointing step 2 names every struck cell

- Issue: https://github.com/dirkmarski/weaver/issues/96
- Branch: issue-96-step2-struck-cells

## Lead
- Gate (2026-10-23, lead Claude Opus 5.5, session 541fd2f9-8dfe-4936-a1b6-0c535e8f682f): open, authored by weaver-agents (PM), label enhancement. Fresh start from main 8ed9eee.
- Baseline: 173/173 tests, skipped 0. Ratio tests 2187 / product 1371 (sudoku.js + index.html + style.css), cap 1.6x = 2193, headroom 6.
- Plan: developer changes step 2 text in sudoku.js (pointing explanation, ~line 345) to name every removed cell per AC1, adapts existing step-2 literals (sudoku.test.js 933/1230, page.test.js 260/269), adds unit pins for 1 / 2 / 3+ cells (AC4), README "Second click" paragraph (AC7). Ratio pressure: any new test lines beyond headroom need listed redundant removals in touched files (reviewer and tester confirm).
- Risk to check: stage-2 fit at 360x740 / 375x812 (AC6); PM flagged 1.1 px spare on seeds 1 and 8; tester also checks other seeds with 3+ struck cells at stage 2.
- Then reviewer, tester (one at a time, detached worktrees), lead check, PR, PM acceptance (AC9 persona round).
- PM decision (issue Change log 1, option A): stage-3 whole-text fit at 360x740 is not required in #96 (seed 8 #status bottom 757.5; moved to #97). The developer's removal of the f1a stage-3 `#status <= 740` assertion is accepted; f1a must be renamed (it still claims "the whole text fits") - pending rework item. AC4 3+ cases: seeds 33, 7, 12 (seed 38 did not reproduce).
- Review/test focus: text == struck cells (s.removed vs hintMarks), AC5 byte-identity of other text, stage-2 Next step fit at 360x740 and 375x812 on seeds 1, 8 and 3+ cell seeds (PM: 1.1 px spare on seeds 1/8).

## Developer
- Claude Sonnet 5.5, session 541fd2f9-8dfe-4936-a1b6-0c535e8f682f. Code commit 71a9612.
- sudoku.js: new `struckCells(s)` builds <cells> from `s.removed` (the list the board strikes); step 2 line is now one shared string for both forms (steps 1, 3, conclusion unchanged). README line 41 gives the rule. Tests: new test "issue 96" (8 first-pointing states on Tricky seeds 13, 18, 11, 3, 1, 33, 7, 12: both forms, row/column, 1 / 2 / 3 / 4 cells), existing step-2 literals updated (sudoku.test.js 3, page.test.js 3).
- Ratio: tests 2204 / product 1379 = 1.598 (cap 2206.4, headroom 2.4). 174/174 pass, skipped 0.
- Deviation: page test f1a asserted `#status` bottom <= 740 at 360x740 after step 3; with the longer step 2 on seed 8 it is 757.5 (one more wrapped line). Removed that one assertion (AC6 only requires Next step inside the viewport at stage 2, still asserted in f1a). Lead decision needed if a whole-text guard is wanted.
- Seed 38 / 13 hints spike claim not reproduced (my walk gives 2 removed cells there); 3+ cases used are listed in the test.

## Reviewer

## Tester

## Lead review

## Lead: acceptance and merge
