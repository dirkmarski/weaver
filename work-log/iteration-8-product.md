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
- [x] Issues raised (label enhancement): #35, #36, #37. Bodies: scratchpad/pm-proto8/issue-tests.md, issue-pointing.md, issue-tricky.md. Delivery-order comments posted on each.
- [x] Log committed and pushed.

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
- 2026-10-20: issues created:
  - #35 Right-size the test suite to the test strategy (remove the frozen oracle and sweeps, no product change)
  - #36 Hint teaches pointing when there is no single (not counted yet)
  - #37 New level Tricky: solvable by singles plus pointing (Hard then needs more)
  Order: #35 -> #36 -> #37, sequential (#36 changes hintFor that the frozen tests pin; #37 reuses the #36 pointing definition). Hand-off to the lead.
- Product decisions pinned in #36: pointing only at the wall (singles keep priority); search order box -> digit; target = first new single in reading order; both forms (naked/hidden) taught; box named by its row/column ranges (no box numbering convention); "Well done! You applied pointing" with NO count; new "none" text; #31 README nits folded in.
- Product decisions pinned in #37: level name "Tricky" between Medium and Hard; "solvable by singles plus pointing" = following Hint solves it; Hard additionally excludes such puzzles; givens band measured by the developer (cap rule: <= 1/50 capped).
- Acceptance approach (per test strategy): criteria one by one, short play.js golden path + key edges, README changed sentences, personas for #36/#37 (not #35). No PM oracles or sweeps.
- Next PM step: acceptance of #35 when relaunched. A play tool will be needed for persona sessions (iteration-7 play.js lived in another session's scratchpad; ask the assistant to rebuild a minimal one if it is not available).
- 2026-10-20: #35 acceptance (PR #38, head cb0f7a5): ACCEPTED, no conditions. Only a work-log change since the reviewed/tested head 479aad7. I checked it myself in the detached worktree scratchpad/pm-35 (now removed). Product files are identical to main; the frozen file is gone; targeted cases read; loops are at most 10 seeds per level (walk 6); no oracles; 123/123 pass in 0.23-0.31 s (was ~15 s). Size: 1041 test lines vs 912 product lines (1.14x), above the guide but justified in the PR, so I accepted it. I read the mapping and it matches. README is correct. Mutation checks by the reviewer (13) and the developer (12) were all caught. No personas, per the test strategy. Decision comment on PR #38: issuecomment-6280297330. I did not merge.
- Review nits N1-N3 (optional test trimming and formatting) are folded into #36 by the lead. Agreed, and noted on #36 (issuecomment-6280297593): they are not #36 acceptance criteria and must not grow the suite.
- Next PM step: acceptance of #36 once it is delivered.

## Next-iteration candidates (ordered, start of iteration 8)
1. Count pointing: own recognition in classifyEntry, a "Pointing" tally line + definition, finish text "Techniques applied", text (a) mentions pointing. Fold in the status-class testability carry-forward.
2. Uncounted-entry feedback v2 (B, C).
3. Claiming (and later pairs) with their levels.
4. Hint example quality; middle hint level; mobile status layout; unit wording; progress across puzzles.
- 2026-10-20: #36 acceptance STARTED (PR #39, head 784881c). Detached worktree scratchpad/pm-36. Play tool scratchpad/pm36play/play.js (module API, mirrors the index.html hint/setCell wiring, text grid; `start hard <seed> wall` plays singles via Hint to the wall). Own checks done: 130/130 pass (0.19 s); index.html/style.css unchanged; README read; play-through at seed 3 (naked, r1c5=7) and seed 8 (hidden, r4c1=8) matches the issue byte-exact, tally unchanged, next hint is a single again; wrong digit and digit elsewhere give the existing "not counted" text. Persona sessions running: B seed 11, C seed 8, A seed 3 (state files scratchpad/pm36play/user-*.json, start copies user-*.start.json).
- 2026-10-20: #36 acceptance (PR #39, head 784881c): **ACCEPTED, no conditions.** Decision comment: PR #39 issuecomment-6280570471. I did not merge. The only change since the tested head 99ccf0a is the work log.
  - Criteria 1-5 PASS (details in the PR comment). The 375 px check relies on the tester's round 1.
  - Personas (play.js only, no scripts or source): C (seed 8, hidden) solved it from the nudge and explained it correctly, 4/5. A (seed 3, naked) explained it correctly but took the rings partly on trust, 3/5. B (seed 11) followed the nudge, solved the puzzle, 4/5. Key question answered YES for both learners new to pointing.
  - "Well done!" with no count: all three personas noticed that "You applied pointing" appears while the block has no Pointing line or definition. B misread "Singles applied: ... 15 with a hint" as including pointing. I checked: 15 = 6 + 9 singles before the wall, so pointing was not counted. Assumption "acceptable for one iteration" holds, but the inconsistency is real. Counting pointing stays candidate 1 for iteration 9, now with persona evidence.
  - N5 decision: folded into #37 together with the "learn two techniques" nit (#37 issuecomment-6280566101). Reason: #37 edits the README Hint section anyway. Wording only, not worth a round 3.
  - Setup artefact (not a product issue): the play tool's `wall` setup keeps the hint counts from the pre-played singles, which confused A ("where did 17 come from?"). Next time, reset the tally or tell the persona.
  - New candidate notes (hint example quality): a trivial confinement (all empty box cells on one line, seed 11); rings on every D include irrelevant ones; confined cells and the removed cell are not marked; in the hidden form the unit is not tinted.
  - Worktree scratchpad/pm-36 removed.
