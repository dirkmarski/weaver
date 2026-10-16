# Weaver

A dependency-free static page that generates a fresh sudoku on demand. When the page loads you choose a difficulty (Easy, Medium or Hard); only then is a puzzle generated and shown in a 9x9 grid with the 3x3 boxes shaded in two alternating light colours (blue and cream, checkerboard style). Puzzles are generated at run time (never taken from a stored bank) and always have exactly one solution.

## View
Open `index.html` in a browser, or serve the folder:

    python3 -m http.server   # then visit http://localhost:8000

## How to play
- On load, pick **Easy**, **Medium** or **Hard**. The chosen level is shown above the grid. **New puzzle** clears the grid and returns to the difficulty prompt.
- Bold dark numbers are givens and cannot be changed.
- Click an empty cell and type a digit 1-9. Other input (letters, 0, pasted or dropped multi-character text) is rejected and the cell keeps its previous value. Backspace or Delete clears the cell.
- Click **Verify** to check the grid. Checking is by the sudoku rules only (no stored answer is compared), so any valid solution is accepted.
  - Complete grid: tells you whether it is solved.
  - Incomplete grid: tells you whether the numbers so far break any rule, and how many cells are empty.
  - Numbers you entered that repeat a digit in their row, column or 3x3 box are shown in red (both digits if two of yours clash). Givens are never flagged.
- Any edit clears the red flags and the message. There is no live checking and no hints.

## Difficulty levels
Each puzzle is a random complete grid with cells removed in random order; a cell stays removed only if the solution remains unique.

| Level  | Givens | Solvable using |
|--------|--------|----------------|
| Easy   | 36-40  | naked singles only (a cell with just one candidate) |
| Medium | 30-35  | naked singles and hidden singles (a digit with only one place in a row, column or box) |
| Hard   | 22-29  | unique solution; may need guessing/advanced techniques |

Generation typically takes a few milliseconds. An internal time cap (1000 ms) guarantees click-to-render stays well under 2 seconds; if it were ever hit, the best valid unique puzzle found so far is returned (it could then have more givens than the band).

## Test
Requires Node 18+ (no packages needed):

    node --test            # (on newer Node versions, observed on Node 24, "node --test tests/" is treated as a path and fails)

## Files
- `index.html`, `style.css` - page and styling
- `sudoku.js` - pure logic, exported for Node (and as `window.Sudoku`), plus the browser UI:
  - `generatePuzzle(level, {rng, maxMs})` -> `{level, puzzle, solution, givens}` (9x9 arrays, 0 = empty); `generateSolution(rng)`; `seededRng(seed)` for reproducible output; `countSolutions(grid, limit)`; `solvableBy(grid, 'naked'|'singles')`; `LEVELS`
  - `isValidSolution`, `findConflicts`, `verify`, `sanitizeDigit`, `nextValue`
- `tests/sudoku.test.js` - validation/verify/input unit tests
- `tests/generator.test.js` - generator tests (validity, uniqueness, givens bands, technique, determinism, timing; prints max/avg ms per level)
- `tests/fixture.js` - a known-valid grid and puzzle used only as a test fixture
