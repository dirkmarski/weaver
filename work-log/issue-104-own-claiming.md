# Issue #104: Rewards: recognise and count claiming found on your own

Issue: https://github.com/dirkmarski/weaver/issues/104. Branch: `issue-104-own-claiming`.

## Lead
- Lead: Claude Opus 5.5, session 54373c68-c664-43ac-8c9e-31688e9eba82 (new lead run, fresh start: no branch, PR or log existed).
- 2026-10-23 gate: #104 open, author weaver-agents (PM). Baseline main 1bf9174: 183/183, skipped 0; ratio 2368/1480 = 1.600 (cap, 0 headroom).
- Scope: `classifyEntry` fourth case (claiming, after pointing), own-claiming message, "not counted" text (3), README rewards/API. Grading solver is NOT in the issue and stays out of scope (decision: stay scoped; the issue body lists the behaviour). Marks are not touched (badge not widened).
- Plan: one developer (ratio plan with mutant-confirmed removals or trim first; unit tests AC 1-4; page test AC 5 on Tough seed 3 by extending an existing page test), then reviewer, tester (detached worktrees), lead check, PR, PM acceptance (two personas enough for a screenshot-only round).
- Issue comments: not wanted from developer, reviewer, tester (report to the lead).

## Developer
- Developer: Claude Sonnet 5.5, session 54373c68-c664-43ac-8c9e-31688e9eba82. Commit b7b1879 (code, tests, README); this log is the next commit.
- What: `classifyEntry` loops pointing then claiming steps (one step, no chain; a box-form claiming single is a hidden single already, so no skip argument); own-claiming message in `creditEntry`; "not counted" text (3); README rewards, Claiming, API, status sentences. Grading solver, marks, Hint order untouched.
- Tests: 184/184, skipped 0 (baseline 183). Ratio 2374/1484 = 1.5997 (cap 1.6, product +4 lines in sudoku.js). Unit: classifyEntry claiming (naked, hidden, pointing wins, chain null, wrong digit null, conflict null), creditEntry (seeds 3, 12 claiming, seed 1 pointing, once per cell, re-entry, hinted on a credited cell); page: g1 types r5c4 = 6 on Tough seed 3 (message, class ok, Claiming 1/0).
- Removed assertions (tests still covering, killing mutant in `dev-104/mutants.py`): completionFor slot/aggregate lines t(0,1,0,0), t(0,0,1,0), t(0,0,0,1), t(30,0,10,0), t(12,13,14,15), t(0,0,0,0,1,0), t(0,0,0,0,0,1), t(0,0,0,0,0,0,1,0), t(0,0,0,0,0,0,0,1) (MIXED and t(2..9) cover; R1 R2 R3); test "a single in another cell while a hint shows" (the wrong-digit test covers the hint match; R4); `second.tally.hidden` and `own.tally.naked` lines (full-tally assertions cover; R8 R9); four `.kind` lines of the statusClass test (kind asserted in the pointing, hint and `none` tests; R5a R5b R6 R7). All 20 mutants killed.
- Pin discrepancy: seed 7 r2c2 = 2 is not claiming under #102's definition (null today and after; needs two steps). Seed 12 r2c3 = 5 used instead. Seeds 3 and 1 as in the issue.
- Evidence: /tmp/wvr/claude-502/-Users-dirk-Code-weaver-team/54373c68-c664-43ac-8c9e-31688e9eba82/scratchpad/dev-104/ (README.md, pins.js 18/18, layout.js 9/9, shots/).
- Not tested: real-touch input, other browsers, seed 7 as claiming (does not apply), Hard/Medium own claiming pages.

## Lead: developer check and spec question
- Developer b7b1879 + log 1383ed1 (Sonnet 5.5). Lead check: 184/184, skipped 0; ratio 2374/1484 = 1.5997 (cap 2374.4); product diff 12 lines in sudoku.js (classifyEntry loops pointing then claiming steps; claiming message; text 3). 9 completionFor tuples, 1 test, 2 tally lines, 4 `.kind` lines removed, mutant-confirmed by the developer (dev-104/mutants.py, 20 killed); reviewer and tester to confirm.
- Seed 7 r2c2 = 2 (AC 2) is null under the one-step rule; lead scan: seed 7 has no claiming entry at the start. PM D15 (issue Change log, comment 6359497282, PM log 0bd1b29): AC 2 pin replaced by seed 12 r2c3 = 5 (claiming, column 1, D 2, box rows 1-3 cols 1-3).
