# Work Log: Iteration 14 (product manager)

- PM: product-manager agent (Claude Opus 5.5, claude-opus-5-5), lead session `c0f6ffb1-d246-448a-942e-3cfd5baa05e4`
- Branch `iteration-14`; main at 9c5542b (167/167 tests, skipped 0; ratio 1943/1215 = 1.599x).
- Sources read: memory/wiki/backlog.md, product.md, process.md, lessons.md, governance/context/product-strategy.md (unchanged: educate, teach techniques progressively, reward learning; solving secondary) and test-strategy.md, memory/wip/current.md, work-log/iteration-14.md (lead), and the final candidate list sections of work-log/iteration-13-product.md. governance/LOG.md not read. No other work log read.
- Spike/mock-up dir: /tmp/wvr/claude-502/-Users-dirk-Code-weaver-team/c0f6ffb1-d246-448a-942e-3cfd5baa05e4/scratchpad/pm-spike

## Scoping (2026-10-21)
- Strategy re-read: unchanged. Iteration goal: explanation depth, the top backlog item (it13 persona signal: "and of row N" scored 3/5, and players cannot tell which ring rules out which cell). Mobile stays second. Hatching was checked at 375 px, so it also serves the phone.
- Size: one issue. A second issue (first-click signal, "same D as before") was left out to keep the iteration small and to take feedback on the hatching first.

### Data spike (scratchpad pm-spike/spike.js, read-only `require` of main's sudoku.js)
- Ran Medium and Tricky seeds 1-40, following Hint (tally-based preference, Tricky preference on): 1702 hidden-single and 153 pointing explanations.
- Reason cells per explanation (p10/p50/p90/max): hidden 1/3/5/8, pointing 0/3/5/8. Pointing hidden form 2/4/6/8, naked form 0/2/4/5.
- Rings: hidden 1/3/4/6, pointing 0/2/3/4. A reason cell is seen by two or more rings in hidden singles at p50 1 and max 4, so a cell-to-ring link is ambiguous in about half the cases. "Rings > greedy minimal cover": 620/1702 hidden, 12/153 pointing (feeds the "minimal rings" candidate).
- Equivalence: rings > 0 exactly when reason cells > 0 (0 exceptions in 1855). So hatching shows exactly when rings show.
- Worst case for clutter: Tricky seed 34, first Hint, with 8 hatched cells and 4 rings.

### Mock-ups (scratchpad pm-spike/proto, a copy of main 9c5542b; screenshots via shot.js, headless Chrome, dpr 2)
- Option 1: hatch the reason cells (purple diagonal stripes over the amber tint).
- Option 2: a crossed purple D badge in D's note slot.
- Option 0: today.
- Key line drafts: option 1 "rings ... keep D out of the hatched cells"; option 2 "purple D with a cross = ...".
- Round 1 personas (user-a, b, c; PNGs only, all three confirmed no source, README, LOG.md or scripts). "Which ring rules out which cell" scores:

  | Position | Today | Option 1 | Option 2 |
  |---|---|---|---|
  | 1 | 2/2/2 | 3/4/3 | 3/3/3 |
  | 2 (worst case) | 1/1/1 | 3/4/3 | 2/2/2 |
  | 3 (hidden single) | 2/1/2 | 4/4/4 | 3/3/3 |

  - Notes readable under the hatch (alpha 0.45, 2 px every 8 px): 2/3/3.
  - All three chose option 1. Option 2 is too small on a phone and blurs into the badges.
  - Asks: a "hatched = ..." entry in the key; say how struck grey and hatched differ; a lighter hatch; a direct ring-to-cell link (tap or line; all three).
