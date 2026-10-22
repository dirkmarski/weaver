# Backlog

The PM owns this list. This page is the lead's snapshot of it at the end of iteration 17 (from `work-log/iteration-17-product.md`, "Candidate list (PM, ordered, after it17 scoping)", plus the #77/#78 acceptance notes). Start the next scoping here. During an iteration the PM's live list at the bottom of its latest product log supersedes this page; the lead refreshes the snapshot at close. Pruning rule (governance/memory-architecture.md): delivered items are dropped, related ones merged.

Delivered in it17 (dropped): link line under the grid with the button row kept still (#76, was F-72b and the invitation-near-grid part of F-72a); pointing explanation split into a conclusion plus numbered steps (#77); ruled look distinct from a ring (#78, F-72c, also removes the F-72d cramped border).

## Product candidates (PM, ordered)
1. Mobile (it18 #83/#84/#85 done: square cells, one button row, New puzzle beside the level, top alignment, compact top, explanation visible at 375x812 and seed 8 at 360x740): remaining: seed 1 step 3 below the fold at 360x740 (personas 3/3/3, D9; ideas: the blank gap above the buttons, smaller explanation text); pin the 360x740 seed 8 fit with a test; purple hint line 3 lines and repeats the key (3/3); number ranges break at the hyphen; caption leaves "1-9" alone on line 2; a discovery cue on the rings before or with the first explanation (discover 3/4/3, it17); chip legibility on a phone (personas 3/3/3 at #84: tiny, struck digits hard to read, crowd notes 1 and 3); play buttons ~35 px tall, under the 44 px tap guideline (b, #84); blank link reserve under the hint line (3/3, kept by D3); New puzzle confirmation (a); "Hard" wraps alone on the picker at 375 px; caret line in the target cell; F2 notes contrast in hatched cells; soft keyboard on a hatched-cell tap (not testable headless); struck grey vs purple on tinted cells; hint badge at 320 px.
2. Explanation depth: "show me why" / reveal steps one at a time on top of #77 (2 of 3 personas asked for tap-to-reveal); shorter naked step 3; conclusion line set apart; no orphan tails (non-breaking space between "row"/"column" and its number); minimal rings; a stronger first-click signal for pointing; "same D as before"; box-case wording; keyboard reach for given rings; watch: "has every digit except" -> "sees", hidden-form step 3 saying why the other unit cells are out, "hatched" -> "striped", grouped "(same row)" (F-72e), highlight the shared unit (F-72f), many purple marks to learn; the key line does not name the ruled badge (#78, candidate if players miss it).
3. Pointing reach (watch, no action): early first pointing via generation; a cap on the Tricky preference; "prefer pointing" on Hard.
4. Slip follow-ups (it11, small, wording-led): extra-clash sentence; a partial-fix message; two-unit clash naming; "clear your own number"; explain counted/uncounted; a marker on entries made during a clash; Hint/Verify naming one pair at a time.
5. Small wording items: F3 the two-partner "and" (watch); shared "not counted" ending; re-entering a hint-credited cell says "on your own"; "(see below)" in the finish text; fold away definitions once learned; heavy naked-single digit list; solid rings shown before the key mentions them (watch); the invitation is wordy.
6. Long-term: a practice puzzle per technique; a middle hint level; progress across puzzles; claiming, then pairs, each with its own level.

Watch: test-to-product ratio at the cap, 1.600x at main 3d831d1 (2110/1319; cap floor(1.6 x product) = 2110, 0 lines of headroom). Each new product line earns 1.6 test lines; removals stay listed, reviewer- and tester-confirmed, never AC-required, no line packing. A UI item with page tests will likely need a trim first.

Not wanted: instant red on a wrong entry (it10); counting entries made during a clash (it11); retroactive counting after a fix (it11).

## Open tech debt and carry-forwards
- `tests/chrome.js` nits (#55 L4): declare `watchdog` above `close`; `gone` is always false in the exit handler; the ppid watchdog is optional (the EPIPE listeners are the essential part).
- `findPointing` without options may return a step where a single already exists (documented; `hintFor` checks singles first, and on Tricky uses `{useful: true}`).
- `singleAfterStep` keeps a redundant filled-cell guard on purpose (it9 N1).
- Tricky and Hard givens bands overlap (27-29); accepted.
- A screen reader may not announce ", clashes" until the cell is refocused (#51 N4); the message line carries the text.
- `hintMarks` hatched cells: the page `data-d` mutant on a hidden-single target survives (removal 3 in #65 rests on reasoning: `data-d` is set only from confined/removed); accepted.
- Page test f4 adds `hint-removed`/`data-d` to a live cell and leaves them (harmless: later tests reopen the page); it does not pin the loop length (no AC requires it; #61 review nits).
- #77 surviving mutants (accepted): the `steps` class on every explain kind (the page test checks only the nudge as non-pointing), `max-width`/margins of `#status.steps` not pinned.
- Struck-badge strike centring and gradient direction are not guarded (no AC; #61 review C4/C5).
- Equivalent mutants accepted: `choose` skipping `clearResults` (the picker is only reachable after `newPuzzle`), the left-edge badge rule at 375 px (#56 L2).
- #68 untested by the suite (tester/PM checked on the page): arrow-key and hatched->hatched link switching, the 4 px inner ring and link-line style, clearing paths other than a value change, notes keeping the link (the notes path never calls `clearResults`).
- #72/#78 untested by the suite (tester/PM checked with real CDP input): the ruled badge's slot position and edge digits (1/4/7, 3/6/9) at 375 px (#78 pins D = 2 and 8), touch taps, Tab/arrow selection of an entered ring, clearing paths other than a value change, pin R4. The suite uses `element.click()`/`focus()`, not real mouse sequences.
- The link line is a plain `<p>`, not announced to screen readers (out of scope in #68 and #72).

## Open concerns for Dirk
- Only headless Chrome is tested: iOS Safari may not blur the focused cell on a tap of a (non-focusable) given; then a ring selection could persist while a hatched cell keeps focus (reviewer #72, unverified, no code).
- GitHub Pages is not checked or enabled, so there are no real users and all evidence is simulated.
- Agent safety: addressed by Dirk's run-task changes (9c5542b per-session TMPDIR; ac56a00 removes it on exit, which also clears Chrome's leftover items). The lead still passes the explicit-temp-dir / `${VAR:?}` rule in prompts (macOS mktemp ignores TMPDIR).
