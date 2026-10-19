'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { isValidSolution, findConflicts, verify, sanitizeDigit, applyEntry, noteDigits, buildGrid, nextCell, findNakedSingle, findHiddenSingle, preferredTechnique, hintFor, hintApplied, classifyEntry, emptyTally, creditEntry, completionFor, tallyLines, TECHNIQUE_DEFINITIONS, generatePuzzle, seededRng } = require('../sudoku.js');
const { SOLUTION, PUZZLE } = require('./fixture.js');

const clone = () => SOLUTION.map((r) => r.slice());

test('shipped solution is valid', () => assert.ok(isValidSolution(SOLUTION)));

test('shipped solution has 81 cells all 1-9', () => {
  const cells = SOLUTION.flat();
  assert.strictEqual(cells.length, 81);
  assert.ok(cells.every((v) => Number.isInteger(v) && v >= 1 && v <= 9));
});

test('rejects duplicate in a row', () => {
  // Swap two cells vertically within the same box column: every column and
  // box keeps the same digits (so stays valid); only rows 0 and 1 gain duplicates.
  const g = clone(); [g[0][0], g[1][0]] = [g[1][0], g[0][0]];
  assert.strictEqual(isValidSolution(g), false);
  for (let i = 0; i < 9; i++) {
    const col = g.map((r) => r[i]);
    assert.strictEqual(new Set(col).size, 9, 'column ' + i);
    const box = [];
    for (let j = 0; j < 9; j++) box.push(g[3 * Math.floor(i / 3) + Math.floor(j / 3)][3 * (i % 3) + (j % 3)]);
    assert.strictEqual(new Set(box).size, 9, 'box ' + i);
  }
  assert.notStrictEqual(new Set(g[0]).size, 9);
});

test('rejects duplicate in a column only', () => {
  // swap two cells within a row-band so rows stay valid but columns break
  const g = clone(); [g[0][0], g[0][1]] = [g[0][1], g[0][0]];
  assert.strictEqual(isValidSolution(g), false);
});

test('rejects duplicate in a box only', () => {
  // rows and columns each valid (Latin square) but a box repeats: plain cyclic grid
  const g = [];
  for (let r = 0; r < 9; r++) { g.push([]); for (let c = 0; c < 9; c++) g[r].push((r + c) % 9 + 1); }
  assert.strictEqual(isValidSolution(g), false);
});

test('rejects zero and out-of-range values', () => {
  for (const bad of [0, 10, -1, 1.5, '5', null, NaN, true, false]) {
    const g = clone(); g[4][4] = bad;
    assert.strictEqual(isValidSolution(g), false, String(bad));
  }
});

test('rejects wrong shape', () => {
  assert.strictEqual(isValidSolution(SOLUTION.slice(1)), false);
  const g = clone(); g[3] = g[3].slice(1);
  assert.strictEqual(isValidSolution(g), false);
  assert.strictEqual(isValidSolution(null), false);
  assert.strictEqual(isValidSolution([]), false);
});

