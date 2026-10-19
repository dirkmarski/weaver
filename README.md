# Weaver

A dependency-free static page that generates a fresh sudoku on demand. When the page loads you choose a difficulty (Easy, Medium or Hard); only then is a puzzle generated and shown in a 9x9 grid with the 3x3 boxes shaded in two alternating light colours (blue and cream, checkerboard style). Puzzles are generated at run time (never taken from a stored bank) and always have exactly one solution.

## View
Open `index.html` in a browser, or serve the folder:

    python3 -m http.server   # then visit http://localhost:8000

## How to play
- On load, pick **Easy**, **Medium** or **Hard**. The chosen level is shown above the grid. **New puzzle** clears the grid and returns to the difficulty prompt.
- Bold dark numbers are givens and cannot be changed.
- Click an empty cell and type a digit 1-9. Other input (letters other than N, 0, pasted or dropped multi-character text) is rejected and the cell keeps its previous value. With Notes off, Backspace or Delete clears the cell's value; on a cell that holds only notes it does nothing and the notes stay.
- Keyboard: with a cell focused:
  - Arrow keys move to the nearest cell that is not a given in that direction, in the same row or column. Cells holding your own value are valid targets. Givens are skipped and there is no wrapping (at the edge, or with only givens beyond, the focus stays put). Holding an arrow key auto-repeats.
  - Arrow keys never change a value, a note, the Verify results or Notes mode.
  - Press **N** (or `n`) to toggle Notes without leaving the cell; nothing is typed. Holding N toggles once (key auto-repeat is ignored).
  - Ctrl/Cmd/Alt combinations keep their browser behaviour.
- Click **Notes** to switch pencil-mark notes on (`Notes: On`) or off (`Notes: Off`). It starts Off for every puzzle.
  - Notes on, digit 1-9 in an empty cell: adds a small grey note in a fixed spot of a 3x3 mini-grid (1 top-left ... 9 bottom-right); typing it again removes it.
  - Notes on, Backspace or Delete: on an empty cell removes all its notes; on a cell holding your value, clears the value.
  - Notes on, a digit in a cell that already holds your value does nothing.
  - Notes off, a digit in a cell with notes: enters the value and removes its notes.
  - Verify ignores notes (a notes-only cell counts as empty), and changing a note keeps the Verify flags and message.
  - **New puzzle** discards all notes.
- Click **Verify** to check the grid. Checking is by the sudoku rules only (no stored answer is compared), so any valid solution is accepted.
  - Complete grid: tells you whether it is solved.
  - Incomplete grid: tells you whether the numbers so far break any rule. If they do not, it also says how many cells are empty; if they do, it only points out the mistakes.
  - Numbers you entered that repeat a digit in their row, column or 3x3 box are shown in red (both digits if two of yours clash). Givens are never flagged.
- Click **Hint** to learn two techniques, the **naked single** and the **hidden single**. Hint never fills in a cell; you always enter the digit yourself. Hint looks at the givens and the values you entered (notes are ignored) and follows the sudoku rules only.
  - A **naked single** is an empty cell where the numbers already in its row, column and box leave only one digit that fits.
  - A **hidden single** is a digit that has only one possible place in a box, a row or a column, even if that cell also fits other digits. That cell is the only empty cell of the box, row or column where the digit does not already appear in the cell's row, column or box, and the digit is not yet in that box, row or column.
  - Order: if a naked single exists, Hint teaches it, even when a hidden single exists earlier in the grid. Only when there is no naked single does it look for a hidden single.
  - First click, naked single: the cell is highlighted in amber, its row, column and box are lightly tinted, focus moves to the cell, and the message tells you to check its row, column and box. If several cells qualify, the first one in reading order (top row first, left to right) is used.
  - First click, hidden single: the cell is highlighted in amber and focus moves to it. Only the one box, row or column where the digit has just one place is lightly tinted (not all three), and the message names it ("in its box", "in its row" or "in its column") and tells you to check where each missing digit can go there. The first cell in reading order that is a hidden single is used. For that cell the box is checked first, then the row, then the column, and within one of them the digits are checked from 1 to 9.
  - Second click (while that hint is showing): the same highlight and tint stay and the message explains. For a naked single it names the digit that fits and the 8 digits it excludes. For a hidden single it names the digit and says that every other empty cell of that box, row or column already has that digit in its row or column (box), column or box (row), or row or box (column); in addition, every cell in the grid that holds that digit (givens and your own values) gets a bold purple ring and a purple digit, so you can see the digits that rule out the other cells. The digit is still not entered. Further clicks show the same explanation.
  - Enter the hinted digit in that cell (Notes off) and the highlight (and tint and purple rings) goes away and "Well done! You applied a naked single: ..." or "Well done! You applied a hidden single: ..." is shown. Any other value change removes the hint (and may show a "Well spotted!" message, see below).
  - If some numbers break the rules, Hint says so and asks you to click Verify; if every cell is filled, it says so; if there is neither a naked nor a hidden single, it says "No naked or hidden single right now. At this point the puzzle needs another technique." In these cases nothing is highlighted.
  - Applying a technique on your own: with Notes off, enter a digit 1-9 (typed, or pasted or dropped as a single digit) into an editable cell that holds no value (it may hold notes). Only such an entry is judged. Overwriting a value, clearing a value and anything typed with Notes on are never judged.
    - If that digit is the only digit that fits the cell (it is the only digit that does not appear in the cell's row, column or box), the message is "Well spotted! You found a naked single on your own: row R, column C is D." (R, C and D are the cell's row and column and the digit).
    - Otherwise, if the digit is not yet in the cell's box, row or column and the cell is the only empty cell of it whose row, column and box do not contain the digit, the message is "Well spotted! You found a hidden single in its box on your own: row R, column C is D." (with "row" or "column" instead of "box" when that is the unit). The box is checked first, then the row, then the column, and the first one that qualifies is named.
    - A cell that is both a naked and a hidden single is reported as a naked single.
    - If neither applies, or if some numbers elsewhere in the grid break the rules, nothing is rewarded and the message stays blank. Nothing is said about why.
    - If a hint (first or second click) is showing for that cell and you enter the hint's digit, it counts as done **with a hint** and the "Well done!" message above is shown instead. If you enter a different digit in the hinted cell, or any digit in another cell, the entry is judged as on your own.
  - Below the message, while a puzzle is shown, the heading "Techniques applied in this puzzle" is followed by the two lines "Naked single: N on your own, M with a hint" and "Hidden single: N on your own, M with a hint". All four counts start at 0 when you choose a level. Each rewarded entry adds 1 to the matching count. Each cell is counted at most once per puzzle: if you clear a counted cell and enter a single there again, the message is shown again but no count changes. Counts never go down (clearing or changing a value, Verify, Hint and notes leave them alone). The block is hidden on the difficulty prompt after **New puzzle**, and nothing is stored between page loads.
  - The hint (highlight, tint, purple rings and message) is removed by any change to a value, by **Verify**, by **New puzzle** and by choosing a level. Changing notes keeps it. Clicking Hint also clears any red flags and message before showing its own.
