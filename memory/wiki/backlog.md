# Backlog

The PM owns this list. This page is the lead's snapshot of it at the end of iteration 20 (from `work-log/iteration-20-product.md`, "Backlog (PM, ordered, after it20 scoping)" plus "Backlog additions (explanation follow-ups, after it20)"). Start the next scoping here; do not re-read product logs for scores: the last persona evidence per candidate is kept in brackets ("raised 3/3" = flagged unprompted by that many personas; "it20" = round). During an iteration the PM's live list at the bottom of its latest product log supersedes this page; the curator refreshes it at close. Pruning rule (governance/memory-architecture.md): delivered items are dropped, related ones merged.

Delivered in it20 (dropped): step 2 names every struck cell (#96; personas "text matches the struck cells" 5/5/5); key line in the reserve under the board, invitation below the steps and scrolled into view, stage-3 fold fixed (#97; find the key 4/4/4, looks finished 4/4/3.5). Both 3/3 pains raised twice are closed (PM D5).

## Product candidates (PM, ordered)
1. Next technique: claiming (box-line reduction), planned it21 (PM D5). Data spike first: frequency on Tricky/Hard, and whether a level or a Hint preference lets players practise it (as pointing did, it8 #37, it13 #60); then teach before rewarding (it8/it9).
2. Explanation follow-ups (below claiming now; top first):
   - "Next step (3 of 3)" while step 2 shows reads as finishing (raised 3/3 at #96).
   - Blank reserve before an explanation (no hint, nudge): 3/3 mild at it20 scoping and #97; no content yet, needs a design spike (lesson: empty reserve reads as broken).
   - Struck badge legibility on phones, worst on the amber target (3/3 at #96; a, c #91); struck grey vs purple on tinted cells.
   - Non-breaking box names: "7-"/"9" breaks at 360 px (2/3 scoping, c #96); touches every box-name message, own small issue.
   - Scrolled invitation flush with the viewport bottom reads as tight or clipped: add a small bottom margin (b, c, #97; the Key score met 4.0 with no margin).
   - Key line dense/small at 4 lines (a, c, #97); a cue that the key returns after a selection (3/3 mild, #97).
   - Step-2 wording: "(struck)" reads as jargon (3/3 mild, #96); "rows 4 and 6" may read as whole rows (3/3, understood from context; "r4c3"-style rejected for readability). Step 1 "fits only in row 1" vs two purple cells (a, #96).
   - Hatched/selected cell hard to see at 1280 (c, #97); "Techniques applied" heading peeking under the steps (a, b, it20).
   - Next step prominence, e.g. filled colour (b, #90); a "done" cue after the last step (c, #90); Back/previous step (b); focused target's text caret reads as "11"/pause (b, #91).
   - Wording: "Tap" vs "Click" on touch; jargon ("ring", "hatched", "ruled out", "solid purple"); shorter naked step 3 ("has every digit except" -> "sees"; b rank 1, it18); conclusion line set apart (bold, c); invitation wording; ring tap cue (it18 ranks 2/2/3); "same D as before"; box-case wording; key line names the ruled badge (#78); a stronger first-click signal for pointing; minimal rings; keyboard reach for given rings.
   - Pin `#next` alignment/gap in a test when there is ratio room (#90 M13/M14).
   - Watch: staging Q (lowered at #91); hidden-form step 3 saying why other unit cells are out; "hatched" -> "striped"; grouped "(same row)" (F-72e); highlight the shared unit (F-72f); many purple marks to learn.
3. Mobile remainder: 1280x900 stage-2 Next step button 9/30 px below the fold (seeds 8/1, desktop scrolls); stage-2 Next step at 360x740 has 1.1 px spare on all pointing seeds checked (watch); the stage-3 scroll takes the title and New puzzle off screen (mild, 3/3 #97); 390x664 shows 3/9 explanation lines; purple hint line 3 lines and repeats the key; caption leaves "1-9" alone on line 2; chip legibility on a phone (3/3/3 at #84); play buttons ~35 px tall, under the 44 px tap guideline; New puzzle confirmation; "Hard" wraps alone on the picker at 375 px; F2 notes contrast in hatched cells; soft keyboard on a hatched-cell tap (not testable headless); square cells with a classic scrollbar at 500-559 px (accepted, #83); 320 px out of scope.
4. Pointing reach (watch, no action): early first pointing via generation; a cap on the Tricky preference; "prefer pointing" on Hard.
5. Slip follow-ups (it11, small, wording-led): extra-clash sentence; a partial-fix message; two-unit clash naming; "clear your own number"; explain counted/uncounted; a marker on entries made during a clash; Hint/Verify naming one pair at a time.
6. Small wording items: F3 the two-partner "and" (watch); shared "not counted" ending; re-entering a hint-credited cell says "on your own"; "(see below)" in the finish text; fold away definitions once learned; heavy naked-single digit list; solid rings shown before the key mentions them (watch).
7. Long-term: a practice puzzle per technique; a middle hint level; progress across puzzles; pairs (after claiming), each with its own level.

Watch: test-to-product ratio 1.595x at main 834f3e6 (2232/1399; cap 1.6 x product = 2238.4, 6 lines of headroom). Each new product line earns 1.6 test lines; removals stay listed, reviewer- and tester-confirmed, never AC-required, no line packing (no new line longer than the file's longest). A UI item with page tests will likely need a trim first.

Not wanted: instant red on a wrong entry (it10); counting entries made during a clash (it11); retroactive counting after a fix (it11).

## Open tech debt and carry-forwards
- Chore (PM D11, it20): rename ids to their roles: `#link` is now the reserve (key or link sentence), `#key` the invitation; tests and README, about 13 lines.
- Spec seeds: unit-walk pins (`hintFor` without level, e.g. #96 seeds 33/7/12) reach a different step than a real Tricky page; both share the code path (#96 tester finding 3).
- `tests/chrome.js` nits (#55 L4): declare `watchdog` above `close`; `gone` is always false in the exit handler; the ppid watchdog is optional (the EPIPE listeners are the essential part).
- `findPointing` without options may return a step where a single already exists (documented; `hintFor` checks singles first, and on Tricky uses `{useful: true}`).
- `singleAfterStep` keeps a redundant filled-cell guard on purpose (it9 N1).
- Tricky and Hard givens bands overlap (27-29); accepted.
- A screen reader may not announce ", clashes" until the cell is refocused (#51 N4); the message line carries the text.
- `hintMarks` hatched cells: the page `data-d` mutant on a hidden-single target survives (removal 3 in #65 rests on reasoning: `data-d` is set only from confined/removed); accepted.
- Page test f4 adds `hint-removed`/`data-d` to a live cell and leaves them (harmless: later tests reopen the page); it does not pin the loop length (no AC requires it; #61 review nits).
- #77 surviving mutants (accepted): the `steps` class on every explain kind (the page test checks only the nudge as non-pointing), `max-width`/margins of `#status.steps` not pinned.
- #85: the `#status` margin-top, caption and `#level` rules below 560 px survive as mutants; the stage-3 `#status` fit at 360x740 now rests on the #97 scroll (f1h); f1a guards only the stage-2 Next step button (1.1 px spare).
- #90 M13/M14 survive by design: `#next` left alignment (0.00 px) and gap (9.6 px) are measured by tester/PM only (cap reached). #91: the hidden form is page-tested at stage 3 only (f1b, as AC9 asks); an entered ring's focus before stage 3 is guarded indirectly (reviewer m13). 1280 seed 1 stage 1: left edges shift 0.0156 px with the narrower key line (D1, not a defect).
- Struck-badge strike centring and gradient direction are not guarded (no AC; #61 review C4/C5).
- Equivalent mutants accepted: `choose` skipping `clearResults` (the picker is only reachable after `newPuzzle`), the left-edge badge rule at 375 px (#56 L2).
- #68 untested by the suite (tester/PM checked on the page): arrow-key and hatched->hatched link switching, the 4 px inner ring and link-line style, clearing paths other than a value change, notes keeping the link (the notes path never calls `clearResults`).
- #72/#78 untested by the suite (tester/PM checked with real CDP input): the ruled badge's slot position and edge digits (1/4/7, 3/6/9) at 375 px (#78 pins D = 2 and 8), touch taps, Tab/arrow selection of an entered ring, clearing paths other than a value change, pin R4. The suite uses `element.click()`/`focus()`, not real mouse sequences.
- The link line is a plain `<p>`, not announced to screen readers (out of scope in #68 and #72).

## Open concerns for Dirk
- The #97 scroll is checked in headless Chrome only; iOS Safari URL-bar resizing is not modelled (PM A1).
- Only headless Chrome is tested: iOS Safari may not blur the focused cell on a tap of a (non-focusable) given; then a ring selection could persist while a hatched cell keeps focus (reviewer #72, unverified, no code).
- GitHub Pages is not checked or enabled, so there are no real users and all evidence is simulated.
- Agent safety: addressed by Dirk's run-task changes (9c5542b per-session TMPDIR; ac56a00 removes it on exit, which also clears Chrome's leftover items). The lead still passes the explicit-temp-dir / `${VAR:?}` rule in prompts (macOS mktemp ignores TMPDIR).
