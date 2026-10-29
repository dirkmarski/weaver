// Board primitives: units, peers, candidate masks, cell naming.

// Where `digit` already sits among the peers of cell p (flat index): { unit: 0|1|2 (row, column, box), q }
// for the first of the cell's row, column, box that holds it in a cell other than p, q being the first
// such cell in reading order; null if none.
function firstHolder(cells, p, digit) {
  for (var k = 0; k < 3; k++) {
    var q = UNITS[CELL_UNITS[p][k]].filter(function (x) { return x !== p && cells[x] === digit; })[0];
    if (q !== undefined) return { unit: k, q: q };
  }
  return null;
}

function cellName(p) { return 'row ' + (Math.floor(p / 9) + 1) + ', column ' + (p % 9 + 1); }

// ---- Units and peers (flat cell index p = 9 * row + column) ----

var UNIT_NAMES = ['row', 'column', 'box']; // UNITS[3 * i + k] is unit i of kind UNIT_NAMES[k]
var UNITS = (function () {
  var u = [], i, j;
  for (i = 0; i < 9; i++) {
    var row = [], col = [], box = [];
    for (j = 0; j < 9; j++) {
      row.push(i * 9 + j);
      col.push(j * 9 + i);
      box.push((3 * Math.floor(i / 3) + Math.floor(j / 3)) * 9 + 3 * (i % 3) + (j % 3));
    }
    u.push(row, col, box);
  }
  return u;
})();
var CELL_UNITS = (function () { // per cell: indices of its row, column and box in UNITS
  var m = [];
  for (var p = 0; p < 81; p++) {
    var r = Math.floor(p / 9), c = p % 9;
    m.push([r * 3, c * 3 + 1, (3 * Math.floor(r / 3) + Math.floor(c / 3)) * 3 + 2]);
  }
  return m;
})();

function toFlat(grid) { return [].concat.apply([], grid); }
function toGrid(flat) {
  var g = [];
  for (var r = 0; r < 9; r++) g.push(flat.slice(r * 9, r * 9 + 9));
  return g;
}

// Bitmask of digits already used by the peers of cell p (bit d = digit d).
function usedMask(cells, p) {
  var used = 0, us = CELL_UNITS[p];
  for (var k = 0; k < 3; k++) {
    var unit = UNITS[us[k]];
    for (var i = 0; i < 9; i++) used |= 1 << cells[unit[i]];
  }
  return used;
}

function bitCount(x) { var n = 0; while (x) { x &= x - 1; n++; } return n; }

// Empty cells of `unit` (list of cell indices) that can take digit d: d is not
// in their row, column or box. Empty when d is already in the unit.
function spotsFor(cells, unit, d) {
  var spots = [];
  for (var i = 0; i < 9; i++) {
    var q = unit[i];
    if (!cells[q] && !(usedMask(cells, q) & (1 << d))) spots.push(q);
  }
  return spots;
}

export { firstHolder, cellName, UNIT_NAMES, UNITS, CELL_UNITS, toFlat, toGrid, usedMask, bitCount, spotsFor };
