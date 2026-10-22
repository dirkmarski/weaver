# Issue #90: Hint reveals the pointing explanation one step at a time (Next step button)

Issue: https://github.com/dirkmarski/weaver/issues/90 (PM, it19 issue 1 of 2). Branch: issue-90-step-reveal from main 84c7c9d.

## Lead
- Lead: Claude Opus 5.5 (claude-opus-5-5), session `19338c12-dbf9-46b7-b92b-1a81aef47c6d`. Fresh start (no branch, PR or log existed).
- Gate: issue open, authored by weaver-agents (PM), label enhancement, no comments.
- Baseline: product 1328, tests 2119, cap floor(1.6 x 1328) = 2124, headroom 5. Test lines are paid for by product lines (1.6 each); removals only if listed, reviewer- and tester-confirmed, never an AC-required case; no line packing.
- Plan: developer (button, reveal state, README, unit + page tests) -> lead check -> reviewer and tester (own worktrees, foreground, one at a time) -> rework if needed -> PR -> PM acceptance incl. persona round (AC12) -> merge commit with the accepted sha.

## Developer
- Developer: Claude Sonnet 5.5 (claude-sonnet-5-5), session `19338c12-dbf9-46b7-b92b-1a81aef47c6d`.
- Design: the button lives in its own `<p id="next">` right after `#status` (not inside it), so `#status` holds exactly the shown lines and its final text is today's text; `#next` shares `#status.steps`' 36rem left-aligned column, margin-top -0.5rem to sit close under the steps. Reveal state `steps = { lines, shown }` in `render()`, reset in `clearResults()` (every clearing path). While a pointing explanation shows, Hint reveals the next step and does not redraw (once complete it is a no-op plus target focus). No new pure helper, so no new unit test.
- Measured (headless Chrome, mobile, scroll 0, Tricky; button bottom after 2nd Hint / after 1st Next step; final status bottom): 360x740 seeds 1 and 8: 675.9 / 717.9 (<= 740); seed 8 final 736.5 (unchanged, 3.5 px slack); seed 1 final 757.5 (as today, over). 375x812: 690.9 / 732.9 (<= 812). Grid, link and button-row tops constant; scrollWidth = viewport.
- Ratio: product 1359 (+31), tests 2171 (+52, all in tests/page.test.js), cap 2174, headroom 3. No assertions removed.
- Known limits: Tab/Enter/Space activation is native `<button>` behaviour, not driven in a test; the 1280 px mouse case and touch input are not measured here (PM, AC12).

## Lead review of the developer round
- Developer 75710b5 (product), cf6fa4d (page tests), 57192db (README), 38d8ff8/17b5a0f (log). Lead re-run: `node --test` 173/173, skipped 0. Product 1359, tests 2171, cap 2174, headroom 3. No removals.
- Diff read in full (index.html +1, style.css +3, sudoku.js +29/-2): button in its own `<p id="next">` after `#status` (status text stays the shown lines only); reveal state reset in `clearResults()`; Hint early-returns while `steps` is set. Mutant `steps.shown > 3` for the final focus: killed (1 fail).
- Open for review/test: Tab/Enter/Space and real touch/mouse not driven; Verify/New puzzle/level clearing only by code reading; key line now sits below the button while it shows (not in AC6's steady list).

## Reviewer

## Tester
- Tester: Claude Sonnet 5.5 (claude-sonnet-5-5), session `19338c12-dbf9-46b7-b92b-1a81aef47c6d`. Head tested 57192db (5d708cf adds logs only). Verdict: PASS, 0 defects. Real CDP touch (360x740, 375x812, mobile) / mouse (1280x900) / key input; main 84c7c9d compared programmatically; scripts and README in the session scratchpad `test-90` (612 checks, 0 failed; a mutant `shown >= 4` gives 13 + 18 fails).
1. AC1: 2 lines + "Next step (2 of 3)" on seeds 1 and 8 at all 3 viewports; box-case clause kept (Tricky seed 4 path). 2. AC2: stage 2 = first 3 main lines, label "3 of 3", final text == main's 4 lines (both seeds, all viewports).
3. AC3: Hint advances with the same text/label as the button; Hint after completion leaves text and cells unchanged.
4. AC4: button 16px, padding 6.4 16 (same as Verify/Hint/Notes) at 360/375/1280; left delta 0.00 px; gap to the last step 9.6 px; touch, click, Tab+Enter, Tab+Space all work.
5. AC5: focus on the target after the 2nd Hint, on the button after Enter/Space and after a touch/mouse tap (from the target cell, no focusout interference), on the target after the last step; scrollWidth <= clientWidth everywhere.
6. AC6: grid, link and Verify/Hint/Notes rects identical at all 4 stages and equal to main's. 7. AC7: button bottom 675.9 / 717.9 at 360x740 (both seeds), 690.9 / 732.9 at 375x812; seed 8 final status bottom 736.5 (<= 740); seed 1 757.5 as on main.
8. AC8: nudge, naked, hidden, conflict, full, none messages: no button, whole DOM identical to main; marks, key, link and ring/hatched link clicks identical at every stage.
9. AC9: value change, Verify, New puzzle, level choice clear the button and steps, fresh Hint = nudge; Notes keeps state; hinted digit gives main's "Well done!". 10. AC10: README paragraph matches (one line changed). 11. AC11: `node --test` 173 pass, 0 fail, skipped 0.
- Not tested: AC12 (PM), the 4 persona scores, real devices, Safari/Firefox. Observed (not a defect): the button stays blue-tinted after a tap (default focus/hover look).
