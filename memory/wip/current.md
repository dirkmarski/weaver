# WIP: current

Last updated: 2026-10-29, iteration 23 close (curator, reviewed by the closing lead; session daff0a10-2135-459c-80b7-137f621f7088)

## Active run
- Iteration 23 closed: ADR 001 delivered by #116 (PR #118, main bfd7b54) and #117 (PR #119, main 52f8c6a); 222 tests pass, specs 14/14, screenshots pixel-identical. Wiki refreshed to the it23 state (architecture.md rewritten for the 12 modules).
- Next: iteration 24 scoping by the PM from `memory/wiki/backlog.md` item 1 (highlight the cells a reward or hint names; persona A/B first, then the spec).

## Streams
| Stream | Status | Next step | Owner |
|---|---|---|---|
| it23 close | done: curator wiki/WIP reviewed and merged by the closing lead | none | closing lead |
| it24 | not started | PM scoping | PM |

## Starting the next run
- New feature code follows ADR 001: put it in the module that owns the concern (architecture.md "Modules"); a new root `*.js` needs a README "## Modules" line or the guard fails.
- View or check the page with `node tools/serve.js` (never python http.server, never `file://`).
- Layout is at its limit at 360x740 (product.md "Known product gaps", D10): any longer pointing-hidden step 3 needs backlog item 1 or 2 first.
- Waiting on Dirk (pass on, no team action): enable GitHub Pages (PM C1); optional clarifying ADR on concern granularity (PM C2). See backlog.md "Open concerns for Dirk".
- Reusable it23 scripts (session scratchpad `/tmp/wvr/claude-502/-Users-dirk-Code-weaver-team/daff0a10-2135-459c-80b7-137f621f7088/scratchpad/`, while /tmp holds them; copy, do not edit in place; each has a README): `test-117/scripts/` (shots.mjs main-vs-branch screenshots on 4 states x 2 sizes with console capture, compare.mjs pixel diff, loads.mjs N fresh-profile page loads, serve.mjs logging static server, cdp.mjs real-input CDP client, mutants.py guard mutants), `dev-117/parity.py` (declaration-level parity of old vs new code; adapt for any future move/split), `dev-117/deadcheck.py` (unused declarations, exports, imports). `test-116/` is superseded by `test-117/` (it used python http.server).

## Open issues / PRs
- none open (check GitHub on restart).

## Blockers / waiting on
- none for the team.
