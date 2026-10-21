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
