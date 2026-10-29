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
- Part B spot check (lead, a2a6f64): diff stat matches the report (9 files, +88/-22); tests `-` lines are 2 import lines (widened); longest line unchanged (page.test.js 320 = main). `node --test` 230/230, skipped 0, 5.8 s. Ratio 2470/1564 = 1.579 (cap 2502). spec-implementation 483. Mutants (lead, reverted): m1 gate `how === 'own'` dropped -> 7 fail; m3 ui key blank -> 1 fail; m2 entered-cell filter in rewardMarks removed -> 0 fail (likely equivalent; reviewer to judge). Step fix in part B: `cellOf` string concat (index bug, red run unaffected: amber failed first).
- Port 8000 must be free during `node --test` (ADR 002 spec).

## Developer
- Part A (Sonnet 5.5, session c62cf25c): steps `steps/reward-marks.js` and driver `marksFor` in `drivers/game.js` for own-step-marks.feature.
- Driver calls the absent `hintmarks.rewardMarks(step, r, c)`; absent = no marks. 4 of 5 scenarios fail on the amber assertion; scenario 5 passes vacuously until part B.
- Part B: `hintmarks.rewardMarks`, `creditEntry` returns `marks` (gate in the product; driver only reads it), `ui.js showRewardMarks` with the Hint classes and key in `#link`; fixed `cellOf` in the steps (string concatenation, `m[2]` not a number). Specs 21/21 pass.
- Tests: page test r1 (seed 1 Tricky, hidden form), one unit assertion line for the gate. README paragraph "Marks on the board". Layout identical to main at 360x740 and 1280x900; longest key 155 chars, #link scrollHeight = clientHeight = 64.
- Ratio: tests/ 2431 -> 2470, product 1533 -> 1564, 1.579 (cap 2502).
- Rework r1: page test r1 pins data-d literal "9" on a confined (r7c1) and a removed (r4c1) cell and the full key text literal; dead `q !== p` dropped from rewardMarks. Mutants (data-d constant 1; "gray" in the key) now fail r1. tests/ 2470 -> 2472, product 1564 unchanged.

## Reviewer
- Reviewer: Claude Sonnet 5.5 (claude-sonnet-5-5), session c62cf25c-8b8e-4cda-905a-5ce306a4299f. Head reviewed: 86df9f1 (part B diff 5ce7a6a..86df9f1, part A be27e6a). Verdict: approve (no must findings); two should, two nit.
- Suite at 86df9f1: `node --test` 230 tests, 230 pass, 0 fail, 0 skipped.
- Findings:
  1. should, `tests/page.test.js` r1 (about line 712 to 730): the digit written in `data-d` (the badge digit, set from `marks.digit` in `ui.js` showRewardMarks) is not pinned. `dattr` lists only which cells carry the attribute. Mutant `setAttribute('data-d', 1)` survives all 230 tests; on the page that is a wrong digit in every badge (CSS shows `attr(data-d)`). Fix: assert the attribute value on one confined and one removed cell (or collect `[index, value]` pairs), literal digit from the seed.
  2. should, same test: expected values come from `rewardMarks`, the helper under test, so r1 checks wiring only; only the logic is pinned by the spec. Acceptable for wiring, but the key and the digit should be literal text on the page (a literal key string for the chosen seed). Only the hidden pointing form is on the page; naked and claiming wiring (key "in the row", no struck clause) are covered by the specs and unit test only. Optional if the ratio does not allow it.
  3. nit, `hintmarks.js` rewardMarks, removed filter: `q !== p` is dead (see m2 below). Remove it. The message text in `rewards.js` (`res.removed.filter(... mine ...)`) has no such guard, so removing it also makes marks and text use the same rule.
  4. nit, `ui.js` setCell, `else if (credit && credit.marks)`: the `else` is redundant. A completion needs the entered cell to be the last empty one, which is always a naked single, so marks are null whenever `done` is set. Mutant dropping `else` survives. Harmless; the AC wording "completion wins" holds by construction (could be noted in a comment).
- Mutants (each reverted; worktree clean; each `git diff` non-empty before scoring):
  - m2 drop `q !== p`: survived (equivalent, see below).
  - hidden unit kind forced to 0 (row): killed (1 fail).
  - line row/col swapped: killed (5).
  - box unit index +1: killed (5).
  - key claiming line replaced by 'box': killed (2).
  - key struck clause always added: killed (3).
  - removed filter without the hidden-unit membership test: killed (2).
  - rewards gate pointing only (claiming dropped): killed (2).
  - re-entry of a credited cell returns marks null: killed (1).
  - ui `data-d` constant 1: SURVIVED (finding 1).
  - ui marks shown even when completion shows (drop `else`): survived (equivalent, finding 4).
  - ui showRewardMarks without `unlink()` (key not written): killed (1).
  - ui `confined` class dropped from the loop: killed (1).
