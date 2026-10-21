# Work Log: Iteration 18 (product manager)

- PM: weaver-agents product-manager agent (Claude Opus 5.5, claude-opus-5-5)
- Run type: scope the next iteration (review state, raise issues in priority order)
- Baseline: main 7fdc9a2 (last product change 3d831d1). Ratio 1.600x (2110/1319), headroom 0.
- Inputs read: memory/wip/current.md, memory/wiki/{index,backlog,product,lessons}.md, governance/context/*.md (strategy unchanged), work-log/iteration-17-product.md (needed for the it17 measurements and persona evidence; 178 lines, see note below), index.html, style.css. governance/LOG.md not read.
- Scratch: $WEAVER_SCRATCHPAD/pm-it18/ (session tmp, not committed).

## Status check (2026-10-22)
- Fresh start: no open issues or PRs; WIP says iteration 17 closed, it18 scoping not started. No it18 product log existed.

## Direction
- Backlog top: Mobile. Board and explanation not visible together on a phone (3/3 at #77 acceptance), button row wraps at 375/360 (New puzzle clipped at 360x800), ring discovery cue (3/4/3).
- Hypothesis H1 (from style.css): `#sudoku td` has a fixed height of 56 px while the width shrinks to about 36 px at 375 px, so cells are 36 x 58 and the grid is about 564 px tall. Square cells at narrow widths would save about 200 px and could bring the explanation next to the board.
- Hypothesis H2: smaller button padding below 560 px keeps the four buttons on one row (removes the New puzzle mis-tap/clip).

## Evidence
### Spike 1 (assistant; $WEAVER_SCRATCHPAD/pm-it18/measure.js, results.json, shots/). Tricky seed 1 (S, naked form) and seed 8 (S8, hidden form), Hint twice; injected CSS.
- V0 today, 375x812: grid 96-660 (cells 38 x 58), buttons 2 rows to 805.6, status 821.6-1010.6: explanation fully below the fold (miss 198.6). 360x740 miss 270.6; 390x664 miss 346.6. Desktop 58x58 cells.
- V1 square cells below 560 px (`aspect-ratio` ignored on td; calc width/height from 100vw works; 360 px floors at 36 px high): grid 96-481 at 375, status miss 19.5.
- V2 = V1 + one button row (padding 0.5rem, only value that fits at 360): status fully visible at 375x812 (S and S8). 360x740 miss 46.8; 390x664 miss 147.8.
- V3 = V2 + top alignment + h1 margin: 8 px more. Desktop unchanged (page taller than 900 anyway).
- Defect found: with square cells the pointing chips in the top slots (1-3) stick out 3.6 px above the cell, bottom slots (7-9) 1.6 px below.
### Persona round 1 (user-a/b/c; A = V0, B = V3; screenshots; brief pm-it18/persona/brief.md)
- Board + explanation together, 375x812: A 1/1/1, B 5/4/4; 390x664: A 1/1/1, B 2/2/2; S8 375: A 1/1/1, B 4/4/4.
- Readability of digits/notes/chips: A 3/4/4, B 3/3/3. Buttons thumb-safe: A 4/3/4, B 3/3/3 (four tight buttons in one row: concern 3/3).
- Preference B 3/3. Clipped top-row chips named 3/3. Dead space between link line and buttons named 2/3.
- Learning rank (1 = most) a/b/c: S reveal steps 1/3/1; R compact top 2/4/3; P shorter step 3 4/1/4; Q tap cue 3/2/2. Note: b ranks P first ("step 3 is wordy").
### Spike 2 (assistant; measure2.js, results2.json, shots2/)
- V4 = square cells + top alignment + New puzzle moved next to "Difficulty: ..." (all widths; small button 0.85rem) + Verify/Hint/Notes padding 0.4rem 1rem: one row at 360-390 and 1280. Gaps 4.2 px (space separator). 375x812 status fully visible.
- V5 = V4 + compact top (h1 1.4rem, caption 0.8rem, level margin): +23 px. 360x740: S miss 24 (7/9 lines), S8 miss 3 (7/8). 390x664 still 3/9 lines. Caption stays 2 lines at 0.8rem.
- V6 = V5 + chips flush to the top/bottom inner edge for 1-3/7-9 below 560 px: all digits 1-9 inside the cell at 360 and 375 (within 0.5 px rounding).
- Link line reserve (4lh = 64 px) leaves 32 px blank under the 2-line invitation at 375/390 (16 px at 360). Kept: it exists for the 4-line R3 sentence at 360 (#76 decision B2).
### Persona round 2 (B1 = four-button row vs C = V6; brief pm-it18/persona2/brief.md)
- Thumb safety: B1 2/2/2, C1 4/4/4. New puzzle at the top: findable 4/4/4, accidental new puzzle less likely yes/yes/yes. Preference C 3/3.
- Steps checkable without scrolling: C1 4/4/4, C2 (360x740) 3/3/2 (end of step 3 below the fold).
- Chips in the zoom 3/4/3.5: inside the cells, no border crossing. The overlaps they named were on chips I injected on GIVEN cells (9, 6) for the zoom; real chips only sit on empty cells. Dismissed as a mock-up artefact; the AC tests chip-in-cell, not overlap with values.
- Other: b wants > 8 px between buttons; New puzzle small/plain (b, c); no confirmation for New puzzle (c, backlog); invitation wording jargon-heavy, "7-9" splitting (c, backlog: non-breaking ranges); target cell shows a caret line (b, c; pre-existing focus caret, watch).

## Decisions
- D1 Scope: three small CSS/markup issues, in sequence, all serving the top backlog item (board and explanation together on a phone):
  1. Square cells on phones with chips kept inside the cell (largest gain: ~180 px; fixes the chip defect it would create).
  2. New puzzle beside the difficulty line; Verify/Hint/Notes on one row with real gaps; top alignment (thumb safety 2 -> 4, removes the wrap and the 360x800 clip).
  3. Compact top on phones (23 px; brings 360x740 nearly to full explanation). Lowest gain, last; can be dropped if the ratio blocks it.
- D2 Not this iteration: reveal steps one at a time (S, ranked first by 2/3 in it18 round 1, 3/2/2 in it17; needs a design spike: candidate it19 lead item); shorter step 3 (P); ring tap cue (Q); invitation wording; New puzzle confirmation.
- D3 Link reserve stays 4 lines (#76 B2). Accept the 32 px blank at 375/390.
- D4 Short screens (390x664) remain partial (3 of 9 lines after all three issues). Accepted for now; the further fix is layout-level (explanation beside or above the buttons) or tap-to-reveal, backlog.

## Assumptions / concerns
- A1 Headless Chrome mobile emulation only; no real Safari/Android.
- A2 `#level` is set with textContent in `choose`, so the developer must keep New puzzle in its own element (not inside the text node it overwrites).
- A3 Ratio headroom 0: each issue earns 1.6 test lines per product line; page assertions should extend existing tests (f1e and the 375 px badge tests).
- A4 The 375 px badge geometry tests pin chips at slot centres; issue 1 deliberately changes 1-3/7-9 to flush top/bottom below 560 px, so those pins change by design.

## Issues (priority order; deliver in sequence)
1. #83 Phone layout: square grid cells below 560 px, with pointing chips kept inside the cell. 9 ACs. https://github.com/dirkmarski/weaver/issues/83
2. #84 Phone layout: New puzzle beside the difficulty, Verify/Hint/Notes on one row, page aligned to the top. 9 ACs. https://github.com/dirkmarski/weaver/issues/84
3. #85 Phone layout: compact page top below 560 px so the explanation fits on short screens. 8 ACs. https://github.com/dirkmarski/weaver/issues/85
- Expected product delta about 9-17 lines in total; each issue pays its own test lines.
- Acceptance plan: per issue, real-input page check (CDP touch at 360/375/390 mobile, mouse at 1280), my own measurements against the ACs, and a persona round on real screenshots for #84 and #85 (AC7/AC6). #83 persona check folded into #84's round unless the chips look wrong.
- Feasibility basis: every numeric AC was measured in spike 1/2 (the #85 AC2 seed 8 case was 3 px short in the mock-up; a means to close it is suggested and the issue says to ask the PM before cutting).

## Candidate list (PM, ordered, after it18 scoping)
1. This iteration: #83, #84, #85.
2. Explanation depth (likely it19 lead item): reveal steps one at a time ("show me why"; it18 rank 1/3/1, it17 3/2/2; needs a design spike, also helps short screens); shorter naked step 3 (b rank 1; "has every digit except" -> "sees"); ring tap cue before reading the line (2/2/3 in it18 ranks, discover 3/4/3 in it17); invitation wording (jargon "ring", "solid purple"; wordy); non-breaking spaces in "row N", "7-9" ranges; conclusion line set apart; then the rest of the it17 list (minimal rings, first-click signal, "same D as before", box-case wording, keyboard reach for given rings, watch items, key line names the ruled badge).
3. Mobile remainder: short screens (390x664 shows 3/9 lines after this iteration: explanation beside/above the buttons or tap-to-reveal); 32 px blank in the link reserve at 375/390; New puzzle confirmation (c); caret line in the target cell (b, c); F2 notes contrast in hatched cells; struck grey vs purple on tinted cells; soft keyboard on hatched-cell tap; 320 px out of scope.
4. Pointing reach (watch), slip follow-ups (it11), small wording items, long-term: unchanged from memory/wiki/backlog.md.

## Notes for the closing lead (memory)
- I needed the it17 product log (178 lines) for prior layout figures and persona scores; the wiki backlog had the items but not the numbers. Suggest: keep a short "mobile layout facts" block (key positions at 375x812/360x740, cell size, link reserve) in wiki/product.md so scoping does not need the work log.
- This log is uncommitted on main's working tree; the lead should carry it on the iteration/issue branch (lesson: one branch line per log file).
