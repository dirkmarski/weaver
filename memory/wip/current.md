# WIP: current

Last updated: 2026-11-02, iteration 27 close (curator; main at bffc0c2).

## Active run
- None. Iteration 27 (#139, own hidden-form rewards say why) merged via PR #141 and closed. Next: iteration 28 scoping from `memory/wiki/backlog.md` item 1 (C5, name one D once).

## Streams
| Stream | Status | Next step | Owner |
|---|---|---|---|
| Request 006 (PR #140) | Open, waiting on Dirk | act on the Response when Answered (backlog item 11) | PM |

## Starting the next run
- ADRs in force: 003 (modules by game area plus shared helpers, architecture.md "Modules"; a new root `*.js` needs a README "## Modules" line) and 002 (one README command, Node built-ins only, no install; calling local services such as Ollama is in line, amended in it27). 001 is superseded.
- Requests: 001-005 Closed; 006 Open (PR #140, needs Dirk). Check `requests/` for Answered items your role raised (index.md "Requests").
- View or check the page with `node tools/serve.js` (never python http.server, never `file://`) or the live site. Keep 127.0.0.1:8000 free during `node --test`; scratch servers use other ports and are stopped by PID before reporting.
- Layout limits: product.md "Known product gaps" / "Mobile" (360x740 own hidden-form rewards 8 lines, `#status` bottom 736.5 vs gate 737; Hint D10 case 10 lines, grid top 5.8 px; 375x812 1.4 px spare). Any longer message needs a 360x740 check.
- Ratio: 1.566x (2495/1593, cap 2549, about 54 lines headroom). Product size = `cat *.js index.html style.css package.json | wc -l`.
- Reusable it27 scripts (scratchpad `/tmp/wvr/claude-502/-Users-dirk-Code-weaver-team/512d8df6-bdf0-4d6d-9806-20017be40830/scratchpad/`, while /tmp holds them; copy, do not edit in place; each folder has a README): `test-139/` (layout.mjs, table.mjs, oracle.mjs, mutants.sh), `pm-139-accept/` (persona round, letters reshuffled per case, mapping.txt), `pm-it27/` (PM spike incl. the LLM spike). Older it26 scripts: see the it26 session scratchpad `8dc2d34a-.../scratchpad/` READMEs if /tmp still holds them.

## Open issues / PRs
- PR #140 (request 006) only; no team issues open.

## Blockers / waiting on
- Backlog item 11 (LLM "Ask about this hint") waits on request 006. Other items for Dirk: backlog.md "Open concerns for Dirk".
