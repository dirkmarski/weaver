# Work Log: Issue #45 (pointing hint: target wording, hidden-form unit tint, confined and removed marks)

- Issue: https://github.com/dirkmarski/weaver/issues/45 (iteration 10, first of two; #46 follows)
- Lead: weaver-agents (lead agent, Claude Opus 5.5), session `0245eb9f-91d7-4bfe-b523-bbf5b80a2438`
- Branch: `issue-45-pointing-hint-marks` (from main 0f1fa1c), worktree <session scratchpad>/wt-45

## Gate check
- 2026-10-20: #45 OPEN, author weaver-agents (PM), label enhancement. PASS.

## Lead notes before development
- The scope is the pointing hint only: first-click texts (naked and hidden), the hidden-form unit tint, second-click confined/removed marks, the `hintMarks` fields, README, and proportionate tests.
- Pins checked for plausibility against the tests: WALL_COL is the hidden form, box 0, column 3, digit 8, single at row 4, column 1 -> confined [11, 20], removed [29], unit row 4 = indices 27-35, of which 28-35 are not the target. This matches the issue ("area includes 28-35"; 27 is the amber target).
- Risks:
  - UI marks (CSS, corner digits, 375 px) have no repo tests, so the tester's real-page check is the main gate;
  - the marks must not be confused with the user's notes;
  - there must be no duplicate pointing search (reuse `pointingSteps`).

## Progress
- Branch and log created; developer round 1 launched.

## Developer round 1 (Claude Sonnet 5.5, session 0245eb9f-91d7-4bfe-b523-bbf5b80a2438)
- Did not read governance/LOG.md.
- Changes:
  - `pointingSteps` step now also carries `confined` (the box spots); `findPointing` and `pointingHint` pass `confined` and `removed` on, so no second search exists.
  - New helper `boxName(b)`; `pointingClause` reuses it (also used for the hidden-form unit "the box of ..."). New first-click texts for both forms.
  - `hintMarks`: the hidden unit (from `hint.unit`) joins `area` on both clicks; returns `confined`/`removed`, empty unless a pointing explain.
  - UI: `hint-confined` / `hint-removed` classes plus `data-d` (the digit) on cells; CSS `::after` corner badge (bold on a white chip; purple D with dashed purple outline for confined; grey D with a diagonal strike for removed). `clearResults` also removes them, so they clear exactly with the other hint highlight.
  - README: first-click texts, tint, second-click marks, clear sentences, `findPointing` and `hintMarks` fields. Tests updated and extended.
- Decisions: the unit text for a box names the unit's own box (target's box), as pinned in the issue; badge sits top-right, chip style so it is not mistaken for pencil notes; a diagonal strike replaced `line-through` because a strike on a 14px digit is unreadable at 375 px.
- Tests: `node --test` 143/143, about 0.6 s (no new test() blocks; assertions added to 4 existing ones).
- Line counts (before -> after): sudoku.js 900 -> 914 (+14; net of comment lines about +9 code); style.css 94 -> 112 (+18); index.html 40 unchanged; tests/sudoku.test.js 1075 -> 1082 (+7). Tests are below 1x of the JS delta because the pinned values went into existing assertions; UI lines have no repo test.
- Rule -> test:
  1. naked text -> 'pointing, row line, naked form' (WALL_ROW text). Page check: seed 1 hint 13 text matches the pin exactly.
  2. hidden text (row unit) -> 'pointing, column line, hidden form' (WALL_COL "row 4"); box unit -> 'unit is the box' (WALL_BOX); column unit not tested (same expression as row, mutant on the index was caught).
  3. unit tint on both clicks -> 'hintMarks' test (WALL_COL, row 4 = 28-35 in area, target 27 not).
  4. confined/removed -> findPointing deepStrictEqual on all three walls, hintMarks: WALL_ROW [0,1]/[4,5], WALL_COL [11,20]/[29]; empty on nudge and on singles.
  5. clearing -> DOM only, checked by headless script (scratchpad dev45/run.js), no repo test.
  6. API fields -> as 4, plus area check in 3.
- Mutants tried (all killed): drop hidden unit from area; marks on nudge too; text number off by one; confined/removed swapped.
- Real page (headless Chrome, seeded Math.random): seed 1 hint 13 and seed 3 hint 20, both widths 900 and 375: texts exact, tinted/confined/removed indices match the pins, marks clear on value change, Verify, New puzzle, level choice; survive a note. Screenshots in scratchpad/dev45/.

