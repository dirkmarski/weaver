import test from 'node:test';
import assert from 'node:assert';
import { PUZZLE } from './fixture.js';
import * as S from '../sudoku.js';

const LEVELS = ['easy', 'medium', 'tricky', 'tough', 'hard'];
const flat = (g) => g.flat();
const givens = (g) => flat(g).filter((v) => v).length;
const N = 10; // puzzles per level in the batch tests

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
// Hard uses seeds 1-10: under the mutant LEVELS.hard.beyond = 'singles', seeds 3 and 8 give a
// pointing-solvable puzzle, so the "hard is not solvable by pointing" test below can fail.
const SEED_BASE = { easy: 1000, medium: 2000, tricky: 3000, tough: 3000, hard: 1 };
LEVELS.forEach((l) => { batches[l] = batch(l, N, SEED_BASE[l]); });

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

test('medium is NOT solvable by naked singles alone', () => {
  for (const r of batches.medium) assert.strictEqual(S.solvableBy(r.puzzle, 'naked'), false);
});

test('tricky and tough are solvable by singles plus pointing but NOT by singles alone', () => {
  for (const r of batches.tricky.concat(batches.tough)) {
    assert.ok(S.solvableBy(r.puzzle, 'pointing'));
    assert.strictEqual(S.solvableBy(r.puzzle, 'singles'), false);
  }
});

test('hard is NOT solvable by singles plus pointing (so not by singles either)', () => {
  for (const r of batches.hard) assert.strictEqual(S.solvableBy(r.puzzle, 'pointing'), false);
});

test('tough: the same puzzle as tricky for the same seed', () => {
  const key = (r) => [r.puzzle, r.solution, r.givens];
  batches.tough.forEach((r, i) => assert.deepStrictEqual(key(r), key(batches.tricky[i])));
});

test('tricky: following Hint (Tricky preference), entering each hinted digit, solves the puzzle and never returns none', () => {
  let most = 0;
  for (const r of batches.tricky.slice(0, 3)) {
    const g = r.puzzle.map((row) => row.slice()), tally = S.emptyTally();
    let pointing = 0;
    for (let n = 0; n < 81 && g.flat().includes(0); n++) {
      const h = S.hintFor(g, 1, S.preferredTechnique(tally, 'tricky'), 'tricky');
      assert.strictEqual(h.kind, 'nudge');
      if (h.technique === 'pointing') pointing++;
      tally[h.technique].hint++;
      assert.strictEqual(h.digit, r.solution[h.r][h.c]);
      g[h.r][h.c] = h.digit;
    }
    assert.deepStrictEqual(g, r.solution);
    assert.ok(pointing > 0);
    most = Math.max(most, pointing);
  }
  assert.ok(most >= 2); // seeds 3000-3002 give 2, 4 and 4 pointing hints
});

test('normal generation is not capped', () => {
  for (const level of LEVELS) for (const r of batches[level]) assert.strictEqual(r.capped, false);
});

test('solvableBy: fixture puzzle needs only singles; an empty grid needs more', () => {
  assert.ok(S.solvableBy(PUZZLE, 'singles'));
  assert.strictEqual(S.solvableBy(PUZZLE.map((r) => r.map(() => 0)), 'singles'), false);
});

test('countSolutions: empty grid has at least 2, fixture puzzle exactly 1', () => {
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

test('time cap: maxMs 0 takes the fallback path (capped) and still returns a valid unique puzzle', () => {
  for (const level of LEVELS) {
    const r = S.generatePuzzle(level, { rng: S.seededRng(7), maxMs: 0 });
    assert.strictEqual(r.capped, true);
    assert.strictEqual(S.countSolutions(r.puzzle, 2), 1);
    r.puzzle.forEach((row, i) => row.forEach((v, j) => { if (v) assert.strictEqual(v, r.solution[i][j]); }));
  }
});
