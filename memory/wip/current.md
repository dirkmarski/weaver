# WIP: current

Last updated: 2026-10-22, iteration 19, #90 merge, session 19338c12-dbf9-46b7-b92b-1a81aef47c6d

## Active run
- Iteration 19 (PM scope: #90 then #91). #90 accepted (PM, head fb20d95) and merged via PR #92 from `issue-90-step-reveal`. Next: #91 by a separate lead run.

## Streams
| Stream | Status | Next step | Owner |
|---|---|---|---|
| #91 marks and key line follow the revealed step | open, not started | lead run: branch from main after #92, developer | lead |
| it19 close | after #91 | wiki pruning, backlog snapshot, close log | lead |

## Starting the next run
- Ratio at main after #92: 2174 tests / 1359 product, cap 2174, headroom 0. #91 pays 1.6 test lines per product line or listed, reviewer/tester-confirmed removals; no line packing (#90 rework 1 rejected a 542-char line; compare with the file's longest line).
- Tester real-input scripts for the reveal: session scratchpad `test-90/` (README, `./run_all.sh`, `T90_WT=<tree>`; create `tmp/` and `shots/` first). Scratchpads are per session: the next session must rebuild or copy them.
- Persona prompts need the literal scratchpad path, not $WEAVER_SCRATCHPAD (PM it19).
- Prompts: fixed-format evidence report; temp dirs under the session scratchpad; no governance/LOG.md; tagged merge-commit messages (the it19 tester merge ed54240 slipped: tell testers/reviewers to use `git merge --no-edit -m "[<agent>][session <id>] ..."`); real CDP input; run reviewer, tester, PM and personas in the foreground; remove agent worktrees after each merge.
- Do not read the work log unless specifically needed (Dirk, 1464355). Prune memory at each close (Dirk, 9e54939).

## Open issues / PRs
- #91 open (depends on #90, now merged).

## Blockers / waiting on
- none