## Lead check round 1 (head 332ef04)
- Developer: Claude Sonnet 5.5 per its trailer. Two commits: 53e37f7 implementation, 332ef04 log line counts.
- Suite: 143/143, about 0.61 s.
- Diff read in full:
  - `confined` is the `spots` that `pointingSteps` already computes, so there is no second search;
  - `boxName` is extracted and reused;
  - `hintMarks` gets the hidden-form unit through `hint.unit`;
  - the marks are cleared in `clearResults` (the `[data-d]` selector);
  - CSS: a `::after` badge, `td` is already `position: relative`.
- Screenshot s1_h13 at 375 px, second click, viewed: the dashed purple confined cells and the white-chip badges are distinct from the grey notes. The struck "1" on the amber target is small but legible.
- PASS, with points for review and test:
  - L1: the clearing paths Verify, New puzzle and level choice were not observed with pointing marks showing (the developer saw a hidden-single hint there). The tester must check them with the marks showing.
  - L2: the hidden-form column-unit first-click text is not asserted. The developer says an off-by-one mutant on the shared expression was caught; the reviewer should check.
  - L3: the first-click text is a nested ternary on one long line (legibility, development practices). Reviewer's call.
  - L4: badge readability on amber at 375 px. Tester and PM to check.
- Tests +7 lines against +14 JS and +18 CSS: within the guide.
- Review and test round 1 launched in parallel on 332ef04.

## Review round 1 (reviewer)
- Reviewer: Claude Sonnet 5.5, session `0245eb9f-91d7-4bfe-b523-bbf5b80a2438`, head 332ef04. Did not read governance/LOG.md. Suite 143/143 (0.6 s).
- Verdict: APPROVE with should-fix items. No MUST-fix.
- Data flow checked: `pointingSteps` (`confined` = `spots`, `removed` filtered; both ascending) -> `findPointing` -> `pointingHint` -> `hintMarks` (empty unless pointing explain) -> DOM (`cellAt`, class plus `data-d`) -> `clearResults` (`[data-d]` selector). No second search; `boxName` extraction is a good refactor. A hidden-form target can never be confined or removed (checked by reasoning), so the classes never collide with the amber target in that form.
- Findings:
  - S1 (SHOULD, L2 confirmed): the column-unit first-click text is not pinned. Mutant `((s.unit === 'row' ? s.r : s.c) + 1)` -> `(s.r + 1)` survives (the row case is correct); an off-by-one on the shared expression is killed only through the row case. One assertion on a column-unit hidden wall would close it, if a cheap wall exists (a tweak of WALL_BOX or WALL_COL); otherwise accept the gap.
  - S2 (SHOULD, L3): the first-click `else` branch in `pointingHint` (sudoku.js ~line 290) is a nested ternary on one line of about 270 characters. Split it: compute the unit name and the tail sentence in two named variables (for example `var where = s.unit === 'box' ? boxName(...) : s.unit + ' ' + ...;` and `var tail = naked ? ... : ...;`). This is the "legible" rule in the development practices; behaviour unchanged, tests cover it.
  - S3 (SHOULD): README line 92, `hintFor` result: it still lists only `form, box, line, index and pointDigit` as the extra pointing fields. The result now also carries `confined` and `removed`; add them (the `findPointing` and `hintMarks` entries are right).
  - N1 (nit): the comment above `hintMarks` is long; fine. The style.css rule for `.hint-removed::after` repeats `border` colours; acceptable.
  - N2 (nit): `clearResults` removal of `hint-confined`/`hint-removed` depends on `data-d` always being set with the classes; true today, and the coupling is only visible in the selector (consider a comment).
