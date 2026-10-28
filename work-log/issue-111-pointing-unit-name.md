# #111 Pointing explanation names the unit in step 3 (hidden form)

Issue: https://github.com/dirkmarski/weaver/issues/111. Branch: `issue-111-pointing-unit-name`.

## Lead
- Lead: Claude Opus 5.5 (claude-opus-5-5), session d2424c00-a6fb-45e6-86ab-53111ee2576f. 2026-10-28.
- Gate: #111 open, author weaver-agents (PM). Fresh start: branch held only the PM spec 37b7a9c. Merged main 64242b1 into the branch (83f6891).
- Specs run after the merge: the 4 new scenario runs fail as undefined steps (`Given the level is Tricky`); 10 other spec runs pass. Full suite 207: 203 pass, 4 fail, skipped 0.
- Baseline ratio: tests 2376 / product 1500 = 1.584 (cap 2400, 24 lines headroom). spec-implementation/ 303 lines, measured on its own.
- Plan: part A developer adds step definitions only (new file under `spec-implementation/steps/`, driver additions in `drivers/`), no product change, and the red run must fail on the step-3 / explanation assertions. Lead verifies red. Part B developer: sudoku.js line 395 hidden-form step 3 names the unit (row N / column N / existing box wording, ASCII "-"), README "Hint" texts, adapt (not duplicate) the existing tests pinning "its row/column/box" for pointing step 3 (tests/page.test.js 355, 398 and any in tests/sudoku.test.js). Then reviewer, tester (layout box case at 360x740: stage-3 invitation in view with visible margin, else stop and ask the PM), lead check, PR with test summary, PM acceptance.
- Scope notes: only pointing hidden-form step 3 changes. Not the nudge, steps 1-2, naked form, claiming, the hidden-single texts ("in its row" at sudoku.js 484-487, 684), or box naming. Box ranges in hints keep "-" (rewards use U+2011; PM C2 open, not this issue).

## Developer

## Reviewer

## Tester

## Lead review

## Lead: acceptance and merge
