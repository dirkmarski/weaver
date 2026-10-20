# Architecture

Static site, no dependencies, no build. Plain ES5-style JS in an IIFE.

## Files (end of iteration 9)
| File | Lines | Role |
|---|---|---|
| `index.html` | 40 | page skeleton: picker (4 `data-level` buttons), `#game` (table, Verify, Hint, Notes, New puzzle), `#status`, `#tally` |
| `style.css` | 94 | styling, box shading, hint/conflict classes |
| `sudoku.js` | 900 (~41 KB) | pure logic exported for Node and as `window.Sudoku`, plus the browser `render()` UI |
| `tests/sudoku.test.js` | 1075 | unit tests on hand-built grids |
| `tests/generator.test.js` | 151 | generator tests |
| `tests/fixture.js` | 27 | a valid grid and puzzle, fixture only |

Product code is about 1034 lines; tests about 1253 (ratio ~1.21, above the ~1x guide; judged justified at it8/it9). Watch this: each feature adds ~1x its code in tests.

## Exports of `sudoku.js` (the `api` object)
- Generation: `generatePuzzle(level, {rng, maxMs})` -> `{level, puzzle, solution, givens, attempts, capped?}`; `generateSolution(rng)`; `seededRng(seed)`; `countSolutions(grid, limit)`; `solvableBy(grid, 'naked'|'singles'|'pointing')`; `LEVELS` (givens band, `technique`, `beyond`).
- Validation: `isValidSolution`, `findConflicts`, `verify`, `sanitizeDigit`, `buildGrid(puzzle, values)`.
- Navigation: `nextCell(puzzle, r, c, dir)` next editable cell or `null`.
- Notes: `applyEntry(cell, key, notesMode)` pure cell transition; `noteDigits(mask)`.
- Hints: `findNakedSingle`, `findHiddenSingle(grid, {notNaked})`, `findPointing` (does not check singles first; built on the internal `pointingSteps` enumerator and `singleAfterStep` check, which `classifyEntry` reuses for own pointing), `preferredTechnique(tally, level)`, `hintFor(grid, step, prefer)` -> `{kind, technique, r, c, digit, text, ...}`, `hintApplied`, `hintMarks(hint, grid)` -> `{area, target, digits}`.
- Rewards: `classifyEntry` (naked > hidden > pointing), `emptyTally` (naked, hidden, pointing), `creditEntry(tally, credited, hint, grid, r, c, value)` -> `{tally, credited, text, kind}`, `statusClass(kind)`, `tallyLines` (heading + 3 lines), `TECHNIQUE_DEFINITIONS` (naked, hidden, pointing).
- Completion: `completionFor(grid, tally)` -> solved / conflict / `null`.
- Cell indices in marks and `credited` are flat `9*r + c`; r/c in results are 0-based.

## How index.html wires it
- `sudoku.js` is loaded at the end of `body`; `render()` finds elements by id and builds the table of `<input>` cells.
- Picker buttons call `choose(level)` -> `generatePuzzle`; `newPuzzle` resets state. Per-cell `keydown`/`input` handlers call `nextCell`, `applyEntry`, `sanitizeDigit`.
- Value change: `creditEntry` (reward/not-counted text and new tally), then `completionFor` (overrides the text when the grid is full), `showTally` redraws counts and definitions.
- Hint button: `hintFor(grid, step, preferredTechnique(...))`, then `hintMarks` adds CSS classes `hint-target`, `hint-area`, `hint-digit`. Verify adds `conflict`.
- Tally block (`#tally`) shows naked, hidden and pointing lines with definitions. The status class is `statusClass(credit.kind)`.
- UI wiring (DOM) has no repo tests; it is checked by headless scripts held in session scratchpads (open tech debt).

## Tests
- Run: `node --test` from the repo root (Node 18+). On Node 24, `node --test tests/` fails (path treated as a module); use no argument.
- 143 tests, about 0.6 s total (end of it9).
- `sudoku.test.js` covers validation/verify, input, notes, next-cell, hints (naked, hidden, preference, pointing), rewards, completion, definitions, `solvableBy`. Mostly hand-built grids plus a few fixed seeds.
- `generator.test.js` covers, with at most 10 seeded puzzles per level: validity, uniqueness, givens bands, technique, determinism, timing.
- Seeds are chosen on purpose: a generator test guards a rule only if one of its seeds fails under the mutant (it8, #37).
