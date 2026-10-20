# Work Log: Iteration 10 (product manager)

- Product manager: weaver-agents (product-manager agent, Claude Opus 5.5), session `0245eb9f-91d7-4bfe-b523-bbf5b80a2438`
- Run type: "Deliver the next iteration" (scoping run)
- Branch: `iteration-10` (worktree scratchpad/wt-iteration-10)
- Lead work log: `work-log/iteration-10.md`
- PM scratch: scratchpad/pm-proto10/ (not in the repo)

## Status
- [x] Context read: memory/README.md, wiki index, product, backlog, lessons (Scoping); iteration 9 PM log and its candidate list; product strategy, test strategy (both unchanged); README; hint and marks code in sudoku.js; index.html; style.css.
- [x] `governance/LOG.md` NOT read (Dirk's rule).
- [x] Data look at the pointing walls (Tricky seeds 1-10).
- [x] Persona review of a text/picture mock-up (A, B, C).
- [x] Scope decided.
- [x] Issues raised: #45, #46 (label enhancement). Bodies: scratchpad/pm-proto10/issue-pointing-hint.md, issue-clash.md.
- [x] Log committed and pushed.

## Starting point (2026-10-20)
Iteration 9 closed (#42 merged); main at 0f1fa1c, 143 tests. No open issues or PRs. Top of my list: pointing hint clarity (C typed the pointing digit into a cell that takes another digit, it9). Third: live feedback on a clashing entry (B and C asked in it8 and it9).

## Progress
- 2026-10-20: context read; log opened.
- 2026-10-20: data look (scratchpad/pm-proto10/walls.js; Tricky seeds 1-10, follow Hint, print each pointing wall). 12 pointing walls: 5 naked form (the answer is NOT the pointing digit: the confusing case), 7 hidden form. 2 of 12 are "trivial" confinements (all empty box cells on one line: seeds 4, 8). The confined cells are always 2 cells; cells the digit is removed from: 1-3 per wall. Pinned examples: seed 1 hint 13 (naked, box rows 7-9 x cols 1-3, digit 1, column 3, confined r7c3 r8c3, removed r2c3 r3c3, target r3c3 = 7); seed 3 hint 20 (hidden, same box, digit 1, row 9, confined r9c1 r9c2, removed r9c4 r9c5, target r5c5 = 1 in column 5).
- 2026-10-20: mock-up (scratchpad/pm-proto10/mock.md): Part 1 pointing hint (first-click text T1/T2/T3 for the naked form; marks M1/M2/M3 for confined `?1` and removed `x1` cells; hidden form H1/H2 with the unit tinted); Part 2 clash on entry (K1 message, K2 message + red, K3 today). Sent to A, B, C (read only; no code, scripts or solvers).
- 2026-10-20: persona A (mock-up only): T3 ("says outright that 1 is out of that cell"; T1 "is what made me type 1"); M2 (marks on both clicks give too much away; `?1` matters more, `x1` "nice but noisy"); H2; still confusing: naked answer is another digit, hidden answer is the pointing digit; wants the text to signal the case; tiny corner marks may be hard to read. K1 (K2 "a bit loud", takes away the Verify step); a clash is "a fact about the board", not the answer. Part 1 matters more.
- 2026-10-20: persona C (mock-up only): T2 (T3 "makes me hunt"; T2's "rules out 1 for" needs a second read); M2, `?1` if only one, both fine on click 2; H2; same case-signal wish; small grey marks may be hard to see. K1 (K2 "a bit like auto-checking"; K3 "silly because the app already knows"); not the answer. Part 1 matters more.
- 2026-10-20: persona B (mock-up only): T3; M1 (both marks; "M2 is a fair compromise if the first click stays a nudge"); H2, and for the hidden form "the digit 1 has only one place left in column 5" (case signal); `x1` must not look like own notes; rings plus marks may be cluttered. K1, K2 close second (would keep red tied to Verify); not the answer. Part 2 "a little" more, but "if only one, Part 1"; ship both.
- 2026-10-20: pinned values checked with sudoku.js on main (scratchpad/pm-proto10/walls.js, testwalls.js; data only, not a test oracle): seed 1 hint 13 and seed 3 hint 20 confined/removed cells; WALL_ROW confined [0,1] removed [4,5]; WALL_COL (hidden, unit row 4) confined [11,20] removed [29]. Clash pins on a fresh Tricky seed 1 (all three cells empty, digits as stated; today they get text (a)). My first clash pin (8 at r2c1) came from the wall grid, not the fresh puzzle; caught and replaced before the issue was raised.

## Decision: iteration 10 scope (2026-10-20)
TWO small issues, in sequence (both touch README and sudoku.js):
1. **#45 Pointing hint: say what the step does to the target, tint the hidden-form unit, mark confined and removed cells.** Top of the list; the it9 failure (C typed the pointing digit) is a teaching failure, and 2 of 3 personas rate it the more important part.
   - Naked first click: T3 (A, B), worded plainly per C ("That means D cannot go in row R, column C, and only one other digit fits there now.").
   - Hidden first click: H2 with B's case signal ("Then look at U: D now has only one place left there."), unit tinted on both clicks (3/3). This names D for the hidden form on the first click; I accept that because all three asked for the case to be explicit, and the learner still has to see why.
   - Marks on the second click only (M2: A, C; B accepts). Both `?D` (confined) and struck `xD` (removed); rings unchanged.
2. **#46 Say why an entry is not counted when it clashes.** K1, 3/3, neutral, no red. Very small (one text branch in creditEntry). Decision against #31: naming a rule clash is a rule fact, not a correctness reveal; #31's rule (never say whether a digit is right) stands. Text pinned; unit order row, column, box (the natural reading order for "already in this cell's ..."; the hidden-single order box-row-column is about where a digit goes, not about a clash).
Not chosen: rings on relevant digits only, trivial confinements, Tricky density, Hint preferring pointing, small wording items, claiming/pairs, mobile.

## Assumptions
- Persona review of a mock-up fixes wording and marks well enough; readability of the corner marks is checked at acceptance in screenshots (incl. 375 px).
- The page's Hint at Tricky seed 1 hint 13 and seed 3 hint 20 hits the pinned pointing walls (as in the it9 acceptance, which followed the page's Hint).
- Two issues are within "small": #46 is a one-branch text change.

## Concerns
- Clutter on the second click (B): amber, tint, purple rings, dashed outlines and struck digits together. If the screenshots look busy, the fix is a follow-up on rings (already a candidate), not a blocker.
- `xD` could be mistaken for a user's note (B); criterion 4 requires it not to look like one.
- Hidden-form first click now names the digit; this makes the nudge stronger than the hidden-single nudge. Watch at acceptance whether it feels like giving the answer.
- Personas are LLM simulations, not real users (GitHub Pages still unconfirmed).

## Acceptance approach
- #45: criteria 1-8 on the real page (headless Chrome, seeded Math.random), Tricky seeds 1 and 3 following the page's Hint; screenshots of both clicks in both forms, also at 375 px; README diff read; one persona plays both walls (first click, try the answer, second click). No PM oracles.
- #46: the three pinned entries plus one entry into a broken grid on the real page; README diff; a brief persona check.
- Both: suite fast, no sweeps, test lines about 1x product lines.

## Next-iteration candidates (ordered, after scoping iteration 10)
1. Pointing visuals v2: rings only on the relevant digits (B at scoping, C at #45 acceptance: "slightly busy"); a short legend for the dashed/struck marks (C); D1: draw the badge in D's own note slot; avoid trivial confinements as the example (2/12 walls in seeds 1-10); optionally make the first-click case signal more explicit (C).
2. Tricky practice density: at least 2 pointing steps per Tricky puzzle (measure generation time first; seeds 1-10 had 12 walls, so most puzzles have one). Hint preferring pointing on Tricky (B, it9) may go with this.
3. Small wording: re-entry of a hint-credited cell says "on your own" while the count stays "with a hint"; finish text "(see below)"; fold away grey definitions once learned (C).
4. Claiming, then pairs, each with its level.
5. Mobile layout (2x2 level buttons at 375 px), a middle hint level, progress across puzzles.
Delivered or in flight and gone from this list: pointing hint clarity (#45), clash feedback (#46).

## Acceptance of #45 (PR #47, head 63c13de; code 579c1db), run started 2026-10-20
- Asked by the lead (session 0245eb9f-91d7-4bfe-b523-bbf5b80a2438). Delivery: developer 2 rounds, review APPROVE x2, test PASS x2, suite 143/143. D1 (badge covers pencil note 3 while the hint shows) flagged for my judgement.
- `governance/LOG.md` NOT read.
- Detached worktree scratchpad/pm-45 at 63c13de. PM scripts: scratchpad/pm-acc45/acc.js (both walls, both clicks, 900 and 375 px, then Verify; reuses the tester's ts45/lib.js for navigation only, I judge the output myself). Persona play tool: scratchpad/pm-play45/play.js (game A = seed 1 at hint 13, game B = seed 3 at hint 20; moves hint/verify/notes/rRcC=D; prints message, board and a 375 px screenshot). No solver in the tool.
- Suite re-run by PM: 143/143, 0.59 s.
- Progress: criteria 1-5 checked on the page (results below); README diff read; persona C session launched.

### Criteria, checked one by one by the PM (real page, seeded, 900 and 375 px)
1. PASS. Seed 1 hint 13: the first-click text matches the pin byte for byte.
2. PASS. Seed 3 hint 20: the text matches the pin byte for byte. The column and box unit texts are asserted in tests (WALL_UNIT_COL, WALL_BOX).
3. PASS. On seed 3, the area on both clicks is box 6 plus row 9 plus column 5 (4, 13, 22, 31, 49, 58, 67, 76); the target 40 is amber and not tinted. The seed 1 tint (box plus column 3) is unchanged.
4. PASS. Click 1 has no marks. Click 2 matches the pins: seed 1 confined [56, 65], removed [11, 20]; seed 3 confined [72, 73], removed [75, 76]; data-d = 1 on exactly those cells. The rings hold 1 and the click-2 text is unchanged. Screenshots (pm-acc45/s{1,3}_w{900,375}_c{1,2}.png): the dashed purple outline and the white-chip badges read clearly at 375 px; the struck 1 on the amber target is the smallest mark but legible; none looks like a pencil note (also checked in ts45/overlap_s3_h20_w375_c2.png).
5. PASS (pm-acc45/c5.js). A note in a confined cell keeps everything (2/2/4/14/1). A value change, Verify and New puzzle clear everything. Hint again after the value change shows no stale marks. The tester covered the level choice (run2).
6. PASS. The tests pin confined/removed on WALL_ROW, WALL_COL and WALL_BOX; both are empty on the nudge and on singles (H_BOX); the area includes 28-35 on both clicks. The reviewer confirmed there is no second search (confined = the `spots` from `pointingSteps`).
7. PASS. README word diff read: first-click texts (both forms, U values), unit tint, second-click marks (they match the CSS and what I saw), the clearing sentences, and the findPointing/hintFor/hintMarks fields. Everything is true; the old tint sentence was extended correctly.
8. PASS. Assertions were added to existing tests, plus one wall constant (WALL_UNIT_COL). No sweeps, no loops. Suite 143/143, 0.59 s.

### Persona C (play tool only, 375 px, both walls)
- Game A (naked): from the first click C worked out 7 at r3c3 (it ruled out everything but 1 and 7, then the pointing removes 1). C did not type the pointing digit, which is the it9 failure, now fixed. Process note: C did not enter the answer before the second click as asked, but stated it first; the second click confirmed it.
- Game B (hidden): from the first click C found 1 at r5c5 and called it "a fair nudge", which "still left me real work". This answers my scoping concern that the hidden-form first click would give the answer away: not observed.
- Second click: C understood both steps from the marks. The badges were "small but legible" at 375 px; the struck 1 is the hardest to read ("could pass for a pencil note" at a glance; the white chip and the diagonal set it apart). On D1: "I wouldn't mind". Clutter: "slightly busy" in B. C would remove the far-away purple rings first (candidate 1).
- Wishes: a short legend for the dashed and struck marks; first-click wording that states the case more plainly. C's reading: "only one other digit fits" implies a different digit, and "1 now has only one place left" implies the pointing digit, but C still had to infer the case.
- C's "oddity" (a Hint after entering the answer moves on to the next step) is by design: the hint clears on a value change.

### Scoping risks
- Clutter on click 2: present, acceptable. The fix is rings on relevant digits only (candidate 1).
- Badge readability at 375 px: OK (my screenshots and C).
- Hidden-form first click giving too much away: not observed (C).

### D1 judgement
ACCEPTED as a known limitation, not a merge blocker. The hint is transient, the note is kept and comes back, criterion 4 is met, and C does not mind. Follow-up idea (low): draw the badge in the slot of D's own note (each digit has a fixed note position), so it can only cover the user's note of the same digit, which says the same thing. It goes into candidate 1, not a separate issue.

## Decision: #45 ACCEPTED (head 63c13de, code 579c1db), 2026-10-20
- All 8 criteria pass on PM checks; no defects against #45; D1 accepted; no conditions.
- Comment: https://github.com/dirkmarski/weaver/pull/47#issuecomment-6283379837
- I do not merge (lead). Next: #46 after the lead merges #45 and launches it.

## Acceptance of #46 (PR #48, head 4be2898; product code c4b48f4, tests/README 378bd85), run started 2026-10-20
- Asked by the lead (session 0245eb9f-91d7-4bfe-b523-bbf5b80a2438). Delivery: developer 2 rounds (round 2: tests and README only), review APPROVE x2, test 35/35 page checks PASS on c4b48f4, suite 143/143.
- `governance/LOG.md` NOT read.
- Detached worktree scratchpad/pm-46 at 4be2898. `git diff c4b48f4 4be2898` touches only README.md, tests/sudoku.test.js and the issue log, so page checks on 4be2898 are valid for the product code.
- PM scripts: scratchpad/pm-acc46/acc.js (fresh seed 1 Tricky; the three pinned entries each on a fresh page; status text, class, computed colour, conflict/aria-invalid cells, hint classes/data-d, tally text; then Verify; then a broken-grid sequence and a legal non-technique entry). Reuses the tester's ts45/lib.js for navigation only; I judge the output myself against the board the page prints. Persona tool: scratchpad/pm-play46/play.js (copy of pm-play45 pointed at pm-46, games A = seed 1 and B = seed 3, fresh; no solver).
- Suite re-run by PM: 143/143, 0.59 s.

### Criteria, checked one by one by the PM (real page, fresh Tricky seed 1, 900 px)
I judged against the fresh board the page shows: 2 is at r2c2, 4 is at r1c1, and row 3 and column 1 hold no 2.
1. PASS. The three pinned texts match exactly. For 2 at r2c1 the page names the row, for 4 at r2c1 the column (4 is in the column and the box), and for 2 at r3c1 the box.
2. PASS. For each pinned entry:
   - the status class is '' and the colour is rgb(29,29,31), the same as on a fresh page;
   - there are 0 `.conflict` or `aria-invalid` cells and 0 hint classes or `data-d`;
   - the tally text is identical to the fresh page.

   After Verify, the cell is flagged red with "Mistakes found: the red numbers break the rules."
3. PASS on my checks.
   - Broken grid: 2 at r3c1, then 4 at r2c1 (which itself clashes by column) gives text (b), with no red and no count change. A legal 3 at r1c2 on that broken grid also gives (b).
   - Legal non-technique entry (3 at r1c2 on a fresh grid): text (a), unchanged.
   - I did not re-run the last cell, overwrite, clear or Notes on. The tester checked them on c4b48f4, and the product code is identical.
4. PASS. I read the README diff:
   - the section order is (b), clash (with U and the row, column, box order), (a);
   - the "does not point out a clash" sentence is gone;
   - the "Any change to a value" paragraph and the `creditEntry` sentence have been updated.

   Every changed sentence is true. The code comment in `notCounted` still says "Never says whether the digit is right". That is harmless, but "matches the solution" would be the more exact wording (nit; not raised).
5. PASS. One test was replaced (`creditEntry (c)`: row, column, box, row over column, column over box, (a) when there is no clash, (b) for a clash into a broken grid). Two single-line expectations were updated. Tests went from 1084 to 1093 lines for +7 product lines. The 1-8 digit loop in one cell is small and is not a sweep. 143/143, 0.59 s.

### Persona check (A, B, C; play tool only, fresh seed 1 and seed 3; no scripts or solvers)
I checked every slip text they quoted against the board, and the unit named was right every time (for example, C's 5 at r2c1, which is in the column and the box, named the column).
- A: keep. "Rules fact, not the answer"; the tone is calm. Maybe a bit too quiet: the message line sits below the buttons and could be missed on a phone. A wants a subtle, non-red marker on the offending cell.
- B: keep, with small changes. A rules fact, not spoiling; calm. Findings:
  - (1) After a slip, a legal 7 elsewhere got text (b), "Some numbers break the rules, so it is not counted". That reads as if the 7 was wrong, and it was B's most confusing moment.
  - (2) When a digit clashes in more than one unit, only the first is named. B would like "also in its column".
  - (3) The clash and the non-technique texts both end in "not counted".
  - (4) The clashing cell is not located; B has to scan the box.
- C: keep. Clear and not spoiling. Second slip into a broken grid: (b) is "understandable but vaguer", and C was unsure whether the new entry or the earlier one was wrong. C also suggests a soft highlight on the clashing cell and noticed that (a) could be mistaken for a rule complaint.
- How I read it:
  - All three accept the message. The #31 line holds: none felt told the answer.
  - The new pain is the stale text (b) after a clash. It is specified, pre-existing behaviour (criterion 3), so it is not a defect against #46. But now that the first slip is named, (b) on the next entry stands out more.
  - In play, all three now want a subtle visual marker. At the mock-up they chose K1 over K2 (red). A non-red marker is a different option, and it goes on the candidate list.

## Decision: #46 ACCEPTED (head 4be2898; product code c4b48f4), 2026-10-20
- All 5 criteria pass on PM checks. There are no defects against #46 and no conditions.
- Comment: https://github.com/dirkmarski/weaver/pull/48#issuecomment-6283519624
- I do not merge (lead).

## Iteration 10: complete from the product side (pending the lead's merge of PR #48)
- #45 ACCEPTED (PR #47, merged). #46 ACCEPTED (PR #48, to be merged by the lead).
- Outcome against the strategy: the pointing hint now teaches what the step does to the target, which fixes the it9 failure (C no longer typed the pointing digit). A rule slip now gets an immediate, calm explanation without revealing the answer.

## Next-iteration candidates (ordered, after iteration 10)
1. Clash follow-ups (from #46 play, all three personas):
   - (a) Text (b) after an earlier slip blames the new entry. Make it say that this entry fits the rules but an earlier number breaks them, and name the clashing cell or cells rather than sending the user to Verify. Check against #31 and Verify's role.
   - (b) A subtle, non-red marker on a cell whose entry was reported as a clash, cleared when the value changes (A, B, C). This should be a mock-up first, because K2 (red) was rejected.
   - (c) Optional: name every unit the digit clashes in (B).
2. Pointing visuals v2: rings only on the relevant digits (B, C); a short legend for the dashed and struck marks (C); D1, drawing the badge in D's own note slot; avoiding trivial confinements as the example; a more explicit case signal on the first click (C).
3. Tricky practice density: at least 2 pointing steps per Tricky puzzle (measure generation time first); Hint preferring pointing on Tricky (B, it9).
4. Small wording:
   - the clash and the non-technique texts share the same "not counted" ending (B, C);
   - re-entry of a hint-credited cell says "on your own";
   - finish text "(see below)";
   - fold away the grey definitions once learned (C);
   - the `notCounted` code comment wording (nit).
5. Claiming, then pairs, each with its level.
6. Mobile layout (2x2 level buttons at 375 px; A: the message line could be missed on a phone), a middle hint level, progress across puzzles.
Delivered and gone from this list: pointing hint clarity (#45), clash feedback (#46).
