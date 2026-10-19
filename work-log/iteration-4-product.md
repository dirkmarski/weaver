# Work Log: Iteration 4 (product manager)

- Product manager: weaver-agents (product-manager agent, Claude Opus 5.5), session `be31ef20-6bb6-42ee-8172-b7e2d9801847`
- Run type: "Deliver the next iteration" (fourth iteration run)
- Branch: `iteration-4` (worktree scratchpad/wt-iteration-4)
- Lead work log: `work-log/iteration-4.md`

## Status
- [x] Context read:
  - product strategy (unchanged since iteration 3: teach techniques progressively, reward learning and applying them, solving comes second);
  - development practices;
  - governance LOG;
  - the iteration 3 PM log and its candidate list;
  - the #16 issue and issue log;
  - the current app (sudoku.js including findNakedSingle/hintFor/hintApplied/solvableBy, index.html, style.css, README).
- [x] Pages re-checked on 2026-10-19 with `gh api repos/dirkmarski/weaver/pages`: **404 Not Found, still not enabled.** There are still no real users.
- [x] The choice rules were prototyped (scratchpad/pm-proto/proto.js, 40 seeded puzzles per level). The results are below.
- [x] Scope decided: one feature issue.
- [x] Issue raised: #19 "Teach the second technique: hidden singles in the Hint button" (https://github.com/dirkmarski/weaver/issues/19)
- [x] Delivery by the lead: PR #20 (branch `issue-19-hidden-single`). Two rounds; code at 1b9418d, head 83d6c2d.
- [x] PM user acceptance of #19: **ACCEPTED** 2026-10-19 (https://github.com/dirkmarski/weaver/issues/19#issuecomment-6258511184)
- [ ] Iteration closed: this happens when the lead merges PR #20 and closes #19. Nothing else is open in iteration 4.

## Starting point (2026-10-19)
main has:
- generated puzzles (Easy/Medium/Hard), Verify, notes and keyboard play;
- since #16, a Hint button that teaches the naked single: a nudge, then an explanation, then "Well done!" when applied, and it never fills in.

There are no open issues or PRs. Easy can be finished with hints alone. Medium is generated to need hidden singles. So after a few hints, the learner on Medium gets "needs another technique", and the product does not teach it. That is the visible gap in the progression.

## Options considered
1. **Hidden-single hint.** This is the next technique in the progression and exactly the one Medium needs. It extends the #16 mechanism (same nudge, explain and reward flow, same clearing paths), so it is small and low risk. It makes Medium learnable with hints alone. It serves "progressively teach new techniques" directly. **Chosen.**
2. **Learning rewards / progress.** For example: count techniques applied, reward unaided applications, a "learned" state, persistence. This is central to the strategy's reward half. But:
   - with only one technique taught, progress has little to show;
   - it needs product design (what counts as learned, and whether unaided detection is fair);
   - without real users, we cannot tell what feels rewarding.
   It is better with two techniques in place. **Lead candidate for iteration 5.**
3. **Technique explainer (lesson or glossary from the hint).** This is useful, but the hint texts already explain in context. It needs content design. Later, ideally after feedback.
4. **Publish (Pages).** It is still 404, and enabling it needs Dirk (admin). This is not something the team can deliver. It is carried as a concern and an open question.
5. **Convenience features** (persist the puzzle, confirm on New puzzle, highlighting). They do not advance teaching. They stay below options 1-3.

## Decision
Iteration 4 delivers **one issue: #19, hidden singles in the Hint button**. It is the smallest increment that moves the learner one technique further. It reuses the whole #16 flow and adds one pure detector plus a unit-specific display. The end-to-end proof is easy to test: a Medium puzzle solved by hints alone.

## Prototype evidence (PM, before writing the issue)
The prototype applied naked first (reading order), then hidden (first cell in reading order; box, then row, then column; digits ascending), repeated until stuck:
- Easy: 40/40 solved, 0 hidden singles needed (Easy stays naked-only).
- Medium: 40/40 solved. Hints used: 1730 naked, 169 box, 43 row, 23 column.
- Hard: 0/40 solved. All got stuck, as expected (more advanced techniques are needed).
- For every hidden single found, the unit had at least 2 other empty cells, so the step-2 sentence "every other empty cell ..." is never vacuous. This follows logically: a unit with only one empty cell gives a naked single, and naked singles are checked first.

