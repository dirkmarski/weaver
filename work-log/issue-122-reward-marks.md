# Issue #122: Own pointing and claiming rewards mark the named cells on the board

Issue: https://github.com/weaver-agents/weaver/issues/122 . Branch: `issue-122-reward-marks` (PM spec 774b91c; main 96aee52 merged in fbf1dce).

## Lead
- Lead: Claude Opus 5.5 (claude-opus-5-5), session c62cf25c-8b8e-4cda-905a-5ce306a4299f. Fresh start (no earlier lead run for #122; only the PM spec commit on the branch).
- Gate (2026-10-29): issue open, author weaver-agents (PM), label enhancement. ADRs in force: 001 (modules), 002 (local run).
- Baseline (fbf1dce): `node --test` 229 tests, 224 pass, 5 fail (the 5 new scenarios, undefined steps). Ratio `tests/` 2431 / product 1533 (root js 1334 + html/css 199) = 1.586x, cap 2452 (cap grows 1.6 per product line). `spec-implementation/` 436.
- Plan: part A developer: steps/drivers for `specs/rewards/own-step-marks.feature` (the driver reads the marks the product computes for the reward; no CSS); lead red run (5 fail on assertions, rest pass). Part B: marks in the logic module owning the concern (ADR 001), ui.js wiring with Hint mark classes and the key line in `#link`, page tests (AC3) within the ratio, README. Then reviewer, tester (AC4 layout, AC5 pixel parity, AC3 real-input), PR, PM (personas, AC7).
- Part A be27e6a (developer): scenario 5 passed vacuously (no marks to clear). Q1 to PM: option (a), spec 9beabb2 adds a precondition to scenario 5 (PM D7).
- Red run (lead, 0794f83, `node --test spec-implementation/specs.test.js`): 21 tests, 16 pass, 5 fail, each on an AssertionError at `the amber area is:` (lines 24, 45, 68, 89, 114). Output: lead scratch `lead-122/red-run.txt`.
- Lead notes for part B: the driver gates on `step.technique` itself; the own-pointing/claiming gate (not hint-credited, not "not counted") must live in the product, the driver only reads it.
- Port 8000 must be free during `node --test` (ADR 002 spec).

## Developer
- Part A (Sonnet 5.5, session c62cf25c): steps `steps/reward-marks.js` and driver `marksFor` in `drivers/game.js` for own-step-marks.feature.
- Driver calls the absent `hintmarks.rewardMarks(step, r, c)`; absent = no marks. 4 of 5 scenarios fail on the amber assertion; scenario 5 passes vacuously until part B.
- Part B: `hintmarks.rewardMarks`, `creditEntry` returns `marks` (gate in the product; driver only reads it), `ui.js showRewardMarks` with the Hint classes and key in `#link`; fixed `cellOf` in the steps (string concatenation, `m[2]` not a number). Specs 21/21 pass.
- Tests: page test r1 (seed 1 Tricky, hidden form), one unit assertion line for the gate. README paragraph "Marks on the board". Layout identical to main at 360x740 and 1280x900; longest key 155 chars, #link scrollHeight = clientHeight = 64.
- Ratio: tests/ 2431 -> 2470, product 1533 -> 1564, 1.579 (cap 2502).

## Reviewer

## Tester

## Lead review

## Lead: acceptance and merge
