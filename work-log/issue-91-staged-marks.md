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
