# WIP: current

Last updated: 2026-10-28, iteration 22 close (curator, session d2424c00-a6fb-45e6-86ab-53111ee2576f)

## Active run
- Iteration 22 closed: #110 (PR #112), #108 (PR #113), #111 (PR #114) merged; main cc3f269, 207 tests pass. Wiki refreshed to the it22 state.
- Next: iteration 23 scoping by the PM from `memory/wiki/backlog.md` (item 1: highlight the named cells on the grid).

## Streams
| Stream | Status | Next step | Owner |
|---|---|---|---|
| it22 close | done | wiki/WIP merged via `iteration-22-close` (closing lead) | lead |
| it23 | not started | PM scoping | PM |

## Starting the next run
- Method and rules: process.md "Per-issue flow" (red first) and "Test strategy applied" (ATDD, ratio); runner facts: architecture.md "ATDD".
- Layout is at its limit at 360x740 (product.md "Known product gaps", D10): any longer pointing-hidden step 3 needs backlog item 1 or 2 first.
- Reusable it22 scripts (session scratchpad `/tmp/wvr/claude-502/-Users-dirk-Code-weaver-team/d2424c00-a6fb-45e6-86ab-53111ee2576f/scratchpad/`, if /tmp still holds them; copy, do not edit in place): `test-110/` (errcase.sh 32 runner error cases, mutate.py, oracle.js), `test-108/` (README covers r1/; lib.js 5 positions, oracle.js, layout.js, mutate.py; the 5th-position pre-fill order matters: tally 2 if r1c5 is entered first), `111/test/` (pos.js layout, texts.js, oracle.js, mutate.py), PM `pm-it22/` (spike.js, check.js spec-example check, layout/; no README). The other folders have a README.

## Open issues / PRs
- none open (check GitHub on restart).

## Blockers / waiting on
- none
