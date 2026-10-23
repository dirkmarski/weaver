# WIP: current

Last updated: 2026-10-23, #102 start (lead, session 54373c68-c664-43ac-8c9e-31688e9eba82)

## Active run
- Iteration 21, #102 (lead session 54373c68): branch `issue-102-hint-claiming` from main 61f2db8 (175/175, skipped 0). Developer part A (logic) next, then part B (marks/page), reviewer, tester, PM acceptance.

## Streams
| Stream | Status | Next step | Owner |
|---|---|---|---|
| Iteration 21: claiming (box-line reduction) | scoped (PM log iteration-21-product.md); #102 in progress | deliver #102, then #103 (Tough level), then #104 (own claiming credit), one lead at a time | lead |

## Starting the next run
- Ratio: tests 2232 / product 1399 = 1.595, cap 2238.4, headroom 6.4 lines. A new technique adds logic and tests: plan listed removals or a trim item first (process.md "Test strategy applied").
- Layout at 360x740: stage-2 Next step button has 1.1 px spare on every pointing seed checked; any new explanation text above it needs a fit check. The stage-3 fold is handled by the #97 scroll (f1h).
- Ids are swapped relative to their roles (`#link` = reserve with key/link sentence, `#key` = invitation); rename chore in backlog tech debt. Read architecture.md before touching them.
- Seed pins in specs: name the walk (unit vs page) and verify before writing the issue (lessons "Scoping and spec").
- it20 scratch scripts (PM spikes pm-it20/, tester test-96/, test-97/ with READMEs) lived in session 541fd2f9's scratchpad; a new session has none: rebuild from the README pattern in process.md.
- Prompts: brief file in the scratchpad with literal absolute paths, one-line prompt; fixed-format evidence report; reviewer then tester in detached worktrees, lead `merge --ff-only`; keep the tester worktree until the lead re-run; agents in the foreground; remove worktrees after the merge.

## Open issues / PRs
- #102, #103, #104 open (it21). No PR yet.

## Blockers / waiting on
- none
