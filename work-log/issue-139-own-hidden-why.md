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

- Model: Claude Sonnet 5.5; session 512d8df6-bdf0-4d6d-9806-20017be40830. Commit 5b9e9cd (code, tests, README).
- Summary: extracted the holders/boxes-rows-columns/has-have logic from `hiddenStep3` into exported `holdersPhrase(s, grid)` in hints.js (returns "<units> already has/have a D" or ''); `hiddenStep3` and the own hidden-form reward in rewards.js both call it. Reward ends ", since <phrase>." or stays as before when ''. README Pointing and Claiming updated. Three test strings adapted (tests/sudoku.test.js x2, tests/page.test.js x1); no test added or removed; tests/ 2495 lines.
- Mutants (all killed): ", since" -> ", because" (10 fail); always "have" (6 fail); always append since (2 fail).
- Claims: 242/242 pass, skipped 0; no assertion removed.

## Reviewer
- Model Claude Sonnet 5.5, session 512d8df6-bdf0-4d6d-9806-20017be40830. Head reviewed decd707. Verdict: APPROVE with one major test-gap finding for the lead to rule on.
1. (major, tests) rewards.js:101 mutant `removed: res.removed` -> `removed: []` survives the full suite (242/242 pass). The wiring of `removed` into holdersPhrase from the reward is unpinned: a removed cell is treated as a cell to explain. Either pin a crafted case (reward where a removed cell sits in a row/column/box that holds D, or holds none) or accept as equivalent on the pinned seeds.
2. (nit) hints.js:48 hiddenStep3 recomputes `UNITS[CELL_UNITS[p][kU]]` which holdersPhrase also computes; harmless, no second copy of holder/ordering/has-have logic.
3. No other findings: AC 3 one code path (holdersPhrase); ADR 003 ok (hints -> rewards import already listed, no cycle, no ui.js import); grid is `before` (pre-entry, ui.js:124); `d`==pointDigit, `digit` used for the text; no-reason text unchanged; 3 test strings changed, none removed, tests/ 2495 <= 2529; max line rewards.js 160, hints.js 248 (unchanged); README only hidden-form text and no-reason case.
Not checked: layout/page behaviour (tester), specs/ run beyond node --test, a reachable-state difference for finding 1.

## Tester
- Model Claude Sonnet 5.5, session 512d8df6-bdf0-4d6d-9806-20017be40830. Head tested b95608e (main 21338ba for comparison). Verdict: PASS, no defects; one thin-slack note.
1. AC 5 layout (real page, mobile emulation before load, real CDP input; 4 cases x 3 viewports, branch vs main): all gates hold. Tricky 54 r8c3 at 360x740: 8 lines, #status bottom 736.5 (main 694.5; limit 737, 0.5 px to the gate, 3.5 px to the 740 viewport); 375x812: 751.6 (<= 760). Tricky 8 r4c1 and Tricky 24 r6c7 also hit 8 lines / 736.5 at 360x740 (not only Tricky 54); Tricky 14 r6c9: 7 lines, 715.5. Grid top 79.8, buttons 47-552.5, scrollY 0 identical to main in every case; 1280x900 2 lines and no overflow in all; 0 console errors; no split box names; shown text equals expected in all 24 runs.
2. Oracle (own holder rule, no hints.js): 195 cases (174 with reason, 21 without), 0 mismatches; 21 no-reason texts identical to main; part before ", since" byte-identical to main in all 195; 780 hintFor calls deep-equal branch vs main; Hint step 3 for the same step contains the oracle phrase in 88 of 88 reason cases.
3. Mutants (perl, node --test, restored): (a) ", since " join -> " since " KILLED (10 fail); (b) has/have always "have" KILLED (6); (c) always append since KILLED (2); (d) boxes after rows KILLED (9); (e) break removed KILLED (3). Fail counts are node's, including enclosing suites.
4. Suite: node --test 242 tests, 242 pass, 0 fail, 0 skipped.
5. Note (low): the 360x740 fit rests on 0.5 px of the AC (737) and 3.5 px of the viewport; any further wording growth at 8 lines will push the message below the fold at 360x740 (already the known tally gap). Reviewer finding 1 (removed: [] mutant) not re-run.
Not tested: personas/PM acceptance (AC 7), touch input, other viewports, Tough/Easy levels on the page, Safari/Firefox, unit-test line counts (AC 2 caps, reviewer/lead).
Scratch: /tmp/wvr/claude-502/-Users-dirk-Code-weaver-team/512d8df6-bdf0-4d6d-9806-20017be40830/scratchpad/test-139/ (README.md).

## Lead review
- Lead spot check after developer (decd707): diff matches the claimed file list; product 1593 (developer's 1393 omitted index.html/style.css/package.json), tests/ 2495 (1.566x, cap 2529), spec-implementation/ 483; longest lines unchanged (rewards.js 160, hints.js 248); README word-diff touches only the two hidden-form reward texts. Suite 242/242. Re-ran mutant (c) (always append since): 2 fail (no-reason spec + seed 1/3 walls unit test), killed.
- Reviewer finding 1 (`removed: []` at rewards.js:101 survives): ruled equivalent, no rework. Removed cells come from `spotsFor(..., d)` (techniques.js:97 and pointing alike), i.e. cells where D still fits, so none of their units holds D and holdersPhrase never assigns them a holder; the filter only skips work. Finding 2 (nit, recomputed unit cells) accepted as is.
- Tester PASS at b95608e. Lead re-ran `oracle.mjs` (17:33, PASS 174/21/195, hint calls unchanged) and `table.mjs` (PASS all AC5 gates) while wt-test-139 existed; looked at t54-r8c3-branch-360.png (8 lines, fully visible, board/buttons in place). Thin 360x740 fit (736.5 of 737) noted for the PM; message length is backlog item 3.
- AC 1-6 met (AC 7 is the PM's). ADR 002/003 compliant (no new module, no new deps; hints -> rewards import already listed).

## Lead: acceptance and merge
