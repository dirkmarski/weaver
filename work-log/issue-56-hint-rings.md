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

- 2026-10-20: Rework round 1 (560b21b): items 1-4 done (Q1 text, S1 zero-ring page test f2b, N1 D=1..9 loop, N2/N3 README); 165 tests, 0 skipped; S1/N1 mutants and AC7 five killed. Item 5 (D1) stopped as instructed: at 375 px, unchanged chip, the no-clip rule and the <= 2 px overlap limit are mutually exclusive for D = 1, 3, 4, 6, 7, 9 (flush-to-edge overlap 2.58-5.11 px); D = 8 is ~2.1 px with no shift possible. Centre-in-slot holds after a flush shift. style.css unchanged so far. Lead Q3 to the PM with the measurement table (developer report; scripts dev56/measure*.js).

- 2026-10-20: Round 1b (55b63d6): badge CSS per Q3 (media query < 560 px: padding 0 1px; edge digits flush left/right). Developer measurements at 375 px: worst edge -0.16 px, worst overlap 1.11 px (D=4); 520 px worst edge -0.47 px; 900 px byte-identical measurement to main. Page test f4 (375 px, D=1/9 inside the padding box, padding 1px, waits for layout). Lead check: product delta read (CSS block, pointingKey text only); 166/166 x2, 0 skipped, ~2.5 s. Reviewer and tester re-check rounds 1 + 1b in full (behaviour change), worktrees moved to the new head.

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

### Rework round 1
- 2026-10-20: Items 1-4 done; item 5 (D1, Q2 CSS) NOT implemented: measured first and the Q2 criteria cannot all hold with an unchanged chip. Reported to the lead (numbers below); style.css is unchanged.
- Q1: `pointingKey` text without the article (sudoku.js; unit test now covers 1 (ring), 8 (ring) and 9 (no ring); README quote). Page tests use the helper, so they follow.
- S1: new page test f2b: a P(4)-like state (a pick whose `hintMarks` digits are empty): digits empty, key === `pointingKey(D, 0)`, ends "go there.", no "purple ring". Mutants `pointingKey(d, 1)` and `pointingKey(d, marks.digits)` each fail 1 test (killed).
- N1: f3 loops D = 1..9. Approach: the test sets `hint-confined` and `data-d` on a real cell in the DOM and reads the computed `::after` position against the cell's own note slot; this probes the CSS rule itself and needs no hook in the product. Mutant "digit 4 dropped from --x" fails 1 test (killed).
- N2/N3: README "Well done" line names the key line; Files list names `#key` (index.html/style.css entry) and the key line in the page-test description.
- Changed existing assertions: the `pointingKey` unit test only (text). The `pointing` pick in page.test.js became `pointingState(ok)` (same default behaviour).
- Measurement (D1, 375 px): see the report to the lead; best case (chip flush with the cell edge for D = 1, 3, 4, 6, 7, 9) still penetrates a neighbour's glyph box by 2.6-5.1 px (D = 8 even unshifted 2.0-2.1 px), above the 2 px limit.
- `node --test` x3: 165 tests, 0 fail, 0 skipped, 2.36-2.37 s. AC7 mutants re-run, all killed.

