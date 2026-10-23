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

## Acceptance #102 (PR #105, head ec5633a): ACCEPTED
- Product code at ec5633a = tested head cdd6a42 (diff only work-log). PM runs on ec5633a: suite 183/183, skipped 0; tester t2-page 157/157, t3-layout 87/90 (the 3 known F1 fails), t6-ac8 12/12 (ROOT = main checkout).
- AC1 pass (tester t1 oracle 66/66; reviewer mutants 1-7, 31 killed). AC2 pass (none text, pointing first: mutants 3, 18; page). AC3 pass (texts built from the issue in tester expected.js, t2; mutants 15, 16, 22). AC4 pass (t2 real CDP input: labels, Hint advances, focus, clearing, notes). AC5 pass (t2 marks/key per stage; t5 regression vs 61f2db8 18/18; reviewer F2 naked-column marks is a nit, no column branch). AC6 pass (t2 rewards, tally once, line 4 + definition on all levels; completion sum mutant 19). AC7 pass (seeds 57/184, 375x812 + 1280x900 stages 1-3; 360x740 step-2 button bottom 738.9 <= 740; my A5 question resolved: 675.9 = after step 1). AC8 pass (2360/1475 = 1.600, cap; skipped 0; no longer lines).
- PM play-through on shots naked57, hidden184, colhidden58: marks, struck lists, rings for every hatched cell and targets checked by hand; all correct.
- Personas (brief pm-102/persona/brief.md, stage-3 shots A naked row, B hidden row phone+desktop, C hidden column-line): understand a 4/4/4, b 4/5/5, c 4/5/4 = avg 4.33; marks a 5/5/5, b 5/4/5, c 4/5/5 = avg 4.78. Both >= 4.0.
- Claims checked: c "r4c7 hatched without a ring" is a misread (ring at r1c7, b read it right). b, c: struck badge inside the naked target is confusing (by spec, mirrors pointing). b: hidden step 3 does not say why r2c2 is out (existing watch item). a, c: target cell (orange) easy to miss; a, b: name "claiming" in plain words on the hint (definition is only in the tally block); a: step numbers on marks.
- Decisions: D7 tester F1 (3-line step-2 text pushes Next step to 759.9 at 360x740; same for pointing on main) accepted as pre-existing, watch item in the mobile backlog. D8 reviewer F1/F2 deferred (not reachable via Hint / no column branch). D9 the two removed assertions were part A's own; accepted.
- Notes for #103: ratio is at the cap (0 headroom): budget 1.6 test lines per product line or trim first. On Tough claiming comes first, so naked targets with a struck badge will be seen often: watch persona confusion at #103 acceptance.

