# WIP: current

Last updated: 2026-10-23, iteration 21 close (curator, session 54373c68-c664-43ac-8c9e-31688e9eba82)

## Active run
- None. Iteration 21 (claiming: #102, #103, #104) is closed. Next: iteration 22, PM scoping from `memory/wiki/backlog.md`, #108 first.

## Streams
| Stream | Status | Next step | Owner |
|---|---|---|---|
| #108 own pointing and claiming rewards state the final step | open issue, not started | PM confirms scope and ACs, then lead delivers; persona gate 4.0 must pass (closes D16) | PM, lead |

## Starting the next run
- Ratio at main 96a311c: tests 2374 / product 1484 = 1.5997 (0.4 lines headroom). #108 changes product text lines: plan mutant-confirmed removals (or a trim) before adding tests.
- Layout at 360x740 is tight (product.md "Known product gaps", Mobile): stage-3 invitation 1.5 px spare; if #108 lengthens the own-reward message, measure the status/tally at 360x740 and 375x812 on the longest message first.
- Ids are swapped relative to their roles (`#link` = reserve, `#key` = invitation); rename chore in backlog tech debt. Read architecture.md before touching them.
- Reusable it21 scripts (session-scoped, under `/tmp/wvr/claude-502/-Users-dirk-Code-weaver-team/54373c68-c664-43ac-8c9e-31688e9eba82/scratchpad/`; gone once /tmp is cleared, then rebuild from the README pattern in process.md). Copy, do not edit in place:
  - `test-104/pagelib.js`: CDP page driver (picker click, real mouse/key input, emulation before load, screenshots); `test-104/README.md` for setup.
  - `test-104/oracle.js` + `t1-oracle.js`: independent candidate-set oracle with one-step pointing/claiming classifier (own rewards; #108 regression).
  - `test-104/t7-mutants.py`, `dev-104/mutants.py`: Python mutant runners (paired main/branch removal checks).
  - `test-104/t2-page.js`: own-reward texts on the page (seeds 3, 12, 1, 7); `test-103/t5-layout.js`: 360x740 stage-2/stage-3 layout table.
  - `pm-103/play.js`: full Hint-only play-through on the page; `pm-it21/spike-lib.js`: claiming model used for pins.

## Open issues / PRs
- #108 open (it22 item 1, PM): own pointing and claiming rewards state the final step.

## Blockers / waiting on
- none
