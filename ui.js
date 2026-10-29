import {
  TECHNIQUE_DEFINITIONS, applyEntry, buildGrid, clashCells, completionFor, creditEntry, emptyTally, fixedMessage, generatePuzzle, hintFor, hintKey, hintMarks, nextCell, noteDigits, preferredTechnique, ringLink, ringRules, statusClass, tallyLines, verify
} from './sudoku.js';

  var ARROWS = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };

  function render() {
    var table = document.getElementById('sudoku');
    var status = document.getElementById('status');
    var reserve = document.getElementById('link'); // under the board: the link sentence while a selection is active, else the key
    var invite = document.getElementById('key');   // after the steps: the invitation
    var keyText = ''; // key line of the explanation showing, else ''
    var button = document.getElementById('verify');
    var picker = document.getElementById('picker');
    var game = document.getElementById('game');
    var levelLabel = document.getElementById('level-text');
    var puzzle = null;  // current puzzle (9x9, 0 = empty)
    var inputs = [];    // [r][c] -> input element or null for givens
    var notesMode = false;
    var lastCell = null; // cell input that last had focus
    var notesButton = document.getElementById('notes');
    var hint = null;     // hint showing now (result of hintFor), or null
    var steps = null;    // { lines, shown, marks } of a pointing explanation revealed step by step (#90), else null
    var nextRow = document.getElementById('next');
    var nextStep = document.getElementById('next-step');
    var hatchedRings = null; // { hatched, rings, d } of the explanation showing when it has hatched cells, else null
    var tally = emptyTally(); // techniques applied in this puzzle
    var currentLevel = null; // level chosen for the current puzzle
    var credited = {};   // cells already credited in this puzzle
    var tallyBox = document.getElementById('tally');

    function showTally() {
      var lines = tallyLines(tally);
      tallyBox.querySelector('h2').textContent = lines[0];
      document.getElementById('tally-naked').textContent = lines[1];
      document.getElementById('tally-hidden').textContent = lines[2];
      document.getElementById('definition-naked').textContent = TECHNIQUE_DEFINITIONS.naked;
      document.getElementById('definition-hidden').textContent = TECHNIQUE_DEFINITIONS.hidden;
      document.getElementById('tally-pointing').textContent = lines[3];
      document.getElementById('definition-pointing').textContent = TECHNIQUE_DEFINITIONS.pointing;
      document.getElementById('tally-claiming').textContent = lines[4];
      document.getElementById('definition-claiming').textContent = TECHNIQUE_DEFINITIONS.claiming;
    }

    // Un-links the rings and the ruled cells; shows the key under the board and the invitation (or nothing, when no hatched cell is showing).
    var INVITE = 'Click or tap a hatched cell to see what rules it out (solid purple), or a ring to see which cells it rules out.';
    function unlink() {
      table.querySelectorAll('.hint-ruled').forEach(function (el) { el.removeAttribute('data-d'); });
      table.querySelectorAll('.hint-linked, .hint-ruled').forEach(function (el) { el.classList.remove('hint-linked', 'hint-ruled'); });
      reserve.textContent = keyText;
      reserve.className = '';
      invite.textContent = hatchedRings ? INVITE : '';
    }

    // Replaces the key under the board by a link sentence (purple).
    function showLink(text) {
      reserve.textContent = text;
      reserve.className = 'selected';
    }

    // Brings the invitation fully into view with the least scroll, once it has appeared (after the focus call, which may scroll too).
    function showInvite() {
      if (hatchedRings) invite.scrollIntoView({ block: 'nearest' });
    }

    // Shows the conclusion line and the first `shown` steps; the Next step button stays until all three show.
    function showSteps() {
      status.textContent = steps.lines.slice(0, steps.shown + 1).join('\n');
      nextRow.hidden = steps.shown >= 3;
      nextStep.textContent = 'Next step (' + (steps.shown + 1) + ' of 3)';
    }

    // Clears the status line, the Verify flags and any showing hint.
    function clearResults() {
      hint = null;
      steps = null;
      nextRow.hidden = true;
      hatchedRings = null;
      keyText = '';
      unlink();
      status.textContent = '';
      status.className = '';
      // data-d is always set together with hint-confined / hint-removed, so [data-d] finds those cells too.
      table.querySelectorAll('.hint-target, .hint-area, .hint-digit, [data-d]').forEach(function (el) {
        el.classList.remove('hint-target', 'hint-area', 'hint-hatched', 'hint-digit', 'hint-confined', 'hint-removed');
        el.removeAttribute('data-d');
      });
      table.querySelectorAll('.conflict').forEach(function (el) {
        el.classList.remove('conflict');
        el.removeAttribute('aria-invalid');
      });
    }

    // The one place an input's aria-label is built: position, then notes, then ", clashes" while outlined.
    function relabel(inp) {
      var digits = noteDigits(+inp.dataset.notes || 0);
      inp.setAttribute('aria-label', inp.dataset.label + (digits.length ? ', notes ' + digits.join(' ') : '') +
        (inp.parentNode.classList.contains('clash') ? ', clashes' : ''));
    }

    // Outlines exactly the clashing cells of `grid` (live state: not touched by clearResults, Verify or Hint).
    function showClashes(grid) {
      var set = clashCells(grid);
      for (var q = 0; q < 81; q++) {
        var td = table.rows[Math.floor(q / 9)].cells[q % 9], inp = inputs[Math.floor(q / 9)][q % 9];
        td.classList.toggle('clash', set.indexOf(q) >= 0);
        if (inp) relabel(inp);
      }
    }

    // Single write path for a cell: keeps the remembered value, notes and
    // their display in sync. Only a changed value clears the Verify results and any hint
    // (and entering the hinted digit shows the reward instead).
    function setCell(inp, cell) {
      var changed = inp.value !== cell.value || (inp.dataset.prev || '') !== cell.value;
      var before = changed ? currentGrid() : null;
      // Judge a digit entered into a cell without a value, using the grid before the write.
      var credit = null;
      if (changed && !(inp.dataset.prev || '') && cell.value) {
        var pos = +inp.dataset.pos;
        credit = creditEntry(tally, credited, hint, before, Math.floor(pos / 9), pos % 9, cell.value);
      }
      inp.value = cell.value;
      inp.dataset.prev = cell.value;
      inp.dataset.notes = cell.notes;
      var digits = noteDigits(cell.notes);
      inp.parentNode.querySelectorAll('.notes span').forEach(function (s, i) {
        s.textContent = digits.indexOf(i + 1) < 0 ? '' : i + 1;
      });
      relabel(inp);
      if (changed) {
        clearResults();
        var after = currentGrid();
        showClashes(after);
        var fixed = fixedMessage(before, after);
        if (fixed) { status.textContent = fixed; status.className = ''; }
        if (credit) {
          tally = credit.tally;
          credited = credit.credited;
          showTally();
          // A reward is green; the "not counted" line keeps the neutral style.
          if (credit.text) { status.textContent = credit.text; status.className = statusClass(credit.kind); }
        }
        // A value change that leaves a digit: announce a filled grid (grid and tally are after the change).
        // (the cell.value guard is defensive: an empty cell leaves a 0 in the grid, so completionFor is null anyway)
        var done = cell.value ? completionFor(after, tally) : null;
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
      currentLevel = level;
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

    function cellAt(q) { return table.rows[Math.floor(q / 9)].cells[q % 9]; }

    // Focus on a hatched cell links its rings; focus on an entered ring selects it (its hatched cells are "ruled");
    // focus anywhere else (or out of the grid) undoes either.
    table.addEventListener('focusin', function (e) {
      var p = e.target.dataset ? +e.target.dataset.pos : -1;
      unlink();
      if (!hatchedRings) return;
      if (hatchedRings.rings.indexOf(p) >= 0) return selectRing(p);
      if (hatchedRings.hatched.indexOf(p) < 0) return;
      var link = ringLink(p, hatchedRings.rings, hatchedRings.d);
      link.partners.forEach(function (q) { cellAt(q).classList.add('hint-linked'); });
      showLink(link.text);
    });
    table.addEventListener('focusout', unlink);

    function selectRing(q) {
      var rule = ringRules(q, hatchedRings.hatched, hatchedRings.d);
      cellAt(q).classList.add('hint-linked');
      rule.cells.forEach(function (p) {
        cellAt(p).classList.add('hint-ruled');
        cellAt(p).setAttribute('data-d', hatchedRings.d);
      });
      showLink(rule.text);
    }

    // A click selects the ring under it (givens take no focus). It comes after the focusout of the cell that lost focus, so
    // it is the last word. A click outside the grid, or on a given that is no ring, ends the selection; a click on an
    // editable cell is left to focusin (unlinking here would undo a hatched cell's link).
    document.addEventListener('click', function (e) {
      var td = e.target.closest ? e.target.closest('#sudoku td') : null;
      var q = td ? td.parentNode.rowIndex * 9 + td.cellIndex : -1;
      if (!hatchedRings || (td && !td.classList.contains('given'))) return;
      unlink();
      if (hatchedRings.rings.indexOf(q) >= 0) selectRing(q);
    });

    // Shows the marks and key line of the hint for revealed step `stage` (1-3; 3 = all, as for every other hint): 1 = target,
    // area, confined; 2 = + removed; 3 = + hatching, rings and the link invitation. Adds only, so a later stage repeats the earlier.
    function showMarks(marks, stage) {
      marks.area.forEach(function (q) { cellAt(q).classList.add('hint-area'); });
      cellAt(marks.target).classList.add('hint-target');
      var staged = [['confined', marks.confined], ['removed', stage > 1 ? marks.removed : []]];
      staged.forEach(function (m) {
        m[1].forEach(function (q) {
          cellAt(q).classList.add('hint-' + m[0]);
          cellAt(q).setAttribute('data-d', hint.pointDigit);
        });
      });
      if (hint.kind === 'explain' && hint.technique !== 'naked') {
        keyText = hintKey(hint, marks.hatched.length, stage);
        unlink();
      }
      if (stage < 3) return;
      marks.hatched.forEach(function (q) { cellAt(q).classList.add('hint-hatched'); });
      marks.digits.forEach(function (q) { cellAt(q).classList.add('hint-digit'); });
      if (!marks.hatched.length) return;
      hatchedRings = { hatched: marks.hatched, rings: marks.digits, d: hint.pointDigit || hint.digit };
      unlink();
    }

    // Reveals the next step of a pointing explanation; the target cell takes focus when the last one shows.
    function revealStep() {
      steps.shown++;
      showSteps();
      showMarks(steps.marks, steps.shown);
      if (steps.shown >= 3) inputs[hint.r][hint.c].focus();
      showInvite();
    }
    nextStep.addEventListener('click', revealStep);

    // Hint: step 1 unless a hint is already showing, then step 2 (a pointing explanation: one step at a time).
    document.getElementById('hint').addEventListener('click', function () {
      if (steps) { // a pointing explanation is showing: reveal the next step, or leave it as it is once complete
        if (steps.shown < 3) revealStep();
        inputs[hint.r][hint.c].focus();
        return;
      }
      var res = hintFor(currentGrid(), hint ? 2 : 1, preferredTechnique(tally, currentLevel), currentLevel);
      clearResults();
      var pointingExplain = (res.technique === 'pointing' || res.technique === 'claiming') && res.kind === 'explain';
      status.textContent = res.text;
      status.className = pointingExplain ? 'steps' : '';
      if (pointingExplain) { steps = { lines: res.text.split('\n'), shown: 1, marks: null }; showSteps(); }
      if (res.kind !== 'nudge' && res.kind !== 'explain') return;
      hint = res;
      var marks = hintMarks(res, currentGrid());
      if (steps) steps.marks = marks;
      showMarks(marks, steps ? 1 : 3);
      inputs[res.r][res.c].focus();
      showInvite();
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

render();
