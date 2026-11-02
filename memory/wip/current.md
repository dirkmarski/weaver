# WIP: current

Last updated: 2026-11-02, iteration 27 lead (#139 accepted, PR #141).

## Active run
- Iteration 27: #139 (own hidden-form rewards say why) accepted by the PM and merged via PR #141. Next: iteration 27 close (curator), using the lead log's "Memory notes for the closing lead".

## Streams
| Stream | Status | Next step | Owner |
|---|---|---|---|
| #139 | merged (PR #141) | it27 close | curator |

## Starting the next run
- ADRs in force: 003 (modules by game area plus shared helpers, architecture.md "Modules"; a new root `*.js` needs a README "## Modules" line) and 002 (one README command, Node built-ins only, no install). 001 is superseded.
- Requests: 001-005 all Closed; check `requests/` for Answered items your role raised (index.md "Requests").
- View or check the page with `node tools/serve.js` (never python http.server, never `file://`) or the live site. Keep 127.0.0.1:8000 free during `node --test`; scratch servers use other ports.
- Layout limits: product.md "Known product gaps" / "Mobile" (360x740 D10 case 10 lines, grid top 5.8 px; 375x812 1.4 px spare; longest own reward 6 lines, 45.5 px spare at 360x740).
- Ratio: 1.578x (2495/1581, cap 2529, about 34 lines headroom).
- Reusable it26 scripts (scratchpad `/tmp/wvr/claude-502/-Users-dirk-Code-weaver-team/8dc2d34a-b5fc-44f3-9327-5bb6bd0c4608/scratchpad/`, while /tmp holds them; copy, do not edit in place; each folder has a README): `test-135/` (layout.mjs 13-case main-vs-branch at 360/375/1280, oracle.mjs, mutants.sh, c4time.mjs), PM `pm-it26/spike/` (census and wording variants, vtext4.js, pm-verify.mjs spec check) and `pm-it26/accept/` (blind main-vs-branch persona shots). The it25 scripts are listed in that session's scratch READMEs; /tmp is likely cleared.

## Open issues / PRs
- None open for the team.

## Blockers / waiting on
- None for the team. For Dirk: backlog.md "Open concerns for Dirk".
