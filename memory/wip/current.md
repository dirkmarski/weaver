# WIP: current

Last updated: 2026-11-02, it25 close (curator, session 226c8fac-a151-4b1c-af1a-02f108c103b5)

## Active run
- Iteration 25 delivered: #126 (ADR 003, 10 modules, PR #130), #127 (README View names https://dirkmarski.github.io/weaver/, PR #131; PM AC4 live-site check passed), #128 (box names by position, U+2011, PR #132; PM D9/D10). main 91fdf71, 230 tests (22 specs), ratio 1.597x. Wiki refreshed to the it25 state on branch `iteration-25-close`.
- Next: iteration 26 scoping by the PM from `wiki/backlog.md` item 1 (why the unit's other cells are out) together with item 2 (message density); the 360x740 room must be solved first.

## Streams
| Stream | Status | Next step | Owner |
|---|---|---|---|
| PR #129 (`it25-pm-scoping`: PM log, #126-#128 acceptances, request 001/002 Follow-ups) | open | merge first | closing lead |
| it25 close (`iteration-25-close`: wiki, WIP, requests 003-005 closed) | pushed, no PR yet | open PR, merge after #129; then set requests 001 and 002 to `Status: Closed` | closing lead |

## Starting the next run
- ADRs in force: 003 (modules by game area plus shared helpers, architecture.md "Modules"; a new root `*.js` needs a README "## Modules" line) and 002 (one README command, Node built-ins only, no install). 001 is superseded.
- Check `requests/` for Answered items your role raised (index.md "Requests").
- View or check the page with `node tools/serve.js` (never python http.server, never `file://`) or the live site. Keep 127.0.0.1:8000 free during `node --test`; scratch servers use other ports.
- Layout is at its limit at 360x740 (product.md "Known product gaps", D10): the D10 case is 10 lines, grid top 5.8 px; #128 saved no line there. Reward key lines fill the 64 px reserve at 3 lines (155 chars).
- Ratio headroom is about 5 lines: plan listed removals or spec pins at scoping.
- Reusable it25 scripts (scratchpad `/tmp/wvr/claude-502/-Users-dirk-Code-weaver-team/226c8fac-a151-4b1c-af1a-02f108c103b5/scratchpad/`, while /tmp holds them; copy, do not edit in place; each folder has a README): `test-128/` (states.mjs/layout.mjs main-vs-branch layout at 360x740 and 1280x900 incl. the D10 box case, report.py, codepoints.py; facts.md), `test-126/` (shots.mjs/diff.mjs pixel parity, loads.mjs N fresh loads), `dev-126/parity.mjs` (declaration parity; pair with a sorted-line md5, lessons "Scoping and spec"), `test-127/mutate.py` (README mutants), PM `pm-128/` (persona briefs 1 and 2, blind main-vs-branch shots).

## Open issues / PRs
- PR #129 open. No open issues for the team.

## Blockers / waiting on
- none for the team. For Dirk: backlog.md "Open concerns for Dirk".
