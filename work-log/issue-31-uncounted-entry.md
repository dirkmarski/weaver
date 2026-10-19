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

## Test round 1
Tester: Claude Sonnet 5.5 (claude-sonnet-5-5). Head tested: 2775392. Baseline: main 8d92cfd. **Verdict: PASS** (no defects).

- `node --test`: 128 tests, 128 pass, 0 fail, 0 skipped.
- Independent oracle (`/private/tmp/claude-502/-Users-dirk-Code-weaver-team/246ca1dd-69c1-44b3-80a4-65e176ec6193/scratchpad/oracle31.js`; run `node oracle31.js`): expected texts are parsed from the issue #31 body with `gh`; baseline is `git show 8d92cfd:sudoku.js` (`/private/tmp/claude-502/-Users-dirk-Code-weaver-team/246ca1dd-69c1-44b3-80a4-65e176ec6193/scratchpad/main31.js`); own clash and single (naked + hidden) classification. 330 seeded puzzles (110 each Easy, Medium, Hard), **73,741 checks, 0 mismatches**, inputs (grid, tally, credited, hint) never mutated.
  - Counts per category: non-judged 10,416 (filled cell 2,604, empty value 2,604, "0" 2,604, garbage 2,604); (a) non-single 169, (a) self-clash 478, (a) with a hint showing on another cell 944 (242 non-single, 702 self-clash), (a) other digit in the hinted cell 391; (b) conflict before 8,453 of which 1,697 would be a single without the conflict; re-entries into credited cells: 309 non-single (counts unchanged, text (a)/(b) per oracle), 44 single (reward text as on main); rewarded single 212 (+7 re-entry); hinted digit in hinted cell "Well done!" 464 (+133 re-entry). Where main returns text, the new text, tally and credited are identical.
  - Also checked: whenever my oracle says single with no conflict, main returned text; whenever it did not (and no hint match), main returned ''.
- Browser (`node /private/tmp/claude-502/-Users-dirk-Code-weaver-team/246ca1dd-69c1-44b3-80a4-65e176ec6193/scratchpad/browser31.js /private/tmp/claude-502/-Users-dirk-Code-weaver-team/246ca1dd-69c1-44b3-80a4-65e176ec6193/scratchpad/ts-31 branch`, and the same against main with `ts-main main`; real index.html, headless Chrome over CDP, desktop 1280x900 and 375x800): **PASS on all checks (29 per size incl. console), 0 console errors or exceptions**. Covered: (a) text exact, status class '', computed colour equal to the Hint nudge colour and different from the ok and fail colours, no red cell, nothing highlighted, tally unchanged; self-clash gives (a) and reveals nothing; entry elsewhere after a clash gives (b), neutral; last cell correct gives "Puzzle solved! ..." (ok), wrong gives the conflict text (fail, no red cell), never "Entered:"; notes toggle and a note entry keep the line; overwrite, Verify, Hint, New puzzle and choosing a level each clear or replace it; hinted digit gives "Well done!" (green, hint cleared); other digit in the hinted cell and any digit in another cell while a hint shows are judged (a); a single still gives green "Well spotted!"; a pasted single digit is judged. Overwrite, clear, rejected input (0, a), the four arrow keys, notes-on typing and clearing give records identical to main (value/notes dump, status, classes, tally, focus), both sizes. Run against main the new-text checks fail as expected (18 FAIL), which shows the checks discriminate.
- Screenshots (`/private/tmp/claude-502/-Users-dirk-Code-weaver-team/246ca1dd-69c1-44b3-80a4-65e176ec6193/scratchpad/shots31/branch-*.png`: a, b, welldone, solved, fullconflict; desktop and mobile). As a learner: the line is plain dark body text, not green and not red, nothing lit on the grid, and it reads as information ("Entered: ... not counted"), not praise or blame. (b) tells me to click Verify. Observation only, not a defect: at 375x800 the status line sits just under the buttons, partly below the fold (the same place as Hint messages), and wraps to 3 lines.
- README, checked by hand against observed behaviour: the "neither applies" bullet and both quoted texts match the runtime byte for byte; "does not say whether the digit is right / does not point out a clash" true (self-clash gives (a), no red); "Neither message changes a count, flags a cell red or highlights anything" true; "Filling the grid ... replaces ... 'not counted'" true; re-entry sentence true (non-single re-entry shows (a)/(b), counts unchanged); "Any change to a value clears ..." sentence true, including overwrite, clear and Notes on showing nothing new; "Any other value change removes the hint (and may show ...)" true; `creditEntry` Files entry true (text '' only when not judged). PM's wording fix present: "If there is none, it follows the naked-single order above." No leftover "Nothing is said about why" or blank-message claims.
- Concerns (not defects): the UI picks the neutral class with a regex on "Entered: " (the developer flagged this); it works, and any future message starting with that prefix would be neutral. A hint cannot be showing together with a conflict (Hint then reports the conflict), so (b) never competes with "Well done!".

