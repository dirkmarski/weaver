// Protocol driver for the game logic: the only code that loads sudoku.js.
// It performs actions and reports what the game says. It checks nothing.
import * as Sudoku from '../../sudoku.js';

// rows: 9 strings of 9 characters, "." = empty.
function start(rows) {
  const puzzle = rows.map((r) => r.split('').map((ch) => (ch === '.' ? 0 : Number(ch))));
  const grid = puzzle.map((r) => r.slice());
  return { grid, tally: Sudoku.emptyTally(), credited: {}, shown: null, linesBefore: null };
}

// The player enters a digit with no hint showing; row and column are 1-based.
function enter(game, row, column, digit) {
  const r = row - 1, c = column - 1;
  game.linesBefore = Sudoku.tallyLines(game.tally);
  const res = Sudoku.creditEntry(game.tally, game.credited, null, game.grid, r, c, String(digit));
  game.grid[r][c] = digit;
  game.tally = res.tally;
  game.credited = res.credited;
  game.shown = { text: res.text, kind: res.kind, cssClass: Sudoku.statusClass(res.kind) };
}

// The player presses Hint twice (nudge, then explanation) at a level ('tricky'...), as the page does.
function hintTwice(game, level) {
  const prefer = Sudoku.preferredTechnique(game.tally, level);
  Sudoku.hintFor(game.grid, 1, prefer, level);
  game.hint = Sudoku.hintFor(game.grid, 2, prefer, level);
}

// The tally lines as shown, without the heading.
const lines = (game) => Sudoku.tallyLines(game.tally).slice(1);
const linesBeforeLastEntry = (game) => game.linesBefore.slice(1);

export { start, enter, hintTwice, lines, linesBeforeLastEntry };
