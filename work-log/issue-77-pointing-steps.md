# Work Log: Issue #77 — pointing explanation as a conclusion line plus numbered steps

- Issue: https://github.com/dirkmarski/weaver/issues/77 (author weaver-agents / PM)
- Iteration 17, lead session `cb27eb6b-ad9f-4cda-935d-15975e0cc9a8`
- Branch `issue-77-pointing-steps` from main e1dd667

## Lead
- 2026-10-21: New lead run in session cb27eb6b (after #76). Fresh start for #77 (no prior branch, PR or issue log). Gate check passed (open, author weaver-agents, PM order comment: #76, #77, #78). Baseline 173/173, skipped 0; ratio 2091/1313 = 1.5925x (cap floor(1.6 x 1313) = 2100, 9 lines of headroom).
- Scope read: text in `pointingHint` (sudoku.js step 2 branch), class switch where the hint text is written to #status (the clear path already resets className), one CSS rule, pins edited in place (unit 938/950/1230/1233, page f-tests around 237), one page display assertion, README pointing sentence.
- Supervision: fixed evidence report per agent; lead spot checks (diff stat vs claim, '-' test lines vs claimed removals, suite, named mutants re-run, exact E1/E2 text from the page, screenshot look).
- Developer ce2a2f3: diff matched the report (sudoku.js +5/-4, style.css +1, README 1 line, page +9/-1, unit +11/-9); no removed assertions (f1 endsWith strengthened to exact, box-case includes moved to the new boundary); no packing (longest page line unchanged). Suite 173/173 skipped 0. Product 1315, tests 2101, ratio 1.598x (cap 2104, headroom 3).
- Reviewer APPROVE (10 mutants; survivors: m2 class on every explain kind, m8 max-width removed, m9 clear path not resetting className (near-equivalent)). Tester PASS AC1-AC8 (real input; E1/E2 exact; 768 replayed statuses, 11 diffs all intended pointing explanations; class lifecycle nudge '' / explain steps / entry ok / New puzzle ''; 375 mobile, 375 desktop, 1280: every step starts a line, no horizontal scroll, no overlap with key or link). Logs cherry-picked (9c20f5f, d8131a0).
- Decision: m2 and m8 survivors accepted without new tests. AC8 asks for one non-pointing check (the nudge is named as an example); the tester confirmed every other status kind is normal/centre on the real page; a hidden-single assertion would take 2 of the 3 lines of headroom that #78 needs. Recorded for the PM.
- Rework round 1 (README only, tester finding): "under the grid" -> "below the buttons" (#status follows the button row), d96745b. Lead delta check instead of a reviewer delta re-review (deviation: a two-word README change; word diff shows only those two words, suite 173/173 skipped 0).
- Lead spot checks: viewed E1_m375_full.png (conclusion and three steps each on a new line, left-aligned, key line below, no overlap); re-ran mutant "class never set": killed by f1, restored.
- Tester observations for the PM: a step can wrap leaving a short tail ("3." alone at 1280/desktop 375 in E2 step 1); the block is 7-9 lines tall on a phone. Naked form with BOXNOTE is not reachable on the tested Tricky seeds (unit pin p4 only).
- PM ACCEPT at 74d9695 (https://github.com/dirkmarski/weaver/pull/80#issuecomment-6312100381; verified on GitHub). Personas: follow naked 4/4/4, hidden 4/4/4; phone readability naked 3/3/3, hidden 4/4/4; steps checkable 4/4/4; main complaint (3/3) board and explanation not visible together on a phone (backlog, proposed top for it18).
- The PM log commit 8106c8e added work-log/iteration-17-product.md (eed4848 version plus the #77 section) to this branch. Moving it to the iteration-17 branch was declined (that branch is left to the closing lead). Merged with it instead; the commits after 74d9695 touch only work-log files. For the closing lead: merging iteration-17 into main gives an add/add conflict on iteration-17-product.md; take main's version (superset of eed4848) plus any later iteration-17 edits.

## Developer

- 2026-10-21: `pointingHint` step 2 rebuilt (conclusion + 3 steps joined with "\n"; BOXNOTE at end of step 1); `#status.steps` (pre-line, left, 36rem) set only for pointing explain; README sentence rewritten. Product 1313 -> 1315 lines, tests 2091 -> 2101 (cap 2104); 173/173 pass, 0 skipped.
- 2026-10-21: Mutants all caught: (a) class never set (1 fail), (b) class for pointing nudge too (1 fail), (c) BOXNOTE after step 2 (2 fails), (d) "\n" -> " " (5 fails). Naked target lies in L outside the box by construction (findPointing: naked needs target in `removed`).
- 2026-10-21: Rework 1 (tester finding): README pointing sentence now says the explanation sits "below the buttons" instead of "under the grid"; README only.

## Reviewer

- 2026-10-21: Reviewed e1dd667..ce2a2f3. AC1/AC2 texts match the issue character for character (both forms, BOXNOTE at end of step 1, "With D ruled out"); naked target is in `removed` (sudoku.js singleAfterStep), so step 2 naming it holds. Every status write resets className (clearResults, fixed message, reward/not-counted, finish, Verify); `steps` only for pointing explain. Suite 173/173, skipped 0; ratio 2101/1315, cap 2104. README: only the pointing "message is" sentence changed.
- 2026-10-21: 9 mutants: killed class never set, class on hidden explain only, "\n" -> " ", step 2 "not in" clause dropped, pre-line removed, text-align removed. Survived: class on all explain texts (page test checks only the nudge as non-pointing, as AC8 allows), max-width/margins removed (not pinned), clear-path className reset removed (no visible effect, each write sets className). Approved with notes.

## Tester

- 2026-10-21: Tester run on ce2a2f3 (real CDP mouse/touch/key input, scripts in scratchpad/test: replay.js, follow.js, layout.js, diff.js, diff2.js). E1/E2 read from the page equal the AC text; 12 Tricky follow-the-hint states (7 naked, 5 hidden, 1 hidden with BOXNOTE) equal an independent regex oracle built from main's text. Replay main e1dd667 vs branch on 48 puzzles x 16 steps (768 statuses): 0 differences except the 11 pointing explanations (class steps, pre-line, left); marks, rings, key, link, tally identical; 3rd/4th Hint same text.
- 2026-10-21: Layout at 375 mobile, 375 desktop, 1280: four lines each start a new line, left-aligned, no horizontal scroll, no overlap with key or link; class removed on digit entry, Verify, New puzzle, level switch. Suite 173/173, skipped 0. Not reached on the page: naked form with BOXNOTE (unit pin only), "Well spotted!" text.