- Contrast calculation (note #626262 against the stripe colour over the amber-tinted box shades): alpha 0.45 gives 1.95-2.08:1, alpha 0.3 gives 2.57-2.77:1. Notes on the tint alone: 4.24-4.64:1.
- Round 2 (user-b, user-c; PNGs only, both confirmed): hatch at alpha 0.3, 1.5 px every 8 px. Key: "struck grey D = the pointing step rules D out there; hatched = a purple ring rules D out there (a D already in the same row, column or box)".
  - Spotting the hatch: 4 and 3.5 (from 5 and 4).
  - Notes: 4 and 4 (from 2-3).
  - Naming the ring for each hatched cell in P1: 4 and 4, all four correct for both.
  - Both would ship it. Both called "the pointing step" jargon.

## Decision D1: issue #65 (2026-10-21)
- #65 "Hint explanation: hatch the cells the rings rule out, and a key line for hidden singles". Label enhancement, created as weaver-agents.
- Wording: "struck grey D = this step rules D out there", replacing "the pointing step" (round-2 jargon note). The parallel "rules D out there" is kept on purpose: same effect, different cause.
- The new key text has no grammar variants except "a D" / "an 8". Ring count, hatched count, form and unit no longer change it.
- Pins P1-P5 were checked on the prototype page, which matches main for hint, rings and texts. Each listed cell was read back from the DOM.
  - P1 Tricky 8: hidden form, an 8.
  - P2 Tricky 1: naked form.
  - P3 Medium 4: hidden single, box.
  - P4 Medium 7: hidden single, row, 1 hatched cell.
  - P5 Tricky 18 after 8 followed hints: no hatched cells, box case.
- A hidden single always has at least one hatched cell. With no other empty cell in its unit it would be a naked single, and Hint teaches it as naked: the preferred search uses notNaked, and the fallback runs only when no naked single exists.
- Assumption: no screen-reader change. The explanation text already gives the reason.

## Decision D2: ratio (2026-10-21)
- No separate trim item. #65 trims in place:
  - The W-clause variants and their pointingKey tests go away.
  - New unit tests adapt the existing reason-cell tests.
  - Added product lines earn 1.6 test lines each.
  - Any further room comes only from listed, tester- and reviewer-confirmed removals of redundant assertions in the touched test files.
- Reason: the issue removes behaviour (the W clause) as well as adding it, so a standalone trim item would cost a cycle without user value. Recorded in #65.

## Concerns and open questions
- C1: the hatch is fainter (3.5-4/5) on note-heavy grids. This is the accepted trade-off for readable notes. Watch at acceptance.
- C2: the cell-to-ring link is still inferred by the player (personas 4/5 in P1). A tap-to-flash link is the next explanation-depth candidate if acceptance still shows the gap.
- C3: a player's own pencil note D in a hatched cell can look contradictory (user-b). Leave it: notes are the player's own.

## Candidate list (PM, ordered, after it14 scoping)
1. (it14, open) #65: hatch the cells the rings rule out; key line for hidden singles.
2. Explanation depth, continued:
   - a direct ring-to-cell link (tap a hatched cell or a ring to highlight its partner; all three personas asked);
   - a stronger first-click signal for pointing;
   - "same D as before" when one pointing fact gives another cell;
   - "(the box has no other empty cells)" reads like a single;
   - why the naked-form target has only D or X;
   - minimal rings (rings exceed a minimal cover in 36% of hidden-single explanations).
3. Mobile:
   - long messages and the key line on a phone (conclusion first?);
   - struck grey vs purple on tinted cells;
   - grid cells about 36 x 58 px at 375 px;
   - 375 px level buttons;
   - hint badge at 320 px.
4. Pointing reach (watch, no action):
   - early first pointing via generation;
   - a cap on the Tricky preference only if load complaints appear;
   - "prefer pointing" on Hard.
5. Slip follow-ups (it11, wording-led):
   - the extra-clash sentence pointing at the outlines;
   - a partial-fix message;
   - two-unit clash naming;
   - "clear your own number" when the pair includes a given;
   - explain "counted" / "stays uncounted" and judge an overwrite;
   - a marker on entries made during a clash;
   - Hint/Verify naming one pair at a time.
6. Small wording items:
   - a shared "not counted" ending;
   - re-entering a hint-credited cell says "on your own";
   - "(see below)" in the finish text;
   - fold away definitions once learned;
   - the heavy naked-single digit list.
7. Long-term:
   - a middle hint level;
   - progress across puzzles;
   - claiming, then pairs, each with its own level.

Watch: ratio 1.599x at main 9c5542b. #65 must end at or below 1.6x (D2).

Not wanted: instant red on a wrong entry (it10); counting entries made during a clash (it11); retroactive counting after a fix (it11).
