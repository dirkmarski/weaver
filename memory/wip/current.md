# WIP: current

Last updated: 2026-10-29, it24 #122 delivery (lead, session c62cf25c-8b8e-4cda-905a-5ce306a4299f)

## Active run
- Iteration 23 closed: ADR 001 delivered by #116 (PR #118, main bfd7b54) and #117 (PR #119, main 52f8c6a); 222 tests pass, specs 14/14, screenshots pixel-identical. Wiki refreshed to the it23 state (architecture.md rewritten for the 12 modules).
- Iteration 24 scoped by the PM: #121 (ADR 002 local run, spec on `issue-121-local-run`), then #122 (own reward marks, spec on `issue-122-reward-marks`). #121 merged; #122 in delivery.

## Streams
| Stream | Status | Next step | Owner |
|---|---|---|---|
| it23 close | done: curator wiki/WIP reviewed and merged by the closing lead | none | closing lead |
| it24 | #121 then #122, specs on branches | #121 done (PR #123 merged); #122 in delivery on issue-122-reward-marks (part A steps/drivers next) | lead |

## Starting the next run
- New feature code follows ADR 001: put it in the module that owns the concern (architecture.md "Modules"); a new root `*.js` needs a README "## Modules" line or the guard fails.
- View or check the page with `node tools/serve.js` (never python http.server, never `file://`). ADR 002: `specs/running/local-run.feature` runs it on port 8000 during `node --test`, so keep 127.0.0.1:8000 free while testing.
- Layout is at its limit at 360x740 (product.md "Known product gaps", D10): any longer pointing-hidden step 3 needs backlog item 1 or 2 first.
- Waiting on Dirk (pass on, no team action): enable GitHub Pages (PM C1); optional clarifying ADR on concern granularity (PM C2). See backlog.md "Open concerns for Dirk".
- Reusable it23 scripts (session scratchpad `/tmp/wvr/claude-502/-Users-dirk-Code-weaver-team/daff0a10-2135-459c-80b7-137f621f7088/scratchpad/`, while /tmp holds them; copy, do not edit in place; each has a README): `test-117/scripts/` (shots.mjs main-vs-branch screenshots on 4 states x 2 sizes with console capture, compare.mjs pixel diff, loads.mjs N fresh-profile page loads, serve.mjs logging static server, cdp.mjs real-input CDP client, mutants.py guard mutants), `dev-117/parity.py` (declaration-level parity of old vs new code; adapt for any future move/split), `dev-117/deadcheck.py` (unused declarations, exports, imports). `test-116/` is superseded by `test-117/` (it used python http.server).

## Open issues / PRs
- #122 (spec on issue-122-reward-marks). Check GitHub on restart.

## Blockers / waiting on
- none for the team.