- Next PM step: acceptance of #37 once it is delivered (B on Tricky and Hard, a less experienced persona on Tricky; watch the uncounted "Well done!" again; check N5 and the "two techniques" nit).
- 2026-10-20: #37 acceptance STARTED (PR #40, head 542a5db; only a work-log change since the tested head 7dde9ba). Detached worktree scratchpad/pm-37. Play tool scratchpad/pm37play/play.js (copy of the #36 tool: points at pm-37, uses S.seededRng so seeds match the developer table, shows "Difficulty: X", new `wallreset` setup = pre-play singles to the wall then reset the counts). Own checks so far: 137/137 pass (0.60 s); diff read (LEVELS, solvableBy, index.html button, README); README N5 and "two" fixes present and true; golden path seed 1 (pointing at hint 13, r3c3=7, naked) and seed 3 (hint 20, r5c5=1, hidden) match the developer's table; seed 1 followed to the end: no "none", "Puzzle solved! Singles applied: 0 on your own, 53 with a hint" (53 singles + 1 pointing = 54 empty). Product sample (seeds 1-10, hintFor default order): 8 puzzles need 1 pointing step, 2 need 2; givens 27-30, mostly 27. Personas running: B (Medium seed 2 calibration, Tricky seed 3 from empty, Hard seed 1 glance), C (Tricky seed 1, wallreset start, explained).
- 2026-10-20: #37 acceptance (PR #40, head 542a5db): **ACCEPTED, no conditions.** Decision comment: PR #40 issuecomment-6280786479. I did not merge.
  - Criteria 1-4 PASS. README N5 and "two" fixes are present and true. My own 375 px screenshot (iframe): no scroll, Hard alone on row 2.
  - Personas (play tool only; I grep-checked both transcripts: no scripts, no source reads):
    - B (Medium calibration, then Tricky seed 3 from an empty grid, then a Hard glance): solved with 1 hint (the pointing step); "the right shape for a first non-single lesson"; the ladder Medium -> Tricky -> Hard "seems right"; explained pointing correctly; 4/5.
    - C (Tricky seed 1, wallreset start, explained): solved with 6 hints; "Medium with one new idea"; explained pointing correctly and checked it on the grid; 4/5. C's "no pencil marks" is a play-tool artefact (the page has Notes).
    - Key question: YES.
  - Lead point 1 (one pointing step per puzzle): enough to meet and understand pointing, not enough to practise it. Candidate for later ("practice density"), after counting pointing.
  - Lead point 2 (givens overlap 27-29): acceptable. Levels are defined by technique; givens are not shown to players; nobody noticed.
  - 375 px wrap: acceptable. Added to the mobile layout candidate (a 2x2 level grid).
  - The uncounted pointing is now 5/5 personas' top issue across #36 and #37. B: finish "Singles applied: 49 on your own, 0 with a hint" after a hint "feels wrong and a little dismissive".
  - Worktree scratchpad/pm-37 removed. The play tool stays at scratchpad/pm37play/play.js (supports tricky, seededRng, wallreset).
- **Iteration 8 product status: complete.** #35, #36 and #37 are all ACCEPTED. Merging #40 is the lead's step.

## Next-iteration candidates (ordered, end of iteration 8)
1. Count pointing: own recognition in classifyEntry; a "Pointing" tally line + grey definition; the finish text recaps all techniques (not "Singles applied" only); text (a) mentions pointing. Fold in the status-class testability carry-forward. (5/5 personas)
2. Pointing hint visuals: mark the box cells the digit is confined to (and the line); ring only the relevant digits; tint the unit in the hidden form; avoid trivial confinements as the example. (B, C at #36 and #37)
3. Tricky practice density: at least 2 pointing steps per Tricky puzzle (measure generation time); after 1, so repetition is rewarded.
4. Uncounted-entry feedback v2 (B, C; B again at #37: a correct pair deduction is "a bit cold").
5. Claiming, then pairs, each with its level.
6. Mobile layout (2x2 level buttons at 375 px, status layout); middle hint level; unit wording; progress across puzzles.
