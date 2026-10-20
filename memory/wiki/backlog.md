# Backlog

Owned by the PM; this is a snapshot as of the end of iteration 10. The PM's current list (bottom of the latest `work-log/iteration-N-product.md`) supersedes this page. The lead refreshes this snapshot after each iteration.

## Product candidates (PM, ordered)
1. Clash follow-ups:
   - text (b) after an earlier slip reads as if a legal entry were wrong (B, C): say the entry fits and name the clashing cells instead of only pointing to Verify (check against #31);
   - a subtle non-red marker on a cell reported as a clash (A, B, C found the message-only clash easy to miss; needs a mock-up, since red (K2) was rejected);
   - optional: name every clashing unit (B).
2. Pointing visuals v2:
   - rings on the relevant digits only (B, C: the second click is busy);
   - a short legend for the dashed and struck marks (C);
   - draw the badge in D's own note slot (it10 D1);
   - avoid trivial confinements as the example;
   - a clearer first-click case signal (C).
3. Tricky practice density: at least 2 pointing steps per Tricky puzzle (measure generation time first); Hint preferring pointing on Tricky.
4. Small wording items:
   - the clash and non-technique texts share the "not counted" ending;
   - re-entering a hint-credited cell says "on your own" while the count stays "with a hint";
   - the finish text "(see below)";
   - fold away the definitions once learned (C);
   - the `notCounted` code comment still says "whether the digit is right".
5. Claiming, then pairs, each with its level.
6. Mobile layout (2x2 level buttons at 375 px; the message line can be missed on a phone, A), a middle hint level, progress across puzzles.

Not wanted: instant red on a wrong or clashing entry (rejected by A, B and C at the it10 mock-up; red stays after Verify only).
Delivered and gone from this list: count pointing (#42, it9); pointing hint clarity (#45, it10); clash feedback v1 (#46, it10).

## Open tech debt and carry-forwards
- Test code is about 1.18x product code (guide ~1x), down from 1.21x: it10 extended existing tests instead of adding test blocks. Watch the growth.
- `findPointing` on its own may return a step where a single already exists. This is documented; callers such as `hintFor` check singles first.
- UI wiring has no repo tests. The tester and PM headless play tools (CDP, seeded Math.random) live in session scratchpads, not the repo, and are rebuilt each session.
- `singleAfterStep` keeps a redundant filled-cell guard on purpose (it9 N1).
- Tricky and Hard givens bands overlap (27-29); accepted.
- Closed in it9: the status-class regex was replaced by `creditEntry` `kind` plus `statusClass`.
- Pointing badge covers pencil note 3 of a marked cell while the hint shows (it10 D1, accepted; fix idea is in candidate 2).

## Open concerns for Dirk
- GitHub Pages is not checked or enabled, so there are no real users and all evidence is simulated.
