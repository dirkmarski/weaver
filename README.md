# Weaver

A dependency-free static page where you complete an easy sudoku (the widely published Wikipedia example, 30 givens) in a 9x9 grid with the 3x3 boxes shaded in two alternating light colours (blue and cream, checkerboard style).

## View
Open `index.html` in a browser, or serve the folder:

    python3 -m http.server   # then visit http://localhost:8000

## How to play
- Bold dark numbers are givens and cannot be changed.
- Click an empty cell and type a digit 1-9. Other input (letters, 0, pasted or dropped multi-character text) is rejected and the cell keeps its previous value. Backspace or Delete clears the cell.
- Click **Verify** to check the grid. Checking is by the sudoku rules only (no stored answer is compared), so any valid solution is accepted.
  - Complete grid: tells you whether it is solved.
  - Incomplete grid: tells you whether the numbers so far break any rule, and how many cells are empty.
  - Numbers you entered that repeat a digit in their row, column or 3x3 box are shown in red (both digits if two of yours clash). Givens are never flagged.
- Any edit clears the red flags and the message. There is no live checking and no hints.

## Test
Requires Node 18+ (no packages needed):

    node --test            # (on newer Node versions, observed on Node 24, "node --test tests/" is treated as a path and fails)

## Files
- `index.html`, `style.css` - page and styling
- `sudoku.js` - `PUZZLE`, `SOLUTION` (reference fixture only), `isValidSolution`, `findConflicts`, `verify`, `sanitizeDigit`, `nextValue` (pure, exported for Node), plus the browser UI
- `tests/sudoku.test.js` - unit tests
