# Work Log: Iteration 3 (product manager)

- Product manager: weaver-agents (product-manager agent, Claude Opus 5.5), session `6ec914a0`
- Run type: "Deliver the next iteration" (third iteration run)
- Branch: `iteration-3`
- Lead work log: `work-log/iteration-3.md`

## Status
- [x] Context read: **new product strategy (commit 25f6735)**, development practices, charter, README, iteration 2 PM log (candidate list), issue #14, current app (index.html, sudoku.js incl. solvableBy/verify/keydown glue, style.css)
- [x] Pages re-checked: still not enabled (API 404), so there are still no real users
- [x] Scope decided (one feature issue, with #14 bundled in)
- [x] Issue raised: #16 "Teach the first technique: a Hint button for naked singles (includes #14)" (https://github.com/dirkmarski/weaver/issues/16)
- [x] #14 commented as bundled into #16 (https://github.com/dirkmarski/weaver/issues/14#issuecomment-6257773701)
- [ ] Delivery by the lead (PR closing #16 and #14)
- [ ] User acceptance by the product manager
- [ ] Iteration closed

## Starting point (2026-10-19)
main has generated puzzles (Easy/Medium/Hard), digit entry, Verify, New puzzle, pencil-mark notes and keyboard play (arrows + N). Open: #14 (README docs). **The strategy changed:** the aim is now to teach solving techniques progressively and to reward learning and applying them. Solving is secondary. Small increments and early user testing still apply.

The app currently teaches nothing. It only checks rules ("no hints" is literally in the README). Every earlier candidate was a convenience feature for a player who can already solve.

## Options considered (iteration 2 candidates, re-ranked against the new aim, plus new ones)
1. **Hint that teaches the naked single (new).** It is the first technique in the progression and the one Easy is built on (Easy is generated to be solvable by naked singles alone), so a learner on Easy can always get a hint. It is small: one button, one pure helper, a status message, a highlight. It serves both halves of the aim: it teaches (a nudge, then an explanation) and it rewards applying the technique (praise when the player places the digit). **Chosen.**
2. **Technique lesson page / tutorial (new).** Bigger, and it needs content design. Better shaped after we see how in-game hints land. Later.
3. **Hidden-single hint (new).** It is the natural next step (it is what Medium needs). It builds on option 1's mechanism, so it should come after it. Strong candidate for iteration 4.
4. **Learning rewards / progress (new):** for example, counting techniques applied without a hint, or a per-technique "mastered" state. This is central to the aim, but it needs the teaching mechanism first and ideally feedback on what feels rewarding. Persisting progress overlaps old candidate 2 (persistence). Candidate for iteration 4 or 5.
5. **Publish the site (Pages).** Still the only route to real user testing. Still blocked on admin rights (Dirk). Carried as a concern.
6. **#14 README accuracy.** Docs only. Bundled into #16 because the same README section must change anyway.
7. Old candidates (persistence / confirm on New puzzle; auto-remove peer notes; row/column/box highlight; revisit A2) now rank **below** the teaching work. Auto-removing peer notes would actually *remove* practice of the skill we teach, so it is deprioritised further. Highlighting comes back as part of the hint (scoped to the hinted cell only).

## Decision
Iteration 3 delivers **one issue: #16, Hint for naked singles, with #14 bundled in**. Rationale: it is the smallest increment that makes the product teach something and reward applying it, which directly serves the new aim. It reuses existing pure functions (buildGrid, findConflicts) and adds one technique detector. It is easy to test end to end (AC6: an Easy puzzle can be solved by following hints alone). It keeps the one-issue rhythm that worked in iterations 1 and 2.

## Product decisions settled in the issue (H1-H10)
- A Hint button between Verify and Notes. No shortcut.
- Hints work on givens plus entered values. Notes are ignored.
- Naked single = an empty cell with exactly one candidate. If there are several, the first in reading order is used.
- Check order: conflicts ("fix them first", no flags), then full grid, then none ("needs another technique"), then step 1.
- Step 1 = nudge: highlight the cell, tint its row/column/box, focus it, name the technique, "click again to see why". Step 2 = explanation (the digit plus the 8 seen digits). **The hint never fills the cell.**
- Reward: placing the hinted digit shows "Well done! You applied a naked single ...". Other values clear the hint silently.
- Clearing: any value change, Verify, New puzzle, choosing a level. Note changes do not clear it. One status message at a time.
- All message texts are fixed verbatim, and the decision logic is pure and unit tested.

## Out of scope (explicit in the issue)
Other techniques; auto-fill/reveal/solve; comparing with the stored solution; scores/streaks/badges/persistence; lesson pages/glossary; a Hint shortcut, live candidates, auto-notes; generator/Verify changes; mobile.

## Quality gates required
Developer: H10 unit tests and README (including #14). Reviewer: trace the hint state through every clearing path and the reward check, confirm the unchanged input paths, and check the README sentence by sentence. Tester: headless walkthrough on all levels, the full Easy hint-only solve to "Solved!", the conflict/full/none cases, the clearing paths, screenshots, and the README claims including #14, with the full walkthrough repeated every rework round. PM user acceptance before close.

## Assumptions
- **Nudge first, explain on request** teaches better than revealing straight away, because the learner gets a chance to apply the reasoning. Not validated with users.
- **Never auto-filling** is right for a learning product: placing the digit is the "apply" step, and that is what we reward. A player who only wants to finish can still read step 2 and type the digit. This is acceptable because solving is secondary.
- "Reward" for v1 is just a positive message. That is the smallest testable form. Richer rewards (counts, mastery, persistence) are deferred until we have a teaching mechanism to attach them to.
- Basing hints on the current grid (not the stored solution) is consistent with Verify being rules-only. If the player has entered a wrong but non-conflicting value, a hint can still be a valid naked single *for the current grid* while leading away from the true solution. Accepted for v1, because the technique is applied correctly and Verify/conflicts will surface the error later. Revisit on feedback.
- Choosing the first naked single in reading order (not a random one) is fine for v1 and makes the behaviour testable. It may feel repetitive. Revisit on feedback.
- "Early user testing" is still the PM's acceptance from the tester's evidence (no real users yet).

## Concerns and ambiguities
- **No route to real users (carried over, now more serious).** The new aim is about learning outcomes, and that cannot be judged without learners. Pages is still 404 and needs Dirk (admin). Every teaching assumption above is PM judgement only.
- On Medium/Hard the hint will often say "needs another technique". That is honest, but it may disappoint. It is mitigated by the hidden-single hint being the next candidate.
- The keydown/input glue gets one more state (hint) that crosses value changes. That is a regression risk for input paths (the iteration 1 D1 lesson). The reviewer is told to trace it.
- The status line is shared by Verify and Hint. "One message at a time" is decided, but the reviewer should confirm there is no stale class/text.

## Progress
- 2026-10-19: Scope decided, #16 raised, #14 bundled (comment posted), work log written and pushed on `iteration-3`. Handed back to the lead for delivery. Next PM step: user acceptance of #16 (and #14) when the lead reports delivery.

## Next-iteration candidates (not yet decided)
1. Hidden-single hint (extends the #16 mechanism; serves Medium).
2. Learning rewards/progress: for example, naked singles applied without a hint, a per-technique "learned" state, possibly persisted.
3. A short technique explainer (glossary/lesson) reachable from the hint.
4. Publish the site (Pages), if Dirk enables it.
5. Old convenience candidates (persistence of puzzle state, confirm on New puzzle, highlighting) only where they support learning.