## Backlog (PM, after #102 acceptance)
1. Claiming, it21: #103, #104 (in flight); #102 accepted.
2. Claiming follow-ups: block compression of struck lists; pointing hidden step 3 "its U" -> name unit (D4); plain "what claiming is" line / pointing-vs-claiming cue on the hint (a, b at it21 scoping and #102); struck badge inside the naked target reads as contradictory (b, c; applies to pointing too); target highlight easy to miss (a, c); step numbers on marks (a); key with three legends is a lot; hidden step 3 does not say why the unit's other cells are out (watch, b again).
3. Explanation follow-ups (snapshot item 2).
4. Mobile remainder (snapshot item 3; five-button picker wrap at 360/375; watch: 3-line step-2 texts put Next step 20 px below 360x740, pointing and claiming, Hard seeds 14/108).
5-8. Unchanged (snapshot items 4-7). Tech debt: unchanged; test ratio at cap.

## #103 scope questions (lead, branch head cc1f9f2)
- D10 (Q1, AC 5 failed for Tough seed 4: 4-line step 2, Next step bottom 759.9): accept the developer's rule `#status.steps { font-size: 1rem; }` below 560 px, all levels, as part of #103. Shot stage2-s4-360x740 checked: 1rem step text reads well. AC 5 extended: tester also measures Hard seeds 14/108 (D7 3-line case) at 360x740 and runs the shared f1a/f1h/f4 layout tests; if they pass, the D7 watch item closes. Developer figures: seeds 1/7 701.3, 3/4 719.3.
- D11 (Q2): AC 3 = "first claiming Hint when following Hint from the start" (seeds 1/3 first Hint, seed 4 after 3 hinted entries, seed 7 after 1); pins.js and the page walk agree; pin data unchanged. My original "first Hint" wording was imprecise for seeds 4/7 (pins were walk positions, the log said "start positions").
- Issue body AC 3/5 + Change log updated; comment posted.

## Acceptance #103 (PR #106, head a1331d5): ACCEPTED
- Product code at a1331d5 = 87f6fa6 (diff from it: work-log and memory/wip only). PM runs on a1331d5: suite 183/183, skipped 0; tester scripts with ROOT = main checkout: t1 47/47, t3 48/48, t4 22/22, t5 50/50, t6 21/21, t8 14/14 (ratio 2368/1480 = 1.600, longest lines = 9ccab0c maxima).
- AC1 pass (t1: 3 seeds tough = tricky, unique, band, not singles; generator batch; mutants M6/M15 killed). AC2 pass (t1 oracle on ~1200 walk states, pass-over case; reviewer M1-M4/M16 killed, M3 killed after rework 1). AC3 pass (t3 page walk = unit walk, all four pins; my seed 3 shots show step 2/3 texts word for word). AC4 pass (t4 + shots at 360/375 wrap 3+2 in order, 1280 one line; checked by eye). AC5 pass (t5: Tough 1/7 701.3, 3/4 719.3; Hard 14/108 719.3 (main 759.9); computed 16 px below 560 px, 17.6 px above; g1 pins it; f1a/f1h/f4 pass). AC6 pass (t6 regression main vs branch 21/21; 8 removed assertions confirmed redundant by reviewer and tester mutants (D12); ratio at cap, skipped 0).
- Play-through (PM; pm-103/play.js, Tough seed 5, 1280x900, real input, Hint only): 54 entries, 27 naked, 19 hidden, 8 claiming, 0 pointing; every page nudge = unit hint, every digit = solution; "Puzzle solved!", tally Claiming 8 with a hint. Claiming texts at stage 3 read correctly (hidden column and naked forms).
- Personas (brief pm-103/persona/brief.md; real-page shots: pickers 375/360/1280, Tough seed 3 nudge + steps 1-3 at 375 and step 3 at 1280, seed 1 naked step 3 at 360): learn claiming a/b/c 4/4/4 = 4.0; picker 4/4/4 = 4.0. Both >= 4.0 (at the threshold). Marks in the naked case 3/3/3; separate Tough level makes sense 3/3/3.
- Claims checked: all three explained seed 3 correctly (row 5, column 4 = 6, via column 6 confined to the bottom-middle box). Naked case: "no 7 visible to back 'must be 7'" (b, a) correct, by design (no candidates shown); c's "struck 7 mark" and a's "second mark" are the r1c6 badge next to the target (misread, but the cramped badges cause it); b's "row 2 band" is row 3 (misread). Picker 3+2 wrap "lopsided" (a, b, c).
- D12: the 8 removed assertions accepted (redundant per mutants on both trees; none AC-required). D13: D7 watch item (3-line step-2 Next step off-screen at 360x740) closed by D10 (Hard 14/108 719.3). Stage-3 invitation has 1.5 px spare at 360x740 (new watch). D14: reviewer nit 5 (g1 seed-1 struck cells) deferred, tester t3 covers it.
- A2 watch outcome: personas do not feel Tough as harder; all three ask the picker to say what Tough is ("Tricky difficulty, claiming hints"). Not a blocker (they would pick it to practise claiming); backlog item 2, first candidate after #104.

## Backlog (PM, after #103 acceptance)
1. Claiming, it21: #104 (next); #102, #103 accepted.
2. Claiming follow-ups: one-line level descriptions on the picker ("Tough: Tricky puzzles, hints teach claiming"; a, b, c at #103, A2); struck badge inside the naked target is cramped/confusing (now 3/3/3 on Tough, b, c at #102 too; consider showing the two candidates in the target); block compression of struck lists; pointing hidden step 3 "its U" -> name unit (D4); plain "what claiming is" cue on the hint; target highlight easy to miss; step numbers on marks; key with three legends is long (a, c again); hidden step 3 does not say why the unit's other cells are out (watch).
3. Explanation follow-ups (snapshot item 2).
4. Mobile remainder (snapshot item 3; picker 3+2 wrap looks lopsided (3/3); watch: stage-3 invitation 1.5 px spare at 360x740). D7 watch closed.
5-8. Unchanged (snapshot items 4-7). Tech debt: test ratio at cap (0 headroom); g1 seed-1 struck cells (deferred nit).

## Notes for #104
- Ratio has 0 headroom: 1.6 test lines per added product line, or a trim first (adapt existing tests; mutant-confirm any removal as in #103).
- Tough gives many claiming chances (tester walk seeds 1-10: 58 claiming; my seed 5: 8), so recognising own claiming on Tough is the natural page pin; classifyEntry on Tough claiming is untested today.
- Personas keep flagging the naked-target badge; if #104 touches marks, do not widen it; keep scope.

## Documents read (#103 acceptance)
- pm-accept-103 brief (whole; task); issue #103 body (whole; spec); product-strategy.md (whole, 6 lines; currency); this log (whole; state, D-numbering); test-103/README.md (whole; how to re-run); work-log/issue-103-tough-level.md sections Reviewer, Tester, Lead review (whole sections; verdicts); dev-103 README, stage2.js, walk.js, pagelib.js lines 17-95 (to reuse the page driver for shots and play-through).
- Screenshots viewed: pm-103 picker-375, stage3-375; test-103 picker-1280; dev-103 stage3-s1-360x740.
- Personas a, b, c: brief.md and the nine shots in pm-103/persona/ only (each confirmed; no other file, no LOG.md).

## #104 AC 2 pin (lead question, head 1383ed1)
- D15: AC 2 pin seed 7 r2c2 = 2 replaced by seed 12 r2c3 = 5 (claiming, column 1, D 2, top-left box). Seed 7 r2c2 is a two-step chain (column 8 D2 leaves 2 in r2c5); seed 7 has no single-step claiming entry at the start (my scan: 0). My original pin was wrong (I checked null-today only, not claiming-after). Seed 12 checked: null on 93744fb, claiming on 1383ed1. Seeds 3/1 unchanged. Issue body + Change log updated; comment 6359497282. Lesson: pin checks must verify the intended outcome, not only the current one.
