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
- PM own checks (head 69d876e): `node --test` 122/122 pass. Frozen oracle byte-identical to `git show e81999c:sudoku.js`; index.html/style.css unchanged. Code diff read in full (sudoku.js +33 lines): matches rules 1-4.
- PM oracle pm-proto7/acc30.js (own brute-force candidate model, frozen module for E2): E1 table by hand (10 cases incl. mixed own/hint), E2/E3/E4 at every position of a Hint-following walk of 150 Easy + 150 Medium puzzles (seeds 9000-9149 / 9500-9649), steps 1 and 2, same cell on both clicks, input not mutated, every hinted entry gives "Well done!": 168,872 checks, 0 failures. (First run had a bug in MY script: creditEntry needs the value as a string; fixed.)
- Key metric, simulated learner who always uses Hint: Easy, first hidden-single hint at hint #2 in 150/150 puzzles (before: never, 0/150 puzzles ever showed one); Medium, first hint is a hidden single in 150/150 (before: on average hint #10). Share of hidden hints per puzzle: Easy 39%, Medium 43%.
- PM play.js sessions on the PR head (WEAVER_APP=pm-accept-30): Easy seed 7101: Hint 1 = naked single r4c5 (tally 0/0); entered 3 -> "Well done! You applied a naked single ..." and "Naked single: 0 on your own, 1 with a hint"; Hint 2 = hidden single r1c1 "in its box" (candidates 1,3,8, so not naked), box tinted only; second click "Hidden single: row 1, column 1 must be 3, because every other empty cell in its box already has a 3 in its row or column." with purple rings on all 3s; entered 3 -> "Well done! You applied a hidden single: row 1, column 1 is 3." and "Hidden single: 0 on your own, 1 with a hint"; next Hint (1-1 tie, Easy) = naked. Medium seed 7303: first Hint = hidden single r3c2 (box), step 2 same cell. Hard seed 7202: first Hint = hidden single r2c1. All as E5 / rules 1-4.
- README, changed sentences one by one (PM reading against code and runs):
  1. "Order: Hint teaches the technique you have applied less so far ... adding together ... 'on your own' and 'with a hint' numbers on its line ..." TRUE (preferredTechnique sums own+hint; the tally block is visible from the start).
  2. "If the counts are equal, which includes the start of a puzzle, ... naked on Easy and ... hidden on Medium and Hard." TRUE (seen in play.js on all three levels).
  3. "The level is the one you chose for the current puzzle." TRUE (currentLevel set in choose; game hidden until a level is chosen).
  4. "Preferring the naked single: ..." (old Order text) TRUE (E2, 0 failures).
  5. "Preferring the hidden single: Hint first looks for a hidden single whose cell is not also a naked single (at least two digits fit that cell)." TRUE. "It uses the first such cell in reading order, with the box, row, column and digit order described below." TRUE (E3 oracle). "If there is none, it teaches a naked single as above." IMPRECISE: when there is no naked single either, Hint shows the "No naked or hidden single right now..." text (reachable on Hard). Covered by the separate "if there is neither ..." bullet, and the reviewer's round-2 nit, which the lead accepted. Not misleading for a player; I do not block on it. Carried into #31 (same README section) as a one-line wording fix: "If there is none, it follows the naked-single order above."
  6. "Both clicks of one hint explain the same cell: nothing that decides the preference changes between them." TRUE (value change removes the hint; tally only changes on a value change; oracle checked same cell at every position).
  7. First-click hidden parenthesis "(when Hint prefers the hidden single, the first one that is not also a naked single)" TRUE.
  8. Files list: findHiddenSingle(grid, options) / {notNaked: true}; preferredTechnique description; hintFor prefer description; test list "hint-preference"; frozen file line ("not run as a test, not loaded by the page", index.html unchanged) - all TRUE.
- Personas launched directly (user-a Easy seed 7111, user-c Medium seed 7313 with two Hint clicks first, user-b Medium seed 7222 as a "teacher" + Hard). Prompts forbid scripts, solvers, source and README. Waiting for reports.
- Persona A report (user-a, Easy seed 7111): 13 entries, unfinished, stopped "having seen what the game offers". Final: "Naked single: 9 on your own, 1 with a hint" / "Hidden single: 0 on your own, 3 with a hint" (replay of session a30 confirms all 13 entries credited). Hints: #1 naked r1c2; #2 hidden r2c3 (box); #3 hidden r2c4; #4 hidden r4c2, all understood, both clicks. Defines hidden single correctly with own examples (r4c2=3 in box 4; r2c4=5), 85% sure (iteration-7 scoping run on main: 0 seen, ~60%, "never ... saw an example"). "The first hidden single came at the second Hint, which was very early ... early enough, and arguably too early." Order "made sense". Mild: hidden hints "back to back ... a bit repetitive" (by design: A's own naked singles keep N > H). Annoyance "entries dropped when chaining type commands in a shell loop": the session file holds all 13 entries and the screen shows them; caused by concurrent play.js calls on one session file (tool, not app). Wishes: reliable entry (tool), a middle hint level (which digit / blockers), technique practice mode. No scripts or source (confirmed; the shell loop only called play.js).
- Persona C report (user-c, Medium seed 7313, two Hint clicks first): about 22 entries, unfinished (~40 empty), stopped by choice. Final: "Naked single: 6 on your own, 3 with a hint" / "Hidden single: 7 on your own, 2 with a hint". The very first hint was the hidden single r1c3 (box); the step-2 text and purple rings "made the logic visible"; "a good one to learn from". Order "made sense ... started with a hidden single, then moved to naked singles"; no odd or unhelpful cell. Defines both correctly (95% / 90%) with an own worked example (r6c2=6 in box 4). Claimed "type ignored while a hint is active": PM re-test on the PR head and on main (seed 7313, Hint, then type an empty other cell) shows the entry IS made ("Well spotted! ... hidden single in its column ..."). The likely causes are C's own zsh loop (C reports it passed "r c d" as one argument) or silent uncounted entries, which #31 addresses. Not a #30 defect. Wishes: say when an entry is not counted (= #31), a one-click "digit + unit" hint option, candidates on request.
