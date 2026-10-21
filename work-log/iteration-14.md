# Work Log: Iteration 14 (lead)

- Lead: weaver-agents (lead agent, Claude Opus 5.5), session `c0f6ffb1-d246-448a-942e-3cfd5baa05e4`
- Run type: "Deliver the next iteration"
- Iteration branch: `iteration-14` (holds the iteration work logs and memory updates; merged by PR at the end)
- Product manager work log: `work-log/iteration-14-product.md`
- Session scratchpad: /tmp/wvr/claude-502/-Users-dirk-Code-weaver-team/c0f6ffb1-d246-448a-942e-3cfd5baa05e4/scratchpad

## Gate check
- 2026-10-21: Invoked to deliver the next iteration. Restart procedure followed: WIP says no active run (iteration 13 complete, iteration PR #64 merged at bfb2b8e). GitHub agrees: no open issues or PRs. No iteration-14 log existed, so this is a fresh start, not a resume.
- Since it13 Dirk changed only `.claude/run-task` (9c5542b): print mode, and per-session temp folders (TMPDIR=/tmp/wvr/tmp-<id8>, CLAUDE_CODE_TMPDIR=/tmp/wvr, MAC_CHROMIUM_TMPDIR=TMPDIR). The scratchpad therefore moved under /tmp/wvr. The explicit temp-dir rule stays in prompts (macOS mktemp ignores TMPDIR). governance/LOG.md not read.
- Baseline on main (9c5542b): 167/167 tests, skipped 0, about 3.6 s.

## Plan
1. The PM scopes iteration 14 from memory/wiki/backlog.md (top: explanation depth, then mobile; ratio headroom about 1 line) and writes the issue(s).
2. Per issue: gate check, branch, per-issue log, developer, reviewer + tester in parallel, lead check, PR, PM acceptance, merge commit (no squash). Flow: memory/wiki/process.md.
3. Close: wiki and WIP update with pruning, iteration PR merged.

## Conventions
- Commits and PRs: `[<agent>][session c0f6ffb1-d246-448a-942e-3cfd5baa05e4] <message> (#N)`. Each agent adds a co-author trailer naming its own model and version.
- No agent reads governance/LOG.md. Agents do not read the work log unless specifically needed.

## Progress
- 2026-10-21: iteration-14 branch and this log created. PM launched to scope.
- 2026-10-21: PM scoped one issue (product log 8bf774d): #65 hatch the cells the rings rule out, plus a key line for hidden singles. Evidence: spike over 1855 explanations (hatched set = reason cells, 0 exceptions; worst case 8 hatched / 4 rings), two persona rounds (ring-to-cell mapping 1-2/5 -> 4/5). Ratio decision: no trim item; #65 trims in place (old W-clause logic and tests go). PM confirmed no LOG.md reading and only candidate-list reads of the it13 product log.
- Gate check #65: open, authored by weaver-agents, label enhancement. Passed. Branch issue-65-hatch-ruled-out from 9c5542b, worktree scratchpad/wt-65, issue log 6e1de07. Developer launched.
- 2026-10-21: #65 developer done (head 610dba8; code d8322bb): `hintMarks` returns `hatched` (reason cells, de-duplicated, ascending); class `hint-hatched` with both layers (stripes, then tint); `hintKey(hint, hatchedCount)` replaces `pointingKey`; page shows a key on every non-naked explain. 167/167, skipped 0. Ratio 1952/1220 = 1.600x (no margin), no assertions removed. Pins P1/P3 on the page in f1b; P2/P4/P5 checked by the developer at unit level / in node.
- Lead read of the diff: matches AC 1-7. Held for review/test: a merged double comment and packed test lines (ratio squeeze, legibility); f2 checks only whichever single its seed gives, so the "no key for a naked single" page wiring (`technique !== 'naked'`) may be unguarded. Reviewer and tester launched in parallel (wt-65-rev, wt-65-test at 610dba8).
- 2026-10-21: #65 reviewer REQUEST CHANGES (df3a3f7): 15 mutants, 12 killed. Must-fix: page gate `technique !== 'naked'` unguarded (f2's seed always gives a hidden single), as the lead suspected. Should-fix: the sort of `hatched` unpinned (reachable layout given); legibility of packed lines (pay for unpacking by removing listed duplicate assertions). M2 (de-dup in addReasons) claimed equivalent.
- Lead check of M2: a hand-built hint with a hidden column crossing the pointing box does produce duplicates, but in reachable hints the hidden unit must contain a removed cell (otherwise the target was already a single, which hintFor never teaches as pointing), so it cannot meet the pointing box: the de-dup is dead code. Decision: remove it in the rework (concise code; a duplicate would only re-add a class). Waiting for the tester before the rework round.
- 2026-10-21: #65 tester PASS, no defects (dd059a6, merge ba852b2): pins P1-P5 on the real page at 375/1280 px (66 checks); both layers measured (stripe first, alpha 0.3, 1.5/8 px); every clearing path; 360 states over 4 levels identical to main apart from AC 1-5; independent oracle 0 mismatches over 105 explains. Lead looked at full-P1-375.png: hatching and rings as P1.
- Rework round 1 (developer): R1 must-fix f2 naked-single page case (kill M1); R2 pin the hatched sort in case (b) (kill M3); R3 unpack the packed lines (tests and sudoku.js comment/return); R4 remove the dead de-dup (lead decision above). Ratio paid for by removing listed duplicate assertions. Removals require reviewer (mutant) and tester confirmation, and the product edit is behaviour-neutral, so re-checks: reviewer delta re-review (M1, M3, M2-removal, each removal by mutant) and tester confirmation of the removals plus suite/smoke on P1/P3.
- 2026-10-21: #65 rework round 1 (bf218ae): R1-R4 done; M1 and M3 now killed; 167/167, skipped 0; ratio 1961/1226 = 1.5995x; six assertion removals listed in the issue log. Lead read of the diff: removal 4 took the hidden-single and "an 8" cases out of the hintKey unit test, which AC 8's "Unit:" bullet explicitly requires. Sent back (round 1b, 7c63d88): one literal hidden-single "an 8" unit assertion restored; paid for by dropping f2's hidden-key regex (literal P3 pin in f1b covers it). Ratio 1961/1226 = 1.5995x.
- Re-check level: product change is behaviour-neutral (dead de-dup removed, comment and return reformatted) but there are seven test removals needing confirmation: reviewer delta re-review (M1, M2-removal equivalence, M3, a mutant per removal, legibility) and tester confirmation of each removal plus a suite and P1/P3/P4 smoke, in parallel.
- 2026-10-21: #65 re-checks: reviewer APPROVE (97ccd5d), tester PASS (08f56e4). Lead check at 4c78fd3 passed (6 clean runs; M1/M3 killed; ratio 1.5995x); lead log 1f6906a. PR #66 opened at 1f6906a. PM acceptance launched on that head.
- Concern (for Dirk, informational): Chrome leaves `com.google.Chrome.*` and `scoped_dir*` items in the per-session TMPDIR (155 items, 14 MB this run); no processes left. Contained by run-task's per-session folder; cleanup is outside the team's scope.
- 2026-10-21: PM ACCEPTED #65 at 1f6906a (PR comment 6304785327; product log c346524): AC 1-9 pass; 204-step play-through identical to main apart from hatching and key; personas named the ring for 41/42 hatched cells; notes in hatched cells 3/5 readability (100% accurate), follow-up candidate alpha 0.25. Lead verified head 1f6906a and the comment on GitHub and merged PR #66 with a merge commit at the accepted sha: 84889f5. #65 closed.
- Close: origin/main merged into iteration-14; suite on the merged tree 167/167, skipped 0. Wiki updated and pruned (product: hatching and new key line, known gaps; architecture: sizes, `hintKey`, `hatched`, wiring; backlog: PM's after-#65 list, ratio watch 0 headroom, Chrome temp concern; lessons: AC-required removals, equivalent-mutant reachability, seeded branch reach, tagged merge commits, real-page readability; process; glossary; index). WIP reset.
- Session review: one issue, one rework round (plus 1b caught by the lead's diff read). Concerns for Dirk: Chrome temp items accumulate in the per-session TMPDIR; GitHub Pages still unconfirmed, so all user evidence is simulated.
