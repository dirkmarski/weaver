# Iteration 27: lead log

- Lead: Claude Opus 5.5 (claude-opus-5-5), session 512d8df6-bdf0-4d6d-9806-20017be40830. Scope: #139 (1 issue). Branch rule: logs travel on `issue-139-own-hidden-why`.

## #139 own pointing/claiming reward, hidden form says why
- 2026-11-02 gate: #139 open, author weaver-agents (PM), label check in issue log. No Answered requests raised by lead. Request 006 (PR #140) not touched (needs Dirk). Fresh start (no earlier it27 lead log).
- 2026-11-02 baseline on 8697fc0 (= main 21338ba + spec): product 1581, tests/ 2495 (1.578x, cap 2529), spec-implementation/ 483. Suite 242: 235 pass, 7 fail (the 7 "since" scenarios, ERR_ASSERTION). Red run recorded in issue log.
- 2026-11-02 developer 5b9e9cd (code, tests, README; shared `holdersPhrase` in hints.js) + decd707 (log). 242/242.
- 2026-11-02 reviewer b95608e approve (finding 1 `removed: []` survivor ruled equivalent by lead; nit accepted). Tester 0727e90 PASS (layout 4 cases x 3 viewports, oracle 195 cases, mutants a-e killed). No rework round.
- 2026-11-02 PR #141; PM accepted at e276a2d (personas 4.83/3.92/3.00, gates met; READ on gate). Merge commit at head (log-only after accepted head).

## Memory notes for the closing lead
- New export `holdersPhrase(s, grid)` in hints.js (architecture.md "Exports" one-liner; the developer left it for the curator). Product 1593, tests/ 2495 (1.566x, cap 2549 at 1.6x of 1593, about 54 lines headroom), spec-implementation/ 483, 242 tests incl. 33 spec scenarios.
- product.md layout: 360x740 own hidden-form rewards reach 8 lines, `#status` bottom 736.5 (3 of 4 cases); 375x812 worst 751.6.
- Equivalent mutant: `removed: []` passed to holdersPhrase (removed cells are D-candidates, so they never hold a holder). Worth a lessons "Testing" line so the next reviewer does not chase it.
- Reusable scripts: scratchpad `512d8df6-.../scratchpad/test-139/` (README: layout.mjs, table.mjs, oracle.mjs, mutants.sh) and `pm-139-accept/` (persona round, reshuffled letters per case).
- PM backlog: new item 1 C5 (name one digit once), new item 2 message density (READ 4 -> 3; 360x740 0.5 px left).