- Any change to a value clears the red flags and the message (entering the hinted digit shows "Well done!", and a single you find on your own shows "Well spotted!", instead of a blank message). There is no live checking.

## Difficulty levels
Each puzzle is a random complete grid with cells removed in random order; a cell stays removed only if the solution remains unique (and, for Easy/Medium, still solvable by the level's technique). After removal the puzzle is graded: Medium and Hard puzzles that are still solvable by the lower level's technique are discarded and a new puzzle is generated, so each level needs something the one below does not.

| Level  | Givens | Solvable using |
|--------|--------|----------------|
| Easy   | 36-40  | naked singles only (a cell with just one candidate) |
| Medium | 30-35  | naked singles and hidden singles (a digit with only one place in a row, column or box); NOT solvable by naked singles alone |
| Hard   | 22-29  | exactly one solution; NOT solvable by naked + hidden singles (needs advanced techniques or guessing) |

Generation typically takes a few milliseconds. An internal time cap (1000 ms) guarantees click-to-render stays well under 2 seconds; if it were ever hit, the best valid unique puzzle found so far (fewest givens) is returned and the result has `capped: true` (it could then have more givens than the band or be easier than the level). `generatePuzzle` results also report `attempts`.

## Test
Requires Node 18+ (no packages needed):

    node --test            # (on newer Node versions, observed on Node 24, "node --test tests/" is treated as a path and fails)

## Files
- `index.html`, `style.css` - page and styling
- `sudoku.js` - pure logic, exported for Node (and as `window.Sudoku`), plus the browser UI:
  - `generatePuzzle(level, {rng, maxMs})` -> `{level, puzzle, solution, givens}` (9x9 arrays, 0 = empty); `generateSolution(rng)`; `seededRng(seed)` for reproducible output; `countSolutions(grid, limit)`; `solvableBy(grid, 'naked'|'singles')`; `LEVELS`
  - `isValidSolution`, `findConflicts`, `verify`, `sanitizeDigit`, `buildGrid(puzzle, values)` (grid passed to verify; notes excluded)
  - keyboard: `nextCell(puzzle, r, c, 'up'|'down'|'left'|'right')` -> `[r, c]` of the next editable cell (givens skipped, no wrap) or `null`
  - hints: `findNakedSingle(grid)` -> `{r, c, digit, seen}` (0-based r/c, `seen` = the 8 digits excluded, ascending) or `null`; `findHiddenSingle(grid)` -> `{r, c, digit, unit}` (0-based r/c, `unit` is `'box'`, `'row'` or `'column'`) or `null`; `hintFor(grid, step)` -> `{kind, technique, unit, r, c, digit, text}` (kind `conflict`, `full`, `none`, `nudge` or `explain`; step 2 gives `explain`; `technique` (`'naked'` or `'hidden'`) is set for `nudge` and `explain` only; `unit` only for hidden); `hintApplied(hint, value)` -> the "Well done!" text for the hint's technique or `''`
  - rewards: `classifyEntry(grid, r, c, digit)` (grid just before the entry, 0-based r/c) -> `{technique: 'naked'}`, `{technique: 'hidden', unit}` or `null`; `emptyTally()` -> `{naked: {own, hint}, hidden: {own, hint}}`; `creditEntry(tally, credited, hint, grid, r, c, value)` -> `{tally, credited, text}` (`credited` maps cell index 9 * r + c to `true`; `hint` is the showing `hintFor` result or `null`; inputs are not changed; `text` is `''` when there is no reward); `tallyLines(tally)` -> the heading and the two tally lines
  - notes: `applyEntry(cell, key, notesMode)` (pure transition of `{value, notes}`, notes a bitmask with bit d = digit d), `noteDigits(mask)`
- `tests/sudoku.test.js` - validation/verify/input/notes/next-cell/hint unit tests
- `tests/generator.test.js` - generator tests (validity, uniqueness, givens bands, technique, determinism, timing; prints max/avg ms per level)
- `tests/fixture.js` - a known-valid grid and puzzle used only as a test fixture
