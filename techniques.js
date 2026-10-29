// Techniques: finding naked and hidden singles, pointing and claiming steps.
import { UNIT_NAMES, UNITS, CELL_UNITS, toFlat, usedMask, bitCount, spotsFor } from './board.js';

// ---- Hints: naked and hidden singles ----

// First empty cell (reading order) whose row, column and box already hold 8
// different digits, so exactly one digit fits. Returns { r, c, digit, seen }
// (0-based r/c, seen = those 8 digits ascending) or null.
function findNakedSingle(grid) {
  var cells = toFlat(grid);
  for (var p = 0; p < 81; p++) {
    if (cells[p]) continue;
    var used = usedMask(cells, p);
    var seen = [];
    var digit = 0;
    for (var d = 1; d <= 9; d++) if (used & (1 << d)) seen.push(d); else digit = d;
    if (seen.length === 8) return { r: Math.floor(p / 9), c: p % 9, digit: digit, seen: seen };
  }
  return null;
}

// The first empty cell (reading order) that is the only place for some digit
// in one of its units. Units are tried box, row, column; digits ascending.
// Returns { r, c, digit, unit } (0-based r/c, unit 'box' | 'row' | 'column') or null.
// options.notNaked: true skips cells that are also naked singles.
function findHiddenSingle(grid, options) {
  var notNaked = !!(options && options.notNaked);
  var cells = toFlat(grid), order = [2, 0, 1]; // kinds: box, row, column
  for (var p = 0; p < 81; p++) {
    if (cells[p]) continue;
    var used = usedMask(cells, p);
    if (notNaked && bitCount(used >> 1) === 8) continue;
    for (var k = 0; k < 3; k++) {
      var unit = UNITS[CELL_UNITS[p][order[k]]];
      for (var d = 1; d <= 9; d++) {
        // d must be absent from p's peers (so from this unit) and p its only spot.
        if (used & (1 << d)) continue;
        if (spotsFor(cells, unit, d).length === 1) {
          return { r: Math.floor(p / 9), c: p % 9, digit: d, unit: UNIT_NAMES[order[k]] };
        }
      }
    }
  }
  return null;
}

// Pointing: in a box, digit D fits in two or more empty cells, all on one line (row or
// column). D then cannot go in the rest of that line (the "removed" cells, at least one).
// Boxes in reading order, digits 1-9; the first step that makes a cell a single wins, and
// the target is the first such cell in reading order. Naked form: a removed cell where only
// D and X fitted, so it is X. Hidden form: a box, row or column (tried in that order)
// without D where D now fits in one cell, so it is D. Returns { box, line: 'row' | 'column',
// index, pointDigit, confined, removed (flat indices of the cells where the digit fitted in the box
// and in the line outside it), form: 'naked' | 'hidden', r, c, digit, unit (hidden only) }, all numbers
// 0-based, or null. Grid-based, notes ignored. options.useful: true skips targets that are already a naked
// or hidden single before the step (a step with no other target is passed over).
function findPointing(grid, options) {
  return firstTarget(toFlat(grid), pointingSteps, !!(options && options.useful), 0);
}

// The first step of `steps` (pointingSteps or claimingSteps) that makes a cell a single, with the first such cell in reading
// order (see findPointing); skip = the number of unit kinds singleAfterStep leaves out (claiming never has a box-form target).
function firstTarget(cells, steps, useful, skip) {
  var hit = null;
  steps(cells, function (step) {
    for (var p = 0; p < 81 && !hit; p++) {
      if (useful && isSingle(cells, p)) continue;
      var res = singleAfterStep(cells, p, step.removed, step.pointDigit, skip);
      if (res) {
        hit = res; hit.r = Math.floor(p / 9); hit.c = p % 9;
        hit.box = step.box; hit.line = step.line; hit.index = step.index; hit.pointDigit = step.pointDigit;
        hit.confined = step.confined; hit.removed = step.removed;
      }
    }
    return hit;
  });
  return hit;
}

