# WIP: current

Last updated: 2026-10-29, it24 close (curator, session c62cf25c-8b8e-4cda-905a-5ce306a4299f)

## Active run
- Iteration 24 closed: #121 (ADR 002 local run, PR #123) and #122 (own pointing/claiming reward marks, PR #124) merged; main 65a90a6, 230 tests pass (21 specs), ratio 1.581x. Wiki refreshed to the it24 state.
- Next: iteration 25 scoping by the PM from `wiki/backlog.md` item 1 (marks follow-ups) or item 2 (shorter box names).

## Streams
| Stream | Status | Next step | Owner |
|---|---|---|---|
| it24 close | curator wiki/WIP done | closing lead reviews and merges the memory changes | closing lead |

## Starting the next run
- ADRs in force: 001 (modules: put code in the module that owns the concern, architecture.md "Modules"; a new root `*.js` needs a README "## Modules" line) and 002 (one README command, Node built-ins only, no install).
- View or check the page with `node tools/serve.js` (never python http.server, never `file://`). Keep 127.0.0.1:8000 free during `node --test` (the ADR 002 spec serves there); scratch servers use other ports.
- Layout is at its limit at 360x740 (product.md "Known product gaps", D10): any longer pointing-hidden step 3 needs backlog item 2 (shorter box names) first. Reward key lines fill the 64 px reserve at 3 lines (155 chars): a longer key needs a layout check.
- Waiting on Dirk (pass on, no team action): enable GitHub Pages (PM C1); optional clarifying ADR on concern granularity (PM C2). See backlog.md "Open concerns for Dirk".
- Reusable it24 scripts (session scratchpad `/tmp/wvr/claude-502/-Users-dirk-Code-weaver-team/c62cf25c-8b8e-4cda-905a-5ce306a4299f/scratchpad/`, while /tmp holds them; copy, do not edit in place; each has a README): `test-122/scripts/` (lib.mjs page reader + CDP real input, layout.mjs main-vs-branch layout + facts oracle, ac3.mjs mark lifetime, pixel.mjs main-vs-branch pixel compare, serveboth.mjs two trees on 8111/8112, mutants.py, probe*.mjs seed finders), `test-121/scripts/` (loads.mjs N fresh-profile loads, shots.mjs/compare.mjs screenshot parity; supersede the it23 `test-117/` copies), PM `pm-it24/` (persona briefs, shots with facts.md). The it23 session scratch (daff0a10...) is superseded.

## Open issues / PRs
- none open.

## Blockers / waiting on
- none for the team.
