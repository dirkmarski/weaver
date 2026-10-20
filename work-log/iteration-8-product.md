# Work Log: Iteration 8 (product manager)

- Product manager: weaver-agents (product-manager agent, Claude Opus 5.5), session `46a62a2f-31a7-4db9-8c77-8e3d5044bf18`
- Run type: "Deliver the next iteration" (scoping run)
- Branch: `iteration-8` (worktree scratchpad/wt-iteration-8)
- Lead work log: `work-log/iteration-8.md`

## Status
- [x] Context read: product strategy (unchanged: teach techniques progressively, reward learning first), NEW test strategy, iteration 7 PM log (ordered candidates), lead's iteration 8 log, README, hint/generator code.
- [x] `governance/LOG.md` NOT read (as instructed).
- [x] Design spike for "Make Hard teachable" (PM prototypes scratchpad/pm-proto8/spike.js, walk.js).
- [x] Scope decided (see Decision).
- [ ] Issues raised on GitHub.
- [ ] Log committed and pushed.

## Starting point (2026-10-20)
main = 6807c23. Iteration 7 output on top of iteration 6: Hint prefers the less-applied single (#30), "not counted" messages (#31). No open issues.
Tests: 2,025 lines (sudoku.test.js 1125, frozen oracle 752, generator.test.js 121, fixture 27) vs ~912 lines product. `node --test`: 128 tests, ~15 s. Six sweep tests take ~15.0 s of it (4.4 s, 4.0 s, 2.6 s, 2.1 s, 1.1 s, 0.7 s: hintFor-with-hidden walks, the frozen hintFor/creditEntry comparisons, the 200-puzzle walk, findHiddenSingle notNaked oracle). Everything else together is < 0.3 s.

## Test strategy (new, from Dirk) - what it means for me
- Testing is planned, proportionate: golden path, edge cases, error conditions; NO brute force across all values.
- My role: acceptance only, "sufficient testing to accept the feature". So no PM oracles with 100k-4M checks as in iteration 7. Acceptance = acceptance criteria checked one by one, a short play.js run of the golden path and the key edge cases, README check of changed sentences, and persona sessions where the change is user-facing.
- Dirk logged "testing grows out of proportion to the product". I agree from the numbers above, and the iteration-7 PM oracles were part of that culture.

## Design spike: Make Hard teachable (2026-10-20, PM prototypes, 200 seeded Hard puzzles, seeds 80000-80199)
Method: fill naked/hidden singles (as Hint does) until the wall; then check whether ONE elimination of a technique (basic candidates from the grid, notes ignored) exposes a naked or hidden single.
- First wall: avg 38.5 empty cells. One step exposes a single: pointing 57/200 (28.5%), claiming 58, naked pair 58, hidden pair 82, pointing or claiming 62, any of the four 112 (56%).
- Whole puzzle, singles + "pointing that exposes a single" (placement-based, as a Hint would teach): 57/200 puzzles meet pointing at least once; 35/200 (17.5%) are fully solved that way. (Iteration 6 lc.js: locked candidates solve 10/60 stalled Hard puzzles - consistent.)
Conclusions:
1. Next technique = **pointing** (a digit confined to one row/column within a box cannot go elsewhere in that row/column). It is the standard first step after singles, explainable in one sentence, and it is placement-friendly: Hint can explain "pointing, therefore this cell is a single", so the learner still enters a digit and the existing hint/credit flow fits. Hidden pair is more frequent (41%) but conceptually harder; it comes later. Claiming adds only 5 puzzles (62 vs 57); later.
2. On the current Hard level a pointing hint would help in only ~29% of puzzles. So a hint alone does not make anything reliably teachable: a level built for pointing is needed ("solvable by following Hint: singles, then pointing; not by singles alone"). The generator already has the right structure (LEVELS technique/beyond, solvableBy).

## Decision: iteration 8 scope (2026-10-20)
Three issues, delivered in this order:
1. **Right-size the test suite** (tech debt, no product change). Do it FIRST: issue 2 changes hintFor, which would otherwise force maintaining the frozen-oracle comparisons (iteration-7 carry-forward: "delete or replace the next time hintFor changes"). Targets: delete the frozen oracle and the sweeps; replace with targeted cases; < 3 s; a rule -> test mapping in the PR; total test lines about the product size as a guide, not a gate.
2. **Hint teaches pointing at the wall** (when there is no naked or hidden single and one pointing step exposes a single). Two-click hint like the singles; entering the digit shows "Well done! You applied pointing: ...". NOT counted in the tally yet (precedent: #16/#19 hints came before #22 rewards). "none" text updated. Folds in the #31 README nits 9 and 10.
3. **New level "Tricky" between Medium and Hard**: solvable by following Hint (singles, then pointing), not by singles alone; Hard then excludes puzzles that singles + pointing solve. Depends on 2 (same pointing definition).

Why this cut: it is the strategy's core (progressively teach the next technique) and B's top wish four runs in a row. Each issue is shippable and testable alone. Counting pointing (own recognition, tally line, finish text) is the next step and depends on what learners make of the hint.

Personas: no scoping sessions this time. Reason: four runs of consistent evidence on the Hard wall (B) and the spike data answer the scoping questions; persona time is better spent at acceptance on the delivered hint and level (proportionate). Acceptance plan: user-b on Tricky + Hard, user-a or user-c on Tricky (no scripts, no solvers, no source/README).

Not chosen, and why:
- Pointing credit (own recognition, "Pointing" tally line, finish text "Techniques applied"): next iteration; keeps issue 2 small, and acceptance feedback decides the wording.
- Claiming, naked/hidden pairs: later techniques in the same progression.
- Uncounted-entry feedback v2 (reword (b), self-clash message, re-judging): real (B, C) but smaller value than the teaching gap. Candidate 2 for iteration 9.
- Hint example quality, middle hint level, mobile status layout, unit wording, progress across puzzles: unchanged candidates.
- Status-class repo test (iteration-7 carry-forward): needs a product change, so not in the test right-sizing issue (which must not change product code). Candidate when creditEntry is next touched for credit.

## Assumptions
- A learner who has never seen pointing can follow a two-sentence explanation plus tint (box and line) and purple rings on the digit. To check at acceptance.
- A "Well done!" without a count for pointing is acceptable for one iteration. Watch at acceptance; if personas mind, credit becomes iteration 9's first issue (it is planned anyway).
- A fourth level button fits the layout (tester to check 375 px).

## Concerns
- Issue 3 (generator) can be slow to generate Tricky puzzles; the issue requires measurement and the existing 1000 ms cap.
- Right-sizing must not drop coverage silently: the rule -> test mapping and reviewer check guard this.
- Personas are LLM simulations, not users. GitHub Pages / real users still not checked.

## Progress
- 2026-10-20: context read, spike run, scope decided. Next: write the issues (bodies in scratchpad/pm-proto8/issue-*.md), create them, record numbers here, commit and push.
