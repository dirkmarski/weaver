# Work Log: Iteration 6 (product manager)

- Product manager: weaver-agents (product-manager agent, Claude Opus 5.5), session `f54d361a-6d69-41fd-923a-045d29fc9367`
- Run type: "Deliver the next iteration" (sixth iteration run)
- Branch: `iteration-6` (worktree scratchpad/wt-iteration-6)
- Lead work log: `work-log/iteration-6.md`

## Status
- [x] Context read: product strategy (unchanged: teach techniques progressively; reward learning and applying; solving second), development practices, README, iteration 5 PM and lead logs, lead's iteration 6 log, agent definitions of user-a/b/c and assistant.
- [x] `governance/LOG.md` NOT read (Dirk denied agents read access).
- [x] Play tool for simulated users: scratchpad/pm-proto6/play.js (drives the real index.html in headless Chrome, seeded, replays actions, prints a text grid plus a screenshot).
- [x] Simulated user sessions (personas A, B, C via assistant fallback; see Deviation).
- [x] Scope decided: two small issues.
- [x] Issues raised: #25 and #26 (label enhancement). Bodies: scratchpad/pm-proto6/issue-a.md, issue-b.md.
- [x] PM user acceptance of #25: ACCEPTED (PR #27, head df7945b). See "Acceptance #25".
- [ ] PM user acceptance of #26 (after #25 merges; delivery is sequential).

## Starting point (2026-10-19)
main = iteration 5 output: Easy/Medium/Hard generated puzzles, Verify, notes, keyboard, Hint teaching naked + hidden singles, "Well spotted!" rewards and a per-puzzle tally. No open issues or PRs.

## Method for simulated users
Each simulated user plays only through play.js (no source code, no README, no governance files), like a first-time visitor who opens the page. They report enjoyment, confusion and wishes. Treated as simulated evidence, not research.

## Deviation: user agents not callable
- The `user-a`, `user-b`, `user-c` agent types are defined in .claude/agents but were NOT registered in this PM session ("Agent type 'user-a' not found"). Fallback: the `assistant` agent role-plays each persona with the persona text copied verbatim from its definition file, and with the model (sonnet) and effort (low / high / medium) from those files. Same tool access restrictions given in the prompt. Flag to the lead: the user agents may need re-registration (session restart) to be callable directly.

## Simulated user findings (simulated evidence, not research)
Sessions are replayable: `node scratchpad/pm-proto6/play.js <session> show` (sessions usera, userb, userb2, userc; seeds 101, 202 Medium, 212 Hard, 303).

| | A (vibes, short attention) | B (methodical, challenge) | C (lukewarm, ~10 min) |
|---|---|---|---|
| Played | Easy, ~10 cells, quit (bored when easy wins ran out) | Medium solved without hints; Hard solved (guessed one 2-way branch after singles ran out) | Easy solved, 4 hints |
| Enjoyed | 2-step Hint, "Well spotted!", Verify's "N empty cells left", clean look | 2-step Hint + purple rings, the own/hint split ("scorecard"), honesty on Hard | Easy felt easy, Hint does not give the answer away, "Well spotted!", clean look |
| Confused | Tally credits lucky guesses; "Hidden single: 1" never explained | No feedback for non-single placements; message stays after notes ("stale"); "a 8" typo; notes too small; Hard dead end; no auto "Solved" | **Last cell filled, nothing happened**; second Hint click not obvious; jargon half understood; slight "judged" feeling for hints |
| Top wishes | completion celebration + daily/streak; explain terms; progress across puzzles | teach the next technique where singles run out; clearer feedback/log; better notes | auto completion message with summary; plain-language term definitions; one-click explanation |

Convergence:
- No completion announcement: 3/3 (A never finished, but asked for a celebration first).
- Unexplained technique terms: 2/3 (A and C). B did not need them.
- Daily puzzle / streak / progress across puzzles: 3/3 mention it, but none said it was a blocker.
- Hard dead end and the next technique: B only (the expert persona). It is B's top wish.

Checked against the code. "a 8" is real (sudoku.js hintFor, step-2 hidden). The "stale" message after notes is by design: README says notes keep the message. The definition of a hidden single is only shown when Hint picks one, so a learner who is rewarded for one on their own never sees what it means.

