# WIP: current

Last updated: 2026-10-22, lead run for #85, session 28d2788e-8588-47d1-8000-5904c97e526f

## Active run
- Iteration 18 (PM scope: #83, #84, #85 in sequence). #83 merged (PR #86); #84 delivered on issue-84-phone-buttons from a45b784, PR #87 merged; #85 delivered on issue-85-compact-top from 638c0fa, PM ACCEPT at 03ed19b (D9 on AC6), PR #88. All three it18 issues done; iteration close pending (closing lead). No iteration-18 branch: all it18 logs travel on the issue branches.

## Streams
| Stream | Status | Next step | Owner |
|---|---|---|---|
| #83 square cells + chips inside | accepted, PR #86 merged | none | lead |
| #84 one button row, New puzzle by the level, top-aligned | accepted, PR #87 merged | none | lead |
| #85 compact top below 560 px | accepted, PR #88 merged | close iteration 18 | closing lead |

## Starting the next run
- Top candidate (PM): board and explanation visible together on a phone (#77 personas 3/3, top complaint), with the rest of the mobile list (wrapped button row at 375/360, ring discovery cue, explanation below the fold at 375 px).
- Ratio after #85: 2119 tests / 1328 product, cap 2124, headroom 5. Any item adding test lines needs product lines (1.6 each) or listed, reviewer/tester-confirmed removals; a UI item with page tests likely needs a trim first.
- Watch: edge-digit ruled badges at 375 px not pinned (#78 pins D = 2, 8 only); surviving CSS mutants (#77: `steps` class on every explain kind, max-width unpinned); the key line does not mention the ruled badge.
- Agent worktrees: remove them after each issue merge (it17 left wt-main-78, wt-review-78, wt-test-78 and an orphan tester commit ae7a890, log line only; removed at close).
- Prompts: fixed-format evidence report; temp-dir safety rule (scratchpad under /tmp/wvr); no governance/LOG.md; tagged merge-commit messages; real CDP input for click/tap checks; run reviewer, tester, PM and personas in the foreground.
- Do not read the work log unless specifically needed (Dirk, 1464355). Prune memory at each close (Dirk, 9e54939).

## Open issues / PRs
- None for iteration 17. Repo `scratchpad/` (untracked, PM it17 briefs/scripts/shots) is scratch only, not committed.

## Blockers / waiting on
- none
