# WIP: current

Last updated: 2026-10-28, iteration 22, #111 PR #114 at PM acceptance (lead, session d2424c00-a6fb-45e6-86ab-53111ee2576f)

## Active run
- Iteration 22, PM order: #110 ATDD foundation -> #108 own pointing/claiming rewards state the final step -> #111. One lead invocation per issue, in that order.
- #110 done: PR #112 merged. #108 done: PR #113 merged (code a3e4b0d, PM accepted 578db0f after one rejection and a spec rework, AC6 4.23). #111: PR #114 open (code b2de413), review approve, test pass, lead check done; at PM acceptance.

## Streams
| Stream | Status | Next step | Owner |
|---|---|---|---|
| #111 pointing explanation names the unit in step 3 (hidden form) | PR #114, PM acceptance | PM accepts on a stated head; lead merges with a merge commit | PM, lead |

## Starting the next run
- ATDD (from #110): `node --test` runs `specs/**/*.feature` via `spec-implementation/specs.test.js`; specs-only `node --test spec-implementation/specs.test.js`. specs/ is PM-only (hook). Steps hold assertions, `drivers/` alone loads `sudoku.js`. spec-implementation/ is not under the tests/ 1.6x cap (PM D2), measured on its own (303 lines after #110; PM D5: growth should be steps/drivers, any runner change justified in the PR). PM D6 spec rules: every Examples column used by a step, no `|` in cells. Step texts are global across features: a new steps file must not redefine an existing text (ambiguous); reuse `the message reads "..."` etc. from `steps/own-singles.js`.
- Ratio (tests/ only) after #108: tests 2376 / product 1500 = 1.584 (cap 2400, 24 lines headroom). New behaviour can be pinned by specs instead of unit tests.
- Layout at 360x740 is tight: after #108 the longest own reward (pointing hidden, 269 chars) is 7 lines, #status bottom 715.5, 24.5 px spare. Own rewards use U+2011 in box ranges, hints use "-" (PM C2, open). #111 changes hint step 3: measure the longest hint at 360x740 and 375x812 first.
- Ids are swapped relative to their roles (`#link` = reserve, `#key` = invitation); read architecture.md before touching them.
- Reusable #108 scripts: session scratchpad `test-108/` and `test-108/r1/` (README: lib.js 5 positions, oracle.js, layout.js with range-split check, mutate.py). `gh pr view/edit` fails on token scopes; use `gh api` REST.
- Reusable it22 scripts (session-scoped, under `/tmp/wvr/claude-502/-Users-dirk-Code-weaver-team/d2424c00-a6fb-45e6-86ab-53111ee2576f/scratchpad/test-110/`, see its README): `errcase.sh` (32 runner error cases), `mutate.py`, `oracle.js` (node + real Chrome page check of spec texts on a fixed puzzle). it21 scripts (pagelib.js, oracles, mutant runners) are in the it21 session scratchpad listed in the it21 close log, if /tmp still holds them.

## Open issues / PRs
- #111 open, PR #114 (it22 item 3). Worktrees ../wt-review-111, ../wt-test-111, ../wt-test-111-main: remove after the merge. Tester scripts: session scratchpad `111/test/` (README). #108 closed by PR #113, #110 by PR #112.

## Blockers / waiting on
- none
