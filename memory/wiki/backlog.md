# Backlog

The PM owns this list. This page is the lead's snapshot of it at the end of iteration 19 (from `work-log/iteration-19-product.md`, "Backlog (PM, ordered, after #91 acceptance)"). Start the next scoping here; do not re-read product logs for scores: the last persona evidence per candidate is kept in brackets ("raised 3/3" = flagged unprompted by that many personas; "ranks a/b/c"; "it19" = round). During an iteration the PM's live list at the bottom of its latest product log supersedes this page; the lead refreshes it at close. Pruning rule (governance/memory-architecture.md): delivered items are dropped, related ones merged.

Delivered in it19 (dropped): step-by-step pointing explanation with a Next step button (#90); board marks and key line staged per step, staging P (#91). Personas: learning 4/4/4, button ease 4/4/4, marks match the step 4/4/4.

## Product candidates (PM, ordered)
1. Explanation follow-ups (no PM order inside yet; top four first):
   - Key line fully visible on phones: cut off at 375x812 seed 1 stage 3 (raised 3/3 at #90 and again 3/3 at #91).
   - Naked-form step 2 names only the target while every removed cell is struck: name all struck cells or say "e.g." (raised 3/3, #91).
   - Blank gap under the board: the 4-line link reserve is empty until step 3 and gets called "broken" (a, b; it18 3/3; more visible since staging). PM: next in line.
   - Struck badges hard to read on phones (a, c, #91); struck grey vs purple on tinted cells.
   - Next step prominence, e.g. filled colour (b, #90); a "done" cue after the last step (c, #90); Back/previous step (b); focused target's text caret reads as "11"/pause (b, #91; pre-existing).
   - Wording: "Tap" vs "Click" on touch; jargon ("ring", "hatched", "ruled out", "solid purple"); shorter naked step 3 ("has every digit except" -> "sees"; b rank 1, it18); conclusion line set apart (bold, c); invitation wording; ring tap cue (it18 ranks 2/2/3; discover 3/4/3 in it17); non-breaking "row N" and "7-9"; "same D as before"; box-case wording; key line names the ruled badge (#78); a stronger first-click signal for pointing; minimal rings; keyboard reach for given rings.
   - Pin `#next` alignment/gap in a test when there is ratio room (#90 M13/M14).
   - Watch: staging Q (rings/hatching at step 1; 1/3 mild yes, lowered at #91); hidden-form step 3 saying why other unit cells are out; "hatched" -> "striped"; grouped "(same row)" (F-72e); highlight the shared unit (F-72f); many purple marks to learn.
2. Mobile remainder: seed 1 step 3 below the fold at 360x740 (D9: #85 persona average 3.67 there, seed 8 4.33); 390x664 shows 3/9 explanation lines; 1280x900 seed 8 stage-2 Next step button 9 px below the fold; purple hint line 3 lines and repeats the key; caption leaves "1-9" alone on line 2; chip legibility on a phone (3/3/3 at #84); play buttons ~35 px tall, under the 44 px tap guideline; New puzzle confirmation; "Hard" wraps alone on the picker at 375 px; F2 notes contrast in hatched cells; soft keyboard on a hatched-cell tap (not testable headless); square cells with a classic scrollbar at 500-559 px (accepted limit, #83); 320 px out of scope.
3. Pointing reach (watch, no action): early first pointing via generation; a cap on the Tricky preference; "prefer pointing" on Hard.
4. Slip follow-ups (it11, small, wording-led): extra-clash sentence; a partial-fix message; two-unit clash naming; "clear your own number"; explain counted/uncounted; a marker on entries made during a clash; Hint/Verify naming one pair at a time.
5. Small wording items: F3 the two-partner "and" (watch); shared "not counted" ending; re-entering a hint-credited cell says "on your own"; "(see below)" in the finish text; fold away definitions once learned; heavy naked-single digit list; solid rings shown before the key mentions them (watch).
6. Long-term: a practice puzzle per technique; a middle hint level; progress across puzzles; claiming, then pairs, each with its own level.

Watch: test-to-product ratio 1.595x at main a552c1d (2187/1371; cap floor(1.6 x product) = 2193, 6 lines of headroom). Each new product line earns 1.6 test lines; removals stay listed, reviewer- and tester-confirmed, never AC-required, no line packing (no new line longer than the file's longest). A UI item with page tests will likely need a trim first.

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
- #85: the `#status` margin-top, caption and `#level` rules below 560 px survive as mutants; the 360x740 seed 8 `#status` fit (3.5 px slack) is pinned in f1a since #90.
- #90 M13/M14 survive by design: `#next` left alignment (0.00 px) and gap (9.6 px) are measured by tester/PM only (cap reached). #91: the hidden form is page-tested at stage 3 only (f1b, as AC9 asks); an entered ring's focus before stage 3 is guarded indirectly (reviewer m13). 1280 seed 1 stage 1: left edges shift 0.0156 px with the narrower key line (D1, not a defect).
- Struck-badge strike centring and gradient direction are not guarded (no AC; #61 review C4/C5).
- Equivalent mutants accepted: `choose` skipping `clearResults` (the picker is only reachable after `newPuzzle`), the left-edge badge rule at 375 px (#56 L2).
- #68 untested by the suite (tester/PM checked on the page): arrow-key and hatched->hatched link switching, the 4 px inner ring and link-line style, clearing paths other than a value change, notes keeping the link (the notes path never calls `clearResults`).
- #72/#78 untested by the suite (tester/PM checked with real CDP input): the ruled badge's slot position and edge digits (1/4/7, 3/6/9) at 375 px (#78 pins D = 2 and 8), touch taps, Tab/arrow selection of an entered ring, clearing paths other than a value change, pin R4. The suite uses `element.click()`/`focus()`, not real mouse sequences.
- The link line is a plain `<p>`, not announced to screen readers (out of scope in #68 and #72).

## Open concerns for Dirk
- Only headless Chrome is tested: iOS Safari may not blur the focused cell on a tap of a (non-focusable) given; then a ring selection could persist while a hatched cell keeps focus (reviewer #72, unverified, no code).
- GitHub Pages is not checked or enabled, so there are no real users and all evidence is simulated.
- Agent safety: addressed by Dirk's run-task changes (9c5542b per-session TMPDIR; ac56a00 removes it on exit, which also clears Chrome's leftover items). The lead still passes the explicit-temp-dir / `${VAR:?}` rule in prompts (macOS mktemp ignores TMPDIR).
