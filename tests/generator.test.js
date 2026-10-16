'use strict';
const test = require('node:test');
const assert = require('node:assert');
const S = require('../sudoku.js');

const LEVELS = ['easy', 'medium', 'hard'];
const flat = (g) => g.flat();
const givens = (g) => flat(g).filter((v) => v).length;
const N = 20; // puzzles per level in the batch tests

function batch(level, n, seedBase) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const t0 = process.hrtime.bigint();
    const res = S.generatePuzzle(level, { rng: S.seededRng(seedBase + i) });
    res.ms = Number(process.hrtime.bigint() - t0) / 1e6;
    out.push(res);
  }
  return out;
}
const batches = {};
LEVELS.forEach((l, i) => { batches[l] = batch(l, N, 1000 * (i + 1)); });

test('generated full grid is valid, and varies with the seed', () => {
  const a = S.generateSolution(S.seededRng(1));
  const b = S.generateSolution(S.seededRng(2));
  assert.ok(S.isValidSolution(a));
  assert.ok(S.isValidSolution(b));
  assert.notDeepStrictEqual(a, b);
});

test('unknown level throws', () => assert.throws(() => S.generatePuzzle('insane')));

for (const level of LEVELS) {
  const def = S.LEVELS[level];

  test(level + ': unique solution, givens consistent with it, no conflicts', () => {
    for (const r of batches[level]) {
      assert.ok(S.isValidSolution(r.solution));
      assert.strictEqual(S.countSolutions(r.puzzle, 2), 1);
      r.puzzle.forEach((row, i) => row.forEach((v, j) => { if (v) assert.strictEqual(v, r.solution[i][j]); }));
      assert.deepStrictEqual(S.findConflicts(r.puzzle), []);
      assert.strictEqual(r.givens, givens(r.puzzle));
    }
  });

  test(level + ': givens count within band ' + def.min + '-' + def.max, () => {
    for (const r of batches[level]) {
      assert.ok(r.givens >= def.min && r.givens <= def.max, 'givens ' + r.givens);
    }
  });

  test(level + ': generation time is under 1500 ms each', () => {
    const times = batches[level].map((r) => r.ms);
    const max = Math.max(...times), avg = times.reduce((a, b) => a + b, 0) / times.length;
    console.log('# timing ' + level + ': n=' + N + ' max=' + max.toFixed(1) + ' ms avg=' + avg.toFixed(1) + ' ms');
    assert.ok(max < 1500, 'max ' + max);
  });
}

test('easy is solvable by naked singles only', () => {
  for (const r of batches.easy) assert.ok(S.solvableBy(r.puzzle, 'naked'));
});

test('medium is solvable by naked + hidden singles', () => {
  for (const r of batches.medium) assert.ok(S.solvableBy(r.puzzle, 'singles'));
});

test('solvableBy: fixture puzzle needs only singles; an empty grid needs more', () => {
  const { PUZZLE } = require('./fixture.js');
  assert.ok(S.solvableBy(PUZZLE, 'singles'));
  assert.strictEqual(S.solvableBy(PUZZLE.map((r) => r.map(() => 0)), 'singles'), false);
});

test('countSolutions: empty grid has at least 2, fixture puzzle exactly 1', () => {
  const { PUZZLE } = require('./fixture.js');
  assert.strictEqual(S.countSolutions(PUZZLE.map((r) => r.map(() => 0)), 2), 2);
  assert.strictEqual(S.countSolutions(PUZZLE, 2), 1);
});

test('same seed gives the same puzzle', () => {
  for (const level of LEVELS) {
    const a = S.generatePuzzle(level, { rng: S.seededRng(42) });
    const b = S.generatePuzzle(level, { rng: S.seededRng(42) });
    assert.deepStrictEqual(a.puzzle, b.puzzle);
    assert.deepStrictEqual(a.solution, b.solution);
  }
});

test('different seeds give different puzzles', () => {
  for (const level of LEVELS) {
    const seen = new Set(batches[level].map((r) => flat(r.puzzle).join('')));
    assert.strictEqual(seen.size, N);
  }
});

test('default RNG (Math.random) works and gives varying puzzles', () => {
  const a = S.generatePuzzle('medium'), b = S.generatePuzzle('medium');
  assert.notDeepStrictEqual(a.puzzle, b.puzzle);
});

test('time cap: tiny maxMs still returns a valid unique puzzle', () => {
  for (const level of LEVELS) {
    const r = S.generatePuzzle(level, { rng: S.seededRng(7), maxMs: 1 });
    assert.strictEqual(S.countSolutions(r.puzzle, 2), 1);
    r.puzzle.forEach((row, i) => row.forEach((v, j) => { if (v) assert.strictEqual(v, r.solution[i][j]); }));
  }
});
