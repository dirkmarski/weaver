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

  // The clash named in the "not counted" and Hint texts, or null when no rule is broken: P is the first cell
  // of findConflicts, Q its first holder (firstHolder). Returns { phrase, extra }: phrase is "row R1, column C1
  // and row R2, column C2 both hold E in the same U" (P first, then Q, which comes later in reading order);
  // extra is " Other numbers break the rules too: click Verify to see which." when more than two cells clash, else ''.
  function namedClash(grid) {
    var conflicts = findConflicts(grid);
    if (!conflicts.length) return null;
    var p = conflicts[0][0] * 9 + conflicts[0][1], cells = toFlat(grid), e = cells[p], h = firstHolder(cells, p, e);
    return {
      phrase: cellName(p) + ' and ' + cellName(h.q) + ' both hold ' + e + ' in the same ' + UNIT_NAMES[h.unit],
      extra: conflicts.length > 2 ? ' Other numbers break the rules too: click Verify to see which.' : ''
    };
  }

  // Flat indices (row * 9 + column), ascending, of every cell to outline: the cells findConflicts returns, givens included.
  function clashCells(grid) {
    return findConflicts(grid).map(function (p) { return p[0] * 9 + p[1]; });
  }

  var FIXED_TEXT = 'No numbers break the rules now. New entries are counted again.';

  // The message for a value change from grid `before` to grid `after`: FIXED_TEXT when the change took the grid
  // from at least one clash to none, else ''. (Only a clear or an overwrite can; completionFor takes precedence in the caller.)
  function fixedMessage(before, after) {
    return findConflicts(before).length && !findConflicts(after).length ? FIXED_TEXT : '';
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

  // Which technique Hint should teach next: the one applied less so far (own and
  // hint counts together). On a tie: 'naked' on easy, 'hidden' on the other levels.
  function preferredTechnique(tally, level) {
    var n = tally.naked.own + tally.naked.hint, h = tally.hidden.own + tally.hidden.hint;
    if (h < n) return 'hidden';
    if (n < h) return 'naked';
    return level === 'easy' ? 'naked' : 'hidden';
  }

  // "the box of rows R1-R2 and columns C1-C2" for box b (0-8).
  // dash: the character between the range numbers ('-' by default; the own pointing and claiming rewards pass U+2011).
  function boxName(b, dash) {
    var r = 3 * Math.floor(b / 3), c = 3 * (b % 3), h = dash || '-';
    return 'the box of rows ' + (r + 1) + h + (r + 3) + ' and columns ' + (c + 1) + h + (c + 3);
  }

  // "the box of ..., the digit D fits only in row L" for a pointing step.
  function pointingClause(s) {
    return boxName(s.box) + ', the digit ' + s.pointDigit + ' fits only in ' + s.line + ' ' + (s.index + 1);
  }

  // "1, 2 and 3" for a list of numbers.
  function andList(n) { return n.length > 1 ? n.slice(0, -1).join(', ') + ' and ' + n[n.length - 1] : String(n[0]); }

  // The struck cells (flat indices, ascending) by name: "row R, column C"; in one row "row N, columns A, B and C"; in one
  // column "column N, rows A and B"; else grouped per row, joined by "; ".
  function struckCells(removed) {
    var rows = [], cols = [];
    removed.forEach(function (q) { if (rows.indexOf(Math.floor(q / 9)) < 0) rows.push(Math.floor(q / 9)); if (cols.indexOf(q % 9) < 0) cols.push(q % 9); });
    function nums(a) { return a.map(function (x) { return x + 1; }); }
    if (cols.length === 1 && rows.length > 1) return 'column ' + (cols[0] + 1) + ', rows ' + andList(nums(rows));
    return rows.map(function (r) {
      var c = nums(removed.filter(function (q) { return Math.floor(q / 9) === r; }).map(function (q) { return q % 9; }));
      return 'row ' + (r + 1) + ', column' + (c.length > 1 ? 's ' : ' ') + andList(c);
    }).join('; ');
  }

  // The hintFor result for a pointing step (see findPointing).
  function pointingHint(s, step, grid) {
    var line = s.line + ' ' + (s.index + 1), d = s.pointDigit;
    var box = pointingClause(s);
    var unitName = s.form === 'naked' ? '' : s.unit === 'box'
      ? boxName(3 * Math.floor(s.r / 3) + Math.floor(s.c / 3))
      : s.unit + ' ' + ((s.unit === 'row' ? s.r : s.c) + 1);
    // The box has no empty cell outside the confined cells: the clause then says so (an explain only).
    var empties = UNITS[s.box * 3 + 2].filter(function (q) { return grid[Math.floor(q / 9)][q % 9] === 0; });
    if (step === 2 && empties.length === s.confined.length) box += ' (the box has no other empty cells)';
    var text;
    if (step === 2) {
      var rc = 'row ' + (s.r + 1) + ', column ' + (s.c + 1);
      text = 'Pointing: ' + rc + ' must be ' + s.digit + '.\n1. In ' + box + '.\n';
      text += '2. So ' + d + ' cannot go in ' + line + ' outside that box: not in ' + struckCells(s.removed) + ' (struck).\n';
      text += s.form === 'naked'
        ? '3. Row ' + (s.r + 1) + ', column ' + (s.c + 1) + ' has every digit except ' + d + ' and ' + s.digit + ' in its row, column and box, so it could only take ' + d + ' or ' + s.digit + '. With ' + d + ' ruled out, it must be ' + s.digit + '.'
        : '3. That leaves ' + rc + ' as the only cell in ' + unitName + ' where ' + d + ' fits, so it must be ' + d + '.';
    } else {
      var tail;
      if (s.form === 'naked') {
        tail = 'That means ' + d + ' cannot go in row ' + (s.r + 1) + ', column ' + (s.c + 1) + ', and only one other digit fits there now.';
      } else {
        tail = 'Then look at ' + unitName + ': ' + d + ' now has only one place left there.';
      }
      text = 'Hint: try pointing. In ' + box + ', so it cannot go anywhere else in ' + line + '. ' + tail + ' Click Hint again to see why.';
    }
    return { kind: step === 2 ? 'explain' : 'nudge', technique: 'pointing', form: s.form, unit: s.unit, box: s.box, line: s.line, index: s.index,
      pointDigit: d, confined: s.confined, removed: s.removed, r: s.r, c: s.c, digit: s.digit, text: text };
  }

  // The hintFor result for a claiming step (see findClaiming); same shape as pointingHint's.
  function claimingHint(s, step, grid) {
    var line = s.line + ' ' + (s.index + 1), d = s.pointDigit, rc = 'row ' + (s.r + 1) + ', column ' + (s.c + 1);
    var box = boxName(s.box), text;
    if (step === 2) {
      // Every empty cell of the line is confined: line 1 says so.
      var empties = UNITS[s.index * 3 + (s.line === 'row' ? 0 : 1)].filter(function (q) { return grid[Math.floor(q / 9)][q % 9] === 0; });
      text = 'Claiming: ' + rc + ' must be ' + s.digit + '.\n1. In ' + line + ', the digit ' + d + ' fits only in ' + box
        + (empties.length === s.confined.length ? ' (the ' + s.line + ' has no other empty cells)' : '') + '.\n'
        + '2. So ' + d + ' cannot go anywhere else in that box: not in ' + struckCells(s.removed) + ' (struck).\n';
      text += s.form === 'naked'
        ? '3. ' + rc.charAt(0).toUpperCase() + rc.slice(1) + ' has every digit except ' + d + ' and ' + s.digit + ' in its row, column and box, so it could only take ' + d + ' or ' + s.digit + '. With ' + d + ' ruled out, it must be ' + s.digit + '.'
        : '3. That leaves ' + rc + ' as the only cell in ' + s.unit + ' ' + ((s.unit === 'row' ? s.r : s.c) + 1) + ' where ' + d + ' fits, so it must be ' + d + '.';
    } else {
      text = 'Hint: try claiming. In ' + line + ', the digit ' + d + ' fits only in ' + box + ', so it cannot go anywhere else in that box. ';
      text += s.form === 'naked'
        ? 'That means ' + d + ' cannot go in ' + rc + ', and only one other digit fits there now.'
        : 'Then look at ' + s.unit + ' ' + ((s.unit === 'row' ? s.r : s.c) + 1) + ': ' + d + ' now has only one place left there.';
      text += ' Click Hint again to see why.';
    }
    return { kind: step === 2 ? 'explain' : 'nudge', technique: 'claiming', form: s.form, unit: s.unit, box: s.box, line: s.line, index: s.index,
      pointDigit: d, confined: s.confined, removed: s.removed, r: s.r, c: s.c, digit: s.digit, text: text };
  }

  // What Hint says for a grid. step 1 = nudge, step 2 = explain (only used when
  // a single or pointing step is found). A naked single is taught before a hidden single, unless
  // prefer === 'hidden' and a hidden single that is not a naked single exists. With no single, a pointing step
  // (findPointing), else a claiming step (findClaiming, same result shape, technique 'claiming'), is taught; on level 'tricky' a useful pointing step (findPointing with useful: true) comes
  // before any single, and on 'tough' a useful claiming step (findClaiming with useful: true) comes before that; its result adds technique 'pointing', form, box, line, index, pointDigit. Returns
  // { kind, technique, unit, r, c, digit, text } where kind is
  // 'conflict' | 'full' | 'none' | 'nudge' | 'explain'. For the last two, r/c are
  // 0-based, technique is 'naked' | 'hidden' | 'pointing' | 'claiming' and unit ('box' | 'row' | 'column') is set for hidden.
  function hintFor(grid, step, prefer, level) {
    if (findConflicts(grid).length) {
      var clash = namedClash(grid);
      return { kind: 'conflict', text: clash.phrase.charAt(0).toUpperCase() + clash.phrase.slice(1)
        + '. Change or clear one of them first, then click Hint again.' + clash.extra };
    }
    if (verify(grid).complete) return { kind: 'full', text: 'Every cell is filled. Click Verify to check the grid.' };
    var s = level === 'tough' ? findClaiming(grid, { useful: true }) : null;
    if (s) return claimingHint(s, step, grid);
    s = level === 'tricky' || level === 'tough' ? findPointing(grid, { useful: true }) : null;
    if (s) return pointingHint(s, step, grid);
    s = prefer === 'hidden' ? findHiddenSingle(grid, { notNaked: true }) : null;
    var technique = 'hidden';
    if (!s) {
      s = findNakedSingle(grid);
      technique = 'naked';
    }
    if (!s) {
      s = findHiddenSingle(grid);
      technique = 'hidden';
    }
    if (!s) {
      s = findPointing(grid);
      if (s) return pointingHint(s, step, grid);
      s = findClaiming(grid);
      if (s) return claimingHint(s, step, grid);
      return { kind: 'none', text: 'No naked single, hidden single, pointing or claiming step right now. At this point the puzzle needs another technique.' };
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
        + ' already has ' + aDigit(s.digit) + ' in its ' + others + '.';
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
    if (hint.technique === 'pointing' || hint.technique === 'claiming') return 'Well done! You applied ' + hint.technique + ': row ' + (hint.r + 1) + ', column ' + (hint.c + 1) + ' is ' + value + '.';
    return 'Well done! You applied a ' + hint.technique + ' single: row ' + (hint.r + 1) + ', column ' + (hint.c + 1) + ' is ' + value + '.';
  }

  // The cells a showing hint marks, as flat indices, for a hintFor result of kind nudge/explain:
  // { area: the tinted cells (not the target), target,
  //   digits: the ringed cells (ascending), on explain only,
  //   hatched: the reason cells (ascending), on explain only,
  //   confined, removed: a pointing explain's box cells where the digit fits and line cells that lose it (else empty) }.
  // Tint: a naked single's row, column and box; a hidden single's unit; a pointing or claiming step's box and line, plus its hidden-form unit.
  // Claiming: confined = the line cells where D fits, removed = the box cells that lose it, and the first reason set is the
  // empty cells of the line that are not confined (pointing: of the box).
  // Reason cells (none for a naked single): a hidden single's are the other empty cells of its unit; a pointing step's are the
  // empty box cells that are not confined and, in the hidden form, the empty cells of the hidden unit other than the target
  // and the removed cells. They are hatched on the page.
  // Ringed digits, for D = the hidden single's digit or the pointing digit: a cell holding D that shares a row, column or box
  // with a reason cell (an empty cell that D helps to rule out).
  function hintMarks(hint, grid) {
    var p = hint.r * 9 + hint.c, units, claiming = hint.technique === 'claiming', pointing = claiming || hint.technique === 'pointing';
    var hidden = hint.unit ? [CELL_UNITS[p][UNIT_NAMES.indexOf(hint.unit)]] : [];
    var lineUnit = hint.index * 3 + (hint.line === 'row' ? 0 : 1);
    if (pointing) units = [hint.box * 3 + 2, lineUnit].concat(hidden);
    else units = hint.technique === 'hidden' ? hidden : CELL_UNITS[p];
    var area = [], digits = [], d = pointing ? hint.pointDigit : hint.technique === 'hidden' ? hint.digit : 0;
    units.forEach(function (u) { UNITS[u].forEach(function (q) { if (q !== p && area.indexOf(q) < 0) area.push(q); }); });
    var explain = pointing && hint.kind === 'explain';
    var reasons = [];
    function addReasons(cells, skip) {
      cells.forEach(function (x) { if (x !== p && grid[Math.floor(x / 9)][x % 9] === 0 && skip.indexOf(x) < 0) reasons.push(x); });
    }
    if (d && hint.kind === 'explain') {
      if (pointing) {
        addReasons(UNITS[claiming ? lineUnit : hint.box * 3 + 2], hint.confined);
        addReasons(hidden.length ? UNITS[hidden[0]] : [], hint.removed);
      } else addReasons(UNITS[hidden[0]], []);
      for (var q = 0; q < 81; q++) {
        if (grid[Math.floor(q / 9)][q % 9] !== d) continue;
        var mine = CELL_UNITS[q];
        if (reasons.some(function (x) { return CELL_UNITS[x].some(function (u) { return mine.indexOf(u) >= 0; }); })) digits.push(q);
      }
    }
    reasons.sort(function (a, b) { return a - b; });
    return {
      area: area, target: p, digits: digits, hatched: reasons,
      confined: explain ? hint.confined : [], removed: explain ? hint.removed : []
    };
  }

  // 'an 8' or 'a D'.
  function aDigit(d) { return (d === 8 ? 'an ' : 'a ') + d; }

  // The key line under a hidden single's or pointing step's explanation; hatchedCount the hatched cells showing.
  // Pointing names its dashed and struck marks, and the hatching only when a cell is hatched; a hidden single always has some.
  // For a pointing step, `stage` (1-3, default 3) is the number of revealed steps: 1 names only the dashed marks, 2 adds the struck.
  function hintKey(hint, hatchedCount, stage) {
    var pointing = hint.technique === 'pointing' || hint.technique === 'claiming', d = pointing ? hint.pointDigit : hint.digit;
    stage = stage || 3;
    var hatch = 'hatched = a purple ring rules ' + d + ' out there (' + aDigit(d) + ' already in the same row, column or box)';
    if (!pointing) return 'Key: ' + hatch + '.';
    return 'Key: dashed purple = the only places for ' + d + ' in the ' + (hint.technique === 'claiming' ? hint.line : 'box')
      + (stage > 1 ? '; struck grey ' + d + ' = this step rules ' + d + ' out there' : '')
      + (stage > 2 && hatchedCount ? '; ' + hatch : '') + '.';
  }

  // The link for a hatched cell p (flat index): { partners, text }. Partners are the ringed cells (`ringed`, ascending flat
  // indices, hintMarks' digits) that share a row, column or box with p; text names, for the hint's digit d, each partner and the
  // units (row, column, box, in that order) it shares with p.
  function ringLink(p, ringed, d) {
    var partners = ringed.filter(function (q) { return sharedUnits(p, q).length > 0; });
    var parts = partners.map(function (q) {
      return 'the ' + d + ' at ' + cellPlace(q) + ' is in the same ' + sharedUnits(p, q).join(' and ');
    });
    var text = 'Hatched cell ' + cellPlace(p) + ': no ' + d + ' here, because ' + parts.join(', and ') + '.';
    return { partners: partners, text: text };
  }

  // The reverse of ringLink, for the ring q holding d: { cells, text }. Cells are the hatched cells (`hatched`, ascending flat
  // indices) that share a row, column or box with q, and text names each with the units it shares (row, column, box).
  function ringRules(q, hatched, d) {
    var cells = hatched.filter(function (p) { return sharedUnits(p, q).length > 0; });
    var items = cells.map(function (p) { return cellPlace(p) + ' (same ' + sharedUnits(p, q).join(' and ') + ')'; });
    var last = items.length > 1 ? ' and ' + items.pop() : '';
    var count = items.length + (last ? 1 : 0);
    var text = 'The ' + d + ' at ' + cellPlace(q) + ' rules ' + d + ' out of ' + (['', 'one', 'two', 'three', 'four'][count] || count)
      + ' hatched cell' + (count > 1 ? 's' : '') + ': ' + items.join(', ') + last + '.';
    return { cells: cells, text: text };
  }

  // "row R, column C" for a flat index; the units (UNIT_NAMES order) that cells p and q share.
  function cellPlace(p) { return 'row ' + (Math.floor(p / 9) + 1) + ', column ' + (p % 9 + 1); }
  function sharedUnits(p, q) { return UNIT_NAMES.filter(function (n, k) { return CELL_UNITS[q][k] === CELL_UNITS[p][k]; }); }

  // ---- Rewards: recognising naked and hidden singles the learner enters ----

  // Which technique makes `digit` in the empty cell (r, c) of `grid` (the grid
  // just before the entry, 0 = empty) a single? Returns { technique: 'naked' },
  // { technique: 'hidden', unit: 'box' | 'row' | 'column' },
  // { technique: 'pointing' | 'claiming', box, line, index, pointDigit } (as findPointing / findClaiming; the first such step
  // in their order that makes the entered digit a single in this cell, ONE step, no chains) or null (also null
  // when the grid has a conflict, the cell is filled or digit is not 1-9).
  // Precedence: naked, hidden (units tried box, row, column), pointing, claiming.
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
    var found = null;
    [['pointing', pointingSteps], ['claiming', claimingSteps]].forEach(function (t) { // a box-form single here would be a hidden single already
      if (!found) t[1](cells, function (step) {
        var res = singleAfterStep(cells, p, step.removed, step.pointDigit);
        if (res && res.digit === digit) found = { technique: t[0], box: step.box, line: step.line, index: step.index, pointDigit: step.pointDigit, form: res.form,
          confined: step.confined, removed: step.removed };
        if (found && res.unit) found.unit = res.unit;
        return found;
      });
    });
    return found;
  }

  function emptyTally() {
    return { naked: { own: 0, hint: 0 }, hidden: { own: 0, hint: 0 }, pointing: { own: 0, hint: 0 }, claiming: { own: 0, hint: 0 } };
  }

  // The line for a judged entry that is not credited, in this order: (1) the digit is already in the cell's
  // row, column or box (the first of those, and its first holder, named), else (2) the grid just before the
  // entry already breaks the rules (the clash is named, see namedClash), else (3) not a technique.
  // Never says whether the digit is right.
  function notCounted(grid, r, c, digit) {
    var where = 'Entered: row ' + (r + 1) + ', column ' + (c + 1) + ' is ' + digit + '. ';
    var h = firstHolder(toFlat(grid), r * 9 + c, digit), clash = namedClash(grid);
    if (h) return where + digit + ' is already in this cell\'s ' + UNIT_NAMES[h.unit] + ', at ' + cellName(h.q) + ', so it breaks the rules. It is not counted.';
    if (clash) {
      return where + digit + ' is not in this cell\'s row, column or box, but ' + clash.phrase + ', so it is not counted. '
        + 'Change or clear one of them first. Entries after that count again; this one stays uncounted.' + clash.extra;
    }
    return where + 'It was not a naked single, a hidden single, a pointing step or a claiming step at this point, so it is not counted.';
  }

  // Decide the reward for `value` ('' or '1'-'9') entered in cell (r, c).
  //  tally: as emptyTally(); credited: { cellIndex: true } for cells already credited
  //  hint: the hintFor result showing now (nudge/explain) or null
  //  grid: the grid just before the entry
  // Only a digit entered in an empty cell is judged. Returns the new
  // { tally, credited, text, kind } (inputs are not changed); text is '' when the entry is not judged.
  // kind: 'reward' ("Well spotted!"/"Well done!"), 'notCounted' (the "Entered: ..." text) or '' (not judged).
  // A judged entry that earns no credit gets the "not counted" text (notCounted) and no count changes.
  // A cell already credited shows the text again but changes no count.
  function creditEntry(tally, credited, hint, grid, r, c, value) {
    var none = { tally: tally, credited: credited, text: '', kind: '' };
    var digit = sanitizeDigit(value) ? parseInt(value, 10) : 0;
    if (!digit || grid[r][c] !== 0) return none;
    var technique, how, text;
    if (hint && hint.r === r && hint.c === c && hint.digit === digit) {
      text = hintApplied(hint, value);
      technique = hint.technique;
      how = 'hint';
    } else {
      var res = classifyEntry(grid, r, c, digit);
      if (!res) return { tally: tally, credited: credited, text: notCounted(grid, r, c, digit), kind: 'notCounted' };
      technique = res.technique;
      how = 'own';
      var where = 'row ' + (r + 1) + ', column ' + (c + 1) + ' is ' + digit + '.';
      if (technique === 'pointing' || technique === 'claiming') {
        var NB = '\u2011', d = res.pointDigit, clause;
        if (technique === 'pointing') clause = boxName(res.box, NB) + ', the digit ' + d + ' fits only in ' + struckCells(res.confined);
        else {
          var along = res.confined.map(function (q) { return (res.line === 'row' ? q % 9 : Math.floor(q / 9)) + 1; });
          clause = res.line + ' ' + (res.index + 1) + ', the digit ' + d + ' fits only in ' + (res.line === 'row' ? 'columns ' : 'rows ')
            + andList(along) + ', inside ' + boxName(res.box, NB);
        }
        text = 'Well spotted! You applied ' + technique + ' on your own: in ' + clause + ', so ' + d + ' cannot go in ';
        if (res.form === 'naked') {
          text += 'row ' + (r + 1) + ', column ' + (c + 1) + '. That leaves ' + digit + ' as the only digit there.';
        } else {
          var kind = UNIT_NAMES.indexOf(res.unit), mine = UNITS[CELL_UNITS[r * 9 + c][kind]];
          var cellUnit = { row: 'row ' + (r + 1), column: 'column ' + (c + 1), box: boxName(3 * Math.floor(r / 3) + Math.floor(c / 3), NB) }[res.unit];
          text += struckCells(res.removed.filter(function (q) { return mine.indexOf(q) >= 0; }))
            + '. That leaves row ' + (r + 1) + ', column ' + (c + 1) + ' as the only cell in ' + cellUnit + ' where ' + digit + ' fits.';
        }
      } else {
        var unit = technique === 'hidden' ? ' in its ' + res.unit : '';
        text = 'Well spotted! You found a ' + technique + ' single' + unit + ' on your own: ' + where;
      }
    }
    var p = r * 9 + c;
    if (credited[p]) return { tally: tally, credited: credited, text: text, kind: 'reward' };
    var t = emptyTally(), cr = {};
    ['naked', 'hidden', 'pointing', 'claiming'].forEach(function (k) { t[k].own = tally[k].own; t[k].hint = tally[k].hint; });
    Object.keys(credited).forEach(function (k) { cr[k] = true; });
    t[technique][how]++;
    cr[p] = true;
    return { tally: t, credited: cr, text: text, kind: 'reward' };
  }

  // The status class for a creditEntry kind: a reward is green ('ok'), anything else neutral.
  function statusClass(kind) { return kind === 'reward' ? 'ok' : ''; }

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
    var own = 0, hint = 0;
    ['naked', 'hidden', 'pointing', 'claiming'].forEach(function (k) { own += tally[k].own; hint += tally[k].hint; });
    return { kind: 'solved', text: 'Puzzle solved! Techniques applied: ' + own + ' on your own, ' + hint + ' with a hint.' };
  }

  // Plain-language definitions shown under the tally lines (they never change during a puzzle).
  var TECHNIQUE_DEFINITIONS = {
    naked: 'Only one digit fits this cell: its row, column and box already hold the other eight.',
    hidden: 'This digit fits in only one cell of a row, column or box, even if that cell could take other digits.',
    pointing: 'In a box, a digit fits only in one row (or column), so it cannot go anywhere else in that row (column); that can leave a single.',
    claiming: 'In a row (or column), a digit fits only inside one box, so it cannot go anywhere else in that box (pointing in reverse); that can leave a single.'
  };

  // The heading and the four lines shown for a tally.
  function tallyLines(tally) {
    function line(name, t) { return name + ' single: ' + t.own + ' on your own, ' + t.hint + ' with a hint'; }
    return ['Techniques applied in this puzzle', line('Naked', tally.naked), line('Hidden', tally.hidden),
      'Pointing: ' + tally.pointing.own + ' on your own, ' + tally.pointing.hint + ' with a hint',
      'Claiming: ' + tally.claiming.own + ' on your own, ' + tally.claiming.hint + ' with a hint'];
  }

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

  function countSolutions(grid, limit) { return search(toFlat(grid), limit || 2); }
  function solvableByGrid(grid, technique) { return solvableBy(toFlat(grid), technique); }

export {
  generatePuzzle,
  generateSolution,
  seededRng,
  LEVELS,
  isValidSolution,
  findConflicts,
  clashCells,
  fixedMessage,
  namedClash,
  verify,
  sanitizeDigit,
  buildGrid,
  noteDigits,
  applyEntry,
  nextCell,
  findNakedSingle,
  findHiddenSingle,
  findPointing,
  findClaiming,
  hintMarks,
  hintKey,
  ringLink,
  ringRules,
  preferredTechnique,
  hintFor,
  hintApplied,
  classifyEntry,
  emptyTally,
  creditEntry,
  completionFor,
  tallyLines,
  statusClass,
  TECHNIQUE_DEFINITIONS,
  countSolutions,
  solvableByGrid as solvableBy
};
