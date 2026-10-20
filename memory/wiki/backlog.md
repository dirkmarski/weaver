# Backlog

The PM owns this list. This page is the lead's snapshot of it at the end of iteration 11, copied from the PM's list in `work-log/iteration-11-product.md`. Start the next scoping from this page. The PM's live list, at the bottom of the latest `work-log/iteration-N-product.md`, supersedes this page while an iteration runs, and the lead refreshes the snapshot when the iteration closes.

## Product candidates (PM, ordered)
1. Pointing visuals v2 (next):
   - rings on the digits that matter only;
   - a one-line key for the dashed and struck marks;
   - the badge in D's own note slot (it10 D1);
   - avoid trivial confinements;
   - a clearer first-click case signal.
2. Tricky practice density:
   - at least 2 pointing steps per Tricky puzzle (measure generation time first);
   - Hint preferring pointing on Tricky.
3. Slip follow-ups. These are small and mostly wording, and can ride along with 1 or 2:
   - a. Extra-clash sentence: replace "click Verify to see which" (Verify does not flag givens) with wording that points at the outlined cells or says the extra cell is a given.
   - b. Partial fix: after one of two clashes is fixed, the message goes blank while outlines remain. Idea: "Some numbers still break the rules (outlined)".
   - c. An entry clashing in two units: text 1 names only the first unit. Text 1 and Hint can name different pairs for the same slip.
   - d. When one cell of the named pair is a given, say "clear your own number" instead of "change or clear one of them".
   - e. Judge an overwrite. Explain what "counted" means and that "stays uncounted" is not "never". The retype tip is held back (PM decision D8: it overpromises).
   - f. A marker on entries made during a clash; credit a correct one after the fix. Not retroactive (D2/D6 stand).
   - g. Hint names one clashing pair at a time; Verify does not name cells.
4. Small wording items:
   - the clash and non-technique texts share the "not counted" ending;
   - re-entering a hint-credited cell says "on your own" while the count stays "with a hint";
   - the finish text "(see below)";
   - fold away the definitions once learned.
5. Claiming, then pairs, each with its own level. Personas rank these last for now.
6. Mobile layout (the 2x2 level buttons at 375 px; long messages on a phone: the after-slip text runs to about 6-7 lines), a middle hint level, progress across puzzles.

Not wanted:
- instant red on a wrong or clashing entry (it10);
- counting entries made during a clash (it11);
- retroactive counting after a fix (it11).

Delivered and removed from this list:
- slip recovery v1: #50 (named clash in the entry text and in Hint) and #51 (clash outline and fixed message), it11;
- clash feedback v1: #46, it10;
- pointing hint clarity: #45, it10.

## Open tech debt and carry-forwards
- Test code is about 1.15x product code (guide ~1x), down from 1.18x: it11 mostly extended existing tests. Watch the growth.
- `findPointing` on its own may return a step where a single already exists. This is documented; callers such as `hintFor` check singles first.
- UI wiring has no repo tests. The tester and PM headless play tools (CDP, seeded Math.random) live in session scratchpads, not the repo, and are rebuilt each session. In it11, eight of the fifteen #51 mutants were caught only by the page suite. A repo-level DOM test harness is a candidate for the team to raise with the PM.
- `singleAfterStep` keeps a redundant filled-cell guard on purpose (it9 N1).
- Tricky and Hard givens bands overlap (27-29); accepted.
- The pointing badge covers pencil note 3 of a marked cell while the hint shows (it10 D1, accepted; the fix is part of candidate 1).
- A screen reader may not announce ", clashes" on the focused cell until it is refocused, because the label changes without a focus move (#51 review N4). The message line carries the text.

## Open concerns for Dirk
- GitHub Pages is not checked or enabled, so there are no real users and all evidence is simulated.
