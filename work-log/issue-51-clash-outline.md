# Work Log: Issue #51, outline clashing cells while the clash lasts, and say when it is fixed

- Issue: https://github.com/dirkmarski/weaver/issues/51 (raised by product-manager, session 544de00f-db0c-4fd3-8425-f2e90d4ada4d)
- Iteration 11, issue 2 of 2. It builds on #50 (merged in 7e23b26).
- Branch: `issue-51-clash-outline` (from main 7e23b26)
- Lead: weaver-agents (lead agent, Claude Opus 5.5), session 544de00f-db0c-4fd3-8425-f2e90d4ada4d

## Lead
- 2026-10-20: Gate check PASS: OPEN, author weaver-agents (the PM), label `enhancement`. Started after #50 merged, as the issue requires.
- Spec read, no open questions. The "fixed" message cannot collide with a judged-entry text: only a clear or an overwrite can end a clash, and neither is judged. Completion wins over the "fixed" message, as the issue states.
- Carried in from #50 (N3): the README named-clash sentence repeats itself. Replace "(the cells that share a digit with another cell of their row, column or box, givens included; Verify turns only your own values red)" with "(givens included; Verify turns only your own values red)".
- Risk: the DOM wiring has no repo tests. The tester's headless page run, with mutant checks on the wiring (the outline survives Hint and Verify), is the main gate for criteria 2-6.
- Developer round 1 launched.
- Developer round 1 (head 84e7261): lead check PASS. The diff was read in full. 147/147 in about 0.59 s. The 375 px screenshots (dev51/) were inspected by the lead: the outline is visible with the focus ring and the red Verify fill; the Hint text is plain. The fixed message cannot be overwritten by the credit branch: credit applies only to entries into empty cells, which never end a clash.
  - L1 (nit): the comment "// Rules-only check; never compares against a stored solution." now sits above `clashCells` instead of `verify`. Move it back.
  - L2 (for review): `#sudoku td.clash.hint-confined` looks unreachable. Hint shows nothing while a clash exists, and any value change clears a showing hint, so a clash outline and a pointing hint mark can never be on screen together. The reviewer should confirm, and the rule should be dropped if so.
  - Observation: the developer reports that headless Chrome needed its own sandbox disabled (a Chrome flag) to run.
- Review and test round 1 launched in parallel, in detached worktrees wt-51-review and wt-51-test.

## Developer

## Review

---

## Test
### Test round 1 (tester, code head 84e7261, worktree at 3075d5d)
Tools (scratchpad/ts51/, see its README.md): `pins51.js`, `suite51.js` (106 page checks with an independent clash oracle, so every step also checks "outline == the real clash set" and "suffix on exactly the outlined editable cells"), `shots51.js`, `steps.js`. Run: `WT=<worktree> node ts51/suite51.js`. Real page, headless Chrome, seeded Math.random, Tricky seed 1. Chrome ran without extra flags here (NOSANDBOX=1 available).

**Plan.** Golden path: the 7 pinned examples. Edge and negative: persistence under every non-value action; three-cell partial fix; five-cell state; New puzzle and level after clash and Verify red; label with notes; givens; fixed message on clear/overwrite, not on a remaining clash or a normal entry, not on a notes change; replaced by Verify, Hint, next change; fix on a full grid; fix with one empty cell left; mutants; screenshots; regression.

