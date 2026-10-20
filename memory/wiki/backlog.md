# Backlog

The PM owns this list. This page is the lead's snapshot of it at the end of iteration 13 (from `work-log/iteration-13-product.md`, "Candidate list (PM, ordered, final for it13)"). Start the next scoping here. During an iteration the PM's live list at the bottom of its latest product log supersedes this page; the lead refreshes the snapshot at close. Pruning rule (governance/memory-architecture.md): delivered items are dropped, related ones merged.

## Product candidates (PM, ordered)
1. Explanation depth: show or name which cells a ring rules out (strongest signal; the "and of row N" clause got 3/5 in it13 because players cannot tell which ring explains the box and which the row); a stronger first-click signal for pointing; "same D as before" when one pointing fact gives another cell; "(the box has no other empty cells)" reads like a single; why the naked-form target has only D or X; a key line for the hidden single; minimal rings.
2. Mobile: long messages and key line on a phone (conclusion first?); struck grey vs purple on tinted cells; grid cells about 36 x 58 px at 375 px (grid taller than wide; pre-existing); 375 px level buttons; hint badge at 320 px (the left-edge rule only acts below ~340 px).
3. Pointing reach (watch, no action): early first pointing via generation (filter ready: first useful step within 5 hinted entries, p50/p90/max 96/215/307 ms, 0 of 50 failed) against "don't open with pointing"; a cap on the Tricky preference only if load complaints appear (it13 personas: 3/5, about right); "prefer pointing" on Hard.
4. Slip follow-ups (it11, small, wording-led): extra-clash sentence pointing at the outlines; a partial-fix message; two-unit clash naming; "clear your own number" when the pair includes a given; explain "counted"/"stays uncounted" and judge an overwrite; a marker on entries made during a clash; Hint/Verify naming one pair at a time.
5. Small wording items: shared "not counted" ending; re-entering a hint-credited cell says "on your own"; "(see below)" in the finish text; fold away definitions once learned; heavy naked-single digit list.
6. Long-term: a middle hint level; progress across puzzles; claiming, then pairs, each with its own level (personas rank last).

Watch: test-to-product ratio 1.599x at main 9a2caf6 (1943/1215; about 1 line of headroom to 1.6x). The next issue that adds tests either trims redundant assertions in the files it touches (listed, tester-confirmed, as #61 did) or comes after a separate trim item; the PM decides when scoping it14.

Not wanted: instant red on a wrong entry (it10); counting entries made during a clash (it11); retroactive counting after a fix (it11).

## Open tech debt and carry-forwards
- `tests/chrome.js` nits (#55 L4): declare `watchdog` above `close`; `gone` is always false in the exit handler; the ppid watchdog is optional (the EPIPE listeners are the essential part).
- `findPointing` without options may return a step where a single already exists (documented; `hintFor` checks singles first, and on Tricky uses `{useful: true}`).
- `singleAfterStep` keeps a redundant filled-cell guard on purpose (it9 N1).
- Tricky and Hard givens bands overlap (27-29); accepted.
- A screen reader may not announce ", clashes" until the cell is refocused (#51 N4); the message line carries the text.
- Page test f4 adds `hint-removed`/`data-d` to a live cell and leaves them (harmless: later tests reopen the page); it does not pin the loop length (no AC requires it; #61 review nits).
- Struck-badge strike centring and gradient direction are not guarded (no AC; #61 review C4/C5).
- Equivalent mutants accepted: `choose` skipping `clearResults` (the picker is only reachable after `newPuzzle`), the left-edge badge rule at 375 px (#56 L2).

## Open concerns for Dirk
- GitHub Pages is not checked or enabled, so there are no real users and all evidence is simulated.
- Agent safety (it13): a reviewer's `rm -rf $TMPDIR` ran against the default system temp dir after a failed chain left TMPDIR unset; the sandbox refused it and nothing was lost. The lead now passes an explicit-temp-dir / `${VAR:?}` rule in prompts; a rule in the agent definitions (`.claude/`, Dirk's) would make it permanent.
