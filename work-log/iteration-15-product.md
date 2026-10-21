# Work Log: Iteration 15 (product manager)

- PM: product-manager agent (Claude Opus 5.5, claude-opus-5-5), session `4d807d2c-5806-4242-97a4-9a94b8f24412`
- Branch: `iteration-15`. Scratch: `/tmp/wvr/claude-502/-Users-dirk-Code-weaver-team/4d807d2c-5806-4242-97a4-9a94b8f24412/scratchpad/pm-*`
- Inputs read: memory/wiki/backlog.md, product.md, process.md, lessons.md; governance/context/product-strategy.md, test-strategy.md; work-log/iteration-15.md (lead plan); candidate list at the end of work-log/iteration-14-product.md; issue #65 body. governance/LOG.md not read.

## Scoping (2026-10-21)
- Strategy unchanged (educate, teach progressively, reward learning; small increments with early user tests).
- Starting point: backlog item 1, the direct ring-to-cell link, paired with the alpha-0.25 notes quick win. Mobile next.
- Main baseline: tests 1961 lines, product 1226 (1.5995x), cap 1.6x, 0 lines of headroom.

## Spike S1: ring-to-cell partners (2026-10-21)
Script `pm-spike/links.js` (scratchpad). Medium and Tricky seeds 1-40, page seeding (`Math.random = seededRng(seed)`), following Hint (second click, type the explained digit), on main `adf5150`.
- 1839 explanations with hatching, 5735 hatched cells.
- Partner rings per hatched cell (rings sharing a row, column or box with it): 1 ring 4359 (76%), 2 rings 1376 (24%), never 0, never more than 2.
- Every ring rules out at least one hatched cell (0 exceptions); a ring rules out 1-4 hatched cells (1: 2630, 2: 1414, 3: 547, 4: 3).
- Shared unit: row 3094, column 3380, box 434, column+box 118, row+box 85 (a ring can share two units with a cell).
- 939 of 1839 explanations (51%) contain at least one two-ring cell. So the two-ring case is common and must be pinned.
- Pins (main, fresh puzzle, Hint twice): Medium 1 hidden single D=5 target r1c2, r2c3 <- r2c8 (row) + r9c3 (column), r3c1 <- r3c6 (row). Medium 4 D=4 target r2c8: r1c7 <- r1c4, r6c7; r1c8 <- r1c4; r1c9 <- r1c4, r8c9; r2c9 <- r8c9; r3c8 <- r3c3. Tricky 8 pointing D=8 target r4c1: r1c3 <- r1c5 (row), r2c2 <- r7c2 (column), r4c8 <- r5c8 (column+box), r4c9 <- r5c8 (box).

## Spike S2: notes contrast in hatched cells (alpha)
Note #626262 against the stripe colour (#6a1fb5 at alpha a) over the amber-tinted box shades: a=0.3 (main) 2.57-2.77:1; a=0.25 2.81-3.03:1; a=0.2 3.06-3.32:1. Notes on the bare tint 4.24-4.64:1. 0.25 is the low end of #65's allowed range.

## Prototype (scratchpad pm-proto/a and pm-proto/b, from main adf5150)
Both: hatch alpha 0.25; key line hatched clause ends "...already in the same row, column or box; click or tap a hatched cell to see which)". Focusing a hatched cell (click, tap, arrow keys) fills its partner ring(s) solid purple #6a1fb5 with a white digit (8.48:1) and a darker #4a0f8a inner ring.
- A: highlight only.
- B: highlight plus a line under the key: "Row 2, column 3: the 5s at row 2, column 8 (same row) and row 9, column 3 (same column) rule 5 out there." / one ring: "Row 2, column 2: the 8 at row 7, column 2 (same column) rules 8 out there."
Screens (`pm-shots`, blind copies in `pm-persona`): case1 = Medium 1 focus r2c3 (two rings), case2 = Medium 4 focus r1c9 (two rings), case3 = Tricky 8 focus r2c2 (long column), case4 = Tricky 8 focus r4c9 (box). Notes: notes1 X = alpha 0.3 (main), Y = 0.25; notes2 X = 0.25, Y = 0.3 (order swapped on purpose).
- PM look: the solid fill is unmistakable at 375 px; the focused hatched cell shows the input focus background #fff8 over the hatch (fainter, accepted in #65).

