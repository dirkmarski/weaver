# Iteration 26: product log (PM)

PM session 8dc2d34a-b5fc-44f3-9327-5bb6bd0c4608: scoping run, 2026-11-02. Basis: main 7c537e5 (code as 91fdf71, plus Dirk's governance update).

## Status
- 2026-11-02 scoping started. Requests: none Answered for the PM (001-005 all Closed). No open GitHub issues.
- 2026-11-02 scoping done. Issue #135 raised (single issue this iteration). Spec branch `issue-135-why-step-3` pushed (6186ae6, off main 7c537e5): red 10/10 (9 on assertions, 1 on the undefined step "the level is Tough"). No requests raised.

## Direction
- New governance (7c537e5): `technology-options.md` offers a local Ollama service (installed models only, no setup changes). Assumption A1: not used in the product this iteration: the product is a static page on GitHub Pages, so players cannot reach a local service, and ADR 002 asks for Node built-ins only. Kept as a team-tooling option (e.g. a readability pre-check of message texts) if a need appears.
- Theme: backlog items 1 + 2 together: the pointing/claiming explanation says why the unit's other cells are out. The room question is answered by measurement, not by a separate room issue: the final wording keeps every measured case inside 360x740 (D4).

## Evidence
- Spike round 1 (scratch `pm-it26/spike/`, briefs `pm-it26/brief-spike*.md`): census of 258 hidden-form pointing/claiming explanations (walk = hint fills, Tricky 1-80, Tough 1-40); a "why" clause grouping the reason cells by the row/column/box holding D is always true and non-empty (0 false). Round-1 wording "In row 5, row 5, column 5 is struck, ..." repeats the unit; adds 1-2 lines at 360x740.
- Spike round 2: G = room only (drop step-1 "(the box has no other empty cells)", shorter pointing step 2), F = G + "In U, apart from the struck cell, <units> already have a D, so D must go in rc." G never adds lines (d4 10 -> 8, grid top 41.8); F max 9 lines on hidden forms, grid top >= 5.8 everywhere.
- Personas round 1 (blind, real 360x740 shots; key in `pm-it26/persona-key.md`):
  - A vs G (d4): A preferred 3/3; "understand why" A 4/4/4 vs G 3/3/3 (all three missed the parenthetical); comfort G 4/4/4 vs A 3/3/4. One flagged G's step 2 wrapping "column 2: / not in rows" as reading like a step number. -> G rejected.
  - F vs G (d4, t8s3): "step 3 says why" F 5/4/5 and 5/4/5 vs G 2/2/2 both; "learn for next time" F 4/4/4 vs 2/2/2; length fine F 4/3/3 vs 5/4/4. Prefer F 6/6. Confusion 3/3: "apart from the struck cell"; "struck" jargon (2/3). (user-a swapped P/Q labels in pair 2; scored by content.)

## Decisions
- D1 Keep the step-1 parenthetical and pointing step 2 as they are (G rejected by personas). Room comes from the step-3 wording itself, gated on layout, not from cuts elsewhere.
- D2 The struck cells are referred to as "step 2 rules out one cell" instead of "apart from the struck cell" (3/3 confusion); fallback "step 2 rules out the other empty cell / every other empty cell" when no hatched cell (21/258).
- D3 Own-reward hidden forms (backlog item 1, second half) are NOT in this iteration: ship the hint first, gather feedback, then reuse the wording (agile; the reward has no step numbers, so it needs its own wording round).
- Spike round 3 (H: "step 2 rules out one cell and <units> already have"): layout passes (max 10 lines, grid top >= 5.8), but "and" piles up ("one cell and column 8 and the ... box").
- Personas round 2 (text A/B, 3 positions): semicolon + "So" form N preferred 9/9, first-read ease N 4/4/5 x3 = 4.44 vs M 1.89. "step 2 rules out one cell" makes the cell "partly" clear 3/3; all three suggested "crossed out" (matches the grey mark) -> adopted.
- Spike round 4 (final N, `spike/vtext4.js`, `trees/N`): census 0 false/empty; two unit groups always = one box + one line type (55/258), so the box-first order never doubles "and"; no U without a struck cell; box U never has row + column groups. Layout 15 cases x 3 viewports: 360x740 max 10 lines, min grid top 5.8, reserve bottom <= 738.5; 375x812 max reserve bottom 810.6 (1.4 px spare in 3 ten-line cases); 1280x900 line counts as main (max 7). 0 console errors.
- Spec check: `spike/pm-verify.mjs <feature>`: all 10 expected texts equal the reference at zero counts (ok 10, bad 0). Red run on main: 10/10 fail (9 assertions, 1 undefined Tough step).

## Decisions (continued)
- D4 No separate room issue: the final step-3 wording keeps every measured worst case within today's limits at 360x740 (grid top >= 5.8, reserve bottom <= 740). This is the hard gate in #135 AC4.
- D5 Final step-3 wording N (see #135 "Behaviour"); struck part counts struck cells inside U only; reasons grouped box first, then rows, then columns; fallbacks for an all-struck unit.
- D6 Spec: `specs/hints/pointing-hidden-unit.feature` rewritten (keeps @issue-111 @issue-128, adds @issue-135): its 3 old positions get the new step 3, plus 6 new positions incl. both fallbacks and n = 2, and a claiming whole-explanation scenario on Tough (needs the level step to accept Tough).
- D7 One issue only this iteration: it touches hints, README, unit tests and the ratio (about 5 lines headroom); a second behaviour issue would compete for the same headroom. Small and testable with personas at acceptance.

## Assumptions, concerns, ambiguities
- A1 (above) Ollama not used in the product.
- A2 Persona text A/B round 2 was text-only (no screenshots); the layout was measured separately. Acceptance (#135 AC6) re-checks on real screenshots, blind vs main.
- C1 "step 2 crossed out one cell" while step 2 lists more cells (some outside U; e.g. row case: step 2 lists two, step 3 says one). Personas may try to match the numbers; ask at acceptance.
- C2 375x812: 1.4 px spare under the reserve in three 10-line cases (lesson: content flush with an edge can read as clipped). Hard gate holds; watch at acceptance.
- C3 Step 2 still says "(struck)" while step 3 says "crossed out" (two words for one mark). Accepted for now; step-2 wording is backlog item 5.
- C4 Running `node --test spec-implementation/specs.test.js` (also with a name pattern) did not exit within 90-120 s on this machine although the tests had finished; no process or port 8000 left afterwards. Flag for the lead/tester to check.

## Issues (iteration 26, in order)
1. #135 Hint step 3 says why the unit's other cells are out (hidden form, pointing and claiming). Spec branch `issue-135-why-step-3`.

## Backlog (PM, after it26 scoping)
1. Own pointing/claiming rewards, hidden form: say why the unit's other cells are out (reuse the #135 wording without step numbers; needs its own wording round; longest reward 6 lines, 45.5 px spare at 360x740). Next, after #135 feedback.
2. Message density remainder: coordinates "row N, column M" slow readers (3/3 at #128); step 2 "(struck)" vs step 3 "crossed out" (C3); stage-3 phone view (title scrolls off).
3-10. As `memory/wiki/backlog.md` items 3-10 (unchanged).
Tech debt carried: `creditEntry` hint match for a row or column alone still untested (deferred again, D7 ratio).
