# WIP: current

Last updated: 2026-11-02, #128 merged (lead, session 226c8fac-a151-4b1c-af1a-02f108c103b5)

## Active run
- Iteration 25 (lead session 226c8fac-a151-4b1c-af1a-02f108c103b5): #126 (modules by game area, ADR 003) merged via PR #130; 10 root modules, 228 tests (21 specs), ratio 1.590x (2469/1553, cap 2484). #127 (README names https://dirkmarski.github.io/weaver/) merged via PR #131, README only, 229 tests (22 specs); PM AC4 live-site check pending after merge. #128 (box names by position, U+2011, one `boxName` form) merged via PR #132; 230 tests, ratio 1.597x (2478/1552, cap 2483, 5 lines headroom); PM D8-D10 (AC6 round 1 read 3.72, blind round 2 4.0, D9; D10 grid top 5.8 unchanged). Next: iteration 25 close. PR #129 (PM scoping log + request 001/002 follow-ups + #126 acceptance) open for the closing lead.

## Streams
| Stream | Status | Next step | Owner |
|---|---|---|---|
| #126 | merged (PR #130) | none | - |
| #127 | merged (PR #131) | PM AC4 live-site check | PM |
| #128 | merged (PR #132) | none | - |
| PR #129 | open (PM log, incl. #128 acceptance 00255e0) | merge at iteration close; backlog from it (item 2a new) | closing lead |

## Starting the next run
- ADRs in force: 003 (supersedes 001; modules by game area plus shared helpers, architecture.md "Modules"; a new root `*.js` needs a README "## Modules" line) and 002 (one README command, Node built-ins only, no install).
- View or check the page with `node tools/serve.js` (never python http.server, never `file://`). Keep 127.0.0.1:8000 free during `node --test` (the ADR 002 spec serves there); scratch servers use other ports.
- Layout is at its limit at 360x740 (product.md "Known product gaps", D10): box names are now short (#128) but the D10 case is still 10 lines, grid top 5.8 px: any longer pointing-hidden step 3 must solve room first. Reward key lines fill the 64 px reserve at 3 lines (155 chars): a longer key needs a layout check.
- Waiting on Dirk (pass on, no team action): GitHub Pages is live (request 001, README names it since #127); optional clarifying ADR on concern granularity (PM C2). See backlog.md "Open concerns for Dirk".
- Reusable it25 scripts (scratchpad `/tmp/wvr/claude-502/-Users-dirk-Code-weaver-team/226c8fac-a151-4b1c-af1a-02f108c103b5/scratchpad/`, each with a README): `test-126/` (shots.mjs/diff.mjs main-vs-branch pixel parity on 3 states, loads.mjs N fresh loads), `dev-126/parity.mjs` (declaration parity between two trees). The it24 scripts below are gone (/tmp cleared).
- Former it24 scripts (session scratchpad `/tmp/wvr/claude-502/-Users-dirk-Code-weaver-team/c62cf25c-8b8e-4cda-905a-5ce306a4299f/scratchpad/`, while /tmp holds them; copy, do not edit in place; each has a README): `test-122/scripts/` (lib.mjs page reader + CDP real input, layout.mjs main-vs-branch layout + facts oracle, ac3.mjs mark lifetime, pixel.mjs main-vs-branch pixel compare, serveboth.mjs two trees on 8111/8112, mutants.py, probe*.mjs seed finders), `test-121/scripts/` (loads.mjs N fresh-profile loads, shots.mjs/compare.mjs screenshot parity; supersede the it23 `test-117/` copies), PM `pm-it24/` (persona briefs, shots with facts.md). The it23 session scratch (daff0a10...) is superseded.

## Open issues / PRs
- #128 closed with PR #132; #127 closed with PR #131; PR #129 open (also holds the PM #127 acceptance, 65773da).

## Blockers / waiting on
- none for the team.
