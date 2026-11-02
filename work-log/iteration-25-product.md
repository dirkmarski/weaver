# Iteration 25: product log (PM)

PM session: scoping run, 2026-10-29. Basis: main 5804bd4 (code as 65a90a6, plus Dirk's governance update).

## Status
- Scoping done. Issues #126, #127, #128 raised (in that order, delivered in sequence). Spec branches pushed: `issue-127-play-online` (1 new scenario, red), `issue-128-box-names` (7 scenarios red on main, 14 pass). #126 has no spec (restructure; parity gate).
- Requests 001 and 002 (PM-raised, Answered): Follow-ups recorded. 003-005 were raised by the curator.
- 2026-11-02 (PM relaunch, scoping re-run): found #126-#128 open, spec branches pushed and this log unmerged (no PR). Rechecked: no governance change since 5804bd4 (68829d7 touches `.claude/run-task` only); product code unchanged since 65a90a6; live site 200. Red runs repeated: #127 1 fail (assertion) / 21 pass; #128 7 fail / 14 pass. Scope stands unchanged; opened a PR for this branch so the request Follow-ups reach main for the curator. Next: lead delivers #126, then #127, then #128; PM accepts each.
- 2026-11-02 #126 ACCEPTED (PM session 226c8fac-a151-4b1c-af1a-02f108c103b5), PR #130 head 7f449d7 (code 3c7f44a) vs main 68829d7. See "Acceptance #126".
- 2026-11-02 #127 stage 1 ACCEPTED (same session), PR #131 head d63d266 (code f00e189). See "Acceptance #127".
- 2026-11-02 #127 AC4 PASS (same session) after merge f5f1266: #127 fully accepted. Next: #128.
- 2026-11-02 #128 ACCEPTED (same session), PR #132 head d9d2f31 (code cf29612, README 031d624). See "Acceptance #128". All three it25 issues are accepted; the lead merges #132.

## Acceptance #126 (D6)
Own checks in a detached worktree of 7f449d7: root `*.js` = the 10 modules of D1 (no Change-log entry); `node --test` 228/228, 0 skipped (230 -> 228 = per-module guard, 12 -> 10); specs 21/21; `specs/` and `spec-implementation/` unchanged; `parity.mjs` PASS 68/68 declarations, 53/53 exports, no NEW; screenshots (`test-126/`, own labels, since removed) 6/6 identical, 0 console errors; `loads.mjs` 10/10, 120 responses, 0 problems; README "## Modules" cites ADR 003, area/helper lines, no old file names outside work-log/memory; guard header ADR 003, tests diff = imports + 2 wording lines. From the PR report: ratio 1.590x (cap 1.6x), spec-implementation 483, guard mutants killed, wiki "Files/Modules/Exports" updated (ab65482). AC1-7 pass. Reviewer nits left as is (accepted). Comments: PR #130 issuecomment-6567823264, #126 issuecomment-6567823543. C2 resolves on merge. Next: #127 after #130 merges.

## Acceptance #127 (D7)
Stage 1, detached worktree of d63d266: specs 22/22, 0 fail, 0 skipped. AC1 red reproduced at 466e57e: 21 pass, 1 fail on assertion `play-online.feature:10` ("does not give the address"). AC2 `local-run.feature` and `spec-implementation/` unchanged vs main; d63d266 vs f00e189 = work-log only. AC3 README "View" opens "Play online at https://dirkmarski.github.io/weaver/.", keeps `node tools/serve.js`, Node 22 or newer, `http://localhost:8000`. "First" rests on reading (substring step; mutant e survives), accepted as is. Comment: PR #131 issuecomment-6567917748. AC4 PASS (after merge f5f1266): Pages latest build commit f5f12664, status `built` (was `building` at first poll). All 12 root html/js/css served at https://dirkmarski.github.io/weaver/ byte-identical to f5f1266. Headless Chrome (fresh profile, 1280x900, real mouse): Tricky shows "Difficulty: Tricky"; Hint highlights r1c8, text "Hint: row 1, column 8 is a hidden single ..."; 0 console/network problems. Shot: scratchpad `pm-127-ac4/live-tricky-hint.png`. Comment: #127 issuecomment-6567944780.

## Acceptance #128 (D8-D10)
Detached worktree of d9d2f31: `node --test` 230/230, 0 skipped; `boxName(b)` has one form (no dash parameter); the unit test pins nine names and U+2011. AC1, AC4 and AC5 figures come from the PR report (red 7 fail on assertions; ratio 1.597x; mutants 10 killed + 1 equivalent + 2 page; spec-implementation 483; 16 layout pairs with no overflow; longest reward and claiming step 1 both 7 -> 6 lines). AC3: README line 42 defines P once (nine names, "centre"); "the P box" on lines 42, 43, 46, 50 and 53; no "box of rows" left. AC6 (scratchpad `pm-128/`, briefs `persona-brief.md` and `persona-brief-2.md`, answers checked against `test-128/facts.md`): round 1 on branch screenshots at both viewports, find 4.87 (a 4.8, b 5.0, c 4.8), 15/15 boxes placed correctly; read 3.72 (a 3.83, b 3.67, c 3.67). Round 2, blind, 360x740, main vs branch in shuffled X/Y order: read 4.0 for names vs 2.56 for ranges, find 4.67 vs 2.22, names preferred 9/9. Comment: PR #132 issuecomment-6568280949.
- D8 #128 accepted at d9d2f31.
- D9 AC6 read 3.72 < 4.0 in round 1 is accepted. Reasons: all three personas named coordinates, message length and the phone scroll as the cause, not the names; in round 2, with the names isolated, they score 4.0 against 2.56 for ranges. Concern: brief 1 asked about the whole message, so it measured more than #128 changes. Future briefs should ask about the change itself and the whole message as separate questions.
- D10 D10 case grid top 5.8 -> 5.8 (the names save no line in that text): the hard criterion holds and "expected higher" did not, so accepted with no scope change. Backlog item 2 must solve the 360x740 room first.

## Direction
- New governance (5804bd4): ADR 003 supersedes ADR 001 (modules = areas of the game a player would name; shared helpers may have their own module). Timing: existing code in line this iteration, before any new product feature. Spec strategy: an already-passing scenario counts as red only once a mutant fails it at the red run. Rules: requests/ flow.
- Theme: comply with ADR 003 first, point players at the live site, then backlog item 2 (shorter box names), which also unblocks item 3.

## Evidence
- Pages: `curl` of https://dirkmarski.github.io/weaver/ and `ui.js`: both 200.
- Module map vs ADR 003 (from `grep '^import' *.js` and exports): Hint area split over `hints.js` + `hintmarks.js` (which also holds `rewardMarks`); checking entries split over `validation.js` + `clashes.js`. `board.js`, `texts.js`, `techniques.js` are shared helpers.
- Box names, text A/B/C (brief: scratchpad `pm-it25/box-names-brief.md`; P = position, Q = today's ranges, R = numbers 1-9; three messages). Find / read (a, b, c): P 5/4, 5/4, 5/5; Q 2/2, 3/2, 3/2; R 3/5, 3/5, 3/4. Prefer P 3/3. "centre box" 3/3. Watch: "top-left" then "middle-left" in one message made 3/3 pause; amber marks resolve it.
- #128 spec check: `pm-it25/boxnames.py` maps each range to its position (asserting aligned box ranges) and leaves the amber-area tables of `own-step-marks.feature`; diff = 7 lines; red run on main: 7 fail on message assertions, 14 pass. #127 red: 1 fails on assertion ("does not give the address"), 21 pass.

## Decisions
- D1 ADR 003 target map (PM reading, in #126): `checking.js` = validation + clashes; `hints.js` absorbs hint marks; `rewardMarks` to `rewards.js`; shared helpers board/techniques/texts; 10 modules. Lead may propose another reading before part B; PM records it in the Change log.
- D2 #126 parity gate as it23 (specs, parity script, pixel-identical shots, 10/10 loads); no personas.
- D3 Box names: position form, "centre", non-breaking U+2011 hyphen in all texts (settles C2/C4 one form). Amber-area tables in `own-step-marks.feature` keep the range notation (step notation, not a player text).
- D4 #127 and #128 start only after #126 merges (ADR 003 timing). #127 is docs only but follows #126 to avoid README conflicts.
- D5 Spec tags: `@issue-108 @issue-128`, `@issue-111 @issue-128` (runner accepts several tags).

## Assumptions and concerns
- A1 Box-name scores are text-only; mock-ups scored about 0.65 lower than real pages before (#108), so the #128 gate is on real screenshots (AC6).
- C1 ADR 003 "area a player would name" is open to reading (completion as its own area; techniques as helper). Recorded as D1; not raised as a request, the ADR is clear enough to act on.
- C2 ADR-guard comment and README still cite ADR 001 on main until #126 merges.

## Issues
1. #126 Modules by game area (ADR 003). First.
2. #127 README names the online address to play. After #126.
3. #128 Shorter box names: name a box by its position. After #126 and #127.

## Backlog (PM, after it25 scoping)
1. Shorter box names: done (#128 accepted).
2. Hidden-form rewards and hint step 3 say why the unit's other cells are out (3/3 at it22): next. #128 freed no line in the D10 case (grid top still 5.8 px), so solve the 360x740 room first (a shorter step 3, or the scroll).
2a. (new, #128 AC6) Message density: "row N, column M" coordinates and long hidden-form texts slow readers (3/3), and on the phone the stage-3 view cuts off the board top or the message end (3/3). Scope it together with item 2.
3. Reward/hint marks follow-ups (it24 R1-R3, unchanged from `memory/wiki/backlog.md` item 1).
4-10. As `memory/wiki/backlog.md` items 4-10, unchanged; drop the "Open concerns" C1 (Pages) and C2 (granularity), both answered.
