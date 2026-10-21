# Product: what weaver is today

A dependency-free static page (open `index.html`, no build) that generates a fresh sudoku at run time, with exactly one solution, and teaches solving techniques. Strategy (`governance/context/product-strategy.md`): educate the user, teach techniques progressively, reward learning and applying skills; solving is secondary.
Authoritative behaviour spec: `README.md`.

## Features
- Level picker on load (Easy, Medium, Tricky, Hard); puzzle generated only after choosing. "New puzzle" returns to the picker.
- 9x9 grid, 3x3 boxes shaded in two alternating light colours. Givens bold and locked.
- Digits 1-9 typed (or pasted/dropped as one digit); other input rejected. Backspace/Delete clears (Notes off).
- Pencil-mark Notes (button or `N` key, starts Off each puzzle); notes ignored by Verify and Hint.
- Keyboard: arrow keys jump to the nearest non-given cell in that direction, no wrapping.
- Verify: rules-only check (no stored answer), shows the player's repeated digits in red (givens never red), counts empty cells.
- Clash outline (#51, it11): every clashing cell, givens included, gets a dashed orange outline (`td.clash`) while the clash lasts. It is recomputed on every value change only; Verify, Hint, notes and arrow keys never touch it, and New puzzle or a level choice clears it. Editable outlined cells end their aria-label with ", clashes". This is the only live mark: red stays Verify-only.
- Clash fixed (#51): a value change (clear or overwrite) that goes from at least one clash to none shows "No numbers break the rules now. New entries are counted again." (plain); completion wins if the grid fills.
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
- Tricky puzzles mostly need one pointing step to solve, but Hint prefers useful pointing there (#60): a player who follows Hint gets 2/4/6 pointing lessons per puzzle (p10/p50/p90, seeds 1-300), the first at about entry 5. Personas rated that load "about right" (it13).

## Techniques taught
- Naked single: an empty cell where row, column and box leave one digit.
- Hidden single: a digit with one possible cell in a box, row or column.
- Pointing: a digit confined to one row/column within a box cannot go elsewhere in that line; this can create a single. On Easy, Medium and Hard taught only when no single exists; on Tricky a useful pointing step comes first (#60).

## Hint
- Never fills a cell. Two clicks: first a nudge (target cell amber and focused, area tinted), then an explanation (digit named, marks added).
- Pointing nudge says what the step does (#45): naked form "That means D cannot go in row R, column C, and only one other digit fits there now."; hidden form "Then look at U: D now has only one place left there." The hidden-form unit is tinted on both clicks.
- Rings (second click, #56): a cell holding the key digit D gets a purple ring only if it rules out a "reason cell" (shares a row, column or box with it). Hidden single: the other empty cells of its unit. Pointing: the empty box cells that are not confined, plus in the hidden form the empty cells of U other than the target and removed cells. All qualifying rings are kept (PM D4); there may be none. Naked single: no rings.
- Pointing explanation also marks confined box cells (dashed purple outline, purple D badge) and removed line cells (grey struck D badge, also on the target). The badge sits in D's own pencil-note slot (1 top-left ... 9 bottom-right); below 560 px its side padding is 1 px and edge badges sit flush inside the cell (touching a neighbour note by about 1 px at most at 375 px). 320 px is out of scope. The struck badge's diagonal band (#61) is #6b6b6b (5.3:1 on white), 43-57% of the chip's corner-to-corner gradient: at least 2.27 px at 375 px and 2.91 px at 1280 px; the chip width follows the glyph, so D = 1 is the thinnest.
- Hatching (#65, it14): on the second click of a hidden single or pointing step, the reason cells (the empty cells the rings rule D out of) get purple diagonal stripes (135deg, #6a1fb5 at 0.3, 1.5 px every 8 px) on top of the amber tint; notes and values paint above. Hatching shows exactly when rings show (PM spike, 1855 explanations). None on the first click or for a naked single.
- Key line (#56, reworded #65): under the status, plain and smaller, during a pointing or hidden-single explanation. Pointing: "Key: dashed purple = the only places for D in the box; struck grey D = this step rules D out there; hatched = a purple ring rules D out there (A already in the same row, column or box)." (the hatched clause is dropped when nothing is hatched). Hidden single: "Key: hatched = a purple ring rules D out there (A already in the same row, column or box)." (always shows: a hidden single always has a hatched cell). A is "a D" / "an 8". No form, unit or count variants. None for a naked single, a nudge or other texts.
- Box case (#56): when every empty box cell is confined, the explanation inserts " (the box has no other empty cells)" after "fits only in row/column L".
- Priority: conflicts first (#50: names the clash, plain style: "Row R1, column C1 and row R2, column C2 both hold E in the same U. Change or clear one of them first, then click Hint again." plus " Other numbers break the rules too: click Verify to see which." when more than two cells clash), full grid message, then (Tricky only, #60) a useful pointing step, i.e. one whose target is not already a naked or hidden single, then singles, then pointing, else "No naked single, hidden single or pointing step right now..."
- Single preference: teaches the technique with the lower own-plus-hint count; on a tie naked on Easy, hidden on Medium/Tricky/Hard. A preferred hidden single is one that is not also a naked single.
- Pointing target: boxes in reading order, digits 1-9, first step that creates a single; naked and hidden forms are mutually exclusive. The Tricky useful step skips targets that are already singles and passes over a step with no other target (`findPointing(grid, {useful: true})`).
- Entering the hinted digit shows "Well done! You applied ...". Any change to a value, Verify, New puzzle or a level choice removes the hint, its hatching and its key line; notes changes keep them.

## Rewards and counts
- Entering a digit (Notes off) into an empty cell is judged: naked single, else hidden single (box, row, column checked in that order), else pointing on your own (ONE pointing step makes the entered digit a single in that cell, naked or hidden form; chained steps are not recognised), else a neutral "not counted" message. Order of the "not counted" texts (#50, it11): (1) the digit is already in the cell's row, column or box: "D is already in this cell's U, at row R2, column C2, so it breaks the rules. It is not counted." (first unit of row/column/box, first holder in reading order); else (2) the grid before the entry already breaks the rules: "D is not in this cell's row, column or box, but <named clash>, so it is not counted. Change or clear one of them first. Entries after that count again; this one stays uncounted." (+ the extra sentence when more than two cells clash); else (3) "It was not a naked single, a hidden single or a pointing step...". Entries during a clash are never counted later.
- Named clash (`namedClash`, #50): P = first clashing cell in reading order (givens included), E its digit; partner Q = first other holder of E in P's row, else column, else box; phrased "row R1, column C1 and row R2, column C2 both hold E in the same U".
- "Well spotted!" for own finds (own pointing names the step: "...in the box of rows R1-R2 and columns C1-C2, the digit D fits only in row L, so row R, column C is V."), "Well done!" for hinted ones. Hinted pointing is counted too.
- Block under the status shows three lines, Naked single, Hidden single and Pointing ("N on your own, M with a hint"), each with a grey definition, on every level, always visible.
- Status colour comes from `creditEntry`'s `kind` (reward = green, "not counted" = neutral).
- Each cell counts once per puzzle; counts never go down; reset on choosing a level.

## Known product gaps
- Re-entering a cleared hint-credited cell says "on your own" while the count stays "with a hint" (consistent with the README; wording candidate, it9).
- Red flags appear only after Verify, by design (#31); the orange outline (#51) is the live clash mark. The app never says whether a digit matches the solution.
- Slip wording (it11 acceptance of #50, personas): the extra sentence is misread when the third clashing cell is a given; a named pair may include a given that "change or clear" cannot apply to; the entry text and Hint can name different pairs for one slip; "stays uncounted" is read as "never counts". On the PM candidate list.
- Explanation depth: hatching (#65) lets players name the ring for each hatched cell (personas 41/42 at acceptance), but there is no direct ring-to-cell link (asked for by personas; weak on long-distance and two-ring cells); notes in hatched cells read 3/5 (100% accurate; alpha 0.25 is a candidate); the first pointing click feels thin; "(the box has no other empty cells)" reads like a single; the naked-form "only D or X" step is not shown. On the PM candidate list.
- Mobile: at 375 px the four level buttons wrap (Hard alone on row 2), long messages plus the key line take much vertical space, grid cells are about 36 x 58 px (taller than wide, it13 PM), and struck grey vs purple is hard to tell apart on tinted cells; accepted for now.
- Not live: no progress across puzzles; no technique beyond pointing (claiming, pairs not taught).
- Evidence is simulated users only; GitHub Pages was never confirmed enabled (open question), so no real users.
