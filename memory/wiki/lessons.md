# Durable lessons (iterations 1-10)

Only lessons still valid. "it" = iteration, "#" = issue. Evidence is in `work-log/`.

## Scoping
- Raise open behavioural questions to the PM before development or acceptance; a product decision is cheaper than a guess (it2; #36, where "can both forms apply?" removed a branch of code and tests).
- Scope from observed user pain, not only from the candidate list: simulated users gave convergent evidence for #25/#26 (it6) and #36/#37 (it8).
- Deliver issues in sequence; this avoids README and `sudoku.js` conflicts (it6, it7, it8).
- Fold wording nits into the next issue touching the same section instead of an extra round (it7 #30 -> #31; it8 #35 -> #36, #36 N5 -> #37).
- Do a design spike with data before scoping a hard feature (it8: pointing chosen from 200 seeded Hard puzzles).
- A hint alone does not make something reliably teachable; a level built for the technique is needed (it8, #37).
- Teaching features ship before their rewards; but an uncounted technique is noticed by every user (it8, #36). Closing such a gap in the very next iteration as a single issue worked (it9, #42).
- Have personas review wording options (text mock-ups, no code) before the issue is written; it settled the texts up front and the issue went through with zero spec questions (it9, #42; again in it10 for #45 and #46). Keep an open "anything still confusing?" question in the mock-up: in it10 it surfaced a requirement none of the options covered (signal whether the answer is the pointing digit or another one).
- Persona choices on a mock-up can shift in play: in it10 all three chose a message-only clash (no red), and once playing all three asked for some visual marker. Treat a mock-up choice as settled only after a short play check (it10, #46).
- Check pinned example values against the exact state named in the issue (a fresh puzzle versus a mid-game wall); a wrong pin is caught cheaply before the issue is raised (it10, #46).

## Testing
- Follow the test strategy: golden path, edge cases, error conditions; no sweeps or oracles with millions of checks (it8, #35; replaced the it3-it7 "tester computes expected values independently with large oracles" culture; small independent oracles on 4-5 seeds remain fine).
- Test suite size matters: 15 s of sweeps was cut to 0.6 s while keeping coverage via a rule -> test mapping (#35).
- A seeded generator test guards a rule only if one of its seeds would fail under the mutant; choose seeds on purpose (#37 S1).
- For an ordered precedence (row > column > box, naked > hidden > pointing), the tests need one case per adjacent pair; in it10 row-vs-column and row-vs-box were tested but column-vs-box was not, and a faithful reorder mutant survived (#46 S1). Likewise, one branch of a shared expression tested (row unit) lets a mutant on the other branch (column unit) survive (#45 S1).
- New overlay marks on cells need a check against existing cell content: the it10 pointing badge sits in pencil note 3's corner (#45 D1, accepted).
- Use a negative control (run the new test on the pre-fix commit) for regression fixes (it2).
- Page-wiring refactors need a full browser walkthrough; unit tests on pure helpers do not cover the DOM call site (it1 D1).
- DOM-only guards need a headless script run against mutants, not only the tip (it6 #25 S1, it7 #31 S1).
- Known limit: a real clipboard paste cannot be driven headless; the CDP insertText stand-in uses the same `input` path (it3).

## Review
- Do not trust a developer's self-reported coverage gap or a surviving mutant claim: re-run it. In it9 the developer said precedence was untested, but the lead and the reviewer both showed it caught; the real gap (S1, a tally-copy loop) was one nobody had predicted (#42).
- A refactor that extracts shared logic (here `pointingSteps`/`singleAfterStep`) is the right answer when a new feature needs the same rule as an existing one; ask for it explicitly in the brief, and have the reviewer check for duplication (#42).
- Review by following data from where it is created to where it is read, not hunk by hunk (it1).
- Targeted mutation spot checks on risky logic and deterministic tie-breaks find real gaps (digit order in it4, guard clauses in it5, #36 S1, #37 S1); they replace the earlier "mutation-check every guard" sweeps (it8).
- Check README claims sentence by sentence against behaviour; the PM gate caught what review and test missed in it2, and the habit paid off from it3 (#14).
- Even "nit" refactors get the full gates (it5: `usedMask` sets bit 0 for empty cells).
- Fix cheap nits in the same rework round as should-fix items (it3).

## Coordination
- Hold rework until both reviewer and tester have reported; this keeps it to one round (it4, it5, it6).
- Reviewer and tester working in parallel: give each its own detached worktree on the issue branch and pre-create their log sections (with a separator line) so both pushes merge without conflict; they push with `git push origin HEAD:<branch>` and fetch + `merge --no-edit` on rejection (it10, worked on #45 and #46).
- When a rework round changes no product file, the tester's earlier page run still stands; a delta re-review plus the lead's suite run is enough (it10 #46 round 2).
- Rework re-checks are scaled to the change: tests/comments/README-only rounds get a delta re-review and a suite plus smoke re-test; behaviour changes get the full re-check (it8, #36/#37; replaced "full re-run every round" from it1/it7); a tiny behaviour-neutral refactor folded into a test round also counts as delta, it9 #42 N2).
- Memory tiers (it9): restart from `memory/wip/current.md`, not from the work log; update WIP at every hand-off so a relaunch can resume without reading logs.
- Verify every hand-off on GitHub (heads, comments) before merging; an agent's report can be wrong about its own state (it6, repeated it7, it8).
- Run personas at scoping and acceptance; forbid helper scripts and solvers in persona prompts (it6). A play-tool setup that keeps pre-played counts confuses personas; reset the tally (it8, `wallreset`).
- Use the full session id in every commit, PR and comment (fixed `WEAVER_SESSION_ID`, it4).
- Pass Dirk's "do not read LOG.md" rule to every agent and have each confirm (it5).

## Tooling
- `gh pr edit` fails (the token lacks the read:org scope). Use `gh api -X PATCH repos/dirkmarski/weaver/pulls/N -F body=@file`; merge with `gh api -X PUT repos/dirkmarski/weaver/pulls/N/merge -f merge_method=merge` (it9).
- Never `git pull --rebase` after merging main into a branch: it flattens the merge and duplicates main's commits. Use `git pull --no-rebase` there (it9 incident, fixed before merge).
- Several agents share the iteration worktree. Each must `git add <own file>` only, never `-A`. A `git pull --rebase` fails while another agent has unstaged edits, so commit first, or push without pulling when the remote has nothing new (it9).
- Test tools can be reused across rounds and by the PM if they stay in the session scratchpad (ts42-tools reused for the round 2 re-test, it9; ts45/lib.js in it10 was reused by the developer, the tester for #46 and the PM: it drives the real page in headless Chrome with a seeded Math.random and follows the page's Hint). A script expectation that encodes an earlier misunderstanding shows up as a false FAIL; the tester must say so (it9).
- `gh pr merge` can fail with "not mergeable" right after a push while GitHub computes mergeability; retry (it2).
- On Node 24, `node --test tests/` fails; use `node --test` (it8).
- Headless play tools for testers and PM live in the session scratchpad, not the repo (it8 carry-forward).
- The `user-a/b/c` agents were "not found" as subagents in it6 and callable from it7 on (Dirk's agent-list change); use them directly.

## Open concerns (not lessons)
- GitHub Pages never confirmed enabled (needs admin, outside the team's remit); all user evidence is simulated.
