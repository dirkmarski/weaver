(function () {
  'use strict';

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

  // Normalise raw text typed/pasted into a cell: '' or a single digit '1'-'9'.
  // Anything else (letters, 0, multi-char strings) yields null (= reject).
  function sanitizeDigit(text) {
    if (text === '') return '';
    return typeof text === 'string' && /^[1-9]$/.test(text) ? text : null;
  }

  // Build the grid verify() checks: givens from puzzle, plus the entered
  // value strings ('' or '1'-'9'). Notes are never part of it.
  function buildGrid(puzzle, values) {
    return puzzle.map(function (row, r) {
      return row.map(function (v, c) { return v || (values[r][c] ? parseInt(values[r][c], 10) : 0); });
    });
  }

  // ---- Pencil-mark notes ----
  // A cell is { value: '' | '1'-'9', notes: bitmask } where bit d is set when
  // digit d is noted (bits 1-9).

  function noteDigits(mask) {
    var out = [];
    for (var d = 1; d <= 9; d++) if (mask & (1 << d)) out.push(d);
    return out;
  }

  // Pure transition for one key press (or text entered) in a cell. `key` is a
  // digit text, 'Backspace' or 'Delete'; anything else changes nothing.
  //  - normal mode: a digit becomes the value and drops the notes; delete clears the value.
  //  - notes mode: a digit toggles a note, but only in a cell with no value;
  //    delete removes all notes of an empty cell (and clears the value otherwise).
  function applyEntry(cell, key, notesMode) {
    if (key === 'Backspace' || key === 'Delete') {
      return { value: '', notes: cell.value || !notesMode ? cell.notes : 0 };
    }
    var d = sanitizeDigit(key);
    if (!d) return cell;
    if (!notesMode) return { value: d, notes: 0 };
    return cell.value ? cell : { value: '', notes: cell.notes ^ (1 << d) };
  }

  // ---- Generator -------------------------------------------------------
  // Internally a grid is a flat array of 81 digits (0 = empty).

  var LEVELS = {
    // technique: what removal keeps solvable; beyond: technique the puzzle must NOT be solvable by
    easy:   { min: 36, max: 40, technique: 'naked',   beyond: null },     // naked singles only
    medium: { min: 30, max: 35, technique: 'singles', beyond: 'naked' },  // needs hidden singles
    hard:   { min: 22, max: 29, technique: null,      beyond: 'singles' } // unique, needs more than singles
  };
  var TIME_CAP_MS = 1000; // generation never runs past this (click-to-render must stay < 2 s)

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
  // one possible cell in a row, column or box (hidden singles).
  function solvableBy(cells, technique) {
    var g = cells.slice(), progress = true, p, i, d;
    while (progress) {
      progress = false;
      for (p = 0; p < 81; p++) {
        if (g[p]) continue;
        var mask = ~usedMask(g, p) & 0x3FE;
        if (mask === 0) return false;
        if (bitCount(mask) === 1) { g[p] = Math.log2(mask); progress = true; }
      }
      if (technique === 'singles') {
        for (var u = 0; u < 27; u++) {
          var unit = UNITS[u];
          for (d = 1; d <= 9; d++) {
            var spot = -1, n = 0, placed = false;
            for (i = 0; i < 9; i++) {
              var q = unit[i];
              if (g[q] === d) { placed = true; break; }
              if (!g[q] && !(usedMask(g, q) & (1 << d))) { spot = q; n++; }
            }
            if (!placed && n === 1) { g[spot] = d; progress = true; }
          }
        }
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

  // Generate a puzzle for 'easy' | 'medium' | 'hard'.
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

  function render() {
    var table = document.getElementById('sudoku');
    var status = document.getElementById('status');
    var button = document.getElementById('verify');
    var picker = document.getElementById('picker');
    var game = document.getElementById('game');
    var levelLabel = document.getElementById('level');
    var puzzle = null;  // current puzzle (9x9, 0 = empty)
    var inputs = [];    // [r][c] -> input element or null for givens
    var notesMode = false;
    var lastCell = null; // cell input that last had focus
    var notesButton = document.getElementById('notes');

    function clearResults() {
      status.textContent = '';
      status.className = '';
      table.querySelectorAll('.conflict').forEach(function (el) {
        el.classList.remove('conflict');
        el.removeAttribute('aria-invalid');
      });
    }

    // Single write path for a cell: keeps the remembered value, notes and
    // their display in sync. Only a changed value clears the Verify results.
    function setCell(inp, cell) {
      var changed = inp.value !== cell.value || (inp.dataset.prev || '') !== cell.value;
      inp.value = cell.value;
      inp.dataset.prev = cell.value;
      inp.dataset.notes = cell.notes;
      var digits = noteDigits(cell.notes);
      inp.parentNode.querySelectorAll('.notes span').forEach(function (s, i) {
        s.textContent = digits.indexOf(i + 1) < 0 ? '' : i + 1;
      });
      inp.setAttribute('aria-label', inp.dataset.label + (digits.length ? ', notes ' + digits.join(' ') : ''));
      if (changed) clearResults();
    }

    function enter(inp, key) {
      setCell(inp, applyEntry({ value: inp.dataset.prev || '', notes: +inp.dataset.notes || 0 }, key, notesMode));
    }

    function setNotesMode(on) {
      notesMode = on;
      notesButton.textContent = 'Notes: ' + (on ? 'On' : 'Off');
      notesButton.setAttribute('aria-pressed', on);
    }

    function buildTable() {
      var tbody = document.createElement('tbody');
      inputs = [];
      lastCell = null;
      puzzle.forEach(function (rowVals, r) {
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
            inp.dataset.label = 'Row ' + (r + 1) + ', column ' + (c + 1);
            inp.setAttribute('aria-label', inp.dataset.label);
            inp.addEventListener('focus', function () { lastCell = inp; });
            inp.addEventListener('keydown', function (e) {
              if (!e.key) return;
              if (e.ctrlKey || e.metaKey || e.altKey) return;
              if (e.key === 'Backspace' || e.key === 'Delete' || e.key.length === 1) {
                e.preventDefault();
                enter(inp, e.key);
              }
            });
            // Fallback for paste, drop, IME: treat as typed text (a single digit
            // is accepted, anything else is rejected and the cell is restored).
            inp.addEventListener('input', function () {
              var raw = inp.value;
              inp.value = inp.dataset.prev || '';
              enter(inp, raw || 'Backspace');
            });
            td.appendChild(inp);
            var notes = document.createElement('div');
            notes.className = 'notes';
            notes.setAttribute('aria-hidden', 'true');
            for (var d = 0; d < 9; d++) notes.appendChild(document.createElement('span'));
            td.appendChild(notes);
            inputs[r].push(inp);
          }
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      var old = table.querySelector('tbody');
      if (old) table.removeChild(old);
      table.appendChild(tbody);
    }

    function choose(level) {
      var res = generatePuzzle(level);
      puzzle = res.puzzle;
      clearResults();
      setNotesMode(false);
      buildTable();
      levelLabel.textContent = 'Difficulty: ' + level.charAt(0).toUpperCase() + level.slice(1);
      picker.hidden = true;
      game.hidden = false;
      var first = table.querySelector('input');
      if (first) first.focus();
    }

    function newPuzzle() {
      var old = table.querySelector('tbody');
      if (old) table.removeChild(old);
      puzzle = null;
      inputs = [];
      clearResults();
      game.hidden = true;
      picker.hidden = false;
      var b = picker.querySelector('button');
      if (b) b.focus();
    }

    Array.prototype.forEach.call(picker.querySelectorAll('button[data-level]'), function (b) {
      b.addEventListener('click', function () { choose(b.getAttribute('data-level')); });
    });
    notesButton.addEventListener('click', function () {
      setNotesMode(!notesMode);
      if (lastCell) lastCell.focus();
    });
    document.getElementById('new-puzzle').addEventListener('click', newPuzzle);

    button.addEventListener('click', function () {
      clearResults();
      var grid = buildGrid(puzzle, inputs.map(function (row) {
        return row.map(function (inp) { return inp.value; });
      }));
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
    generatePuzzle: generatePuzzle, generateSolution: generateSolution, seededRng: seededRng,
    countSolutions: function (grid, limit) { return search(toFlat(grid), limit || 2); },
    solvableBy: function (grid, technique) { return solvableBy(toFlat(grid), technique); },
    LEVELS: LEVELS, isValidSolution: isValidSolution,
    findConflicts: findConflicts, verify: verify, sanitizeDigit: sanitizeDigit, buildGrid: buildGrid,
    noteDigits: noteDigits, applyEntry: applyEntry
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') {
    window.Sudoku = api;
    window.isValidSolution = isValidSolution;
    render();
  }
})();
