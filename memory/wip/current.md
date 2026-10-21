# WIP: current

Last updated: 2026-10-22, lead run for #83, session 28d2788e-8588-47d1-8000-5904c97e526f

## Active run
- Iteration 18 (PM scope: #83, #84, #85 in sequence). Lead session 28d2788e-8588-47d1-8000-5904c97e526f delivers #83 on branch issue-83-square-cells (started from main 7fdc9a2). No iteration-18 branch: all it18 logs travel on the issue branches.

## Streams
| Stream | Status | Next step | Owner |
|---|---|---|---|
| #83 square cells + chips inside | accepted, PR #86 merged | none | lead |
| #84, #85 | not started | next lead run: #84 (persona round also looks at the chips), then #85 | lead |

## Starting the next run
- Top candidate (PM): board and explanation visible together on a phone (#77 personas 3/3, top complaint), with the rest of the mobile list (wrapped button row at 375/360, ring discovery cue, explanation below the fold at 375 px).
- Ratio after #83: 2117 tests / 1324 product, cap 2118, headroom 1. Any item adding test lines needs product lines (1.6 each) or listed, reviewer/tester-confirmed removals; a UI item with page tests likely needs a trim first.
- Watch: edge-digit ruled badges at 375 px not pinned (#78 pins D = 2, 8 only); surviving CSS mutants (#77: `steps` class on every explain kind, max-width unpinned); the key line does not mention the ruled badge.
- Agent worktrees: remove them after each issue merge (it17 left wt-main-78, wt-review-78, wt-test-78 and an orphan tester commit ae7a890, log line only; removed at close).
- Prompts: fixed-format evidence report; temp-dir safety rule (scratchpad under /tmp/wvr); no governance/LOG.md; tagged merge-commit messages; real CDP input for click/tap checks; run reviewer, tester, PM and personas in the foreground.
- Do not read the work log unless specifically needed (Dirk, 1464355). Prune memory at each close (Dirk, 9e54939).

## Open issues / PRs
- None for iteration 17. Repo `scratchpad/` (untracked, PM it17 briefs/scripts/shots) is scratch only, not committed.

## Blockers / waiting on
- none