- m2 equivalence: proved. `rewardMarks` filters `step.removed` by hidden-unit membership only when `units.length > 2` (hidden form). A hidden step comes from `singleAfterStep`, whose `else if` branch (p not in `removed`) is the only one returning `form: 'hidden'`; the `removed.indexOf(p) >= 0` branch returns `form: 'naked'`. So in the hidden form p is never in `step.removed`, and in the naked form the filter is not evaluated. Dead code, not a test gap.
- Spec checks: AC2 area/confined/removed/key correct for all 4 forms (hidden unit box, row, column covered via the unit index and `UNIT_NAMES.indexOf`); key text matches Behaviour, "in the row/column" for claiming, struck clause only when removed. ADR 001: marks live in `hintmarks.js`, `rewards.js` imports it (no cycle: hintmarks does not import rewards; modules test passes), only `ui.js` touches the page; no new root file. ADR 002 not affected.
- Driver: `spec-implementation/drivers/game.js` now reads `res.marks` and holds no product decision; the `classifyEntry` and `hintmarks` imports were removed. `cellOf` fix (`Number(m[2])`) correct (string concat bug with `+ m[2]`).
- ui lifetime: reward marks use the Hint classes and `data-d`; `clearResults()` removes `hint-area`, `hint-digit`, `hint-confined`, `hint-removed`, `data-d`, resets `keyText` and calls `unlink()` (writes the empty reserve). Called from a changed value (setCell), Hint (before its own marks), Verify, `newPuzzle`, `choose`. Notes changes keep it (setCell `changed` false for a notes-only change), focus and blur do not call it. Re-entry of a credited cell shows the marks again with the text (consistent).
- Not checked: pixel and layout behaviour (tester, AC4/AC5), real-input behaviour, README sentence by sentence beyond the new bullet's presence and the Modules/rewards lines, the full set of 5-scenario red run (lead did it), ratio computation (lead's figures not recomputed), PM acceptance.
- Read: lessons.md Review and Testing sections, architecture.md Modules and ATDD sections, work-log Lead section, issue 122, diff 5ce7a6a..86df9f1 for hintmarks/rewards/ui/driver/steps/tests/README, ui.js ranges 45-160, 240-270, 372-396, rewards.js 20-104, techniques.js 60-148, spec feature first 60 lines. LOG.md not read.

## Tester

- Model Claude Sonnet 5.5 (claude-sonnet-5-5), session c62cf25c-8b8e-4cda-905a-5ce306a4299f. Head tested: 63d077e (main 96aee52 for comparison). Scratch and README: lead scratchpad `test-122/`.
- Verdict: pass.
- Findings:
  1. AC4: the four round-3 states at 360x740 and 1280x900: button row top 517.73 / 729.80 and `#status` top 568.52 / 780.58 equal on main and branch; `#link` scrollHeight = clientHeight = 64 for all (longest key, claiming column with struck clause, 155 characters, 3 lines at 360).
  2. Independent oracle (facts.md parse, computed styles): tinted, dashed, visible badge and struck sets, badge digit (`data-d` and `::after` content), key text ("box, rows and columns") match all four states at both sizes; the entered cell is tinted with no other mark; `data-d` only on badge cells; no rings, hatching, target or links; reward text unchanged.
  3. AC3 (real CDP mouse/key/touch): kept after click outside the grid, arrow focus move, click on another cell, Notes button, a real note entry, N key, Tab (entered cell loses focus); gone after overwrite, Backspace, Delete, new entry, Verify, Hint (state identical to main's Hint marks), New puzzle and level choice. Touch at 360: tap cell, Notes, outside keep; Verify clears. Hint-credited pointing reward ("Well done!", Tricky seed 1) and a singles reward (Tricky seed 2) show no marks and an empty reserve.
  4. AC5: pixel-identical main vs branch (0 differing pixels, byte-identical) for a Hint pointing explanation (all steps) and a singles reward at 360 and 1280; 0 console errors everywhere.
  5. Observation (not a defect): retyping the same digit into the entered cell is no value change, so the marks stay.
  6. Mutants (ui.js, reverted): 8 of 9 killed (data-d digit, key not cleared, focus clears, notes clears, key not shown, hint-target on entered cell, hint-credited gate dropped; data-d on area cells killed after adding a `data-d only on badge cells` check). m3 (drop `[data-d]` from the clearResults selector) survives: the confined and removed cells are always inside the amber area, so `.hint-area` removes them; equivalent for reward marks.
- Not tested: devices other than headless Chrome (no Safari/Firefox); real phone keyboards; Hint-credited claiming; marks across an in-game level change (the picker is only reachable through New puzzle); `node --test` (developer/lead ran it).

## Lead review

## Lead: acceptance and merge
