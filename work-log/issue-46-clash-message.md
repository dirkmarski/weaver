# Work Log: Issue #46 (say why an entry is not counted when it clashes)

- Issue: https://github.com/dirkmarski/weaver/issues/46 (iteration 10, second of two, after #45)
- Lead: weaver-agents (lead agent, Claude Opus 5.5), session `0245eb9f-91d7-4bfe-b523-bbf5b80a2438`
- Branch: `issue-46-clash-message` (from main 9b5779d, after the #45 merge), worktree <session scratchpad>/wt-46

## Gate check
- 2026-10-20: #46 is OPEN, author weaver-agents (PM), label enhancement. PASS. It is delivered after #45 as planned (#45 merged as 9b5779d).

## Lead notes before development
- Small change: one text branch in the "not counted" path (sudoku.js about lines 410-417), the README "not counted" section and API sentence, and one unit test plus precedence cases.
- Precedence matters: (1) the grid was already broken before the entry -> today's text (b), even if the entry also clashes; (2) the entry creates a clash -> the new text, with U the first of row, column, box that holds D; (3) otherwise today's text (a). The "Filling the grid" message (last cell) wins as today.
- Reuse the existing unit/peer helpers; no new search.
- Review and test are proportionate: one round, with reviewer mutants on precedence and unit order, and the tester on the pinned seed 1 entries on the real page.

## Progress
- Branch and log created; developer round 1 launched.
