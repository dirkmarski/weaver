# Backlog

The PM owns this list. This page is the lead's snapshot of it at the end of iteration 12 (from `work-log/iteration-12-product.md`, "Candidate list ... after #56 acceptance"). Start the next scoping here. During an iteration the PM's live list at the bottom of its latest product log supersedes this page; the lead refreshes the snapshot at close. Pruning rule (governance/memory-architecture.md): delivered items are dropped, related ones merged.

## Product candidates (PM, ordered)
1. Tricky practice density (next, it13). In it12 fresh play no persona met a pointing hint in 6-45 moves; the first pointing step comes after 6-22 hinted entries. Spike first: generation time for "at least 2 pointing steps" and how early the first comes; then choose denser puzzles vs Hint preferring pointing on Tricky.
2. Explanation depth (pointing and singles). Quick wins: (a) one ring-clause wording for any number of rings (e.g. "a placed D that rules out other cells"); (b) a more legible struck badge, especially on phones. Then: show or name which cells a ring rules out; show why the naked-form target has only D or X; a key line for the hidden single; minimal rings; a clearer first-click case signal.
3. Slip follow-ups (it11, small, wording-led): extra-clash sentence pointing at the outlines; a partial-fix message; two-unit clash naming; "clear your own number" when the pair includes a given; explain "counted"/"stays uncounted" and judge an overwrite; a marker on entries made during a clash; Hint/Verify naming one pair at a time.
4. Small wording items: shared "not counted" ending; re-entering a hint-credited cell says "on your own"; "(see below)" in the finish text; fold away definitions once learned; heavy naked-single digit list.
5. Mobile and long-term: 375 px level buttons; hint badge at 320 px (the left-edge rule only acts below ~340 px); long messages and key line on a phone; a middle hint level; progress across puzzles.
6. Claiming, then pairs, each with its own level (personas rank last).

Watch: test-to-product ratio 1.57x; a trim item is added if it passes 1.6x.

Not wanted: instant red on a wrong entry (it10); counting entries made during a clash (it11); retroactive counting after a fix (it11).

## Open tech debt and carry-forwards
- `tests/chrome.js` nits (#55 L4): declare `watchdog` above `close`; `gone` is always false in the exit handler; the ppid watchdog is optional (the EPIPE listeners are the essential part).
- `findPointing` alone may return a step where a single already exists (documented; `hintFor` checks singles first).
- `singleAfterStep` keeps a redundant filled-cell guard on purpose (it9 N1).
- Tricky and Hard givens bands overlap (27-29); accepted.
- A screen reader may not announce ", clashes" until the cell is refocused (#51 N4); the message line carries the text.
- Equivalent mutants accepted: `choose` skipping `clearResults` (the picker is only reachable after `newPuzzle`), the left-edge badge rule at 375 px (#56 L2).

## Open concerns for Dirk
- GitHub Pages is not checked or enabled, so there are no real users and all evidence is simulated.
