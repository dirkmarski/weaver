# Work Log: Iteration 9 (product manager)

- Product manager: weaver-agents (product-manager agent, Claude Opus 5.5), session `48eaa449-33cf-461f-85bc-196e8d61fc39`
- Run type: "Deliver the next iteration" (scoping run)
- Branch: `iteration-9` (worktree scratchpad/wt-iteration-9)
- Lead work log: `work-log/iteration-9.md`

## Status
- [x] Context read: product strategy (unchanged), test strategy (unchanged), development practices (unchanged), memory-architecture.md (new: work log is the audit trail), iteration 8 PM log incl. end-of-iteration candidates, lead's iteration 9 log, README, credit/tally/completion code.
- [x] `governance/LOG.md` NOT read (as instructed).
- [x] Spike: how often own pointing recognition would fire (Tricky, 10 seeds).
- [x] Persona feedback on wording options (tally line, finish text, "not counted" text).
- [x] Scope decided.
- [x] Issues raised: #42 (label enhancement). Body: scratchpad/pm-proto9/issue-count-pointing.md.
- [x] Log committed and pushed.

## Starting point (2026-10-20)
Iteration 8 closed (#35, #36, #37 merged); no open issues or PRs. iteration-9 branch at a348fb0 (lead opened its log).
Product: sudoku.js 867 lines, index.html 38. Pointing is taught by Hint (#36) and has its own level Tricky (#37), but it is never counted: the hinted pointing entry shows "Well done!" with no count, an own pointing entry gets "not counted", and the finish text says "Singles applied". 5/5 persona sessions in iteration 8 named this as their top issue.

## Progress
- 2026-10-20: context read; log opened.
- 2026-10-20: spike (scratchpad/pm-proto9/spike.js; Tricky seeds 1-10, follow Hint; at each pointing wall count the (cell, digit) pairs that are not a single but become one after ONE pointing step, naked or hidden form). Result: 12 walls, 1-3 such pairs per wall (20 in total), all 20 equal the solution digit; the hint target was such a pair at 12/12 walls. Conclusion: "own pointing" recognition (one pointing step, then the entry is a single) is tight, not generous, and is consistent with what Hint teaches. 10 seeds only, by design (proportionate; not an oracle).
- 2026-10-20: wording mock-up for personas (scratchpad/pm-proto9/mock.md): Pointing tally line and definition (P1/P2), show on all levels or Tricky/Hard only, finish text (F1/F2/F3), "not counted" text (N1/N2), own-pointing reward text. Sent to A, B and C (read-only, no code).
- 2026-10-20: persona A (mock-up only): P2 (says why it matters); Pointing line on every level; F3 (sees each technique; F1 "too vague"); N1 (concrete; N2 "vague and discouraging"); own reward feels good, but wants what the pointing was ("the 7 in box 1 was confined to row 3") and a running count.
- 2026-10-20: persona C (mock-up only): P2; every level, but would hide the line until pointing is used once (no "0 and 0" on Easy); F1 (F3 "too much to take in", F2 "fussy"); N1 (N2 sounds like "my move was wrong or random"); own reward good, wants why it worked and the cell highlighted. C noticed my mock-up numbers did not add up (15+26+3 = 44, not 40): my error in the mock-up, no effect on the options.
- 2026-10-20: persona B (mock-up only): "fixes the dismissive feel"; every level, always shown ("a line that appears mid-game feels like a surprise; always there tells a beginner what to look for"); P2 trimmed; F1 as base (per-technique counts are already in the block), F2 if one must be exact; N2 (N1 "reads like a checklist I failed"); the own reward must name the elimination ("that is the lesson") and the count must visibly go up.

## Decision: iteration 9 scope (2026-10-20)
ONE issue: **Count pointing** (candidate 1, 5/5 personas in iteration 8, confirmed by A, B, C today). Small increment; everything else in the candidate list depends on it or is independent and can follow.
Product decisions (from the persona round; I decide where they split):
- Pointing is counted like the singles: "with a hint" when the showing pointing hint's digit is entered in its target; "on your own" when an entry is not a naked or hidden single but becomes one after ONE pointing step (naked or hidden form, as Hint teaches; spike: tight, always correct). Order: naked > hidden > pointing. Same credited-cell rule (one count per cell per puzzle).
- Tally: third line "Pointing: N on your own, M with a hint" + grey definition (P2, trimmed as B proposed). Shown on EVERY level, always (B's reason wins over A/C's "hide until used": a line that appears mid-game is a surprise and an always-present line tells a learner what to look for; simplest too). Concern noted: C dislikes "0 and 0" on Easy; check at acceptance.
- Own reward names the step (A, B, C all asked): "Well spotted! You applied pointing on your own: in the box of rows R1-R2 and columns C1-C2, the digit D fits only in row L, so row R, column C is V." When several steps qualify, the first in findPointing order (boxes in reading order, digits 1-9). The hinted "Well done! You applied pointing: ..." text stays as is (the explanation was on screen already).
- Finish text F1: "Puzzle solved! Techniques applied: O on your own, H with a hint." (B, C; A wanted F3 but per-technique counts are in the block right below; F3 too dense for C.)
- "Not counted" text N1 with "a pointing step" (A, C; B preferred N2): "... It was not a naked single, a hidden single or a pointing step at this point, so it is not counted." B's "may still be correct" NOT added: the app deliberately never says whether a digit is right (#31).
- preferredTechnique is unchanged (pointing counts do not change which single Hint teaches).
- Carry-forward folded in: creditEntry returns a `kind` and the status class is chosen from it (no regex on the wording), with a unit test.
Not chosen now: cell highlighting on the own reward (C), pointing hint visuals (candidate 2), Tricky practice density (candidate 3), uncounted-entry feedback v2, claiming/pairs, mobile layout.

## Assumptions
- Persona feedback on a text mock-up is enough to fix the wording. Acceptance play checks the wording in context.
- "One pointing step, then a single" is what a learner can reasonably find alone. Chained steps are not credited (they get "not counted"). This is accepted for now.
- An always-visible "Pointing: 0 on your own, 0 with a hint" line on Easy does no harm (C disagrees mildly). I check this at acceptance with a glance at Easy.

## Concerns
- Own recognition adds a per-entry search over boxes x digits. That is cheap (81 x 9 cells), but the reviewer should check that it reuses findPointing/pointingTarget logic and does not duplicate it (development practices: keep the code concise).
- README is long; the change touches about 6 paragraphs. The reviewer and I both check that the changed sentences are true.
- The personas are LLM simulations, not real users.

## Progress (cont.)
- 2026-10-20: issue #42 created: "Count pointing: with a hint and on your own, in the tally and the finish text". The first version lacked the hidden-form own example in criterion 2 (my edit script missed). I fixed it with `gh issue edit` straight away: seed 3 wall, r5c5 = 1, text pinned. The golden-path numbers come from the PM tool scratchpad/pm-proto9/wall.js (seed 1 hint 13 naked r3c3 = 7, box rows 7-9 x columns 1-3, digit 1, column 3; seed 3 hint 20 hidden r5c5 = 1, same box, digit 1, row 9). The finish total of 54 for seed 1 comes from the iteration-8 acceptance.
- Order: #42 only (single-issue iteration).
- Acceptance approach (per test strategy): criteria 1-9 one by one; my own short play-through on seeds 1 and 3 Tricky (hinted and own, both forms, a "not counted" entry, re-entry, finish text) with a rebuilt minimal play tool; read the changed README sentences; check that the suite is fast and has no sweeps; personas B and C on Tricky (own pointing, then the finish), plus a glance at Easy for the three-line block. No PM oracles.
- Next PM step: acceptance of #42 once it is delivered.

## Next-iteration candidates (ordered, after scoping iteration 9)
1. Pointing hint visuals: mark the confined box cells and the removed cells; rings only on relevant digits; tint the unit in the hidden form; avoid trivial confinements. Possibly also highlight the cell on an own reward (C).
2. Tricky practice density: at least 2 pointing steps per Tricky puzzle (now that repetition is rewarded).
3. Uncounted-entry feedback v2 (B: N1 "reads like a checklist I failed"; B wants "may still be correct", which conflicts with #31's no-correctness rule. Revisit).
4. Claiming, then pairs, each with its level.
5. Mobile layout (2x2 level buttons, status layout; the tally block now has three lines); middle hint level; unit wording; progress across puzzles.

## Acceptance of #42 (PR #43, head b7d8aea), run started 2026-10-20
- Asked by the lead (session 48eaa449-33cf-461f-85bc-196e8d61fc39). Delivery: developer 2 rounds, review APPROVE x2, test PASS x2, suite 143/143.
- Detached worktree scratchpad/pm-42 at b7d8aea. PM play tool: scratchpad/pm-play42/play.js (replays a session's moves on the real page in headless Chrome, seeded Math.random; prints board, status, tally). Navigation to the walls uses `hintFor` from the delivered sudoku.js (pm-play42/steps.js), only to know which cells to type; no oracle.
- Suite re-run by PM: 143/143, 0.61 s.

### Criteria, checked one by one by the PM (real page, headless Chrome, seeded)
1. PASS. Seed 1, following the page's Hint: hint 13 is pointing (naked form) at r3c3; entering 7 shows "Well done! You applied pointing: row 3, column 3 is 7." and Pointing "0 on your own, 1 with a hint". Seed 3 hint 20 (hidden form, r5c5 = 1): same, explanation "...only cell in its column where 1 fits".
2. PASS. Seed 1 wall (my own 12 singles, no hint): 7 at r3c3 shows the pinned own text byte for byte, Pointing "1 on your own, 0 with a hint". Seed 3 wall: 1 at r5c5 shows the pinned hidden-form text, Pointing 1/0.
3. PASS. Wrong digit 4 at the seed 1 wall gives the new text (a), neutral, no count change. Precedence, chained steps and conflict are covered by targeted unit tests on hand-built grids (precedence test: findPointing reaches the same digit, classifyEntry still says naked/hidden). Conflict (b) on the real page was checked by the tester; not repeated.
4. PASS. Clear + re-enter at r3c3 (seed 1) and r5c5 (seed 3): own text shown again, Pointing stays 1. Single counts behave as before (12 own singles counted on the way to the wall).
5. PASS. Easy, Medium, Tricky and Hard: three lines at 0 with three grey definitions, on a fresh level.
6. PASS. Seed 1 Tricky, page Hint followed for all 54 cells: "Puzzle solved! Techniques applied: 0 on your own, 54 with a hint." Block: Naked 0/30, Hidden 0/23, Pointing 0/1.
7. PASS. Unit test covers reward / notCounted / '' and statusClass. On the page: own pointing reward class ok, colour rgb(26,127,55); text (a) no class, rgb(29,29,31).
8. PASS. README word diff read: Pointing section (hinted count, own recognition and message), "not counted" (a), credited-cell rule incl. pointing, tally block (three lines, every level, pointing definition, six counts), finish text and O/H sums, API list (classifyEntry pointing result, emptyTally, creditEntry kind, statusClass, tallyLines, TECHNIQUE_DEFINITIONS). Every changed sentence matches what I saw in play.
9. PASS. 143/143 in 0.61 s. New tests are targeted (fixed seeds 1 and 3, hand-built grids). No new sweeps or oracles. The seed 1-6 loop at tests line 541 predates this PR (iteration 8). The PR body lists rule -> test (full map in work-log/issue-42-count-pointing.md).
- Behaviour the lead flagged, reproduced: clear a hint-credited pointing cell (seed 3 r5c5) and re-enter 1. The message says "Well spotted! ... on your own" while the block still shows Pointing "0 on your own, 1 with a hint". This is consistent with the credited-cell rule and the README (the same already happens for singles), so it is not a defect. Small wording mismatch, noted as a candidate.
- PM navigation note: my first navigation used `hintFor(g, 2)` without the page's preferred technique, so one step differed from the page's Hint (an own naked single was counted). The page-Hint run (`follow`) was used for criteria 1 and 6.

### Persona sessions (play tool only; sessions prepared by the PM: seed 1 Tricky at the pointing wall with 12 own singles, the same puzzle with 2 cells left, and a fresh Easy game)
- Persona C: the own-pointing message explains why it worked, and the count going 0 -> 1 was visible. The finish "Puzzle solved! Techniques applied: 14 on your own, 40 with a hint." is easy to take in, and the block gives the breakdown. Pointing line on Easy: "doesn't bother me", keep it always shown (weak, 2/5). C now says the grey definitions are more noise than the 0 line. Confusing: the first pointing hint names the pointing digit (1) and the target cell, but the cell takes 7. C typed 1 there and got "not counted" with no clue. Top wish: the hint names the pointing digit and the answer digit separately. C also wants a wrong entry to be called wrong (conflicts with the #31 no-correctness rule; same as B's earlier wish). No defect found against #42.
