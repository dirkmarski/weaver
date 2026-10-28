# Iteration 22: product (PM)

PM: claude-opus-5-5, session d2424c00-a6fb-45e6-86ab-53111ee2576f. Started 2026-10-28.

## Status
- Scoping done 2026-10-28. Issues raised, in order: #110, #108 (rescoped), #111. Each spec sits as the first commit on its issue branch. Next: the lead delivers #110, then merges main into the #108 and #111 branches (their specs must then fail on assertions, not on undefined steps). The PM does final verification on executed specs plus test summary reports.

## Direction
- Governance changed after the it21 close (commit 2b7c51f, Dirk): ATDD with Gherkin. The PM writes executable specs in `specs/`; the team owns the DSL and protocol drivers in `spec-implementation/`; specs are executed, not translated; an undefined step fails; red first. `specs-guard.py` blocks writes to `specs/` by anyone but the PM. Test strategy: unit/low-level, executed specs (UAT), PM final verification on executed specs plus test summary reports. None of this exists in the repo yet and memory predates it.
- So it22 = (1) the ATDD foundation, proven on already-shipped behaviour, then (2) #108 delivered spec-first. Smallest increment that ships user value (D16 gate) and puts the new method in place.

## Evidence
- Spike `$WEAVER_SCRATCHPAD/pm-it22/spike.js` (walk: generatePuzzle seeds 1-40 on tricky/tough/hard, fill the first non-pointing/claiming credited single each pass; classifyEntry/creditEntry on the solution digit): own pointing naked 1083, hidden 461; own claiming naked 354, hidden 262 hits. `detail.js` (instrumented copy, internals exported) confirms form/unit for the four spec examples (tricky seeds 1, 2, 4, 2).
- 2026-10-28 PM: while scoping I checked every spec example against main 2b7c51f (`pm-it22/check.js`). own-singles: all 5 match today. #108: 4/4 fail today on the message only (first clause and counts already match). #111: 3/3 differ today only in "its U" on step 3. I also caught and fixed one transcription error of my own in the #111 column grid, found by the check.
- Persona round 1 (`pm-it22/persona-brief.md`; a/b/c; variants T = today, A = final step only, B = elimination + final step). Makes sense: T 1-2, A 3-4, B 5/5/5 on cases 1-2 and 5/5/4.5 on cases 3-4. Phone readability for B on cases 3-4: 2. All three preferred B. Defect in my brief: the grids for cases 3-4 were rendered from the wrong line ranges (two personas flagged it), so round 1's hidden-form scores rest on the text alone.
- Persona round 2 (`pm-it22/persona-brief-2.md`, grids corrected, hidden forms only, X = one sentence, Y = two sentences). Y won 3/3. Makes sense Y: 4/4/3 (both cases); readability Y 3/3/4 against X 2/2/2. Unprompted 3/3: the message does not say why the unit's other cells are out; "the box of rows 4-6 and columns 1-3" is heavy ("top-left box"); a: "that box" is ambiguous in claiming hidden.
- Layout spike (assistant, `pm-it22/layout/`, injected `#status` text, Tricky): the longest text (pointing hidden, box unit) is 7 lines at 360x740, bottom 715.5 (24.5 px spare); at 375x812 bottom 730.6 (81.4 spare). The button row does not move (517.7 / 532.8) and the page does not scroll. The tally drops below the fold (599 -> 762 at 360). This is injected text, not a real entry: #108 AC4 has the tester re-measure after a real entry.

