# Work Log: Issue #56 Hint explanation: relevant rings, key line, badge in its note slot

- Issue: https://github.com/dirkmarski/weaver/issues/56 (author weaver-agents / PM, label enhancement, open)
- Branch: `issue-56-hint-rings` (from main f55b6a8, which includes #55's page harness)
- Iteration: 12. Session `4ecb9163-8db9-4624-9aa5-9c6e3ff52aab`.

## Lead
- 2026-10-20: Gate check passed: issue open, authored by weaver-agents (PM), labelled enhancement. Delivered after #55 (merged f55b6a8).
- Reading of the issue (for reviewer and tester):
  - Second-click (`explain`) only: ring filter (`hintMarks().digits`), key line (pointing explain only, pure helper), badge in D's note slot (CSS), box-case parenthesis. First click, reward texts, counts, hint order and `findPointing` results unchanged.
  - Pins P(1), P(3), P(4), P(8), P(10), H(1)-H(3) are the acceptance values; on a mismatch between a pin and the rule, stop and ask the PM (via lead).
  - Expected changes to existing `digits` assertions must be listed by the developer.
  - Page tests for the key line and badge go into tests/page.test.js (#55 harness); page evidence must show skipped = 0 (PM condition at #55 acceptance). Keep the harness lean (ratio ~1.45x; PM trims past ~1.6x).
  - Badge: 375 px and 900 px screenshot check by the tester, with notes set in a confined cell.
  - Mutants in AC7 are the minimum targeted set.
- Carry-forward nits from #55 (L4, tests/chrome.js: `watchdog` declaration order, dead `gone` check): not in scope here unless the developer touches tests/chrome.js anyway.
- 2026-10-20: Developer launched on #56 (wt-56). Brief: issue is the spec; stop on pin/rule mismatch; key line via clearResults; badge CSS-only if possible; list changed digits assertions; page tests lean with skipped = 0; self-run AC7 mutants.

- 2026-10-20: Developer delivered 31758fc: all pins match; 164 tests, 0 skipped, ~2.27 s; AC7 mutants killed (self-run). Lead read of the product diff: ring rule via reason cells in `hintMarks`; `pointingKey(d, ringCount)`; `#key` cleared in `clearResults`; badge via `--x/--y` per `data-d`; box case in `pointingHint(s, step, grid)` on step 2 only.
- Points passed to reviewer/tester: (1) is the key line cleared on New puzzle and on choosing a level (do those paths call `clearResults`?); (2) Hint click with a non-pointing result after a pointing explain (key line cleared first?); (3) reason cells: the hidden-form check relies on `hint.unit` being absent for the naked form; (4) box-case count equality (empties == confined) is equivalent to "all empties confined" only because confined is a subset of the box's empties; (5) badge chip ~18.8 px vs slot ~18.67 px.
- Lead question Q1 to the PM (wording): the pinned key text "a D" gives "a 8" (and "a 8 that rules out other cells"); "an 8" is grammatical. Asked the PM to decide; review and test proceed in parallel and any wording change rides in the rework round.

- 2026-10-20: PM answer to Q1 (option C, issue body edited with a change log, comment 6286832562): key template "Key: dashed purple = the only places for D in the box; struck grey D = D can no longer go there; purple ring = this D rules out other cells." (ring clause dropped when no rings). Goes into the rework round with the reviewer/tester findings.

- 2026-10-20: Reviewer (8ac1f8b): approve; S1 should-fix (zero-ring key wiring untested: `pointingKey(d, 1)` / `pointingKey(d, marks.digits)` survive); N1 (f3 checks D=1,5,9 only; `--x` for 4 dropped survives), N2 (README "Well done" line omits the key line), N3 (README wiring/Files do not mention `#key`). 23 mutants, 20 killed; #22 (choose skips clearResults) equivalent, #23 unreachable. Tester (8ac1f8b): AC1, AC2, AC4, AC5, AC7 pass, all pins match (key-line pins were the pre-Q1 text); D1 should-fix: at 375 px the chip (13-16 px wide) exceeds the note slot (~12 px): D=5 touches notes 4 and 6 (readable; lead viewed zoom_s9_D5_375.png), D=3/6/9 chips clip at the right cell edge; at 320 px real overlap.
- Lead Q2 to the PM: D1 is a spec conflict (section 3: "size ... stay as they are" vs "covers only D's own note slot") at phone widths. Options: (A) accept as is (touching but readable at 375 px), (B) narrow-width rule shrinking chip padding/font so it fits the slot, (C) clamp inside the cell only. Rework waits for the answer so that it is one round.

- 2026-10-20: PM Q2 decision C (issue AC3 rewritten, comment 6286918769): chip size/colours/strike unchanged; at 375 px the badge stays fully inside its cell (0.5 px tolerance), its centre inside D's slot, overlap with any other note's glyph box at most 2 px per direction, font and padding as at 900 px; at 900 px 0 overlap; 320 px out of scope.
- Lead decision L1 (rework round 1, behaviour change -> full re-review and re-test of the delta): Q1 key text (`pointingKey`, its tests, README quote); S1 page assertion at zero rings (P(4)-like state, key === pointingKey(9, 0), no "purple ring"); N1 f3 loops D = 1..9; N2/N3 README; D1 per Q2 (CSS clamp inside the cell at edge slots), with a numeric page check of the 375 px criteria if lean. Risk noted: at 375 px the D=5 chip may already overlap notes 4/6 by more than 2 px in one direction; the developer measures first and stops to report if the Q2 criteria cannot all hold with an unchanged chip.

## Developer
- 2026-10-20: Implemented #56 as specified. No pin disagreed with the rule.
- Product: `hintMarks` ring rule (reason cells, helper `addReasons`); `pointingKey(digit, ringCount)` (exported); box-case parenthesis in `pointingHint` (now takes the grid; first click and `pointingClause`, so "Well spotted!", unchanged); `<p id="key">` below the status line (not a live region), set on a pointing explain in the Hint handler and cleared in `clearResults`; badge in D's note slot by CSS (`--x`/`--y` per `data-d`, `left/top` + `translate(-50%, -50%)`).
- Changed existing assertions (all expected): tests/sudoku.test.js
  - `hintMarks` test: `explain.digits` [25, 74] -> [74] (r3c8 holds the other 3 and rules out no reason cell); WALL_COL hidden `digits` [4, 43, 55] -> [43] (P(8) shape: only r5c8 touches the row-4 reason cells).
  - WALL_COL (seed 8) pointing text now has " (the box has no other empty cells)" (all box empties confined; the P(8) pin).
  - tests/page.test.js: `noHint` also asserts the key line is empty; test f reads the key line (empty on click 1, `pointingKey(...)` on click 2, kept on a notes change); the pointing pick was hoisted to a shared const (no behaviour change).
- New tests: sudoku.test.js: hand-built ring cases (hidden single with irrelevant D and a D blocking only the target; pointing a only, none, b only with removed-cell blocker), `pointingKey`, pins P(1/3/4/8/10) and H(1/2/3) with texts, regressions for first click / Well done / Well spotted. page.test.js: f2 (Verify clears key; no key on a single's explain), f3 (badge centre equals the note slot centre for D = 1, 5, 9 via computed position).
- Pins: all match (rings, key lines, exact P(4)/P(8)/P(3) texts, P(4) badge cells). Note the pinned key text gives "a 8"/"a 9" (grammar of the exact text kept as specified).
- AC7 mutants, each killed (never committed): b dropped (3 fail), removed as reason (1), ring clause always (1, unit), key not cleared (2), box case "confined > 1" (2).
- `node --test` x3: 164 tests, 0 fail, 0 skipped, ~2.27 s. Code lines: sudoku.js 993 -> 1023, style.css 116 -> 124, index.html 40 -> 41; tests 1574 -> 1694 (ratio ~1.43).
- Caveat: the chip (about 18.8 px tall) is nominally 0.1 px taller than the 18.67 px slot; the badge is centred on the slot. Tester to confirm at 375/900 px.

## Reviewer
- 2026-10-20 Review of head 8ac1f8b (product commit 31758fc). Verdict: approve; no must-fix. `node --test` x2: 164 tests, 0 fail, 0 skipped, 2.31 s and 2.47 s.
- Correctness (data followed creation to use): `hintMarks` builds reasons = box empties minus confined (a) plus, only when `hint.unit` is set (pointing hidden form), the unit's empties minus target and removed (b); the target is excluded in a (x !== p) and in b; hidden single: the unit's empties minus the target; ring = a D cell sharing a row/column/box with any reason cell; ascending; D4 keeps all; naked single: d = 0, no rings. `hint.unit` is absent for the naked pointing form (P(1), P(4) pins pass). Box case: `empties.length === s.confined.length` is exact because confined is a subset of the box empties (spotsFor over the box); only on step 2, so the first click, "Well spotted!" (creditEntry uses pointingClause) and "Well done!" are unchanged. `pointingKey` text matches the issue character for character; ring clause only when `marks.digits.length > 0`.
- Wiring: `#key` is set only in the Hint handler for `technique === 'pointing' && kind === 'explain'`, after `clearResults()`. `clearResults` clears it and is called from the value-change branch of applyEntry (not for a notes-only change), Verify, newPuzzle, choose and the Hint handler (before the new text, so a conflict/none/full/naked/hidden result leaves it empty). A non-pointing Hint result after a pointing explain cannot occur: a showing hint implies the grid is unchanged, so the result is the same pointing explain; that path is therefore unreachable and untested by design. `#key` has no role/aria-live; `#status` keeps role=status.
- AC5: changed existing assertions match the developer's list exactly (hintMarks test explain.digits [25,74]->[74]; WALL_COL hidden digits [4,43,55]->[43]; WALL_COL pointing text gains the parenthesis; page `noHint` also asserts key ''; test f reads the key and hoists the `pointing` pick). Both digit changes are consistent with the rule (r3c8 and r1c5/r7c2 rule out no reason cell). No other existing assertion changed. First click, order, findPointing, rewards, counts, clash outline, Verify untouched in the diff.
- CSS: `.notes` is `position:absolute; inset:0` with a 3x3 1fr grid, the badge is positioned from the same td padding box at 1/6, 1/2, 5/6 with translate(-50%,-50%), so its centre equals the slot centre; f3 proves it by computed position for 1, 5, 9. Size, colours, chip, strike untouched. `--x/--y` inherit into ::after. confined and removed are disjoint; hint-target co-occurs only with hint-removed (naked form), which positions the same way. No dead rules; the 16.667/83.333 values are the only new constants. Chip 18.8 px vs slot 18.67 px: 0.07 px overlap per side, invisible (tester to confirm).
- Leanness: product +30 net sudoku.js, +8 style.css, +1 index.html; tests +120 (ratio ~1.43). Minor duplication: the "cell is empty" expression `grid[Math.floor(q / 9)][q % 9] === 0` is now written in `pointingHint` and `addReasons` (it already appears elsewhere); no existing empties helper takes a unit, so this is acceptable. Tests reuse `emptyGrid`; `put`/`at`/`cells` are small new helpers (`at` could be `9 * r + c` inline but is fine).
- README: sentence-by-sentence check against behaviour passes (both Second click paragraphs, key line, badge slot, box-case sentence, hint-removal list, `hintMarks` and `pointingKey` in Files). No "corner" or "every cell holding the digit" left in README, sudoku.js, style.css, index.html.
- Wording (Q1): the "a 8" fix would land in `pointingKey` (sudoku.js, two places: "= a ' + d" and "; purple ring = a ' + d", e.g. a local `var a = d === 8 ? 'an ' : 'a '`), the `pointingKey` unit test (add an 8 case; the 1/9 cases stay), and the quoted text in the README key-line sentence (say "a D"/"an 8"). Page tests use `pointingKey` so they follow automatically.

Findings
- should-fix S1 (tests/page.test.js, test f around the `s.key` assertion): the wiring of `ringCount` is not covered at zero rings. Mutants `pointingKey(d, 1)` and `pointingKey(d, marks.digits)` (an array is always truthy) survive, so "ring clause only when rings show" is tested for the helper only. Fix: one page assertion on a state with no rings (P(4): seed 4 after playing the singles, as `pointing` does) that `key` equals `pointingKey(9, 0)` and has no "purple ring"; or pick a second state via `pick` where `S.hintMarks(...).digits` is empty.
- nit N1 (tests/page.test.js f3): checks digits 1, 5, 9 only; a `--x/--y` selector error for 2,3,4,6,7,8 survives (mutant: digit 4 dropped from its --x rule). AC3 asks for 1, 5, 9 at least, so not blocking; looping `[1,2,...,9]` is a one-line change.
- nit N2 (README.md:47): the "Well done" line lists "tint, purple rings and pointing marks" going away; the key line is not named there (cleared with the hint; the removal sentence at the notes paragraph does name it). Optional.
- nit N3 (README Files / page-test description at README.md:90): neither mentions `#key`; optional.

Mutants (run on a scratch copy; none committed)
| # | Mutant | Result |
|---|---|---|
| 1 | reason cells a dropped | killed (6) |
| 2 | target counted as a reason cell (b) | killed (2) |
| 3 | ring via same box only | killed (10) |
| 4 | key set on first click | killed (2, page) |
| 5 | key never cleared | killed (3, page) |
| 6 | box-case parenthesis on first click | killed (4) |
| 7 | badge --x dropped for digit 4 | SURVIVED: see N1 |
| 8 | ringCount passed as 1 always | SURVIVED: see S1 |
| 9 | removed cells not excluded in b | killed (2) |
| 10 | hidden-single target counted as reason | killed (2) |
| 11 | box case "confined > 1" (AC7) | killed (4) |
| 12 | ring clause always (AC7) | killed (2) |
| 13 | b dropped (AC7) | killed (6) |
| 14 | notes change clears key | killed (2, page) |
| 15 | key clear only in value change/Verify, removed from clearResults | killed (3) |
| 16 | key text wrong in struck-grey clause | killed (2) |
| 17 | box-case parenthesis placed before the clause | killed (4) |
| 18 | badge --y digit 5 wrong | killed (2, page f3) |
| 19 | ring when only the first reason cell counts | killed (4) |
| 20 | newPuzzle skips clearResults | killed (2, page) |
| 21 | Verify skips clearResults | killed (2, page) |
| 22 | choose skips clearResults | SURVIVED, equivalent: the picker is reachable only after newPuzzle (which clears) or at load (no hint); no test possible or needed |
| 23 | Hint handler keeps the old key through clearResults | SURVIVED, unreachable: with a hint showing the grid is unchanged, so the Hint result is again the pointing explain; no test possible |


---

## Tester
- 2026-10-20, tested head 8ac1f8b (product commit 31758fc). Scratch scripts: scratchpad/ts56/ (real page via tests/chrome.js launch, seeded Math.random).
- Plan and results:
  - AC1/AC4 pins on the real page (follow Hint from start for P(1,3,4,8,10); fresh second click for H(1-3)): rings, explanation text, key line, box-case parenthesis all match the issue table. An independent oracle (my own code, grid read from the page, reason cells derived from the text, not hintMarks) agrees with the page on all 8 pins. PASS.
  - AC2: key absent on first click, singles' explain, conflict hint, "none" hint (hard seed 1); shown on pointing explain and kept on a further Hint click, on Notes toggle and on adding a note; cleared by value change, Verify, New puzzle, level choice; next Hint after a value change is a nudge with empty key. `#key` has no role / aria-live; `#status` keeps role=status; `#key` directly follows `#status`. PASS.
  - AC3: screenshots and numeric badge-vs-slot overlap with all 9 notes in a confined and a removed cell, seeds 3 (D=1), 9 (D=5), 4 and 2 (D=9). At 900 px: badge overlaps only its own slot, nothing else. At 375 px: no note glyph is covered for D=1 and D=9, but the chip (13-16 px wide) is wider than a ~12 px slot in a ~37 px cell: D=5 touches notes 4 and 6 (glyph box overlap up to 5 px2), D=3/6/9 chips are clipped on the right cell edge. At 320 px glyph overlap up to 37 px2. PASS at 900, PASS-with-defect at 375 (D1 should-fix).
  - AC5: origin/main vs branch on P(3), P(4), H(1), H(3): first click (status, tint, target, focus) identical; second click identical except P(4) status (the parenthesis); tally after entering the hinted digit identical. PASS.
  - AC7: five mutants each killed (b dropped 3 fail; removed as reason 1; ring clause always 1; key not cleared 2; box case "confined > 1" 2); `git diff --exit-code` clean after each.
  - Suite: `node --test` x3: 164 tests, 164 pass, 0 fail, 0 skipped, 2.23-2.26 s.
- Defects: D1 (should-fix) badge chip wider than the note slot at narrow widths (375 px: D=5 touches notes 4/6, D=3/6/9 chip clipped at the right cell edge; 320 px: overlaps neighbours). Nit: pinned wording "a 8"/"a 9" (grammar), lead question Q1 already open.
- Not checked: AC6 README wording (not in my scope list).
