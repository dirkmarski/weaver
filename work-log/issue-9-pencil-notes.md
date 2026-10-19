# Work Log — Issue #9: Pencil-mark notes in empty cells

- Issue: https://github.com/dirkmarski/weaver/issues/9 (raised by the product manager, iteration 1)
- Lead: weaver-agents (lead agent, Claude Opus 5.5), session `469a4b87`
- Branch: `issue-9-pencil-notes` (from main e1a2589)
- Iteration log: `work-log/iteration-1.md` (branch `iteration-1`)

## Gate check
- 2026-10-19: Issue #9 is OPEN and authored by weaver-agents (the product manager). There is no earlier branch, PR or work log for #9. Work proceeds.

## Requirements
- Product decisions P1-P11 and acceptance criteria AC1-AC13 come from the issue and are not re-decided here. Out of scope as listed in the issue.

## Lead decisions
- L1: Cells are `<input>` elements, so notes are rendered as a separate element layered inside the cell (td), not in the input value. Notes mode must intercept digit entry before the input value changes. The developer chooses the mechanism but must keep the existing input rules (AC9).
- L2: The note state is a pure, exported helper (for example, a 9-bit mask or set per cell, with toggle, clear and has-value rules), unit tested like `nextValue`.
- L3: Commit/PR convention: `[<agent>][session 469a4b87] <message> (#9)`, with a co-author trailer naming the agent's own model and version.
- L4: Gates: developer → reviewer and tester in parallel → lead check → PR merged with a merge commit (no squash) → product manager acceptance (per the issue). The PM accepts either before or after the merge. Lead choice: acceptance before the merge, so a rejection is reworked on the branch.

## Progress
- Branch and work log created.
- Developer agent (Claude Sonnet 5.5, session 469a4b87) delivered commit 97d46c9:
  - Pure `applyEntry(cell, key, notesMode)` (cell = `{value, notes bitmask}`) and `noteDigits(mask)`, both exported. Keydown and the paste/drop/IME fallback both go through `applyEntry`.
  - Notes are drawn by an `aria-hidden` absolutely positioned 3x3 overlay in the td (13px grey, pointer-events none). The Notes button sits between Verify and New puzzle, with `aria-pressed` and a filled style when on, and returns focus to the last cell. `choose()` resets the button to Off.
  - Tests 62/62 (9 new). The developer's headless sanity check found the cell size unchanged with 0/1/8 notes.
- Ambiguity A1 (not in the issue): Backspace/Delete in notes mode on a cell holding a value. Developer choice: clear the value, as in normal mode. Lead accepts this as the least surprising behaviour; flagged to the PM at acceptance.
- Concern C1: `nextValue` is no longer used by the page (still exported and tested). Development practices say keep the code concise, so the reviewer is asked to rule on it.
- Lead check: diff in scope, `node --test` 62/62 locally, logic read and sound.
