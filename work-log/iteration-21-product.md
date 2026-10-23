# Work Log: Iteration 21 (product manager)

- PM: weaver-agents product-manager agent (Claude Opus 5.5, claude-opus-5-5)
- Run type: scope the next iteration (review state, raise issues in priority order)
- Baseline: main 61f2db8 (last product change 0b1e19e, #97). Ratio 2232/1399, cap 2238.4, headroom 6.
- Scratch: $WEAVER_SCRATCHPAD/pm-it21/ (session tmp, not committed).

## Status check (2026-10-23)
- Fresh start: no open issues or PRs (gh); WIP says it20 closed, it21 = claiming, PM data spike first; no it21 product log existed.
- Strategy unchanged: teach techniques progressively, reward learning over solving.

## Direction
- Pointing is taught, counted and explained (4/4/4). Next technique per strategy and backlog item 1: claiming (box-line reduction). Spike first (frequency on Tricky/Hard; how players can practise it).

## Evidence
### Spike 1 (PM; pm-it21/spike.js): claiming frequency, Hint walk (unit walk `hintFor` with level), seeds 1-200
- Claiming modelled like pointing: in a row/column D fits in 2+ cells, all in one box; D is struck from the box's other cells where it fits ("removed", >= 1); target via the same single-after-step rule (naked: a removed cell; hidden: its row or column, never the box). Claiming and pointing on the same box/line/digit are mutually exclusive (both removed sets would be empty).
- Tricky: never needed (200/200 solved by today's Hint). A useful claiming step exists in 199/200; with a claiming preference p10/p50/p90 = 2/5/8 claiming lessons per puzzle, first at entry 1-2, pointing then p50 2 (today 4). All placed digits matched the solution.
- Hard: today's Hint gets stuck in 192/200; adding claiming as a fallback unblocks 8/200 (claiming used in 11). With a claiming preference 137/200 see claiming (p50 2), but Hard still gets stuck.
### Spike 2 (PM; pm-it21/gen.js): a level that NEEDS claiming (solvable by singles+pointing+claiming, not by singles+pointing), 60 seeds, 1000 ms cap
- Bands 22-29 / 24-29 / 27-31: capped 47 / 49 / 54 of 60. Not viable (same result as it13's denser Tricky): practise via a Hint preference, as pointing does (#60).
### Spike 3 (PM; pm-it21/shape.js, ex.js): claiming steps under a claiming preference on Tricky puzzles, seeds 1-100 (538 steps)
- Removed (struck) cells: 1/2/3/4/5/6 = 186/226/95/17/12/2. Spread: one row or one column 452/538 (84%); 2-3 rows and 2+ columns 86 (16%).
- Forms: naked 324, hidden 214 (unit row 123, column 91). Examples: seed 1 entry 1 (row 3, box rows 1-3/cols 4-6, D 2, struck r1c5 r1c6, target r1c5 = 7, naked: same target as today's pointing hint); seed 3 start (column 6, box rows 7-9/cols 4-6, D 6, struck r7c5 r9c4 r9c5, target r5c4 hidden in column); seed 4 after 3 hints (5 struck over 3 rows).
### Persona round (brief pm-it21/persona/brief.md, text mock-ups of Tough seeds 1 and 3, and a 5-struck case)
- Practise route "would learn claiming well" a/b/c: A new level 4/5/4, B Tricky alternates 3/3/3, C Hard preference 2/2/2. Pick A 3/3. Button name "Tough" 3/3 ("Tricky+" reads as a placeholder 3/3).
- Understanding: naked example 4/5/4; hidden example 3/3/3, all three because step 3 said "its column" (column 4) right after step 1's column 6: name the unit. Differs from pointing 4/4/4; a "pointing in reverse"/"box to line vs line to box" cue asked by a, b (c: "the 2 of this box is in row 3" helps).
- Many struck cells: V1 list 5/5/5, V2 count 3/3/3; phone preference V1 2/3 (b: V2 if visible, else V1). Ideas: block compression "rows 8 and 9, columns 2 and 3" (b), "r7c3" style (c; rejected for readability at it20).
- Other: key with three legends is a lot (c, existing item); hidden step 3 does not say why other cells of the unit are out (c; existing watch item).
### Feasibility (PM; pm-it21/fit/fit.js, real page 360x740, Tricky seed 1 with claiming text injected into #status at stage 2)
- Stage-2 #status height: pointing 63 px; claiming seeds 1, 3, 4 also 63 px (same 2 lines); box-case suffix +21 px for both. So claiming adds no stage-2 height over pointing. (Absolute Next step bottom 675.9 here vs 738.9 in memory: my emulation was set after load; the tester measures absolutes.)
### Pins (PM; pm-it21/pins.js; claiming order rows 1-9 then columns 1-9, digits 1-9, target first in reading order; Tough = Tricky generation with the same rng)
- First Hint on Tough: s1 row 3 / box rows 1-3 cols 4-6, D 2, confined r3c4-6, struck r1c5 r1c6, target r1c5 = 7 naked; s3 column 6 / box rows 7-9 cols 4-6, D 6, confined r7c6 r9c6, struck r7c5 r9c4 r9c5, target r5c4 = 6 hidden column; s4 column 1 / box rows 7-9 cols 1-3, D 5, struck r7c3 r8c2 r8c3 r9c2 r9c3, target r4c3 = 5 hidden column; s7 column 8 / box rows 1-3 cols 7-9, D 2, struck r1c9 r2c9 r3c9, target r2c2 = 2 hidden row. These are start positions, so unit walk = page walk; the tester confirms on the page.
- Tough Hint walk (seeds 1-100): claiming p10/p50/p90 2/5/8 per puzzle, pointing 0/2/4, never stuck, every placed digit matched the solution.

## Decisions
- D1: practise claiming on a new level **Tough** between Tricky and Hard: Tricky's generation rule (same band and grading, so following Hint always solves it), and Hint prefers a useful claiming step, then Tricky's useful pointing step, then singles. A level that needs claiming is not generable in time (spike 2).
- D2: Hint teaches claiming on every level as a fallback after pointing (before "nothing to teach"), with the same nudge, 3-step reveal, staged marks and key as pointing, mirrored (line -> box).
- D3: struck cells are listed (V1): one cell "row R, column C"; all in one row/column as #96 ("row N, columns A and B"/"column N, rows A and B"); otherwise per row, ascending, joined by "; " ("row 7, column 3; row 8, columns 2 and 3; row 9, columns 2 and 3"). Block compression not now (watch).
- D4: claiming hidden step 3 names its unit ("the only cell in column 4 where 6 fits"). Pointing's "its U" stays (backlog, fold into the next issue touching it).
- D5: the claiming definition carries the contrast: "In a row (or column), a digit fits only inside one box, so it cannot go anywhere else in that box (pointing in reverse); that can leave a single."
- D6: rewards in the same iteration: hinted claiming is counted from issue 1 (a fourth tally line, needed anyway: creditEntry indexes the tally by technique); own claiming is recognised in issue 3 (teach before rewarding, gap closed within the iteration, lesson it8/it9).

## Issues (priority order; deliver in sequence)
1. #102 Hint teaches claiming (box-line reduction) as a fallback, with step reveal, marks and hint credit.
2. #103 Tough level: practise claiming (Hint prefers a useful claiming step).
3. #104 Rewards: recognise and count claiming found on your own.

## Assumptions / concerns
- A1: claiming is modelled grid-based and single-step like pointing (no persistent candidates), so Hard still gets stuck in 192/200; Hard is not the practice route. Hard's "needs more" grading is unchanged.
- A2: Tough reuses Tricky's generation; players could notice that Tricky and Tough puzzles feel equally hard. Personas did not raise it; the Hint preference is what differs. Watch at #103 acceptance.
- A3: #102 is the largest issue so far (logic, texts, marks, key, tally line). It is one issue because an explanation without its marks would contradict the pointing UI; the lead may split developer work internally. If the iteration runs long, #104 may move to it22 (teaching and hint credit stand alone).
- A4: the picker already wraps "Hard" alone at 375 px; five buttons will wrap; #103 AC4 only asks for visibility and order. Picker polish stays in the mobile backlog item.
- A5: absolute layout figures in memory (stage-2 Next step bottom 738.9 at 360x740) were not reproduced by my quick script (675.9; emulation set after load). The claiming stage-2 text is the same height as pointing's in the same run, so the fit risk is equal; the tester measures absolutes.
- Ratio: each issue adds product lines (earning 1.6 test lines each); no trim item planned. If a page test is needed past the cap, adapt existing tests (process.md rule).

## Backlog (PM, ordered, after it21 scoping)
1. Claiming, it21: #102, #103, #104 (in flight).
2. Claiming follow-ups (it21 personas): block compression of struck lists ("rows 8 and 9, columns 2 and 3", b); pointing hidden step 3 "its U" -> name the unit as claiming does (D4; fold into the next issue touching pointing texts); a "pointing vs claiming" cue on the first claiming hint (a, b; the definition carries it now); key with three legends is a lot (c); hidden step 3 does not say why the unit's other cells are out (c, watch item).
3. Explanation follow-ups (unchanged from the it20 snapshot, memory/wiki/backlog.md item 2).
4. Mobile remainder (snapshot item 3; add: five-button picker wrap at 360/375).
5-8. Pointing reach, slip follow-ups, small wording items, long-term (snapshot items 4-7; pairs after claiming).
Tech debt: unchanged from the snapshot.

## Notes for the lead
- Pins in #103/#104 are start positions (unit walk = page walk); spike scripts with a README-free layout live in $WEAVER_SCRATCHPAD/pm-it21/ (spike.js, gen.js, shape.js, ex.js, pins.js, fit/fit.js; run as `node <script> /Users/dirk/Code/weaver-team/sudoku.js`, fit.js takes the repo path). spike-lib.js holds the claiming model (rows then columns order) the pins used.
- This log is uncommitted in the main checkout; carry it on the #102 branch (process.md: logs travel on issue branches).

## Documents read (scoping)
- memory/wip/current.md, memory/README.md, memory/wiki/index.md, backlog.md, product.md (whole: product.md whole was more than the index's "Hint"/"Known gaps" ask; one cat call); lessons.md "Scoping and spec"; process.md ratio grep, "Work-log entry format", "Test strategy applied"; governance/context/*.md (whole, short).
- work-log/iteration-20-product.md: first 40 lines plus section list (header format; the index says not to; process.md's format line was enough).
- sudoku.js lines 200-424, 424-520, 520-640, 690-784 and a function grep (claiming model, hint/marks/credit shapes for the spec); index.html whole (picker); README.md grep for levels/pointing (spec wording); tests/chrome.js lines 1-30, tests/page.test.js lines 12-60, 280-300 (seeded page for the fit spike); tests/fixture.js, tests/generator.test.js head 30 (test shape).
