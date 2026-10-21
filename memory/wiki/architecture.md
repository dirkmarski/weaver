# Architecture

Static site, no dependencies, no build. Plain ES5-style JS in an IIFE.

## Files (end of iteration 17)
| File | Lines | Role |
|---|---|---|
| `index.html` | 42 | page skeleton: picker (4 `data-level` buttons), `#game` (table, `#link` link line under the grid (plain `<p>`, #68, moved by #76), `#buttons`: Verify, Hint, Notes, New puzzle), `#status` (role=status), `#key` (key line, plain `<p>`, not a live region), `#tally` |
| `style.css` | 144 | styling, box shading, hint/conflict classes, `td.hint-hatched` (stripe layer at 0.25 listed before the amber tint layer, #65/#68), `td.hint-linked` (solid fill shorthand overrides tint and stripes; its own `input` colour rule, #68), `td.hint-ruled::after` (purple struck D badge sharing the pointing-badge rules, #78; was an inset border, #72), `#status.steps` (pre-line, left, 36rem; pointing explanation only, #77), `#link` (min-height 4lh so the buttons stay still, #76), `td.clash` dashed orange outline, pointing badges (`::after` with `attr(data-d)`) placed in D's note slot via `--x`/`--y` per `data-d`; below 560 px (#83): td width/height `calc((100vw - 32px) / 9 - 2px)` (square; td line-height 0 + input min-height remove the 37 px floor), body top-aligned, chip side padding 1 px, edge badges flush left/right and 1-3/7-9 flush top/bottom via `--tx`/`--ty` |
| `sudoku.js` | 1138 | pure logic exported for Node and as `window.Sudoku`, plus the browser `render()` UI |
| `tests/sudoku.test.js` | 1294 | unit tests on hand-built grids |
| `tests/generator.test.js` | 155 | generator tests |
| `tests/page.test.js` | 541 | page tests: the real `index.html` in one headless Chrome (#55, it12) |
| `tests/chrome.js` | 100 | test helper only: finds Chrome, launches it, CDP over the global WebSocket, cleanup |
| `tests/fixture.js` | 27 | a valid grid and puzzle, fixture only |

Product code 1324 lines; tests 2117 (ratio 1.599x, guide ~1x; tests may be at most floor(1.6 x product) = 2118, 1 line of headroom, after #83). The jump from 1.15x is the page harness (#55, no product lines). Ratio rule (PM, it13): at most 1.6x; the issue that would pass it trims redundant assertions in the files it touches (each listed with the test that still covers it, tester-confirmed) or a separate trim item comes first.

## Exports of `sudoku.js` (the `api` object)
- Generation: `generatePuzzle(level, {rng, maxMs})` -> `{level, puzzle, solution, givens, attempts, capped?}`; `generateSolution(rng)`; `seededRng(seed)` (mulberry32); `countSolutions(grid, limit)`; `solvableBy(grid, 'naked'|'singles'|'pointing')`; `LEVELS`.
- Validation: `isValidSolution`, `findConflicts` (all clashing cells, givens included), `verify`, `sanitizeDigit`, `buildGrid(puzzle, values)`.
- Clashes: `namedClash(grid)` -> `null` or `{phrase, extra}`; `clashCells(grid)`; `fixedMessage(before, after)`.
- Navigation: `nextCell(puzzle, r, c, dir)`. Notes: `applyEntry(cell, key, notesMode)`, `noteDigits(mask)`.
- Hints: `findNakedSingle`, `findHiddenSingle(grid, {notNaked})`, `findPointing(grid, {useful})` (does not check singles first; built on internal `pointingSteps` and `singleAfterStep`; `useful: true` skips targets that internal `isSingle(cells, p)` says are already a naked or hidden single), `preferredTechnique(tally, level)`, `hintFor(grid, step, prefer, level)` (`level === 'tricky'` puts the useful pointing step before singles, #60), `hintApplied`, `hintKey(hint, hatchedCount)` (key line for a pointing or hidden-single explain; pointing adds the hatched clause only if hatchedCount > 0; replaced `pointingKey` in #65), internal `aDigit(d)` ("an 8" / "a D", shared by the hidden-single text and the key line), `hintMarks(hint, grid)` -> `{area, target, digits, hatched, confined, removed}`; `hatched` = the reason cells below, ascending, explain only (#65). `ringLink(p, ringed, d)`, `ringRules(q, hatched, d)` (#72, reverse: `{cells, text}`; shares internal `cellPlace`/`sharedUnits`) -> `{partners, text}`: the ringed cells sharing a unit with hatched cell p (reading order) and the link sentence; pure, does not check p is hatched (#68).
  - `digits` (explain only): cells holding D that share a unit with a reason cell. Reason cells: hidden single = the other empty cells of its unit; pointing = empty box cells not confined, plus (hidden form, `hint.unit` set) empty cells of the hidden unit other than the target and the removed cells. None for a naked single. All qualifying rings kept (PM D4).
  - Internal `pointingHint(s, step, grid)` adds " (the box has no other empty cells)" on step 2 when every empty box cell is confined.
- Rewards: `classifyEntry` (naked > hidden > pointing), `emptyTally`, `creditEntry(...)` -> `{tally, credited, text, kind}`, `statusClass(kind)`, `tallyLines`, `TECHNIQUE_DEFINITIONS`.
- Completion: `completionFor(grid, tally)` -> solved / conflict / `null`.
- Cell indices in marks and `credited` are flat `9*r + c`; r/c in results are 0-based.

## How index.html wires it
- `sudoku.js` loads at the end of `body`; `render()` finds elements by id and builds the table of `<input>` cells.
- Picker buttons call `choose(level)`; `newPuzzle` resets state. Per-cell `keydown`/`input` handlers call `nextCell`, `applyEntry`, `sanitizeDigit`.
- Value change (`setCell`, the single write path): `before` grid -> `creditEntry`; then `clearResults`, `showClashes(after)`, `fixedMessage`, the credit text, then `completionFor` (wins when the grid is full); `showTally`.
- `clearResults` (Verify, Hint, value changes, `choose`, `newPuzzle`) clears the status, the key line, `hatchedRings` and the link line (`unlink`), red flags and all hint classes (including `hint-hatched`)/`data-d`; never `td.clash`. Notes changes do not call it, so a hint and its key line survive them.
- Hint button: `clearResults`, then `hintFor(grid, step, preferredTechnique(tally, currentLevel), currentLevel)`, `hintMarks` adds `hint-target`, `hint-area`, `hint-digit`, and on a pointing explain `hint-confined`/`hint-removed` plus `data-d`, adds `hint-hatched` to `marks.hatched`, and on every explain except a naked single sets `#key` to `hintKey(res, marks.hatched.length)`; when `marks.hatched` is non-empty it stores `hatchedRings = {hatched, rings: marks.digits, d}` (d = pointDigit for pointing, else digit) and shows the invitation. `cellAt(q)` is shared at wiring scope.
- Link (#68, #72): `unlink()` removes `hint-linked`, and `hint-ruled` with its `data-d` (#78), and sets the line to the invitation (or empty when nothing is hatched); `clearResults` calls it. `focusin` on the table calls `unlink()`, then: an entered ring -> `selectRing(p)` (adds `hint-linked` to the ring, `hint-ruled` plus `data-d` to `ringRules(...).cells`, shows its text); a hatched cell -> `hint-linked` on `ringLink(...).partners` and its text. `focusout` -> `unlink`. A document-level `click` handler (runs after the focusout of the cell that lost focus) ignores editable cells (left to focusin, else it would undo a forward link), otherwise unlinks and, on a given ring, calls `selectRing`; it returns early when no hint with hatching shows.
- `relabel(inp)` is the only aria-label builder (position, notes, ", clashes").

## Tests
- Run `node --test` from the repo root (on Node 24 `node --test tests/` fails). 173 tests (153 unit, 20 page), about 3 s with Chrome, 0.6 s without.
- Page tests (#55): one headless Chrome per file; `Math.random` seeded by injecting `seededRng`'s source (regex-extracted from `sudoku.js`, guarded by a seeding assertion); keydown on cell inputs and real button clicks; DOM-only reads; no test hooks in product code. Chrome via `CHROME_PATH` or default macOS/Linux paths; `WEAVER_NO_CHROME=1` or a missing Chrome gives a visible skip with a reason (page evidence must show skipped = 0). Cleanup on normal end, failure, Ctrl-C/SIGTERM and the orphaned test child (EPIPE listeners, ppid watchdog); not after `kill -9`.
- Narrow-width page checks use `Emulation.setDeviceMetricsOverride` (headless Chrome's window has a ~500 px minimum), wait for layout to settle (check the cell width), and clear the override in `finally`.
- Seeds are chosen on purpose: a seeded test guards a rule only if one of its seeds fails under the mutant.
- Page tests that pin wording use literal text (f1b pins P1 pointing and P3 hidden single of #65, with the two-layer background guard and a value-change clear; f2 covers naked = no key; f1c pins the #68 L1 link flow, grid-leave and linked computed styles; f1d the naked-form pointing link digit). Page tests need `Emulation.setFocusEmulationEnabled` for focus events (set in `before`, #68); f compares the page with the helper and so tests wiring only. f4 (mobile:true; #83) guards squareness at 360/375 px, the grid span at 375, corner badges 1/3/7/9 inside and flush, and the struck badge: strike contrast >= 4.5:1 and the thinnest strike over digits 1-9 >= 2 px at 375 px.