## Prototype: is the next technique the right next step? (scratchpad/pm-proto6/lc.js)
I took 60 seeded Hard puzzles, each played with singles until stuck. At the stall point, 51 of 60 have a locked-candidates (pointing or claiming) elimination. Only 18 of 60 get a new single directly from one elimination (16 from pointing). Singles plus locked candidates solve only 10 of 60. So "pointing pairs" alone would not make Hard teachable. That needs a level design decision (for example a new tier between Medium and Hard) and is bigger than one small issue. It stays the top candidate for next time, with this data.

## Decision
Iteration 6 = **two small issues**, both driven by the simulated feedback and both serving the strategy (reward and teach):
1. **#25 Announce a finished puzzle automatically, with a summary of the singles applied.** 3/3 personas. Rewards the learner at the natural moment and puts techniques first ("Puzzle solved! Singles applied: O on your own, H with a hint."). Pure `completionFor(grid, tally)`.
2. **#26 Explain technique names under the tally, and fix 'a 8'.** 2/3 personas. Teaches the vocabulary where it appears. Static `TECHNIQUE_DEFINITIONS` and a one-word article fix.
The two are independent (status line vs tally block and hint text) and can be delivered in either order. Both touch README.

Not chosen, and why:
- Next technique tier: too big for one small issue, and the prototype shows it does not unlock Hard alone (see above).
- Persistence, daily puzzle and streaks: everyone mentions them, but none called them a blocker, and they need a design for "learned". This is candidate 2.
- Acknowledging non-single placements and a feedback log: B only. Candidate.
- Bigger notes and auto-candidates: B only. Candidate.
- One-click explanation (C): candidate. Watch whether the definitions under the tally reduce the need.

## Product decisions pinned in the issues
- #25: checked after every value change that leaves a digit in the cell (including overwrites). Credit is applied before the text is built. "solved" replaces that entry's reward text but still counts it. A full grid with conflicts gives a red text that points to Verify and flags no cells. No locking. The wording is fixed for every count (no plurals).
- #26: definitions are a constant, shown as `p.definition` after each count line. `tallyLines` is unchanged. "an" only for 8.

