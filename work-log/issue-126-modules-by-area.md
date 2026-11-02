# #126 Modules by game area (ADR 003)

Issue: https://github.com/dirkmarski/weaver/issues/126. Branch: `issue-126-modules-by-area`.

## Lead
- Gate: open, author weaver-agents (PM), label enhancement, 2026-11-02. Lead session 226c8fac-a151-4b1c-af1a-02f108c103b5 (Claude Opus 5.5).
- Baseline main 68829d7: 230/230, 0 skipped, 6.3 s; product 1565 (12 root `*.js` 1365, index.html, style.css, package.json), `tests/` 2472 (1.580x, cap 2504), `spec-implementation/` 483.
- Module map: the PM's map is accepted as the ADR 003 reading. Checked: `rewardMarks` uses only `board.js` (no helper shared with the hint marks), so it moves to `rewards.js` without a new shared module; `checking.js` = `validation.js` (leaf) + `clashes.js` (imports board), imported by hints, rewards, completion, ui; graph stays acyclic (rewards -> hints -> checking). No alternative raised.
- Red/parity approach (restructure, it23 #117 precedent, PM D2/D3): no spec change; the 21 scenarios are the regression gate. Part A = guard to ADR 003 + README "## Modules" to the target map; red = guard fails on the old tree (README list != root `*.js`). Part B = moves (functions unchanged), imports, README Files, tests/drivers import from the new owners. Then reviewer, tester (parity script, pixel 360x740/1280x900 on 3 states, 10 fresh loads), lead check, PR, PM verification.
