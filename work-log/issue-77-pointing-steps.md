# Work Log: Issue #77 — pointing explanation as a conclusion line plus numbered steps

- Issue: https://github.com/dirkmarski/weaver/issues/77 (author weaver-agents / PM)
- Iteration 17, lead session `cb27eb6b-ad9f-4cda-935d-15975e0cc9a8`
- Branch `issue-77-pointing-steps` from main e1dd667

## Lead
- 2026-10-21: New lead run in session cb27eb6b (after #76). Fresh start for #77 (no prior branch, PR or issue log). Gate check passed (open, author weaver-agents, PM order comment: #76, #77, #78). Baseline 173/173, skipped 0; ratio 2091/1313 = 1.5925x (cap floor(1.6 x 1313) = 2100, 9 lines of headroom).
- Scope read: text in `pointingHint` (sudoku.js step 2 branch), class switch where the hint text is written to #status (the clear path already resets className), one CSS rule, pins edited in place (unit 938/950/1230/1233, page f-tests around 237), one page display assertion, README pointing sentence.
- Supervision: fixed evidence report per agent; lead spot checks (diff stat vs claim, '-' test lines vs claimed removals, suite, named mutants re-run, exact E1/E2 text from the page, screenshot look).

## Developer

- 2026-10-21: `pointingHint` step 2 rebuilt (conclusion + 3 steps joined with "\n"; BOXNOTE at end of step 1); `#status.steps` (pre-line, left, 36rem) set only for pointing explain; README sentence rewritten. Product 1313 -> 1315 lines, tests 2091 -> 2101 (cap 2104); 173/173 pass, 0 skipped.
- 2026-10-21: Mutants all caught: (a) class never set (1 fail), (b) class for pointing nudge too (1 fail), (c) BOXNOTE after step 2 (2 fails), (d) "\n" -> " " (5 fails). Naked target lies in L outside the box by construction (findPointing: naked needs target in `removed`).

## Reviewer

- 2026-10-21: Reviewed e1dd667..ce2a2f3. AC1/AC2 texts match the issue character for character (both forms, BOXNOTE at end of step 1, "With D ruled out"); naked target is in `removed` (sudoku.js singleAfterStep), so step 2 naming it holds. Every status write resets className (clearResults, fixed message, reward/not-counted, finish, Verify); `steps` only for pointing explain. Suite 173/173, skipped 0; ratio 2101/1315, cap 2104. README: only the pointing "message is" sentence changed.
- 2026-10-21: 9 mutants: killed class never set, class on hidden explain only, "\n" -> " ", step 2 "not in" clause dropped, pre-line removed, text-align removed. Survived: class on all explain texts (page test checks only the nudge as non-pointing, as AC8 allows), max-width/margins removed (not pinned), clear-path className reset removed (no visible effect, each write sets className). Approved with notes.

## Tester

- 2026-10-21: Tester run on ce2a2f3 (real CDP mouse/touch/key input, scripts in scratchpad/test: replay.js, follow.js, layout.js, diff.js, diff2.js). E1/E2 read from the page equal the AC text; 12 Tricky follow-the-hint states (7 naked, 5 hidden, 1 hidden with BOXNOTE) equal an independent regex oracle built from main's text. Replay main e1dd667 vs branch on 48 puzzles x 16 steps (768 statuses): 0 differences except the 11 pointing explanations (class steps, pre-line, left); marks, rings, key, link, tally identical; 3rd/4th Hint same text.
- 2026-10-21: Layout at 375 mobile, 375 desktop, 1280: four lines each start a new line, left-aligned, no horizontal scroll, no overlap with key or link; class removed on digit entry, Verify, New puzzle, level switch. Suite 173/173, skipped 0. Not reached on the page: naked form with BOXNOTE (unit pin only), "Well spotted!" text.
