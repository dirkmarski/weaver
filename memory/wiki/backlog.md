# Backlog

Owned by the PM; snapshot as of iteration 8 end. The PM's current list in `work-log/` (latest `iteration-N-product.md`) supersedes this page; the lead refreshes this snapshot after each iteration.

## Product candidates (PM, ordered)
1. Count pointing: own recognition in `classifyEntry`; a "Pointing" tally line and grey definition; the finish text recaps all techniques (not "Singles applied" only); the "not counted" text mentions pointing. Includes the status-class testability carry-forward. Evidence: 5 of 5 personas noticed the gap (it8).
2. Pointing hint visuals: mark the box cells the digit is confined to (and the line); ring only relevant digits; tint the unit in the hidden form; avoid trivial confinements as the example.
3. Tricky practice density: at least 2 pointing steps per Tricky puzzle (measure generation time first).
4. Uncounted-entry feedback v2: a correct pair deduction feels "a bit cold"; self-clash message; re-judging.
5. Claiming, then pairs, each with its own level (spike data: claiming adds few puzzles over pointing; hidden pairs are more frequent but harder to explain).
6. Smaller items: mobile layout (2x2 level buttons at 375 px, status layout), a middle hint level, unit wording in rewards, progress across puzzles (a per-technique "learned" state).

## Open tech debt and carry-forwards
- Test code is about 1.17x product code (guide ~1x); reviewer judged it justified.
- `findPointing` on its own may return a step where a single already exists (documented; callers such as `hintFor` check singles first).
- Status-class wiring (the green/red/neutral status) has no repo test; consider a pure status-class helper or a `kind` field.
- UI wiring has no repo tests; tester and PM headless play tools live in session scratchpads, not the repo.
- Tricky and Hard givens bands overlap (27-29); accepted.

## Open concerns for Dirk
- GitHub Pages not checked or enabled; no real users, all evidence simulated.
