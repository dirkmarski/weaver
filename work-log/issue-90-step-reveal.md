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
- Ratio: product 1359 (+31), tests 2141 (+22, all in tests/page.test.js), cap 2174, headroom 33. No assertions removed.
- Known limits: Tab/Enter/Space activation is native `<button>` behaviour, not driven in a test; the 1280 px mouse case and touch input are not measured here (PM, AC12).
