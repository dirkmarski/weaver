# Work Log: Iteration 9 (lead)

- Lead: weaver-agents (lead agent, Claude Opus 5.5), session `48eaa449-33cf-461f-85bc-196e8d61fc39`
- Run type: "Deliver the next iteration"
- Iteration branch: `iteration-9` (holds the iteration work logs and the memory structure; merged by PR at the end)
- Product manager work log: `work-log/iteration-9-product.md`
- Iteration files are edited in the worktree `<session scratchpad>/wt-iteration-9`.
- Session scratchpad: /private/tmp/claude-502/-Users-dirk-Code-weaver-team/48eaa449-33cf-461f-85bc-196e8d61fc39/scratchpad

## Gate check
- 2026-10-20: Invoked to deliver the next iteration. Iteration 8 is closed and merged (#35, #36, #37; PR #41 holds the logs). There are no open issues or PRs and no iteration-9 log, so this is a fresh start, not a resume.
- New since iteration 8 (Dirk), af8d50a "Add memory architecture":
  - `governance/memory-architecture.md` sets four tiers: an LLM wiki (persistent, indexed, curated facts), a WIP structure (fast-access, by activity and work stream), the work log (history and audit trail only, **not** WIP) and the session.
  - lead.md: "As the lead, you need to manage this." The work log is now described as the audit trail, not the restart point.
  - The PM definition got the same work-log wording change.
- a96ce3a "Update log" (governance/LOG.md): not read, per the standing convention.

## Decisions
- D1 (memory location): the wiki and the WIP structure live in the repo under `memory/` (agent-owned per the charter, "everything else"), on the iteration branch, and are merged with the iteration PR:
  - `memory/README.md`: the tiers, where each lives, who maintains what.
  - `memory/wiki/`: `index.md` (index with one-line summaries) plus topic pages. The lead curates it; other agents may propose edits through the lead.
  - `memory/wip/`: `current.md` (active streams, status, next step) and per-stream notes if needed. It is the restart point for a new session; the work log stays the audit trail.
- D2: the wiki is seeded once from the iteration 1-8 work logs and the code by the assistant, and reviewed and curated by the lead. At the end of the iteration the lead reviews the session for learnings and updates the wiki.

## Plan
1. Memory: seed the wiki (assistant, in parallel with scoping) and create the WIP structure.
2. The PM decides the iteration scope (with the simulated users) and writes the issue(s).
3. For each issue: gate check, branch `issue-N-<slug>`, a per-issue work log, developer (unit tests per the strategy), reviewer and tester in parallel (proportionate), lead check, a PR merged with a merge commit (no squash).
4. The PM accepts; the lead closes the iteration, updates the wiki and WIP, and merges the iteration PR.

## Conventions
- Commits and PRs: `[<agent>][session 48eaa449-33cf-461f-85bc-196e8d61fc39] <message> (#N)`. Each agent adds a co-author trailer naming its own model and version.
- No agent reads governance/LOG.md.

## Progress
- Iteration branch, worktree and this log created.
- Memory: `memory/README.md` and `memory/wip/current.md` committed (8a6ca83). The assistant (Sonnet) drafted 7 wiki pages from the iteration 1-8 logs and the code. The lead reviewed them and fixed two process.md lines: models now come from the agent frontmatter, not the logs, and the gate check accepts issues by Dirk Marski or weaver-agents. Committed as 50db9f9.
  - Assistant notes kept as facts: tests 1166 lines vs product 999 (1.17x, today's count, not the post-#35 1041); runner reports 137 tests (125 `test(` calls; subtests account for the rest); Tricky needs 1-2 pointing steps on seeds 1-10.
  - Curation note for later: lessons.md holds a few process rules (hand-off verification, full session id). They stay there for now, cross-referenced from process.md if they grow.
- PM (Claude Opus 5.5) scoped a single issue: #42 "Count pointing: with a hint and on your own, in the tally and the finish text". Wording options were pre-reviewed by personas A, B and C. Gate check: OPEN, by weaver-agents, `enhancement`. PASS. PM log commit 3b08cf2.
- #42 started: branch issue-42-count-pointing (1405cd1), developer round 1.
- #42 developer round 1 done (head 429e2d4; 143/143, ~0.58 s; 7/7 developer mutants caught). Lead check PASS with concern L1. Review and test round 1 launched in parallel on 3a84c1b.
- #42 round 1: review APPROVE (S1 test gap, N1/N2 nits), test PASS (no defects, real page, 375 px). The lead re-ran L1 (caught, 13 fail) and S1 (survives). Round 2: S1 + N2; N1 kept. Re-check is delta-scaled.
- #42 round 2 (S1 test plus N2 refactor, code 8e9c2ae): delta re-review APPROVE (mutant 8 now caught), re-test PASS (one stale script expectation, not a defect). Lead check round 2 passed.
- PR #43 opened (head b7d8aea). `gh pr edit` fails because the token lacks the read:org scope; the body was updated via `gh api -X PATCH .../pulls/43`. Handed to the PM for acceptance.
- PM (Claude Opus 5.5) ACCEPTED #42 with no conditions on head b7d8aea (PR #43 issuecomment-6282762346). The lead verified the hand-off on GitHub (author, decision, head = PR head), added a log-only commit (cce7b48) and merged with a merge commit via `gh api .../merge` (merge_method=merge): 238d245. #42 closed automatically. main: 143/143, about 0.65 s.
- The PM confirmed that iteration 9 is complete from the product side.
- Memory closed for the iteration:
  - Wiki refreshed: product (pointing counted, new gaps), architecture (sizes, exports, 143 tests), lessons (it9 learnings), backlog (the PM's end-of-it9 list), index snapshot.
  - WIP reset to "no active run".

## Outcome and lessons
- Delivered: #42, pointing is counted with a hint and on your own:
  - own-pointing recognition (one step, both forms, naked > hidden > pointing);
  - a third tally line and definition on every level;
  - the finish text "Techniques applied";
  - the new "not counted" text (a);
  - the status class from `creditEntry` `kind` (closes the it7/it8 carry-forward).
- Code: `sudoku.js` 867 -> 900 lines; tests 988 -> 1075 lines; 137 -> 143 tests at about 0.6 s.
- Lesson 1 (memory): the new tiers were set up first, in parallel with scoping, at low cost (one assistant run plus lead curation). WIP was updated at each hand-off and the work log stayed the audit trail.
- Lesson 2: persona review of wording mock-ups before writing the issue gave an issue with zero clarification questions, zero spec deviations and pinned values that all held.
- Lesson 3: a developer's claimed coverage gap (L1) was wrong; the real gap (S1) was found by the reviewer's targeted mutants. The lead re-ran both itself. Verify claims both ways.
- Lesson 4: one rework round kept to a test plus a tiny refactor, with a delta re-check (mutant re-run plus smoke reuse). That took about 2 minutes of agent time, against a full re-run.
- Lesson 5 (tooling): `gh pr edit` and other GraphQL paths need read:org, which the token lacks. The REST `gh api` works for PR edits and merges. Shared worktrees need per-file `git add`, and a `pull --rebase` can be blocked by another agent's unstaged edits.
- Concerns for Dirk:
  - Test growth (ratio ~1.21x) keeps exceeding the ~1x guide; each feature adds about its own size in tests.
  - GitHub Pages is still unchecked, and all user evidence is simulated.
  - Personas repeatedly ask for immediate wrong-entry feedback, which conflicts with the #31 product rule. This is a PM decision for a later iteration.
- Next-iteration candidates (PM, ordered): see memory/wiki/backlog.md. Top items: pointing hint clarity and visuals, Tricky practice density, feedback on conflicting entries.
