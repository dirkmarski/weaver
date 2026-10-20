# Backlog

Owned by the PM; this is a snapshot as of the iteration 10 scoping. The PM's current list (bottom of the latest `work-log/iteration-N-product.md`) supersedes this page. The lead refreshes this snapshot after each iteration.

## Product candidates (PM, ordered)
In flight (iteration 10): #45 pointing hint clarity (target wording, hidden-form unit tint, confined/removed marks); #46 clash feedback on an entry (neutral text, no red; a rule fact, so it fits the #31 rule).
1. Pointing visuals v2: rings only on the relevant digits (B: clutter); avoid trivial confinements as the example (2/12 walls in Tricky seeds 1-10).
2. Tricky practice density: at least 2 pointing steps per Tricky puzzle (measure generation time first; seeds 1-10 had 12 walls). Hint preferring pointing on Tricky may go with this.
3. Small wording items:
   - the re-entry message says "on your own" while the count stays "with a hint";
   - add "(see below)" to the finish text;
   - fold away the grey definitions once a technique is learned (C).
4. Claiming, then pairs, each with its level.
5. Mobile layout (2x2 level buttons at 375 px), a middle hint level, progress across puzzles.

Not wanted: instant red on a wrong or clashing entry (no persona asked for it in it10; red stays after Verify only).
Delivered and gone from this list: count pointing (#42, it9).

## Open tech debt and carry-forwards
- Test code is about 1.21x product code (guide ~1x). The reviewer judged it justified; watch the growth.
- `findPointing` on its own may return a step where a single already exists. This is documented; callers such as `hintFor` check singles first.
- UI wiring has no repo tests. The tester and PM headless play tools (CDP, seeded Math.random) live in session scratchpads, not the repo, and are rebuilt each session.
- `singleAfterStep` keeps a redundant filled-cell guard on purpose (it9 N1).
- Tricky and Hard givens bands overlap (27-29); accepted.
- Closed in it9: the status-class regex was replaced by `creditEntry` `kind` plus `statusClass`.

## Open concerns for Dirk
- GitHub Pages is not checked or enabled, so there are no real users and all evidence is simulated.