// Claiming (box-line reduction, the mirror of pointing): in a row or column (rows 1-9, then columns 1-9), digit D fits in
// two or more cells, all inside one box B. D then cannot go in the rest of B (the "removed" cells, at least one). Digits 1-9
// within a line; the first step that makes a cell a single wins, the target being the first such cell in reading order. Naked
// form as pointing; hidden form: a row or column (row first) without D where D now fits in one cell (never a box).
// Same result as findPointing: box = B, line / index = the row or column, confined = the line cells where D fits, removed = the
// box cells outside the line that lose D. Grid-based, notes ignored. options.useful as in findPointing.
function findClaiming(grid, options) {
  return firstTarget(toFlat(grid), claimingSteps, !!(options && options.useful), 1);
}

// Calls fn({ box, line, index, pointDigit, confined, removed }) for each claiming step (see findClaiming) until fn returns something truthy.
function claimingSteps(cells, fn) {
  for (var k = 0; k < 18; k++) {
    var row = k < 9, index = k % 9;
    for (var d = 1; d <= 9; d++) {
      var spots = spotsFor(cells, UNITS[index * 3 + (row ? 0 : 1)], d);
      if (spots.length < 2) continue;
      var box = Math.floor(spots[0] / 27) * 3 + Math.floor(spots[0] % 9 / 3);
      if (!spots.every(function (q) { return Math.floor(q / 27) * 3 + Math.floor(q % 9 / 3) === box; })) continue;
      var removed = spotsFor(cells, UNITS[box * 3 + 2], d).filter(function (q) { return spots.indexOf(q) < 0; });
      if (removed.length && fn({ box: box, line: row ? 'row' : 'column', index: index, pointDigit: d, confined: spots, removed: removed })) return;
    }
  }
}

// Calls fn({ box, line, index, pointDigit, confined, removed }) for each pointing step (see findPointing:
// boxes in reading order, digits 1-9; confined = the box cells where the digit fits; removed = the cells of the line outside the box that lose
// the digit) until fn returns something truthy.
function pointingSteps(cells, fn) {
  for (var b = 0; b < 9; b++) {
    for (var d = 1; d <= 9; d++) {
      var spots = spotsFor(cells, UNITS[b * 3 + 2], d);
      if (spots.length < 2) continue;
      var vertical = spots.every(function (q) { return q % 9 === spots[0] % 9; });
      if (!vertical && !spots.every(function (q) { return Math.floor(q / 9) === Math.floor(spots[0] / 9); })) continue;
      var index = vertical ? spots[0] % 9 : Math.floor(spots[0] / 9);
      var removed = spotsFor(cells, UNITS[index * 3 + (vertical ? 1 : 0)], d).filter(function (q) { return spots.indexOf(q) < 0; });
      if (removed.length && fn({ box: b, line: vertical ? 'column' : 'row', index: index, pointDigit: d, confined: spots, removed: removed })) return;
    }
  }
}

// Is the empty cell p a naked or hidden single (of any digit) as the grid stands?
function isSingle(cells, p) {
  if (cells[p]) return false;
  var used = usedMask(cells, p);
  if (bitCount(used >> 1) === 8) return true;
  for (var d = 1; d <= 9; d++) {
    if (used & (1 << d)) continue;
    for (var k = 0; k < 3; k++) if (spotsFor(cells, UNITS[CELL_UNITS[p][k]], d).length === 1) return true;
  }
  return false;
}

// Is the empty cell p a single once digit d is removed from the cells `removed` (see
// findPointing; skip: see firstTarget)? { digit, form: 'naked' | 'hidden', unit (hidden only) } or null.
function singleAfterStep(cells, p, removed, d, skip) {
  if (cells[p]) return null;
  var used = usedMask(cells, p);
  if (removed.indexOf(p) >= 0) {
    if (bitCount(used & ~1) !== 7) return null;
    for (var x = 1; x <= 9; x++) if (x !== d && !(used & (1 << x))) return { digit: x, form: 'naked' };
  } else if (!(used & (1 << d))) {
    for (var k = skip || 0; k < 3; k++) { // kinds: box, row, column (skip = kinds left out from the start)
      var kind = [2, 0, 1][k];
      var left = spotsFor(cells, UNITS[CELL_UNITS[p][kind]], d).filter(function (q) { return removed.indexOf(q) < 0; });
      if (left.length === 1 && left[0] === p) return { digit: d, form: 'hidden', unit: UNIT_NAMES[kind] };
    }
  }
  return null;
}

export { findNakedSingle, findHiddenSingle, findPointing, findClaiming, claimingSteps, pointingSteps, singleAfterStep };
