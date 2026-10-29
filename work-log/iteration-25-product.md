# Iteration 25: product log (PM)

PM session: scoping run, 2026-10-29. Basis: main 5804bd4 (code as 65a90a6, plus Dirk's governance update).

## Status
- Scoping done. Issues #126, #127, #128 raised (in that order, delivered in sequence). Spec branches pushed: `issue-127-play-online` (1 new scenario, red), `issue-128-box-names` (7 scenarios red on main, 14 pass). #126 has no spec (restructure; parity gate).
- Requests 001 and 002 (PM-raised, Answered): Follow-ups recorded. 003-005 were raised by the curator.

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
1. Shorter box names: in #128.
2. Hidden-form rewards and hint step 3 say why the unit's other cells are out (3/3 at it22): next after #128; spike message length at 360x740 on the #128 figures.
3. Reward/hint marks follow-ups (it24 R1-R3, unchanged from `memory/wiki/backlog.md` item 1).
4-10. As `memory/wiki/backlog.md` items 4-10, unchanged; drop the "Open concerns" C1 (Pages) and C2 (granularity), both answered.
