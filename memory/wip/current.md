# WIP: current

Last updated: 2026-10-23, #103 merge (lead, session 54373c68-c664-43ac-8c9e-31688e9eba82)

## Active run
- Iteration 21: #102 (PR #105) and #103 (PR #106, 183/183, skipped 0) merged and accepted. Next: #104 own claiming credit (new lead run).

## Streams
| Stream | Status | Next step | Owner |
|---|---|---|---|
| Iteration 21: claiming (box-line reduction) | #102, #103 done (PR #105, #106); #104 open | deliver #104 (own claiming credit) | lead |

## Starting the next run
- Ratio after #103: tests 2368 / product 1480 = 1.600, at the cap (0 headroom): each new product line earns 1.6 test lines; plan listed removals (mutant-confirmed) or a trim first. #103 already removed 8 redundant assertions in sudoku.test.js/generator.test.js.
- Layout at 360x740 (emulation before load): step texts are 1rem below 560 px (#103 D10); stage-2 Next step bottom 701.3-719.3 (Tough 1/3/4/7, Hard 14/108; D7 closed). Stage-3 invitation bottom 738.5/740 (1.5 px spare, PM watch). Picker wraps 3+2 at 360/375 (personas: lopsided, mobile backlog).
- Ids are swapped relative to their roles (`#link` = reserve with key/link sentence, `#key` = invitation); rename chore in backlog tech debt. Read architecture.md before touching them.
- Seed pins in specs: name the walk (unit vs page) and verify before writing the issue (lessons "Scoping and spec").
- it20 scratch scripts (PM spikes pm-it20/, tester test-96/, test-97/ with READMEs) lived in session 541fd2f9's scratchpad; a new session has none: rebuild from the README pattern in process.md.
- #102 evidence scripts (dev-b/, test-102/ with READMEs; claiming fallback seeds Hard 57 naked, 184 hidden, 108 column naked, 58 column hidden) are in session 54373c68's scratchpad.
- #103 evidence: test-103/ (t1 oracle walks, t3 pins, t4 picker, t5 layout, t6 regression, t8 AC6; README), dev-103/, pm-103/ (play.js full Hint play-through) in session 54373c68's scratchpad. #104: Tough gives many claiming chances (tester seeds 1-10: 58), natural page pin for own claiming.
- Prompts: brief file in the scratchpad with literal absolute paths, one-line prompt; fixed-format evidence report; reviewer then tester in detached worktrees, lead `merge --ff-only`; keep the tester worktree until the lead re-run; agents in the foreground; remove worktrees after the merge.

## Open issues / PRs
- #104 open (it21).

## Blockers / waiting on
- none