## Persona round 1 (user-a, user-b, user-c; screenshots only, no source/README/LOG.md)
- Ring identification: 12/12 correct for each persona.
- Sureness: A (highlight only) was 4,4,4,3 / 4,4,4,4 / 4,4,4,3; B (with sentence) was 5 in every case.
- The box-only cell (case4) was the weakest in A, because the "why" (row, column or box) had to be inferred.
- Preference: B 3/3, on both phone and desktop.
- Wording asks:
  - "Row R, column C cannot be D: ..." instead of a label;
  - say "same row" in full words;
  - put the tap hint in a separate sentence;
  - give the line some accent.
- Notes, alpha 0.3 vs 0.25: user-a 2 -> 3 (Y = 0.25 easier, "slight"); user-b 3/3; user-c 4/4. No clear gain, nobody found 0.25 worse.
- PM flaw: the blind pair also differed in the key text (the prototype added the tap clause), and one persona noticed. The scores still show no stripe difference.
- Wanted next: the reverse link (tap a ring to see its cells) from all 3; a faint line from ring to cell; a lighter key on phones.

## Prototype C and round 2 (user-a, user-c)
- Wording: "Row R, column C cannot be D: the D at row R1, column C1 is in the same U[, and the D at ... is in the same U2]."
- The tap sentence was appended to the key line: "Click or tap a hatched cell to see what rules it out."
- Results:
  - 10/10 correct, sureness 4-5, wording 4/5.
  - "Row 4, column 4 cannot be 4" was mildly odd, but correct.
  - "same column and box" read fine.
- Both said ship with small changes:
  - put the tap/link sentence on its own line and make it stand out;
  - say what "solid purple" means.

## Decisions
- **D1 Scope.** One issue, #68: the hatched-cell -> ring link (focus-driven, so keyboard arrows work too), plus the alpha 0.25 quick win.
  - Not included: the reverse ring -> cells link. Givens are not focusable, and a click-on-td design adds scope. It is the next candidate.
- **D2 Placement (prototype D).** A separate link line under the key line, in #4a0f8a, weight 500.
  - It shows "Click or tap a hatched cell to see what rules it out (solid purple)." The parenthesis names the mark (lesson: a key must name every mark).
  - On focus it shows the sentence instead.
  - The key line text stays exactly as #65, so no key test changes.
  - Measured at 375 px: the tap text is 2 lines, a sentence 2-3 lines (32-48 px); at 1280 px, 1-2 lines.
- **D3 Look.**
  - Linked ring: solid #6a1fb5 with a white digit (8.48:1), and an inner ring in #4a0f8a.
  - The fill is 6.7-7.5:1 against the box shades.
  - Checked on a given and on a player-entered ring (L4 r1c8: computed rgb(106, 31, 181), digit rgb(255, 255, 255)).
