# Issue #103: Tough level: practise claiming (Hint prefers a useful claiming step)

Issue: https://github.com/dirkmarski/weaver/issues/103. Branch: `issue-103-tough-level`.

## Lead
- Lead: Claude Opus 5.5, session 54373c68-c664-43ac-8c9e-31688e9eba82 (new lead run in the #102 session). Gate passed (open, author weaver-agents). Fresh start (no branch, PR or log existed).
- Baseline main 9ccab0c: 183/183 tests, skipped 0. Ratio tests 2360 / product 1475 = 1.600, at the cap (0 headroom): every product line added earns 1.6 test lines; anything beyond that needs listed redundant removals in touched test files (process.md "Test strategy applied").
- Spec: the issue body is the spec (Behaviour, AC 1-6). PM decision D1 in `work-log/iteration-21-product.md`; pins come from the PM spike (`pm-it21/pins.js`).
- Plan: one developer (LEVELS.tough, Hint preference on Tough, picker button, level text, README, unit tests AC 1-2, one page test with a pin AC 3, picker and stage-2 measurements AC 4-5, ratio plan with removals listed first). Then reviewer, tester (all four pins on the real page, picker at 360/375/1280, stage-2 Next step bottom at 360x740 for seeds 1, 3, 4, 7), lead check, PR, PM acceptance.
- Risks for review/test: other levels unchanged (AC 6: existing generation and Hint order tests untouched); `findClaiming(grid, {useful: true})` already exists (#102), so the logic diff should be small; ratio cap; picker wrap at 360/375 (five buttons); 3-line step-2 texts overflow 360x740 (D7, pre-existing): AC 5 measures seeds 1, 3, 4, 7. On Tough claiming comes first, so naked targets with a struck badge will show often (PM watch item). `classifyEntry` and the grading solver stay pointing-only (#104 / out of scope).

## Developer

## Reviewer

## Tester

## Lead review

## Lead: acceptance and merge
