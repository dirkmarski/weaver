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
- Click **Hint** to learn the first technique, the **naked single**: an empty cell where the numbers already in its row, column and box leave only one digit that fits. Hint never fills in a cell; you always enter the digit yourself. Hint looks at the givens and the values you entered (notes are ignored) and follows the sudoku rules only.
  - First click: the cell is highlighted in amber, its row, column and box are lightly tinted, focus moves to the cell, and the message tells you to check its row, column and box. If several cells qualify, the first one in reading order (top row first, left to right) is used.
  - Second click (while that hint is showing): the same highlight stays and the message names the digit that fits and the 8 digits it excludes. The digit is still not entered. Further clicks show the same explanation.
  - Enter the hinted digit in that cell (Notes off) and the highlight goes away and "Well done!" is shown. Any other value change just removes the hint.
  - If some numbers break the rules, Hint says so and asks you to click Verify; if every cell is filled, it says so; if no naked single exists, it says another technique is needed. In these cases nothing is highlighted.
  - The hint (highlight and message) is removed by any change to a value, by **Verify**, by **New puzzle** and by choosing a level. Changing notes keeps it. Clicking Hint also clears any red flags and message before showing its own.
- Any change to a value clears the red flags and the message. There is no live checking.

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
  - hints: `findNakedSingle(grid)` -> `{r, c, digit, seen}` (0-based r/c, `seen` = the 8 digits excluded, ascending) or `null`; `hintFor(grid, step)` -> `{kind, r, c, digit, text}` (kind `conflict`, `full`, `none`, `nudge` or `explain`; step 2 gives `explain`); `hintApplied(hint, value)` -> the "Well done!" text or `''`
  - notes: `applyEntry(cell, key, notesMode)` (pure transition of `{value, notes}`, notes a bitmask with bit d = digit d), `noteDigits(mask)`
- `tests/sudoku.test.js` - validation/verify/input/notes/next-cell/hint unit tests
- `tests/generator.test.js` - generator tests (validity, uniqueness, givens bands, technique, determinism, timing; prints max/avg ms per level)
- `tests/fixture.js` - a known-valid grid and puzzle used only as a test fixture
