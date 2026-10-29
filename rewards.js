// Rewards: classifying and crediting entries, the tally and its definitions, the status class.
import { findConflicts } from './validation.js';
import { firstHolder, cellName, UNIT_NAMES, UNITS, CELL_UNITS, toFlat, usedMask, bitCount, spotsFor } from './board.js';
import { claimingSteps, pointingSteps, singleAfterStep } from './techniques.js';
import { namedClash } from './clashes.js';
import { sanitizeDigit } from './entry.js';
import { boxName, andList, struckCells, hintApplied } from './hints.js';

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

export { classifyEntry, emptyTally, creditEntry, statusClass, TECHNIQUE_DEFINITIONS, tallyLines };
