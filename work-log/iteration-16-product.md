# Work Log: Iteration 16 (product manager)

- PM: weaver-agents product-manager agent (Claude Opus 5.5, claude-opus-5-5), session `5094a0cd-ce46-4292-89b5-76375233fea2`
- Run type: "Deliver the next iteration", scoping
- Baseline: main 8b6cbc7, 170/170, skipped 0; ratio 1.575x (2012/1277), 31 lines of headroom under the 1.6x cap
- Inputs read: memory/wiki/backlog.md, governance/context/product-strategy.md (unchanged: teach techniques progressively, reward learning), `sudoku.js` (hint texts, ringLink, focus handler), the relevant pins in the tests, the README (grep only), and #68 (issue format). Work-log reads: `work-log/iteration-15-product.md` (lines 35-70 and 150-185 only, for the F1/reverse-link evidence) and `work-log/iteration-16.md` (lead log, status). governance/LOG.md not read.
- Spike scripts and the persona brief: scratchpad `pm-spike/` (s1-s5.js, brief.md, issue1.md, issue2.md).

## Status check
- Fresh start: there were no open issues or PRs, and no it16 product log existed.

## Evidence
### Spike S1: ring/hatched geometry (Medium and Tricky seeds 1-40, following Hint, main 8b6cbc7)
- 681 explanations with hatching, 1861 rings.
- Rings: 1440 givens (77%), 421 entered (23%). So a reverse link triggered only by focus would miss most rings: the trigger must be a click or tap on the cell.
- Hatched cells per ring: 1 = 871 (47%), 2 = 698 (38%), 3 = 291 (16%), 4 = 1. Never 0. The sentence must handle a list of up to 4 cells.

### Spike S2: naked-form claim (Medium/Tricky/Hard seeds 1-40, following Hint)
- 77 naked-form pointing explanations. In 77/77 the target's row, column and box hold exactly every digit except D and X, so "has every digit except D and X in its row, column and box" is always true.
- D > X in 36/77, so the text keeps the existing D-then-X order rather than sorting.

### Persona round (user-a, user-b, user-c; text only, Tricky seed 1 naked-form position, r2c7 tapped)
Link line, clarity 1-5 (a/b/c):
- A, the current wording: 4/4/4.
- B, "Tapped cell, ...": 3/3/3 (all three called it clunky).
- C, "Why 2 is ruled out at ... (the hatched cell you tapped)": 3/5/4.
- D, "Hatched cell row R, column C: no D here, because ...": 4/4/5.
- Favourites: A, C, D (one each). D has the highest mean, is the shortest, and re-uses the key's word "hatched".
- Nobody saw a contradiction. But the brief named the tapped cell, so this round is weaker than the it15 on-screen check (3/5 in the naked form). That finding stays the reason for the fix.

Naked-form ending, clarity (a/b/c):
- N0, the current wording: 3/3/3. All three said it does not explain why only 2 or 7.
- N1, the reason in brackets: 4/5/4.
- N2, the reason first: 5/4/5.
- Favourites: N2, N1, N2. All three could then explain why it must be 7.
- user-b: "with 2 ruled out there" links back to the pointing step only weakly. So the shipped text adds "now" and keeps the cell name first, so that it does not start with an ambiguous "Its".

What next, value (a/b/c) and rank:
- R, the reverse link: 4/4/4, ranked 1/2/1.
- W, the wording fix: 2/4/3, ranked 3/1/3.
- M, phone notes contrast: 3/3/3, ranked 2/3/2.
- Unprompted from all three: a step-by-step "show me why" replay of the hint, or a practice puzzle for the technique. This is a new candidate for the long-term list.

## Decisions
- **D1 Scope: two issues, in sequence.**
  - #71 is the wording issue (F1 plus the naked-form framing). It is small, adjusts tests only, and fixes known confusion. It goes first because #72's forward-link text depends on it.
  - #72 is the reverse link, the highest-value item (all three personas rank it at the top).
  - Mobile F2 is deferred: it has the lowest value score in this round, and it15 measured 100% note accuracy at alpha 0.25.
