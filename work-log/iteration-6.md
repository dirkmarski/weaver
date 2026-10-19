# Work Log: Iteration 6 (lead)

- Lead: weaver-agents (lead agent, Claude Opus 5.5), session `f54d361a-6d69-41fd-923a-045d29fc9367`
- Run type: "Deliver the next iteration"
- Iteration branch: `iteration-6` (holds the iteration work logs and is merged by PR at the end)
- Product manager work log: `work-log/iteration-6-product.md`
- The iteration logs are edited in the worktree scratchpad/wt-iteration-6.

## Gate check
- 2026-10-19: Invoked to deliver the next iteration. Iteration 5 is closed and merged (#22, #23, #24). No open issues or PRs. There is no iteration-6 log, so this is a fresh start (not a resume).
- New since iteration 5 (5b2b3f6, Dirk): an `assistant` agent is available to every agent, and the PM can now simulate users with `user-a` (vibes, short attention), `user-b` (methodical, loves a challenge) and `user-c` (lukewarm, about 10 minutes). This partly addresses the carried "no real users" concern. The PM is told to use the simulated users.
- The `governance/LOG.md` read restriction still applies. The lead does not read it and tells every agent not to read it either.

## Plan
1. The PM decides the iteration scope (using the simulated users) and writes the issue(s).
2. For each issue: gate check, branch `issue-N-<slug>`, a per-issue work log, then developer, then reviewer and tester in parallel, then lead check, then a PR merged with a merge commit (no squash).
3. Carried lessons: every rework round repeats the full review and the full walkthrough; README checked sentence by sentence; the tester computes expected values independently; the reviewer mutation-checks every guard clause and ordering rule; hold rework until both review and test have reported.
4. The PM does user acceptance and decides when the iteration is done.

## Conventions
- Commits and PRs: `[<agent>][session f54d361a-6d69-41fd-923a-045d29fc9367] <message> (#N)`. Each agent adds a co-author trailer naming its own model and version.

## Progress
- Iteration branch and this log created. PM launched to decide the scope.
- PM (Claude Opus 5.5) decided the scope, informed by three simulated-user play sessions: two issues.
  - #25 "Announce a finished puzzle automatically, with a summary of the singles applied" (all 3 personas hit the silent finish).
  - #26 "Explain technique names under the tally, and fix 'a 8' in the hidden-single explanation" (2 of 3 personas did not know the terms; 1 found the typo).
  - Candidate 1 for next time: the Hard dead end. The PM's prototype shows locked candidates alone would not make Hard teachable (only 10 of 60 solved), so it needs a level redesign.
- Gate check: #25 and #26 are both OPEN and written by weaver-agents (PM). Both pass.
- Decision: deliver them one after the other (#25 first, then #26 branched from main after the #25 merge). Both edit the README and sudoku.js. Doing them in sequence avoids merge conflicts and keeps each review clean. Accuracy over speed.
- Concern for Dirk: the `user-a/b/c` agent types were NOT available to the PM when the lead launched it ("Agent type 'user-a' not found"). Possibly nested agents cannot reach them, or they need a session restart. The PM fell back to the `assistant` agent, using the persona text verbatim and the same model and effort. The lead cannot register agent types (that would mean editing `.claude/`, which Dirk owns). The finding is simulated evidence either way.
- GitHub Pages was not re-checked this run. Still carried forward for Dirk.
- #25: developer round 1 (Claude Sonnet 5.5), then review APPROVE (S1, N1-N3) and test PASS. The lead chose to rework before acceptance. Round 2 (6681f24): full re-review APPROVE with no findings, full re-test PASS (oracle 72,736 checks, 0 mismatches; browser 67/67). PR #27: **PM ACCEPTED**, no conditions. Merged with a merge commit (651c2a6). #25 closed. See work-log/issue-25-completion-message.md.
- #26: passed the gate earlier (still OPEN, weaver-agents). Branch `issue-26-technique-definitions` created from main after the #25 merge. Developer launched.
- #26: developer round 1 (Claude Sonnet 5.5). Lead check passed (contrast independently computed at 6.43:1). Review APPROVE with nits only (no survivors in the mutation sweep). Test PASS (text oracle 4,506,150 checks against main, 0 mismatches; browser 25/25 on desktop and at 375px). No rework needed. PR #28.
  - PM acceptance run 1 returned an "interim" hand-off, although it had in fact committed ACCEPTED (42530af). The lead relaunched the PM. Run 2 found this, re-ran the personas (no scripts or solvers) on the final head and re-confirmed **ACCEPTED**, no conditions.
  - Merged with a merge commit (c7222d5). The first merge attempt failed with "Base branch was modified" right after the lead's log push, and the retry succeeded. #26 closed.
- main after both merges: `node --test` 109/109. Individual commits are kept (merge commits 651c2a6 and c7222d5).
- Iteration 6 is complete, as confirmed by the PM.

## Outcome and lessons
- Delivered:
  - #25: the puzzle now announces itself when the grid is full: green "Puzzle solved! Singles applied: O on your own, H with a hint." or a red pointer to Verify on a full grid with a conflict.
  - #26: plain-language definitions under each tally line, and "an 8" in the hidden-single explanation.
  - Both come from simulated-user findings: all 3 personas hit the silent finish, and 2 of 3 did not know the terms. The persona re-runs confirmed both changes landed: all 3 read the finish line and defined both terms correctly.
- Lesson 1: the simulated users gave the PM concrete, convergent evidence for the first time. The scope this iteration came from observed pain, not from the PM's own candidate list. Keep running personas at scoping AND at acceptance. Persona prompts must forbid helper scripts and solvers (persona C used one in the #25 re-run).
- Lesson 2: delivering the two issues one after the other cost little and avoided README and sudoku.js conflicts. Each review stayed clean.
- Lesson 3: the reviewer's mutation sweep against DOM-only guards exposed a guard with no test (#25 S1, the check outside `if (changed)`). A recorded headless check closed it. For UI wiring, ask for the headless script to be run against mutants, not just against the tip.
- Lesson 4: an agent's hand-off can be wrong about its own state (the PM's "interim" report after it had already accepted). The lead verifies state in git and on GitHub before acting on a hand-off, and relaunches rather than assuming.
- Lesson 5: as before, holding rework until both review and test had reported kept #25 to one rework round, and #26 needed none.
- Concerns carried forward for Dirk:
  - The `user-a/b/c` agent types are "not found" when the PM is launched as a subagent. The PM used the assistant agent with the persona text verbatim as a fallback. The lead cannot change this (`.claude/` is Dirk's).
  - GitHub Pages is still not enabled, so there are still no real users.
- Next-iteration candidates (PM, ordered): 1. hidden-single mastery (Hint teaches hidden singles; the credit precedence no longer hides them); 2. finish-line split and next step; 3. make Hard teachable (next technique plus a level); 4. progress across puzzles; 5. feedback clarity; 6. notes usability.
