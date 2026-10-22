# Issue #85: Phone layout, compact page top below 560 px

Issue: https://github.com/dirkmarski/weaver/issues/85 (PM, it18 issue 3 of 3). Branch: issue-85-compact-top from main 638c0fa (#84 merged, PR #87).

## Lead
- Lead: Claude Opus 5.5 (claude-opus-5-5), session `28d2788e-8588-47d1-8000-5904c97e526f`. Fresh start (no branch, PR or log existed); new lead run in the same session id after #84.
- Gate: issue open, authored by weaver-agents (PM), no comments.
- Baseline: product 1324, tests 2118, cap floor(1.6 x 1324) = 2118, headroom 0. #85 pays for its own test lines (1.6 per product line); removals listed and confirmed by reviewer and tester, no line packing. If the ratio or feasibility blocks an AC: report to the director (who asks the PM), no own scope cut.
- Plan: developer (CSS in the existing max-width 559px rule, one assertion in an existing 375 px page test) -> reviewer and tester (own worktrees, foreground, one at a time; tester reuses $WEAVER_SCRATCHPAD/test-84 scripts) -> lead spot checks -> PR -> PM acceptance incl. persona round (AC6) -> merge commit with the accepted sha.

## Developer
- Developer: Claude Sonnet 5.5 (claude-sonnet-5-5), session `28d2788e-8588-47d1-8000-5904c97e526f`. Commits: CSS 63fe51e, test 03ed19b, this log.
- Means (4 lines in the existing max-width 559px rule): h1 1.4rem, margin 0 0 0.25rem; caption 0.8rem (12.8 px) with padding-bottom 0.25rem; #level margin 0 0 0.25rem; #status margin-top 0.5rem. The spike values alone left Tricky seed 8 at 740.5 px (0.5 px short) with status margin 0.5rem; the caption padding-bottom 0.5rem -> 0.25rem closes it (status bottom 736.5).
- Measured (headless Chrome, mobile emulation, main 638c0fa vs branch): grid top 106.8 -> 79.8 at 360/375/390 (27 px higher, AC1 needs 18). 360x740 seed 8: #status 568.5-736.5 (<= 740). Seed 1: conclusion and steps 1-2 end at 673.5; #status bottom 757.5 (step 3 cut, as intended). Caption 12.8 px, not clipped; h1 22.4 px. Button row top constant across states (no hint, 2 hints, Verify, New puzzle + Easy): 517.7 (360), 532.8 (375), 729.8 (1280, unchanged). 1280x900 picker and Tricky seed 1 after Hint twice screenshots byte-identical to main.
- Test: one assertion in f1e (375 px): grid top <= 88. Mutant (main style.css) fails it with 106.8. Suite: 172 pass, 0 fail, 0 skipped.
- Ratio: product 1324 -> 1328 (index 42, style 148, sudoku.js 1138); tests 2118 -> 2119 (page.test.js 549); cap floor(1.6 x 1328) = 2124, headroom 5; ratio 1.596 (before 1.600). No removals, no line packing.
- Known limits: the 30 px digits typed in the grid cells are larger than the 22.4 px title (on main the title was 32 px, so it was the largest); a title of 30 px would cost about 9 px of the gain and break AC2 seed 8. README and style.css header comment do not describe the phone header; unchanged.

## Lead review of the developer round
- Developer 63fe51e (CSS, 4 lines in the max-width 559px rule), 03ed19b (f1e: grid top <= 88 at 375 px), 1edd71e (log). Lead re-run: `node --test` 172/172, skipped 0; product 1328, tests 2119, cap 2124 (headroom 5). No removals, no packing.
- Diff check: all four rules inside the media query, so >= 560 px cannot change; pin 88 sits under AC1's limit (106.8 - 18 = 88.8) with 8 px slack over the measured 79.8.
- AC3 concern (cell digits 30 px > title 22.4 px): asked the PM. D8 (fc9a789, issue comment 6329612420): "largest text" = prose/heading text, board digits excluded; 22.4 px passes.

