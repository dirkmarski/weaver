# Iteration 11: product log

Product manager, session 544de00f-db0c-4fd3-8425-f2e90d4ada4d, Claude Opus 5.5 (claude-opus-5-5). Started 2026-10-20.

## Inputs read
- memory/wiki/index.md, product.md, backlog.md, lessons.md; memory/wip/current.md; README.md (behaviour spec); governance/context/product-strategy.md and test-strategy.md (re-read; unchanged in substance: teach techniques progressively, reward learning and applying skills, solving secondary; test strategy: golden path, edge cases, errors; PM does acceptance only).
- Not read: work-log/ (Dirk's rule; not needed for diagnosis so far) and governance/LOG.md (never read).

## Scoping approach
- Start from the PM candidate list (backlog.md): 1 clash follow-ups, 2 pointing visuals v2, 3 Tricky practice density, 4 wording items, 5 claiming, 6 mobile/progress.
- Reproduce the top pain first on the current main code (play tool in the session scratchpad, pm-it11/play.js; Tricky seed 1).

## Reproduction (main at e3c8f63)
- Fresh Tricky seed 1. Slip r4c1=6 (6 is a given at r5c3, same box): clash text "Entered: row 4, column 1 is 6. 6 is already in this cell's box, so it breaks the rules. It is not counted."
- Then r7c2=9, a genuine naked single whose row, column and box do not touch the slip: "Entered: row 7, column 2 is 9. Some numbers break the rules, so it is not counted. Click Verify to see which." Counts stay 0. Every later entry gets the same text until the slip is fixed.
- Product view: this blocks the reward for a correctly applied technique and reads as if the new entry were wrong. It hits the strategy aim (reward applying skills) directly.

## Persona round 1 (play + mock-up)
Mock-up: <scratchpad>/pm-it11/mock/mock.md with K0/K1/K3 screenshots (amber outline injected by CSS into the real page; no product code).
- Part 1 options for the after-slip text: S0 today, S1 "digit fits, other numbers break the rules", S2 S1 plus naming the clash, S3 judge and count anyway with a reminder.
- Part 2 clash marker: K0 none, K1 entered cell amber outline, K3 entered cell and the existing cell; duration L1 next value change, L2 until the clash is gone.
- Part 3 ranking: slip recovery, pointing visuals v2, Tricky density, claiming.

### Round 1 results (A, B, C played the slip on main, then reviewed the mock-up)
| | Part 1 text | Part 2 marker | Duration | Ranking |
|---|---|---|---|---|
| A | S2 (S1 second); S3 rejected: counts could rest on the wrong 6 | K3 | L2 | slip recovery, Tricky density, pointing visuals, claiming |
| B | S2 (S1 second); S3 "a count I cannot trust is worse than one I wait for" | K3 | L2 | slip recovery, pointing visuals, density, claiming |
| C | S2 (S1 second); S3 risky | K3 | L2 | slip recovery, pointing visuals, density, claiming |

Convergent findings (all three):
- Today's after-slip text and Hint ("Some numbers break the rules. Fix them first: click Verify to see which.") are a dead end: they do not say whether the new digit is fine or which cells clash. Hint "refuses to help".
- The amber outline (K1/K3 mock) looks like the amber Hint cell: needs another style (dashed or other colour; not red).
- Unclear whether entries made during a clash count once the clash is fixed (they do not; the count resumes only for new entries). B and C asked for that to be said.
- B: Verify flags only the user's 6, not the given 6 it clashes with (givens are never flagged): naming both cells helps.
- A: after clearing the slip, retyping 9 over the existing 9 showed an empty message (overwrite is not judged; by design).

Decisions after round 1:
- D1 Scope it11 = "recover from a slip": unanimous first rank, observed in play, and it blocks the reward for correctly applied techniques (strategy). Pointing visuals v2 stays next.
- D2 Reject S3 (count during a clash): all three rejected it themselves; counting a deduction that may rest on a broken grid would teach wrong.
- D3 Name one clashing pair in text (S2) and in Hint's conflict text. Verify keeps its role (red flags, all mistakes).
- D4 Marker on every clashing cell (givens too) while the clash exists (K3 + L2), in a style distinct from amber, purple and red. Style picked in a play check on two prototypes: X2 dashed orange outline, X3 wavy orange underline.
- D5 Two issues in sequence: issue 1 texts (pure logic, `notCounted` and `hintFor`), issue 2 the marker (UI). Texts first because they carry the information; the marker adds visibility.
- D6 Not retroactive: entries made during a clash stay uncounted after the fix (keeps "counts never change except on a judged entry"); the text says counting resumes for new entries.

## Persona round 2: play check on two prototypes
Prototypes (scratchpad copies only, never product code): <scratchpad>/pm-it11/protoX2 and protoX3. Both: S2-style entry text naming the first clashing pair, Hint conflict text naming it, and every clashing cell (givens too) marked while the clash exists. X2 = dashed orange outline (#d9480f) on the cell; X3 = wavy orange underline under the digit. A, B and C each played 7-14 runs (own slips, two slips, Hint and Verify during a clash, fix and carry on).
- Marker: X2 unanimously. X3 did not show under the player's own digits (prototype CSS defect: the input's own text styling won), so half of each pair looked unmarked; even where shown it was tiny. X2 was not confused with the amber Hint cell, the purple pointing marks or the red Verify fill (A, B, C). Over a red Verify cell it stacks; "busy but readable" (A, B).
- Entry text: clear but long (3-4 lines with two slips) (A, B, C). "Change or clear one of them first; entries count again after that." was misread: A took it as retroactive counting; B and C could not tell whether the entry would count later. Must be reworded (D6 stands: not retroactive).
- Hint text during a clash: clear (A, B, C). B and C: the red colour makes it read like a Verify error although it is guidance.
- B: a single entry clashing in two units (r1c2=4 vs a given 4 in its row and another in its column) marks three cells while the text names two; the extra sentence "Other numbers break the rules too" covers it.
- B, C (and A in round 1): after the fix the message line goes blank; no sign that the clash is resolved.
- B: the immediate clash text (#46) names the unit but not the other cell.
- B: fixing by overwriting (6 -> 8, a real hidden single) is not judged. That is the existing rule (overwrites are never judged); out of scope, noted as a candidate.
- A: Hint names one clash but does not point at it on the grid (the X2 marker covers this once issue 2 ships).

## Persona round 3: final wording (text only, <scratchpad>/pm-it11/mock/texts2.md)
| | Clash text (P1 today / P2 names the cell) | After-slip entry (V1/V2/V3) | Hint colour (H1 red / H2 plain) | Fixed message (F1 blank / F2 / F3) |
|---|---|---|---|---|
| A | P2 | V3 | H2 | F2 ("Clash" is jargon) |
| B | P2 | V3 | H2 | F2 |
| C | P2 | V3 (V2 "reads as if the whole game is dead") | H2 | F3 (F2 fine) |
Still confusing (round 3): what "counted" means (A, B, C); how to get an uncounted entry counted (clear and re-enter; A, B, C); overwrites not judged is surprising (B).

## Decisions (final)
- D7 Texts: P2, V3, H2, F2 (majority; C accepts F2). Exact texts are pinned in #50 and #51.
- D8 Not adding "clear it and enter it again to have it counted" to V3: it would overpromise (after the fix the cell may no longer be a single) and invites count farming rather than learning. Logged as a wording candidate with "what counting means".
- D9 Marker style X2 (dashed orange outline #d9480f), on every clashing cell, givens included, live while the clash exists; Hint and Verify do not remove it. Only the player's editable cells get ", clashes" in their aria-label.
- D10 Hint during a clash is shown in the plain style (B, C: red reads as a new error). The full-grid conflict text stays red (unchanged; it reports a state, not advice).
- D11 Named clash = one pair, chosen by a fixed rule (first clashing cell in reading order; partner in its row, then column, then box; first such cell in reading order). An extra sentence points to Verify when more than two cells clash.
- D12 Order change in the "not counted" texts: an entry that clashes itself gets the clash text even when the grid was already broken (players need to hear about the new slip; the outline from #51 shows the older one).

## Pinned values check
All examples in #50 and #51 were run on a prototype (scratchpad copy of main with the final texts, <scratchpad>/pm-it11/final) against the exact state named in the issue: fresh Tricky, Math.random seeded with seededRng(1). Outlined cells were read from the page (r4c1 r5c3; r1c1 r1c2 r6c2; none after clear or overwrite with 8; r1c1 r1c2 r6c2 remain after clearing only one of two slips). Phone check at 375 px: outline visible on given and own digits; the after-slip message runs to about 6 lines with the extra sentence (accepted; length was judged "long but fine" by A, B, C).

## Issues raised (deliver in this order)
1. #50 After a slip, name the clashing cells in the entry text and in Hint (logic + one status-class change).
2. #51 Outline clashing cells while the clash lasts, and say when it is fixed (UI; starts after #50 is merged).

## Risks and open points for development
- #51 changes the README's "no live checking" stance (outline only, no red); the PM accepts this on persona evidence (K3 + L2 unanimous, X2 unanimous in play). Red stays Verify-only.
- #50 order change (clash of the entry before "grid already broken") alters an existing README rule from #46; tests must cover both orders' adjacent pairs (lesson from #46 S1).
- The named-clash rule has a three-way precedence (row, column, box); tests need the column-vs-box and row-vs-box adjacent cases (criterion 4 of #50).
- The fixed-clash message (#51) must be decided from the grid before and after the change, not from the DOM (the prototype used the DOM; fine for a mock, not for product).
- The X3 prototype defect (underline hidden on inputs) does not affect X2; the issue pins the X2 style.
- Test code ratio is about 1.18x: extend existing test blocks.

## Acceptance plan (PM, per test strategy)
- #50: run every pinned example on the real page (headless, seed 1), read the README diff sentence by sentence, one persona spot check of the texts.
- #51: pinned examples on the real page with screenshots at 900 and 375 px (with Verify red, Hint target and focus ring), one short persona play check (fix by clear and by overwrite).

## Updated candidate list (PM, ordered, end of it11 scoping)
1. Pointing visuals v2: rings only on the digits that matter; a one-line key for the dashed and struck marks; badge in D's own note slot; avoid trivial confinements; clearer first-click case signal (B, C ranked it second in it11).
2. Tricky practice density: at least 2 pointing steps per Tricky puzzle (measure generation time first); Hint preferring pointing on Tricky (A ranked it second).
3. Slip follow-ups after #50/#51: judge an overwrite into a cell (B); say what "counted" means (A, B, C); a hint on how to get an uncounted entry counted (A, B, C, see D8); marker on entries made during a clash (A).
4. Small wording items: clash and non-technique texts share the "not counted" ending; re-entering a hint-credited cell says "on your own" while the count stays "with a hint"; the finish text "(see below)"; fold away the definitions once learned (C).
5. Claiming, then pairs, each with its level (ranked last by A, B and C for now: "recover from a mistake before learning something new", B).
6. Mobile layout (2x2 level buttons at 375 px; long messages on a phone), a middle hint level, progress across puzzles.

Not wanted: instant red on a wrong or clashing entry (it10); counting entries made during a clash (it11, D2).

## Acceptance of #50 (PR #52, head b45a64f)
Own detached worktree <scratchpad>/wt-50-pm at b45a64f. Not read: governance/LOG.md (never), work-log beyond this file (not needed).

### Per criterion (real page, Tricky seed 1, play tool pm-it11/play.js with WT=wt-50-pm; tester's ts50/pins.js)
1. PASS. r4c1=6 -> "... already in this cell's box, at row 5, column 3 ..."; r1c2=4 -> row, r1c1; r7c2=2 -> column, r2c2; r2c1=4 -> column (also in box), r1c1; r3c7=9 -> row (also in box), r3c9.
2. PASS. r4c1=6 then r7c2=6 -> text 1 (row, r7c8); r3c7=9 then r2c1=4 -> text 1 (column, r1c1).
3. PASS. r4c1=6, r7c2=9 -> text 2 naming r4c1/r5c3 box; counts stay 0. Column pair (r2c2/r7c2) and row pair (r3c7/r3c9) also named correctly on the page.
4. PASS. Page cases where P is a given (r2c2 before r7c2; r1c1 before r2c1) and column-vs-box / row-vs-box precedence correct. Unit tests cover row, column, box partners, column+box (column named), row+box (row named), first-holder-in-unit, box holder before column holder (column named).
5. PASS. r1c2=4 (three cells) adds the extra sentence to text 2 and to Hint; two-cell clashes do not.
6. PASS. Hint text 3 for r4c1/r5c3 and r1c1/r2c1 column; plain colour (class "", rgb(29,29,31) per pins), nothing highlighted (screenshot).
7. PASS. r7c2=9 after clearing -> "Well spotted! ... naked single"; r2c1=7 on fresh grid -> unchanged "not a naked single..." text.
8. PASS. Verify: only the player's 6 at r4c1 red, red message unchanged; overwrite r4c1 6->8 gives no message; Notes on: no new message; counts unchanged. Product diff touches only namedClash/firstHolder/cellName, hintFor conflict text, notCounted, Hint status class.
9. PASS. Tester's pins 7/7 at b45a64f, and I re-ran all 7 with my own play tool: exact text match.
10. PASS. README diff read sentence by sentence: Hint bullet, the three ordered not-counted texts, the named-clash definition, "not counted later either", summary sentence order, Files entries for namedClash and creditEntry. No contradiction found. Nit N3 (the named-clash definition repeats itself) stands; I agree with folding it into #51, which rewrites that section. Not a blocker: the sentence is accurate, only redundant.
11. PASS. `node --test` 143/143, 0.61 s. Assertions added inside existing tests (no new blocks); tests +40/-21 (net +19) vs product +41/-12 (net +29).

### Persona play on the product (b45a64f; prompt pm-it11/accept50-prompt.txt; play tool only, no scripts, solvers, source or README)
- A (5 runs): ship, yes. Named cells correct. r2c1=5 (clashes with r8c1 in the column and r1c3 in the box): the entry text named r8c1 (column first), and Hint named r1c3/r2c1 (box, because P = r1c3 comes first in reading order), which surprised A. A read the extra sentence as false and "pressed Verify for nothing".
- B (12 runs): ship, yes. Named cells correct. B says "Other numbers break the rules too" is false for r1c2=4 and "reads like a bug". B wants "and elsewhere" when an entry clashes in more than one unit, and says "change or clear one of them" cannot apply to a given. B confirmed on the page that counting resumes after the fix (r2c3=9, r1c9=1 counted on your own).
- C (10 runs): ship, yes. Named cells correct. Hint naming one pair at a time "hid the second clash" (the extra sentence warned). C confirmed that counting resumes after the fix (r1c9=1 hidden single on your own). C finds "stays uncounted" could be read as "never"; C asks for a retype tip (D8 stands); the text is long.

PM diagnosis of the "false" extra sentence (A, B): not a defect. I reproduced it on the page. r1c2=4 clashes with r1c1 (row) and with the given 4 at r6c2 (column), so three cells clash. r2c1=5 clashes with r8c1 and r1c3. The sentence is correct per spec (pinned example 5). The players miss it for two reasons. The third cell is a given, and Verify flags only the player's own values, so Verify shows nothing new. This is a real comprehension gap. The #51 outline (on every clashing cell, givens included) is the planned fix. I will check in #51 acceptance whether players still read the sentence as false once the outline shows.

### Decision: ACCEPTED (#50, PR #52, head b45a64f)
Criteria 1-11 pass, and personas 3/3 say ship. The open points are wording and visibility, not defects. N3 goes to #51, as the lead proposes.

### New candidates (added to item 3, slip follow-ups)
- Extra sentence wording: name the extra clash or say it involves a given (e.g. "row 1, column 2 also clashes elsewhere"); re-test after #51's outline first (A, B).
- An entry clashing in two units: text 1 names only the first unit; say "and elsewhere" (B). Text 1 and Hint can name different pairs for the same slip (A).
- When one of the pair is a given, say "clear your own number" rather than "change or clear one of them" (B).
- Counting-resumes wording: "stays uncounted" read as "never" (C); retype tip (C, again; D8 stands for now).
- Verify does not name cells (C).

## Acceptance of #51 (PR #53, head ab7f260)
Own detached worktree <scratchpad>/wt-51-pm at ab7f260 (product code unchanged since 4afbc19). Not read: governance/LOG.md (never), work-log beyond this file (not needed).
Tools: my play tool pm-it11/play.js (WT=wt-51-pm; PERSONA=1 hides the CLASH line for personas), tester's ts51/steps.js, pins51.js, suite51.js, shots51.js (my screenshots: <scratchpad>/pm-it11/acc51/).

### Per criterion (real page)
1. PASS. r4c1=6 -> outline r4c1, r5c3 (given); r1c2=4 -> r1c1, r1c2, r6c2 (two givens); r9c1=1 during another clash -> four cells; Medium seed 2 r1c1=5, r1c2=5 -> both own cells. No other cell outlined.
2. PASS. Trace r4c1=6, r7c2=9, Notes on, note in r4c3, Notes off, focus, ArrowRight, ArrowDown, Verify, Hint, Hint, another entry: outline r4c1, r5c3 at every step; Verify red on r4c1 only, cleared by Hint, outline kept.
3. PASS. Clear r4c1 or overwrite with 8 -> no outline; r4c1=6, r1c2=4, clear r4c1 -> r1c1, r1c2, r6c2 remain (only r4c1, r5c3 lose it).
4. PASS. New puzzle and level:medium after a clash -> no outline, blank message.
5. PASS. Screenshots at 900 and 375 (alone, focus, Verify red + focus, multi, Hint click, simulated Hint target + pointing marks): dashed orange visible on givens and own blue digits, over the red fill and inside the blue focus ring; distinct from amber target and dashed purple confined cells. The Hint-target combination can only be simulated (Hint marks nothing during a clash); accepted, as the README says.
6. PASS. ", clashes" on editable outlined cells only (r4c1; not on given r5c3); removed with the outline. Suite c6 checks (notes kept, suffix after notes) pass.
7. PASS. Fixed message on clear and on overwrite, plain; blank while a clash remains; completion wins on a fill (suite c7a/c7b); replaced by next value change, Verify, Hint.
8. PASS. All 7 pinned examples re-run with my own play tool: outlines and texts match exactly; tester's pins51 7/7 at ab7f260.
9. PASS. README diff read sentence by sentence: Verify bullet notes givens are outlined; clash text "not turned red ... outlined in orange"; "only live mark"; Hint never clears the outline; full-grid text; "Apart from these messages and the orange clash outline there is no live checking; red flags appear only after Verify"; new "Clash outline" and "Clash fixed" bullets; Files entries for td.clash, clashCells, fixedMessage. N3 from #50 folded (the redundant parenthesis removed). No contradiction found.
10. PASS. `node --test` 147/147 (0.6 s); unit tests for clashCells (clean, two-cell incl. given, three-cell) and fixedMessage (clear, overwrite, clash remains, no clash before, entry into empty cell, fill decided by completionFor). Tester's page suite suite51 re-run by me: 106/106.

### PM play-through
Tricky seed 1: slip r4c1=6 (outline on both 6s), r7c2=9 (not counted, outline stays), clear r4c1 -> "No numbers break the rules now. New entries are counted again.", then r1c9=1 -> "Well spotted! ... hidden single ... on your own", hidden single count 1. Hint then works normally. Medium seed 2: own-vs-own clash r1c1=5/r1c2=5, Verify reds both, overwrite r1c2=7 -> fixed message at 375 px. Matches the issue.

### Persona play on the product (ab7f260; prompt pm-it11/accept51-prompt.txt; play tool with PERSONA=1 so the outline is judged from screenshots only; no scripts, solvers, source or README)
- A (about 10 runs): ship, yes. 5 at r1c2 outlined r1c2, r1c3 (row) and r4c2 (column); the r4c2 mark makes "Other numbers break the rules too" true, and A can see which cell. A did not find it false anywhere. The dashed orange is distinct from the red Verify fill, which stacks on it. A says the fixed message did not show after an overwrite with 7. I could not reproduce this: r1c2=5 then r1c2=7 (also with Hint or Verify in between) shows the fixed message on the page. Most likely A typed 7 into another cell. Not a defect. The "Error: given" A hit is my play tool refusing to type into a given (by design).
- B (about 10 runs): ship, yes. Every mark was correct, givens included (r1c1, r6c2, r8c1, r3c8). The extra sentence read as true in every run and dropped out when only the named pair was left. The next correct entry after the fix counted ("Hidden single: 1 on your own"). Gap: the text names the row pair while the grid also marks the column partner r6c2.
- C (about 10 runs): ship, yes. Marks accurate. With the outline showing, "click Verify to see which" feels redundant. After a partial fix (one of two slips cleared) the message line goes blank while a mark remains, which is "a little confusing".
- None of the three could compare the outline with the amber Hint target in play. This is expected: Hint marks nothing during a clash. The simulated screenshot covers criterion 5.

The #50 gap is closed. In #50 acceptance, A and B read "Other numbers break the rules too" as false because the third cell was a given. With the outline, all three now see the third cell (r6c2 or r4c2), and none read the sentence as false. Remaining wording points: it points to Verify, which does not flag givens (C, redundant); it does not say the extra cell is a given (C, A).

### Decision: ACCEPTED (#51, PR #53, head ab7f260)
Criteria 1-10 pass on the real page. Pins match exactly, the suite gives 106/106 and the unit tests 147/147. Personas 3/3 say ship, and no defect was found. A's overwrite observation did not reproduce. Not merged by me (the lead merges).

## Updated candidate list (PM, ordered, end of iteration 11)
Iteration 11 shipped slip recovery: #50 (clashing cells named in the entry text and in Hint, Hint during a clash in plain text) and #51 (dashed orange outline on every clashing cell while the clash lasts, givens included; "No numbers break the rules now. New entries are counted again." on the fix). Red stays Verify-only.
1. Pointing visuals v2: rings only on the digits that matter; a one-line key for the dashed and struck marks; badge in D's own note slot; avoid trivial confinements; clearer first-click case signal. Ranked second by B and C in it11; it is next now that slip recovery has shipped.
2. Tricky practice density: at least 2 pointing steps per Tricky puzzle (measure generation time first); Hint preferring pointing on Tricky (A ranked it second).
3. Slip follow-ups (small, wording-led; can ride along with 1 or 2):
   a. Extra-clash sentence: now that the outline shows every clashing cell, replace "click Verify to see which" (Verify does not flag givens) with wording that points at the outlined cells or says the extra cell is a given (A, B, C across #50 and #51).
   b. Partial fix: after fixing one of two clashes the message goes blank while outlines remain; consider "Some numbers still break the rules (outlined)" (B, C).
   c. An entry clashing in two units: text 1 names only the first unit (B); text 1 and Hint can name different pairs for the same slip (A).
   d. When one of the named pair is a given, say "clear your own number" rather than "change or clear one of them" (B).
   e. Judge an overwrite into a cell (B); say what "counted" means and that "stays uncounted" is not "never" (A, B, C); retype tip (C; D8 stands for now: overpromises and invites count farming).
   f. Marker on entries made during a clash; credit a correct entry made during a clash after the fix (A, B; D2/D6 stand: not retroactive).
   g. Hint names only one clashing pair at a time (A, B, C); Verify does not name cells (C).
4. Small wording items: clash and non-technique texts share the "not counted" ending; re-entering a hint-credited cell says "on your own" while the count stays "with a hint"; the finish text "(see below)"; fold away the definitions once learned (C).
5. Claiming, then pairs, each with its level (ranked last by A, B and C for now: "recover from a mistake before learning something new", B).
6. Mobile layout (2x2 level buttons at 375 px; long messages on a phone, the after-slip text runs to about 6 lines), a middle hint level, progress across puzzles.

Not wanted: instant red on a wrong or clashing entry (it10); counting entries made during a clash (it11, D2); retroactive counting after a fix (D6).
