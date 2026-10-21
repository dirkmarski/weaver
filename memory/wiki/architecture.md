# Architecture

Static site, no dependencies, no build. Plain ES5-style JS in an IIFE.

## Files (end of iteration 14)
| File | Lines | Role |
|---|---|---|
| `index.html` | 41 | page skeleton: picker (4 `data-level` buttons), `#game` (table, Verify, Hint, Notes, New puzzle), `#status` (role=status), `#key` (key line, plain `<p>`, not a live region), `#tally` |
| `style.css` | 131 | styling, box shading, hint/conflict classes, `td.hint-hatched` (stripe layer listed before the amber tint layer, #65), `td.clash` dashed orange outline, pointing badges (`::after` with `attr(data-d)`) placed in D's note slot via `--x`/`--y` per `data-d`; below 560 px the chip's side padding is 1 px and edge badges sit flush inside the cell |
| `sudoku.js` | 1054 | pure logic exported for Node and as `window.Sudoku`, plus the browser `render()` UI |
| `tests/sudoku.test.js` | 1268 | unit tests on hand-built grids |
| `tests/generator.test.js` | 155 | generator tests |
| `tests/page.test.js` | 411 | page tests: the real `index.html` in one headless Chrome (#55, it12) |
| `tests/chrome.js` | 100 | test helper only: finds Chrome, launches it, CDP over the global WebSocket, cleanup |
| `tests/fixture.js` | 27 | a valid grid and puzzle, fixture only |

Product code 1226 lines; tests 1961 (ratio 1.5995x, guide ~1x; 0 lines of headroom: tests may be at most floor(1.6 x product)). The jump from 1.15x is the page harness (#55, no product lines). Ratio rule (PM, it13): at most 1.6x; the issue that would pass it trims redundant assertions in the files it touches (each listed with the test that still covers it, tester-confirmed) or a separate trim item comes first.

## Exports of `sudoku.js` (the `api` object)
- Generation: `generatePuzzle(level, {rng, maxMs})` -> `{level, puzzle, solution, givens, attempts, capped?}`; `generateSolution(rng)`; `seededRng(seed)` (mulberry32); `countSolutions(grid, limit)`; `solvableBy(grid, 'naked'|'singles'|'pointing')`; `LEVELS`.
- Validation: `isValidSolution`, `findConflicts` (all clashing cells, givens included), `verify`, `sanitizeDigit`, `buildGrid(puzzle, values)`.
- Clashes: `namedClash(grid)` -> `null` or `{phrase, extra}`; `clashCells(grid)`; `fixedMessage(before, after)`.
- Navigation: `nextCell(puzzle, r, c, dir)`. Notes: `applyEntry(cell, key, notesMode)`, `noteDigits(mask)`.
- Hints: `findNakedSingle`, `findHiddenSingle(grid, {notNaked})`, `findPointing(grid, {useful})` (does not check singles first; built on internal `pointingSteps` and `singleAfterStep`; `useful: true` skips targets that internal `isSingle(cells, p)` says are already a naked or hidden single), `preferredTechnique(tally, level)`, `hintFor(grid, step, prefer, level)` (`level === 'tricky'` puts the useful pointing step before singles, #60), `hintApplied`, `hintKey(hint, hatchedCount)` (key line for a pointing or hidden-single explain; pointing adds the hatched clause only if hatchedCount > 0; replaced `pointingKey` in #65), internal `aDigit(d)` ("an 8" / "a D", shared by the hidden-single text and the key line), `hintMarks(hint, grid)` -> `{area, target, digits, hatched, confined, removed}`; `hatched` = the reason cells below, ascending, explain only (#65).
  - `digits` (explain only): cells holding D that share a unit with a reason cell. Reason cells: hidden single = the other empty cells of its unit; pointing = empty box cells not confined, plus (hidden form, `hint.unit` set) empty cells of the hidden unit other than the target and the removed cells. None for a naked single. All qualifying rings kept (PM D4).
  - Internal `pointingHint(s, step, grid)` adds " (the box has no other empty cells)" on step 2 when every empty box cell is confined.
- Rewards: `classifyEntry` (naked > hidden > pointing), `emptyTally`, `creditEntry(...)` -> `{tally, credited, text, kind}`, `statusClass(kind)`, `tallyLines`, `TECHNIQUE_DEFINITIONS`.
- Completion: `completionFor(grid, tally)` -> solved / conflict / `null`.
- Cell indices in marks and `credited` are flat `9*r + c`; r/c in results are 0-based.

## How index.html wires it
- `sudoku.js` loads at the end of `body`; `render()` finds elements by id and builds the table of `<input>` cells.
- Picker buttons call `choose(level)`; `newPuzzle` resets state. Per-cell `keydown`/`input` handlers call `nextCell`, `applyEntry`, `sanitizeDigit`.
- Value change (`setCell`, the single write path): `before` grid -> `creditEntry`; then `clearResults`, `showClashes(after)`, `fixedMessage`, the credit text, then `completionFor` (wins when the grid is full); `showTally`.
- `clearResults` (Verify, Hint, value changes, `choose`, `newPuzzle`) clears the status, the key line, red flags and all hint classes (including `hint-hatched`)/`data-d`; never `td.clash`. Notes changes do not call it, so a hint and its key line survive them.
- Hint button: `clearResults`, then `hintFor(grid, step, preferredTechnique(tally, currentLevel), currentLevel)`, `hintMarks` adds `hint-target`, `hint-area`, `hint-digit`, and on a pointing explain `hint-confined`/`hint-removed` plus `data-d`, adds `hint-hatched` to `marks.hatched`, and on every explain except a naked single sets `#key` to `hintKey(res, marks.hatched.length)`.
- `relabel(inp)` is the only aria-label builder (position, notes, ", clashes").

## Tests
- Run `node --test` from the repo root (on Node 24 `node --test tests/` fails). 167 tests (151 unit, 16 page), about 3 s with Chrome, 0.6 s without.
- Page tests (#55): one headless Chrome per file; `Math.random` seeded by injecting `seededRng`'s source (regex-extracted from `sudoku.js`, guarded by a seeding assertion); keydown on cell inputs and real button clicks; DOM-only reads; no test hooks in product code. Chrome via `CHROME_PATH` or default macOS/Linux paths; `WEAVER_NO_CHROME=1` or a missing Chrome gives a visible skip with a reason (page evidence must show skipped = 0). Cleanup on normal end, failure, Ctrl-C/SIGTERM and the orphaned test child (EPIPE listeners, ppid watchdog); not after `kill -9`.
- Narrow-width page checks use `Emulation.setDeviceMetricsOverride` (headless Chrome's window has a ~500 px minimum), wait for layout to settle (check the cell width), and clear the override in `finally`.
- Seeds are chosen on purpose: a seeded test guards a rule only if one of its seeds fails under the mutant.
- Page tests that pin wording use literal text (f1b pins P1 pointing and P3 hidden single of #65, with the two-layer background guard and a value-change clear; f2 covers naked = no key); f compares the page with the helper and so tests wiring only. f4 guards the struck badge: strike contrast >= 4.5:1 and the thinnest strike over digits 1-9 >= 2 px at 375 px.
