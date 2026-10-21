# Backlog

The PM owns this list. This page is the lead's snapshot of it at the end of iteration 16 (from `work-log/iteration-16-product.md`, "Candidate list (PM, ordered, end of iteration 16)"). Start the next scoping here. During an iteration the PM's live list at the bottom of its latest product log supersedes this page; the lead refreshes the snapshot at close. Pruning rule (governance/memory-architecture.md): delivered items are dropped, related ones merged.

## Product candidates (PM, ordered)
1. Link discoverability and phone reach (it16 personas): F-72a a clickable cue on rings and hatched cells, invitation nearer the grid (discover 2/3/3); F-72b the link line visible after a tap on a phone (below the fold at 375 px); F-72c the ruled border distinct from a ring.
2. Explanation depth, continued: split long pointing explanations into short steps or conclusion first (3/4/3 after #71); minimal rings (rings exceed a minimal cover in 36% of hidden-single explanations, it14); a stronger first-click signal for pointing; "same D as before"; the box-case wording "(the box has no other empty cells)"; a step-by-step "show me why" replay (asked for by all three personas, it16); keyboard reach for given rings; watch: grouped "(same row)" wording (F-72e), highlight the shared unit (F-72f).
3. Mobile: F2 notes contrast/size in hatched cells plus F-72d notes cramped by the ruled border (min 3.1 px ink distance at 375 px); pointing badges too small on a phone; the soft keyboard on a hatched-cell tap (not testable headless); struck grey vs purple on tinted cells; grid cells about 36 x 58 px at 375 px; "New puzzle" wraps at 375 px; hint badge at 320 px; a reminder that other hatched cells can be tapped once the invitation is gone.
4. Pointing reach (watch, no action): early first pointing via generation; a cap on the Tricky preference; "prefer pointing" on Hard.
5. Slip follow-ups (it11, small, wording-led): extra-clash sentence; a partial-fix message; two-unit clash naming; "clear your own number"; explain counted/uncounted; a marker on entries made during a clash; Hint/Verify naming one pair at a time.
6. Small wording items: F3 the two-partner "and" (watch); shared "not counted" ending; re-entering a hint-credited cell says "on your own"; "(see below)" in the finish text; fold away definitions once learned; heavy naked-single digit list; solid rings shown before the key mentions them (watch).
7. Long-term: a practice puzzle per technique; a middle hint level; progress across puzzles; claiming, then pairs, each with its own level.

Watch: test-to-product ratio 1.586x at main b481959 (2081/1312; cap floor(1.6 x product) = 2099, 18 lines of headroom). Each new product line earns 1.6 test lines; removals stay listed, reviewer- and tester-confirmed, never AC-required, no line packing. A UI item of more than ~10 product lines with page tests may need a trim first.

Not wanted: instant red on a wrong entry (it10); counting entries made during a clash (it11); retroactive counting after a fix (it11).

## Open tech debt and carry-forwards
- `tests/chrome.js` nits (#55 L4): declare `watchdog` above `close`; `gone` is always false in the exit handler; the ppid watchdog is optional (the EPIPE listeners are the essential part).
- `findPointing` without options may return a step where a single already exists (documented; `hintFor` checks singles first, and on Tricky uses `{useful: true}`).
- `singleAfterStep` keeps a redundant filled-cell guard on purpose (it9 N1).
- Tricky and Hard givens bands overlap (27-29); accepted.
- A screen reader may not announce ", clashes" until the cell is refocused (#51 N4); the message line carries the text.
- `hintMarks` hatched cells: the page `data-d` mutant on a hidden-single target survives (removal 3 in #65 rests on reasoning: `data-d` is set only from confined/removed); accepted.
- Page test f4 adds `hint-removed`/`data-d` to a live cell and leaves them (harmless: later tests reopen the page); it does not pin the loop length (no AC requires it; #61 review nits).
- Struck-badge strike centring and gradient direction are not guarded (no AC; #61 review C4/C5).
- Equivalent mutants accepted: `choose` skipping `clearResults` (the picker is only reachable after `newPuzzle`), the left-edge badge rule at 375 px (#56 L2).
- #68 untested by the suite (tester/PM checked on the page): arrow-key and hatched->hatched link switching, the 4 px inner ring and link-line style, clearing paths other than a value change, notes keeping the link (the notes path never calls `clearResults`).
- #72 untested by the suite (tester/PM checked with real CDP input): the `hint-ruled` style, touch taps, Tab/arrow selection of an entered ring, clearing paths other than a value change, pin R4. The suite uses `element.click()`/`focus()`, not real mouse sequences.
- The link line is a plain `<p>`, not announced to screen readers (out of scope in #68 and #72).

## Open concerns for Dirk
- Only headless Chrome is tested: iOS Safari may not blur the focused cell on a tap of a (non-focusable) given; then a ring selection could persist while a hatched cell keeps focus (reviewer #72, unverified, no code).
- GitHub Pages is not checked or enabled, so there are no real users and all evidence is simulated.
- Agent safety: addressed by Dirk's run-task changes (9c5542b per-session TMPDIR; ac56a00 removes it on exit, which also clears Chrome's leftover items). The lead still passes the explicit-temp-dir / `${VAR:?}` rule in prompts (macOS mktemp ignores TMPDIR).
