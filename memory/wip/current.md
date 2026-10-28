# WIP: current

Last updated: 2026-10-28, iteration 22, #108 PR #113 at PM acceptance (lead, session d2424c00-a6fb-45e6-86ab-53111ee2576f)

## Active run
- Iteration 22, PM order: #110 ATDD foundation -> #108 own pointing/claiming rewards state the final step -> #111. One lead invocation per issue, in that order.
- #110 done: PR #112 merged. #108: PR #113, PM rejected round 1 (AC6 3.92); rework 1 (spec 6e6b477, code a3e4b0d) reviewed, tested, lead-checked; PM re-acceptance pending.

## Streams
| Stream | Status | Next step | Owner |
|---|---|---|---|
| #108 own pointing and claiming rewards state the final step | PR #113, PM acceptance | PM accepts on a stated head (personas, gate mean >=4.0, no case <3.5); lead merges with merge commit | PM, lead |
| #111 pointing explanation names the unit in step 3 (hidden form) | waiting on #108 | same: merge main first, red specs before development | PM, lead |

## Starting the next run
- ATDD (from #110): `node --test` runs `specs/**/*.feature` via `spec-implementation/specs.test.js`; specs-only `node --test spec-implementation/specs.test.js`. specs/ is PM-only (hook). Steps hold assertions, `drivers/` alone loads `sudoku.js`. spec-implementation/ is not under the tests/ 1.6x cap (PM D2), measured on its own (303 lines after #110; PM D5: growth should be steps/drivers, any runner change justified in the PR). PM D6 spec rules: every Examples column used by a step, no `|` in cells. Step texts are global across features: a new steps file must not redefine an existing text (ambiguous); reuse `the message reads "..."` etc. from `steps/own-singles.js`.
- Ratio (tests/ only) at #110 head: tests 2374 / product 1484 = 1.5997 (0.4 lines headroom). #108 changes product text lines: plan mutant-confirmed removals (or a trim) before adding unit tests; new behaviour can be pinned by specs instead.
- Layout at 360x740 is tight (product.md "Known product gaps", Mobile): if #108 lengthens the own-reward message, measure status/tally at 360x740 and 375x812 on the longest message first.
- Ids are swapped relative to their roles (`#link` = reserve, `#key` = invitation); read architecture.md before touching them.
- Reusable it22 scripts (session-scoped, under `/tmp/wvr/claude-502/-Users-dirk-Code-weaver-team/d2424c00-a6fb-45e6-86ab-53111ee2576f/scratchpad/test-110/`, see its README): `errcase.sh` (32 runner error cases), `mutate.py`, `oracle.js` (node + real Chrome page check of spec texts on a fixed puzzle). it21 scripts (pagelib.js, oracles, mutant runners) are in the it21 session scratchpad listed in the it21 close log, if /tmp still holds them.

## Open issues / PRs
- #108 open, PR #113 (it22 item 2), #111 open (item 3). #110 closed by PR #112.

## Blockers / waiting on
- none
