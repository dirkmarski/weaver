# Issue #91: Board marks and key line follow the revealed pointing step

Issue: https://github.com/dirkmarski/weaver/issues/91 (PM, it19 issue 2 of 2). Branch: issue-91-staged-marks from main 8d4717b (after PR #92).

## Lead
- Lead: Claude Opus 5.5 (claude-opus-5-5), session `19338c12-dbf9-46b7-b92b-1a81aef47c6d`. New lead run in the same session id as #90 (separate run; no branch, PR or log for #91 existed: fresh start).
- Gate: issue open, authored by weaver-agents (PM), no comments.
- Baseline: product 1359 (sudoku.js 1165, index.html 43, style.css 151), tests 2174, cap floor(1.6 x 1359) = 2174, headroom 0. Each product line buys 1.6 test lines; removals only if listed, reviewer- and tester-confirmed, never AC-required; no line packing (no line longer than the file's current longest).
- Plan: developer (staged marks, key helper, README, unit + page tests) -> lead check -> reviewer and tester (own detached worktrees, foreground, one at a time) -> rework if needed -> PR -> PM acceptance incl. persona round (AC10) -> merge commit with the accepted sha.

## Developer

- Model Claude Sonnet 5.5, session 19338c12-dbf9-46b7-b92b-1a81aef47c6d.
- Design: new wiring-scope `showMarks(marks, stage)` (adds only; stage 1 target/area/confined, 2 + removed, 3 + hatched/rings/`hatchedRings`) called by Hint (stage 1 for a pointing explain, else 3) and `revealStep` (stage = `steps.shown`; `steps` now also holds `marks`). Key via `hintKey(hint, hatchedCount, stage)`, stage default 3 = today's text. Link handlers unchanged: they are inert while `hatchedRings` is null, which now holds until stage 3.
- Tests: f1 pins the three stages (naked, seed 1, literal keys, no link on a later-hatched/ringed cell at 1 and 2); f, f1d, f1e, f2b, f1b use the new `hints(n)` helper and reach stage 3; f1b (hidden) is the stage 3 equality for the other form; f1a also compares tops after the last step; unit test pins hintKey stage 1/2/3.
- Measurements: product 1371 (sudoku.js 1177, index.html 43, style.css 151), tests 2187, cap 2193, headroom 6. `node --test`: 173 pass, 0 fail, 0 skipped.
- Mutants killed: removed-badge gate, stage-3 gate (off by one each way), key hatch clause at 2, key struck clause at 1, always stage 3, reveal jumps to 3, hatchedRings set before stage 3 (link handler reacting early).
- Known limits: AC7 steady page checked by f1a at 360 only (tops before/after stages); 375/1280 mouse not re-measured; no real-input check.

## Reviewer

- Model Claude Sonnet 5.5 (claude-sonnet-5-5), session 19338c12-dbf9-46b7-b92b-1a81aef47c6d, head reviewed 930be19.
- Verdict: APPROVE.
- Findings:
  1. Info: the click counts of f, f1d, f1e, f2b are not the same as before (f 1 -> 3, f1d/f1e/f2b 2 -> 4 `hints(n)` clicks); this is required, since the first explain click now shows step 1 only. f1b is 4 -> `hints(4)`, identical. No assertion removed in any of them (diff shows click lines only, plus added assertions).
  2. Info (gap, not blocking): the hidden form is page-tested at stage 3 only (f1b), as AC9 asks; an entered ring's input focus before stage 3 is not asserted directly (code path is inert via `hatchedRings === null`; the early-set mutant m13 is killed through the hatched-cell focus in f1).
  3. Info: AC7 evidence is f1a at 360 only (developer's stated limit); AC10 is the PM's.
- Code reading: showMarks stages gate correctly; Hint (steps ? 1 : 3) and revealStep (steps.shown) go through the same function; nudges and singles take stage 3 (steps null); clearResults nulls steps and hatchedRings; hatchedRings and unlink only at stage 3; README changes only the pointing Second click paragraph and is accurate per stage.
- Suite: 173 pass, 0 fail, 0 skipped. Product 1371, tests 2187, cap 2193. No new line above the previous longest (329 / 320 / 255).
- Mutants (all killed): removed gate dropped / at stage>2; stage-3 gate at <2 / <4; key struck at stage>0; key hatch at stage>1; always stage 3; always stage 1; reveal with 3; reveal without showMarks; hintKey default 1; hatchedRings set before stage 3; rings not drawn; hatching not drawn; confined hidden at stage 1.

## Tester

- Model Claude Sonnet 5.5 (claude-sonnet-5-5), session 19338c12-dbf9-46b7-b92b-1a81aef47c6d, head tested abced2d (code 930be19), baseline main 8d4717b (includes #90, so main's "second click" state = marks after two Hints, status after four).
- Verdict: PASS (0 blocking defects; 1 low observation D1 on a strict rect check). Scripts and README: scratchpad `test-91/` (`./run_all.sh`); real CDP touch 360x740 and 375x812 (mobile emulation), mouse 1280x900, real keys.
- AC1/AC2: PASS. ac_stages: both seeds x 3 viewports x 3 advance paths (1146 checks): per stage the sets of hint-target/area/confined/removed/hatched/digit/data-d, no linked/ruled, literal key at stage 1 and 2, link line empty, status lines k+1, nothing but marks differs from main.
- AC3: PASS. Stage 3 cells (classes, attributes, html, values), key, link, status, class, focus equal main for both seeds at all viewports. No-hatching case (Tricky seed 4 + 19 singles typed): at stage 3 no hatched clause, no invitation, equal to main (ac6, 82 checks).
- AC4: PASS. ac4_links (957 checks): before stage 3 real taps on every to-be-hatched cell, ring (given; an entered ring on seed 8 cell 71; none found for seed 1) and the target, plus arrow keys landing on hatched cells: no hint-linked/ruled, link, key and cells unchanged, Next step then finishes at main's marks; from stage 3 results equal main's.
- AC5: PASS. Next step by tap/click, Tab+Enter and Hint click give identical cells/key/link/status at each stage (ac_stages).
- AC6: PASS. Nudges (seeds 1, 8), naked and hidden single explanations equal main (no staging, no button); value change, Verify, New puzzle, level at stage 1 and 2 leave no marks, key or link (value change and Verify equal main); a Notes toggle and a note written at stage 1 and 2 keep marks/key/link/status/label and the reveal continues to main's stage 3.
- AC7: PASS for tops/heights of grid, #link, button row and Verify/Hint/Notes at all stages and viewports, and x/width at 360 and 375 (touch). Observation D1 (low): strict rect equality fails only at 1280 seed 1 stage 1: grid and Verify/Hint/Notes left edges move 0.0156 px, and the (empty) #link and #buttons boxes are 556.9 px wide instead of 576 (left 354.1 vs 344.5) because the stage 1 key line and text are narrower; the buttons stay centred and the link line is empty. On main the same boxes already change width with the message (522 / 1233 / 576 px for none / nudge / explanation), so this is the same mechanism; not visible.
- AC8: PASS. One README line differs; the only text removed is "The marks, key line and link line all appear on the second click, as before."; files changed since main: README.md, sudoku.js, tests (2), this log.
- AC9: PASS. `node --test`: tests 173, pass 173, fail 0, skipped 0 (page tests ran, Chrome present).
- Negative control: `if (stage < 3) return;` -> `if (stage < 2) return;` in a copy: ac_stages 54 FAIL, ac4_links 186 FAIL.
- Screenshots: scratchpad `test-91/shots/seed{1,8}-stage{1,2,3}.png` (375x812), looked at seed 8 stages 1 and 3: marks match the step.
- Defects: none blocking. D1 above (low/info).
- Not tested: AC10 (PM persona round); Q staging (out of scope); an entered ring for seed 1 (none found by a search over legal entries of D, so entered-ring focus only on seed 8); real devices/Safari/Firefox (Chrome only); keyboard Space on Next step (only Enter, and #90 covered Space); landscape or other viewport sizes; contrast and wording of the key line (PM persona round).

## Lead review
- Developer b24f8a8 (product + tests), e4d6ac9 (README), 930be19 (log). Diff read in full: `showMarks(marks, stage)` (add-only, stage 1 target/area/confined, 2 + removed, 3 + hatching/rings/`hatchedRings`), `hintKey(hint, hatchedCount, stage)` default 3, Hint uses `steps ? 1 : 3`, `revealStep` calls `showMarks(steps.marks, steps.shown)`. Link handlers unchanged (inert while `hatchedRings` is null).
- Ratio: product 1371 (+12), tests 2187 (+13: page +21/-12, unit +4), cap 2193, headroom 6. No assertions removed; `hints(n)` replaces repeated click lines (reviewer-confirmed click-only changes; counts rise because stage 3 now needs the extra clicks). Longest lines unchanged (329/320/255). Developer report misstated page +32 (actual +21/-12): count slip, totals correct.
- Lead re-run: `node --test` 173/173, skipped 0. Lead mutant (removed badges from stage 1, `stage > 0`): killed (1 fail). Screenshots seed1-stage1/2 viewed: match AC1/AC2 (marks and literal key).
- Reviewer APPROVE (abced2d, 15 mutants killed, 3 info notes). Tester PASS (4af088c, about 2200 real-input checks; negative control 54 + 186 fails). Both logs fast-forwarded onto the branch (no merge commits).
- Decision on tester D1 (1280 mouse, seed 1, stage 1: grid and button-row left edges shift 0.0156 px; empty `#link`/`#buttons` boxes narrower because the shorter key line narrows the wrapper): not a defect for AC7 ("moves" = visible movement; tops/heights identical everywhere, touch viewports identical; main already varies these box widths with the message). Flagged to the PM for acceptance.
