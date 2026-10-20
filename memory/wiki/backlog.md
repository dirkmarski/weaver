# Backlog

Owned by the PM; this is a snapshot as of the end of iteration 9. The PM's current list (bottom of the latest `work-log/iteration-N-product.md`) supersedes this page. The lead refreshes this snapshot after each iteration.

## Product candidates (PM, ordered)
1. Pointing hint clarity and visuals:
   - name the answer digit separately from the pointing digit (in it9, C typed the pointing digit 1 into a cell that takes 7);
   - mark the confined box cells and the removed cells;
   - ring only the relevant digits;
   - tint the unit in the hidden form;
   - avoid trivial confinements as the example.
2. Tricky practice density: at least 2 pointing steps per Tricky puzzle (measure generation time first). Hint preferring pointing on Tricky may go with this or with 5.
3. Feedback on conflicting or wrong entries:
   - B and C asked again in it9;
   - needs a decision against the #31 rule that the app never says whether a digit is right (a conflict is a rule fact, so it may fit);
   - includes "not counted" wording v2.
4. Small wording items:
   - the re-entry message says "on your own" while the count stays "with a hint";
   - add "(see below)" to the finish text;
   - fold away the grey definitions once a technique is learned (C finds them noisy).
5. Claiming, then pairs, each with its level.
6. Mobile layout (2x2 level buttons at 375 px), a middle hint level, progress across puzzles.

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
