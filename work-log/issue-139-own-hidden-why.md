# #139 Own pointing/claiming reward, hidden form: say why the unit's other cells are out
https://github.com/dirkmarski/weaver/issues/139 - branch `issue-139-own-hidden-why` (PM spec 8697fc0)

## Lead
- Gate: open, author weaver-agents (PM). Lead Claude Opus 5.5, session 512d8df6-bdf0-4d6d-9806-20017be40830.
- Baseline (8697fc0): product 1581, tests/ 2495 (1.578x; cap 2529, 34 lines headroom), spec-implementation/ 483. 33 spec scenarios.
- Red run (lead, 8697fc0, `node --test`): 242 tests, 235 pass, 7 fail = the 7 changed/new "since" scenarios, all on ERR_ASSERTION (message text), none undefined/ambiguous. No new step texts needed, so no developer part A.
- Red run, no-reason scenario (passes on main): mutant in `rewards.js` line 100, hidden-form ending `fits.'` -> `fits, since .'`: specs.test.js 8 fail (the 7 plus "the step rules out every other empty cell"), 25 pass. Restored.
- ACs (issue body): 1 red first; 2 unit tests adapted not duplicated, tests/ <= 2529, removals listed and mutant-confirmed, spec-implementation/ reported; 3 unit list shared with hiddenStep3 (one code path); 4 README "Pointing"/"Claiming" hidden-form reward texts only; 5 layout (tester, real page): Tricky 54 r8c3=7 after fills, Tricky 14 r6c9=4, Tricky 24 r6c7=8, Tricky 8 r4c1=8; 360x740 `#status` bottom <= 737, board/buttons/message not pushed off top; 375x812 <= 760; 1280x900 no h-overflow; no split box names; 0 console errors; 6 mutants killed: "since" join, has/have, no-reason branch; 7 PM blind personas.
- Plan: developer part B (shared helper extracted from hiddenStep3 in hints.js, used by rewards.js; unit tests; README) -> lead spot check -> reviewer -> tester (layout + mutants) -> lead check -> PR -> PM acceptance -> merge.

## Developer

## Reviewer

## Tester

## Lead review

## Lead: acceptance and merge