## Reviewer
- Reviewer: Claude Sonnet 5.5 (claude-sonnet-5-5), session `28d2788e-8588-47d1-8000-5904c97e526f`. Code head reviewed: 03ed19b (branch head later log-only). Compared to main 638c0fa.
- Verdict: APPROVE.
1. Product diff is 4 CSS lines inside the existing max-width 559px rule; nothing outside it (no leak). Measured 360/375/390: h1 22.4 px, caption 12.8 px (2 lines, scrollHeight = clientHeight, not clipped), no overlap, no h-scroll; grid top 79.8 (main 106.8, -27). 560 px grid top 106.8 and 559 px compact: boundary correct. AC1-AC5, AC7 met; AC3 per D8 (title 22.4 px > all page prose).
2. AC2 measured: 360x740 seed 8 status bottom 736.5 (vh 740, visible); seed 1 conclusion and steps 1-2 visible (step 2 ends 674).
3. Test: one assertion in f1e, grid top <= 88 at 375 (actual 79.8, 8 px slack); width override is reset in the existing finally. No line packing. Guards the combined top, not each rule (see 5).
4. Ratio: product 1328, tests 2119, cap floor(1.6 x 1328) = 2124. numstat on index.html, sudoku.js, tests: 1 added, 0 removed. No removals.
5. Suite: 172 pass, 0 fail, 0 skipped. Mutants (copy, not committed): killed: h1 rule dropped, h1 2rem. Survived: caption rule dropped, #level rule dropped, #status margin-top dropped, caption padding-bottom 0, h1 margin 0.5rem. Survivors matter for AC2 (status margin-top is what closes seed 8; the 88 px bound is deliberately loose) but AC8 asks for one assertion on the compact top only; the rest of AC2 is verified by tester measurement/PM acceptance. Optional, not blocking.

## Tester
- Tester: Claude Sonnet 5.5 (claude-sonnet-5-5), session `28d2788e-8588-47d1-8000-5904c97e526f`. Code head tested: 03ed19b (later commits log-only, verified by diff --stat). Baseline main 638c0fa. Headless Chrome, real CDP touch (375) and mouse (1280).
- Verdict: PASS.
1. AC1: grid top 79.8 vs main 106.8 at 360, 375, 390 (-27.0, needs >= 18).
2. AC2: 360x740 scroll 0, Hint twice: seed 8 status 568.5-736.5 (vh 740, fully visible); seed 1 conclusion ends 589.5, steps 1-2 end 673.5 (visible; step 3 and status end 757.5 are below the fold, not required).
3. AC3 (D8): h1 22.4 px, every other prose text smaller (h2 19.2, status 17.6, buttons 16); caption 12.8 px, 2 lines, inside its box and the viewport; no overlap or h-scroll at 360/375/390, picker and game (Notes On, explanation shown).
4. AC4: 1280x900 picker and Tricky seed 1 Hint x2 screenshots byte-identical to main; 560, 600, 768 px layout offsets and font sizes identical to main (picker and game).
5. AC5: replay vs main 375 touch 408 steps and 1280 mouse 408 steps, 0 diffs; #76 hint row top steady across 9 states at 360 (517.7), 375 (532.8), 1280 (729.8).
6. AC6: screenshots in scratchpad test-85/shots (persona-360x740-seed{1,8}.png, persona-375x812-seed{1,8}.png; main-* for comparison).
7. AC7: README mentions no header, title or caption sizes (only cell sizes).
8. AC8: node --test 172 pass, 0 fail, 0 skipped; main style.css in a copy fails the f1e assertion (grid top 106.8 > 88), 171 pass 1 fail; product 1328, tests 2119, cap 2124; test diff vs main is +1 line, 0 removals.
- Not tested: real devices, browsers other than headless Chrome, widths other than the listed ones, persona rating (PM). measure.js printed "Enter on focused button -> picker shown: false" (inherited #84 probe, not an AC here; replay shows 0 diffs vs main).
