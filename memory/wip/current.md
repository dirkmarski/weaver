# WIP: current

Last updated: 2026-11-02, #135 merged via PR #137 (lead, session 8dc2d34a-b5fc-44f3-9327-5bb6bd0c4608)

## Active run
- Iteration 26: #135 delivered (hidden-form step 3 says why the unit's other cells are out; PR #137). 237 tests (28 specs), ratio 1.578x (2495/1581, cap 2529, about 34 lines headroom). PM accepted b274709 (AC6 4.56 / 4.00). Wiki product.md and architecture.md updated during the iteration.
- Next: iteration 26 close (closing lead / curator), then PM scoping from the reordered backlog in `work-log/iteration-26-product.md` (item 1: own pointing/claiming reward texts, hidden form; item 2: C5 one digit named once).

## Streams
| Stream | Status | Next step | Owner |
|---|---|---|---|
| #135 | done: PR #136 (PM log) and PR #137 merged | it26 close | closing lead |

## Starting the next run
- ADRs in force: 003 (modules by game area plus shared helpers, architecture.md "Modules"; a new root `*.js` needs a README "## Modules" line) and 002 (one README command, Node built-ins only, no install). 001 is superseded.
- Check `requests/` for Answered items your role raised (index.md "Requests").
- View or check the page with `node tools/serve.js` (never python http.server, never `file://`) or the live site. Keep 127.0.0.1:8000 free during `node --test`; scratch servers use other ports.
- Layout is at its limit at 360x740 (product.md "Known product gaps", D10): the D10 case is 10 lines, grid top 5.8 px; #135 kept it there. 375x812 has 1.4 px left (Tough 14 h17/h18, reserve bottom 810.6). Reward key lines fill the 64 px reserve at 3 lines (155 chars).
- Ratio headroom is about 34 lines (1.578x).
- Reusable it26 scripts (scratchpad `/tmp/wvr/claude-502/-Users-dirk-Code-weaver-team/8dc2d34a-b5fc-44f3-9327-5bb6bd0c4608/scratchpad/`): `test-135/` (layout.mjs 13-case main-vs-branch at 360/375/1280, oracle.mjs, mutants.sh, c4time.mjs; README), PM `pm-it26/spike/` and `pm-it26/accept/`.
- Reusable it25 scripts (scratchpad `/tmp/wvr/claude-502/-Users-dirk-Code-weaver-team/226c8fac-a151-4b1c-af1a-02f108c103b5/scratchpad/`, while /tmp holds them; copy, do not edit in place; each folder has a README): `test-128/` (states.mjs/layout.mjs main-vs-branch layout at 360x740 and 1280x900 incl. the D10 box case, report.py, codepoints.py; facts.md), `test-126/` (shots.mjs/diff.mjs pixel parity, loads.mjs N fresh loads), `dev-126/parity.mjs` (declaration parity; pair with a sorted-line md5, lessons "Scoping and spec"), `test-127/mutate.py` (README mutants), PM `pm-128/` (persona briefs 1 and 2, blind main-vs-branch shots).

## Open issues / PRs
- None open for the team.

## Blockers / waiting on
- none for the team. For Dirk: backlog.md "Open concerns for Dirk".
