# Work Log: Iteration 7 (lead)

- Lead: weaver-agents (lead agent, Claude Opus 5.5), session `246ca1dd-69c1-44b3-80a4-65e176ec6193`
- Run type: "Deliver the next iteration"
- Iteration branch: `iteration-7` (holds the iteration work logs and is merged by PR at the end)
- Product manager work log: `work-log/iteration-7-product.md`
- The iteration logs are edited in the worktree `<session scratchpad>/wt-iteration-7`.
- Session scratchpad: /private/tmp/claude-502/-Users-dirk-Code-weaver-team/246ca1dd-69c1-44b3-80a4-65e176ec6193/scratchpad

## Gate check
- 2026-10-19: Invoked to deliver the next iteration. Iteration 6 is closed and merged (#25, #26, #29). No open issues or PRs. There is no iteration-7 log, so this is a fresh start (not a resume).
- New since iteration 6 (5395bdd, Dirk): the lead's agent list now includes `user-a`, `user-b`, `user-c`. Dirk's log commit title (e81999c) says the lead's agent list cascades to subagents, and that agents should solve problems with what is available. So the PM should now be able to call the user agents directly, which fixes the iteration-6 "not found" concern. The PM is told to try them first and to record whether it worked.
- The `governance/LOG.md` read restriction still applies. The lead does not read it and tells every agent not to read it either.
- The PM's play tool from iteration 6 is at /private/tmp/claude-502/-Users-dirk-Code-weaver-team/f54d361a-6d69-41fd-923a-045d29fc9367/scratchpad/pm-proto6 (play.js, lc.js). The PM may reuse it.

## Plan
1. The PM decides the iteration scope (using the simulated users) and writes the issue(s).
2. For each issue: gate check, branch `issue-N-<slug>`, a per-issue work log, then developer, then reviewer and tester in parallel, then lead check, then a PR merged with a merge commit (no squash).
3. Carried lessons: every rework round repeats the full review and the full walkthrough; README checked sentence by sentence; the tester computes expected values independently; the reviewer mutation-checks every guard clause and ordering rule, including running headless UI checks against mutants; hold rework until both review and test have reported; verify the state in git and GitHub before acting on any hand-off; persona prompts forbid scripts and solvers.
4. The PM does user acceptance and decides when the iteration is done.

## Conventions
- Commits and PRs: `[<agent>][session 246ca1dd-69c1-44b3-80a4-65e176ec6193] <message> (#N)`. Each agent adds a co-author trailer naming its own model and version.

## Progress
- Iteration branch, worktree and this log created. PM launched to decide the scope.
- PM (Claude Opus 5.5) decided the scope: two issues, informed by direct user-a/b/c sessions (the user-* agents now work from the PM, no fallback needed).
  - #30 "Teach hidden singles too: Hint prefers the technique you have applied less in this puzzle".
  - #31 "Say when an entry is not counted, instead of a blank message".
  - Not chosen: make Hard teachable (needs a level design spike). It is PM candidate 1 for iteration 8.
- Gate check: #30 and #31 are both OPEN, written by weaver-agents (PM), labelled enhancement. Both pass.
- Decision: deliver in sequence, #30 first, then #31 branched from main after the #30 merge. Both touch sudoku.js, the README and tests/sudoku.test.js (the same reason as in iteration 6).
- PM concern noted: the tone of #31 text (a) may feel like a penalty. The PM will check it with user-b at acceptance.
- #30: developer round 1 (Claude Sonnet 5.5). Lead check passed. Review APPROVE (N1-N4, 33 mutants with 0 survivors) and test PASS (230,552 oracle checks, 0 mismatches).
  - The lead chose a README-only round 2 for N1 and N2 (literal truth). The full re-review gave APPROVE and the full re-test gave PASS.
  - PR #32: **PM ACCEPTED**, no conditions. Merged with a merge commit (8d92cfd). #30 closed.
  - Carry-forward: the frozen oracle tests/frozen-sudoku-e81999c.js is to be replaced or deleted the next time hintFor changes.
- #31: the gate re-check passed (OPEN, weaver-agents). The PM added a README wording fix to #31 by comment (the "as above" sentence from #30). It is in the PM's own issue and in the same README section, so it counts as in scope. Branch issue-31-uncounted-entry created from main 8d92cfd.
- #31: developer round 1 (Claude Sonnet 5.5). Lead check passed. Review round 1 APPROVE with S1 (a mutant that made rewards neutral survived), S2 (README literal truth) and N1. Test round 1 PASS (73,741 oracle checks).
  - Round 2 fixed S1, S2 and N1. Full re-review APPROVE (14/14 mutants die, no findings). Full re-test PASS (61/61 in the browser).
  - PR #33: **PM ACCEPTED**, no conditions (PM oracle 4.1M checks; personas 4/4 told counted entries from uncounted ones). Merged with a merge commit (9d1034d). #31 closed.
- main after both merges: `node --test` 128/128. Individual commits are kept (merge commits 8d92cfd and 9d1034d).
- The PM confirmed that iteration 7 is complete from the product side.

## Outcome and lessons
- Delivered:
  - #30: Hint teaches the technique the learner has applied less in this puzzle. With no hints yet, it prefers the naked single on Easy and the hidden single on Medium and Hard. A preferred hidden single is never also a naked single. Result: a learner who follows Hint on Easy meets a hidden single at hint #2 in 150/150 puzzles (before: never).
  - #31: a judged entry that is not credited now gets a neutral line, "Entered: ... so it is not counted.", in place of silence. A second variant points to Verify when the grid already breaks the rules.
- Lesson 1: the user-* agents are now callable from the PM (Dirk's change to the lead's agent list cascades). The scoping and both acceptances used them directly. The persona evidence was again convergent and drove both issues.
- Lesson 2: reviewer mutation sweeps run against the headless UI script again found a real gap (#31 S1: a mutant that made rewards neutral survived). The UI wiring is still guarded only by scratchpad scripts. See the carry-forwards.
- Lesson 3: README-only rework rounds are cheap but still get the full re-review and re-test. In #30 the round-2 re-review found one more wording nit. The lead accepted it without a third round, and the PM folded it into #31. Folding wording fixes into the next issue on the same section worked well.
- Lesson 4: once again, the lead verified every PM hand-off on GitHub (heads, comments) before merging. No discrepancies this time.
- Lesson 5: delivering in sequence again avoided README and sudoku.js conflicts.
- Tech debt carried forward:
  - tests/frozen-sudoku-e81999c.js (a frozen oracle) is to be replaced or deleted the next time hintFor or creditEntry change.
  - The status-class wiring has no test in the repo. Consider a pure status-class helper or a `kind` field.
- Concerns carried forward for Dirk:
  - GitHub Pages is still not checked or enabled, so there are still no real users. The evidence is simulated.
  - Make Hard teachable is the PM's top candidate for the fourth run in a row. It needs a design spike, and the next iteration should take it on.
- Next-iteration candidates (PM, ordered):
  1. Make Hard teachable (spike, then the next technique plus a level).
  2. Uncounted-entry feedback v2 (rewording of (b), self-clash, README nits).
  3. Hint example quality.
  4. A middle hint level.
  5. The mobile status line at 375px.
  6. Unit wording in rewards.
  7. Smaller wishes.
