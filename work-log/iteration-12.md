# Work Log: Iteration 12 (lead)

- Lead: weaver-agents (lead agent, Claude Opus 5.5), session `4ecb9163-8db9-4624-9aa5-9c6e3ff52aab`
- Run type: "Deliver the next iteration"
- Iteration branch: `iteration-12` (holds the iteration work logs and the memory updates; merged by PR at the end)
- Product manager work log: `work-log/iteration-12-product.md`
- Iteration files are edited in the worktree `<session scratchpad>/wt-iteration-12`.
- Session scratchpad: /private/tmp/claude-502/-Users-dirk-Code-weaver-team/4ecb9163-8db9-4624-9aa5-9c6e3ff52aab/scratchpad

## Gate check
- 2026-10-20: Invoked to deliver the next iteration. Restart procedure (memory/README.md) followed: WIP says "no active run" (iteration 11 complete). GitHub agrees: no open issues or PRs; main is at 9e54939. There is no iteration-12 log, so this is a fresh start, not a resume.
- Dirk changed governance after it11 in one commit, 9e54939: governance/memory-architecture.md adds a pruning rule (remove/combine duplicates, compress similar items into broader entries, discard or archive items no longer relevant). Nothing changed in `.claude/` or `governance/context/`. governance/LOG.md was not read, per the standing convention.
- Baseline on main: 147/147 tests, about 0.63 s.

## Decisions
- D1 (applying 9e54939): the memory close-out of this iteration includes a pruning pass over the wiki (lessons.md in particular has grown by accretion; backlog.md carries delivered items) and WIP. Pruned content is either merged into a broader entry or dropped; evidence stays findable in the work log.

## Plan
1. The PM decides the iteration scope (from memory/wiki/backlog.md, with personas as needed) and writes the issue(s).
2. Per issue: gate check, branch `issue-N-<slug>`, per-issue log, developer, then reviewer and tester in parallel, lead check, PR, PM acceptance, merge with a merge commit (no squash). Flow: memory/wiki/process.md.
3. Close: wiki and WIP update with pruning (D1), iteration PR merged.

## Conventions
- Commits and PRs: `[<agent>][session 4ecb9163-8db9-4624-9aa5-9c6e3ff52aab] <message> (#N)`. Each agent adds a co-author trailer naming its own model and version.
- No agent reads governance/LOG.md. Agents do not read the work log unless specifically needed.
- After merging main into iteration-12, use `git pull --no-rebase`, never `--rebase`.

## Progress
- Iteration branch, worktree and this log created.
- 2026-10-20: PM launched to scope iteration 12 from memory/wiki/backlog.md (personas at its discretion). Told: no LOG.md, no work-log reading unless needed, the pruning rule for its candidate list, and the DOM-test-harness tech-debt item as a candidate to weigh on its merits (lead does not decide scope).
- 2026-10-20: Lead launched one no-op assistant call by mistake (prompt: reply "OK", no tools). It returned "OK" and touched nothing. Recorded for the audit trail only.
- 2026-10-20: PM scoped iteration 12 (product log 3fb00a7): #55 page tests in the repo (headless Chrome via CDP from node --test, no product change), then #56 Hint explanation (relevant rings only, key line for pointing, badge in its note slot, box-case text). Both pass the gate (open, weaver-agents, enhancement). Order accepted: #55 first, so #56 and acceptance use durable repo page tests.
- PM proposals for the wiki (backlog list replacement, product Hint section after #56, play-check lesson merge) held for the close.
- Environment check: Node v24.21.0, Chrome present.
- #55: branch issue-55-page-tests, worktree wt-55, issue log started (8ab6ecb). Developer next.
- 2026-10-20: #55 developer done (cb2d63c; 157 tests, ~2 s). Lead check passed; spec reading L1 (7f = after both clicks, as README) logged in the issue log. Reviewer and tester launched in parallel (wt-55-review, wt-55-test at 6d59cbc).
- 2026-10-20: #55 review (approve, S1-S3 should-fix) and test (all ACs pass) done. Rework round 1 (tests/README only, L2) given to the developer; delta re-check by the lead.
- 2026-10-20: #55 round 1 delta re-check by the lead found the signal cleanup racy (L3: Chrome survived one SIGTERM trial). Round 2 to the developer, then reviewer delta re-review of tests/chrome.js.
- 2026-10-20: #55 round 2 (2e594f9) fixed the signal race (cause: node --test orphans its test child on a signal; EPIPE killed it silently). Lead trials 14/14 clean. Reviewer delta re-review of rounds 1-2 launched at 5868cdb.
- 2026-10-20: #55 reviewer approved the delta at 5868cdb. PR #57 opened (head 0e699d5). PM acceptance launched on 0e699d5.
- 2026-10-20: PM accepted #55 at 0e699d5 (PR comment verified on GitHub, by weaver-agents). PR #57 merged with a merge commit at the accepted sha: f55b6a8. Main: 157/157, 0 skipped. Issue #55 closed. main merged into iteration-12. #56: branch issue-56-hint-rings from f55b6a8, worktree wt-56, issue log started; developer next.
- 2026-10-20: #56 developer done (31758fc; 164 tests, 0 skipped). Lead check passed. Reviewer (wt-56-review) and tester (wt-56-test) launched at 8ac1f8b; PM asked Q1 ("a 8" vs "an 8" in the pinned key text) in parallel.
- 2026-10-20: #56 review (approve; S1 + nits) and test (pass; D1 badge chip too wide at 375 px) done. PM Q1 decided (key text without article). Q2 (D1 is a spec conflict: unchanged chip size vs only D's slot at phone widths) sent to the PM; rework round 1 waits for it.
- 2026-10-20: PM Q2 decided (C: chip unchanged, inside its cell, <= 2 px overlap at 375 px; 320 px out of scope). #56 rework round 1 to the developer (Q1 text, S1, N1-N3, D1); behaviour change, so full delta re-review and re-test after.
- 2026-10-20: #56 round 1: items 1-4 done (560b21b); the badge CSS (D1) stopped: Q2's no-clip and <= 2 px overlap conflict at 375 px with an unchanged chip (measured). Q3 to the PM with the table, asking for an achievable criterion. Lesson candidate: a visual acceptance criterion set by the PM should be checked for feasibility against measurements before it goes into the issue.
- 2026-10-20: PM Q3 decided (B, side padding only: below 560 px padding 0 1px and edge badges flush to the cell's inner edge; font/colours/strike unchanged; criteria prototyped by the PM, worst overlap 1.08 px). Developer launched for rework round 1b (badge CSS); then reviewer + tester re-check of the whole round.
- 2026-10-20: #56 round 1b done (55b63d6). Lead check passed (166 tests). Reviewer and tester re-check rounds 1 + 1b at fc76f9d.
- 2026-10-20: #56 re-review (approve; R1 should-fix: f4 misses removal of the right-edge rule) and re-test (all pass; worst overlap 1.14 px at 375 px; AC3 '900 px within 0.5 px of main' ambiguity read as 'as at the slot placement 8ac1f8b', for the PM at acceptance). Round 2 (tests only, R1) to the developer; lead delta-check after.
- 2026-10-20: #56 round 2 (5ea1691) checked by the lead (mutant c6 killed). PR #58 opened (head e444eb1). PM acceptance launched on e444eb1 (AC3 900 px reading, ratio ~1.57x, persona check of the narrow chip).
