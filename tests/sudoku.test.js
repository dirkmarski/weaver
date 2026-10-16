'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { SOLUTION, isValidSolution } = require('../sudoku.js');

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
const { PUZZLE, findConflicts, verify, sanitizeDigit } = require('../sudoku.js');
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