test('shipped solution is not a simple pattern', () => {
  const shifts = (a, b) => a.every((v, i) => v === b[(i + 1) % 9]);
  for (let r = 0; r < 8; r++) assert.ok(!shifts(SOLUTION[r], SOLUTION[r + 1]));
  for (const row of SOLUTION) assert.notDeepStrictEqual(row, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('rejects sparse array (hole)', () => {
  const g = clone(); delete g[2][2];
  assert.strictEqual(isValidSolution(g), false);
  const h = clone(); delete h[5];
  assert.strictEqual(isValidSolution(h), false);
});

test('rejects a row given as a string', () => {
  const g = clone(); g[0] = SOLUTION[0].join('');
  assert.strictEqual(isValidSolution(g), false);
});

test('rejects an extra 10th row', () => {
  const g = clone(); g.push(SOLUTION[0].slice());
  assert.strictEqual(isValidSolution(g), false);
});

// ---- Playable puzzle, conflicts, verify, input sanitising ----
const grid = (g) => g.map((r) => r.slice());
const keys = (list) => list.map((p) => p.join(',')).sort();

test('puzzle givens have no conflicts', () => assert.deepStrictEqual(findConflicts(PUZZLE), []));

test('puzzle has 30 givens, empties, and matches SOLUTION', () => {
  const flat = PUZZLE.flat();
  assert.strictEqual(flat.filter((v) => v).length, 30);
  assert.ok(flat.some((v) => v === 0));
  PUZZLE.forEach((row, r) => row.forEach((v, c) => { if (v) assert.strictEqual(v, SOLUTION[r][c]); }));
});

test('full SOLUTION verifies as solved', () => {
  const res = verify(SOLUTION);
  assert.deepStrictEqual([res.complete, res.solved, res.conflicts.length], [true, true, 0]);
});

test('unmodified puzzle: incomplete, no conflicts, not solved', () => {
  const res = verify(PUZZLE);
  assert.deepStrictEqual([res.complete, res.solved, res.conflicts.length, res.empty], [false, false, 0, 51]);
});

test('incomplete correct grid has no conflicts', () => {
  const g = grid(PUZZLE); g[0][2] = SOLUTION[0][2];
  const res = verify(g);
  assert.strictEqual(res.complete, false);
  assert.deepStrictEqual(res.conflicts, []);
});

test('row conflict in isolation', () => {
  const g = grid(PUZZLE); g[0][8] = 7; // row 0 has 7 at col 4; col 8 and box 2 have no 7
  assert.deepStrictEqual(keys(findConflicts(g)), ['0,4', '0,8']);
});

test('column conflict in isolation', () => {
  const g = grid(PUZZLE); g[8][0] = 5; // col 0 has 5 at row 0; row 8 and box 6 have no 5
  assert.deepStrictEqual(keys(findConflicts(g)), ['0,0', '8,0']);
});

test('box conflict in isolation', () => {
  const g = grid(PUZZLE); g[2][0] = 3; // box 0 has 3 at (0,1); row 2 and col 0 have no 3
  assert.deepStrictEqual(keys(findConflicts(g)), ['0,1', '2,0']);
});

test('complete but invalid grid is not solved', () => {
  const g = grid(SOLUTION); [g[0][0], g[0][1]] = [g[0][1], g[0][0]];
  const res = verify(g);
  assert.strictEqual(res.complete, true);
  assert.strictEqual(res.solved, false);
  assert.ok(res.conflicts.length > 0);
});

test('a different valid solution is accepted (no stored-solution comparison)', () => {
  const perm = [0, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((v, i) => (i === 0 ? 0 : v));
  const g = SOLUTION.map((r) => r.map((v) => perm[v]));
  assert.notDeepStrictEqual(g, SOLUTION);
  assert.ok(isValidSolution(g));
  assert.strictEqual(verify(g).solved, true);
});

test('sanitizeDigit accepts one digit 1-9 or empty, rejects the rest', () => {
  for (const ok of ['1', '5', '9']) assert.strictEqual(sanitizeDigit(ok), ok);
  assert.strictEqual(sanitizeDigit(''), '');
  for (const bad of ['0', 'a', '-', ' ', '12', '55', '1a', '٣', null, undefined, 5]) {
    assert.strictEqual(sanitizeDigit(bad), null, String(bad));
  }
});

test('two user-entered clashing digits are both reported', () => {
  const g = PUZZLE.map((r) => r.slice());
  g[0][2] = 2; g[0][3] = 2; // both user cells, same row, different boxes
  assert.deepStrictEqual(findConflicts(g).map((p) => p.join(',')), ['0,2', '0,3']);
});

test('cell in conflict in both row and box is reported once', () => {
  const g = PUZZLE.map((r) => r.slice());
  g[0][2] = 3; // clashes with given 3 at (0,1): same row and same box
  const res = findConflicts(g).map((p) => p.join(','));
  assert.deepStrictEqual(res, ['0,1', '0,2']);
  assert.strictEqual(res.filter((k) => k === '0,2').length, 1);
});

// ---- Pencil-mark notes ----
const empty = { value: '', notes: 0 };
const bit = (...ds) => ds.reduce((m, d) => m | (1 << d), 0);

test('noteDigits lists noted digits in order', () => {
  assert.deepStrictEqual(noteDigits(0), []);
  assert.deepStrictEqual(noteDigits(bit(7, 1, 4)), [1, 4, 7]);
  assert.deepStrictEqual(noteDigits(bit(1, 2, 3, 4, 5, 6, 7, 8, 9)), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('notes mode: digits toggle notes on an empty cell', () => {
  let c = applyEntry(applyEntry(empty, '3', true), '7', true);
  assert.deepStrictEqual(c, { value: '', notes: bit(3, 7) });
  c = applyEntry(c, '3', true);
  assert.deepStrictEqual(c, { value: '', notes: bit(7) });
});

test('notes mode: a cell with a value ignores digits', () => {
  const c = { value: '5', notes: 0 };
  assert.deepStrictEqual(applyEntry(c, '3', true), c);
  assert.deepStrictEqual(applyEntry(c, '5', true), c);
});

test('notes mode: Backspace/Delete removes all notes of an empty cell', () => {
  const c = { value: '', notes: bit(1, 9) };
  assert.deepStrictEqual(applyEntry(c, 'Backspace', true), empty);
  assert.deepStrictEqual(applyEntry(c, 'Delete', true), empty);
});

test('notes mode: Backspace on a cell with a value clears the value', () => {
  assert.deepStrictEqual(applyEntry({ value: '5', notes: 0 }, 'Backspace', true), empty);
});

test('normal mode: a digit sets the value and removes the notes', () => {
  assert.deepStrictEqual(applyEntry({ value: '', notes: bit(2, 4) }, '6', false), { value: '6', notes: 0 });
  assert.deepStrictEqual(applyEntry({ value: '1', notes: 0 }, '6', false), { value: '6', notes: 0 });
});

test('normal mode: clearing the value leaves no notes, Delete keeps existing notes', () => {
  assert.deepStrictEqual(applyEntry({ value: '6', notes: 0 }, 'Delete', false), empty);
  assert.deepStrictEqual(applyEntry({ value: '', notes: bit(2) }, 'Delete', false), { value: '', notes: bit(2) });
});

test('letters, 0 and multi-character text change nothing in either mode', () => {
  const c = { value: '', notes: bit(2) };
  ['a', '0', '12', '4x', ' '].forEach((k) => {
    assert.deepStrictEqual(applyEntry(c, k, true), c);
    assert.deepStrictEqual(applyEntry(c, k, false), c);
  });
});

test('verify ignores notes: a notes-only cell is empty in the grid verify checks', () => {
  const values = PUZZLE.map((r) => r.map(() => ''));
  const r = PUZZLE.findIndex((row) => row.includes(0));
  const c = PUZZLE[r].indexOf(0);
  const cell = applyEntry({ value: '', notes: 0 }, '1', true);
  assert.strictEqual(cell.value, '');
  values[r][c] = cell.value; // the input shows no value, only a note
  const grid = buildGrid(PUZZLE, values);
  assert.strictEqual(grid[r][c], 0);
  assert.strictEqual(verify(grid).empty, verify(PUZZLE).empty);
  values[r][c] = '9';
  assert.strictEqual(buildGrid(PUZZLE, values)[r][c], 9);
});

test('buildGrid accepts the UI shape: given cells have no input and yield "" in values', () => {
  // The Verify handler maps a missing input (given cell) to '' - see sudoku.js.
  const values = PUZZLE.map((row) => row.map((v) => ''));
  const r = PUZZLE.findIndex((row) => row.includes(0));
  const c = PUZZLE[r].indexOf(0);
  values[r][c] = '7';
  const grid = buildGrid(PUZZLE, values);
  PUZZLE.forEach((row, i) => row.forEach((v, j) => {
    if (v) assert.strictEqual(grid[i][j], v);
    else assert.strictEqual(grid[i][j], i === r && j === c ? 7 : 0);
  }));
});

// nextCell: 0 = editable, nonzero = given.
const NC = [
  [0, 5, 0, 6, 7, 8, 9, 1, 2],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  [4, 0, 0, 0, 0, 0, 0, 0, 0],
  [5, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 0],
  [2, 0, 0, 0, 0, 0, 0, 0, 0],
  [6, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]
];

test('nextCell moves one step in every direction', () => {
  assert.deepStrictEqual(nextCell(NC, 4, 4, 'up'), [3, 4]);
  assert.deepStrictEqual(nextCell(NC, 4, 4, 'down'), [5, 4]);
  assert.deepStrictEqual(nextCell(NC, 4, 4, 'left'), [4, 3]);
  assert.deepStrictEqual(nextCell(NC, 4, 4, 'right'), [4, 5]);
});

test('nextCell skips one given', () => {
  assert.deepStrictEqual(nextCell(NC, 0, 0, 'right'), [0, 2]);
  assert.deepStrictEqual(nextCell(NC, 0, 2, 'left'), [0, 0]);
});

test('nextCell skips several givens', () => {
  assert.deepStrictEqual(nextCell(NC, 1, 0, 'down'), [8, 0]);
  assert.deepStrictEqual(nextCell(NC, 8, 0, 'up'), [1, 0]);
  assert.deepStrictEqual(nextCell(NC, 0, 0, 'down'), [1, 0]);
});

test('nextCell does not wrap at the edges', () => {
  assert.strictEqual(nextCell(NC, 8, 4, 'down'), null);
  assert.strictEqual(nextCell(NC, 1, 0, 'left'), null);
  assert.strictEqual(nextCell(NC, 1, 8, 'right'), null);
  assert.strictEqual(nextCell(NC, 0, 2, 'up'), null);
});

test('nextCell returns null when only givens are left in that direction', () => {
  assert.strictEqual(nextCell(NC, 0, 2, 'right'), null);
  assert.strictEqual(nextCell(NC, 0, 0, 'left'), null);
});

test('nextCell from a cell surrounded by givens finds nothing', () => {
  const g = NC.map(row => row.map(() => 1));
  g[4][4] = 0;
  for (const d of ['up', 'down', 'left', 'right']) assert.strictEqual(nextCell(g, 4, 4, d), null);
});

// ---- Hints: naked single ----

const emptyGrid = () => Array.from({ length: 9 }, () => Array(9).fill(0));
// SOLUTION with the given cells blanked.
const blank = (...cells) => { const g = clone(); cells.forEach(([r, c]) => { g[r][c] = 0; }); return g; };

const TWO_CANDIDATES = [[0, 3], [0, 4], [3, 3], [3, 4]];

test('findNakedSingle: empty grid has none', () => assert.strictEqual(findNakedSingle(emptyGrid()), null));

test('findNakedSingle: cells with 2+ candidates are not naked singles', () => {
  // 6/7 swapped across rows 1 and 4: every blank cell has two candidates.
  assert.strictEqual(findNakedSingle(blank(...TWO_CANDIDATES)), null);
});

test('findNakedSingle: a full grid has none', () => assert.strictEqual(findNakedSingle(clone()), null));

test('findNakedSingle: finds a single one with its 0-based cell, digit and ascending seen digits', () => {
  const s = findNakedSingle(blank([4, 7]));
  assert.deepStrictEqual(s, { r: 4, c: 7, digit: SOLUTION[4][7], seen: [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => d !== SOLUTION[4][7]) });
});

test('findNakedSingle: picks the first in reading order among several', () => {
  const s = findNakedSingle(blank([6, 1], [2, 8], [2, 3], [5, 0]));
  assert.deepStrictEqual([s.r, s.c], [2, 3]);
  assert.strictEqual(s.digit, SOLUTION[2][3]);
});

test('findNakedSingle: PUZZLE fixture first naked single in reading order', () => {
  const s = findNakedSingle(PUZZLE);
  assert.ok(s);
  assert.strictEqual(s.r, 4);
  assert.strictEqual(s.c, 4);
  assert.strictEqual(s.digit, 5);
  assert.strictEqual(s.digit, SOLUTION[s.r][s.c]);
  assert.strictEqual(s.seen.length, 8);
});

test('hintFor: conflicts come first, even on a full grid', () => {
  const g = clone(); g[0][0] = g[0][1];
  const h = hintFor(g, 1);
  assert.strictEqual(h.kind, 'conflict');
  assert.strictEqual(h.text, 'Some numbers break the rules. Fix them first: click Verify to see which.');
  assert.strictEqual(hintFor(g, 2).kind, 'conflict');
  const g2 = blank([8, 8]); g2[0][0] = g2[0][1];
  assert.strictEqual(hintFor(g2, 1).kind, 'conflict');
});

test('hintFor: full grid without conflicts', () => {
  const h = hintFor(clone(), 1);
  assert.strictEqual(h.kind, 'full');
  assert.strictEqual(h.text, 'Every cell is filled. Click Verify to check the grid.');
});

test('hintFor: no naked and no hidden single', () => {
  for (const g of [emptyGrid(), blank(...TWO_CANDIDATES)]) {
    const h = hintFor(g, 1);
    assert.strictEqual(h.kind, 'none');
    assert.strictEqual(h.text, 'No naked or hidden single right now. At this point the puzzle needs another technique.');
    assert.strictEqual(hintFor(g, 2).kind, 'none');
  }
});

test('hintFor: step 1 nudge uses 1-based row and column', () => {
  const h = hintFor(blank([4, 7]), 1);
  assert.strictEqual(h.kind, 'nudge');
  assert.deepStrictEqual([h.r, h.c, h.digit], [4, 7, SOLUTION[4][7]]);
  assert.strictEqual(h.text, 'Hint: row 5, column 8 is a naked single: only one digit fits there. '
    + 'Check its row, column and box to find it. Click Hint again to see why.');
});

test('hintFor: step 2 explains with the digit list, "and" before the last', () => {
  const g = blank([0, 0]); // SOLUTION[0][0] is 5; the other 8 digits are seen
  const h = hintFor(g, 2);
  assert.strictEqual(h.kind, 'explain');
  assert.deepStrictEqual([h.r, h.c, h.digit], [0, 0, 5]);
  assert.strictEqual(h.text, 'Naked single: row 1, column 1 must be 5, because its row, column and box already contain 1, 2, 3, 4, 6, 7, 8 and 9.');
});

test('hintFor: any step other than 2 is the nudge; the grid is not changed', () => {
  const g = blank([4, 7]), copy = JSON.stringify(g);
  assert.strictEqual(hintFor(g, 1).kind, 'nudge');
  assert.strictEqual(hintFor(g, 2).kind, 'explain');
  assert.strictEqual(JSON.stringify(g), copy);
});

test('hintApplied: reward only for the hinted digit', () => {
  const h = hintFor(blank([4, 7]), 1);
  const d = String(SOLUTION[4][7]);
  assert.strictEqual(hintApplied(h, d), 'Well done! You applied a naked single: row 5, column 8 is ' + d + '.');
  assert.strictEqual(hintApplied(h, d === '1' ? '2' : '1'), '');
  assert.strictEqual(hintApplied(h, ''), '');
  assert.strictEqual(hintApplied(null, d), '');
});

// ---- Hints: hidden single ----

// 81-digit strings (reading order, 0 = empty). Each position below has no naked single.
const grid81 = (str) => Array.from({ length: 9 }, (_, r) => Array.from({ length: 9 }, (_, c) => +str[r * 9 + c]));
const H_ROW = grid81('972456813648391725135728964051984030080613509390275081060532198513869000829147356');
const H_BOX = grid81('876200951342519876195678324569702108283100709417000502738421695954000217621957483');
const H_COL = grid81('876200951342519876195678324569702108283105709417000502738421695954000217621957483');
// (2,3) is a hidden single for 2 in its box, its row and its column.
const H_ALL = grid81('854700120962481357173005800340002910000000200000000780000120500286579431005000602');
// (0,4) is a hidden single for 7 in its row and its column, not in its box.
const H_ROWCOL = grid81('530600910002095308100002507000060023000850091710900050901507200007009035300206179');
// (0,7) is a hidden single (row) and comes before (2,3), a hidden single in its box.
const H_ORDER = grid81('854700100962481357173005800340002910000000200000000780000120500286579431005000602');
// (1,2) is a naked single; (0,1), earlier in reading order, is a hidden single.
const H_NAKED_FIRST = grid81('804700100960081057073005800300002010000000000000000780000120500080579031005000602');

test('findHiddenSingle: a hidden single in a box, a row and a column (no naked single anywhere)', () => {
  assert.strictEqual(findNakedSingle(H_BOX), null);
  assert.deepStrictEqual(findHiddenSingle(H_BOX), { r: 4, c: 5, digit: 5, unit: 'box' });
  assert.strictEqual(findNakedSingle(H_ROW), null);
  assert.deepStrictEqual(findHiddenSingle(H_ROW), { r: 3, c: 6, digit: 6, unit: 'row' });
  assert.strictEqual(findNakedSingle(H_COL), null);
  assert.deepStrictEqual(findHiddenSingle(H_COL), { r: 0, c: 5, digit: 4, unit: 'column' });
});

test('findHiddenSingle: the target is the first cell in reading order, whatever the unit', () => {
  assert.strictEqual(findNakedSingle(H_ORDER), null);
  assert.deepStrictEqual(findHiddenSingle(H_ORDER), { r: 0, c: 7, digit: 2, unit: 'row' });
});

test('findHiddenSingle: when a cell is the only spot for two digits of a unit, the lower digit is used', () => {
  const g = emptyGrid();
  g[0][2] = 3;
  [[4, 5, 6], [7, 8, 9]].forEach((vals, i) => vals.forEach((v, c) => { g[i + 1][c] = v; }));
  g[3][1] = 1;
  g[4][1] = 2;
  assert.deepStrictEqual(findConflicts(g), []);
  assert.strictEqual(findNakedSingle(g), null);
  assert.deepStrictEqual(findHiddenSingle(g), { r: 0, c: 0, digit: 1, unit: 'box' });
});

test('findHiddenSingle: for one cell, box before row before column', () => {
  assert.deepStrictEqual(findHiddenSingle(H_ALL), { r: 2, c: 3, digit: 2, unit: 'box' });
  assert.deepStrictEqual(findHiddenSingle(H_ROWCOL), { r: 0, c: 4, digit: 7, unit: 'row' });
});

test('findHiddenSingle: a digit already in the unit is not a hidden single; a unit with two spots is not one', () => {
  assert.strictEqual(findHiddenSingle(emptyGrid()), null);
  assert.strictEqual(findHiddenSingle(blank(...TWO_CANDIDATES)), null);
  assert.strictEqual(findHiddenSingle(clone()), null);
});

test('findHiddenSingle: does not change the grid', () => {
  const copy = JSON.stringify(H_BOX);
  findHiddenSingle(H_BOX);
  assert.strictEqual(JSON.stringify(H_BOX), copy);
});

test('findHiddenSingle: agrees with a candidate-based reading of D2/D3 on generated positions', () => {
  const cands = (g, r, c) => [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => {
    for (let i = 0; i < 9; i++) {
      if (g[r][i] === d || g[i][c] === d) return false;
      if (g[3 * Math.floor(r / 3) + Math.floor(i / 3)][3 * Math.floor(c / 3) + (i % 3)] === d) return false;
    }
    return true;
  });
  const cellsOf = (kind, r, c) => Array.from({ length: 9 }, (_, i) => kind === 'box'
    ? [3 * Math.floor(r / 3) + Math.floor(i / 3), 3 * Math.floor(c / 3) + (i % 3)]
    : kind === 'row' ? [r, i] : [i, c]);
  const expected = (g) => {
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
      if (g[r][c]) continue;
      for (const unit of ['box', 'row', 'column']) for (const digit of cands(g, r, c)) {
        const spots = cellsOf(unit, r, c).filter(([a, b]) => !g[a][b] && cands(g, a, b).includes(digit));
        if (spots.length === 1) return { r, c, digit, unit };
      }
    }
    return null;
  };
  let hidden = 0;
  for (let seed = 1; seed <= 12; seed++) {
    const g = generatePuzzle('medium', { rng: seededRng(seed) }).puzzle.map((row) => row.slice());
    for (;;) {
      const want = expected(g);
      assert.deepStrictEqual(findHiddenSingle(g), want, 'seed ' + seed);
      const n = findNakedSingle(g);
      if (n) { g[n.r][n.c] = n.digit; continue; }
      if (!want) break;
      hidden++;
      g[want.r][want.c] = want.digit;
    }
  }
  assert.ok(hidden > 0);
});

test('hintFor: a naked single is taught before a hidden single, even a later one in reading order', () => {
  assert.deepStrictEqual(findHiddenSingle(H_NAKED_FIRST), { r: 0, c: 1, digit: 5, unit: 'box' });
  const h = hintFor(H_NAKED_FIRST, 1);
  assert.strictEqual(h.technique, 'naked');
  assert.deepStrictEqual([h.r, h.c, h.digit], [1, 2, 2]);
  assert.strictEqual(h.unit, undefined);
});

test('hintFor: conflicts and a full grid still come before a hidden single', () => {
  const g = H_BOX.map((row) => row.slice()); g[0][0] = g[0][1];
  assert.strictEqual(hintFor(g, 1).kind, 'conflict');
  assert.strictEqual(hintFor(clone(), 1).kind, 'full');
});

test('hintFor: hidden single nudge text for box, row and column (1-based row and column)', () => {
  const box = hintFor(H_BOX, 1);
  assert.strictEqual(box.kind, 'nudge');
  assert.strictEqual(box.technique, 'hidden');
  assert.strictEqual(box.unit, 'box');
  assert.deepStrictEqual([box.r, box.c, box.digit], [4, 5, 5]);
  assert.strictEqual(box.text, 'Hint: row 5, column 6 is a hidden single: in its box, one of the missing digits fits only in this cell. '
    + 'Check where each missing digit can go in the box. Click Hint again to see why.');
  assert.strictEqual(hintFor(H_ROW, 1).text, 'Hint: row 4, column 7 is a hidden single: in its row, one of the missing digits fits only in this cell. '
    + 'Check where each missing digit can go in the row. Click Hint again to see why.');
  assert.strictEqual(hintFor(H_COL, 1).text, 'Hint: row 1, column 6 is a hidden single: in its column, one of the missing digits fits only in this cell. '
    + 'Check where each missing digit can go in the column. Click Hint again to see why.');
});

test('hintFor: hidden single explain text for box, row and column', () => {
  const box = hintFor(H_BOX, 2);
  assert.strictEqual(box.kind, 'explain');
  assert.strictEqual(box.technique, 'hidden');
  assert.strictEqual(box.unit, 'box');
  assert.strictEqual(box.text, 'Hidden single: row 5, column 6 must be 5, because every other empty cell in its box already has a 5 in its row or column.');
  assert.strictEqual(hintFor(H_ROW, 2).text, 'Hidden single: row 4, column 7 must be 6, because every other empty cell in its row already has a 6 in its column or box.');
  assert.strictEqual(hintFor(H_COL, 2).text, 'Hidden single: row 1, column 6 must be 4, because every other empty cell in its column already has a 4 in its row or box.');
});

test('hintFor: hidden single explain text uses "an" before 8 and "a" before 7 and 9', () => {
  const relabel = (d) => H_BOX.map((row) => row.map((v) => (v === 5 ? d : v === d ? 5 : v)));
  const text = (d, a) => 'Hidden single: row 5, column 6 must be ' + d + ', because every other empty cell in its box already has ' + a + ' ' + d + ' in its row or column.';
  assert.strictEqual(hintFor(relabel(8), 2).text, text(8, 'an'));
  assert.strictEqual(hintFor(relabel(8), 2).text, 'Hidden single: row 5, column 6 must be 8, because every other empty cell in its box already has an 8 in its row or column.');
  assert.strictEqual(hintFor(relabel(7), 2).text, text(7, 'a'));
  assert.strictEqual(hintFor(relabel(9), 2).text, text(9, 'a'));
});

test('hintApplied: hidden single reward text for box, row and column', () => {
  assert.strictEqual(hintApplied(hintFor(H_BOX, 1), '5'), 'Well done! You applied a hidden single: row 5, column 6 is 5.');
  assert.strictEqual(hintApplied(hintFor(H_ROW, 2), '6'), 'Well done! You applied a hidden single: row 4, column 7 is 6.');
  assert.strictEqual(hintApplied(hintFor(H_COL, 1), '4'), 'Well done! You applied a hidden single: row 1, column 6 is 4.');
  assert.strictEqual(hintApplied(hintFor(H_BOX, 1), '4'), '');
  assert.strictEqual(hintApplied(hintFor(H_BOX, 1), ''), '');
});

test('hintFor: naked single results carry technique naked', () => {
  assert.strictEqual(hintFor(blank([4, 7]), 1).technique, 'naked');
  assert.strictEqual(hintFor(blank([4, 7]), 2).technique, 'naked');
});

// ---- Rewards: classifyEntry, creditEntry, tallyLines ----

const cl = (g) => g.map((r) => r.slice());

// number of empty cells of the unit of (r, c) (kind 0 row, 1 column, 2 box) where d fits
function spotsForTest(g, r, c, kind, d) {
  let n = 0;
  for (let i = 0; i < 9; i++) {
    const rr = kind === 0 ? r : kind === 1 ? i : 3 * Math.floor(r / 3) + Math.floor(i / 3);
    const cc = kind === 0 ? i : kind === 1 ? c : 3 * Math.floor(c / 3) + (i % 3);
    if (g[rr][cc]) continue;
    let fits = true;
    for (let j = 0; j < 9; j++) {
      if (g[rr][j] === d || g[j][cc] === d) fits = false;
      if (g[3 * Math.floor(rr / 3) + Math.floor(j / 3)][3 * Math.floor(cc / 3) + (j % 3)] === d) fits = false;
    }
    if (fits) n++;
  }
  return n;
}

test('classifyEntry: null for a conflict elsewhere, a filled cell and digits outside 1-9', () => {
  assert.deepStrictEqual(classifyEntry(H_BOX, 4, 5, 5), { technique: 'hidden', unit: 'box' });
  const bad = cl(H_BOX);
  bad[0][3] = 8; // clashes with (0,0) in row 0
  assert.ok(findConflicts(bad).length > 0);
  assert.strictEqual(classifyEntry(bad, 4, 5, 5), null);
  assert.strictEqual(classifyEntry(H_BOX, 0, 0, 8), null); // filled target cell
  assert.strictEqual(classifyEntry(H_BOX, 0, 3, 3), null); // filled with 3: would be naked if the filled check were missing
  assert.strictEqual(classifyEntry(H_BOX, 4, 5, 0), null);
  assert.strictEqual(classifyEntry(H_BOX, 4, 5, 10), null);
  assert.strictEqual(classifyEntry(H_BOX, 4, 5, 5.5), null);
  assert.strictEqual(classifyEntry(H_BOX, 4, 5, '5'), null);
});

test('classifyEntry: null for a non-candidate and for a candidate that is no single', () => {
  assert.strictEqual(classifyEntry(H_BOX, 4, 5, 1), null); // 1 is in the cell's row/column/box
  assert.strictEqual(classifyEntry(H_BOX, 4, 5, 4), null); // candidate (4, 5, 6) but no single
  assert.strictEqual(classifyEntry(H_BOX, 4, 5, 6), null);
  assert.strictEqual(classifyEntry(H_BOX, 4, 4, 4), null);
});

test('classifyEntry: naked single, and naked wins over hidden', () => {
  const g = clone();
  g[2][3] = 0;
  const d = SOLUTION[2][3];
  // the only empty cell: d is also the only place for d in the row, column and box
  for (let kind = 0; kind < 3; kind++) assert.strictEqual(spotsForTest(g, 2, 3, kind, d), 1);
  assert.deepStrictEqual(classifyEntry(g, 2, 3, d), { technique: 'naked' });
  assert.strictEqual(classifyEntry(g, 2, 3, d === 9 ? 1 : d + 1), null);
});

test('classifyEntry: unit order box, then row, then column', () => {
  // (2,3) with 2: the only spot in its box, its row and its column -> box
  for (let kind = 0; kind < 3; kind++) assert.strictEqual(spotsForTest(H_ALL, 2, 3, kind, 2), 1);
  assert.strictEqual(findNakedSingle(H_ALL), null);
  assert.deepStrictEqual(classifyEntry(H_ALL, 2, 3, 2), { technique: 'hidden', unit: 'box' });
  // (0,4) with 7: the only spot in its row and its column, not in its box -> row
  assert.strictEqual(spotsForTest(H_ROWCOL, 0, 4, 0, 7), 1);
  assert.strictEqual(spotsForTest(H_ROWCOL, 0, 4, 1, 7), 1);
  assert.ok(spotsForTest(H_ROWCOL, 0, 4, 2, 7) > 1);
  assert.deepStrictEqual(classifyEntry(H_ROWCOL, 0, 4, 7), { technique: 'hidden', unit: 'row' });
  // (0,5) with 4: only the column
  assert.ok(spotsForTest(H_COL, 0, 5, 0, 4) > 1);
  assert.ok(spotsForTest(H_COL, 0, 5, 2, 4) > 1);
  assert.strictEqual(spotsForTest(H_COL, 0, 5, 1, 4), 1);
  assert.deepStrictEqual(classifyEntry(H_COL, 0, 5, 4), { technique: 'hidden', unit: 'column' });
});

test('classifyEntry agrees with Hint at every step of 6 seeded Medium puzzles', () => {
  let steps = 0, naked = 0, hidden = 0;
  for (let seed = 1; seed <= 6; seed++) {
    const g = generatePuzzle('medium', { rng: seededRng(seed) }).puzzle.map((r) => r.slice());
    for (;;) {
      const h = hintFor(g, 1);
      if (h.kind !== 'nudge') break;
      const res = classifyEntry(g, h.r, h.c, h.digit);
      assert.strictEqual(res.technique, h.technique);
      if (h.technique === 'hidden') { assert.strictEqual(res.unit, h.unit); hidden++; } else naked++;
      g[h.r][h.c] = h.digit;
      steps++;
    }
    assert.ok(verify(g).solved, 'seed ' + seed + ' solved by hints');
  }
  assert.ok(steps > 30 && naked > 0 && hidden > 0);
});

const T0 = emptyTally();
// Issue 31: the two "not counted" texts, byte for byte (R, C 1-based).
const NOT_SINGLE = (r, c, d) => 'Entered: row ' + r + ', column ' + c + ' is ' + d + '. It was not a naked or hidden single at this point, so it is not counted.';
const BROKEN = (r, c, d) => 'Entered: row ' + r + ', column ' + c + ' is ' + d + '. Some numbers break the rules, so it is not counted. Click Verify to see which.';

test('creditEntry: with a hint, right cell and digit', () => {
  const hint = hintFor(H_BOX, 1);
  const res = creditEntry(T0, {}, hint, H_BOX, 4, 5, '5');
  assert.strictEqual(res.text, 'Well done! You applied a hidden single: row 5, column 6 is 5.');
  assert.deepStrictEqual(res.tally, { naked: { own: 0, hint: 0 }, hidden: { own: 0, hint: 1 } });
  assert.deepStrictEqual(res.credited, { 41: true });
  assert.deepStrictEqual(T0, { naked: { own: 0, hint: 0 }, hidden: { own: 0, hint: 0 } }); // inputs untouched
  const g = clone();
  g[4][7] = 0;
  const nh = hintFor(g, 2);
  const r2 = creditEntry(T0, {}, nh, g, 4, 7, String(SOLUTION[4][7]));
  assert.strictEqual(r2.text, 'Well done! You applied a naked single: row 5, column 8 is ' + SOLUTION[4][7] + '.');
  assert.deepStrictEqual(r2.tally.naked, { own: 0, hint: 1 });
});

test('creditEntry: on your own (naked and hidden texts)', () => {
  const g = clone();
  g[2][3] = 0;
  const n = creditEntry(T0, {}, null, g, 2, 3, String(SOLUTION[2][3]));
  assert.strictEqual(n.text, 'Well spotted! You found a naked single on your own: row 3, column 4 is ' + SOLUTION[2][3] + '.');
  assert.deepStrictEqual(n.tally, { naked: { own: 1, hint: 0 }, hidden: { own: 0, hint: 0 } });
  const h = creditEntry(T0, {}, null, H_ALL, 2, 3, '2');
  assert.strictEqual(h.text, 'Well spotted! You found a hidden single in its box on your own: row 3, column 4 is 2.');
  assert.deepStrictEqual(h.tally, { naked: { own: 0, hint: 0 }, hidden: { own: 1, hint: 0 } });
  assert.strictEqual(creditEntry(T0, {}, null, H_ROWCOL, 0, 4, '7').text,
    'Well spotted! You found a hidden single in its row on your own: row 1, column 5 is 7.');
  assert.strictEqual(creditEntry(T0, {}, null, H_COL, 0, 5, '4').text,
    'Well spotted! You found a hidden single in its column on your own: row 1, column 6 is 4.');
});

test('creditEntry: wrong digit in the hinted cell is judged on its own', () => {
  const hint = hintFor(H_BOX, 1); // (4,5) is 5
  const no = creditEntry(T0, {}, hint, H_BOX, 4, 5, '4');
  assert.deepStrictEqual(no, { tally: T0, credited: {}, text: NOT_SINGLE(5, 6, 4) });
  const fake = { kind: 'nudge', technique: 'naked', r: 4, c: 5, digit: 4, text: '' }; // hint for another digit
  const own = creditEntry(T0, {}, fake, H_BOX, 4, 5, '5');
  assert.strictEqual(own.text, 'Well spotted! You found a hidden single in its box on your own: row 5, column 6 is 5.');
  assert.deepStrictEqual(own.tally.hidden, { own: 1, hint: 0 });
  assert.deepStrictEqual(own.tally.naked, { own: 0, hint: 0 });
});

test('creditEntry: a single in another cell while a hint shows counts on your own', () => {
  const hint = hintFor(H_BOX, 1); // (4,5)
  const res = creditEntry(T0, {}, hint, H_BOX, 5, 4, '9');
  assert.strictEqual(res.text, 'Well spotted! You found a hidden single in its box on your own: row 6, column 5 is 9.');
  assert.deepStrictEqual(res.tally.hidden, { own: 1, hint: 0 });
});

test('creditEntry: no judgement for overwrite, clearing or non-digits', () => {
  const none = (r) => assert.deepStrictEqual(r, { tally: T0, credited: {}, text: '' });
  none(creditEntry(T0, {}, null, H_BOX, 0, 0, '3')); // cell already holds a value
  none(creditEntry(T0, {}, hintFor(H_BOX, 1), H_BOX, 4, 5, '')); // clearing
  none(creditEntry(T0, {}, null, H_BOX, 4, 5, '0'));
  none(creditEntry(T0, {}, null, H_BOX, 4, 5, 'x'));
  const withValue = cl(H_BOX);
  withValue[4][5] = 5;
  none(creditEntry(T0, {}, hintFor(H_BOX, 1), withValue, 4, 5, '5'));
});

test('creditEntry: a cell is credited once; the message shows again', () => {
  const first = creditEntry(T0, {}, null, H_BOX, 4, 5, '5');
  const second = creditEntry(first.tally, first.credited, null, H_BOX, 4, 5, '5');
  assert.strictEqual(second.text, first.text);
  assert.deepStrictEqual(second.tally, first.tally);
  assert.deepStrictEqual(second.tally.hidden, { own: 1, hint: 0 });
  const third = creditEntry(first.tally, first.credited, hintFor(H_BOX, 1), H_BOX, 4, 5, '5');
  assert.strictEqual(third.text, 'Well done! You applied a hidden single: row 5, column 6 is 5.');
  assert.deepStrictEqual(third.tally, first.tally);
  const other = creditEntry(first.tally, first.credited, null, H_BOX, 5, 4, '9');
  assert.deepStrictEqual(other.tally.hidden, { own: 2, hint: 0 });
});

test('tallyLines: heading and two lines, including zeros', () => {
  assert.deepStrictEqual(tallyLines(emptyTally()), [
    'Techniques applied in this puzzle',
    'Naked single: 0 on your own, 0 with a hint',
    'Hidden single: 0 on your own, 0 with a hint'
  ]);
  assert.deepStrictEqual(tallyLines({ naked: { own: 3, hint: 12 }, hidden: { own: 1, hint: 0 } }).slice(1), [
    'Naked single: 3 on your own, 12 with a hint',
    'Hidden single: 1 on your own, 0 with a hint'
  ]);
});

// ---- completionFor (issue #25) ----
const SOLVED_0 = 'Puzzle solved! Singles applied: 0 on your own, 0 with a hint.';
const CONFLICT_TEXT = 'Every cell is filled, but some numbers break the rules. Click Verify to see which.';
const MIXED = { naked: { own: 3, hint: 2 }, hidden: { own: 1, hint: 4 } };

test('completionFor: any empty cell gives null, wherever it is', () => {
  const t = emptyTally();
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const g = clone();
      g[r][c] = 0;
      assert.strictEqual(completionFor(g, t), null, 'empty at ' + r + ',' + c);
    }
  }
  assert.strictEqual(completionFor(PUZZLE, t), null);
  assert.strictEqual(completionFor(emptyGrid(), t), null);
});

test('completionFor: an empty cell wins over a conflict (null, never conflict or solved)', () => {
  const g = clone();
  g[0][1] = g[0][0]; // clash in row 0 and box 0
  g[8][8] = 0;
  assert.ok(findConflicts(g).length > 0);
  assert.strictEqual(completionFor(g, MIXED), null);
});

test('completionFor: full valid grid says solved with exact text', () => {
  assert.deepStrictEqual(completionFor(clone(), emptyTally()), { kind: 'solved', text: SOLVED_0 });
  assert.strictEqual(completionFor(clone(), MIXED).kind, 'solved');
  assert.strictEqual(completionFor(clone(), MIXED).text, 'Puzzle solved! Singles applied: 4 on your own, 6 with a hint.');
});

test('completionFor: own and hint sums are kept apart; same wording for 0, 1 and many', () => {
  const t = (nO, nH, hO, hH) => ({ naked: { own: nO, hint: nH }, hidden: { own: hO, hint: hH } });
  assert.strictEqual(completionFor(clone(), t(1, 0, 0, 0)).text, 'Puzzle solved! Singles applied: 1 on your own, 0 with a hint.');
  assert.strictEqual(completionFor(clone(), t(0, 1, 0, 0)).text, 'Puzzle solved! Singles applied: 0 on your own, 1 with a hint.');
  assert.strictEqual(completionFor(clone(), t(0, 0, 1, 0)).text, 'Puzzle solved! Singles applied: 1 on your own, 0 with a hint.');
  assert.strictEqual(completionFor(clone(), t(0, 0, 0, 1)).text, 'Puzzle solved! Singles applied: 0 on your own, 1 with a hint.');
  assert.strictEqual(completionFor(clone(), t(30, 0, 10, 0)).text, 'Puzzle solved! Singles applied: 40 on your own, 0 with a hint.');
  assert.strictEqual(completionFor(clone(), t(12, 13, 14, 15)).text, 'Puzzle solved! Singles applied: 26 on your own, 28 with a hint.');
});

test('completionFor: a full grid with a conflict says conflict, never solved, whatever the tally', () => {
  const row = clone(); row[0][1] = row[0][0];  // clash in a row
  const col = clone(); col[0][0] = col[1][0];  // clash in a column
  for (const g of [row, col]) {
    assert.ok(findConflicts(g).length > 0);
    for (const t of [emptyTally(), MIXED]) {
      assert.deepStrictEqual(completionFor(g, t), { kind: 'conflict', text: CONFLICT_TEXT });
    }
  }
});

test('completionFor: does not change grid or tally', () => {
  const t = JSON.parse(JSON.stringify(MIXED)), tj = JSON.stringify(t);
  const bad = clone(); bad[0][1] = bad[0][0];
  const part = clone(); part[4][4] = 0;
  for (const g of [clone(), bad, part]) {
    const gj = JSON.stringify(g);
    completionFor(g, t);
    assert.strictEqual(JSON.stringify(g), gj);
    assert.strictEqual(JSON.stringify(t), tj);
  }
});

test('completionFor: the last entry is counted first, so the final single is in O', () => {
  const g = clone(); g[4][4] = 0; // the last empty cell: a naked single
  const before = emptyTally();
  const res = creditEntry(before, {}, null, g, 4, 4, String(SOLUTION[4][4]));
  assert.strictEqual(res.tally.naked.own + res.tally.hidden.own, 1);
  assert.strictEqual(completionFor(clone(), res.tally).text, 'Puzzle solved! Singles applied: 1 on your own, 0 with a hint.');
  // With the tally from before the entry the final single would be missing.
  assert.strictEqual(completionFor(clone(), before).text, SOLVED_0);
});

test('TECHNIQUE_DEFINITIONS: the two texts, byte for byte', () => {
  assert.deepStrictEqual(TECHNIQUE_DEFINITIONS, {
    naked: 'Only one digit fits this cell: its row, column and box already hold the other eight.',
    hidden: 'This digit fits in only one cell of a row, column or box, even if that cell could take other digits.'
  });
});

// ---- Issue 30: Hint prefers the technique applied less ----

const frozen = require('./frozen-sudoku-e81999c.js'); // byte copy of sudoku.js at e81999c (before issue 30)

const tallyOf = (no, nh, ho, hh) => ({ naked: { own: no, hint: nh }, hidden: { own: ho, hint: hh } });

test('preferredTechnique: all-zero tally follows the level', () => {
  assert.strictEqual(preferredTechnique(emptyTally(), 'easy'), 'naked');
  assert.strictEqual(preferredTechnique(emptyTally(), 'medium'), 'hidden');
  assert.strictEqual(preferredTechnique(emptyTally(), 'hard'), 'hidden');
});

test('preferredTechnique: the technique with the lower count wins on every level', () => {
  for (const level of ['easy', 'medium', 'hard']) {
    assert.strictEqual(preferredTechnique(tallyOf(2, 1, 1, 0), level), 'hidden', 'N>H ' + level);
    assert.strictEqual(preferredTechnique(tallyOf(0, 0, 0, 3), level), 'naked', 'H>N ' + level);
  }
});

test('preferredTechnique: equal non-zero counts follow the level', () => {
  assert.strictEqual(preferredTechnique(tallyOf(1, 0, 0, 1), 'easy'), 'naked');
  assert.strictEqual(preferredTechnique(tallyOf(1, 0, 0, 1), 'medium'), 'hidden');
  assert.strictEqual(preferredTechnique(tallyOf(2, 1, 3, 0), 'hard'), 'hidden');
});

test('preferredTechnique: own and hint counts are added together', () => {
  assert.strictEqual(preferredTechnique(tallyOf(0, 2, 1, 0), 'easy'), 'hidden');
  assert.strictEqual(preferredTechnique(tallyOf(0, 2, 1, 0), 'medium'), 'hidden');
  assert.strictEqual(preferredTechnique(tallyOf(1, 0, 0, 2), 'medium'), 'naked');
});

test('preferredTechnique: does not change its input', () => {
  const t = tallyOf(3, 1, 2, 0), copy = JSON.stringify(t);
  preferredTechnique(t, 'easy');
  assert.strictEqual(JSON.stringify(t), copy);
});

// Independent oracle (no use of the code under test): candidates by brute force.
const peersHold = (g, r, c, d) => {
  for (let i = 0; i < 9; i++) if (g[r][i] === d || g[i][c] === d) return true;
  const br = 3 * Math.floor(r / 3), bc = 3 * Math.floor(c / 3);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (g[br + i][bc + j] === d) return true;
  return false;
};
const candidates = (g, r, c) => {
  const out = [];
  if (g[r][c]) return out;
  for (let d = 1; d <= 9; d++) if (!peersHold(g, r, c, d)) out.push(d);
  return out;
};
const unitCells = (kind, r, c) => {
  const out = [];
  for (let i = 0; i < 9; i++) {
    if (kind === 'row') out.push([r, i]);
    else if (kind === 'column') out.push([i, c]);
    else out.push([3 * Math.floor(r / 3) + Math.floor(i / 3), 3 * Math.floor(c / 3) + (i % 3)]);
  }
  return out;
};
// First hidden single in reading order; unit order box, row, column; digits 1-9.
// pure = skip cells with exactly one candidate.
const oracleHidden = (g, pure) => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cand = candidates(g, r, c);
      if (!cand.length || (pure && cand.length === 1)) continue;
      for (const unit of ['box', 'row', 'column']) {
        for (let d = 1; d <= 9; d++) {
          if (!cand.includes(d)) continue;
          const spots = unitCells(unit, r, c).filter(([a, b]) => candidates(g, a, b).includes(d));
          if (spots.length === 1) return { r, c, digit: d, unit };
        }
      }
    }
  }
  return null;
};

// Walk seeded Easy and Medium puzzles, following the Hint with the preferred technique
// (as the page would); where Hint has nothing, fill the first empty cell from the solution.
const walkPositions = (() => {
  const cache = [];
  return () => {
    if (cache.length) return cache;
    let seed = 3000;
    for (const level of ['easy', 'medium']) {
      for (let i = 0; i < 120; i++) {
        const p = generatePuzzle(level, { rng: seededRng(seed++) });
        const g = p.puzzle.map((row) => row.slice());
        const tally = emptyTally();
        for (let guard = 0; guard < 81; guard++) {
          cache.push({ level, grid: g.map((row) => row.slice()) });
          const h = hintFor(g, 1, preferredTechnique(tally, level));
          let r, c, d;
          if (h.kind === 'nudge') { r = h.r; c = h.c; d = h.digit; tally[h.technique].hint++; }
          else {
            const e = [].concat(...g.map((row, rr) => row.map((v, cc) => [rr, cc, v]))).find((x) => !x[2]);
            if (!e) break;
            [r, c] = e; d = p.solution[r][c];
          }
          g[r][c] = d;
        }
      }
    }
    return cache;
  };
})();

test('walk covers at least 200 generated Easy and Medium puzzles with varied positions', () => {
  const pos = walkPositions();
  assert.ok(pos.length > 5000);
  assert.ok(pos.some((x) => x.level === 'easy') && pos.some((x) => x.level === 'medium'));
});

test('hintFor without prefer, or with naked, equals the frozen pre-change hintFor (steps 1 and 2)', () => {
  for (const { grid } of walkPositions()) {
    for (const step of [1, 2]) {
      const want = frozen.hintFor(grid, step);
      assert.deepStrictEqual(hintFor(grid, step), want);
      assert.deepStrictEqual(hintFor(grid, step, 'naked'), want);
    }
  }
});

test('hintFor with hidden: first pure hidden single in reading order, else the unchanged result', () => {
  let pure = 0, fallback = 0, nakedAlsoExisted = 0;
  for (const { grid } of walkPositions()) {
    const want = oracleHidden(grid, true);
    for (const step of [1, 2]) {
      const got = hintFor(grid, step, 'hidden');
      if (want) {
        assert.strictEqual(got.technique, 'hidden');
        assert.strictEqual(got.kind, step === 2 ? 'explain' : 'nudge');
        assert.deepStrictEqual({ r: got.r, c: got.c, digit: got.digit, unit: got.unit }, want);
        assert.notStrictEqual(candidates(grid, got.r, got.c).length, 1, 'not a naked single');
      } else {
        assert.deepStrictEqual(got, frozen.hintFor(grid, step));
      }
    }
    if (want) { pure++; if (frozen.hintFor(grid, 1).technique === 'naked') nakedAlsoExisted++; } else fallback++;
  }
  assert.ok(pure > 500 && fallback > 50 && nakedAlsoExisted > 200, [pure, fallback, nakedAlsoExisted].join());
});

test('hintFor with hidden: step 2 explains the same cell as step 1, and a hidden hint uses the existing texts', () => {
  for (const { grid } of walkPositions()) {
    for (const prefer of [undefined, 'naked', 'hidden']) {
      const a = hintFor(grid, 1, prefer), b = hintFor(grid, 2, prefer);
      if (a.kind !== 'nudge') { assert.strictEqual(a.kind, b.kind); continue; }
      assert.deepStrictEqual([b.r, b.c, b.digit, b.technique, b.unit], [a.r, a.c, a.digit, a.technique, a.unit]);
    }
  }
  // Same texts as the frozen code for the same hidden single: H_BOX-like grid where only hidden singles exist.
  for (const { grid } of walkPositions().slice(0, 4000)) {
    const f = frozen.hintFor(grid, 1);
    const h = hintFor(grid, 1, 'hidden');
    if (h.technique === 'hidden' && f.technique === 'hidden') assert.deepStrictEqual(h, f);
  }
});

test('hintFor with hidden: conflicts, full grid and no single are the same for every prefer', () => {
  const conflict = PUZZLE.map((r) => r.slice()); conflict[0][2] = 5;
  const full = clone();
  for (const prefer of [undefined, 'naked', 'hidden']) {
    assert.deepStrictEqual(hintFor(conflict, 1, prefer), frozen.hintFor(conflict, 1));
    assert.strictEqual(hintFor(conflict, 1, prefer).kind, 'conflict');
    assert.deepStrictEqual(hintFor(full, 1, prefer), frozen.hintFor(full, 1));
    assert.strictEqual(hintFor(full, 1, prefer).kind, 'full');
    const empty = Array.from({ length: 9 }, () => Array(9).fill(0));
    assert.deepStrictEqual(hintFor(empty, 2, prefer), frozen.hintFor(empty, 2));
    assert.strictEqual(hintFor(empty, 2, prefer).kind, 'none');
  }
});

test('hintFor with hidden falls back to the naked single when the only hidden singles are naked singles', () => {
  // Cell (0,8) is the only gap: it is a naked single and also a hidden single.
  const g = clone(); g[0][8] = 0;
  assert.deepStrictEqual(findHiddenSingle(g, { notNaked: true }), null);
  assert.ok(findHiddenSingle(g));
  const h = hintFor(g, 1, 'hidden');
  assert.strictEqual(h.technique, 'naked');
  assert.deepStrictEqual(h, frozen.hintFor(g, 1));
});

test('findHiddenSingle: without options unchanged; notNaked matches the oracle and never returns a naked single', () => {
  let skipped = 0;
  for (const { grid } of walkPositions()) {
    const copy = JSON.stringify(grid);
    const plain = findHiddenSingle(grid);
    assert.deepStrictEqual(plain, frozen.findHiddenSingle(grid));
    assert.deepStrictEqual(findHiddenSingle(grid, {}), plain);
    assert.deepStrictEqual(findHiddenSingle(grid, { notNaked: false }), plain);
    const pure = findHiddenSingle(grid, { notNaked: true });
    assert.deepStrictEqual(pure, oracleHidden(grid, true));
    if (pure) assert.notStrictEqual(candidates(grid, pure.r, pure.c).length, 1);
    if (plain && (!pure || pure.r !== plain.r || pure.c !== plain.c)) skipped++;
    assert.strictEqual(JSON.stringify(grid), copy, 'input not mutated');
  }
  assert.ok(skipped > 100, 'the option really skips naked-single cells: ' + skipped);
});

test('hintFor does not mutate its input for any prefer', () => {
  const g = PUZZLE.map((r) => r.slice()), copy = JSON.stringify(g);
  for (const prefer of [undefined, 'naked', 'hidden']) for (const step of [1, 2]) hintFor(g, step, prefer);
  assert.strictEqual(JSON.stringify(g), copy);
});

// ---- Issue 31: an entry that is not counted says so ----

test('creditEntry (a): not a single, text byte for byte, nothing counted', () => {
  const res = creditEntry(T0, {}, null, H_BOX, 4, 5, '4'); // 4 fits the cell but is no single
  assert.strictEqual(res.text, 'Entered: row 5, column 6 is 4. It was not a naked or hidden single at this point, so it is not counted.');
  assert.strictEqual(res.tally, T0);
  assert.deepStrictEqual(res.credited, {});
  assert.strictEqual(creditEntry(T0, {}, null, H_BOX, 4, 5, '6').text, NOT_SINGLE(5, 6, 6));
  assert.strictEqual(creditEntry(T0, {}, null, H_BOX, 4, 5, '4').text.indexOf('Entered: row 5, column 6 is 4. '), 0);
});

test('creditEntry (a): a digit already in the row, column or box; digit 8, row and column 9', () => {
  const g = clone(); g[8][8] = 0; // 8 is in row 9, so this entry clashes
  const res = creditEntry(T0, {}, null, g, 8, 8, '8');
  assert.strictEqual(res.text, 'Entered: row 9, column 9 is 8. It was not a naked or hidden single at this point, so it is not counted.');
  assert.deepStrictEqual(res.tally, emptyTally());
  assert.deepStrictEqual(res.credited, {});
  // The clash is not revealed: the same text as any other non-single, and no grid had a conflict before.
  assert.strictEqual(findConflicts(g).length, 0);
  for (const d of [1, 2, 3, 4, 5, 6, 7]) assert.strictEqual(creditEntry(T0, {}, null, g, 8, 8, String(d)).text, NOT_SINGLE(9, 9, d));
  assert.strictEqual(creditEntry(T0, {}, null, g, 8, 8, '9').text.indexOf('Well spotted!'), 0); // the true digit is a naked single
});

test('creditEntry (b): the grid before the entry already breaks the rules', () => {
  const g = clone(); g[8][8] = 0;
  g[0][0] = g[0][1]; // a clash elsewhere
  assert.ok(findConflicts(g).length > 0);
  // 9 would be a naked single without the clash
  const res = creditEntry(T0, {}, null, g, 8, 8, '9');
  assert.strictEqual(res.text, 'Entered: row 9, column 9 is 9. Some numbers break the rules, so it is not counted. Click Verify to see which.');
  assert.strictEqual(res.tally, T0);
  assert.deepStrictEqual(res.credited, {});
  assert.strictEqual(creditEntry(T0, {}, null, g, 8, 8, '8').text, BROKEN(9, 9, 8));
  assert.strictEqual(creditEntry(T0, {}, null, H_BOX, 4, 5, '5').text.indexOf('Well spotted!'), 0); // control: no clash, rewarded
  // the hint's digit in the hinted cell is still "Well done!" (never (a) or (b))
  const clean = clone(); clean[4][4] = 0;
  const hint = hintFor(clean, 1);
  assert.strictEqual(creditEntry(T0, {}, hint, clean, hint.r, hint.c, String(hint.digit)).text.indexOf('Well done!'), 0);
});

test('creditEntry (a)/(b): inputs are not mutated; an entry on a filled cell or an empty value is still not judged', () => {
  const g = clone(); g[8][8] = 0; g[0][0] = g[0][1];
  const tally = { naked: { own: 1, hint: 2 }, hidden: { own: 0, hint: 1 } }, credited = { 3: true };
  const snap = JSON.stringify([g, tally, credited]);
  const b = creditEntry(tally, credited, null, g, 8, 8, '9');
  assert.strictEqual(JSON.stringify([g, tally, credited]), snap);
  assert.deepStrictEqual(b.tally, tally);
  assert.deepStrictEqual(b.credited, credited);
  const a = creditEntry(tally, credited, null, H_BOX, 4, 5, '4');
  assert.deepStrictEqual(a.tally, tally);
  assert.deepStrictEqual(a.credited, credited);
  assert.strictEqual(creditEntry(tally, credited, null, g, 8, 8, '').text, '');
  assert.strictEqual(creditEntry(tally, credited, null, g, 0, 0, '3').text, '');
});

test('creditEntry: a credited cell re-entered with a non-single shows (a), counts unchanged (rule 7)', () => {
  const first = creditEntry(T0, {}, null, H_BOX, 4, 5, '5');
  const again = creditEntry(first.tally, first.credited, null, H_BOX, 4, 5, '4');
  assert.strictEqual(again.text, NOT_SINGLE(5, 6, 4));
  assert.deepStrictEqual(again.tally, first.tally);
  assert.deepStrictEqual(again.credited, first.credited);
  // a different digit in the hinted cell, or any digit in another cell while a hint shows
  const hint = hintFor(H_BOX, 1);
  assert.strictEqual(creditEntry(T0, {}, hint, H_BOX, 4, 5, '6').text, NOT_SINGLE(5, 6, 6));
  assert.strictEqual(creditEntry(T0, {}, hint, H_BOX, 4, 5, '1').text, NOT_SINGLE(5, 6, 1)); 
});

// E2: walk generated puzzles against the frozen pre-#31 creditEntry (frozen-sudoku-e81999c.js; its
// creditEntry is byte-identical to main's before this issue).
test('creditEntry vs the frozen creditEntry over 220 generated puzzles (E2)', () => {
  // independent rule check, written without classifyEntry or findConflicts
  const clashes = (g) => {
    for (let a = 0; a < 81; a++) for (let b = a + 1; b < 81; b++) {
      const ra = Math.floor(a / 9), ca = a % 9, rb = Math.floor(b / 9), cb = b % 9;
      if (!g[ra][ca] || g[ra][ca] !== g[rb][cb]) continue;
      if (ra === rb || ca === cb || (Math.floor(ra / 3) === Math.floor(rb / 3) && Math.floor(ca / 3) === Math.floor(cb / 3))) return true;
    }
    return false;
  };
  const counts = { same: 0, a: 0, b: 0, skipped: 0, puzzles: 0 };
  for (const level of ['easy', 'medium']) {
    for (let seed = 1; seed <= 110; seed++) {
      const { puzzle, solution } = generatePuzzle(level, { rng: seededRng(seed * 7 + (level === 'easy' ? 1 : 2)), maxMs: 400 });
      counts.puzzles++;
      const rng = seededRng(seed);
      const g = puzzle.map((r) => r.slice());
      let tN = emptyTally(), crN = {}, tF = emptyTally(), crF = {};
      const cells = [];
      for (let p = 0; p < 81; p++) if (!g[Math.floor(p / 9)][p % 9]) cells.push(p);
      for (let step = 0; step < 90 && cells.length; step++) {
        const p = cells[Math.floor(rng() * cells.length)], r = Math.floor(p / 9), c = p % 9;
        const kind = rng();
        // mix: the solution digit, a random (often wrong) digit, and now and then a clear / bad value
        const value = kind < 0.45 ? String(solution[r][c]) : kind < 0.9 ? String(1 + Math.floor(rng() * 9)) : ['', '0', 'x', '12'][Math.floor(rng() * 4)];
        const h = rng() < 0.4 ? hintFor(g, 1 + Math.floor(rng() * 2)) : null;
        const hint = h && h.kind !== 'conflict' && h.kind !== 'full' && h.kind !== 'none' ? h : null;
        const before = JSON.stringify([g, tN, crN]);
        const want = frozen.creditEntry(tF, crF, hint, g, r, c, value);
        const got = creditEntry(tN, crN, hint, g, r, c, value);
        assert.strictEqual(JSON.stringify([g, tN, crN]), before, 'inputs not mutated');
        assert.deepStrictEqual(got.tally, want.tally);
        assert.deepStrictEqual(got.credited, want.credited);
        if (want.text !== '') { assert.strictEqual(got.text, want.text); counts.same++; }
        else if (!/^[1-9]$/.test(value)) { assert.strictEqual(got.text, ''); counts.skipped++; }
        else if (clashes(g)) { assert.strictEqual(got.text, BROKEN(r + 1, c + 1, value)); counts.b++; }
        else { assert.strictEqual(got.text, NOT_SINGLE(r + 1, c + 1, value)); counts.a++; }
        tN = got.tally; crN = got.credited; tF = want.tally; crF = want.credited;
        // enter the value like the page does (judged entries are digits into empty cells)
        // (a wrong digit is mostly not kept, so most of the walk stays free of clashes; sometimes it is, to reach (b))
        if (/^[1-9]$/.test(value) && (+value === solution[r][c] || rng() < 0.08)) { g[r][c] = +value; cells.splice(cells.indexOf(p), 1); }
        // and now and then clear it again so the credited-cell path is exercised
        if (g[r][c] && rng() < 0.15) { g[r][c] = 0; cells.push(p); }
      }
    }
  }
  assert.ok(counts.puzzles >= 200);
  assert.ok(counts.same > 300 && counts.a > 500 && counts.b > 100 && counts.skipped > 50, JSON.stringify(counts));
});
