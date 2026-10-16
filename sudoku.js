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

  // Puzzle: the givens of SOLUTION (0 = empty). 30 givens, solvable by singles.
  var PUZZLE = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ];

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

  // Normalise raw text typed/pasted into a cell: '' or a single digit '1'-'9'.
  // Anything else (letters, 0, multi-char strings) yields null (= reject).
  function sanitizeDigit(text) {
    if (text === '') return '';
    return typeof text === 'string' && /^[1-9]$/.test(text) ? text : null;
  }

  function render() {
    var table = document.getElementById('sudoku');
    var status = document.getElementById('status');
    var button = document.getElementById('verify');
    var inputs = []; // [r][c] -> input element or null for givens
    var tbody = document.createElement('tbody');

    function clearResults() {
      status.textContent = '';
      status.className = '';
      table.querySelectorAll('.conflict').forEach(function (el) {
        el.classList.remove('conflict');
        el.removeAttribute('aria-invalid');
      });
    }

    PUZZLE.forEach(function (rowVals, r) {
      var tr = document.createElement('tr');
      inputs.push([]);
      rowVals.forEach(function (v, c) {
        var td = document.createElement('td');
        td.className = 'box-' + (3 * Math.floor(r / 3) + Math.floor(c / 3));
        if (c % 3 === 0) td.classList.add('left');
        if (r % 3 === 0) td.classList.add('top');
        if (c === 8) td.classList.add('right');
        if (r === 8) td.classList.add('bottom');
        if (v) {
          td.classList.add('given');
          td.textContent = v;
          inputs[r].push(null);
        } else {
          var inp = document.createElement('input');
          inp.type = 'text';
          inp.inputMode = 'numeric';
          inp.autocomplete = 'off';
          inp.maxLength = 1;
          inp.setAttribute('aria-label', 'Row ' + (r + 1) + ', column ' + (c + 1));
          inp.addEventListener('keydown', function (e) {
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            if (e.key === 'Backspace' || e.key === 'Delete') {
              e.preventDefault();
              if (inp.value !== '') { inp.value = ''; clearResults(); }
            } else if (e.key.length === 1) { // printable character
              e.preventDefault();
              if (sanitizeDigit(e.key)) { inp.value = e.key; clearResults(); }
            }
          });
          // Fallback for paste, drop, IME: accept a single digit, else restore.
          inp.addEventListener('input', function () {
            var d = sanitizeDigit(inp.value);
            inp.value = d === null ? (inp.dataset.prev || '') : d;
            inp.dataset.prev = inp.value;
            clearResults();
          });
          td.appendChild(inp);
          inputs[r].push(inp);
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    button.addEventListener('click', function () {
      clearResults();
      var grid = PUZZLE.map(function (row, r) {
        return row.map(function (v, c) {
          return v || (inputs[r][c].value ? parseInt(inputs[r][c].value, 10) : 0);
        });
      });
      var res = verify(grid);
      res.conflicts.forEach(function (p) {
        var inp = inputs[p[0]][p[1]];
        if (inp) { inp.classList.add('conflict'); inp.setAttribute('aria-invalid', 'true'); }
      });
      if (res.solved) {
        status.textContent = 'Solved! Every row, column and box is correct.';
        status.className = 'ok';
      } else if (res.conflicts.length) {
        status.textContent = 'Mistakes found: the red numbers break the rules.';
        status.className = 'fail';
      } else {
        status.textContent = 'No mistakes so far. ' + res.empty + ' empty cell' + (res.empty === 1 ? '' : 's') + ' left.';
        status.className = 'ok';
      }
    });
  }

  var api = {
    PUZZLE: PUZZLE, SOLUTION: SOLUTION, isValidSolution: isValidSolution,
    findConflicts: findConflicts, verify: verify, sanitizeDigit: sanitizeDigit
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') {
    window.Sudoku = api;
    window.isValidSolution = isValidSolution;
    render();
  }
})();
