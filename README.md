# Weaver

A dependency-free static page that displays a completed, verified sudoku in a 9x9 grid with each 3x3 box shaded differently.

## View
Open `index.html` in a browser, or serve the folder:

    python3 -m http.server   # then visit http://localhost:8000

## Test
Requires Node 18+ (no packages needed):

    node --test            # (on newer Node versions, observed on Node 24, "node --test tests/" is treated as a path and fails)

## Files
- `index.html`, `style.css` - page and styling
- `sudoku.js` - hard-coded solution, `isValidSolution(grid)`, and rendering (browser only)
