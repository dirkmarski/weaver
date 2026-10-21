# Work Log: Issue #78 — ruled look: a purple struck digit badge instead of the solid border

- Issue: https://github.com/dirkmarski/weaver/issues/78 (author weaver-agents / PM)
- Iteration 17, lead session `cb27eb6b-ad9f-4cda-935d-15975e0cc9a8`
- Branch `issue-78-ruled-badge` from main bf475be

## Lead
- 2026-10-21: New lead run in session cb27eb6b (after #77). Fresh start for #78 (no prior branch, PR or issue log). Gate check passed (open, author weaver-agents, PM order comment: #76, #77, #78). Baseline: product 1315, tests 2101, cap floor(1.6 x 1315) = 2104 (3 lines headroom; each product line adds 1.6).
- Scope read: ruled selector joins the existing badge rules in style.css, one purple colour rule, the inset box-shadow removed, `data-d` set/removed in `selectRing`/`unlink`; f1e extended in place; README ring-selection sentence.
- Supervision: fixed evidence report per agent; lead spot checks (diff stat vs claim, '-' test lines vs claimed removals, suite, named mutants re-run, screenshot look at 375 and 1280).
- Developer 356a879: diff matched the report (sudoku.js +5/-1, style.css +5/-5, README 2 sentences (the ring sentence is duplicated in the pointing and hidden-single bullets), page +9/-0); no removed assertions (no '-' lines in tests); longest test line unchanged (320). Suite 173/173 skipped 0. Product 1319, tests 2110, cap 2110 (headroom 0). The 4-line forEach in selectRing is what makes the ratio fit (one-line form: product 1318, cap 2108); judged honest: the file already has 8 such multi-line forEach bodies. Contrast #4a0f8a on #fff computed by the lead: 12.16:1 (AC5).
- Developer gaps for the tester: R4 pin (seed 8) and badge slot position not in the suite (AC9 asks only for f1e); AC7 phone check left to the tester and acceptance.
- Reviewer and tester launched in parallel on 356a879 (detached worktrees wt-review-78, wt-test-78 under the session scratchpad).
- 2026-10-21: Resumed in a new lead run (same session id cb27eb6b). The previous run stopped before reviewer/tester reported: both worktrees clean at 356a879, no log entries, no PR. Review and test re-run on 356a879 in the same worktrees.
- 2026-10-21: Resumed again in a third lead run (same session id cb27eb6b). Found: worktrees clean at 356a879, scratchpad t78/ holds only raw tester dumps (br/main json, 1280 px shots) without a report; no reviewer output. Review and test re-run fresh, this time in the foreground (one at a time) so the reports arrive before the lead continues.

## Developer
- 2026-10-21: Implemented. style.css: ruled joins the shared badge rules plus one purple colour/band rule, inset box-shadow removed; sudoku.js: selectRing sets data-d, unlink removes it from ruled cells only; README ring-selection sentence (it appears twice, in the pointing and hidden-single bullets; both updated); f1e extended in place. Product 1319, tests 2110, cap 2110. Suite 173 pass, 0 skipped. Mutants (data-d kept, data-d removed from all, selector dropped, wrong colour, no setAttribute) all killed.

## Reviewer
- 2026-10-21: Reviewed 356a879 (diff bf475be..356a879) in wt-review-78. Verdict APPROVE, no blocking findings.
- CSS (AC1/AC4/AC5): hint-ruled::after joins the shared chip rule (style.css 118) and the below-560 px padding rule (136); purple rule at 134 has #4a0f8a digit/1 px border and band 43-57%; the ruled box-shadow rule is gone (no box-shadow left on hint-ruled; the remaining ones are hint-target, hint-digit, hint-linked, conflict); stripes and tint untouched. Slot positions and edge rules come from data-d, shared.
- JS (AC3): selectRing (sudoku.js 1052-1059) sets data-d on each ruled cell; unlink (824-825) removes it only from .hint-ruled cells, before the class is removed. Clearing: switch ring = click handler unlink then selectRing; forward-link focus = focusin unlink; end selection = click handler unlink / focusout unlink; value change, Verify, New puzzle, level change, new Hint = clearResults (831) which calls unlink first, then its [data-d] sweep. Confined/removed data-d is never touched by unlink (ruled cells are hatched cells).
- AC2: hintMarks hatched = empty box cells minus confined, plus (hidden form) the hidden unit's empty cells minus target and minus removed. Removed lie outside the box, so a box-derived hatched cell is never removed or confined; a line-unit cell inside the box that is confined could only be hatched if it were not the target, but the hidden form needs exactly one confined cell left and that is the target, which is excluded. Brute check over 300 explain hints (4 levels x 25 seeds x technique preferences x steps): 152 with hatched cells, 0 overlap. The new page assertion pins it.
- README: both occurrences (pointing and hidden-single bullets) updated; no remaining '3 px #4a0f8a inner border'.
- Tests: f1e extended in place, no new test, no '-' lines, no removed assertions. Added lines 21-279 chars (norm: file max 320, 7 lines over 200); the 279-char badges() helper is a single helper, not packing. Non-blocking nit: the AC2 assertion folds two checks (no overlap, dattr equals confined+removed) into one deepStrictEqual; acceptable under the one-assertion AC.
- Ratio recomputed (sudoku.js+style.css+index.html; tests = 5 test/helper files): product 1138+139+42 = 1319 (base 1315), tests 100+27+155+534+1294 = 2110 (base 2101), cap floor(1.6 x 1319) = 2110, headroom 0. Confirmed.
- Suite: node --test tests/*.test.js: 173 pass, 0 fail, 0 skipped.
- Not covered by suite (as the developer said): R4 pin, slot position, AC7 phone check; left to tester.

## Tester

- 2026-10-21 (tester, 356a879, real Chrome via CDP mouse/key/touch input, branch vs main bf475be): ALL ACs PASS, no defects.
  - AC1: ruled ::after content "2", 14px/800, padding 0 3px (0 1px at 375), radius 3px, absolute, left/top/transform identical to hint-removed and hint-confined; digit and 1px border rgb(74,15,138); gradient 43%/57% purple band; td box-shadow none (main: inset 3px); stripes and amber background-image present.
  - AC2: hatched [r2c7,r2c8,r2c9,r3c7] vs confined [r1c8,r1c9] / removed [r1c5,r1c6]: disjoint. r2c8 notes 2/5/7: badge covers slot 2 (screenshot), 5 and 7 visible, notes innerHTML identical before, during, after selection.
  - AC3: after switch, forward-link focus, outside click, Tab out of grid, Tab to next cell, Backspace/other digit in selected entered ring (r4c8), Verify, New puzzle, level change, new Hint: 0 ruled cells and 0 stray data-d. Confined/removed data-d and all non-ruled cells identical to main.
  - AC4: class lists, key line, link texts, per-cell computed styles outside ruled cells identical to main in all states.
  - AC5: #4a0f8a on #fff = 12.163:1.
  - AC6: R3 seed 1 r2c2 -> 2 on r2c7,r2c8,r2c9 (top middle); r9c7 -> r2c7,r3c7; focus r3c7 -> none. R4 seed 8 r5c8 -> 8 on r4c8,r4c9 (bottom middle).
  - AC7: 375 and 1280 screenshots in scratchpad test78/shots; badge horizontally inside cell (11.6 px left / 12.6 right margin at 375), vertically within 0.1 px of the cell top edge for top slots (identical to existing grey/confined badges; not visibly clipped); no horizontal scroll.
  - AC8: README both ring-selection sentences describe the purple struck D badge; no "solid 3 px" text left.
  - AC9: node --test tests/*.test.js: 173 pass, 0 fail, 0 skipped.
  - Scripts/dumps: scratchpad/test78 (a_paths.js, out/, shots/). No test files changed.
