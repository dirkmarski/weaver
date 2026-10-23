# Backlog

The PM owns this list. This page is the curator's snapshot of it at the end of iteration 21 (from `work-log/iteration-21-product.md`, "Backlog (PM, after #104 acceptance; it21 closed)"). Start the next scoping here; do not open earlier product logs (scores are inline: the last persona evidence per candidate is kept in brackets; "raised 3/3" = flagged unprompted by that many personas; letters a/b/c = personas). During an iteration the PM's live list at the bottom of its latest product log supersedes this page; the curator refreshes it at close. Pruning rule (governance/memory-architecture.md): delivered items are dropped, related ones merged.

Delivered in it21 (dropped): claiming taught as a Hint fallback (#102; understand 4.33, marks 4.78), Tough level (#103; learn 4.0, picker 4.0), own claiming counted (#104; reward 3.5, gate waived D16 -> #108). D7 (3-line step-2 Next step off-screen at 360x740) closed by the 1rem step-text rule (D10).

## Product candidates (PM, ordered)
1. #108 (open, it22 item 1): own pointing and claiming rewards state the final step, as hinted step 3 does (persona gate 3.5 < 4.0 at #104, D16; #108 carries the same 4.0 gate and must close it). Fold in D4: pointing hidden step 3 "its U" -> name the unit, as claiming does.
2. Claiming follow-ups (it21 personas):
   - One-line level descriptions on the picker, e.g. "Tough: Tricky puzzles, hints teach claiming" (a, b, c at #103; Tough not felt harder than Tricky).
   - A plain "what claiming is" line on the hint; "pointing in reverse" reads as jargon (a, b at #102 and #104).
   - Struck badge inside the naked target reads as contradictory/cramped (3/3 on Tough at #103; b, c at #102; applies to pointing too; idea: show the two candidates in the target).
   - Target highlight easy to miss (a, c at #102); highlight the named line/box on own rewards (b, #104); step numbers on the marks (a, #102).
   - Block compression of struck lists ("rows 8 and 9, columns 2 and 3", b at scoping); key with three legends is long (a, c); watch: hidden step 3 does not say why the unit's other cells are out (c, b).
3. Explanation follow-ups (from it20, unchanged; top first):
   - "Next step (3 of 3)" while step 2 shows reads as finishing (raised 3/3 at #96).
   - Blank reserve before an explanation (no hint, nudge): 3/3 mild; needs a design spike (lesson: empty reserve reads as broken).
   - Struck badge legibility on phones, worst on the amber target (3/3 at #96); struck grey vs purple on tinted cells.
   - Non-breaking box names: "7-"/"9" breaks at 360 px (2/3, c #96); touches every box-name message, own small issue.
   - Key line dense/small at 4 lines (a, c, #97); a cue that the key returns after a selection (3/3 mild, #97).
   - Step-2 wording: "(struck)" reads as jargon (3/3 mild, #96); "rows 4 and 6" may read as whole rows; step 1 "fits only in row 1" vs two purple cells (a, #96).
   - Hatched/selected cell hard to see at 1280 (c, #97); "Techniques applied" heading peeking under the steps (a, b, it20).
   - Next step prominence (b, #90); a "done" cue after the last step (c, #90); Back/previous step (b); focused target's caret reads as "11"/pause (b, #91).
   - Wording: "Tap" vs "Click" on touch; jargon ("ring", "hatched", "ruled out", "solid purple"); shorter naked step 3 ("sees"; b rank 1, it18); conclusion line set apart (c); invitation wording; ring tap cue; "same D as before"; box-case wording; key line names the ruled badge (#78); a stronger first-click signal; minimal rings; keyboard reach for given rings.
   - Pin `#next` alignment/gap in a test when there is ratio room (#90 M13/M14).
   - Watch: staging Q (#91); "hatched" -> "striped"; grouped "(same row)" (F-72e); highlight the shared unit (F-72f); many purple marks to learn.
4. Mobile remainder: picker wraps 3+2 at 360/375 and looks lopsided (3/3, #103); tally lines below the fold at 360/375, incl. Claiming (#104 tester F4, a, b); gap between board and buttons (b, #104); watch: stage-3 invitation 1.5 px spare at 360x740 (#103), Tricky stage-2 not re-measured since D10; 1280x900 stage-2 Next step below the fold (desktop scrolls); the stage-3 scroll takes the title and New puzzle off screen (mild, 3/3 #97); 390x664 shows 3/9 explanation lines; purple hint line 3 lines and repeats the key; caption leaves "1-9" alone on line 2; chip legibility on a phone (3/3/3 at #84); play buttons ~35 px tall (44 px guideline); New puzzle confirmation; F2 notes contrast in hatched cells; soft keyboard on a hatched-cell tap (not testable headless); classic scrollbar at 500-559 px (accepted, #83); 320 px out of scope.
5. Pointing/claiming reach (watch, no action): early first pointing via generation; a cap on the Tricky/Tough preference; "prefer pointing" on Hard. Grading solver (`solvableBy`) is pointing-only: Hard does not exclude puzzles solvable with claiming (no it21 issue covered it).
6. Slip follow-ups (it11, small, wording-led): extra-clash sentence; a partial-fix message; two-unit clash naming; "clear your own number"; explain counted/uncounted; a marker on entries made during a clash; Hint/Verify naming one pair at a time.
7. Small wording items: F3 the two-partner "and" (watch); shared "not counted" ending; re-entering a hint-credited cell says "on your own"; "(see below)" in the finish text; fold away definitions once learned; heavy naked-single digit list; solid rings shown before the key mentions them (watch).
8. Long-term: a practice puzzle per technique; a middle hint level; progress across puzzles; pairs (next technique), each with its own level or Hint preference.

Watch: test-to-product ratio 1.5997x at main 96a311c (2374/1484; cap 1.6 x product = 2374.4, 0.4 lines of headroom). Every product line now costs 1.6 test lines or a mutant-confirmed removal: it21 paid with 2 (#102), 8 (#103) and 16 (#104) removed assertions. Removals stay listed, reviewer- and tester-confirmed by mutant, never AC-required, no line packing (no new line longer than the file's longest). A UI item with page tests needs its removals planned first, or a trim item.

Not wanted: instant red on a wrong entry (it10); counting entries made during a clash (it11); retroactive counting after a fix (it11).

## Open tech debt and carry-forwards
- `creditEntry`'s hint match is unguarded for a row or column alone (#104 reviewer F2 / tester F2, pre-existing; D17): add a test when next touching `creditEntry`.
- #102 deferred (D8): hidden-unit row-before-column order not pinned (unreachable via Hint, reviewer F1); naked-form column marks have no column branch test (F2). #103 D14: g1 seed-1 struck cells nit (tester t3 covers it).
- Chore (PM D11, it20): rename ids to their roles: `#link` is now the reserve (key or link sentence), `#key` the invitation; tests and README, about 13 lines.
- `tests/chrome.js` nits (#55 L4): declare `watchdog` above `close`; `gone` is always false in the exit handler; the ppid watchdog is optional (the EPIPE listeners are the essential part).
- `findPointing` without options may return a step where a single already exists (documented; `hintFor` checks singles first, and on Tricky uses `{useful: true}`).
- `singleAfterStep` keeps a redundant filled-cell guard on purpose (it9 N1).
- Tricky and Hard givens bands overlap (27-29); accepted.
- A screen reader may not announce ", clashes" until the cell is refocused (#51 N4); the message line carries the text.
- `hintMarks` hatched cells: the page `data-d` mutant on a hidden-single target survives (removal 3 in #65 rests on reasoning: `data-d` is set only from confined/removed); accepted.
- Page test f4 adds `hint-removed`/`data-d` to a live cell and leaves them (harmless: later tests reopen the page); it does not pin the loop length (no AC requires it; #61 review nits).
- #77 surviving mutants (accepted): the `steps` class on every explain kind (the page test checks only the nudge as non-pointing), `max-width`/margins of `#status.steps` not pinned.
- #85: the `#status` margin-top, caption and `#level` rules below 560 px survive as mutants; the stage-3 `#status` fit at 360x740 rests on the #97 scroll (f1h); f1a guards the stage-2 Next step button, g1 the 1rem step-text rule (#103).
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
