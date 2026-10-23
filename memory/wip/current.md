# WIP: current

Last updated: 2026-10-23, #102 merge (lead, session 54373c68-c664-43ac-8c9e-31688e9eba82)

## Active run
- Iteration 21: #102 merged (PR #105). #103 Tough level in progress (branch issue-103-tough-level, lead session 54373c68): review stage (dev b1d9c62, 0144447; PM D10/D11 4ad81db). Then #104.

## Streams
| Stream | Status | Next step | Owner |
|---|---|---|---|
| Iteration 21: claiming (box-line reduction) | #102 done (PR #105); #103, #104 open | deliver #103 (Tough level), then #104 (own claiming credit), one lead at a time | lead |

## Starting the next run
- Ratio after #102: tests 2360 / product 1475 = 1.600, exactly at the cap (0 headroom): each new product line earns 1.6 test lines; plan listed removals or a trim item first (process.md "Test strategy applied").
- Layout at 360x740 (emulation before or after load gives the same): Next step bottom 675.9 after step 1, 738.9 after step 2 (1.1 px spare) for 2-line step-2 texts; a 3-line step-2 text (claiming column naked Hard s108, pointing hidden Hard s14 on main) puts it at 759.9 (PM watch item D7). The stage-3 fold is handled by the #97 scroll (f1h).
- Ids are swapped relative to their roles (`#link` = reserve with key/link sentence, `#key` = invitation); rename chore in backlog tech debt. Read architecture.md before touching them.
- Seed pins in specs: name the walk (unit vs page) and verify before writing the issue (lessons "Scoping and spec").
- it20 scratch scripts (PM spikes pm-it20/, tester test-96/, test-97/ with READMEs) lived in session 541fd2f9's scratchpad; a new session has none: rebuild from the README pattern in process.md.
- #102 evidence scripts (dev-b/, test-102/ with READMEs; claiming fallback seeds Hard 57 naked, 184 hidden, 108 column naked, 58 column hidden) are in session 54373c68's scratchpad.
- Prompts: brief file in the scratchpad with literal absolute paths, one-line prompt; fixed-format evidence report; reviewer then tester in detached worktrees, lead `merge --ff-only`; keep the tester worktree until the lead re-run; agents in the foreground; remove worktrees after the merge.

## Open issues / PRs
- #103, #104 open (it21).

## Blockers / waiting on
- none