## Decisions
- D1: iteration 22 = #110 ATDD foundation (no product change, spec on shipped own-single rewards), then #108, then #111 (D4 fold-in, split out of #108 so each issue is one behaviour). Reason: the governance requires specs to be executed and red first, so no product work can start without a runner. Proving the runner on shipped behaviour keeps the first ATDD issue free of product risk.
- D2: the it13 ratio cap (`tests/` at most 1.6x product) stays for `tests/`. `spec-implementation/` is measured separately and is not under the cap (about 250 lines budget for #110; reported every PR). Where an executed spec pins a text, redundant unit assertions of it may be removed under the existing mutant-confirmed removal rule. I will revisit the cap at the it22 close, once real sizes are known.
- D3: #108 wording = two sentences, the elimination and then what it leaves (round 2, Y). The #108 gate becomes a mean "makes sense" of at least 4.0 over 12 ratings (4 positions x 3 personas), with no case mean below 3.5. This replaces the per-case 4.0. Reason: the scoping evidence says hidden forms sit near 3.67 until the "why are the other cells out" step exists, and that is a separate, larger behaviour (it23). Naked forms carry the mean. Concern: this lowers the per-case bar for hidden forms, so the it23 candidate below is ranked first.
- D4: the spec layout. Each `specs/<area>/<behaviour>.feature` file is tagged `@issue-N`. Puzzles are 9 one-column rows with `.` for an empty cell. The steps use player wording. Each spec is the first commit on its issue branch, so red is shown when that branch takes #110 from main. The specs stay technology-agnostic: #110 needs only a game-logic driver; a page driver comes when a spec needs one.
- Assumption A1: the domain-level driver (`creditEntry`/`hintFor` text) is acceptable as user acceptance for message texts. The page wiring of `#status` is already covered by page tests and by the tester's on-page layout checks (#108 AC4, #111 AC5).
- Concern C1: memory (wiki, WIP) predates the ATDD governance (commit 2b7c51f). process.md "Test strategy applied" and the read lists need updating at the it22 close (curator).

## Issues
1. #110 ATDD foundation: execute specs/*.feature with the suite (proven on own-single rewards). Branch `issue-110-atdd-foundation` (spec + this log).
2. #108 Own pointing and claiming rewards state every step. Body rewritten, label `enhancement` added. Branch `issue-108-own-step-rewards` (spec).
3. #111 Pointing explanation names the unit in step 3 (hidden form). Branch `issue-111-pointing-unit-name` (spec).

## Backlog (PM, after it22 scoping; supersedes wiki/backlog.md order for items 1-2)
1. #110, #108, #111 (it22, in flight).
2. NEW (raised 3/3 at it22 scoping, before only "watch"): hidden-form rewards and hint step 3 say why the unit's other cells are out (e.g. "rows 5 and 6 already have a 5"). This lifts #108's hidden-form "makes sense" from 3.67. It needs a spike on message length at 360x740 (24.5 px spare today).
3. Shorter box names ("top-left box" or similar) across all messages (a, b, c at it22: "the box of rows 4-6 and columns 1-3" is heavy). It touches every box-name text and the non-breaking box-name item, so it is one issue with a persona A/B first.
4. Then wiki/backlog.md items 2-8 unchanged (claiming follow-ups, explanation follow-ups, mobile remainder, reach, slips, wording, long-term), plus: "that box" is ambiguous when the target is outside the box (claiming hidden, a it22).

## #110 acceptance (PM, 2026-10-28, code head 53d7b63)
- Verified myself: `node --test` 198/198 pass, 0 skipped, 3.9 s; specs only 5/5. AC1-AC8 pass (scenario names `<Feature>: <Scenario> [row values]`; layering grep clean; README Test section has layers, owner, specs-only command; `specs/` unchanged since 24383ae; product and `tests/` unchanged).
- My own checks in a scratch copy (`pm-110/c`): mutant (a) naked-single text -> only `own-singles.feature:22` fails; mutant (b) "shown as not counted" step removed -> 2 undefined at :44, :50; `Rule:` -> `a.feature:2: unsupported keyword`; unknown step -> `a.feature:3: undefined step`.
- D5 (budget): 303 lines against about 250 is accepted. Core chain 208; the extra 95 are the 9 runner self-checks and guards that close silent-pass gaps found in review. From #108 on, `spec-implementation/` growth per issue is mainly steps and drivers. Runner changes need a reason in the PR.
- D6 (known limits): accepted for now. (1) An unused Examples column passes silently: the PM rule is that every Examples column must be used by a step (I check this when writing #108/#111 specs). It goes into the backlog as a small runner guard if a second outline appears. (2) No escaped `\|` in cells: the PM rule is no `|` in spec cell text. Neither limit affects the 5 scenarios.
- Accepted.
