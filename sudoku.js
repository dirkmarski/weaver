(function () {
  'use strict';

  // A known-valid completed sudoku (widely published example solution).
  var SOLUTION = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
  ];

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

  function render() {
    var table = document.getElementById('sudoku');
    var status = document.getElementById('status');
    var tbody = document.createElement('tbody');
    SOLUTION.forEach(function (rowVals, r) {
      var tr = document.createElement('tr');
      rowVals.forEach(function (v, c) {
        var td = document.createElement('td');
        td.textContent = v;
        td.className = 'box-' + (3 * Math.floor(r / 3) + Math.floor(c / 3));
        if (c % 3 === 0) td.classList.add('left');
        if (r % 3 === 0) td.classList.add('top');
        if (c === 8) td.classList.add('right');
        if (r === 8) td.classList.add('bottom');
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    var ok = isValidSolution(SOLUTION);
    status.textContent = ok
      ? '✓ Verified: valid sudoku solution'
      : '✗ Error: this grid is not a valid sudoku solution';
    status.className = ok ? 'ok' : 'fail';
  }

  var api = { SOLUTION: SOLUTION, isValidSolution: isValidSolution };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') {
    window.Sudoku = api;
    window.isValidSolution = isValidSolution;
    render();
  }
})();
