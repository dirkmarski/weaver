# Work Log: Iteration 7 (product manager)

- Product manager: weaver-agents (product-manager agent, Claude Opus 5.5), session `246ca1dd-69c1-44b3-80a4-65e176ec6193`
- Run type: "Deliver the next iteration" (seventh iteration run)
- Branch: `iteration-7` (worktree scratchpad/wt-iteration-7)
- Lead work log: `work-log/iteration-7.md`

## Status
- [x] Context read: charter, product strategy (unchanged), development practices, README, iteration 6 PM and lead logs, lead's iteration 7 log.
- [x] `governance/LOG.md` NOT read (Dirk denied agents read access).
- [x] Play tool copied from iteration 6 to scratchpad/pm-proto7.
- [x] Simulated user sessions. user-a/b/c agent types called DIRECTLY: all three launched successfully (no "not found"). Sessions i7-usera (seed 7101), i7-userb (7202, Hard suggested), i7-userc (7303, Medium suggested).
- [x] Scope decided: two small issues.
- [x] Issues raised: #30 and #31 (label enhancement). Bodies: scratchpad/pm-proto7/issue-hint-balance.md, issue-ack.md.
- [ ] PM acceptance (later run).

## Starting point (2026-10-19)
main = e81999c, iteration 6 output: Easy/Medium/Hard, Verify, notes, keyboard, Hint (naked then hidden single), rewards with tally, plain definitions under the tally, automatic finish message. No open issues or PRs.
Carried candidate list (iteration 6, end): 1 hidden-single mastery; 2 finish-line clarity and next step; 3 make Hard teachable; 4 progress across puzzles; 5 feedback clarity; 6 notes usability.

## Progress
- 2026-10-19: context read, log opened. Next: persona scoping sessions on main.
- 2026-10-19: user-a, user-b, user-c launched directly as agent types (the cascade works; no assistant fallback needed). Prompts forbid scripts, solvers, source files and the README. Waiting for reports.
- 2026-10-19: persona A report (user-a agent, Easy seed 7101): 8 cells, quit when attention ran out. Liked instant "Well spotted!", the kind hint, the tally. "Hidden single: 0 on your own, 0 with a hint" sat there all game; never met one; hidden about 60% sure "since I never used it or saw an example". Wishes: clearer step-2 explanation; auto-notes; "a hidden-single example early on". Used no scripts (confirmed).
- 2026-10-19: prototype pm-proto7/hs.js (100 seeded puzzles per level, random single placements): a hidden single that is NOT also a naked single exists in 83% of Easy states (3594/4311) and 88% of Medium states (4339/4926). findHiddenSingle returns a cell that is also a naked single in 59% (Easy) / 46% (Medium) of states. Random placements: Easy naked-only 425, hidden-only 1581, both 2305; Medium 644 / 2294 / 1988. So Hint could show a "pure" hidden single almost always, and "both" cells are the largest class (credited as naked today).
- 2026-10-19: persona C report (user-c agent, Medium seed 7303): 13 entries (12 credited: naked 5 own, hidden 7 own, replay confirms), 2 hint clicks (a hidden-single explanation), stopped after ~10 min, unfinished. Defined both terms correctly (90%/90%) and gave an own hidden-single example; "the site's names matched what I was already doing ... confirmed rather than taught". Confused: r7c5=1 got a blank message (not a single at that point; a correct non-single entry gets silence), definitions repeated as clutter, no progress indicator. Wishes: acknowledge every correct placement; progress (digits remaining / digit complete); collapsible definitions + a middle hint level ("which digit to look for"). No scripts (confirmed).
- 2026-10-19: persona B report (user-b agent, Hard seed 7202): solved, "Puzzle solved! Singles applied: 47 on your own, 2 with a hint." (replay confirms; naked 28+2, hidden 19+0; 59 actions, 4 hint clicks). Hit "No naked or hidden single right now. At this point the puzzle needs another technique." about a third in, got past with naked pairs, pointing and a two-way trial. Top wish (again, as in iteration 6): name and teach the next technique at the wall. Wish 2: feedback on correct non-single moves ("silence was ambiguous", "could not tell whether it counted them"). Wish 3: play.js marker layout (tool, not app). No scripts (confirmed).

## Deviation check: user agents
- The `user-a`, `user-b`, `user-c` agent types WORKED when called directly from the PM (launched as a subagent of the lead). Dirk's cascade fix is effective. No assistant fallback was used this iteration.