## Review round 1
- Reviewer: Claude Sonnet 5.5, session `246ca1dd-69c1-44b3-80a4-65e176ec6193`. Reviewed head 2775392 against base 8d92cfd.
- Verdict: **APPROVE** (no Blocking findings; two Should-fix items that can be done in this round or accepted as follow-up at the lead's choice).

### Checked
- Rules 1-9 and edge cases line by line against `creditEntry`, `notCounted`, `setCell`: correct. Texts (a)/(b) byte-equal to the issue. (b) is tested on the grid before the entry (`findConflicts(grid)` before any write); a self-clash with a clean grid gives (a). Order in `creditEntry`: not-judged guard, hint match ("Well done!"), classify, (a)/(b). `none` is returned for value `''`, non-digit and a filled cell. Tally and `credited` are returned as the same objects (not mutated). Completion message is written after the credit line, so rule 5 holds. `clearResults` unchanged, so rule 6 holds.
- `node --test`: 128/128 pass.
- Frozen baseline: `creditEntry` and `classifyEntry` in `tests/frozen-sudoku-e81999c.js` are byte-identical to main 8d92cfd (diffed), so the E2 baseline is valid even though the file name predates #30.
- Mutation check (copy of the repo with one change each; unit = `node --test`, dom = developer's `check.js`):

| Mutant | unit | dom |
| --- | --- | --- |
| conflict tested on grid after the entry | killed | killed |
| (a)/(b) swapped | killed | killed |
| `grid[r][c] !== 0` guard removed | killed | n/a (UI never calls it) |
| `!digit` guard removed (value `''`/non-digit judged) | killed | n/a |
| hint match ignored (no "Well done!" precedence) | killed | n/a |
| credited cell re-entry silent | killed | n/a |
| (a) text loses its full stop | killed | killed |
| (a) changes the tally | killed | killed |
| classifyEntry ignores a prior conflict | killed | killed |
| status class `ok` / `fail` for the neutral line | survived | killed |
| regex anchor broken (always `ok`) | survived | killed |
| completion no longer overrides the line | survived | killed |
| **neutral class applied to rewards too (`'' : ''`)** | **survived** | **survived** |

### Findings
- Blocking: none.
- Should-fix 1 (test gap, UI wiring): a mutant that makes the status class `''` for every message, i.e. rewards ("Well spotted!"/"Well done!") lose their green `ok` class, survives both the unit tests and `check.js`. The UI wiring (class choice, completion override) has no test in the repo at all; it is only covered by the headless script, which is outside the repo and does not assert that a rewarded entry still has class `ok`. Add one assertion to the E3 headless check (a single entered on its own shows "Well spotted!" with class `ok`) and re-record. No repo change is required for that; if the lead wants repo coverage, the class choice would need to move into a testable function.
- Should-fix 2 (README, rule 10 literal truth): README lines 43-44 say that an entry that is the only digit that fits (or the only place in a unit) shows "Well spotted! ..."; line 46 then starts "If neither applies, ...", and its (b) bullet says "(whatever the digit)". Read literally, a single entered while the grid before already has a conflict "applies" in lines 43-44 but shows (b) in the code. The old text covered this with "or if some numbers elsewhere in the grid break the rules". Suggest adding to lines 43 and 44 "(and no numbers in the grid just before the entry break the rules)", or starting line 46 with "If neither applies, or if some numbers in the grid just before the entry break the rules, ...".
- Nit 1: trailing space after `assert.strictEqual(creditEntry(T0, {}, hint, H_BOX, 4, 5, '1').text, NOT_SINGLE(5, 6, 1)); ` in `tests/sudoku.test.js` (rule 5 test, last line).
- Nit 2: the Files entry in README for `creditEntry` is a very long single line; unchanged style, fine.

### Lead questions
- Q1 (regex `/^Entered: /`): acceptable for the MVP. It is private to `setCell`, both texts are pinned byte for byte by unit tests, and a `kind` field would force changes to the existing `deepStrictEqual({tally, credited, text})` tests. The failure mode of a future reward/neutral text with another prefix is a green neutral line, a visible, low-risk error. A `kind` field is the cleaner design if more neutral texts arrive; not needed now. Do add the Should-fix 1 assertion so the wiring is guarded.
- Q2 (hint showing with a conflict): no. Traced in `sudoku.js`: `hint` is assigned only at the Hint click handler and only when `hintFor` returns `nudge` or `explain`, and `hintFor` returns `conflict` for any conflicting grid. Values change only through `setCell`, and every changed value calls `clearResults()` which sets `hint = null` before the next judgement. Givens cannot change; notes changes do not alter the grid. So a showing hint always matches the current grid, which has no conflict; "Well done!" can never mask (b) in the UI. Only a direct `creditEntry` call with a hand-made hint on a conflicting grid could, which is a test-only path. Rule 1/8 are consistent.

### README: sentence by sentence
- "follows the naked-single order above" (PM fix): true (falls back to the naked-single order, then hidden, then the no-single message).
- "(and may show a "Well spotted!" message or a "not counted" message, see below)": true.
- "If neither applies, nothing is rewarded and nothing is counted ... plain style of a Hint message (not green, not red)": true for nudge/explain (class `''`); see Should-fix 2 for the structure.
- (a) bullet: text byte-equal; "does not say whether the digit is right", "does not point out a clash the entry itself creates": true.
- (b) bullet: text byte-equal; "whatever the digit": true.
- "Neither message changes a count, flags a cell red or highlights anything": true.
- "This message replaces any ... 'not counted' text ... A rewarded entry is still counted": true.
- Counts paragraph re-entry parenthesis: true (credited cell + non-single gives (a)/(b), no count change).
- "Any change to a value clears ... " sentence: true, including overwrite, clear and Notes on showing no new message.
- Files entry for `creditEntry`: true (reward, (a)/(b) with tally and credited unchanged, `''` when value `''`/non-digit or cell holds a value).
- Search of the whole README for "blank", "silent", "Nothing is said", "no message", "nothing is shown": no remaining sentence implies a blank message after a judged entry.

### Test quality (E2)
- Independent: baseline is the frozen module (verified identical), the clash check in the test is a pairwise row/column/box check not using `findConflicts` or `classifyEntry`. 220 puzzles (110 Easy, 110 Medium), seeded; mix of solution digits, random digits, `''`/`0`/`x`/`12`, hint present or not, cells cleared again. The asserts require counts same > 300, (a) > 500, (b) > 100, non-judged > 50; developer reports 2399 / 4359 / 10817 / 1989, so (a) is exercised thoroughly and not only (b). Inputs not mutated is asserted per call.

## Lead decision after review round 1 (APPROVE, S1, S2, N1) and test round 1 (PASS)
- Both have reported. Rework round 2 before acceptance:
  - S1: the "rewards made neutral" mutant survives the unit tests and the headless check. Add an assertion that "Well spotted!" and "Well done!" keep the green `ok` class, re-record the headless check, and show that the mutant now dies.
  - S2: make the README literally true for a single entered while the grid already has a conflict, which shows (b).
  - N1: remove the trailing space in the rule 7 test.
- Q1 (the `/^Entered: /` regex) is accepted for now, on the reviewer's reasoning. Carry-forward: add a `kind` field if more neutral texts arrive.
- Q2 is answered: no hint can be showing on a conflicting grid.
- Tester concern (not a defect): at 375px the status line sits partly below the fold and wraps to 3 lines. Hint messages have the same issue. Passed to the PM as a candidate.
- After round 2: full re-review and full re-test.

## Developer round 2
- Developer: Claude Sonnet 5.5, session `246ca1dd-69c1-44b3-80a4-65e176ec6193`.
- S1: the headless check (`.../scratchpad/dom31/check.js`, outside the repo) has a new section 7. On seed 3 Easy it enters a naked single on its own and asserts the text starts with "Well spotted!" and the status class is `ok`. In a fresh puzzle it clicks Hint, enters the hinted digit and asserts "Well done!" with class `ok`. No unit test was added: the class choice lives in `setCell`, and a testable version would need a change to the `creditEntry` result shape or a refactor, which is out of scope.
  - Run on the tip (before the round 2 commit, same `sudoku.js`): `node check.js <worktree>` exits 0, 30 PASS lines, including `Well spotted! has class ok -> {"c":"ok"}` and `Well done! has class ok -> {"c":"ok"}`.
  - Run on the mutant (throwaway copy made with `git archive HEAD`, outside the branch; `/^Entered: /.test(credit.text) ? '' : 'ok'` changed to `? '' : ''`): exits 1 with `FAIL Well spotted! has class ok {"s":"Well spotted! You found a naked single on your own: row 1, column 2 is 6.","c":""}`. `node --test` in the mutant copy still passes 128/128, as the review found, so only the headless check guards this.
- S2: README "neither applies" bullet now starts "If neither applies, or if some numbers in the grid just before the entry break the rules, nothing is rewarded and nothing is counted, ...". The Well spotted bullets are unchanged. The two sub-bullets that follow (no conflict gives (a); conflict gives (b), whatever the digit) still hold.
- N1: trailing space removed from the last assert line of the rule 7 test.
- `node --test`: 128/128 pass.

## Test round 2
- Tester: Claude Sonnet 5.5, session `246ca1dd-69c1-44b3-80a4-65e176ec6193`. Head tested: eff80bd, fresh detached worktree of origin/issue-31-uncounted-entry.
- Change since round 1 (1b04c45..eff80bd) outside the work log: README.md (1 line, the "If neither applies, or if some numbers ... break the rules" sentence) and tests/sudoku.test.js (trailing space only). No code change in sudoku.js or index.html, so behaviour is as in round 1.
- `node --test`: 128/128 pass.
- Independent oracle (`.../scratchpad/oracle31b.js`, same as oracle31.js pointed at the new worktree): 330 seeded puzzles (Easy, Medium, Hard), 73,741 checks, 0 mismatches.
- Headless Chrome, real index.html, desktop and 375px (`.../scratchpad/browser31b.js`): 61 PASS, 0 FAIL, 0 console errors. Both "Well spotted!" (naked single on own) and "Well done!" (hinted digit) are asserted to have the green `ok` class (already present in browser31.js; "Puzzle solved!" also asserted ok). New case added: with a self-clash on the grid, a digit that is a single in the grid is entered; the status is exactly the (b) text, class empty (neutral, nudge colour), no "Well" text, no red cell, nothing highlighted, tallies 0/0, i.e. nothing rewarded, nothing counted, not unanswered.
- README Rewards section re-read sentence by sentence: all match, including the new sentence ("If neither applies, or if some numbers in the grid just before the entry break the rules, nothing is rewarded and nothing is counted, but the entry is not left unanswered"), the (a) and (b) texts, the neutral style, the last-cell exception, the hint-showing rules and the "Neither message changes a count, flags a cell red or highlights anything" line.
- Verdict: PASS, no defects.
## Review round 2 (reviewer, head eff80bd)

Verdict: APPROVE. No blocking, should-fix or nit findings.

Full review done, not only the delta.
- Changes since round 1 (74ef8bb..eff80bd): README.md (one sentence), tests/sudoku.test.js (trailing space removed), the work log. sudoku.js is unchanged since round 1; against main 8d92cfd it still only adds notCounted(), the creditEntry fall-through and the status class line.
- `node --test`: 128/128 pass.
- Mutations (14, same set, run against this head): all killed by the unit tests, the updated headless check (dom31/check.js, which passes on the unmutated head with 0 page errors), or both. M7b (all status lines neutral, "rewards made neutral") now dies on "Well spotted! has class ok" (S1 closed). M7a/M7c/M8/M10 die in the headless check only (unit tests do not cover the class, as before; acceptable). M3, M4, M6 die in the unit tests only.
- Diff vs main against rules 1-10, edge cases and E1-E4: no deviation. Only a digit entered into an empty cell is judged; overwrite, clear, Notes on, rejected input and arrow keys are unchanged; tally and credited are untouched on (a)/(b); the completion message wins; (b) tests the grid before the entry and (a) never reveals a clash made by the entry.
- README, sentence by sentence against the code:
  - S2 sentence ("or if some numbers in the grid just before the entry break the rules, nothing is rewarded..."): matches classifyEntry returning null on a prior conflict, then notCounted choosing (b). It now reads consistently with the Well spotted bullets (naked, hidden, both) and with the two sub-bullets (a)/(b); "neither applies" stays tied to the two techniques, and (b) says "whatever the digit". S2 closed.
  - Sub-bullets (a), (b) and the "Neither message changes a count..." line: text, punctuation, neutral class and no tally change match the code and tests.
  - Hint bullet ("not counted" added), "naked-single order" wording (PM request), credited-cell sentence, "Filling the grid" replacement sentence ("A rewarded entry is still counted"), the "Any change to a value clears..." bullet, and the API line for creditEntry: all match the code.
- N1 (trailing space): fixed.

Scratch: scratchpad/mutb.py (mut.py pointed at rv-31b), scratchpad/dom31/check.js.

## Lead decision after round 2 (review APPROVE with no findings, test PASS)
- Round 2 closed S1, S2 and N1.
- Review: all 14 mutants die, including "rewards made neutral".
- Test: 73,741 oracle checks with 0 mismatches. Browser: 61 PASS at desktop and 375px.
- Carry-forward: the UI class wiring (neutral vs ok) is guarded only by scratchpad headless scripts, not by a test in the repo. This is the same pattern as earlier issues. Consider an in-repo headless test or a `kind` field later.
- PR opened for PM acceptance.

## PM acceptance and merge
- PR #33: PM (Claude Opus 5.5) **ACCEPTED** with no conditions, on head 1a3f12b. The lead verified the PR comment and the head on GitHub.
- PM evidence:
  - Own oracle: 4,121,634 checks, 0 failures. It discriminates: 1,000,468 failures against main.
  - Byte checks pass.
  - Personas: 4/4 sessions told counted entries from uncounted ones. Text (a) is neutral but "mildly deflating". Text (b) "partly" helps.
- PM follow-ups, all PM candidates and none a defect: reword (b), self-clash handling, and two README nits.
- Merged with a merge commit (no squash).
