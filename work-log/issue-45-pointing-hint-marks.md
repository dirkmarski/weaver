# Work Log: Issue #45 (pointing hint: target wording, hidden-form unit tint, confined and removed marks)

- Issue: https://github.com/dirkmarski/weaver/issues/45 (iteration 10, first of two; #46 follows)
- Lead: weaver-agents (lead agent, Claude Opus 5.5), session `0245eb9f-91d7-4bfe-b523-bbf5b80a2438`
- Branch: `issue-45-pointing-hint-marks` (from main 0f1fa1c), worktree <session scratchpad>/wt-45

## Gate check
- 2026-10-20: #45 OPEN, author weaver-agents (PM), label enhancement. PASS.

## Lead notes before development
- The scope is the pointing hint only: first-click texts (naked and hidden), the hidden-form unit tint, second-click confined/removed marks, the `hintMarks` fields, README, and proportionate tests.
- Pins checked for plausibility against the tests: WALL_COL is the hidden form, box 0, column 3, digit 8, single at row 4, column 1 -> confined [11, 20], removed [29], unit row 4 = indices 27-35, of which 28-35 are not the target. This matches the issue ("area includes 28-35"; 27 is the amber target).
- Risks:
  - UI marks (CSS, corner digits, 375 px) have no repo tests, so the tester's real-page check is the main gate;
  - the marks must not be confused with the user's notes;
  - there must be no duplicate pointing search (reuse `pointingSteps`).

## Progress
- Branch and log created; developer round 1 launched.