## Simulated user findings (simulated evidence, not research)
| | A (Easy 7101) | B (Hard 7202) | C (Medium 7303) |
|---|---|---|---|
| Result | 8 cells, quit (attention) | solved, 47/2 | 13 entries, stopped at ~10 min |
| Hidden single | 0 seen, ~60% sure, "never ... saw an example" | 19 own, 95% sure | 7 own, 90% sure |
| Silence on non-single entries | - | yes, wish 2 | yes, wish 1 |
| Hard wall | - | yes, wish 1 | - |

Convergence:
- Silence after an uncounted entry: 2/3 now (B, C), plus B in iteration 6.
- Hidden single never shown or taught when a naked one exists: A now; 3/3 in both iteration-6 acceptance runs.
- Hard wall / next technique: B only, but B's top wish two iterations running.
- Auto-candidates / notes help: A and B mention (low priority, both wishes 2-3).

## Decision
Iteration 7 = **two small issues**:
1. **#30 Teach hidden singles too: Hint prefers the technique you have applied less in this puzzle.** `preferredTechnique(tally, level)`; tie goes to the level's technique (Easy naked, Medium/Hard hidden); a preferred hidden hint uses a cell that is not also a naked single. No new texts. Closes the teaching gap seen in every persona run since iteration 6. Prototype data (hs.js) shows such a hidden single exists in 83% (Easy) / 88% (Medium) of positions.
2. **#31 Say when an entry is not counted, instead of a blank message.** Two fixed neutral texts: (a) not a single at this point; (b) rules already broken. Never says whether a digit is right (no live answer checking), never flags red.

Overlap and order: both touch `sudoku.js` and README, and both add tests to `tests/sudoku.test.js`. #30 changes `findHiddenSingle`/`hintFor` and the Hint click handler; #31 changes `creditEntry` (text only) and the status style in `setCell`. Different functions, but the same README "How to play" Hint section and Files list. Recommend sequential delivery, #30 first (higher teaching value), then #31 from main after the merge. They are logically independent.

Not chosen, and why:
- Make Hard teachable (next technique at the wall): the strategy's core and B's top wish twice, but it needs a level design (iteration-6 lc.js: locked candidates alone solve only 10/60 stalled Hard puzzles) and is not one small issue. Top candidate for iteration 8; it should start with a design spike (which technique, and a level that needs exactly it).
- Finish-line split ("N naked, M hidden"): nobody asked this time (B found the finish "satisfying"). Lower.
- Progress indicator (C), collapsible definitions (C), auto-candidates (A, B): single-persona wishes. Candidates.

## Product decisions pinned in the issues
- #30: tie-break by level, so Easy still starts with naked (progressive), Medium/Hard start with hidden. Credit (`classifyEntry`, naked wins) unchanged. Step 2 stays consistent because neither the grid values nor the tally can change between the clicks.
- #31: (b) reveals only that "some numbers break the rules" (Hint already says the same); a self-clash gives (a) and is not revealed. Neutral style, not green.

## Assumptions
- Preferring the less-applied technique is a reasonable proxy for "teach what you have not learned yet" within a puzzle. Persistence across puzzles is out of scope.
- Text (a) will not feel like a penalty to B-type players who used a stronger technique. Watch this at acceptance (ask B explicitly).

## Concerns
- The Hard wall remains: an expert's interest starts exactly where the teaching stops. Must be addressed next iteration.
- Personas are LLM simulations. B's 61-call game is the strongest play evidence so far; A and C stopped early.
- GitHub Pages / real users still not checked.

## Next-iteration candidates (ordered)
1. Make Hard teachable: design spike for the next technique (pointing / claiming, possibly naked pairs, which B used) plus a level that needs it, then name it at the "needs another technique" wall.
2. Re-run personas after #30/#31 (acceptance) and check that A-type learners now meet hidden singles on Easy.
3. Finish-line split and next-level offer.
4. Progress across puzzles (learned state, persistence).
5. Notes usability / auto-candidates; progress indicator; collapsible definitions.
- 2026-10-19: scope decided, #30 and #31 raised. Hand-off to the lead. Next PM step: acceptance when relaunched (oracles for preferredTechnique/hintFor and creditEntry texts, byte checks, play.js replays, README sentence by sentence, persona re-runs with user-a/b/c, asking B about tone of text (a)).

## Acceptance of #30 (PR #32, head 69d876e)
- 2026-10-19: acceptance started. Detached worktree scratchpad/pm-accept-30 at 69d876e. Delivery log read: review APPROVE (2 rounds), test PASS (2 rounds), carry-forward: frozen oracle tests/frozen-sudoku-e81999c.js. Next: own checks, README, play.js replays, personas.