## Assumptions
- A full grid with no conflicts is a valid solution, so "solved" needs no stored answer. This matches Verify.
- "Singles applied" is understandable now that the definitions name both singles (#26). If #25 ships first, the tally block below it still names them.
- Persona A said the tally credits "lucky guesses". A guessed digit that happens to be the only one possible is still a correct single, and I keep crediting it (as decided in iteration 5). Revisit if real users report the same.
- The personas were role-played by the assistant agent, not by the user-* agents (see Deviation). Their reports are plausible but are model output.

## Concerns
- The personas are simulated, and real users are still missing (Pages was 404 in iteration 5, not re-checked this run).
- B solved Hard by guessing, which shows the teaching runs out exactly where an expert's interest begins. This must come next.

## Next-iteration candidates (ordered)
1. Make Hard teachable: introduce the next technique (pointing pairs or claiming) together with a level that needs it. Use the lc.js data to design the level.
2. Progress across puzzles: a per-technique "learned" state with persistence, and possibly a daily puzzle.
3. Feedback clarity: a neutral acknowledgement for non-single placements, and possibly a short log of recent rewards.
4. Notes usability: larger notes, possibly auto-candidates.
5. Re-run the personas after #25 and #26 ship, to check whether completion and definitions land.

## Progress
- 2026-10-19: context read, play tool built and smoke-tested. Next: run the three simulated users in parallel.
- 2026-10-19: user-* agent types not available; launched three persona sessions via assistant (sessions usera*, userb*, userc* in pm-proto6/sessions). Waiting for reports.
- 2026-10-19: persona A (vibes) report received; recorded under "Simulated user findings" when all three are in. Summary: Easy, ~10 cells, quit on boredom when easy wins ran out; liked Hint 2-step and "Well spotted!"; tally credited lucky guesses; "Hidden single: 1" shown but never explained; wants completion celebration, daily/streak, term explanations.
- 2026-10-19: persona C (lukewarm) report received. Easy seed 303, finished in ~25 commands with 4 hints. Biggest gripe: filling the last cell does nothing, had to guess Verify. Jargon ("naked/hidden single") half understood; the one "Well spotted ... hidden single in its box" taught something but wanted a plain explanation the first time. Wants completion celebration with summary, term explanations, one-click explanation.
- 2026-10-19: all three persona reports in; findings, prototype, decision recorded. Issues #25 and #26 raised. Next PM step: user acceptance when the lead reports delivery (oracle for completionFor, byte checks of texts, headless replay with play.js, README sentence by sentence, persona re-run optional).
- 2026-10-19: PM acceptance of #25 (PR #27, head df7945b) started in detached worktree scratchpad/pm-accept-25. Done so far: own oracle (scratchpad/pm-accept-25-checks/pm-oracle.js) 20,000 checks, 0 mismatches; texts byte-equal to the issue; play.js replays (pm25c*, pm25b) as expected; README diff read; screenshots viewed. Persona C and B re-runs (assistant fallback) in progress, sessions pm25-userc and pm25-userb.

## Acceptance #25 (PR #27, head df7945b, 2026-10-19): ACCEPTED
Detached worktree scratchpad/pm-accept-25. I did not edit the branch. Diff: sudoku.js (+completionFor, setCell hook), README, tests, issue work log. index.html is unchanged.
- **Independent oracle** (scratchpad/pm-accept-25-checks/pm-oracle.js): my own rule checker. Expected texts are parsed from the issue #25 body, not the code. Result: 20,000 checks (4,965 null, 5,701 solved, 9,334 conflict), 0 mismatches, inputs never mutated. `node --test`: 85 + 22 = 107 pass.
- **Byte checks**: the conflict text and the issue example "Puzzle solved! Singles applied: 40 on your own, 0 with a hint." are byte-equal to the issue. The E5 mixed tally gives "4 on your own, 6 with a hint".
- **play.js replays against the PR head** (sessions pm25c*, pm25b in pm-proto6/sessions):
  - Persona C's iteration-6 Easy game (seed 303) without the final Verify now ends on the green "Puzzle solved! Singles applied: 40 on your own, 4 with a hint.". 39+1 and 4 match the tally, so the last single is counted first.
  - Wrong last digit gives the red conflict text, with no red cells.
  - Overwriting to the right digit gives solved, with 39 (an overwrite is not judged).
  - Clear, then a note gives a blank message. Re-entering gives solved again.
  - Verify afterwards shows "Solved! Every row, column and box is correct.". Hint on the full grid shows "Every cell is filled. Click Verify to check the grid.".
  - Persona B's Medium game (seed 202) gives "48 on your own, 1 with a hint" = 44+4 / 0+1.
- **README** "How to play" and the Files list, read sentence by sentence against the code. All literally true. Checked in particular: rejected input never triggers it (the input handler restores the old value before setCell, so changed is false), notes on a filled cell are no change, and "Apart from that message there is no live checking".
- **Screenshots as a learner** (test-25b R1, R2; my pm25c-1): the green line sits in the usual message place, directly above the tally, and its sums are visible below. The red conflict line is clear and points to Verify. R5 shows Verify's text because Verify was clicked after the fill. Not a defect.
- **Persona re-runs** (assistant fallback; user-* agent types are still not available to me):
  - C (Easy, seed 404, session pm25-userc): got "Puzzle solved! Singles applied: 38 on your own, 1 with a hint." and found it "mildly rewarding". Understood the own/hint split and added up 31+7. Caveat: the persona admitted filling most cells from an offline solver, so this is weak evidence about play. The finish-message part still holds.
  - B (Medium, seed 505, session pm25-userb, no hints): the wrong last digit gave the red text and no red cells ("a clean 'not done yet' signal, slightly odd"). After the correction: "Puzzle solved! Singles applied: 43 on your own, 0 with a hint." B: "rewarding and clear", 35+8=43 checked.
- Verdict: the iteration-6 top gripe (3/3: "last cell filled, nothing happened") is fixed as specified. **ACCEPTED, no conditions.** The lead may merge.

### Observations from acceptance (new candidates, not defects)
- B and C: "Singles applied" is jargon. #26 (definitions under the tally) is the planned answer. Re-check after #26.
- C: "38 out of what?" B: "why 43 when I typed ~50?" Entries that are not singles are not counted and not explained (this matches candidate 3, feedback clarity). A possible finish line: "N of M cells were singles".
- B: correcting a wrong last digit by overwriting is not credited, so the tally does not move on the final entry. This is the iteration-5 rule (overwrites are never judged). Watch it, but no change.
- B: the full-but-wrong case could say how many cells clash, with a softer tone. C: offer "New puzzle / try Medium" on the solved screen. Both are candidates.
- Process: the persona fallback can cheat (C used a solver). Future persona prompts must forbid helper scripts explicitly.
- 2026-10-19: #25 ACCEPTED (PR #27, df7945b). Decision posted on PR #27. Next: acceptance of #26 when delivered.
