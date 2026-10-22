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
- Reviewer: Claude Sonnet 5.5 (claude-sonnet-5-5), session `19338c12-dbf9-46b7-b92b-1a81aef47c6d`. Code head 57192db (5d708cf adds logs only). Suite 173/173, skipped 0; product 1359, tests 2171 (cap 2174); no removed test lines (`git diff -- tests | grep '^-'` shows only the file header).
- Verdict: APPROVE (state machine, all clearing paths, AC1/AC2 text, AC8 and README read as correct); two minor test gaps, not blocking.
1. Minor (AC4/AC6): `#next-step` font/padding and `#next` left alignment and gap are unpinned in tests; CSS mutants M11-M14 survive. Fix: one page case comparing computed fontSize/padding of #next-step with #verify and left edge of #next-step with #status.
2. Minor (AC3): Hint advancing before the last step does not need its target-cell focus line to pass; M5 survives. Fix: in f1a assert `document.activeElement` is the target after the third Hint click.
3. Info: Tab/Enter/Space and real touch/mouse not driven (native button; PM/tester).
Mutants (14 real): slice off by one, hide early, label off by one, no early return, steps not cleared, button not cleared, focus early, click listener removed: all killed. Survived: Hint with `shown < 4` (equivalent, no visible change), M5 above, padding, font, text-align center, margin: see findings 1-2.

## Tester
