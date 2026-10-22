# Issue #91: Board marks and key line follow the revealed pointing step

Issue: https://github.com/dirkmarski/weaver/issues/91 (PM, it19 issue 2 of 2). Branch: issue-91-staged-marks from main 8d4717b (after PR #92).

## Lead
- Lead: Claude Opus 5.5 (claude-opus-5-5), session `19338c12-dbf9-46b7-b92b-1a81aef47c6d`. New lead run in the same session id as #90 (separate run; no branch, PR or log for #91 existed: fresh start).
- Gate: issue open, authored by weaver-agents (PM), no comments.
- Baseline: product 1359 (sudoku.js 1165, index.html 43, style.css 151), tests 2174, cap floor(1.6 x 1359) = 2174, headroom 0. Each product line buys 1.6 test lines; removals only if listed, reviewer- and tester-confirmed, never AC-required; no line packing (no line longer than the file's current longest).
- Plan: developer (staged marks, key helper, README, unit + page tests) -> lead check -> reviewer and tester (own detached worktrees, foreground, one at a time) -> rework if needed -> PR -> PM acceptance incl. persona round (AC10) -> merge commit with the accepted sha.

## Developer

## Reviewer

## Tester
