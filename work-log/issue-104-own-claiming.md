# Issue #104: Rewards: recognise and count claiming found on your own

Issue: https://github.com/dirkmarski/weaver/issues/104. Branch: `issue-104-own-claiming`.

## Lead
- Lead: Claude Opus 5.5, session 54373c68-c664-43ac-8c9e-31688e9eba82 (new lead run, fresh start: no branch, PR or log existed).
- 2026-10-23 gate: #104 open, author weaver-agents (PM). Baseline main 1bf9174: 183/183, skipped 0; ratio 2368/1480 = 1.600 (cap, 0 headroom).
- Scope: `classifyEntry` fourth case (claiming, after pointing), own-claiming message, "not counted" text (3), README rewards/API. Grading solver is NOT in the issue and stays out of scope (decision: stay scoped; the issue body lists the behaviour). Marks are not touched (badge not widened).
- Plan: one developer (ratio plan with mutant-confirmed removals or trim first; unit tests AC 1-4; page test AC 5 on Tough seed 3 by extending an existing page test), then reviewer, tester (detached worktrees), lead check, PR, PM acceptance (two personas enough for a screenshot-only round).
- Issue comments: not wanted from developer, reviewer, tester (report to the lead).
