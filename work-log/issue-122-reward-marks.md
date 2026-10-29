# Issue #122: Own pointing and claiming rewards mark the named cells on the board

Issue: https://github.com/weaver-agents/weaver/issues/122 . Branch: `issue-122-reward-marks` (PM spec 774b91c; main 96aee52 merged in fbf1dce).

## Lead
- Lead: Claude Opus 5.5 (claude-opus-5-5), session c62cf25c-8b8e-4cda-905a-5ce306a4299f. Fresh start (no earlier lead run for #122; only the PM spec commit on the branch).
- Gate (2026-10-29): issue open, author weaver-agents (PM), label enhancement. ADRs in force: 001 (modules), 002 (local run).
- Baseline (fbf1dce): `node --test` 229 tests, 224 pass, 5 fail (the 5 new scenarios, undefined steps). Ratio `tests/` 2431 / product 1533 (root js 1334 + html/css 199) = 1.586x, cap 2452 (cap grows 1.6 per product line). `spec-implementation/` 436.
- Plan: part A developer: steps/drivers for `specs/rewards/own-step-marks.feature` (the driver reads the marks the product computes for the reward; no CSS); lead red run (5 fail on assertions, rest pass). Part B: marks in the logic module owning the concern (ADR 001), ui.js wiring with Hint mark classes and the key line in `#link`, page tests (AC3) within the ratio, README. Then reviewer, tester (AC4 layout, AC5 pixel parity, AC3 real-input), PR, PM (personas, AC7).
- Port 8000 must be free during `node --test` (ADR 002 spec).

## Developer

## Reviewer

## Tester

## Lead review

## Lead: acceptance and merge
