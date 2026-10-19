'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { isValidSolution, findConflicts, verify, sanitizeDigit, applyEntry, noteDigits, buildGrid, nextCell, findNakedSingle, findHiddenSingle, hintFor, hintApplied, generatePuzzle, seededRng } = require('../sudoku.js');
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