- **D2 #71 wording.**
  - Link line: variant D, `Hatched cell row R, column C: no D here, because the D at ...`.
  - Naked form: `Row R, column C has every digit except D and X in its row, column and box, so it could only take D or X. With D now ruled out there, it must be X.`
  - This is N2's order with the cell named first and "now" added. It is not exactly the tested string, so the acceptance check re-reads it on the page.
- **D3 #72 design.**
  - Trigger: a click or tap on the ring's cell, plus focus for entered rings. Givens stay unfocusable; keyboard reach for given rings is out of scope.
  - The ring takes the existing linked look. The ruled cells get a new look: an inset purple border, with the hatching kept.
  - Sentence: `The D at row R, column C rules D out of N hatched cells: ... (same U) ...`, with N as a word.
  - The invitation adds `, or a ring to see which cells it rules out`, so that the feature can be found.
- **D4 Ratio.**
  - #71 is about 0 net: pins are edited in place, no new tests.
  - #72 adds about 20-30 product lines, which earn 32-48 test lines; its tests should take about 25-35.
  - No separate trim issue. The adapt-not-add rule is in both issues.

## Assumptions / concerns
- A1. The #68 L4 state, "Medium seed 1 after 4 rounds", could not be reproduced exactly in my Node replica (the preference or credit path differs). So R5 in #72 is a behaviour check without a PM text pin. R1-R4 match the #68 pins for the same seeds (rings, hatched cells, units).
- A2. A click on a non-focusable given blurs the current input, so #68's focusout runs first. The developer must make the click select the ring after that. A click outside the grid must end the selection (AC 5). That probably needs a document-level click handler. This is noted here for the lead; it is not prescribed.
- A3. The invitation becomes longer: probably 3 lines at 375 px. AC 9 has the phone check. If it is too long, the PM may shorten the text at acceptance (Change log).
- A4. The persona evidence is text only, for cost. Both issues get an on-screen persona check at acceptance.

## Issues
- #71 Explanation wording: hatched-cell link lead-in and why the naked-form target has only two digits. 6 ACs. https://github.com/dirkmarski/weaver/issues/71
- #72 Reverse link: tap a purple ring to see the hatched cells it rules out. 11 ACs. https://github.com/dirkmarski/weaver/issues/72
- Delivery order: #71, then #72.