- **D4 Alpha 0.25.** Shipped. The evidence is weak but not negative, contrast improves by about 0.25 (2.81-3.03:1), it is inside #65's range and costs one number. Re-checked at acceptance on the real page.
- **D5 Ratio.** No separate trim item; trim in place.
  - New product lines earn 1.6 test lines each (estimate 30-40 lines of headroom).
  - Any removal must be listed with its covering test and confirmed by reviewer (by mutant) and tester. Never an AC-required assertion (#68 or #65 AC 8). No line packing.
  - Recorded in #68.
- **D6 Assumption.** Focus is the trigger (click, tap, arrows and programmatic). On a phone, tapping an input opens the soft keyboard. Accepted for now and listed under mobile.

## Feasibility measurements behind the visual ACs (#68 AC 6, 7)
- Computed styles on prototype D (main adf5150 + patch), 375 px and 1280 px, pins L1-L4: linked cells background rgb(106, 31, 181), digit rgb(255, 255, 255), including the entered ring r1c8 in L4.
- Contrast:
  - white / #6a1fb5 8.48:1;
  - #6a1fb5 / #d9e6f5 6.70:1 and / #f4f1e6 7.50:1;
  - #4a0f8a / #f5f5f7 11.17:1;
  - note #626262 on the stripe colour at 0.25: 2.81-3.03:1.
- Link line height: 32-48 px at 375 px and 16-32 px at 1280 px, measured on the longest sentences (two partners, L1 and L4) and on two-unit sentences (L2, L3).
- Headless focus: focusin did not fire until `Emulation.setFocusEmulationEnabled` (the first prototype run showed 0 linked cells). This is noted for the developer in #68.

## Issue
- #68 "Hint: tap a hatched cell to see the ring that rules it out (and lighter hatch)", label enhancement, 12 ACs, pins L1-L5, ratio decision, empty Change log. https://github.com/dirkmarski/weaver/issues/68

## Concerns and open questions
- Mobile: tapping a hatched cell opens the soft keyboard on real phones, which may cover the link line. It is not testable headless. Flagged for the mobile item.
- The link line is not announced to screen readers (out of scope).
- The alpha 0.25 gain is unproven by personas. If acceptance shows no gain, it is still harmless (inside range).
- All evidence is simulated (GitHub Pages not confirmed).

## Candidate list (PM, ordered, after it15 scoping)
1. (it15) #68: ring-to-cell link plus alpha 0.25. In delivery.
2. Explanation depth, continued:
   - the reverse link (tap a ring to highlight the cells it rules out; asked for by all 3 personas in it15);
   - say what solid purple means in the key, if acceptance shows confusion;
   - a stronger first-click signal for pointing;
   - "same D as before";
   - "(the box has no other empty cells)" reads like a single;
   - why the naked-form target has only D or X;
   - minimal rings.
3. Mobile:
   - the soft keyboard on tapping a hatched cell (new, it15);
   - long messages plus key and link lines (conclusion first?);
   - struck grey vs purple on tinted cells;
   - cells about 36 x 58 px at 375 px;
   - level buttons at 375 px;
   - the hint badge at 320 px.
4. Pointing reach (watch, no action).
5. Slip follow-ups (it11, wording-led), unchanged.
6. Small wording items, unchanged.
7. Long-term: a middle hint level, progress across puzzles, claiming then pairs.

Watch: the ratio after #68 (cap 1.6x; trim-in-place rule in #68).

## Acceptance of #68 on PR #69 (2026-10-21)
- Head checked with `gh pr view 69` both before and after the run: 209a9d2083e20bd883dff64e0074d76c85cd83ab. Worktree `scratchpad/wt-68-pm` (detached); main 326c911 in `scratchpad/pm-acc/main-wt` for the comparisons. Scripts and screens are in `scratchpad/pm-acc` (acc.js, arrow.js, shots.js, shots/, persona/).
- Work-log reads: only the Lead section of work-log/issue-68-ring-link.md. That file is on the PR head (209a9d2), not on iteration-15, so I read it via `git show`. governance/LOG.md was not read.
- Suite at head: 170/170 pass, skipped 0, with TMPDIR set to pm-acc/tmp. Ratio 2012/1277 = 1.575x. The test diff removes no assertions; the only removed test lines are edits (read(), noHint, the 0.3 -> 0.25 assertion, the import line).
- acc.js: 4459 checks passed and 6 failed. I triaged all 6 as errors in my own script, none in the product:
  - The box-shadow regex expected "inset" first (2 checks).
  - An arrow path started from a cell with givens on both sides (2 checks). Re-checked with arrow.js: from r2c4, ArrowLeft goes to r2c3 and links r2c8 and r9c3, ArrowRight reverts, and ArrowUp from r3c3 links again.
  - A second Hint while an explanation is showing re-shows the same explanation (linked marks cleared, invite back). That is correct.
  - Backspace on an empty cell is not a value change, so the link stays, the same as the hatching on main.

### AC results (head 209a9d2)
1. Pass. In the replay (Easy, Medium and Tricky seeds 1-12, following Hint, every hatched cell clicked), 246 explanations with hatching and 874 hatched cells all had 1 or 2 partners (228 had two). The rings, hatched cells and badges match main.
2. Pass. The invite text is exact. The line is empty with no hint, on nudges, on 186 naked singles, on explanations without hatched cells, and on L5. The key line is unchanged.
3. Pass. The link works by click, by touch tap at 375 px and by arrow keys. Focusing the target, a non-hatched cell or anything outside the grid reverts it. Moving from hatched cell to hatched cell switches it. The Hint click focuses the target with nothing linked.
4. Pass. All 874 sentences equal my independent builder. In pointing explanations D is the pointing digit; there were 9 naked-form cases.
5. Pass. L1 to L5 and the naked-form pin pass at 375 and 1280 px.
6. Pass.
   - Linked given and entered ring (L4 r1c8): rgb(106, 31, 181), white digit, inset 4px rgb(74, 15, 138).
   - Link line: rgb(74, 15, 138), 13.6px (same as the key line), weight 500, below the key line.
   - Heights: 48 px at 375 and 32 px at 1280, matching the measurements in the issue.
7. Pass. The stripe is rgba(106, 31, 181, 0.25); the rest of the gradient is unchanged.
8. Pass.
   - A value change, Verify, New puzzle, a level choice and the next Hint result all clear the link.
   - A typed note keeps it, and the Notes button keeps it too because focus returns to the cell.
9. Pass. The replay snapshots of head and main are identical in all 36 runs: status, key and every mark class, with the link and linked marks left out.
10. Pass. Both second-click paragraphs, the change to 25%, the removal list and the ringLink API entry are in place.
11. Pass. The ringLink unit test covers one partner, two partners and two units. Page tests f1c (L1, target revert, leaving the grid, a value change, computed styles for a given and an entered value) and f1d (naked form) are there, plus the edited 0.25 assertion. Skipped 0.
12. Pass. The ratio is 1.575x, under the 1.6x cap.

### Play-through
- The acc.js replay is the play-through. Easy, Medium and Tricky, 12 seeds each, up to 12 rounds of following Hint and typing the digit, with every hatched cell clicked: 0 defects.
- I also looked at 375 px screens of L1, L3 (box-only r4c9) and the naked form. The solid fill is unmistakable, and the link line sits clearly under the key line.

### Persona check (user-a, user-b, user-c; 375 px screenshots only)
- Ring naming: 18 of 18 correct, sureness 5 in every case, including two partners, a long column, box-only, an entered ring and the naked form.
- Link line: 3 of 3 noticed the invite and would tap.
- Naked-form wording (Tricky 1, r2c7: "Row 2, column 7 cannot be 2..." under "...so it must be 7"): clarity 3/5 for all three.
  - The sentence is correct, but sitting under the conclusion it can read as being about the target, or as a contradiction.
  - Suggested fixes: a lead-in ("The cell you tapped: ..."), or making it clear that the line explains the hatching rather than the final step.
  - PM view: the behaviour meets AC 4 (D is the pointing digit, which the key line also uses). The risk is in reading, not in correctness. I am not rejecting for it; it goes to the backlog.
- Notes in hatched cells at 0.25 (s8, notes I placed by hand): 3/5 for all three, and every note was read correctly.
  - The complaint is that notes are small and grey and the stripes compete with them.
  - This is in line with it15 round 1 (3, 3, 4). It is not a regression, but it is still a mobile wish.
  - user-b flagged notes that "disagree with the grid". Those were my arbitrary hand-placed notes, not a defect.
- Verdict: ship with small changes, 3 of 3.

### Decision
- **ACCEPTED at 209a9d2083e20bd883dff64e0074d76c85cd83ab.** PR comment: https://github.com/dirkmarski/weaver/pull/69#issuecomment-6306211386
- No spec change. The #68 Change log stays empty.

### Follow-ups (backlog)
- F1: the link sentence needs a lead-in or a framing, so it does not read as being about the target. Most visible in the naked-form pointing case (3/5). Candidate: "Tapped cell: Row R, column C cannot be D: ...". A small wording change.
- F2: notes in hatched cells on phones are 3/5 (small and grey under the stripes): a darker note colour in hatched cells, or a lighter stripe. This goes in the mobile item.
- F3: with two partners, "and" can read as if both are needed (user-b). This is a minor wording point; keep it under watch.
- Carried over: the reverse link, and the soft keyboard on tap (it cannot be tested headless).

## Candidate list (PM, ordered, after #68 acceptance)
1. Explanation depth, continued:
   - the reverse link (tap a ring to highlight its cells);
   - F1, a link-line lead-in and the naked-form framing ("why 7", the "only D or X" step);
   - a stronger first-click signal for pointing;
   - "same D as before";
   - the box-case wording;
   - minimal rings.
2. Mobile:
   - F2, notes contrast and size in hatched cells;
   - the soft keyboard on tapping a hatched cell;
   - long messages plus the key and link lines (conclusion first?);
   - struck grey vs purple on tinted cells;
   - cell size at 375 px;
   - the level buttons at 375 px;
   - the hint badge at 320 px.
3. Pointing reach (watch, no action).
4. Slip follow-ups (it11, wording-led), unchanged.
5. Small wording items: F3, the two-partner "and", plus the existing ones.
6. Long-term: a middle hint level, progress across puzzles, claiming then pairs.

Watch: the ratio is 1.575x at the #68 head, about 31 lines of headroom under 1.6x.
