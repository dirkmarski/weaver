// Validation: complete-solution check, rule conflicts, verify, grid building.

function isValidSolution(grid) {
  if (!Array.isArray(grid) || grid.length !== 9) return false;
  for (var r = 0; r < 9; r++) {
    if (!Array.isArray(grid[r]) || grid[r].length !== 9) return false;
    for (var c = 0; c < 9; c++) {
      var v = grid[r][c];
      if (!Number.isInteger(v) || v < 1 || v > 9) return false;
    }
  }
  function complete(cells) {
    var seen = {};
    for (var i = 0; i < cells.length; i++) seen[cells[i]] = true;
    return Object.keys(seen).length === 9;
  }
  for (var i = 0; i < 9; i++) {
    var row = [], col = [], box = [];
    for (var j = 0; j < 9; j++) {
      row.push(grid[i][j]);
      col.push(grid[j][i]);
      box.push(grid[3 * Math.floor(i / 3) + Math.floor(j / 3)][3 * (i % 3) + (j % 3)]);
    }
    if (!complete(row) || !complete(col) || !complete(box)) return false;
  }
  return true;
}

// Returns a list of [row, col] for every non-empty cell sharing its digit
// with another cell in the same row, column or 3x3 box. Empty = 0.
function findConflicts(grid) {
  var groups = {}; // key "type:index:digit" -> list of cells
  for (var r = 0; r < 9; r++) {
    for (var c = 0; c < 9; c++) {
      var v = grid[r][c];
      if (!v) continue;
      var box = 3 * Math.floor(r / 3) + Math.floor(c / 3);
      ['r' + r, 'c' + c, 'b' + box].forEach(function (k) {
        (groups[k + ':' + v] = groups[k + ':' + v] || []).push([r, c]);
      });
    }
  }
  var flagged = {};
  Object.keys(groups).forEach(function (k) {
    if (groups[k].length > 1) groups[k].forEach(function (p) { flagged[p[0] * 9 + p[1]] = p; });
  });
  return Object.keys(flagged).map(function (k) { return flagged[k]; })
    .sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
}

// Rules-only check; never compares against a stored solution.
function verify(grid) {
  var empty = 0;
  for (var r = 0; r < 9; r++) for (var c = 0; c < 9; c++) if (!grid[r][c]) empty++;
  var conflicts = findConflicts(grid);
  var complete = empty === 0;
  return { complete: complete, empty: empty, conflicts: conflicts, solved: complete && conflicts.length === 0 };
}

// Build the grid verify() checks: givens from puzzle, plus the entered
// value strings ('' or '1'-'9'). Notes are never part of it.
function buildGrid(puzzle, values) {
  return puzzle.map(function (row, r) {
    return row.map(function (v, c) { return v || (values[r][c] ? parseInt(values[r][c], 10) : 0); });
  });
}

export { isValidSolution, findConflicts, verify, buildGrid };
