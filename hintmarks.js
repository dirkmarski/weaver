// Hint marks: the cells a hint marks, the key line, the ring and hatch links.
import { cellName, UNIT_NAMES, UNITS, CELL_UNITS } from './board.js';
import { aDigit } from './texts.js';

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

// The marks an own pointing or claiming step (a classifyEntry result with `form`, and `unit` in the hidden form) puts on the
// board after the entry at (r, c): flat indices { area, confined, removed, digit, key }. Area = the box, the line and the hidden-form
// unit (the entered cell included); removed = the cells of that unit that lose the digit, never the entered cell.
function rewardMarks(step, r, c) {
  var p = r * 9 + c, d = step.pointDigit, claiming = step.technique === 'claiming', area = [];
  var units = [step.box * 3 + 2, step.index * 3 + (step.line === 'row' ? 0 : 1)];
  if (step.form === 'hidden') units.push(CELL_UNITS[p][UNIT_NAMES.indexOf(step.unit)]);
  units.forEach(function (u) { UNITS[u].forEach(function (q) { if (area.indexOf(q) < 0) area.push(q); }); });
  var removed = step.removed.filter(function (q) { return q !== p && units.length > 2 && UNITS[units[2]].indexOf(q) >= 0; });
  return {
    area: area, confined: step.confined, removed: removed, digit: d,
    key: 'Key: amber = the box, rows and columns the message names; dashed purple = the only places for ' + d + ' in the '
      + (claiming ? step.line : 'box') + (removed.length ? '; struck grey ' + d + ' = this step rules ' + d + ' out there' : '') + '.'
  };
}

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
    return 'the ' + d + ' at ' + cellName(q) + ' is in the same ' + sharedUnits(p, q).join(' and ');
  });
  var text = 'Hatched cell ' + cellName(p) + ': no ' + d + ' here, because ' + parts.join(', and ') + '.';
  return { partners: partners, text: text };
}

// The reverse of ringLink, for the ring q holding d: { cells, text }. Cells are the hatched cells (`hatched`, ascending flat
// indices) that share a row, column or box with q, and text names each with the units it shares (row, column, box).
function ringRules(q, hatched, d) {
  var cells = hatched.filter(function (p) { return sharedUnits(p, q).length > 0; });
  var items = cells.map(function (p) { return cellName(p) + ' (same ' + sharedUnits(p, q).join(' and ') + ')'; });
  var last = items.length > 1 ? ' and ' + items.pop() : '';
  var count = items.length + (last ? 1 : 0);
  var text = 'The ' + d + ' at ' + cellName(q) + ' rules ' + d + ' out of ' + (['', 'one', 'two', 'three', 'four'][count] || count)
    + ' hatched cell' + (count > 1 ? 's' : '') + ': ' + items.join(', ') + last + '.';
  return { cells: cells, text: text };
}
function sharedUnits(p, q) { return UNIT_NAMES.filter(function (n, k) { return CELL_UNITS[q][k] === CELL_UNITS[p][k]; }); }

export { hintMarks, rewardMarks, hintKey, ringLink, ringRules };
