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
