# Issue #97: Hint: key line under the board, invitation below the steps and scrolled into view

- Issue: https://github.com/dirkmarski/weaver/issues/97
- Branch: issue-97-key-under-board

## Lead
- Gate (2026-10-23, lead Claude Opus 5.5, session 541fd2f9-8dfe-4936-a1b6-0c535e8f682f; same session id as #96, new lead run): open, authored by weaver-agents (PM). Fresh start from main 5656017 (no branch, PR or issue log existed).
- Baseline: 174/174, skipped 0. Ratio tests 2204 / product 1379 (sudoku.js+index.html+style.css), cap 2206.4, headroom 2.4.
- Scope incl. Change log 1-2: AC5 now also guards the stage-3 fold at 360x740 (#status ends 38.5 px below on seeds 1, 33; 17.5 px on 8, 7, 12); the AC4 scroll is the fix. AC9 360x740 test asserts invitation, #status and target in view.
- Plan: today #link (under board) = invitation/link, #key (after #next) = key. Swap: #link = link sentence else key (key style), #key slot = invitation (purple), scroll-once (minimal) when the invitation first appears. Ratio: headroom 2.4, so new tests must be paid by adapting existing tests (f1/f1b/f1c/f1e/f1a-tops) and listed removals confirmed by reviewer and tester.
- Walk naming: pins use the page walk of tests/page.test.js (real Hint clicks), not the unit pointingState walk.
- Lesson applied: tester scripts are re-run by the lead with the tester worktree still present; check output timestamps.
- 2026-10-23: developer done (0b1e19e code, 119c6aa log, 2d3bf49 test rename f1f->f1h). 175/175, skipped 0; ratio 2223/1399 (headroom 15.4); no removals. Lead diff check: product +20 (sudoku.js reserve/invite/keyText, showLink, showInvite after focus; style.css swap + #link.selected + #key scroll-margin-bottom 1px). Open for review: ids now semantically swapped (#link = key, #key = invitation); 1px scroll-margin; log mentions f1f (should be f1h). Sequence: reviewer, then rework if any, then tester.
- Persona follow-ups from #96 (out of scope, backlog): "(3 of 3)" at step 2, "(struck)" jargon, struck badge on amber cell, "7-"/"9" hyphen break at 360px, step 1 wording.

## Developer
- Claude Sonnet 5.5, session 541fd2f9-8dfe-4936-a1b6-0c535e8f682f. Code+tests+README commit 0b1e19e.
- Changed: ids stable. `#link` (under the board, 4lh) holds the key, or the link sentence (class `selected`, purple) during a selection; `#key` (after `#next`) holds the invitation (purple). `keyText` state; `unlink()` restores key and invitation; `showLink`; `showInvite()` = `scrollIntoView({block:'nearest'})` called after the focus call in Hint and `revealStep`; `#key` has `scroll-margin-bottom: 1px` (without it the invitation ended 0.1 px below the fold). Tests: `read()` splits key/link/reserve/invite; f, f1, f1a (page-relative tops), f1c, f1e adapted; new f1h (360x740, seeds 1, 8, Medium 1). README Hint section and files list.
- Ratio: product 1399 (+20), tests 2223 (+19), cap 2238.4, headroom 15. Note the brief labels were swapped (tests 2204, product 1379 at baseline).
- Removals: none. Deviations: none.
- Rework 1 (tests only, db4c00c): f1c asserts #link colour/weight (key grey 400, link sentence purple 500; kills f); f1h asserts scrollY 0 before the last Hint (kills i) and a 360x560 Medium seed 1 hidden single scrolls the invitation into view (kills b). Ratio 2232/1399 = 1.595 (headroom 6.4). Mutants b, f, i each fail 1 test; suite 175/175, skipped 0. f1f mentions fixed to f1h.

## Reviewer
- Claude Sonnet 5.5 (claude-sonnet-5-5), session 541fd2f9-8dfe-4936-a1b6-0c535e8f682f. Head reviewed 2d3bf49 (base 400f386). Full suite at 2d3bf49: 175 pass, 0 fail, 0 skipped.
- Verdict: approve (no blocking findings; two test gaps for the lead to rule on).

Findings
1. Low, sudoku.js:1119-1123 and 1137, 1160 (scroll scope). Scroll is called only from revealStep and the Hint handler, and only does anything when `hatchedRings` is set, i.e. at stage 3 (and a hidden single). Checked by reading: second Hint at stage 3 (`steps.shown >= 3`) skips revealStep and does not call showInvite; Next step at stages 1-2 and selection/revert/Verify/Notes/value change never call it. Focus-then-scroll is safe: focus() brings the target in first, nearest-scroll then moves the least, and f1h pins target, `#status` and invitation in view at 360x740 for seeds 1, 8 and Medium 1. One edge: pressing Hint again on a hidden-single explanation (hint set, no steps) re-runs the handler, so the invitation reappears and is scrolled to again if the user had scrolled away; arguably not "first appears" but harmless (focus() on the target scrolls there anyway). No change requested.
2. Low (test gap, AC4), tests/page.test.js f1h. Mutant (b) survives: the Hint handler's own showInvite is only reached by the hidden single, and Medium seed 1's invitation is already in view at 360x740, so the call is never needed. AC4 names the hidden-single explanation, so a test needing a scroll there (e.g. a shorter viewport for Medium seed 1, or a hidden-single seed whose invitation is below the fold) would guard it. Recommend lead decides; cost about 3 test lines.
3. Low (test gap, AC4), mutant (i) survives: removing the `if (hatchedRings)` guard still passes. Without it the empty `#key` would be scrolled to at stages 1-2 and on every Hint. No test asserts scrollY unchanged by an action that must not scroll. Mutant (j) (extra showInvite on a second stage-3 Hint) also survives; it is behaviourally near-equivalent because focus() scrolls to the target anyway. A single assertion (scrollY before/after the stage 1 and 2 clicks, or after the second Hint at stage 3 with the page scrolled to top) would kill (i).
4. Info, style.css:65 `scroll-margin-bottom: 1px` on #key. Sound but a sub-pixel workaround: without it the invitation ends 0.1 px below the fold (mutant (g) killed by f1h, so it is guarded). Alternatives (padding-bottom on the invitation or on body, or scroll-margin-bottom of 0.5rem) are equally valid; a larger margin would give a little visual breathing room and robustness to fractional layout. Keep; optional improvement to a rem value.
5. Info, naming. See recommendation below.
6. Info, ratio. tests 2223 / product 1399 (sudoku.js+index.html+style.css) = 1.589, within 1.6. 24 '-' lines in sudoku.js, style.css and tests; all are modified lines paired with a '+' replacement (selectors, key/link fields, expected values); no assertion or behaviour removed. No line packing seen: new code is multi-line, one statement per line; the long `read()` return line was already packed before and only gained fields.
7. Info, README (AC8). Changes are confined to the Hint section key-line/link-line/invitation descriptions and the files-list entry; they state the new places and the scroll, and say the key returns after a selection ends and the invitation stays. Wording accurate against the code.

Naming recommendation: keep `#link` (reserve) and `#key` (invitation) for #97. The ids are misleading now, but the code carries comments at the declarations (sudoku.js:804-805) and the README files list names the roles. A rename (e.g. #reserve / #invite) costs about 13 changed lines, net zero: index.html 2, sudoku.js 2 declarations (+ comments), style.css 3 selectors, tests about 5 getElementById/selector uses (the state field names s.key/s.link are not ids), README 1; it also touches the files-list sentence, which AC8 limits to the key/link descriptions. Suggest a small follow-up chore if the lead wants it, not in this issue.

Mutants (apply, `node --test`, `git checkout`)
| # | Mutant | Result |
|---|---|---|
| a | drop showInvite in revealStep | killed (f1h) |
| b | drop showInvite in Hint handler | SURVIVED (finding 2) |
| c | scrollIntoView block 'start' | killed (f1h) |
| d | unlink sets reserve.textContent = '' | killed (6 tests) |
| e | invite not set during selection (showLink clears it) | killed (2 tests); my first form of this mutant was a no-op, discarded |
| f | remove `#link.selected` rule | SURVIVED (see below) |
| f2 | remove `reserve.className = 'selected'` | killed (3 tests) |
| g | remove scroll-margin-bottom | killed (f1h) |
| h | keyText not cleared in clearHint | killed (5 tests) |
| i | drop `if (hatchedRings)` guard | SURVIVED (finding 3) |
| j | extra showInvite on second stage-3 Hint | SURVIVED (finding 3, near-equivalent) |

Mutant f: removing the `#link.selected` CSS rule survives, so the purple style of the link sentence (AC1a "today's purple style") is not pinned; the test checks only text and the className-driven state. Low; a getComputedStyle color check on the reserve during a selection (and grey for the key) would kill it and also covers AC1's key-style requirement. Recommend lead rules; about 2 test lines.

Not checked: real touch/mouse input and visual screenshots (PM/tester AC10), 375x812 and 1280 layouts, steady-page tops across all states (AC6, only the existing f1a page-relative check was read), rule-level CSS cascade beyond the diff, the other README prose outside the Hint section and files list, governance/LOG.md (not read by design).

## Tester
- Claude Sonnet 5.5 (claude-sonnet-5-5), session 541fd2f9-8dfe-4936-a1b6-0c535e8f682f. Head tested 0364e9f (detached worktree wt-test97), baseline main 5656017. Scripts and README: scratchpad i97/test-97 (`run.sh`: ALL PASS, 588 step snapshots in 33 runs, 24 clearing cases; suite 175 pass, 0 fail, 0 skipped).
- Method: real page, real CDP input (touch at 360x740 and 375x812 with mobile emulation; mouse at 1280x900); walk of tests/page.test.js (real Hint clicks, singles typed until the pointing nudge); Tricky seeds 1, 8, 33, 7, 12 by two paths (Hint, and Next step x2) plus Medium seed 1; each action starts from scrollY 0; the same actions replayed on main for board comparison.
- Verdict: AC1 PASS, AC2 PASS, AC3 PASS, AC4 PASS, AC5 PASS, AC6 PASS, AC7 PASS, AC8 PASS, AC9 PASS. AC10 is PM.

Evidence
- AC1/AC3: key text literal per stage (seed 1 digit 2, seed 8 digit 8, Medium 1 digit 5), grey rgb(68,68,68) weight 400 13.6px; link sentence purple rgb(74,15,138) weight 500 while selected; #link empty at no hint and nudge; invitation (purple, 500) only at stage 3 with hatching and the hidden single, below #status, kept during selection.
- AC2: selection (hatched cell, ring) replaces the key; reverts by another empty cell, a non-ring given and an outside click (h1) bring it back. Per action, board classes (td class + data-d), status text and focused cell are identical to main in all 588 snapshots.
- AC4 (scrollY from 0 to after the arrival step, Next step path = Hint path): 360x740 seed 1 105 (inv bottom 739.11/740), seed 8 84 (739.11), Medium 1 0 (inv bottom 697.11); 375x812 seed 1 32 (811.16/812), seed 8 0 (801.16), Medium 1 0; 1280x900 seed 1 57 (899.17/900), seed 8 78 (899.17), Medium 1 0 (851.17). Seeds 33/7/12 likewise (84/105 at 360, 0/32 at 375, 57/78 at 1280). Scroll amount is the minimum (bottom within 0.9 px of the fold) and none when in view. Every other action (nudge, Hint stage 1/2, Next step 1-2, 3 selections, 3 reverts, Notes on/off, second Hint) leaves scrollY unchanged (0). At 1280 the stage-2 Next step button is below the fold (known, out of scope): the harness scrolled it into view first (9 or 30 px), the app then scrolled only the remainder. Focus after the last step is the target cell in every run.
- AC5 (360x740, 375x812 touch): key text inside the viewport at every stage, e.g. 360 seed 1 stage 3 key 340.7..404.7, seed 8 361.7..425.7; after the last step: seed 1 inv bottom 739.1, #status 463.5..673.5, target 10.3..46.7; seed 8 739.1, 484.5..673.5, 139.6..176.0; Medium 1 697.1, 568.5..631.5, 115.3..151.7 (vh 740). 375x812: seed 1 inv bottom 811.2, #status 551.6..761.6, target 83.3..121.4; seed 8 801.2, 583.6..751.6, 228.6..266.7; Medium 1 696.2, 583.6..646.6, 115.3..153.4 (vh 812). Seeds 33, 7, 12 pass too.
- AC6: page-relative tops constant within every run across no hint, nudge, stages 1-3, selections, reverts, Notes, second Hint (tolerance 0.01 px): 360x740 grid 79.80, buttons 517.73; 375x812 grid 79.80, buttons 532.78; 1280x900 grid 106.80, buttons 729.80; #link height 64.00 everywhere.
- AC7: value change, New puzzle, Verify and difficulty change clear key, link sentence and invitation and all hint marks, with and without a selection (both Tricky 1 and Medium 1); Notes toggle and a note keep key and invitation (a selection ends, as on main); every outcome equals main's.
- AC8: README diff vs 5656017 is 3 lines (two Hint-section sentences, one files-list entry); changes are only the key/link/invitation placement and the scroll; read sentence by sentence against behaviour, accurate ("the least needed ... not at all if it already is, nothing else scrolls", key back after selection, invitation stays, `#link` reserve / `#key` invitation in the files list).
- AC9: `node --test` in the worktree: 175 tests, 175 pass, 0 fail, skipped 0.
- Screenshots (360x740, in scratchpad i97/test-97/shots): last-step-tricky-seed1, last-step-tricky-seed8, last-step-medium-seed1, stage2-seed1, selection-seed1.

Findings
1. Info. Clicking Notes while a hatched cell is selected ends the selection (key returns) though the cell keeps focus; a second tap on the already focused cell does not reselect. Identical to main for the link sentence; not a regression.
2. Info. Ids #link (reserve) and #key (invitation) are swapped in meaning (reviewer noted; follow-up chore, not in scope).
No blocking or medium findings.

Not tested
- Persona/PM acceptance (AC10). Real keyboard (arrow key) selection. Desktop widths other than 1280x900, phone heights other than 740/812 (the page test covers 360x560 for the hidden single). Safari/Firefox (Chrome headless only). Scroll starting from a non-zero scrollY (each action started at 0). Mutation testing (reviewer did).
