# Work Log: Issue #31 Say when an entry is not counted, instead of a blank message

- Lead: weaver-agents (lead agent, Claude Opus 5.5), session `246ca1dd-69c1-44b3-80a4-65e176ec6193`
- Branch: `issue-31-uncounted-entry` (from main 8d92cfd, after the #30 merge)
- Iteration: 7 (see work-log/iteration-7.md)

## Gate check
- 2026-10-19: #31 is OPEN, written by weaver-agents (PM). Passes. Scope includes the PM's comment on #31: the README "as above" wording fix.

## Plan
developer -> lead check -> reviewer + tester in parallel -> rework if needed (full re-review and re-test) -> PR -> PM acceptance -> merge commit (no squash).

## Progress
- Branch and this log created. Developer launched.

## Developer round 1
- Code (`sudoku.js`): `creditEntry` now returns the "not counted" text for a judged, uncredited entry, from a new private helper `notCounted(grid, r, c, digit)`: (b) if `findConflicts(grid)` of the grid just before the entry is non-empty (whatever the digit), else (a). A self-clash with no prior conflict is therefore (a). Tally and `credited` are returned as the same objects, as before. `value` `''`/non-digit and a filled cell still return text `''`. Hinted cell with the hint's digit still goes through `hintApplied` first, so it is never (a)/(b).
- UI: `setCell` shows `credit.text` with class `''` (neutral) when the text starts with `Entered: `, else `ok` as before. The completion message is applied after it, so "Filling the grid" wins (rule 5). `clearResults` is unchanged, so rule 6 holds (no new code path).
- Decision: no new field on the `creditEntry` result (existing tests deep-compare `{tally, credited, text}`); the UI tells the two kinds apart by the `Entered: ` prefix. Flagged for review as a small coupling.
- Tests (`tests/sudoku.test.js`): E1 unit tests (texts byte for byte, digit 8 at row/column 9, self-clash gives (a), conflict-before gives (b) for a digit that is a naked single without the conflict, hint cell still "Well done!", rule 7/8, inputs not mutated, tally/credited equal). Two existing tests expected `''` for a judged uncredited entry; they now expect the new texts (the non-judged cases stay `''`).
- E2: test "creditEntry vs the frozen creditEntry over 220 generated puzzles (E2)": 110 Easy + 110 Medium seeded puzzles, random cells, mixing solution digits, random digits, `''`/`0`/`x`/`12`, with and without a showing hint, wrong digits sometimes kept so grids get conflicts, cells sometimes cleared again. Baseline is `tests/frozen-sudoku-e81999c.js`; its `creditEntry` was diffed against main's `creditEntry` before this change (`diff <(sed -n 276,303p frozen) <(sed -n 293,320p sudoku.js)`): identical. Where frozen returns a non-empty text the new one returns the same text; tally and credited always equal; where frozen returns `''` and the value is a digit, the new text is compared to (a)/(b) chosen by an independent pairwise clash check written in the test (not `findConflicts`/`classifyEntry`). Walk totals when run: 2399 same-text calls, 4359 (a), 10817 (b), 1989 non-judged.
- Test counts: `node --test` 128 tests, 128 pass, 0 fail (was 122 before this issue; 6 new tests, 2 existing ones updated).
- E3 (headless Chrome via CDP; script kept in the scratchpad, not in the repo): `node /private/tmp/claude-502/-Users-dirk-Code-weaver-team/246ca1dd-69c1-44b3-80a4-65e176ec6193/scratchpad/dom31/check.js /private/tmp/claude-502/-Users-dirk-Code-weaver-team/246ca1dd-69c1-44b3-80a4-65e176ec6193/scratchpad/wt-31` (Easy seed 3; page Math.random seeded like the #30 check). Result: 25 PASS, 0 FAIL, no page errors. Checked: a non-single entry shows (a) byte for byte with status class `''` and 0 cells with the `conflict` class, tallies 0/0, nothing highlighted; a notes change keeps the line; clearing a value clears it; a self-clash entry is (a) with no red cell; the next entry elsewhere (even with the solution digit) shows (b), class `''`, no `conflict` class, tally unchanged; Verify then replaces it and flags red; filling the last cell with the solution digit shows "Puzzle solved! ..." (class `ok`), with a wrong digit shows "Every cell is filled, but some numbers break the rules. ..." (class `fail`, no `conflict` class); Hint, New puzzle and choosing a level clear the line.
- README: the "neither applies" bullet (now with both quoted texts), the "Any change to a value clears..." sentence, the `creditEntry` Files entry, the "Any other value change removes the hint" sentence, the "This message replaces ..." sentence (now also "not counted", and "A rewarded entry is still counted"), the counts paragraph (re-entry of a non-single), and the PM's Hint wording fix ("it follows the naked-single order above"). Each sentence re-read against the code.

## Lead check after developer round 1 (head 1180dca)
- The developer is Claude Sonnet 5.5. It made commits d86861e, 50b52e1 and 1180dca.
- `node --test` passes 128/128 (lead re-ran it).
- The diff is minimal: a `notCounted` helper and a neutral class in setCell.
- Questions for the review:
  - (Q1) The status class is chosen by the regex `/^Entered: /` on the text. That couples the UI to the wording. Is it acceptable, or should creditEntry expose a kind? The existing deep-equal tests are the developer's reason not to add a field.
  - (Q2) Can a hint be showing while the grid has a conflict? If so, "Well done!" would win over (b). Is that consistent with rule 1?
- Reviewer and tester launched in parallel.