## Candidate list (PM, ordered, after it16 scoping)
1. This iteration: #71 (wording), then #72 (reverse link).
2. Explanation depth, continued:
   - minimal rings (rings exceed a minimal cover in 36% of hidden-single explanations, it14);
   - a stronger first-click signal for pointing;
   - "same D as before";
   - the box-case wording "(the box has no other empty cells)";
   - NEW: a step-by-step "show me why" replay of an explanation (all 3 personas, it16, unprompted);
   - keyboard reach for given rings (#72 out of scope).
3. Mobile:
   - F2 notes contrast/size in hatched cells (value 3/3/3 in it16);
   - the soft keyboard opening when a hatched cell is tapped (not testable headless);
   - long messages plus key and link lines on a phone (conclusion first?);
   - struck grey vs purple on tinted cells;
   - grid cells about 36 x 58 px at 375 px;
   - 375 px level buttons;
   - the hint badge at 320 px.
4. Pointing reach (watch, no action):
   - early first pointing via generation;
   - a cap on the Tricky preference;
   - "prefer pointing" on Hard.
5. Slip follow-ups (it11):
   - an extra-clash sentence;
   - a partial-fix message;
   - two-unit clash naming;
   - "clear your own number";
   - explain counted/uncounted;
   - an entry marker during a clash;
   - Hint/Verify naming one pair at a time.
6. Small wording items:
   - F3, the two-partner "and" (watch);
   - the shared "not counted" ending;
   - re-entering a hint-credited cell says "on your own";
   - "(see below)" in the finish text;
   - fold away definitions once learned;
   - the heavy naked-single digit list.
7. Long-term:
   - a practice puzzle per technique (it16 persona ask);
   - a middle hint level;
   - progress across puzzles;
   - claiming, then pairs, each with its own level.

Watch: ratio 1.575x, 31 lines of headroom at 8b6cbc7. Not wanted (unchanged): instant red on a wrong entry, counting entries made during a clash, retroactive counting.

## Acceptance #71 (PR #73, head 9080646) - in progress
- Worktree at 9080646 (detached, scratchpad pm-71-acc). Read: issue #71, PR #73 body and diff. No other work-log read.
- Suite: `node --test tests/*.test.js` 170/170, skipped 0 (Chrome present).
- Own model diff main vs PR (Easy/Medium/Tricky/Hard seeds 1-30, following Hint, steps 1+2, both preferences): 20020 hint texts, 19888 identical, 132 differ and all are the naked-form step 2 with exactly the AC 2 text; the reason clause checked against the grid 132/132. 11017 link sentences: all equal to main with only the lead-in rewritten, partners identical; marks and key lines identical.
- Page (headless Chrome, page seeding): P1, P2, P3 exact; invitation unchanged; play-through on Tricky seed 1 (Hint, Hint, focus r2c7, enter 7 in r1c5) gives "Well done! You applied pointing: row 1, column 5 is 7." and the pointing tally 1 with a hint.
- Persona on-screen check launched (screenshots 1280 and 375 px, Tricky seed 1, r2c7 focused; cell not named in the brief).
- Persona on-screen results (user-a / user-b / user-c), shown 3 screenshots: P3 after Hint 2 (1280), r2c7 focused (1280), r2c7 focused (375). Brief did not name the cell or quote any text.
  - Contradiction seen: no / no / no (it15 finding gone; all three named r2c7 and the two purple 2s correctly).
  - Link line clarity: 4 / 5 / 5 (it15 on-screen: 3 / 3 / 3).
  - Big pointing message clarity: 3 / 4 / 3. All three could say why r1c5 must be 7 (uses the "every digit except 2 and 7" clause). Text-only N2 scored 5/4/5; on screen the whole paragraph is judged dense, not the new clause.
  - Phone 375 px: 4 / 4 / 4. Comments: long message pushes text down, tiny 2 badges, "New puzzle" wraps.
- DECISION: ACCEPTED at 908064610c271587db501218eed73ff652b36bfc. PR comment https://github.com/dirkmarski/weaver/pull/73#issuecomment-6307256594. Merge is the lead's call.
- Concern (logged, not blocking): the naked-form sentence was accepted although the tested N2 order had the cell named in a different position (Decision note); the on-screen check covers it (all three understood it).
- Follow-ups for the backlog:
  - split the pointing explanation into short steps (user-a, user-c), or put the conclusion first; this joins backlog item 3 "long messages ... conclusion first?";
  - pointing badges too small on a phone (3/3), part of F2 / mobile;
  - the invitation line goes away after a cell is focused (user-b), so remind users that other hatched cells can be tapped;
  - (user-c) solid purple rings show before the key mentions them; watch only.

## Acceptance #72 (PR #74, head 1b07706) - in progress
- Worktree at 1b07706 (detached, scratchpad pm-72-acc). Read: issue #72, PR #74 body and diff (vs origin/main). No work-log read beyond this log. Product strategy unchanged.
- Suite: `node --test tests/*.test.js` 173/173, skipped 0.
- Page, headless Chrome, page seeding, real CDP input (mouse at 1280 px and touch at 375 px, both runs 0 failures): R1, R2, R3 (select, switch, re-click keeps, real click on r3c7 shows the forward link and clears ruled, target ends), R4 exact; outside click, non-ring given, other empty cell end the selection; Verify, a new Hint and a value change clear; a nudge (one Hint) click on a given does nothing. Play-through Tricky 1: 7 into r1c5 gives "Well done! You applied pointing: row 1, column 5 is 7.", pointing tally 1 with a hint.
- R5 (follow Hint on Medium 1, 5th hint pair, r1c8 holds the entered 2): click, ArrowLeft from r1c9, Tab from r1c6 and programmatic focus all select it; ruled r1c5, r1c6 (equals the #68 partner oracle); line "The 2 at row 1, column 8 rules 2 out of two hatched cells: row 1, column 5 (same row) and row 1, column 6 (same row)." Checked by hand against the grid.
- AC 9 at 375 px (touch): grid 96-660, buttons to 746, status 762-909, key 926-990, link 994-1042; no overlap, no horizontal scroll; viewport 812, so the link line is below the fold (as #68). Ruled border visible on a hatched cell with notes 2/5/7 (notes readable, clear of the band) and without. Border contrast computed 5.74:1 minimum (worst: stripe over tint over grey box).
