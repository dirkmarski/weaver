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
- PR #10 opened. Reviewer and tester launched in parallel on 97d46c9.
- Reviewer agent (Claude Sonnet 5.5, session 469a4b87) verdict: APPROVE (PR comment), 62/62. Correctness of P1-P11 confirmed, including IME/Tab/modifier handling and the input fallback.
  - Should-fix 1: remove dead `nextValue` (code, export, 7 tests, README). This also resolves C1.
  - Should-fix 2: the "verify ignores notes" unit test is tautological (it compares verify with itself).
  - Nits: merge the mid-file `require`s; split the long README How-to-play line and document A1; note colour #777 is borderline for AA contrast, use #6b6b6b.
  - A1: the reviewer recommends keeping it (consistent, safe, already tested).
- Lead decision D1: all should-fix items and nits accepted for one rework round (all cheap and in scope). Waiting for the tester so the rework is batched.
- Tester agent (Claude Sonnet 5.5, session 469a4b87) verdict: PASS (PR comment). AC1-AC13 and P1 pass on Easy and Hard (86 browser checks, real CDP key events), 0 console errors, no defects. Cell 58x58, input 56x56, table 522x547 with 0/1/9 notes. Note toggles average under 16 ms. A1 observed as designed. Screenshots in the scratchpad: issue9-notes-cell.png, issue9-notes-on.png, issue9-verify-notes.png.
  - Observation: notes #777 at 13px have about 3.5:1 contrast on the blue box shade.
- Lead viewed the notes-cell and verify screenshots. Layout is correct, but the notes are faint on blue.
- Lead decision D2 (amends D1's colour nit): the note colour must reach at least 4.5:1 (WCAG AA) on both box shades and plain white. Font size stays as is. This is a legibility fix within P3 ("muted grey", "readable").
- Rework launched with the developer (D1 + D2). Reviewer and tester re-check afterwards.
- Developer agent (Claude Sonnet 5.5, session 469a4b87) delivered rework commit cfdb2cf:
  - `nextValue` removed (code, export, tests, README). Its cases are covered by the `applyEntry` tests.
  - New pure exported `buildGrid(puzzle, values)`, used by the Verify button. The verify-ignores-notes test now checks the grid built from a notes-only cell and can fail.
  - Test requires merged at the top. The README notes bullets are split and A1 is documented.
  - Note colour #777 → #626262: contrast 4.82 (blue box), 5.39 (cream), 6.10 (white), all ≥ 4.5.
- Lead check: diff read and correct, `node --test` 55/55 (62 − 7 `nextValue` tests), no `nextValue` references left outside the work log. Second-round reviewer and tester launched on cfdb2cf.
- Reviewer agent round 2 (Claude Sonnet 5.5, session 469a4b87) verdict on cfdb2cf: APPROVE (PR comment). All earlier findings resolved. Contrast numbers independently confirmed (4.82 / 5.39 / 6.10). 55/55.
  - Nit: no `applyEntry` test for an invalid key on a cell holding a value (same code path). Lead: won't-fix (the path is already covered).
- Tester agent round 2 (Claude Sonnet 5.5, session 469a4b87) verdict on cfdb2cf: FAIL. Blocking defect D1: the Verify handler maps `inputs` (null for givens) to `.value`, so every Verify click throws a TypeError. AC6, AC7 and AC11 fail (19/95 checks, all from D1). Everything else passes, including colour rgb(98,98,98) and unchanged sizes. Lead confirmed by reading sudoku.js:428-429.
- Lead concern and lesson: both the lead check and round-2 review read the `buildGrid` refactor and missed that givens are null in `inputs`. The unit test fed only full string arrays. The browser gate caught it, which confirms the tester must re-run the full walkthrough after every rework, however small. Unit tests should cover the real data shape the UI passes.
- Rework 2 launched with the developer: null-safe mapping, a `buildGrid` regression test with null/'' at given positions, and Verify in a browser before handing back. Reviewer (quick) and tester (full) re-check afterwards.
- Developer agent (Claude Sonnet 5.5, session 469a4b87) delivered fix commit ae7fe66: the handler maps missing inputs to '' (one-line change), and a new "buildGrid accepts the UI shape" test was added. The developer notes honestly that this test documents the contract but cannot catch D1, which lived in the DOM handler (the repo has no DOM unit tests). The developer's headless Chrome check: Verify works, empty count shown, conflict flagged, no console errors.
- Lead check: diff is the one-line fix plus the test, 56/56. Full tester walkthrough required (round 3); quick reviewer check in parallel.
- Reviewer agent round 3 (Claude Sonnet 5.5, session 469a4b87) verdict on ae7fe66: APPROVE, 56/56. The fix is correct and minimal. Tracing `inputs`, `lastCell`, `puzzle` and the cell dataset found no other null or shape issue. Root cause of the round-2 miss (in the PR comment): the diff was read hunk by hunk without following data from where it is created to where it is read. Only the browser walkthrough guards the handler mapping.
- Tester agent round 3 (Claude Sonnet 5.5, session 469a4b87) verdict on ae7fe66: PASS. AC1-AC11 and P1 pass on Easy and Hard (95/95 checks, real CDP events), 0 console errors, 56/56 unit tests. Sizes unchanged with 0/1/9 notes, colour rgb(98,98,98). Screenshots: issue9-r3-*.png in the scratchpad.
- Lead viewed issue9-r3-verify-notes.png: red conflict, notes in other cells, message shown. Correct.
- Lead verdict: delivery meets #9 (AC1-AC13), all gates passed. Handed to the product manager for acceptance before the merge (L4).
