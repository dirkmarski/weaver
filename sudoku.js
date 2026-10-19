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

  // The first empty cell (reading order) that is the only place for some digit
  // in one of its units. Units are tried box, row, column; digits ascending.
  // Returns { r, c, digit, unit } (0-based r/c, unit 'box' | 'row' | 'column') or null.
  function findHiddenSingle(grid) {
    var cells = toFlat(grid), order = [2, 0, 1]; // kinds: box, row, column
    for (var p = 0; p < 81; p++) {
      if (cells[p]) continue;
      var used = usedMask(cells, p);
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

  // What Hint says for a grid. step 1 = nudge, step 2 = explain (only used when
  // a single is found). A naked single is taught before a hidden single. Returns
  // { kind, technique, unit, r, c, digit, text } where kind is
  // 'conflict' | 'full' | 'none' | 'nudge' | 'explain'. For the last two, r/c are
  // 0-based, technique is 'naked' | 'hidden' and unit ('box' | 'row' | 'column') is set for hidden.
  function hintFor(grid, step) {
    if (findConflicts(grid).length) {
      return { kind: 'conflict', text: 'Some numbers break the rules. Fix them first: click Verify to see which.' };
    }
    if (verify(grid).complete) return { kind: 'full', text: 'Every cell is filled. Click Verify to check the grid.' };
    var s = findNakedSingle(grid);
    var technique = 'naked';
    if (!s) {
      s = findHiddenSingle(grid);
      technique = 'hidden';
    }
    if (!s) {
      return { kind: 'none', text: 'No naked or hidden single right now. At this point the puzzle needs another technique.' };
    }
    var where = 'row ' + (s.r + 1) + ', column ' + (s.c + 1);
    var text;
    if (technique === 'naked') {
      if (step === 2) {
        text = 'Naked single: ' + where + ' must be ' + s.digit + ', because its row, column and box already contain '
          + s.seen.slice(0, -1).join(', ') + ' and ' + s.seen[7] + '.';
      } else {
        text = 'Hint: ' + where + ' is a naked single: only one digit fits there. Check its row, column and box to find it. '
          + 'Click Hint again to see why.';
      }
    } else if (step === 2) {
      var others = { box: 'row or column', row: 'column or box', column: 'row or box' }[s.unit];
      text = 'Hidden single: ' + where + ' must be ' + s.digit + ', because every other empty cell in its ' + s.unit
        + ' already has a ' + s.digit + ' in its ' + others + '.';
    } else {
      text = 'Hint: ' + where + ' is a hidden single: in its ' + s.unit + ', one of the missing digits fits only in this cell. '
        + 'Check where each missing digit can go in the ' + s.unit + '. Click Hint again to see why.';
    }
    return { kind: step === 2 ? 'explain' : 'nudge', technique: technique, unit: s.unit, r: s.r, c: s.c, digit: s.digit, text: text };
  }

  // Reward text when `value` ('' or '1'-'9') entered in the hint's target cell
  // applies the showing hint (a hintFor result of kind nudge/explain); '' otherwise.
  function hintApplied(hint, value) {
    if (!hint || String(hint.digit) !== value) return '';
    return 'Well done! You applied a ' + hint.technique + ' single: row ' + (hint.r + 1) + ', column ' + (hint.c + 1) + ' is ' + value + '.';
  }

  // ---- Rewards: recognising naked and hidden singles the learner enters ----

  // Which technique makes `digit` in the empty cell (r, c) of `grid` (the grid
  // just before the entry, 0 = empty) a single? Returns { technique: 'naked' },
  // { technique: 'hidden', unit: 'box' | 'row' | 'column' } or null (also null
  // when the grid has a conflict, the cell is filled or digit is not 1-9).
  // Naked wins over hidden; hidden units are tried box, row, column.
  function classifyEntry(grid, r, c, digit) {
    if (!Number.isInteger(digit) || digit < 1 || digit > 9) return null;
    if (findConflicts(grid).length || grid[r][c] !== 0) return null;
    var cells = toFlat(grid), p = r * 9 + c;
    var used = usedMask(cells, p);
    if (used & (1 << digit)) return null;
    if (bitCount(used & ~1) === 8) return { technique: 'naked' };
    var order = [2, 0, 1]; // kinds: box, row, column
    for (var k = 0; k < 3; k++) {
      var spots = spotsFor(cells, UNITS[CELL_UNITS[p][order[k]]], digit);
      if (spots.length === 1 && spots[0] === p) return { technique: 'hidden', unit: UNIT_NAMES[order[k]] };
    }
    return null;
  }

  function emptyTally() {
    return { naked: { own: 0, hint: 0 }, hidden: { own: 0, hint: 0 } };
  }

  // Decide the reward for `value` ('' or '1'-'9') entered in cell (r, c).
  //  tally: as emptyTally(); credited: { cellIndex: true } for cells already credited
  //  hint: the hintFor result showing now (nudge/explain) or null
  //  grid: the grid just before the entry
  // Only a digit entered in an empty cell is judged. Returns the new
  // { tally, credited, text } (inputs are not changed); text is '' when there is no credit.
  // A cell already credited shows the text again but changes no count.
  function creditEntry(tally, credited, hint, grid, r, c, value) {
    var none = { tally: tally, credited: credited, text: '' };
    var digit = sanitizeDigit(value) ? parseInt(value, 10) : 0;
    if (!digit || grid[r][c] !== 0) return none;
    var technique, how, text;
    if (hint && hint.r === r && hint.c === c && hint.digit === digit) {
      technique = hint.technique;
      how = 'hint';
      text = hintApplied(hint, value);
    } else {
      var res = classifyEntry(grid, r, c, digit);
      if (!res) return none;
      technique = res.technique;
      how = 'own';
      text = 'Well spotted! You found a ' + technique + ' single'
        + (technique === 'hidden' ? ' in its ' + res.unit : '')
        + ' on your own: row ' + (r + 1) + ', column ' + (c + 1) + ' is ' + digit + '.';
    }
    var p = r * 9 + c;
    if (credited[p]) return { tally: tally, credited: credited, text: text };
    var t = emptyTally(), cr = {};
    ['naked', 'hidden'].forEach(function (k) { t[k].own = tally[k].own; t[k].hint = tally[k].hint; });
    Object.keys(credited).forEach(function (k) { cr[k] = true; });
    t[technique][how]++;
    cr[p] = true;
    return { tally: t, credited: cr, text: text };
  }

  // Decides what to announce once a value change has been made.
  // grid: givens plus entered values (0 = empty); tally: as from creditEntry,
  // already including the entry that was just made. Inputs are not changed.
  // Returns {kind: 'solved'|'conflict', text} or null while any cell is empty.
  function completionFor(grid, tally) {
    for (var r = 0; r < 9; r++) {
      for (var c = 0; c < 9; c++) if (!grid[r][c]) return null;
    }
    if (findConflicts(grid).length) {
      return { kind: 'conflict', text: 'Every cell is filled, but some numbers break the rules. Click Verify to see which.' };
    }
    var own = tally.naked.own + tally.hidden.own, hint = tally.naked.hint + tally.hidden.hint;
    return { kind: 'solved', text: 'Puzzle solved! Singles applied: ' + own + ' on your own, ' + hint + ' with a hint.' };
  }

  // The heading and the two lines shown for a tally.
  function tallyLines(tally) {
    function line(name, t) { return name + ' single: ' + t.own + ' on your own, ' + t.hint + ' with a hint'; }
    return ['Techniques applied in this puzzle', line('Naked', tally.naked), line('Hidden', tally.hidden)];
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
    var g = cells.slice(), progress = true, p, d;
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
            var spots = spotsFor(g, unit, d);
            if (spots.length === 1) { g[spots[0]] = d; progress = true; }
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

  // Next editable (empty in the puzzle) cell from (r, c) in a direction
  // ('up'|'down'|'left'|'right'), skipping givens, no wrapping.
  // Returns [r, c], or null if there is none.
  function nextCell(puzzle, r, c, direction) {
    var dr = direction === 'up' ? -1 : direction === 'down' ? 1 : 0;
    var dc = direction === 'left' ? -1 : direction === 'right' ? 1 : 0;
    if (!dr && !dc) return null;
    for (r += dr, c += dc; r >= 0 && r < 9 && c >= 0 && c < 9; r += dr, c += dc) {
      if (!puzzle[r][c]) return [r, c];
    }
    return null;
  }

  var ARROWS = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };

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
    var hint = null;     // hint showing now (result of hintFor), or null
    var tally = emptyTally(); // techniques applied in this puzzle
    var credited = {};   // cells already credited in this puzzle
    var tallyBox = document.getElementById('tally');

    function showTally() {
      var lines = tallyLines(tally);
      tallyBox.querySelector('h2').textContent = lines[0];
      tallyBox.querySelectorAll('p').forEach(function (el, i) { el.textContent = lines[i + 1]; });
    }

    // Clears the status line, the Verify flags and any showing hint.
    function clearResults() {
      hint = null;
      status.textContent = '';
      status.className = '';
      table.querySelectorAll('.hint-target, .hint-area, .hint-digit').forEach(function (el) {
        el.classList.remove('hint-target', 'hint-area', 'hint-digit');
      });
      table.querySelectorAll('.conflict').forEach(function (el) {
        el.classList.remove('conflict');
        el.removeAttribute('aria-invalid');
      });
    }

    // Single write path for a cell: keeps the remembered value, notes and
    // their display in sync. Only a changed value clears the Verify results and any hint
    // (and entering the hinted digit shows the reward instead).
    function setCell(inp, cell) {
      var changed = inp.value !== cell.value || (inp.dataset.prev || '') !== cell.value;
      // Judge a digit entered into a cell without a value, using the grid before the write.
      var credit = null;
      if (changed && !(inp.dataset.prev || '') && cell.value) {
        var pos = +inp.dataset.pos;
        credit = creditEntry(tally, credited, hint, currentGrid(), Math.floor(pos / 9), pos % 9, cell.value);
      }
      inp.value = cell.value;
      inp.dataset.prev = cell.value;
      inp.dataset.notes = cell.notes;
      var digits = noteDigits(cell.notes);
      inp.parentNode.querySelectorAll('.notes span').forEach(function (s, i) {
        s.textContent = digits.indexOf(i + 1) < 0 ? '' : i + 1;
      });
      inp.setAttribute('aria-label', inp.dataset.label + (digits.length ? ', notes ' + digits.join(' ') : ''));
      if (changed) {
        clearResults();
        if (credit) {
          tally = credit.tally;
          credited = credit.credited;
          showTally();
          if (credit.text) { status.textContent = credit.text; status.className = 'ok'; }
        }
        // A value change that leaves a digit: announce a filled grid (grid and tally are after the change).
        // (the cell.value guard is defensive: an empty cell leaves a 0 in the grid, so completionFor is null anyway)
        var done = cell.value ? completionFor(currentGrid(), tally) : null;
        if (done) { status.textContent = done.text; status.className = done.kind === 'solved' ? 'ok' : 'fail'; }
      }
    }

    function enter(inp, key) {
      setCell(inp, applyEntry({ value: inp.dataset.prev || '', notes: +inp.dataset.notes || 0 }, key, notesMode));
    }

    function setNotesMode(on) {
      notesMode = on;
      notesButton.textContent = 'Notes: ' + (on ? 'On' : 'Off');
      notesButton.setAttribute('aria-pressed', on);
    }

    function toggleNotes() {
      setNotesMode(!notesMode);
      if (lastCell) lastCell.focus();
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
            inp.dataset.pos = r * 9 + c;
            inp.dataset.label = 'Row ' + (r + 1) + ', column ' + (c + 1);
            inp.setAttribute('aria-label', inp.dataset.label);
            inp.addEventListener('focus', function () { lastCell = inp; });
            inp.addEventListener('keydown', function (e) {
              if (!e.key) return;
              if (e.ctrlKey || e.metaKey || e.altKey) return;
              var dir = ARROWS[e.key];
              if (dir) {
                e.preventDefault();
                var next = nextCell(puzzle, r, c, dir);
                if (next) inputs[next[0]][next[1]].focus();
                return;
              }
              if (e.key === 'n' || e.key === 'N') {
                e.preventDefault();
                if (!e.repeat) toggleNotes();
                return;
              }
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
      tally = emptyTally();
      credited = {};
      showTally();
      tallyBox.hidden = false;
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
      tallyBox.hidden = true;
      game.hidden = true;
      picker.hidden = false;
      var b = picker.querySelector('button');
      if (b) b.focus();
    }

    Array.prototype.forEach.call(picker.querySelectorAll('button[data-level]'), function (b) {
      b.addEventListener('click', function () { choose(b.getAttribute('data-level')); });
    });
    notesButton.addEventListener('click', toggleNotes);
    document.getElementById('new-puzzle').addEventListener('click', newPuzzle);

    // The grid Verify and Hint check: givens plus entered values (notes excluded).
    function currentGrid() {
      return buildGrid(puzzle, inputs.map(function (row) {
        return row.map(function (inp) { return inp ? inp.value : ''; });
      }));
    }

    // Hint: step 1 unless a hint is already showing, then step 2.
    document.getElementById('hint').addEventListener('click', function () {
      var res = hintFor(currentGrid(), hint ? 2 : 1);
      clearResults();
      status.textContent = res.text;
      status.className = res.kind === 'conflict' ? 'fail' : '';
      if (res.kind !== 'nudge' && res.kind !== 'explain') return;
      hint = res;
      var p = res.r * 9 + res.c;
      // Tint: a naked single's row, column and box; a hidden single's unit only.
      var area = res.technique === 'hidden' ? [CELL_UNITS[p][UNIT_NAMES.indexOf(res.unit)]] : CELL_UNITS[p];
      area.forEach(function (u) {
        UNITS[u].forEach(function (q) { table.rows[Math.floor(q / 9)].cells[q % 9].classList.add('hint-area'); });
      });
      table.rows[res.r].cells[res.c].classList.remove('hint-area');
      table.rows[res.r].cells[res.c].classList.add('hint-target');
      if (res.technique === 'hidden' && res.kind === 'explain') { // mark every cell holding the digit
        var grid = currentGrid();
        for (var q = 0; q < 81; q++) {
          if (grid[Math.floor(q / 9)][q % 9] === res.digit) table.rows[Math.floor(q / 9)].cells[q % 9].classList.add('hint-digit');
        }
      }
      inputs[res.r][res.c].focus();
    });

    button.addEventListener('click', function () {
      clearResults();
      var grid = currentGrid();
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
    noteDigits: noteDigits, applyEntry: applyEntry, nextCell: nextCell,
    findNakedSingle: findNakedSingle, findHiddenSingle: findHiddenSingle, hintFor: hintFor, hintApplied: hintApplied,
    classifyEntry: classifyEntry, emptyTally: emptyTally, creditEntry: creditEntry, completionFor: completionFor, tallyLines: tallyLines
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') {
    window.Sudoku = api;
    window.isValidSolution = isValidSolution;
    render();
  }
})();