## Product decisions settled in the issue (D1-D9)
- Order: conflicts, then full grid, then naked single (unchanged #16), then hidden single, then none. The new none text is "No naked or hidden single right now. At this point the puzzle needs another technique."
- Hidden single = a digit missing from a unit that only one empty cell of the unit can take. The target is the first such cell in reading order; units are checked box, then row, then column; digits ascending.
- Step 1: same target highlight and focus, but **only the unit is tinted**. Fixed text naming the unit, with no digit.
- Step 2: same highlight, plus **every cell holding D is marked**. Fixed text: "... because every other empty cell in its U already has a D in its X or Y." The X/Y wording depends on the unit.
- Reward: "Well done! You applied a hidden single: row R, column C is D."
- Clearing is identical to #16 H8. The D marks clear through `clearResults`.
- Pure, exported, unit-tested logic. The naked path stays byte-for-byte unchanged. Refactor the shared unit arithmetic (#16 N3).

## Out of scope (explicit in the issue)
- Techniques beyond hidden singles.
- Choosing the technique.
- Progress, scores, streaks, badges or persistence.
- Rewards for unaided applications.
- A lesson page or glossary.
- Candidates, auto-notes, extra highlighting.
- Auto-fill, reveal, solve, or comparison with the solution.
- A Hint shortcut.
- Changes to the generator or Verify.
- Mobile work.
- Pages.

## Quality gates required
- **Developer:** D9 tests, the README, and a smoke test solving Medium by hints.
- **Reviewer:**
  - check the detector against D2/D3;
  - trace the hint state and the D marks through every clearing path and through both rewards;
  - confirm the naked path is unchanged;
  - check the README sentence by sentence.
- **Tester:**
  - Easy, Medium and Hard walkthroughs, with expected values computed independently from the DOM;
  - 3 or more Medium hint-only solves, each including a hidden-single hint;
  - an Easy regression solve;
  - the Hard none case;
  - screenshots;
  - a full re-run in every rework round.
- **PM user acceptance** before close.

## Assumptions
- **Naked singles always come first** (even on Medium), so that the simplest technique is reinforced and the progression is explicit. A learner might prefer to be shown the "new" technique sooner. Revisit on feedback.
- **Box before row before column.** Box hidden singles are the easiest to spot and the most common (as the prototype confirms), so they are the best first teaching examples. The reading-order target choice keeps the behaviour deterministic and testable, as in #16.
- **The step-2 D marks** make the reasoning visible. The learner can see each D that rules out the other cells, which matters more for hidden singles than for naked singles: the reason lives in other rows and columns, not in the cell's own peers. This is new visual scope, but small (one class through the existing clear path). The naked step 2 is left unchanged to keep this increment small. Making it consistent can follow on feedback.
- **Step 1 does not name the digit**, which mirrors #16: the learner gets a chance to apply the reasoning first.
- The technique definitions and the teaching order (naked, then hidden; box first) come from general sudoku-solving knowledge, not from user research (see governance LOG, "The product manager decides from training knowledge, not research"). The prototype checks the behaviour against our own generator only.
- "Early user testing" is still the PM's acceptance based on the tester's evidence.

## Concerns and ambiguities
- **There is still no route to real users.** Pages is still 404 (re-checked 2026-10-19), and Dirk's admin rights are needed. This is the fourth iteration with every teaching assumption judged only by the PM. It is raised again to the lead as an open question.
- **Wrong but non-conflicting entries** (carried over from #16): a hint is valid for the current grid, but it could lead away from the true solution. The hidden-single logic has the same property. This is accepted, since hints are rules-only like Verify.
- **Hard puzzles will show the "none" message often.** That is honest, and the next technique tier (pairs or pointing) is a later candidate.
- The hint display now differs by technique (all three tinted for naked, the unit only for hidden). The reviewer should confirm that the glue stays one path and that no stale classes remain after switching between a naked and a hidden hint (for example, a value change in between).
- The existing unit test "no naked single" may use positions that now contain a hidden single. The issue tells the developer to re-assert those as hidden.

## User acceptance of #19 (2026-10-19)
**Decision: ACCEPTED.** Comment: https://github.com/dirkmarski/weaver/issues/19#issuecomment-6258511184

**What I did:**
- **Worktree.** Detached worktree at the PR head (scratchpad/pm-ua19). Only the work log changed since 1b9418d. `node --test` 88/88.
- **Texts.** D1.5, D4, D5 (including the X/Y map) and D6 checked verbatim in `hintFor` and `hintApplied`. The naked strings are byte-identical to main.
- **Logic.** Read `findHiddenSingle` and `spotsFor` against D2/D3: OK. `solvableBy` now reuses `spotsFor` (the N3 refactor). The D marks are cleared via `clearResults`.
- **Own oracle.** A brute-force candidate oracle (scratchpad/pm-ua19-check/c.js) on 30 seeded Medium puzzles, solved by following hints only:
  - 30/30 solved;
  - 150 hidden-single hints (box 103, row 28, column 19);
  - 0 mismatches on target, digit, unit or "no naked single first".
- **By hand.** Verified the box hint (r3c4 = 2), the row hint (r1c8 = 2) and the column hint (r3c7 = 6), including why the earlier cells and units did not qualify.
- **Screenshots** (scratchpad/test-19b), looked at as a learner. The purple D marks are distinct and readable. **They make the reasoning visible**: the blocking Ds in the other rows and columns are easy to find from the tinted unit. The reward clears everything. Hard shows the none text. Naked is unchanged.
- **README.** Checked sentence by sentence: all literally true. A minor nuance in "the one box, row or column where the digit has just one place" is not blocking.
- **Lead decisions.** I agree with both: N5 not taken, and the layout shift is out of scope.

## Lessons (iteration 4)
- **Prototyping before writing the issue paid off.** The D3 order, the "never vacuous" step-2 sentence and the Easy/Medium/Hard expectations were all confirmed before development. Delivery took one rework round, and nothing in it was blocking.
- **Spelling out every text verbatim (D1-D6) again made acceptance mechanical and quick.** Keep doing this.
- **The tester's independent oracle together with my own small oracle** gave high confidence cheaply. A 50-line PM oracle script is worth it for logic features.
- **Round-1 gaps were in test coverage (the digit order) and README nuance**, not in behaviour. Issues should keep demanding that every ordering rule is unit tested explicitly.
- **There are still no real users.** Every teaching judgement, including "the D marks make the reasoning visible", is still the PM's alone.

## Next-iteration candidates (not decided)
1. **Learning rewards and progress (lead candidate for iteration 5).** For example: techniques applied (with or without a hint), a per-technique "learned" state, possibly persisted. There are now two techniques to show progress across.
2. Rewarding unaided applications of a technique the learner has been taught (detecting that a value entered without a hint was a naked or hidden single).
3. A technique explainer reachable from the hint.
4. The next technique tier (pointing pairs or naked pairs), so that Hard becomes learnable.
5. Refining the step-2 D marks to emphasise only the Ds that actually block a cell of the unit (on feedback).
6. Small polish: a stable status-line height, so the page does not shift between one-line and two-line messages.
7. Pages, if Dirk enables it. This is still the main blocker to real feedback.

## Progress
- 2026-10-19: Pages re-checked (404). Choice rules prototyped. Scope decided. #19 raised. This log was written and pushed on `iteration-4`. Handed back to the lead for delivery. Next PM step: user acceptance of #19 when the lead reports delivery.
- 2026-10-19: The lead reported #19 delivered on PR #20 (round 2: review APPROVE, tester full re-run PASS). PM user acceptance done: **ACCEPTED**, comment posted on #19. Iteration 4 is complete once the lead merges PR #20 and closes #19. The PM does not merge.
