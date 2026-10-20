# Architecture

Static site, no dependencies, no build. Plain ES5-style JS in an IIFE.

## Files (end of iteration 12)
| File | Lines | Role |
|---|---|---|
| `index.html` | 41 | page skeleton: picker (4 `data-level` buttons), `#game` (table, Verify, Hint, Notes, New puzzle), `#status` (role=status), `#key` (key line, plain `<p>`, not a live region), `#tally` |
| `style.css` | 129 | styling, box shading, hint/conflict classes, `td.clash` dashed orange outline, pointing badges (`::after` with `attr(data-d)`) placed in D's note slot via `--x`/`--y` per `data-d`; below 560 px the chip's side padding is 1 px and edge badges sit flush inside the cell |
| `sudoku.js` | 1023 | pure logic exported for Node and as `window.Sudoku`, plus the browser `render()` UI |
| `tests/sudoku.test.js` | 1226 | unit tests on hand-built grids |
| `tests/generator.test.js` | 151 | generator tests |
| `tests/page.test.js` | 367 | page tests: the real `index.html` in one headless Chrome (#55, it12) |
| `tests/chrome.js` | 100 | test helper only: finds Chrome, launches it, CDP over the global WebSocket, cleanup |
| `tests/fixture.js` | 27 | a valid grid and puzzle, fixture only |

Product code 1193 lines; tests 1871 (ratio ~1.57x, guide ~1x). The jump from 1.15x is the page harness (#55, no product lines). PM trigger: a trim item if it passes 1.6x.

## Exports of `sudoku.js` (the `api` object)
- Generation: `generatePuzzle(level, {rng, maxMs})` -> `{level, puzzle, solution, givens, attempts, capped?}`; `generateSolution(rng)`; `seededRng(seed)` (mulberry32); `countSolutions(grid, limit)`; `solvableBy(grid, 'naked'|'singles'|'pointing')`; `LEVELS`.
- Validation: `isValidSolution`, `findConflicts` (all clashing cells, givens included), `verify`, `sanitizeDigit`, `buildGrid(puzzle, values)`.
- Clashes: `namedClash(grid)` -> `null` or `{phrase, extra}`; `clashCells(grid)`; `fixedMessage(before, after)`.
- Navigation: `nextCell(puzzle, r, c, dir)`. Notes: `applyEntry(cell, key, notesMode)`, `noteDigits(mask)`.
- Hints: `findNakedSingle`, `findHiddenSingle(grid, {notNaked})`, `findPointing` (does not check singles first; built on internal `pointingSteps` and `singleAfterStep`), `preferredTechnique(tally, level)`, `hintFor(grid, step, prefer)`, `hintApplied`, `pointingKey(digit, ringCount)` (key line text; ring clause only if ringCount > 0), `hintMarks(hint, grid)` -> `{area, target, digits, confined, removed}`.
  - `digits` (explain only): cells holding D that share a unit with a reason cell. Reason cells: hidden single = the other empty cells of its unit; pointing = empty box cells not confined, plus (hidden form, `hint.unit` set) empty cells of the hidden unit other than the target and the removed cells. None for a naked single. All qualifying rings kept (PM D4).
  - Internal `pointingHint(s, step, grid)` adds " (the box has no other empty cells)" on step 2 when every empty box cell is confined.
- Rewards: `classifyEntry` (naked > hidden > pointing), `emptyTally`, `creditEntry(...)` -> `{tally, credited, text, kind}`, `statusClass(kind)`, `tallyLines`, `TECHNIQUE_DEFINITIONS`.
- Completion: `completionFor(grid, tally)` -> solved / conflict / `null`.
- Cell indices in marks and `credited` are flat `9*r + c`; r/c in results are 0-based.

## How index.html wires it
- `sudoku.js` loads at the end of `body`; `render()` finds elements by id and builds the table of `<input>` cells.
- Picker buttons call `choose(level)`; `newPuzzle` resets state. Per-cell `keydown`/`input` handlers call `nextCell`, `applyEntry`, `sanitizeDigit`.
- Value change (`setCell`, the single write path): `before` grid -> `creditEntry`; then `clearResults`, `showClashes(after)`, `fixedMessage`, the credit text, then `completionFor` (wins when the grid is full); `showTally`.
- `clearResults` (Verify, Hint, value changes, `choose`, `newPuzzle`) clears the status, the key line, red flags and all hint classes/`data-d`; never `td.clash`. Notes changes do not call it, so a hint and its key line survive them.
- Hint button: `clearResults`, then `hintFor(...)`, `hintMarks` adds `hint-target`, `hint-area`, `hint-digit`, and on a pointing explain `hint-confined`/`hint-removed` plus `data-d`, and sets `#key` to `pointingKey(D, digits.length)`.
- `relabel(inp)` is the only aria-label builder (position, notes, ", clashes").

## Tests
- Run `node --test` from the repo root (on Node 24 `node --test tests/` fails). 166 tests (152 unit, 14 page), about 2.5 s with Chrome, 0.6 s without.
- Page tests (#55): one headless Chrome per file; `Math.random` seeded by injecting `seededRng`'s source (regex-extracted from `sudoku.js`, guarded by a seeding assertion); keydown on cell inputs and real button clicks; DOM-only reads; no test hooks in product code. Chrome via `CHROME_PATH` or default macOS/Linux paths; `WEAVER_NO_CHROME=1` or a missing Chrome gives a visible skip with a reason (page evidence must show skipped = 0). Cleanup on normal end, failure, Ctrl-C/SIGTERM and the orphaned test child (EPIPE listeners, ppid watchdog); not after `kill -9`.
- Narrow-width page checks use `Emulation.setDeviceMetricsOverride` (headless Chrome's window has a ~500 px minimum), wait for layout to settle (check the cell width), and clear the override in `finally`.
- Seeds are chosen on purpose: a seeded test guards a rule only if one of its seeds fails under the mutant.
