# Glossary

## Sudoku terms
- **Given**: a pre-filled, locked digit of the puzzle.
- **Cell / unit**: a unit is a row, a column or a 3x3 box (9 cells each). "Peers" of a cell are the other cells in its units.
- **Candidate**: a digit that can still go in an empty cell given the digits in its row, column and box (notes are ignored by the game).
- **Naked single**: an empty cell with exactly one candidate.
- **Hidden single**: a digit with only one possible cell in a box, row or column, even if that cell has other candidates. Checked box, then row, then column. A cell that is both is reported as naked.
- **Pointing**: in a box, a digit not yet placed fits only in cells of one row (or column); so it cannot go elsewhere in that line, which can make another cell a single. Naked form: a cell outside the box in that line left with one candidate. Hidden form: a unit where the digit now fits one cell only.
- **Claiming** (box-line reduction): the reverse of pointing; not yet taught.
- **Naked/hidden pair**: later techniques, not yet taught.
- **Reading order**: row by row from the top, left to right within a row; used to pick the first cell, box (0-8) or step.
- **Solvable by (technique)**: the puzzle can be completed using only that technique (`solvableBy`).
- **Wall**: the point where no naked or hidden single remains.
- **Clash / slip**: a digit that also appears in another cell of its row, column or box (`findConflicts`, givens included). A slip is a player entry that creates a clash.

## Project terms
- **Level**: Easy, Medium, Tricky, Hard (see product.md). `LEVELS` holds the band and `technique`/`beyond`.
- **Seed**: input to `seededRng(seed)` for reproducible generation and tests.
- **Capped**: generation hit the 1000 ms limit and returned the best unique puzzle so far (`capped: true`).
- **Tally**: per-puzzle counts of naked singles, hidden singles and pointing, "on your own" vs "with a hint".
- **Credited**: a cell already counted in the tally this puzzle; counted once per cell.
- **Not counted**: neutral "Entered: ... not counted" message for a judged entry that earns no reward.
- **Nudge / explain**: first and second Hint click.
- **Named clash**: the one clashing pair (P, Q) and unit U named in the not-counted text and in Hint during a clash (`namedClash`, #50).
- **Clash outline**: the dashed orange `td.clash` mark on every clashing cell while the clash lasts; the only live mark (#51).
- **Fixed message**: "No numbers break the rules now. New entries are counted again.", shown when a value change ends the last clash (#51).
- **Hint mark / ring**: amber target, tinted area, purple ring and digit on cells holding the key digit.
- **Persona (user-a/b/c)**: simulated user agents used by the PM for scoping and acceptance; not real users.
- **Play tool**: headless text-grid driver of the game logic (in a session scratchpad), used for persona sessions and acceptance.
- **wallreset**: play-tool setup that pre-plays singles to the wall and then resets the tally.
- **Frozen oracle**: old test file `tests/frozen-sudoku-e81999c.js` comparing against a frozen copy of the logic; removed in #35.
- **Mutation spot check**: a deliberate small break of the code to see whether a test fails; used by the reviewer and developer.
- **Gate**: a check before work moves on (issue gate, lead check, PM acceptance).
- **Iteration branch**: `iteration-N`, holds the work logs, merged by PR at the end.
- **Scratchpad**: session-specific shared folder for temporary files; not in the repo.
- **Wiki / WIP / work log / session**: the memory tiers (`governance/memory-architecture.md`).
