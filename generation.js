// Generation: levels, puzzle generators, solvability and solution counting, seeded random.
import { UNITS, toFlat, toGrid, usedMask, bitCount, spotsFor } from './board.js';
import { findPointing } from './techniques.js';

// ---- Generator -------------------------------------------------------
// Internally a grid is a flat array of 81 digits (0 = empty).

var LEVELS = {
  // technique: what removal keeps solvable; beyond: technique the puzzle must NOT be solvable by
  easy:   { min: 36, max: 40, technique: 'naked',   beyond: null },     // naked singles only
  medium: { min: 30, max: 35, technique: 'singles', beyond: 'naked' },  // needs hidden singles
  tricky: { min: 27, max: 31, technique: 'pointing', beyond: 'singles' }, // needs pointing
  tough:  { min: 27, max: 31, technique: 'pointing', beyond: 'singles' }, // as tricky; Hint practises claiming
  hard:   { min: 22, max: 29, technique: null,      beyond: 'pointing' } // unique, needs more than pointing
};
var TIME_CAP_MS = 1000; // generation never runs past this (click-to-render must stay < 2 s)

function shuffle(arr, rng) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(rng() * (i + 1));
    var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  return arr;
}

// Backtracking search (most-constrained cell first). Counts solutions up to
// `limit`. If rng is given, digits are tried in random order. If `out` is an
// array, the first solution found is copied into it.
function search(cells, limit, rng, out) {
  var count = 0;
  function go() {
    var best = -1, bestMask = 0, bestN = 10;
    for (var p = 0; p < 81; p++) {
      if (cells[p]) continue;
      var mask = ~usedMask(cells, p) & 0x3FE; // candidate digits 1-9
      var n = bitCount(mask);
      if (n < bestN) { best = p; bestMask = mask; bestN = n; if (n <= 1) break; }
    }
    if (best < 0) {
      if (count === 0 && out) for (var i = 0; i < 81; i++) out[i] = cells[i];
      count++;
      return;
    }
    var digits = [];
    for (var d = 1; d <= 9; d++) if (bestMask & (1 << d)) digits.push(d);
    if (rng) shuffle(digits, rng);
    for (var k = 0; k < digits.length && count < limit; k++) {
      cells[best] = digits[k];
      go();
    }
    cells[best] = 0;
  }
  go();
  return count;
}

// Can the puzzle be completed using only the given technique?
// 'naked': cells with a single candidate. 'singles': also digits with only
// one possible cell in a row, column or box (hidden singles). 'pointing': singles, and when
// none is left one findPointing step (the one Hint teaches), placing the single it makes.
function solvableBy(cells, technique) {
  var g = cells.slice(), progress = true, p, d;
  while (progress) {
    progress = false;
    for (p = 0; p < 81; p++) {
      if (g[p]) continue;
      var mask = ~usedMask(g, p) & 0x3FE;
      if (mask === 0) return false;
      if (bitCount(mask) === 1) { g[p] = Math.log2(mask); progress = true; }
    }
    if (technique !== 'naked') {
      for (var u = 0; u < 27; u++) {
        var unit = UNITS[u];
        for (d = 1; d <= 9; d++) {
          var spots = spotsFor(g, unit, d);
          if (spots.length === 1) { g[spots[0]] = d; progress = true; }
        }
      }
    }
    if (!progress && technique === 'pointing') {
      var step = findPointing(toGrid(g));
      if (step) { g[step.r * 9 + step.c] = step.digit; progress = true; }
    }
  }
  return g.indexOf(0) < 0;
}

function defaultRng() { return Math.random(); }

// Small seedable PRNG (mulberry32) for reproducible puzzles in tests.
function seededRng(seed) {
  var a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    var t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateSolution(rng) {
  var cells = [];
  for (var i = 0; i < 81; i++) cells.push(0);
  var out = [];
  search(cells, 1, rng || defaultRng, out);
  return toGrid(out);
}

// Generate a puzzle for 'easy' | 'medium' | 'tricky' | 'tough' | 'hard'.
// options: { rng: () => [0,1), maxMs: time cap }.
// Returns { level, puzzle, solution, givens, capped, attempts } (9x9 arrays, 0 = empty).
// The puzzle always has exactly one solution. Normally it also meets the
// level's givens band and technique; if the time cap is hit first, the best
// valid puzzle found so far is returned (it may have more givens and may not
// meet the technique rule) and result.capped is true.
function generatePuzzle(level, options) {
  var def = LEVELS[level];
  if (!def) throw new Error('Unknown difficulty: ' + level);
  options = options || {};
  var rng = options.rng || defaultRng;
  var deadline = Date.now() + (options.maxMs !== undefined ? options.maxMs : TIME_CAP_MS);
  var result = null, attempts = 0;

  while (true) {
    attempts++;
    var solution = toFlat(generateSolution(rng));
    var cells = solution.slice();
    var target = def.min + Math.floor(rng() * (def.max - def.min + 1));
    var givens = 81;
    var order = shuffle(Array.apply(null, Array(81)).map(function (_, i) { return i; }), rng);
    for (var k = 0; k < 81 && givens > target; k++) {
      if (Date.now() >= deadline) break;
      var p = order[k], keep = cells[p];
      cells[p] = 0;
      var ok = def.technique
        ? solvableBy(cells, def.technique) // implies a unique solution
        : search(cells.slice(), 2) === 1;
      if (ok) givens--; else cells[p] = keep;
    }
    var inBand = givens >= def.min && givens <= def.max;
    // Must also need a technique the level below does not offer; else retry.
    var graded = inBand && (!def.beyond || !solvableBy(cells, def.beyond));
    if (!result || givens < result.givens) {
      result = { level: level, puzzle: toGrid(cells), solution: toGrid(solution), givens: givens, capped: false };
    }
    if (graded) { result.attempts = attempts; result.puzzle = toGrid(cells); result.solution = toGrid(solution); result.givens = givens; result.capped = false; return result; }
    if (Date.now() >= deadline) { result.capped = true; result.attempts = attempts; return result; }
  }
}

function countSolutions(grid, limit) { return search(toFlat(grid), limit || 2); }
function solvableByGrid(grid, technique) { return solvableBy(toFlat(grid), technique); }

export { LEVELS, seededRng, generateSolution, generatePuzzle, countSolutions, solvableByGrid as solvableBy };
