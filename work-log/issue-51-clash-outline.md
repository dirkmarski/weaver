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
- 2026-10-20 reviewer, round 1 (code head 84e7261, log head 3075d5d). Verdict: APPROVE with changes (no Must-fix). `node --test`: 147/147, about 0.59 s. I did not read governance/LOG.md.
  - Correctness (all traced in code and run on the page with the A seed-1 Tricky game): the pinned rows for 6 at r4c1, 6+9+Hint, clear, overwrite, 6+4+clear, and 6+Verify hold. Outline survives Hint (both clicks) and Verify; the fixed message is replaced by Verify/Hint.
    - Every value write goes through `setCell` (typed, paste/drop via the `input` listener -> `enter`, overwrite, clear, Notes on/off). Nothing else writes `inp.value` except the `input` handler, which restores `prev` and re-enters. Rejected input is `changed === false`, so no recompute (correct).
    - `clearResults` (called by Verify, Hint, `setCell`, `choose`, `newPuzzle`) never touches `.clash`; notes-only and arrow keys do not reach `showClashes`. New puzzle and level choice rebuild the tbody, so no outline can survive (`choose` and `newPuzzle` do not call `showClashes`; correct, the tds are new).
    - `before` is captured before the write and `after` after it. A credit (empty -> digit only) can never coexist with a fix, so the credit branch cannot overwrite the fixed text; completion runs last and wins. `relabel` is the only builder of the aria-label (the buildTable initial label is the bare position, correct for a fresh cell); notes are kept, givens have no input.
    - `fixedMessage` is `&&` on `before` clash and `!after` clash: exactly the clash-to-none change.
  - Findings:
    - S1 (Should-fix): L2 confirmed, `#sudoku td.clash.hint-confined` is dead. A clash can only appear through a value change, which runs `clearResults` and removes every hint class; Hint shows nothing on a clash (`kind: conflict`, returns before any mark), and Verify clears the hint. So a clash and a pointing mark can never be on screen together. Fix: change the rule to `#sudoku td.clash:focus-within { outline-offset: -7px; }` and shorten the CSS comment (drop "and the purple dashed confined outline"). The README outline bullet says it "stays visible with ... the dashed purple pointing marks"; reword to "(a clash and a hint never show together)" or drop that clause (see N2).
    - S2 (Should-fix): README Files entry for `style.css` does not name the new class (criterion 9 / the issue's "README impact"). Fix: "`index.html`, `style.css` - page and styling (`td.clash`: the orange clash outline)". `clashCells` and `fixedMessage` Files entries are present and accurate, and the "caller decides on a filled grid" point is stated (README: "the page lets `completionFor` override it"; the test names it).
    - N1 (Nit): L1 confirmed. "// Rules-only check; never compares against a stored solution." sits above `clashCells` (sudoku.js ~line 79) where it is false. Move it back directly above `function verify`.
    - N2 (Nit): the `:focus-within` rule is justified and should stay: the blue focus ring is a 3px outline at offset -3 on the input, the td outline at -4 would overlap its inner pixels; -7 puts the dashes just inside the ring (the lead saw it in the 375 px shots). Only the `.hint-confined` half is dead (S1).
    - N3 (Nit, optional): `before` and the credit call both compute `currentGrid()` before the write. Worth unifying: move `var before = changed ? currentGrid() : null;` above the credit block and pass `before` to `creditEntry` (`before` is non-null whenever the credit branch runs, since both need `changed`). Saves one 81-input grid build per first entry and makes "the grid before the change" one name. Order is safe (both read before the write; `creditEntry` does not mutate its input).
    - N4 (Nit, no change needed): `showClashes` toggling and relabelling all 81 inputs per value change is 81 cheap DOM writes; simpler than diffing, and an unchanged aria-label does not re-announce. Accept. Observation only: the focused input's label changes to ", clashes" without a focus move, so a screen reader may not announce it until refocus; the message line carries the text. Not in scope.
    - N5 (Nit, optional): the Verify bullet "Givens are never flagged." in README (line ~29) could add "(the orange clash outline does include givens)". Not required, the outline bullet states it.
  - README, sentence by sentence (criterion 9): "Apart from these messages and the orange clash outline there is no live checking; red flags appear only after Verify" reconciles the old live-checking and red-only sentences; the "None of these messages changes a count or flags a cell red ... outline is the only live mark" and the red-full-grid bullet are reconciled; the N3 carry-in is done exactly as the lead wrote it; the Hint-clears-red-flags sentence adds "(never the clash outline)"; both new bullets (outline and "Clash fixed") match the behaviour I ran (suffix after notes, editable cells only, Verify/Hint/next change replace the message, completion wins). No stale "no cell is marked", "no live checking" or "highlights anything" text remains (grepped). Remaining gaps: S2, N2.
  - Tests (criterion 10): `clashCells` golden path/empty, incl. givens, ascending flat indices, and the three-cell clash; `fixedMessage` fix by clear, fix by overwrite, three-cell clash with one fixed (blank), no clash before, same grid, entry into an empty cell (blank), and a fix that fills the grid (`fixedMessage` says FIXED, `completionFor` is solved, the caller picks). Complete for the list.
  - Mutants (each reverted; `git diff --stat` clean afterwards). "Unit" = failing tests out of 147, "Page" = the A-seed scenarios (6/9/Hint/Hint/Verify/clear, overwrite, 6+4+clear+Verify+Hint, notes, Hint then entry) differ from baseline.
    | # | Mutant | Unit | Page |
    |---|---|---|---|
    | M1 | `fixedMessage` `&&` -> `\|\|` | caught (1) | caught |
    | M2 | `fixedMessage` drop `!` on after | caught (3) | caught |
    | M3 | `fixedMessage(after, before)` swapped | caught (2) | caught |
    | M4 | `clashCells` index `p[1]*9+p[0]` | caught (1) | caught |
    | M4c | `clashCells` `p[0]*8+p[1]` | caught (1) | caught |
    | M5 | `showClashes` toggle `>= 0` -> `> 0` | survives | caught (page only) |
    | M6 | `before` captured after the write | survives | caught (page only) |
    | M7 | relabel suffix tests `conflict` instead of `clash` | survives | caught (page only) |
    | M8/M14 | `clearResults` also removes `clash` | survives | caught (page only) |
    | M9 | fixed message styled `ok` | survives | caught (page only) |
    | M10 | `showClashes` skips `relabel` | survives | caught (page only) |
    | M11 | `fixedMessage` drops the `before` clash test | caught (1) | survives (no page scenario enters a digit into an empty cell on a clean grid and checks the message; the unit test covers it) |
    | M12 | `showClashes` only when the cell has a value | survives | caught (page only) |
    | M13 | completion no longer wins over fixed (`!fixed` guard) | survives | survives |
    - M13 survives both because the only way to hit it is a clear/overwrite that fills the grid with a rule-breaking or solved grid; the pure helpers cannot see it and the A-game page scenarios do not fill the grid. Action for the tester (not for the developer): one page scenario that fixes the last clash while filling the last cell (expect "Puzzle solved! ..." or the red full-grid text, never the fixed text). My first M4 try hit `findConflicts` (the wrong line, the first match) and survived; redone on `clashCells` as M4/M4c.
  - Proposed wiki changes (lead): architecture.md - add `clashCells(grid)`, `fixedMessage(before, after)`, the `td.clash` live state in `render` (`showClashes`, `relabel` as the single aria-label builder, `clearResults` deliberately leaves it, `buildTable` resets it); product.md - clash outline (dashed orange, givens included, survives Verify/Hint/notes, ", clashes" suffix) and the "No numbers break the rules now" message with completion precedence; backlog.md - remove the "subtle non-red marker" clash follow-up (delivered by #51), and lessons.md - a play check on prototypes (X2 vs X3) decided the style.

---

## Test

---

## Developer
- Pure helpers `clashCells(grid)` (flat indices of the findConflicts cells) and `fixedMessage(before, after)` in sudoku.js; the page wires them in `setCell` for every value change (grid captured before the write, after it recomputed), with `completionFor` overriding the fixed message. Outline is the `clash` class on the td, set only by `showClashes`, never touched by `clearResults`.
- aria-label has one builder, `relabel(inp)`: position, notes, then ", clashes" when the td has `clash`.
- CSS: orange dashed outline on td at -4px offset; moves to -7px when the input has focus (blue ring) or the td is a dashed purple confined cell, so none hides another.
- README updated (N3 carry-in, live-checking and red sentences, two new bullets, Files). Tests: 4 new unit tests (suite 147, ~0.6 s). 7 pins and the #50 pins checked on the real page headless (scripts in scratchpad/dev51).