- README, sentence by sentence (lines 40, 41, 92, 59, 47): first-click texts (both forms) match the code and the pins; "U" values and "(the box of the target cell)" are true; "twice" is still true; the tint sentence is true (box, line, hidden unit; target stays amber); second-click marks match CSS (dashed purple outline, purple D top-right; grey struck D, also on amber target; white chip); the `hintMarks` sentence is true (ascending, empty unless pointing explain). Line 59 and 47 stay true. Nothing else made untrue. Only S3 is missing.
- Mutants (scratch copy, rv45; kills counted as failing tests):
  - hidden unit dropped from pointing area: killed (1).
  - hidden unit added to naked-single area: equivalent (naked hint has no `unit`); a hidden-single area unchanged by design, nothing to mutate.
  - marks on nudge as well: killed (1).
  - confined/removed swapped in the step: killed (12); swapped in `hintMarks`: killed (1).
  - `boxName` rows/columns swapped: killed (2); row end 3 -> 2: killed (4).
  - column-unit index off by one: killed (1, via the row case); column unit uses `s.r`: SURVIVED (S1).
  - box unit uses (c, r) box index: killed (1); box unit uses the pointing box: killed (1).
  - naked/hidden text switch inverted: killed (3).
  - `removed` reversed: killed (3).
  - hidden unit dropped for hidden singles (`units = []`): killed (1).
  - `clearResults` selector without `[data-d]`: SURVIVED (DOM only, no repo test; the tester's page check with pointing marks showing must cover it, lead point L1).
- Test proportionality: +7 test lines against +14 JS (+18 CSS): within the ~1x guide, no sweeps, no new test() blocks. Good.

<!-- separator: keep the review and test sections apart -->

## Test round 1 (tester)
- Tester: Claude Sonnet 5.5, session `0245eb9f-91d7-4bfe-b523-bbf5b80a2438`, head 332ef04. Did not read governance/LOG.md.
- Tools (reusable, outside the repo): `<session scratchpad>/ts45/` : `lib.js` (headless Chrome CDP harness, seeded Math.random, follows the page's Hint), `run1.js` (criteria 1-5 pinned walls, widths 900 and 375), `run2.js` (clearing with pointing marks showing), `run3.js`/`run4.js` (screenshots with pencil notes), `run5.js <seeds>` (scan Tricky seeds, report pointing walls and unit kinds). Run with `node`.
- Plan (criterion -> check):
  1. naked text: seed 1 hint 13 exact string, click 1.
  2. hidden text: seed 3 hint 20 exact string; extra seeds 5, 6, 7, 8, 10, 11, 12 read for column, row and box units.
  3. tint: area on click 1 and click 2 (seed 3 includes column 5 on both; target not tinted).
  4. marks: click 1 has no marks; click 2 confined/removed/data-d equal the pins; rings all hold D; click 2 text unchanged; screenshots at 900 and 375 with and without pencil notes in marked cells.
  5. clearing with POINTING marks showing: note change (keep), value change, Verify, New puzzle, level choice, new puzzle then level.
  6./7./8. API, README and test proportion left to the reviewer and lead; suite run only.
- Results (all on the real page, 900 px and 375 px):
  - C1 PASS: seed 1 hint 13 text exact.
  - C2 PASS: seed 3 hint 20 text exact. Also read: column unit (seed 5 h7, seed 11 h26), row unit (seeds 6, 7, 8, 10), box unit (seed 10 h26, seed 12 h24, text names the unit's own box); all well-formed.
  - C3 PASS: seed 3 area = bottom-left box + row 9 + column 5 on both clicks, target amber and not in the tint; seed 1 naked tint = box + column 3.
  - C4 PASS on content: click 1 has no confined/removed/data-d; click 2 seed 1 confined 56, 65 (r7c3, r8c3), removed 11, 20 (r2c3, r3c3 target); seed 3 confined 72, 73, removed 75, 76; data-d = 1 on exactly those cells; rings all hold D; second-click text unchanged; a third Hint press gives the same text and marks. Scanned walls (naked and hidden, seeds 2, 4-13) all mark confined cells in the box and removed cells in the line or unit.
  - C4 readability PASS with one cosmetic defect (D1): badge is legible on the amber target at 375 px (the struck 1 is small but readable); white chip with border reads differently from the bare grey pencil notes; side by side with notes in confined, removed, target and neighbour cells they are distinguishable.
  - C5 PASS: with seed 1 hint 13 click 2 showing (2 confined, 2 removed, 4 data-d, 14 tint, target, 5 rings): note change in a marked cell and in a neighbour keeps all; a value change, Verify, New puzzle, level choice after New puzzle, and level choice directly each remove all of them (0 classes, 0 data-d). Answering the target with 7 then Hint gives a hidden single with no stale confined/removed/data-d on either click.
  - C6, C7: not tested by me beyond the observable page text; C8: suite 143/143 pass, 0 fail, duration about 0.58 s (`node --test`).
- Defects:
  - D1 (low, cosmetic): the corner badge sits in the top-right slot, which is also where pencil note 3 is drawn, so a user's note 3 in a marked cell is hidden under the chip while the hint shows (screenshots overlap_s3_h20_w375_c2.png, overlap_s3_h20_w900_c2.png: notes 3, 6, 9 typed, only 6 and 9 visible in marked cells). Notes themselves are kept; it clears with the hint.
- Observations (not defects): rings still show every D on the board (out of scope, B's clutter concern); the struck chip on the amber target is the least legible mark.
- Screenshots: `<session scratchpad>/ts45/` s1_h13_w{900,375}_c{1,2}.png, s3_h20_w{900,375}_c{1,2}.png, notes_s{1,3}_*_w{900,375}_c2.png, overlap_*.png, boxunit_s10_h26_c2.png, rowunit_*.png.
