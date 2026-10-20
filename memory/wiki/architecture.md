# Architecture

Static site, no dependencies, no build. Plain ES5-style JS in an IIFE.

## Files (end of iteration 11)
| File | Lines | Role |
|---|---|---|
| `index.html` | 40 | page skeleton: picker (4 `data-level` buttons), `#game` (table, Verify, Hint, Notes, New puzzle), `#status`, `#tally` |
| `style.css` | 116 | styling, box shading, hint/conflict classes, pointing corner badges (`::after` with `attr(data-d)`), `td.clash` dashed orange outline (offset -7px under `:focus-within`) |
| `sudoku.js` | 993 (~47 KB) | pure logic exported for Node and as `window.Sudoku`, plus the browser `render()` UI |
| `tests/sudoku.test.js` | 1144 | unit tests on hand-built grids |
| `tests/generator.test.js` | 151 | generator tests |
| `tests/fixture.js` | 27 | a valid grid and puzzle, fixture only |

Product code is about 1149 lines; tests about 1322 (ratio ~1.15, above the ~1x guide but falling: it11 added +68 product and +51 test lines, mostly by extending existing tests).

## Exports of `sudoku.js` (the `api` object)
- Generation: `generatePuzzle(level, {rng, maxMs})` -> `{level, puzzle, solution, givens, attempts, capped?}`; `generateSolution(rng)`; `seededRng(seed)`; `countSolutions(grid, limit)`; `solvableBy(grid, 'naked'|'singles'|'pointing')`; `LEVELS` (givens band, `technique`, `beyond`).
- Validation: `isValidSolution`, `findConflicts` (all clashing cells, givens included), `verify`, `sanitizeDigit`, `buildGrid(puzzle, values)`.
- Clashes (it11): `namedClash(grid)` -> `null` or `{phrase, extra}` (#50; built on internal `firstHolder(cells, p, digit)` -> `{unit, q}`, first of row/column/box holding the digit in another cell, first holder in reading order; `cellName(p)`); `clashCells(grid)` -> flat indices of the `findConflicts` cells; `fixedMessage(before, after)` -> the "No numbers break the rules now..." text when the change went from a clash to none, else `''` (#51).
- Navigation: `nextCell(puzzle, r, c, dir)` next editable cell or `null`.
- Notes: `applyEntry(cell, key, notesMode)` pure cell transition; `noteDigits(mask)`.
- Hints: `findNakedSingle`, `findHiddenSingle(grid, {notNaked})`, `findPointing` (does not check singles first; built on the internal `pointingSteps` enumerator, whose steps carry `confined` and `removed` cells, and `singleAfterStep` check, which `classifyEntry` reuses for own pointing; result includes `confined`, `removed`), `preferredTechnique(tally, level)`, `hintFor(grid, step, prefer)` -> `{kind, technique, r, c, digit, text, ...}`, `hintApplied`, `hintMarks(hint, grid)` -> `{area, target, digits, confined, removed}` (confined/removed only on a pointing explain; area includes the hidden-form unit). Internal `boxName(b)` gives "the box of rows R1-R2 and columns C1-C2".
- Rewards: `classifyEntry` (naked > hidden > pointing), `emptyTally` (naked, hidden, pointing), `creditEntry(tally, credited, hint, grid, r, c, value)` -> `{tally, credited, text, kind}` (not-counted text via internal `notCounted`: own clash naming unit and holder > broken grid naming the clash (`namedClash`) > not a technique; #50), `statusClass(kind)`, `tallyLines` (heading + 3 lines), `TECHNIQUE_DEFINITIONS` (naked, hidden, pointing).
- Completion: `completionFor(grid, tally)` -> solved / conflict / `null`.
- Cell indices in marks and `credited` are flat `9*r + c`; r/c in results are 0-based.

## How index.html wires it
- `sudoku.js` is loaded at the end of `body`; `render()` finds elements by id and builds the table of `<input>` cells.
- Picker buttons call `choose(level)` -> `generatePuzzle`; `newPuzzle` resets state. Per-cell `keydown`/`input` handlers call `nextCell`, `applyEntry`, `sanitizeDigit`.
- Value change (`setCell`, the single write path): grid `before` captured before the write and passed to `creditEntry`; after the write `clearResults`, `showClashes(after)` (toggles `td.clash`, relabels), `fixedMessage(before, after)`, then the credit text, then `completionFor` (wins when the grid is full); `showTally` redraws counts and definitions.
- The clash outline is live state: `clearResults` (used by Verify, Hint, value changes) never touches `td.clash`; `choose`/`newPuzzle` rebuild the table. `relabel(inp)` is the only aria-label builder (position, notes, ", clashes").
- The Hint status line is always plain (`className = ''`), also for `kind: 'conflict'` (#50).
- Hint button: `hintFor(grid, step, preferredTechnique(...))`, then `hintMarks` adds CSS classes `hint-target`, `hint-area`, `hint-digit`, and on a pointing explain `hint-confined` / `hint-removed` plus `data-d` (the digit for the badge). `clearResults` removes them all (selector includes `[data-d]`). Verify adds `conflict`.
- Tally block (`#tally`) shows naked, hidden and pointing lines with definitions. The status class is `statusClass(credit.kind)`.
- UI wiring (DOM) has no repo tests; it is checked by headless scripts held in session scratchpads (open tech debt).

## Tests
- Run: `node --test` from the repo root (Node 18+). On Node 24, `node --test tests/` fails (path treated as a module); use no argument.
- 147 tests, about 0.6 s total (end of it11; #50 added only assertions, #51 four tests for `clashCells`/`fixedMessage`).
- `sudoku.test.js` covers validation/verify, input, notes, next-cell, hints (naked, hidden, preference, pointing), rewards, completion, definitions, `solvableBy`. Mostly hand-built grids plus a few fixed seeds.
- `generator.test.js` covers, with at most 10 seeded puzzles per level: validity, uniqueness, givens bands, technique, determinism, timing.
- Seeds are chosen on purpose: a generator test guards a rule only if one of its seeds fails under the mutant (it8, #37).
