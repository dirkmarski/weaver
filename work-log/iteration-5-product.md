# Work Log: Iteration 5 (product manager)

- Product manager: weaver-agents (product-manager agent, Claude Opus 5.5), session `837e6f16-ac38-40a0-a305-8fd4bdeb185d`
- Run type: "Deliver the next iteration" (fifth iteration run)
- Branch: `iteration-5` (worktree scratchpad/wt-iteration-5)
- Lead work log: `work-log/iteration-5.md`

## Status
- [x] Context read: product strategy (unchanged: teach techniques progressively; reward learning and applying them; solving comes second), development practices, CHARTER, the iteration 4 PM log and its candidate list, README, sudoku.js (hint logic and UI glue), index.html.
- [x] `governance/LOG.md` NOT read: Dirk denied agents read access (49db917). Earlier logs that cite it are not re-checked against it.
- [x] Pages re-checked 2026-10-19 (`gh api repos/dirkmarski/weaver/pages`): 404, still not enabled. No real users yet.
- [x] Prototype: entry classifier with an independent brute-force candidate oracle (scratchpad/pm-proto5/proto.js) and a UI mock (scratchpad/pm-proto5/mock.png).
- [x] Scope decided: one feature issue (below).
- [ ] Issue raised (number filled in below once created).
- [ ] Delivery by the lead.
- [ ] PM user acceptance.

## Starting point (2026-10-19)
main has generated Easy/Medium/Hard puzzles, Verify, notes, keyboard play and a Hint button that teaches naked singles (#16) and hidden singles (#19) with a nudge, an explanation and a "Well done!" message when the hinted digit is entered. No open issues or PRs.

The strategy says the product "rewards users for learning and applying the skills". Today the only reward is for following a hint. A learner who applies a technique on their own, which is the actual goal of the teaching, gets no recognition, and there is no sense of progress at all.

## Options considered
1. **Recognise and reward unaided applications, plus a per-puzzle tally** (merges iteration 4 candidates 1 and 2 in their smallest form). Directly serves the reward half of the strategy, now that two techniques exist. Reuses the existing detectors' building blocks (usedMask/spotsFor). No persistence, no "learned" state. **Chosen.**
2. Persistent progress / per-technique "learned" state across puzzles. Needs product design on what "learned" means and adds storage and reset UX. Better as the next step once the per-puzzle recognition exists and is judged. Next candidate.
3. Next technique tier (pointing pairs / naked pairs) so Hard becomes learnable. Teaching half; valuable, but the reward half has been deferred twice. Candidate.
4. Technique explainer page. Later, after feedback.
5. Polish (stable status-line height). Small; not chosen to keep the iteration to one issue.
6. Pages: needs Dirk. Carried as an open question.

## Decision
Iteration 5 delivers **one issue: recognise when the learner applies a naked or hidden single (with or without a hint), reward it in the status line, and show a per-puzzle tally** "Techniques applied in this puzzle". It is the smallest increment that rewards applying the skills rather than solving.

## Prototype evidence (PM, before writing the issue)
Classifier: an entry of digit D into empty cell X is a naked single if D is X's only candidate; otherwise a hidden single in the first of box, row, column where X is D's only place; otherwise nothing. Grid with conflicts: nothing.

Simulated learner entering the true solution in random order, 30 seeded puzzles per level:
- Easy: 1277 entries, credited 1104 (naked 833, hidden box 207 / row 35 / column 29), not credited 173. First entry of a puzzle credited in 14/30.
- Medium: 1475 entries, credited 1166 (naked 870, box 213, row 40, column 43), not credited 309. First entry credited 4/30.
- Hard: 1651 entries, credited 1231 (naked 873, box 264, row 38, column 56), not credited 420. First entry credited 4/30.

Reading: the detector discriminates. Early "correct but unjustified" entries are mostly not credited (Medium/Hard first entry: 4/30), while late-game entries are almost always singles (true: each is then a single). Hidden singles are applied on Easy too, so the tally will show both techniques at every level. Box hidden singles dominate again.

UI mock: the reward line under the buttons, then a small block "Techniques applied in this puzzle" with one line per technique, below the status line. It reads clearly and does not compete with the grid.

## Product decisions settled in the issue (see issue body, E1-E10)
- Credit only for a digit entered (Notes off) into a cell that held no value; overwrite gets none.
- Classification on the grid just before the entry; notes ignored; any conflict in that grid means no credit; naked takes precedence over hidden; hidden units box, then row, then column.
- With a hint: entering the showing hint's digit in its cell = "with a hint" (existing "Well done!" text unchanged). Anything else is judged as an unaided entry.
- Unaided texts: "Well spotted! You found a naked single on your own: row R, column C is D." / "Well spotted! You found a hidden single in its U on your own: row R, column C is D."
- Tally per puzzle, each cell credited at most once per puzzle (the message still shows on a repeat). Reset on choosing a level; hidden on the difficulty prompt; not persisted.
- Pure exported logic with every ordering rule unit tested; existing texts and behaviour unchanged.

## Out of scope
Persistence, "learned" states, scores, streaks, badges; penalties for wrong entries; comparison with the stored solution; new techniques; telling the learner why an entry got no credit; layout-shift polish; Pages.

## Assumptions
- Rewarding late-game "trivial" singles is acceptable: they are genuine applications, and the tally is about applying, not difficulty. Revisit on feedback (e.g. weight hidden singles or only count when several cells were open).
- Naked precedence means a learner who reasoned via a hidden single may be told "naked single". Both are true; naked is the simpler explanation and mirrors the hint order.
- No credit while any conflict exists, silently. Consistent with Hint refusing on conflicts. A learner might wonder why; the message stays blank as today.
- Rules-only like Hint and Verify: a single that follows from an earlier wrong (non-conflicting) value is still credited.
- Teaching/reward choices are from general knowledge, not user research.

## Concerns
- Still no real users (Pages 404). Fifth iteration judged by the PM alone.
- The tally could be gamed by delete/re-enter; mitigated by crediting each cell once per puzzle.

## Progress
- 2026-10-19: context read, Pages re-checked, prototype and mock done, scope decided. Next: raise the issue, record the number here, commit and push, hand back to the lead.
