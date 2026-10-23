# WIP: current

Last updated: 2026-10-23, iteration 20 close (curator, session 541fd2f9-8dfe-4936-a1b6-0c535e8f682f)

## Active run
- None. Iteration 20 closed: #96 (PR #98, merge 5656017) and #97 (PR #99, merge 834f3e6) delivered and accepted. Main 834f3e6 + the it20 close merge: 175/175 tests, skipped 0.

## Streams
| Stream | Status | Next step | Owner |
|---|---|---|---|
| Iteration 21: claiming (box-line reduction) | not started | PM data spike: claiming frequency on Tricky/Hard and how players could practise it (level or Hint preference), then scope (backlog.md item 1) | PM |

## Starting the next run
- Ratio: tests 2232 / product 1399 = 1.595, cap 2238.4, headroom 6.4 lines. A new technique adds logic and tests: plan listed removals or a trim item first (process.md "Test strategy applied").
- Layout at 360x740: stage-2 Next step button has 1.1 px spare on every pointing seed checked; any new explanation text above it needs a fit check. The stage-3 fold is handled by the #97 scroll (f1h).
- Ids are swapped relative to their roles (`#link` = reserve with key/link sentence, `#key` = invitation); rename chore in backlog tech debt. Read architecture.md before touching them.
- Seed pins in specs: name the walk (unit vs page) and verify before writing the issue (lessons "Scoping and spec").
- it20 scratch scripts (PM spikes pm-it20/, tester test-96/, test-97/ with READMEs) lived in session 541fd2f9's scratchpad; a new session has none: rebuild from the README pattern in process.md.
- Prompts: brief file in the scratchpad with literal absolute paths, one-line prompt; fixed-format evidence report; reviewer then tester in detached worktrees, lead `merge --ff-only`; keep the tester worktree until the lead re-run; agents in the foreground; remove worktrees after the merge.

## Open issues / PRs
- none (after the it20 close PR).

## Blockers / waiting on
- none
