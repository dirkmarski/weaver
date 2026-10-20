'use strict';
const test = require('node:test');
const assert = require('node:assert');
const {
  isValidSolution, findConflicts, verify, sanitizeDigit, applyEntry, noteDigits, buildGrid, nextCell, findNakedSingle, findHiddenSingle,
  preferredTechnique, hintFor, hintApplied, classifyEntry, emptyTally, creditEntry, completionFor, tallyLines, TECHNIQUE_DEFINITIONS, generatePuzzle,
  seededRng, findPointing, hintMarks
} = require('../sudoku.js');
const { SOLUTION, PUZZLE } = require('./fixture.js');

const clone = () => SOLUTION.map((r) => r.slice());

test('shipped solution is valid', () => assert.ok(isValidSolution(SOLUTION)));

test('rejects duplicate in a row', () => {
  // Swap two cells vertically within the same box column: every column and
  // box keeps the same digits (so stays valid); only rows 0 and 1 gain duplicates.
  const g = clone(); [g[0][0], g[1][0]] = [g[1][0], g[0][0]];
  assert.strictEqual(isValidSolution(g), false);
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

test('hintFor: no naked single, hidden single or pointing step', () => {
  // The last grid has a pointing step (top-left box, digit 1, row 1) that makes no cell a single.
  const stepOnly = grid81('000000000456000000789000000' + '0'.repeat(54));
  for (const g of [emptyGrid(), blank(...TWO_CANDIDATES), stepOnly]) {
    const h = hintFor(g, 1);
    assert.strictEqual(h.kind, 'none');
    assert.strictEqual(h.text, 'No naked single, hidden single or pointing step right now. At this point the puzzle needs another technique.');
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
  assert.strictEqual(hintFor(H_ROW, 2).text, 'Hidden single: row 4, column 7 must be 6, because every other empty cell in its row '
    + 'already has a 6 in its column or box.');
  assert.strictEqual(hintFor(H_COL, 2).text, 'Hidden single: row 1, column 6 must be 4, because every other empty cell in its column '
    + 'already has a 4 in its row or box.');
});

test('hintFor: hidden single explain text uses "an" before 8 and "a" before 7 and 9', () => {
  const relabel = (d) => H_BOX.map((row) => row.map((v) => (v === 5 ? d : v === d ? 5 : v)));
  const text = (d, a) => 'Hidden single: row 5, column 6 must be ' + d + ', because every other empty cell in its box '
    + 'already has ' + a + ' ' + d + ' in its row or column.';
  assert.strictEqual(hintFor(relabel(8), 2).text, text(8, 'an'));
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
  assert.deepStrictEqual(classifyEntry(g, 2, 3, d), { technique: 'naked' });
  assert.strictEqual(classifyEntry(g, 2, 3, d === 9 ? 1 : d + 1), null);
});

test('classifyEntry: unit order box, then row, then column', () => {
  // (2,3) with 2: the only spot in its box, its row and its column -> box
  assert.strictEqual(findNakedSingle(H_ALL), null);
  assert.deepStrictEqual(classifyEntry(H_ALL, 2, 3, 2), { technique: 'hidden', unit: 'box' });
  // (0,4) with 7: the only spot in its row and its column, not in its box -> row
  assert.deepStrictEqual(classifyEntry(H_ROWCOL, 0, 4, 7), { technique: 'hidden', unit: 'row' });
  // (0,5) with 4: only the column
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
const NOT_SINGLE = (r, c, d) => 'Entered: row ' + r + ', column ' + c + ' is ' + d
  + '. It was not a naked or hidden single at this point, so it is not counted.';
const BROKEN = (r, c, d) => 'Entered: row ' + r + ', column ' + c + ' is ' + d
  + '. Some numbers break the rules, so it is not counted. Click Verify to see which.';

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
  for (const [r, c] of [[0, 0], [4, 4], [8, 8]]) {
    const g = clone();
    g[r][c] = 0;
    assert.strictEqual(completionFor(g, t), null, 'empty at ' + r + ',' + c);
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

// Position with a naked single and hidden singles that are also naked singles (found once from seed 1, then fixed):
// the first hidden single (0,1) is also a naked single; the first pure hidden single is (0,7).
const H_SKIP = grid81('804700100962081057073005800300002010000000000000000780000120500080579031005000602');
const HIDDEN = (g) => ({ technique: 'hidden', digit: g.digit, r: g.r, c: g.c, unit: g.unit });

test('hintFor with hidden: the first pure hidden single, at step 1 and step 2', () => {
  const nudge = hintFor(H_NAKED_FIRST, 1, 'hidden'), explain = hintFor(H_NAKED_FIRST, 2, 'hidden');
  assert.strictEqual(nudge.kind, 'nudge');
  assert.deepStrictEqual([nudge.technique, nudge.r, nudge.c, nudge.digit, nudge.unit], ['hidden', 0, 1, 5, 'box']);
  assert.strictEqual(explain.kind, 'explain');
  assert.deepStrictEqual(HIDDEN(explain), HIDDEN(nudge)); // step 2 explains the same cell as step 1
  assert.match(nudge.text, /is a hidden single: in its box/);
  assert.match(explain.text, /^Hidden single: row 1, column 2 must be 5/);
});

test('hintFor with hidden: a hidden single that is also a naked single is skipped for a later pure one', () => {
  assert.deepStrictEqual(findHiddenSingle(H_SKIP), { r: 0, c: 1, digit: 5, unit: 'box' });
  assert.strictEqual(hintFor(H_SKIP, 1).technique, 'naked'); // without prefer: the naked single
  const h = hintFor(H_SKIP, 1, 'hidden');
  assert.deepStrictEqual([h.technique, h.r, h.c, h.digit, h.unit], ['hidden', 0, 7, 2, 'row']);
  assert.deepStrictEqual(HIDDEN(hintFor(H_SKIP, 2, 'hidden')), HIDDEN(h));
});

test('hintFor: prefer naked, an unknown prefer and no prefer give the same result', () => {
  for (const g of [H_SKIP, H_NAKED_FIRST, H_BOX]) for (const step of [1, 2]) {
    assert.deepStrictEqual(hintFor(g, step, 'naked'), hintFor(g, step));
    assert.deepStrictEqual(hintFor(g, step, undefined), hintFor(g, step));
  }
});

test('hintFor with hidden falls back to the naked single when the only hidden singles are naked singles', () => {
  const g = clone(); g[0][8] = 0; // the only gap: a naked single and also a hidden single
  assert.ok(findHiddenSingle(g));
  const h = hintFor(g, 1, 'hidden');
  assert.strictEqual(h.technique, 'naked');
  assert.deepStrictEqual([h.kind, h.r, h.c, h.digit], ['nudge', 0, 8, SOLUTION[0][8]]);
  assert.deepStrictEqual(hintFor(g, 2, 'hidden'), hintFor(g, 2));
});

test('hintFor with hidden: conflict, full grid and no single are the same for every prefer', () => {
  const conflict = PUZZLE.map((r) => r.slice()); conflict[0][2] = 5;
  for (const prefer of [undefined, 'naked', 'hidden']) {
    for (const [g, step, kind] of [[conflict, 1, 'conflict'], [clone(), 1, 'full'], [emptyGrid(), 2, 'none']]) {
      assert.strictEqual(hintFor(g, step, prefer).kind, kind, kind + ' ' + prefer);
      assert.deepStrictEqual(hintFor(g, step, prefer), hintFor(g, step));
    }
  }
});

test('findHiddenSingle notNaked: skips cells that are naked singles; options {} or false change nothing', () => {
  const pure = findHiddenSingle(H_SKIP, { notNaked: true });
  assert.deepStrictEqual(pure, { r: 0, c: 7, digit: 2, unit: 'row' });
  assert.notDeepStrictEqual(pure, findHiddenSingle(H_SKIP));
  assert.deepStrictEqual(findHiddenSingle(H_SKIP, {}), findHiddenSingle(H_SKIP));
  assert.deepStrictEqual(findHiddenSingle(H_SKIP, { notNaked: false }), findHiddenSingle(H_SKIP));
  assert.deepStrictEqual(findHiddenSingle(H_BOX, { notNaked: true }), findHiddenSingle(H_BOX)); // no naked cell: same
  const g = clone(); g[0][8] = 0;
  assert.strictEqual(findHiddenSingle(g, { notNaked: true }), null); // only a naked single left
  assert.strictEqual(findHiddenSingle(emptyGrid(), { notNaked: true }), null);
});

test('hintFor and findHiddenSingle do not mutate their input, for any prefer or option', () => {
  const g = H_SKIP.map((r) => r.slice()), copy = JSON.stringify(g);
  for (const prefer of [undefined, 'naked', 'hidden']) for (const step of [1, 2]) hintFor(g, step, prefer);
  findHiddenSingle(g, { notNaked: true });
  assert.strictEqual(JSON.stringify(g), copy);
});

// ---- Issue 31: an entry that is not counted says so ----

test('creditEntry (a): not a single, text byte for byte, nothing counted', () => {
  const res = creditEntry(T0, {}, null, H_BOX, 4, 5, '4'); // 4 fits the cell but is no single
  assert.strictEqual(res.text, 'Entered: row 5, column 6 is 4. It was not a naked or hidden single at this point, so it is not counted.');
  assert.strictEqual(res.tally, T0);
  assert.deepStrictEqual(res.credited, {});
  assert.strictEqual(creditEntry(T0, {}, null, H_BOX, 4, 5, '6').text, NOT_SINGLE(5, 6, 6));
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

// ---- Issue 36: Hint teaches pointing ----

// Two Hard walls (generatePuzzle('hard', { rng: seededRng(seed) }) filled with singles until none is left), as literals.
const rows9 = (...rows) => rows.map((s) => [...s].map(Number));
const WALL_ROW = rows9('000100402', '840002001', '521040030', '000469205', '965020014', '402051000', '000290040', '204080069', '093014528'); // seed 3
const WALL_COL = rows9('425386179', '390217004', '170594230', '030941607', '917600480', '064000913', '781400000', '000020700', '000000000'); // seed 8
const WALL_BOX = rows9('090600030', '002005000', '050008091', '000003080', '070500300', '230007400', '689174003', '703000000', '000300078'); // seed 139
const BOX_INTRO = 'In the box of rows 1-3 and columns 1-3, the digit ';

test('pointing, row line, naked form: finder, nudge, explain on the same cell, no mutation', () => {
  const snap = JSON.stringify(WALL_ROW);
  assert.deepStrictEqual(findPointing(WALL_ROW), { r: 0, c: 4, digit: 7, form: 'naked', box: 0, line: 'row', index: 0, pointDigit: 3 });
  const one = hintFor(WALL_ROW, 1), two = hintFor(WALL_ROW, 2);
  assert.strictEqual(one.kind, 'nudge');
  assert.strictEqual(two.kind, 'explain');
  assert.strictEqual(one.technique, 'pointing');
  assert.strictEqual(one.text, 'Hint: try pointing. ' + BOX_INTRO + '3 fits only in row 1, so it cannot go anywhere else in row 1. '
    + 'Use that to find the digit for row 1, column 5. Click Hint again to see why.');
  assert.strictEqual(two.text, 'Pointing: in the box of rows 1-3 and columns 1-3, the digit 3 fits only in row 1, so 3 cannot go in row 1 outside that box. '
    + 'Row 1, column 5 could only take 3 or 7, so it must be 7.');
  assert.deepStrictEqual([two.r, two.c, two.digit, two.form], [one.r, one.c, one.digit, one.form]);
  assert.strictEqual(JSON.stringify(WALL_ROW), snap);
});

test('pointing, column line, hidden form: the earlier digit 6 step in the same box makes no single and is skipped', () => {
  // Later steps (box 4 digit 5, box 5 digit 8, in reading order) also make singles, but the first box and digit in order wins.
  assert.deepStrictEqual(findPointing(WALL_COL),
    { r: 3, c: 0, digit: 8, form: 'hidden', unit: 'row', box: 0, line: 'column', index: 2, pointDigit: 8 });
  assert.strictEqual(hintFor(WALL_COL, 1).text, 'Hint: try pointing. ' + BOX_INTRO + '8 fits only in column 3, so it cannot go anywhere else in column 3. '
    + 'Use that to find the digit for row 4, column 1. Click Hint again to see why.');
  const two = hintFor(WALL_COL, 2);
  assert.strictEqual(two.text, 'Pointing: in the box of rows 1-3 and columns 1-3, the digit 8 fits only in column 3, '
    + 'so 8 cannot go in column 3 outside that box. ' + 'That leaves row 4, column 1 as the only cell in its row where 8 fits, so it must be 8.');
  assert.deepStrictEqual([two.r, two.c, two.digit, two.unit], [3, 0, 8, 'row']);
});

test('pointing, hidden form: the unit is the box when box, row and column all qualify (row line, box 7)', () => {
  assert.deepStrictEqual(findPointing(WALL_BOX),
    { r: 7, c: 4, digit: 5, form: 'hidden', unit: 'box', box: 6, line: 'row', index: 8, pointDigit: 5 });
  assert.ok(hintFor(WALL_BOX, 2).text.endsWith('That leaves row 8, column 5 as the only cell in its box where 5 fits, so it must be 5.'));
});

test('pointing: singles keep priority, conflicts stay unchanged, a box with one spot is no step', () => {
  const single = WALL_ROW.map((row) => row.slice()); single[8][8] = 0; // the last single filled before the wall
  assert.notStrictEqual(hintFor(single, 1).technique, 'pointing');
  assert.strictEqual(hintFor(single, 1).kind, 'nudge');
  const broken = WALL_ROW.map((row) => row.slice()); broken[0][1] = 4;
  assert.strictEqual(hintFor(broken, 1).kind, 'conflict');
  assert.strictEqual(findPointing(blank([0, 1], [1, 5], [8, 1], [7, 0], [8, 0])), null); // 3 fits one cell of the top-left box only
});

test('pointing: the hinted entry is rewarded with no count change; another digit is "not counted"', () => {
  const hint = hintFor(WALL_ROW, 1), tally = { naked: { own: 1, hint: 0 }, hidden: { own: 0, hint: 2 } };
  const ok = creditEntry(tally, { 5: true }, hint, WALL_ROW, 0, 4, '7');
  assert.strictEqual(ok.text, 'Well done! You applied pointing: row 1, column 5 is 7.');
  assert.deepStrictEqual([ok.tally, ok.credited], [tally, { 5: true }]);
  assert.strictEqual(creditEntry(tally, {}, hint, WALL_ROW, 0, 4, '3').text, NOT_SINGLE(1, 5, 3));
  assert.strictEqual(creditEntry(tally, {}, null, WALL_ROW, 0, 4, '7').text, NOT_SINGLE(1, 5, 7)); // no hint showing: judged as today
});

test('hintMarks: tint and marked digits for pointing (box and line, pointing digit) and for singles', () => {
  const nudge = hintMarks(hintFor(WALL_ROW, 1), WALL_ROW), explain = hintMarks(hintFor(WALL_ROW, 2), WALL_ROW);
  assert.deepStrictEqual(nudge.area.slice().sort((a, b) => a - b), [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 18, 19, 20]); // box 1 and row 1, not the target
  assert.strictEqual(nudge.target, 4);
  assert.deepStrictEqual(nudge.digits, []);
  assert.deepStrictEqual(explain.digits, [25, 74]); // the two 3s, though the naked target takes 7
  const hidden = hintMarks(hintFor(WALL_COL, 2), WALL_COL);
  assert.deepStrictEqual([hidden.target, hidden.digits], [27, [4, 43, 55]]);
  const naked = hintMarks(hintFor(blank([4, 7]), 2), blank([4, 7]));
  assert.deepStrictEqual([naked.area.length, naked.digits], [20, []]); // row, column and box minus the cell; no purple for naked
  const single = hintMarks(hintFor(H_BOX, 2), H_BOX);
  assert.deepStrictEqual([single.area.length, single.target], [8, 41]);
});