**Results per criterion**
| # | Result | Evidence |
|---|---|---|
| 1 | PASS | After every step the outline equals an independent oracle (givens included, nothing else); computed style is `dashed 3px`. |
| 2 | PASS | Outline r4c1,r5c3 kept through entry elsewhere (r8c2=3), Notes on, a note typed, Notes off, focus, ArrowRight, ArrowDown, Verify (red r4c1 on top), Hint click 1 (plain clash text, no marks) and click 2, and a further entry. Hint removes the red flags as today and not the outline. |
| 3 | PASS | r7c1,r7c2,r7c3 = 9 gives three outlined; clearing r7c2 leaves exactly r7c1,r7c3 and no fixed message; overwriting r7c3 with 2 clears the rest. Pin 6 style: five cells, clear r4c1 drops exactly r4c1,r5c3. |
| 4 | PASS | With a clash and red Verify showing: after New puzzle no `td.clash`, no suffix, no red; after choosing a level (tricky, and again easy) none, status empty. |
| 5 | PASS | Screenshots below, looked at by me. The dashed orange outline is clear at both widths, alone, with the focus ring (it sits inside the ring), on the Verify red fill (visible on top of the red box-shadow ring, lower contrast than elsewhere but distinct) and for a three-cell row. See observation O1 for the Hint marks. |
| 6 | PASS | Outlined editable cell: "Row 4, column 1, clashes"; the suffix is gone after clear ("Row 4, column 1"). Givens: td has only `class`, no input, no aria-label. A notes cell elsewhere keeps "Row 2, column 1, notes 5 7" while a clash shows. A clashing cell with notes is NOT reachable: typing a digit drops the cell's notes, and notes mode on a filled cell adds none (checked), so "notes + clashes" cannot occur on the page; the relabel code path builds position, notes, suffix in that order. |
| 7 | PASS | Fixed message in plain style (class empty, colour rgb(29,29,31), same as an ordinary message) on clear and on overwrite. Absent when a clash remains (blank), for a normal entry, and on notes changes. Next value change clears it; a notes toggle keeps it; Verify and Hint replace it; a second break-and-fix shows it again. Completion: a fix cannot fill an empty cell (an overwrite or a clear never adds a digit to an empty cell), so the only "fix and complete" state is a full grid with a clash (all solution digits, r9c1=5; red full-grid text): overwriting r9c1 with 6 shows "Puzzle solved! ..." (class ok), not the fixed message. With one cell still empty (r9c2) the same overwrite shows the fixed message. Clearing the wrong cell on a full grid shows the fixed message. |
| 8 | PASS | The 7 pins hold on the real page, outline and text character for character (`pins51.js`: 7/7). |
| 9 | not tested here | README is the reviewer's; I read the new bullet only for the pins above. |
| 10 | PASS | Unit tests present (147/147); DOM wiring caught by mutants below. |

**Mutants** (copies in scratchpad/mut51/, the worktree untouched)
- (a) clearResults also removes `clash`: caught. suite51: 13 FAIL (from the first Verify step on: outline gone, suffix present, mismatch), pins51: 2 FAIL (pin 3 Hint, pin 7 Verify).
- (b) `showClashes` call dropped: caught. suite51: 42 FAIL; pins51: 5 FAIL.
- (c) relabel never adds ", clashes": caught. suite51: 19 FAIL (suffix check at every step); pins51: 5 FAIL.

**Screenshots** (scratchpad/ts51/, each at 900 and 375 px, suffix `_900.png`/`_375.png`): `clash_alone`, `clash_focus`, `clash_verify`, `clash_verify_focus`, `clash_hintclick` (Hint text during a clash), `clash_multi` (three-cell row plus the pin), `hint_pointing_alone` (real pointing Hint, no clash), `clash_hintsim`.

**Observations (no defect)**
- O1: the outline and Hint marks cannot be on screen together on the real page: Hint is refused during a clash, and any value change clears a showing hint (Notes changes cannot create a clash). `clash_hintsim_*` is therefore SIMULATED: a real pointing hint with the `clash` class injected by script on the amber target, a hint-area cell, a hint-digit cell and a confined cell. Result: orange dashed is visible on the amber target and the purple ring digit; on the confined cell the purple dashed rule (later in style.css, same specificity as `#sudoku td.clash`) replaces the orange outline, so the new rule `td.clash.hint-confined` only changes the offset and has no visible effect. Supports L2: it is unreachable and can be dropped. Not a defect for #51.
- O2: clearing an already empty cell after a fix leaves the fixed message in place (no value change); consistent with the spec.
- O3: a Verify red fill plus the orange dashed outline is the lowest-contrast combination (the red ring sits right under the outline); still visible and distinct at both widths.

**Regression:** #50 pins (`ts50/pins.js`, WT = this worktree) 7/7 PASS. `node --test`: 147 tests, 147 pass, 0 fail, 605 ms.

**Defects:** none. No script expectation of mine was wrong against the product; two things I corrected in my own scripts before the final run: the red Verify cells are `input.conflict` (not `td.wrong`), and a clashing cell with notes proved unreachable, so I replaced that check with the unreachability checks above.

---

## Developer
- Pure helpers `clashCells(grid)` (flat indices of the findConflicts cells) and `fixedMessage(before, after)` in sudoku.js; the page wires them in `setCell` for every value change (grid captured before the write, after it recomputed), with `completionFor` overriding the fixed message. Outline is the `clash` class on the td, set only by `showClashes`, never touched by `clearResults`.
- aria-label has one builder, `relabel(inp)`: position, notes, then ", clashes" when the td has `clash`.
- CSS: orange dashed outline on td at -4px offset; moves to -7px when the input has focus (blue ring) or the td is a dashed purple confined cell, so none hides another.
- README updated (N3 carry-in, live-checking and red sentences, two new bullets, Files). Tests: 4 new unit tests (suite 147, ~0.6 s). 7 pins and the #50 pins checked on the real page headless (scripts in scratchpad/dev51).
