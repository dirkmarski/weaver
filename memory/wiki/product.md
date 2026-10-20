# Product: what weaver is today

A dependency-free static page (open `index.html`, no build) that generates a fresh sudoku at run time, with exactly one solution, and teaches solving techniques. Strategy (`governance/context/product-strategy.md`): educate the user, teach techniques progressively, reward learning and applying skills; solving is secondary.
Authoritative behaviour spec: `README.md`.

## Features
- Level picker on load (Easy, Medium, Tricky, Hard); puzzle generated only after choosing. "New puzzle" returns to the picker.
- 9x9 grid, 3x3 boxes shaded in two alternating light colours. Givens bold and locked.
- Digits 1-9 typed (or pasted/dropped as one digit); other input rejected. Backspace/Delete clears (Notes off).
- Pencil-mark Notes (button or `N` key, starts Off each puzzle); notes ignored by Verify and Hint.
- Keyboard: arrow keys jump to the nearest non-given cell in that direction, no wrapping.
- Verify: rules-only check (no stored answer), shows repeated digits in red, counts empty cells.
- Auto message when the grid is full: green "Puzzle solved! Techniques applied: O on your own, H with a hint." (sums of all three techniques) or red pointer to Verify on a conflict.
- Nothing is stored between page loads.

## Levels
| Level | Givens | Needs |
|---|---|---|
| Easy | 36-40 | naked singles only |
| Medium | 30-35 | hidden singles as well; not solvable by naked singles alone |
| Tricky | 27-31 | pointing as well; following Hint solves it; not solvable by singles alone |
| Hard | 22-29 | unique solution; not solvable by singles plus pointing |

- Grading discards a puzzle that the lower level's technique already solves. Generation is a few ms (Tricky tens of ms, up to a few hundred); a 1000 ms cap returns the best unique puzzle found with `capped: true`.
- Tricky bands overlap Hard at 27-29 givens; givens are not shown to players (accepted, it8).
- In sampled Tricky seeds a puzzle needs one or two pointing steps (seeds 1-10: 8 need one, 2 need two).

## Techniques taught
- Naked single: an empty cell where row, column and box leave one digit.
- Hidden single: a digit with one possible cell in a box, row or column.
- Pointing: a digit confined to one row/column within a box cannot go elsewhere in that line; this can create a single. Taught only when no single exists.

## Hint
- Never fills a cell. Two clicks: first a nudge (target cell amber and focused, area tinted), then an explanation (digit named; for hidden single and pointing, purple rings on cells holding the key digit).
- Pointing nudge says what the step does (#45, it10): naked form "That means D cannot go in row R, column C, and only one other digit fits there now."; hidden form "Then look at U: D now has only one place left there." (U = row N, column N or the unit's box). The hidden-form unit is tinted on both clicks.
- Pointing explanation (second click only) also marks the confined box cells (dashed purple outline, purple D badge) and the removed line cells (grey struck-through D badge, also on the amber target). The marks clear with the rest of the hint. Known limit: the badge covers pencil note 3 of a marked cell while the hint shows (accepted, it10 D1).
- Priority: conflicts first ("click Verify"), full grid message, then singles, then pointing, else "No naked single, hidden single or pointing step right now..."
- Single preference: teaches the technique with the lower own-plus-hint count; on a tie naked on Easy, hidden on Medium/Tricky/Hard. A preferred hidden single is one that is not also a naked single.
- Pointing target: boxes in reading order, digits 1-9, first step that creates a single; naked and hidden forms are mutually exclusive.
- Entering the hinted digit shows "Well done! You applied ...". Any change to a value removes the hint; notes changes keep it.

## Rewards and counts
- Entering a digit (Notes off) into an empty cell is judged: naked single, else hidden single (box, row, column checked in that order), else pointing on your own (ONE pointing step makes the entered digit a single in that cell, naked or hidden form; chained steps are not recognised), else a neutral "not counted" message. Order of "not counted" texts: (b) grid already broken before the entry ("Some numbers break the rules... Click Verify"), else the clash text when D is already in the cell's row, column or box ("D is already in this cell's U, so it breaks the rules. It is not counted.", U = first of row, column, box; #46, it10), else (a) "It was not a naked single, a hidden single or a pointing step...". (#42, #46)
- "Well spotted!" for own finds (own pointing names the step: "...in the box of rows R1-R2 and columns C1-C2, the digit D fits only in row L, so row R, column C is V."), "Well done!" for hinted ones. Hinted pointing is counted too.
- Block under the status shows three lines, Naked single, Hidden single and Pointing ("N on your own, M with a hint"), each with a grey definition, on every level, always visible.
- Status colour comes from `creditEntry`'s `kind` (reward = green, "not counted" = neutral).
- Each cell counts once per puzzle; counts never go down; reset on choosing a level.

## Known product gaps
- Re-entering a cleared hint-credited cell says "on your own" while the count stays "with a hint" (consistent with the README; wording candidate, it9).
- Red flags appear only after Verify, by design (#31); a clashing entry is named in text (#46) but never turned red, and the app never says whether a digit matches the solution.
- After a slip, text (b) answers every later entry, including legal ones, with "Some numbers break the rules..."; personas read this as their new entry being wrong (it10, B and C). The clash text is easy to miss (message line only).
- Pointing visuals v2 open: rings still mark every cell with D (busy on the second click, B and C); no legend for the dashed and struck marks (C); trivial confinements can appear as the example.
- Mobile 375 px: the four level buttons wrap (Hard alone on row 2); accepted.
- Not live: no progress across puzzles; no technique beyond pointing (claiming, pairs not taught).
- Evidence is simulated users only; GitHub Pages was never confirmed enabled (open question), so no real users.
