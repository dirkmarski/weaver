// Protocol driver for the game logic: the only code that loads the product modules.
// It performs actions and reports what the game says. It checks nothing.
import { hintFor, preferredTechnique } from '../../hints.js';
import * as hintmarks from '../../hintmarks.js';
import { classifyEntry, creditEntry, emptyTally, statusClass, tallyLines } from '../../rewards.js';

// rows: 9 strings of 9 characters, "." = empty.
function start(rows) {
  const puzzle = rows.map((r) => r.split('').map((ch) => (ch === '.' ? 0 : Number(ch))));
  const grid = puzzle.map((r) => r.slice());
  return { grid, tally: emptyTally(), credited: {}, shown: null, linesBefore: null };
}

// The player enters a digit with no hint showing; row and column are 1-based.
function enter(game, row, column, digit) {
  const r = row - 1, c = column - 1;
  game.linesBefore = tallyLines(game.tally);
  const step = classifyEntry(game.grid, r, c, digit);
  const res = creditEntry(game.tally, game.credited, null, game.grid, r, c, String(digit));
  game.grid[r][c] = digit;
  game.tally = res.tally;
  game.credited = res.credited;
  game.marks = marksFor(step, r, c);
  game.shown = { text: res.text, kind: res.kind, cssClass: statusClass(res.kind) };
}

// The marks an own pointing/claiming step puts on the board: { area, confined, removed, key } (flat cell indices).
// Part A: hintmarks.rewardMarks(step, r, c) may not exist yet; then nothing is marked.
const NO_MARKS = { area: [], confined: [], removed: [], key: '' };
function marksFor(step, r, c) {
  const own = step && (step.technique === 'pointing' || step.technique === 'claiming');
  return own && hintmarks.rewardMarks ? hintmarks.rewardMarks(step, r, c) : NO_MARKS;
}

// The player presses Hint twice (nudge, then explanation) at a level ('tricky'...), as the page does.
function hintTwice(game, level) {
  const prefer = preferredTechnique(game.tally, level);
  hintFor(game.grid, 1, prefer, level);
  game.hint = hintFor(game.grid, 2, prefer, level);
}

// The tally lines as shown, without the heading.
const lines = (game) => tallyLines(game.tally).slice(1);
const linesBeforeLastEntry = (game) => game.linesBefore.slice(1);

const marks = (game) => game.marks;

export { marks, start, enter, hintTwice, lines, linesBeforeLastEntry };