### Rework round 1b
- 2026-10-20: item 5 (D1) done per PM Q3. style.css: `@media (max-width: 559px)` block after the badge rules: padding `0 1px`; D = 1/4/7 `left: 0`, D = 3/6/9 `left: auto; right: 0`, both with `transform: translate(0, -50%)`; D = 2/5/8 and everything at >= 560 px unchanged. Comment updated; README badge sentence names the narrow-screen rule.
- Measured on the real page (PM's m3.js, scratchpad/dev56/r1b.txt; columns 0/4/8, notes 1-9, both kinds): 375 px cell 34-35 px, font 14px, padding 1px; worst edge -0.16 px (tolerance 1), worst overlap 1.11 px (D = 4), centre in slot for every D. 520 px: worst edge -0.47 px, no overlap. 900 px: output identical to main (padding 0 3px, 0 overlap).
- Page test f4 (375 px, D = 1 on column 0 and D = 9 on column 8: inside the padding box, padding 1px; waits for cell width 34-36 px; viewport restored in `finally`). Mutants killed: padding back to 3px; the right-edge rule removed. `node --test` x3: 166 tests, 0 fail, 0 skipped, 2.50-2.55 s.

### Rework round 2
- 2026-10-20: R1 (f4 did not guard the right-edge rule). f4 now also asserts |inL| < 0.25 for D=1 and |inR| < 0.25 for D=9 (flush), next to the existing inside-the-cell check. The probe's right edge now uses `box.right - (offsetWidth - clientLeft - clientWidth)` instead of `pl + clientWidth` (clientWidth is integer-rounded, which hid up to ~0.5 px: c6 measured -0.59 px before, -1.05 px with the exact edge).
- Mutants (style.css, reverted, `git diff --exit-code style.css` clean): c6 (3/6/9 media rule removed) killed by f4 (badge 9 outside the cell: inR -1.05). Left-rule removal (1/4/7 media rule) SURVIVES, and is an equivalent mutant at 375 px: without the rule D=1 sits at inL = 0.11 px because the 1px-padding chip (~12 px) is as wide as the slot (cell ~36 px, centre 6 px), so the rule changes nothing measurable for D=1 at this width. It would only show at narrower widths (cell < ~34 px). Not pinned further; reported to lead.
- `node --test` x3: 166 tests, 166 pass, 0 fail, 0 skipped, 2.50-2.54 s.

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


### Re-review rounds 1 + 1b
- 2026-10-20, head fc76f9d (rework 560b21b, 55b63d6). Verdict: approve with one should-fix (R1). `node --test` x3: 166 tests, 0 fail, 0 skipped, ~2.5 s.
- Resolved: S1 (f2b; `pointingKey(d, 1)` and `pointingKey(d, marks.digits)` now killed), N1 (f3 loops 1-9; my mutant #7 killed), N2, N3 (README names the key line and `#key`). Q1 text matches the issue character for character in `pointingKey` (sudoku.js:442), the unit test (1, 8 with ring; 9 without) and the README quote; the page tests use the helper.
- CSS (Q3): `@media (max-width: 559px)` is last in the file; selectors have the same specificity as the base rules (id + td + class/attribute + ::after), so the later media rule wins. `left: auto; right: 0` for 3/6/9 is needed and correct (base `left: var(--x)` is overridden; `right` alone would be ignored). `translate(0, -50%)` keeps the vertical centring for rows 1/3 (top: var(--y) is untouched); only the horizontal -50% is dropped. Both kinds (confined/removed) are covered by the shared padding selector; removed also covers hint-target + hint-removed (the badge rules do not depend on the amber background). No dead rules. The 560 boundary is the media query itself (max-width 559 px).
- README: key text, badge narrow-screen rule and Well-done line match behaviour. "may touch a neighbouring note by up to about 1 px": developer worst overlap is 1.11 px (D = 4), so "about 1 px" is acceptable (1.1); the AC limit is 2 px.
- Page test f4: waits for layout (cell width 34-36 px, up to 100 x 20 ms, then asserts the width), viewport override cleared in `finally`, later tests call `open` anew so nothing leaks; 25 lines, lean enough.

Findings
- should-fix R1 (tests/page.test.js f4, the `x.inL >= -1 && x.inR >= -1` assertion): the right-edge rule is not guarded. With the whole `data-d` 3/6/9 media rule removed, D = 9 sits at inR = -0.59 px, inside the 1 px tolerance, so f4 passes (mutant c6, survived). The developer's "right-edge rule removed" mutant must have been a different edit. With the rule the badge is flush (inR = 0, inL = 0). Fix: for these two flush badges assert the edge gap within 0.1-0.25 px of 0 (`Math.abs(x.inL) < 0.25` for D = 1 and `Math.abs(x.inR) < 0.25` for D = 9), or at least inR >= -0.3 for D = 9. One-line change, keeps "flush" as the contract.
- nit R2: the breakpoint (559 vs 560) and the exact flush offset are not page-tested (max-width 599 and 500 both survive). This is the tester's measurement territory (PM AC3: 900/520/375 px bounding-box measurement): the tester should include 560-599 px (unchanged from today: padding 0 3px) and 559 px. A page test for it would cost another viewport case; not recommended.

Mutants (scratch copies under scratchpad/rev56/, none committed)
| # | Mutant | Result |
|---|---|---|
| 7 | `--x` dropped for 4 | killed (1) |
| 8 | `pointingKey(d, 1)` | killed (1) |
| 8b | `pointingKey(d, marks.digits)` | killed (1) |
| c1 | max-width 599 instead of 559 | SURVIVED (tester measurement) |
| c2 | max-width 500 | SURVIVED (tester measurement at 520/375) |
| c3 | edge transform kept as translate(-50%, -50%) | killed (f4) |
| c4 | narrow padding 3px | killed (f4) |
| c6 | right-edge (3/6/9) rule removed | SURVIVED: see R1 |
| c7 | right: 4px | SURVIVED (inside tolerance; tester measurement) |
| c8 | left: 4px | SURVIVED (inside tolerance; tester measurement) |

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

### Re-test rounds 1 + 1b
- 2026-10-20, tested head fc76f9d (product 55b63d6). Scripts (scratch, not committed): /private/tmp/claude-502/-Users-dirk-Code-weaver-team/4ecb9163-8db9-4624-9aa5-9c6e3ff52aab/scratchpad/ts56b (m.js = own badge measurement, key.js, shots.js). Real page via tests/chrome.js launch; the badge box is derived from the ::after computed style (left/right/top, transform, padding, border, box-sizing) and compared with the padding box and the note glyph Ranges.
- AC2 PASS: key line exact for P(3), P(4) (no ring clause, 0 rings), P(8) (1 ring); empty on the first click and for H(1); shown on explain and kept on a further Hint click and on a notes change (P(3), P(4)); cleared by Verify, a value change and New puzzle; next Hint after a value change is a nudge with an empty key. pointingKey(d, 2) has no article for every D = 1-9.
- AC3 PASS (measured, notes 1-9 set in cells of columns 0/4/8, both kinds, 54 badges per width; cells 36.1/35.6/36.6 px at 375 after a 900 ms settle, 52.6 at 520, 58 at 900):
  - 375: font 14px/800, padding 1px/1px, centre in D's slot for every D, worst edge -0.08 px (inside 1 px), worst overlap with another note glyph 1.14 px (D=4 vs note 5; D=6/7/8/9 0.06-0.22; D=1,2,3,5 0).
  - 520: D=1,3,5 (all D measured) inside the padding box, worst edge -0.07 px, overlap 0, padding 1px.
  - 900: overlap 0, padding 3px/3px, 14px/800, size 15.25 x 18.8 px as main; position identical (0.000 px) to the earlier tested head 8ac1f8b. Position against main cannot be 0.5 px for most D: main has the badge top-right, the issue moves it to the note slot (see Ambiguity).
  - Screenshots (375 and 900 for D=1 seed 3, D=4 seed 33, D=5 seed 9, D=9 seed 4): /private/tmp/claude-502/-Users-dirk-Code-weaver-team/4ecb9163-8db9-4624-9aa5-9c6e3ff52aab/scratchpad/ts56b/zoom_s*_D*_*.png and shot_s*.png. Neighbour notes readable; strike visible; D=4 chip flush left touching note 5 slightly (readable), D=9 chip flush at the right edge touching note 8 slightly (readable).
- AC7 PASS: five mutants killed on a scratch copy (b dropped 3 fail; removed as reason 1; ring clause always 2; key not cleared 2; box case "confined > 1" 2). Suite x3: 166 tests, 166 pass, 0 fail, 0 skipped, 2.50-2.55 s.
- Ambiguity: AC3 "position within 0.5 px of today's" read as "unchanged since the slot placement (8ac1f8b)"; size, padding, font, colours equal main at 900. Defects: none (D1 closed). Not checked: 320 px (out of scope), AC6 README.
